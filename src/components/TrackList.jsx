import React from 'react';
import { Play, Clock3, ChevronRight } from 'lucide-react';

const TrackList = ({ tracks, currentTrack, onTrackSelect, isPlaying }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            {tracks.map((track, index) => (
                <div
                    key={track.id}
                    onClick={() => onTrackSelect(track)}
                    className="glass-card"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '48px 1fr 120px 48px',
                        alignItems: 'center',
                        padding: '16px 20px',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        background: currentTrack?.id === track.id ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)'
                    }}
                >
                    <div style={{ color: currentTrack?.id === track.id ? '#D4AF37' : 'var(--text-muted)', fontSize: '14px', fontWeight: 'bold' }}>
                        {currentTrack?.id === track.id && isPlaying ? (
                            <div className="equalizer">
                                <span /> <span /> <span />
                            </div>
                        ) : String(index + 1).padStart(2, '0')}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{
                            color: currentTrack?.id === track.id ? '#D4AF37' : 'white',
                            fontWeight: '600',
                            fontSize: '16px'
                        }}>
                            {track.title}
                        </span>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{track.artist}</span>
                    </div>

                    <div style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'right' }}>
                        {track.duration}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', color: currentTrack?.id === track.id ? '#D4AF37' : 'var(--text-muted)' }}>
                        <ChevronRight size={20} />
                    </div>
                </div>
            ))}

            <style>{`
        .equalizer {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 12px;
        }
        .equalizer span {
          width: 2px;
          background: #D4AF37;
          animation: dance 0.6s infinite alternate;
        }
        .equalizer span:nth-child(2) { animation-delay: 0.2s; }
        .equalizer span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dance {
          from { height: 2px; }
          to { height: 12px; }
        }
      `}</style>
        </div>
    );
};

export default TrackList;
