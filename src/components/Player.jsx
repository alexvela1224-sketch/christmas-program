import React, { useState, useEffect } from 'react';
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
    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const clickedProgress = x / rect.width;
        onSeek(clickedProgress * duration);
    };

    const handleVolumeClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const newVolume = Math.max(0, Math.min(1, x / rect.width));
        onVolumeChange(newVolume);
    };

    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="glass-panel floating-player">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                {currentTrack && (
                    <img src={currentTrack.cover} style={{ width: '48px', height: '48px', borderRadius: '12px' }} />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                        {currentTrack?.title}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{currentTrack?.artist}</span>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 2 }}>
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

                <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', width: '32px', textAlign: 'right' }}>{formatTime(currentTime)}</span>
                    <div
                        onClick={handleSeek}
                        style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', position: 'relative', cursor: 'pointer' }}
                    >
                        <div style={{ width: `${progressPercent}%`, height: '100%', background: 'white', borderRadius: '2px' }} />
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', width: '32px' }}>{formatTime(duration)}</span>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', flex: 1, color: 'var(--text-muted)' }}>
                <Volume2 size={20} />
                <div
                    onClick={handleVolumeClick}
                    style={{ width: '80px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '8px', cursor: 'pointer' }}
                >
                    <div style={{ width: `${volume * 100}%`, height: '100%', background: 'white', borderRadius: '2px' }} />
                </div>
            </div>
        </div>
    );
};

export default Player;
