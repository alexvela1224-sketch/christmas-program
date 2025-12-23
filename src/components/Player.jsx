import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from 'lucide-react';

const Player = ({
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    onTogglePlay,
    onNext,
    onPrev,
    onSeek,
    onVolumeChange
}) => {
    const [isDraggingProgress, setIsDraggingProgress] = useState(false);
    const [isDraggingVolume, setIsDraggingVolume] = useState(false);
    const progressBarRef = useRef(null);
    const volumeBarRef = useRef(null);

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const calculateProgress = (clientX, rect) => {
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        return x / rect.width;
    };

    const handleProgressMove = (e) => {
        if (!isDraggingProgress || !progressBarRef.current) return;
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const progress = calculateProgress(clientX, progressBarRef.current.getBoundingClientRect());
        onSeek(progress * duration);
    };

    const handleVolumeMove = (e) => {
        if (!isDraggingVolume || !volumeBarRef.current) return;
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const progress = calculateProgress(clientX, volumeBarRef.current.getBoundingClientRect());
        onVolumeChange(Math.max(0, Math.min(1, progress)));
    };

    useEffect(() => {
        const handleUp = () => {
            setIsDraggingProgress(false);
            setIsDraggingVolume(false);
        };

        if (isDraggingProgress || isDraggingVolume) {
            window.addEventListener('mousemove', isDraggingProgress ? handleProgressMove : handleVolumeMove);
            window.addEventListener('mouseup', handleUp);
            window.addEventListener('touchmove', isDraggingProgress ? handleProgressMove : handleVolumeMove);
            window.addEventListener('touchend', handleUp);
        }

        return () => {
            window.removeEventListener('mousemove', isDraggingProgress ? handleProgressMove : handleVolumeMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchmove', isDraggingProgress ? handleProgressMove : handleVolumeMove);
            window.removeEventListener('touchend', handleUp);
        };
    }, [isDraggingProgress, isDraggingVolume, duration]);

    const handleProgressClick = (e) => {
        const rect = progressBarRef.current.getBoundingClientRect();
        const progress = calculateProgress(e.clientX, rect);
        onSeek(progress * duration);
        setIsDraggingProgress(true);
    };

    const handleVolumeClick = (e) => {
        const rect = volumeBarRef.current.getBoundingClientRect();
        const progress = calculateProgress(e.clientX, rect);
        onVolumeChange(progress);
        setIsDraggingVolume(true);
    };

    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="glass-panel floating-player">
            <div className="player-info" style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                {currentTrack && (
                    <img src={currentTrack.cover} style={{ width: '48px', height: '48px', borderRadius: '12px' }} />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span className="player-title" style={{ fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                        {currentTrack?.title}
                    </span>
                    <span className="player-artist" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{currentTrack?.artist}</span>
                </div>
            </div>

            <div className="player-controls-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <button style={{ color: 'var(--text-muted)' }}><Shuffle size={18} /></button>
                    <button style={{ color: 'white' }} onClick={onPrev}><SkipBack size={22} fill="white" /></button>
                    <button
                        onClick={onTogglePlay}
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: 'white',
                            color: 'black',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {isPlaying ? <Pause size={22} fill="black" /> : <Play size={22} fill="black" style={{ marginLeft: '2px' }} />}
                    </button>
                    <button style={{ color: 'white' }} onClick={onNext}><SkipForward size={22} fill="white" /></button>
                    <button style={{ color: 'var(--text-muted)' }}><Repeat size={18} /></button>
                </div>

                <div className="progress-container" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', width: '32px', textAlign: 'right' }}>{formatTime(currentTime)}</span>
                    <div
                        ref={progressBarRef}
                        onMouseDown={handleProgressClick}
                        onTouchStart={(e) => {
                            const rect = progressBarRef.current.getBoundingClientRect();
                            const progress = calculateProgress(e.touches[0].clientX, rect);
                            onSeek(progress * duration);
                            setIsDraggingProgress(true);
                        }}
                        style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', position: 'relative', cursor: 'pointer' }}
                    >
                        <div style={{ width: `${progressPercent}%`, height: '100%', background: 'white', borderRadius: '2px' }} />
                        <div style={{
                            position: 'absolute',
                            left: `${progressPercent}%`,
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '12px',
                            height: '12px',
                            background: 'white',
                            borderRadius: '50%',
                            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                            display: isDraggingProgress ? 'block' : 'none'
                        }} />
                    </div>
                    <span className="player-duration" style={{ fontSize: '11px', color: 'var(--text-muted)', width: '34px' }}>{formatTime(duration)}</span>
                </div>
            </div>

            <div className="volume-control" style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', flex: 1, color: 'var(--text-muted)' }}>
                <Volume2 size={20} />
                <div
                    ref={volumeBarRef}
                    onMouseDown={handleVolumeClick}
                    onTouchStart={(e) => {
                        const rect = volumeBarRef.current.getBoundingClientRect();
                        const progress = calculateProgress(e.touches[0].clientX, rect);
                        onVolumeChange(progress);
                        setIsDraggingVolume(true);
                    }}
                    style={{ width: '80px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '8px', cursor: 'pointer', position: 'relative' }}
                >
                    <div style={{ width: `${volume * 100}%`, height: '100%', background: 'white', borderRadius: '2px' }} />
                    <div style={{
                        position: 'absolute',
                        left: `${volume * 100}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '12px',
                        height: '12px',
                        background: 'white',
                        borderRadius: '50%',
                        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                        display: isDraggingVolume ? 'block' : 'none'
                    }} />
                </div>
            </div>
        </div>
    );
};

export default Player;
