
import React, { useState, useEffect } from 'react';

const Timer: React.FC = () => {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      const nextMode = !isBreak;
      setIsBreak(nextMode);
      setSeconds(nextMode ? 5 * 60 : 25 * 60);
      alert(nextMode ? "Time for a break!" : "Back to work!");
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, isBreak]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setSeconds(isBreak ? 5 * 60 : 25 * 60);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={`p-4 rounded-2xl shadow-xl border flex flex-col items-center gap-2 transition-all ${isBreak ? 'bg-green-600 border-green-500' : 'bg-red-600 border-red-500'} text-white`}>
      <span className="text-xs font-bold uppercase tracking-widest opacity-80">
        {isBreak ? '☕ Break' : '🔥 Focus'}
      </span>
      <div className="text-3xl font-black tabular-nums">{formatTime(seconds)}</div>
      <div className="flex gap-2">
        <button 
          onClick={toggleTimer}
          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
        >
          {isActive ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
        <button 
          onClick={resetTimer}
          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Timer;
