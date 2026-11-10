import React from 'react';
import {
  X,
  Flame,
  Check,
  Link2,
  Calendar,
  Sparkles,
  Trophy,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { ZinciriKirmaData } from '../types/fitness';

interface ChainMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  zinciriKirma: ZinciriKirmaData;
  athleteName?: string;
}

export const ChainMapModal: React.FC<ChainMapModalProps> = ({
  isOpen,
  onClose,
  zinciriKirma,
  athleteName = 'Utku Can ER',
}) => {
  if (!isOpen) return null;

  const TOTAL_DAYS = 112; // 16 hafta x 7 gün = 112 gün (4 Ay)
  const hasHistoryData = Boolean(
    zinciriKirma &&
    (
      (typeof zinciriKirma.totalDaysCompleted === 'number' && zinciriKirma.totalDaysCompleted > 0 && zinciriKirma.totalDaysCompleted !== 14 && zinciriKirma.totalDaysCompleted !== 34) ||
      Boolean(zinciriKirma.lastCompletedDate) ||
      (zinciriKirma.weeklyCalendar && zinciriKirma.weeklyCalendar.some((d) => d.completed))
    )
  );
  const rawStreak = zinciriKirma.currentStreak ?? 1;
  const isOldDummyStreak = !hasHistoryData || rawStreak === 14 || rawStreak === 0;
  const currentStreak = isOldDummyStreak ? 1 : Math.max(1, rawStreak);
  const completedDays = isOldDummyStreak ? 0 : (zinciriKirma.totalDaysCompleted || 0);
  const completionPercent = Math.min(100, Math.round((completedDays / TOTAL_DAYS) * 100));

  const weeks = Array.from({ length: 16 }, (_, wIdx) => {
    const weekNumber = wIdx + 1;
    let phaseName = '1. Ay: Adaptasyon & Form';
    let phaseColor = 'text-blue-400 border-blue-500/30';
    if (weekNumber >= 5 && weekNumber <= 8) {
      phaseName = '2. Ay: Ağırlık & Kondisyon';
      phaseColor = 'text-emerald-400 border-emerald-500/30';
    } else if (weekNumber >= 9 && weekNumber <= 12) {
      phaseName = '3. Ay: Progresif Yüklenme';
      phaseColor = 'text-amber-400 border-amber-500/30';
    } else if (weekNumber >= 13) {
      phaseName = '4. Ay: Yağ Yakımı Zirvesi';
      phaseColor = 'text-[#FF5356] border-[#FF5356]/30';
    }

    const days = Array.from({ length: 7 }, (_, dIdx) => {
      const overallDayIndex = wIdx * 7 + dIdx + 1;
      const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
      const isDone = overallDayIndex <= completedDays;
      const isToday = overallDayIndex === completedDays + 1;
      return {
        overallDayIndex,
        dayName: dayNames[dIdx],
        isDone,
        isToday,
      };
    });

    return {
      weekNumber,
      phaseName,
      phaseColor,
      days,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#121317] border border-[#262936] rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#181920] via-[#1A1824] to-[#181920] border-b border-[#262936] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-[#FF1E38] flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Link2 className="w-5 h-5 stroke-[2.5px]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  120 Günlük Zincir Haritası
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-extrabold uppercase">
                  ZİNCİRİ KIRMA
                </span>
              </div>
              <p className="text-xs text-[#A0A5B5] mt-0.5">
                {athleteName} • 4 Aylık Dönüşüm Yolculuğu
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1F1F24] hover:bg-[#292A2E] text-[#A0A5B5] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Summary Banner */}
        <div className="p-4 bg-[#14151B] border-b border-[#262936] grid grid-cols-3 gap-2 text-center shrink-0">
          <div className="p-2.5 rounded-xl bg-[#121317] border border-[#262936]">
            <span className="text-[10px] text-[#A0A5B5] uppercase font-bold block">Güncel Zincir</span>
            <span className="text-lg font-extrabold text-amber-400 font-mono flex items-center justify-center space-x-1 mt-0.5">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{currentStreak} Gün</span>
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#121317] border border-[#262936]">
            <span className="text-[10px] text-[#A0A5B5] uppercase font-bold block">Tamamlanan</span>
            <span className="text-lg font-extrabold text-white font-mono mt-0.5 block">
              {completedDays} / {TOTAL_DAYS} Gün
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#121317] border border-[#262936]">
            <span className="text-[10px] text-[#A0A5B5] uppercase font-bold block">İlerleme</span>
            <span className="text-lg font-extrabold text-[#FF5356] font-mono mt-0.5 block">
              %{completionPercent}
            </span>
          </div>
        </div>

        {/* Motivational Quote Banner */}
        <div className="px-4 py-2 bg-gradient-to-r from-amber-950/30 to-[#FF1E38]/10 border-b border-amber-500/20 flex items-center space-x-2 text-xs text-amber-200/90 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            <strong>Süreklilik Kuralı:</strong> Takvimdeki her güne kırmızı halkanı ekle. Tek görevin o zinciri asla koparmamak!
          </span>
        </div>

        {/* Scrollable Matrix of Weeks */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {weeks.map((week) => (
            <div
              key={week.weekNumber}
              className="p-3 rounded-xl bg-[#181920] border border-[#262936] space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-white font-mono flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FF5356]" />
                  <span>{week.weekNumber}. HAFTA</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${week.phaseColor}`}>
                  {week.phaseName}
                </span>
              </div>

              {/* 7 Days Chain Links */}
              <div className="grid grid-cols-7 gap-1.5 pt-1">
                {week.days.map((day) => (
                  <div
                    key={day.overallDayIndex}
                    className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-between relative ${
                      day.isDone
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 shadow-sm shadow-amber-500/10'
                        : day.isToday
                        ? 'bg-[#FF1E38]/20 border-[#FF1E38] text-white animate-pulse'
                        : 'bg-[#121317] border-[#262936] text-[#5A6072]'
                    }`}
                  >
                    <span className="text-[9px] font-bold uppercase font-mono block">
                      {day.dayName}
                    </span>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center my-1 transition-all ${
                        day.isDone
                          ? 'bg-amber-500 text-black font-extrabold'
                          : day.isToday
                          ? 'bg-[#FF1E38] text-white font-bold'
                          : 'bg-[#1F1F24] text-[#424656]'
                      }`}
                    >
                      {day.isDone ? (
                        <Check className="w-3.5 h-3.5 stroke-[3.5px]" />
                      ) : day.isToday ? (
                        <Flame className="w-3.5 h-3.5 fill-white" />
                      ) : (
                        <span className="text-[9px] font-mono">{day.overallDayIndex}</span>
                      )}
                    </div>

                    <span className="text-[8px] font-mono">
                      G{day.overallDayIndex}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#181920] border-t border-[#262936] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-xs text-[#A0A5B5]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Hedef: 110 kg &rarr; 85 kg Define Atlet</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#FF1E38] hover:bg-[#FF334B] text-white font-bold text-xs transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
