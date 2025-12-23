import React, { useState, useRef, useEffect } from 'react';
import TrackList from './components/TrackList';
import Player from './components/Player';
import { tracks } from './data/tracks';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Star, Share2, Play, Pause } from 'lucide-react';

function App() {
  const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef(new Audio(tracks[0].url));

  useEffect(() => {
    const audio = audioRef.current;

    // Set initial volume
    audio.volume = volume;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => handleNext();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(e => console.log("Playback failed:", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  const handleTrackSelect = (track) => {
    if (currentTrack.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      audioRef.current.pause();
      audioRef.current.src = track.url;
      audioRef.current.load();
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    handleTrackSelect(tracks[nextIndex]);
  };

  const handlePrev = () => {
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
      const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
      handleTrackSelect(tracks[prevIndex]);
    }
  };

  const handleSeek = (newTime) => {
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (newVolume) => {
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  return (
    <div className="root-container">
      <div className="bg-gradient" />

      {/* Snowfall simulation */}
      <div className="snow-container">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -20, x: Math.random() * window.innerWidth, opacity: 0 }}
            animate={{
              y: window.innerHeight + 20,
              x: (Math.random() - 0.5) * 100 + (Math.random() * window.innerWidth),
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
            style={{
              position: 'fixed',
              width: '4px',
              height: '4px',
              background: 'white',
              borderRadius: '50%',
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      <main className="app-wrapper">
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Music size={20} color="#D4AF37" />
            </div>
            <span style={{ fontWeight: '800', fontSize: '18px', letterSpacing: '1px' }}>JOYFUL NOTES</span>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="glass-panel" style={{ padding: '10px', borderRadius: '12px' }}><Star size={20} /></button>
            <button className="glass-panel" style={{ padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', border: '1px solid #D4AF37', color: '#D4AF37' }}>Donate</button>
          </div>
        </nav>

        <section className="hero-section">
          <div className="album-art-wrapper">
            <div className="album-art-glow" />
            <motion.img
              key={currentTrack.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={currentTrack.cover}
              className="album-art-main"
            />
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ textAlign: 'center' }}
          >
            <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '8px' }}>Christmas Program 2025</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '600px', margin: '0 auto 32px auto' }}>
              A collection of heartfelt performances and mastered recordings from our annual Christmas celebration.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  padding: '16px 40px',
                  borderRadius: '30px',
                  backgroundColor: '#D4AF37',
                  color: 'black',
                  fontWeight: '800',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" />}
                {isPlaying ? 'PAUSE' : 'PLAY ALL'}
              </button>
              <button className="glass-panel" style={{ padding: '16px 32px', borderRadius: '30px', fontWeight: 'bold' }}>
                <Share2 size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                SHARE
              </button>
            </div>
          </motion.div>
        </section>

        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Program Tracks</h2>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>3 Songs</span>
          </div>
          <TrackList
            tracks={tracks}
            currentTrack={currentTrack}
            onTrackSelect={handleTrackSelect}
            isPlaying={isPlaying}
          />
        </section>
      </main>

      <Player
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onNext={handleNext}
        onPrev={handlePrev}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
      />
    </div>
  );
}

export default App;
