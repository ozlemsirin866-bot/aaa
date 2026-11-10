import React, { useState, useMemo, useEffect } from 'react';
import {
  Play,
  Plus,
  Flame,
  Droplet,
  Moon,
  Utensils,
  Pill,
  CheckCircle,
  Eye,
  Calendar,
  Zap,
  Activity,
  ArrowRight,
  Link2,
  Check,
  Sparkles,
  Lock,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { DailyNutrition, CheckInItem, Exercise, ZinciriKirmaData } from '../../types/fitness';
import { HOTLINK_IMAGE_URL } from '../../data/mockData';
import { ChainMapModal } from '../ChainMapModal';

interface DailyDashboardTabProps {
  nutrition: DailyNutrition;
  onUpdateNutrition: (updated: DailyNutrition) => void;
  checkIns: CheckInItem[];
  onToggleCheckIn: (id: string) => void;
  onStartWorkout: () => void;
  onOpenNutrition: () => void;
  onNavigateToNutrition?: () => void;
  onOpenExerciseGuide: () => void;
  onOpenFinishDayModal?: () => void;
  onNavigateToAnalytics?: () => void;
  athleteName?: string;
  zinciriKirma?: ZinciriKirmaData;
  onUpdateZinciriKirma?: (zk: ZinciriKirmaData) => void;
}

export const DailyDashboardTab: React.FC<DailyDashboardTabProps> = ({
  nutrition,
  onUpdateNutrition,
  checkIns,
  onToggleCheckIn,
  onStartWorkout,
  onOpenNutrition,
  onNavigateToNutrition,
  onOpenExerciseGuide,
  onOpenFinishDayModal,
  onNavigateToAnalytics,
  athleteName = 'Utku Can ER',
  zinciriKirma,
  onUpdateZinciriKirma,
}) => {
  const displayName = athleteName || 'Utku Can ER';
  const [isChainModalOpen, setIsChainModalOpen] = useState<boolean>(false);
  const [chainToast, setChainToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setChainToast(msg);
    setTimeout(() => setChainToast(null), 2500);
  };

  const now = new Date();
  const trDays = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const todayDayName = trDays[now.getDay()];
  const todayFormattedDate = now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const todayIso = now.toISOString().split('T')[0];
  const currentWeekDayIndex = (now.getDay() + 6) % 7; // Pazartesi = 0 ... Pazar = 6

  // Live real-time seconds clock
  const [liveClock, setLiveClock] = useState<string>(() => {
    return new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveClock(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-time Streak sanitization:
  // "14 gün diyor data yoksa 1e dönsün"
  const hasHistoryData = Boolean(
    zinciriKirma &&
    (
      (typeof zinciriKirma.totalDaysCompleted === 'number' && zinciriKirma.totalDaysCompleted > 0 && zinciriKirma.totalDaysCompleted !== 14 && zinciriKirma.totalDaysCompleted !== 34) ||
      Boolean(zinciriKirma.lastCompletedDate) ||
      (zinciriKirma.weeklyCalendar && zinciriKirma.weeklyCalendar.some((d) => d.completed))
    )
  );

  const rawStreak = zinciriKirma?.currentStreak ?? 1;
  const isOldDummyStreak = !hasHistoryData || rawStreak === 14 || rawStreak === 0;
  const currentStreak = isOldDummyStreak ? 1 : Math.max(1, rawStreak);
  const longestStreak = isOldDummyStreak ? 1 : Math.max(currentStreak, zinciriKirma?.longestStreak || 1);
  const totalDaysCompleted = isOldDummyStreak ? 0 : (zinciriKirma?.totalDaysCompleted || 0);

  const currentZinciriKirma: ZinciriKirmaData = {
    currentStreak,
    longestStreak,
    totalDaysCompleted,
    lastCompletedDate: isOldDummyStreak ? undefined : zinciriKirma?.lastCompletedDate,
    weeklyCalendar: zinciriKirma?.weeklyCalendar || [],
  };

  const isTodayLocked = currentZinciriKirma.lastCompletedDate === todayIso;

  const todaySchedule = currentZinciriKirma.weeklyCalendar?.find(
    (d) => d.dayName.toLowerCase() === todayDayName.toLowerCase()
  ) || {
    focusTitle: 'Hipertrofi & Yağ Yakımı Seansı',
    isRestDay: false,
    cardioMin: 20,
  };

  const handleToggleTodayChain = () => {
    if (!onUpdateZinciriKirma) return;
    if (isTodayLocked) {
      const updated: ZinciriKirmaData = {
        ...currentZinciriKirma,
        currentStreak: Math.max(1, currentStreak - 1),
        totalDaysCompleted: Math.max(0, totalDaysCompleted - 1),
        lastCompletedDate: undefined,
      };
      onUpdateZinciriKirma(updated);
      showToast('Bugünkü zincir kilidi açıldı.');
    } else {
      const newStreak = currentStreak + 1;
      const updated: ZinciriKirmaData = {
        ...currentZinciriKirma,
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, longestStreak),
        totalDaysCompleted: totalDaysCompleted + 1,
        lastCompletedDate: todayIso,
      };
      onUpdateZinciriKirma(updated);
      showToast(`🔥 TEBRİKLER! Zincir kırılmadı: ${newStreak}. gün başarıyla kilitlendi!`);
    }
  };
  const proteinPercent = Math.min(
    100,
    Math.round((nutrition.proteinGrams / nutrition.proteinTarget) * 100)
  );
  const remainingProtein = Math.max(0, nutrition.proteinTarget - nutrition.proteinGrams);
  const energyPercent = Math.min(
    100,
    Math.round((nutrition.energyKcal / nutrition.energyTarget) * 100)
  );
  const hydrationPercent = Math.min(
    100,
    Math.round((nutrition.hydrationLiters / nutrition.hydrationTarget) * 100)
  );

  const completedCheckIns = checkIns.filter((c) => c.completed).length;

  // Tahmini Yakılan Kalori Hesabı: Bazal Metabolizma (BMR ~ 1.850 kcal) + Antrenman (~ 420 kcal) + Tamamlanan Check-in / Aktivite
  const estimatedBurnedCalories = useMemo(() => {
    const baseBMR = 1850;
    const workoutBurn = 420;
    const activityBurn = Math.min(450, completedCheckIns * 90);
    return baseBMR + workoutBurn + activityBurn;
  }, [completedCheckIns]);

  const netCalorieBalance = Math.round(nutrition.energyKcal - estimatedBurnedCalories);

  const handleQuickAddWater = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = {
      ...nutrition,
      hydrationLiters: Number((nutrition.hydrationLiters + 0.25).toFixed(2)),
    };
    onUpdateNutrition(updated);
  };

  const handleQuickAddBottle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = {
      ...nutrition,
      hydrationLiters: Number((nutrition.hydrationLiters + 1.0).toFixed(2)),
    };
    onUpdateNutrition(updated);
  };

  return (
    <div className="space-y-4 pb-24 select-none">
      {/* Top Greeting & Focus Banner */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-white flex items-center space-x-1.5 tracking-tight">
            <span>Merhaba, {displayName}</span>
            <span className="text-[#FF5356]">⚡</span>
          </h2>
          <div className="px-2.5 py-1 rounded-full bg-[#1A1C24] border border-[#262936] flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF1E38] animate-pulse" />
            <span className="text-[10px] font-bold text-[#E3E2E8] tracking-wider uppercase">
              ODAK MODU
            </span>
          </div>
        </div>

        {/* Schedule Subtitle (Real-Time) */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#A0A5B5]">
          <span className="px-2 py-0.5 rounded bg-[#1F1F24] border border-[#262936] text-white font-bold flex items-center space-x-1.5 shadow-sm">
            <Calendar className="w-3 h-3 text-[#FF5356]" />
            <span>{todayDayName}</span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 pl-1 border-l border-[#262936]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {liveClock}
            </span>
          </span>
          <span className="font-semibold text-[#E3E2E8]">
            {todaySchedule.isRestDay ? 'Aktif Toparlanma & Dinlenme' : todaySchedule.focusTitle}
          </span>
          <span className="text-[10px] text-[#717688] font-mono hidden sm:inline">
            • {todayFormattedDate}
          </span>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={onStartWorkout}
          className="h-13 rounded-xl bg-[#FF1E38] hover:bg-[#FF334B] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-[#FF1E38]/20 transition-all active:scale-[0.98]"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Antrenmana Başla</span>
        </button>

        <button
          onClick={onOpenNutrition}
          className="h-13 rounded-xl bg-[#1F1F24] hover:bg-[#292A2E] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 border border-[#262936] transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 text-[#FF5356]" />
          <span>Besin / Protein</span>
        </button>
      </div>

      {/* Toast Notice */}
      {chainToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-[#FF1E38] text-white text-xs font-bold shadow-xl border border-white/20 animate-scaleIn flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>{chainToast}</span>
        </div>
      )}

      {/* ZİNCİRİ ASLA KIRMA (DON'T BREAK THE CHAIN) PROMINENT CARD */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1C1E26] via-[#14151B] to-[#121317] border-2 border-amber-500/40 p-4 shadow-xl space-y-3.5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider font-mono">
                GÜNLÜK DİSİPLİN PROTOKOLÜ
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
              <Link2 className="w-4 h-4 text-amber-400 stroke-[2.5px]" />
              <span>ZİNCİRİ ASLA KIRMA</span>
            </h3>
          </div>

          <div className="flex items-center space-x-1.5">
            <div className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-extrabold text-xs flex items-center space-x-1 shadow-sm">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              <span>{currentZinciriKirma.currentStreak} GÜN</span>
            </div>
            <button
              type="button"
              onClick={() => setIsChainModalOpen(true)}
              className="p-1.5 rounded-lg bg-[#1F1F24] hover:bg-[#292A2E] text-amber-300 hover:text-white border border-[#262936] text-[10px] font-bold flex items-center space-x-1 transition-colors"
              title="120 Günlük Zincir Haritası"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Harita</span>
            </button>
          </div>
        </div>

        {/* 7 Days Chain Links Display */}
        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between text-[11px] text-[#A0A5B5]">
            <span className="font-bold text-white uppercase text-[10px] tracking-wider">
              Bu Haftanın Zincir Halkaları:
            </span>
            <span className="font-mono text-[10px] text-amber-300">
              Hedef: 120 Gün (4 Ay)
            </span>
          </div>

          {/* Connected Rings */}
          <div className="grid grid-cols-7 gap-1 pt-1">
            {[
              { day: 'Pzt', idx: 0 },
              { day: 'Sal', idx: 1 },
              { day: 'Çar', idx: 2 },
              { day: 'Per', idx: 3 },
              { day: 'Cum', idx: 4 },
              { day: 'Cmt', idx: 5 },
              { day: 'Paz', idx: 6 },
            ].map((item) => {
              const isToday = item.idx === currentWeekDayIndex;
              const dayRecord = currentZinciriKirma.weeklyCalendar?.find((d) => d.dayIndex === item.idx);
              const isDone = isToday ? isTodayLocked : Boolean(dayRecord?.completed);
              return (
                <div
                  key={item.day}
                  className={`p-2 rounded-xl text-center border transition-all flex flex-col items-center justify-between relative ${
                    isDone
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm shadow-amber-500/20'
                      : isToday
                      ? 'bg-[#FF1E38]/20 border-[#FF1E38] text-white ring-1 ring-[#FF1E38]/50 animate-pulse'
                      : 'bg-[#121317] border-[#262936] text-[#5A6072]'
                  }`}
                >
                  <span className="text-[9px] font-bold uppercase font-mono block">
                    {item.day}
                  </span>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center my-1 transition-all ${
                      isDone
                        ? 'bg-amber-500 text-black font-extrabold shadow-sm'
                        : isToday
                        ? 'bg-[#FF1E38] text-white font-bold'
                        : 'bg-[#1F1F24] text-[#424656]'
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-3.5 h-3.5 stroke-[3.5px]" />
                    ) : isToday ? (
                      <Lock className="w-3 h-3 text-white" />
                    ) : (
                      <span className="text-[9px] font-mono">{item.idx + 1}</span>
                    )}
                  </div>

                  <span className="text-[8px] font-medium truncate max-w-full">
                    {isDone ? 'Kilitli' : isToday ? 'Bugün' : dayRecord?.isRestDay ? 'Mola' : 'Bekliyor'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 Core Daily Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          <div className="p-2 rounded-xl bg-[#121317] border border-[#262936] flex items-center space-x-2">
            <span className="text-base">🏋️‍♂️</span>
            <div className="min-w-0">
              <span className="text-[10px] text-[#A0A5B5] block font-bold">Antrenman</span>
              <span className="text-[11px] font-extrabold text-white truncate block">
                {todaySchedule.isRestDay ? 'Dinlenme Günü' : todaySchedule.focusTitle}
              </span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-[#121317] border border-[#262936] flex items-center space-x-2">
            <span className="text-base">🏃‍♂️</span>
            <div className="min-w-0">
              <span className="text-[10px] text-[#A0A5B5] block font-bold">Kardiyo</span>
              <span className="text-[11px] font-extrabold text-emerald-400 truncate block">
                {todaySchedule.cardioMin ? `${todaySchedule.cardioMin} dk Eğimli` : '20 dk Yürüyüş'}
              </span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-[#121317] border border-[#262936] flex items-center space-x-2">
            <span className="text-base">🥩</span>
            <div className="min-w-0">
              <span className="text-[10px] text-[#A0A5B5] block font-bold">Beslenme</span>
              <span className="text-[11px] font-extrabold text-[#FF5356] truncate block">{nutrition.proteinGrams}/{nutrition.proteinTarget}g P</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-[#121317] border border-[#262936] flex items-center space-x-2">
            <span className="text-base">💧</span>
            <div className="min-w-0">
              <span className="text-[10px] text-[#A0A5B5] block font-bold">Su ({nutrition.hydrationTarget}L)</span>
              <span className="text-[11px] font-extrabold text-blue-400 truncate block">{nutrition.hydrationLiters}/{nutrition.hydrationTarget} L</span>
            </div>
          </div>
        </div>

        {/* Lock Chain Action Button */}
        <div className="flex items-center space-x-2 pt-1">
          <button
            type="button"
            onClick={handleToggleTodayChain}
            className={`flex-1 h-11 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all active:scale-[0.98] shadow-md ${
              isTodayLocked
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-600/20 border border-emerald-400/40'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-[#FF1E38] hover:from-amber-400 hover:to-[#FF334B] text-white shadow-amber-500/25'
            }`}
          >
            {isTodayLocked ? (
              <>
                <Check className="w-4 h-4 stroke-[3px]" />
                <span>Bugünkü Zincir Kilitlendi! (Kırılmadı ✓)</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Bugünkü Halkayı Kilitle & Zinciri Kırma!</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsChainModalOpen(true)}
            className="h-11 px-3 rounded-xl bg-[#1F1F24] hover:bg-[#292A2E] text-white border border-[#262936] font-bold text-xs flex items-center space-x-1 shrink-0 transition-colors"
          >
            <span>120 Gün</span>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* ========================================================
          2. GÜNLÜK CHECK-İN (2. Sırada Kutucuk - Kullanıcı Talebi)
         ======================================================== */}
      <div className="rounded-2xl bg-[#1F1F24] border border-[#262936] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#FF1E38]" />
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
              2. GÜNLÜK CHECK-İN
            </h3>
          </div>
          <span className="text-[11px] font-bold text-[#A0A5B5] font-mono bg-[#14151B] px-2 py-0.5 rounded border border-[#262936]">
            {completedCheckIns} / {checkIns.length} Kayıt Tamam
          </span>
        </div>

        <div className="space-y-2">
          {checkIns.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() => onToggleCheckIn(item.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                  item.completed
                    ? 'bg-[#121317] border-[#262936]'
                    : 'bg-[#181920] border-[#FF1E38]/30 hover:border-[#FF1E38]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      item.completed
                        ? 'bg-[#1F1F24] border-[#262936] text-[#FF5356]'
                        : 'bg-[#292A2E] border-[#343439] text-white'
                    }`}
                  >
                    {item.type === 'sleep' && <Moon className="w-4 h-4" />}
                    {item.type === 'meal' && <Utensils className="w-4 h-4" />}
                    {item.type === 'supplement' && <Pill className="w-4 h-4" />}
                    {item.type === 'hydration' && <Droplet className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <p className="text-[11px] text-[#A0A5B5]">{item.subtitle}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-white font-mono block">
                    {item.metricBadge}
                  </span>
                  <span
                    className={`text-[10px] font-bold tracking-wider uppercase block mt-0.5 ${
                      item.completed ? 'text-[#FF5356]' : 'text-[#A0A5B5]'
                    }`}
                  >
                    {item.statusText || (item.completed ? 'Tamam' : 'Bekliyor')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          3. GÜNLÜK TÜKETİM & TELEMETRİ
          (Su Tüketimi, Alınan Kalori, Tahmini Yakılan Kalori, Alınan Protein vs.)
         ======================================================== */}
      <div className="rounded-2xl bg-[#1F1F24] border border-[#262936] p-4 shadow-sm space-y-3.5">
        <div
          onClick={onNavigateToNutrition}
          className="flex items-center justify-between cursor-pointer group hover:opacity-90 transition-opacity"
        >
          <div className="flex items-center space-x-2 text-xs font-bold tracking-wider uppercase text-white group-hover:text-[#FF5356] transition-colors">
            <span className="text-[#FF5356]">⦿</span>
            <span>GÜNLÜK TÜKETİM & KALORİ DENGESİ</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#A0A5B5] group-hover:text-[#FF5356] transition-colors" />
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
            {netCalorieBalance <= 0
              ? `${Math.abs(netCalorieBalance)} kcal Açık`
              : `+${netCalorieBalance} kcal Fazla`}
          </span>
        </div>

        {/* 4 Ana Metrik Grid (Su, Alınan Kalori, Yakılan Kalori, Protein) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* 1. SU TÜKETİMİ (HİDRASYON) */}
          <div className="p-3 rounded-xl bg-[#121317] border border-blue-500/30 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-blue-400 uppercase">
                <span className="flex items-center space-x-1">
                  <Droplet className="w-3.5 h-3.5 text-blue-400" />
                  <span>Su Tüketimi</span>
                </span>
                <span className="text-[10px] font-mono text-[#A0A5B5]">%{hydrationPercent}</span>
              </div>
              <div className="mt-1 flex items-baseline space-x-1">
                <span className="text-xl font-extrabold text-white font-mono tabular-nums">
                  {nutrition.hydrationLiters.toFixed(2)}L
                </span>
                <span className="text-[11px] text-[#A0A5B5] font-mono">
                  / {nutrition.hydrationTarget}L
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#292A2E] mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${hydrationPercent}%` }}
                />
              </div>
            </div>

            {/* Quick Drink Buttons: +250ml and +1L Şişe */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                type="button"
                onClick={handleQuickAddWater}
                title="+250ml Bardak Ekle"
                className="py-1 px-1.5 rounded-lg bg-[#1F1F24] hover:bg-[#292A2E] border border-[#262936] text-[10px] font-bold text-blue-300 hover:text-white flex items-center justify-center space-x-1 transition-all active:scale-95"
              >
                <span>+250ml</span>
              </button>
              <button
                type="button"
                onClick={handleQuickAddBottle}
                title="+1.000ml (1 Lt Şişe) Ekle"
                className="py-1 px-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 border border-blue-700/50 text-[10px] font-bold text-blue-200 flex items-center justify-center space-x-1 transition-all active:scale-95 shadow-sm"
              >
                <span>+1 Lt Şişe</span>
              </button>
            </div>
          </div>

          {/* 2. ALINAN KALORİ */}
          <div className="p-3 rounded-xl bg-[#121317] border border-amber-500/30 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 uppercase">
                <span className="flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Alınan Kalori</span>
                </span>
                <span className="text-[10px] font-mono text-[#A0A5B5]">%{energyPercent}</span>
              </div>
              <div className="mt-1 flex items-baseline space-x-1">
                <span className="text-xl font-extrabold text-white font-mono tabular-nums">
                  {Math.round(nutrition.energyKcal).toLocaleString('tr-TR')}
                </span>
                <span className="text-[11px] text-[#A0A5B5] font-mono">
                  / {nutrition.energyTarget.toLocaleString('tr-TR')} kcal
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#292A2E] mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${energyPercent}%` }}
                />
              </div>
            </div>
            <div className="text-[10px] text-[#A0A5B5] font-mono pt-1">
              Kalan: {Math.max(0, nutrition.energyTarget - Math.round(nutrition.energyKcal))} kcal
            </div>
          </div>

          {/* 3. TAHMİNİ YAKILAN KALORİ */}
          <div className="p-3 rounded-xl bg-[#121317] border border-orange-500/30 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-orange-400 uppercase">
                <span className="flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 text-orange-400" />
                  <span>Tahmini Yakılan</span>
                </span>
                <span className="text-[9px] px-1 rounded bg-orange-950/60 text-orange-300 font-mono">
                  BMR+Ant.
                </span>
              </div>
              <div className="mt-1 flex items-baseline space-x-1">
                <span className="text-xl font-extrabold text-white font-mono tabular-nums">
                  ~{estimatedBurnedCalories.toLocaleString('tr-TR')}
                </span>
                <span className="text-[11px] text-[#A0A5B5] font-mono">kcal</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#292A2E] mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                  style={{ width: '85%' }}
                />
              </div>
            </div>
            <div className="text-[10px] text-[#A0A5B5] font-mono pt-1">
              Bazal (1.850) + Egzersiz (~{estimatedBurnedCalories - 1850})
            </div>
          </div>

          {/* 4. ALINAN PROTEİN */}
          <div className="p-3 rounded-xl bg-[#121317] border border-[#FF1E38]/30 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-[#FF5356] uppercase">
                <span className="flex items-center space-x-1">
                  <span className="text-xs">🥩</span>
                  <span>Alınan Protein</span>
                </span>
                <span className="text-[10px] font-mono text-[#A0A5B5]">%{proteinPercent}</span>
              </div>
              <div className="mt-1 flex items-baseline space-x-1">
                <span className="text-xl font-extrabold text-white font-mono tabular-nums">
                  {Math.round(nutrition.proteinGrams)}
                </span>
                <span className="text-[11px] text-[#A0A5B5] font-mono">
                  / {nutrition.proteinTarget}g
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#292A2E] mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF1E38] to-[#FF5356] rounded-full transition-all duration-500"
                  style={{ width: `${proteinPercent}%` }}
                />
              </div>
            </div>
            <div className="text-[10px] text-[#A0A5B5] font-mono pt-1">
              Kalan: {remainingProtein}g
            </div>
          </div>
        </div>

        {/* Makro Detayları & Net Denge Özeti Barı */}
        <div className="p-2.5 rounded-xl bg-[#14151B] border border-[#262936] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
          <div className="flex items-center space-x-3 text-[#C5C9D8]">
            <span>🍞 Karb: <strong className="text-white">{typeof nutrition.carbsGrams === 'number' ? Math.round(nutrition.carbsGrams) : 0}g</strong></span>
            <span>🥑 Yağ: <strong className="text-white">{typeof nutrition.fatsGrams === 'number' ? Math.round(nutrition.fatsGrams) : 0}g</strong></span>
          </div>

          <button
            type="button"
            onClick={onNavigateToNutrition}
            className="text-[11px] font-bold text-[#FF5356] hover:underline flex items-center space-x-1"
          >
            <span>Öğün Detayları</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* GÜNÜ BİTİR & KALORİYİ ARŞİVLE KARTI */}
      {onOpenFinishDayModal && (
        <div className="rounded-2xl bg-gradient-to-r from-indigo-950/70 via-[#161724] to-purple-950/70 border border-indigo-500/40 p-3.5 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider font-mono">
                GÜNLÜK KALORİ KAPANIŞI
              </span>
              <h4 className="text-xs font-extrabold text-white">Günü Bitir & Verileri Kaydet</h4>
              <p className="text-[11px] text-[#A0A5B5]">
                {nutrition.energyKcal.toLocaleString('tr-TR')} kcal Analiz sekmesine arşivlenir.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            {onNavigateToAnalytics && (
              <button
                onClick={onNavigateToAnalytics}
                className="h-10 px-2.5 rounded-xl bg-[#1F1F24] hover:bg-[#292A2E] text-[#A0A5B5] hover:text-white text-xs font-bold border border-[#262936] transition-all flex items-center space-x-1"
                title="Analiz Sayfasına Git"
              >
                <span>Analiz</span>
              </button>
            )}

            <button
              onClick={onOpenFinishDayModal}
              className="h-10 px-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 active:scale-95 transition-all"
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Günü Bitir</span>
            </button>
          </div>
        </div>
      )}

      {/* Program Workout Card (Push A) */}
      <div className="rounded-2xl bg-[#1F1F24] border border-[#262936] p-4 shadow-sm space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-[#FF1E38] text-white text-[10px] font-extrabold tracking-wider uppercase">
              GÜN 2
            </span>
            <span className="text-xs font-bold text-[#A0A5B5] uppercase tracking-wider">
              HİPERTROFİ FAZI
            </span>
          </div>
          <span className="text-xs font-bold text-white font-mono bg-[#121317] px-2 py-0.5 rounded border border-[#262936]">
            ~55 DAKİKA
          </span>
        </div>

        <h3 className="text-xl font-extrabold text-white tracking-tight">
          İtme (Push A)
        </h3>

        {/* Athletic Gym Banner Image with Telemetry Overlay */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#262936] group">
          <img
            src={HOTLINK_IMAGE_URL}
            alt="Push workout banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E12] via-[#0D0E12]/50 to-transparent" />

          {/* Stats Bar Overlay */}
          <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-2 text-center text-white">
            <div className="bg-[#121317]/85 backdrop-blur-sm rounded-lg p-1.5 border border-[#262936]">
              <span className="text-[10px] text-[#A0A5B5] block uppercase font-bold">Egzersiz</span>
              <span className="text-xs font-extrabold text-white font-mono">5 Hareket</span>
            </div>
            <div className="bg-[#121317]/85 backdrop-blur-sm rounded-lg p-1.5 border border-[#262936]">
              <span className="text-[10px] text-[#A0A5B5] block uppercase font-bold">Toplam Set</span>
              <span className="text-xs font-extrabold text-white font-mono">16 Set</span>
            </div>
            <div className="bg-[#121317]/85 backdrop-blur-sm rounded-lg p-1.5 border border-[#262936]">
              <span className="text-[10px] text-[#A0A5B5] block uppercase font-bold">Dinlenme</span>
              <span className="text-xs font-extrabold text-[#FF5356] font-mono">90sn</span>
            </div>
          </div>
        </div>

        {/* Next Exercise Notice */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#121317] border border-[#262936]">
          <div className="min-w-0 pr-2">
            <span className="text-[10px] font-bold text-[#A0A5B5] uppercase block">
              Sıradaki Hareket
            </span>
            <p className="text-xs font-bold text-white truncate">
              Incline Dumbbell Press (4x8–10)
            </p>
          </div>
          <span className="px-2 py-1 rounded bg-[#292A2E] text-[10px] font-bold text-[#FF5356] font-mono shrink-0 border border-[#343439]">
            RPE 8.5
          </span>
        </div>

        {/* Card Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={onStartWorkout}
            className="h-11 rounded-xl bg-[#FF1E38] hover:bg-[#FF334B] text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-[#FF1E38]/20 transition-all active:scale-[0.98]"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Hemen Başla</span>
          </button>
          <button
            onClick={onOpenExerciseGuide}
            className="h-11 rounded-xl bg-[#292A2E] hover:bg-[#343439] text-white text-xs font-bold flex items-center justify-center space-x-1.5 border border-[#343439] transition-all active:scale-[0.98]"
          >
            <Eye className="w-4 h-4 text-[#FF5356]" />
            <span>Rehberi İncele</span>
          </button>
        </div>
      </div>

      {/* 120 Günlük Zincir Haritası Modalı */}
      <ChainMapModal
        isOpen={isChainModalOpen}
        onClose={() => setIsChainModalOpen(false)}
        zinciriKirma={currentZinciriKirma}
        athleteName={displayName}
      />
    </div>
  );
};
