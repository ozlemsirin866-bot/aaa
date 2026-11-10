import React, { useState, useEffect } from 'react';
import { Timer, X, Play, Pause, Plus, BellRing } from 'lucide-react';

interface RestTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSeconds?: number;
  exerciseName?: string;
  nextSetInfo?: string;
}

export const RestTimerModal: React.FC<RestTimerModalProps> = ({
  isOpen,
  onClose,
  defaultSeconds = 90,
  exerciseName = 'Barbell Bench Press',
  nextSetInfo = 'Set 2: 85 kg x 8 tekrar',
}) => {
  const [timeLeft, setTimeLeft] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [totalSeconds, setTotalSeconds] = useState(defaultSeconds);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(defaultSeconds);
      setTotalSeconds(defaultSeconds);
      setIsRunning(true);
    }
  }, [isOpen, defaultSeconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isOpen && isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isOpen) {
      // Timer finished chime vibration/audio effect
      try {
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
      } catch (e) {
        // ignore
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, isRunning, timeLeft]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 100;

  const handleAdd30 = () => {
    setTimeLeft((prev) => prev + 30);
    setTotalSeconds((prev) => prev + 30);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-[#1A1C24] border border-[#262936] rounded-2xl p-6 shadow-2xl text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[#292A2E] text-[#A0A5B5] hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-center space-x-2 text-[#FF5356] mb-1">
          <Timer className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Set Arası Dinlenme</span>
        </div>
        <h3 className="text-lg font-bold text-white truncate px-6">{exerciseName}</h3>
        <p className="text-xs text-[#A0A5B5] mt-0.5">{nextSetInfo}</p>

        {/* Circular Countdown Display */}
        <div className="relative w-44 h-44 mx-auto my-6 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="88"
              cy="88"
              r="76"
              stroke="#262936"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="88"
              cy="88"
              r="76"
              stroke="#FF1E38"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray="477.5"
              strokeDashoffset={477.5 - (477.5 * progressPercent) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-white font-mono tracking-tighter tabular-nums">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-[11px] font-bold text-[#A0A5B5] uppercase tracking-wider mt-1">
              {timeLeft > 0 ? (isRunning ? 'Dinleniyor' : 'Duraklatıldı') : 'Süre Doldu!'}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="h-11 rounded-xl bg-[#292A2E] hover:bg-[#343439] text-white text-xs font-bold flex items-center justify-center space-x-2 border border-[#343439] transition-all"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 text-[#FF5356]" />
                <span>Duraklat</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-[#FF5356]" />
                <span>Devam Et</span>
              </>
            )}
          </button>
          <button
            onClick={handleAdd30}
            className="h-11 rounded-xl bg-[#292A2E] hover:bg-[#343439] text-white text-xs font-bold flex items-center justify-center space-x-2 border border-[#343439] transition-all"
          >
            <Plus className="w-4 h-4 text-[#FF5356]" />
            <span>+30 Saniye</span>
          </button>
        </div>

        {/* Primary Finish / Skip */}
        <button
          onClick={onClose}
          className="w-full h-12 rounded-xl bg-[#FF1E38] hover:bg-[#FF334B] text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-[#FF1E38]/20 transition-all active:scale-[0.99]"
        >
          <BellRing className="w-4 h-4" />
          <span>Dinlenmeyi Bitir ve Sete Başla</span>
        </button>
      </div>
    </div>
  );
};
