import React, { useState } from 'react';
import {
  Moon,
  X,
  Flame,
  Droplet,
  Dumbbell,
  CheckCircle,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Award,
  RotateCcw,
} from 'lucide-react';
import { DailyNutrition, DailyHistoryRecord, WorkoutSession } from '../types/fitness';

interface FinishDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  nutrition: DailyNutrition;
  session?: WorkoutSession;
  athleteWeightKg?: number;
  onSaveDayToHistory: (record: DailyHistoryRecord, shouldResetDay: boolean) => void;
  onNavigateToAnalytics: () => void;
}

export const FinishDayModal: React.FC<FinishDayModalProps> = ({
  isOpen,
  onClose,
  nutrition,
  session,
  athleteWeightKg = 110,
  onSaveDayToHistory,
  onNavigateToAnalytics,
}) => {
  const [dayNote, setDayNote] = useState<string>('');
  const [weightInput, setWeightInput] = useState<number>(athleteWeightKg);
  const [resetCounters, setResetCounters] = useState<boolean>(true);
  const [isSavedSuccess, setIsSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const today = new Date();
  const dateStr = today.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const dayNameStr = today.toLocaleDateString('tr-TR', { weekday: 'long' });
  const isoDateStr = today.toISOString().split('T')[0];

  const calDiff = nutrition.energyKcal - nutrition.energyTarget;
  const isDeficit = calDiff < 0;
  const completedMealsCount = nutrition.meals.filter((m) => m.completed).length;

  const handleConfirmFinish = () => {
    // Determine workout stats if active session had progress
    const isWorkoutDone = session && session.exercises.some((e) => e.isFinished || e.sets.some((s) => s.isCompleted));
    const completedSets = session
      ? session.exercises.reduce(
          (acc, e) => acc + e.sets.filter((s) => s.isCompleted).length,
          0
        )
      : 0;

    const newRecord: DailyHistoryRecord = {
      id: `hist-${Date.now()}`,
      date: dateStr,
      isoDate: isoDateStr,
      dayName: dayNameStr,
      timestamp: Date.now(),
      energyKcal: Math.round(nutrition.energyKcal),
      energyTarget: nutrition.energyTarget,
      proteinGrams: Math.round(nutrition.proteinGrams),
      proteinTarget: nutrition.proteinTarget,
      carbsGrams: Math.round(nutrition.carbsGrams),
      carbsTarget: nutrition.carbsTarget,
      fatsGrams: Math.round(nutrition.fatsGrams),
      fatsTarget: nutrition.fatsTarget,
      hydrationLiters: Number(nutrition.hydrationLiters.toFixed(1)),
      hydrationTarget: nutrition.hydrationTarget,
      completedMealsCount: completedMealsCount,
      totalMealsCount: nutrition.meals.length,
      meals: [...nutrition.meals],
      workoutCompleted: !!isWorkoutDone,
      workoutTitle: isWorkoutDone ? session?.title : 'Dinlenme / Kardiyo Günü',
      workoutDurationMinutes: isWorkoutDone ? session?.durationMinutesEstimate || 45 : 0,
      totalSetsCompleted: completedSets,
      cardioMinutes: session?.cardio?.durationMinutes || (nutrition.energyKcal > 0 ? 15 : 0),
      cardioCalories: session?.cardio?.targetCalories || 0,
      weightKg: weightInput,
      notes: dayNote.trim() || undefined,
    };

    onSaveDayToHistory(newRecord, resetCounters);
    setIsSavedSuccess(true);
  };

  const handleFinishAndGoToAnalytics = () => {
    setIsSavedSuccess(false);
    onClose();
    onNavigateToAnalytics();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-md max-h-[92vh] flex flex-col bg-[#121317] border border-[#262936] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#181920] via-[#1A1824] to-[#181920] border-b border-[#262936] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/25">
              <Moon className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider font-mono">
                  GÜNÜ BİTİR & ARŞİVLE
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#292A2E] text-[9px] font-mono text-[#A0A5B5]">
                  {dayNameStr}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white">Günün Kalori & Beslenme Kapanışı</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#292A2E] text-[#A0A5B5] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!isSavedSuccess ? (
            <>
              {/* Date Card & Summary */}
              <div className="p-3.5 rounded-2xl bg-[#181920] border border-[#262936] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white">{dateStr}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    24 Saatlik Rapor
                  </span>
                </div>

                {/* Big Calorie Box */}
                <div className="p-3 rounded-xl bg-[#121317] border border-[#262936] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#A0A5B5] font-bold uppercase block">
                      Tüketilen Toplam Kalori
                    </span>
                    <div className="flex items-baseline space-x-1.5 mt-0.5">
                      <span className="text-2xl font-extrabold text-white font-mono">
                        {Math.round(nutrition.energyKcal).toLocaleString('tr-TR')}
                      </span>
                      <span className="text-xs text-[#A0A5B5] font-mono">
                        / {nutrition.energyTarget.toLocaleString('tr-TR')} kcal
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-mono font-bold ${
                        isDeficit
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {isDeficit ? (
                        <>
                          <TrendingDown className="w-3 h-3" />
                          <span>{Math.abs(calDiff)} kcal Açık</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-3 h-3" />
                          <span>+{calDiff} kcal Fazla</span>
                        </>
                      )}
                    </div>
                    <span className="text-[9px] text-[#A0A5B5] block mt-1">
                      {isDeficit ? 'Definasyon / Yağ Yakımı' : 'Hacim / Kalori Artışı'}
                    </span>
                  </div>
                </div>

                {/* 3 Macro Cards */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-[#121317] border border-[#262936]">
                    <span className="text-[9px] text-[#FF5356] font-bold block uppercase">PROTEİN</span>
                    <span className="text-sm font-extrabold text-white font-mono block mt-0.5">
                      {Math.round(nutrition.proteinGrams)}g
                    </span>
                    <span className="text-[9px] text-[#A0A5B5] block">
                      Hedef {nutrition.proteinTarget}g
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-[#121317] border border-[#262936]">
                    <span className="text-[9px] text-amber-400 font-bold block uppercase">KARB</span>
                    <span className="text-sm font-extrabold text-white font-mono block mt-0.5">
                      {Math.round(nutrition.carbsGrams)}g
                    </span>
                    <span className="text-[9px] text-[#A0A5B5] block">
                      Hedef {nutrition.carbsTarget}g
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-[#121317] border border-[#262936]">
                    <span className="text-[9px] text-indigo-400 font-bold block uppercase">YAĞ</span>
                    <span className="text-sm font-extrabold text-white font-mono block mt-0.5">
                      {Math.round(nutrition.fatsGrams)}g
                    </span>
                    <span className="text-[9px] text-[#A0A5B5] block">
                      Hedef {nutrition.fatsTarget}g
                    </span>
                  </div>
                </div>

                {/* Hydration & Meals status */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-[#121317] border border-[#262936] flex items-center space-x-2">
                    <Droplet className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-[9px] text-[#A0A5B5] block">İçilen Su</span>
                      <span className="font-mono font-bold text-white">
                        {nutrition.hydrationLiters.toFixed(1)} / {nutrition.hydrationTarget} L
                      </span>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-[#121317] border border-[#262936] flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[9px] text-[#A0A5B5] block">Yenen Öğün</span>
                      <span className="font-mono font-bold text-white">
                        {completedMealsCount} / {nutrition.meals.length} Öğün
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weight Input for the day */}
              <div className="p-3 rounded-2xl bg-[#181920] border border-[#262936] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Bugünkü Tartı (Opsiyonel)</span>
                  <span className="text-[10px] text-[#A0A5B5] block">Analiz sekmesinde kilo trendine işlenir</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setWeightInput((prev) => Math.max(40, Number((prev - 0.1).toFixed(1))))}
                    className="w-7 h-7 rounded-lg bg-[#292A2E] text-white font-bold text-xs flex items-center justify-center hover:bg-[#383B47]"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    step="0.1"
                    value={weightInput}
                    onChange={(e) => setWeightInput(parseFloat(e.target.value) || 0)}
                    className="w-16 h-7 bg-[#121317] border border-[#262936] rounded-lg text-center font-mono font-bold text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-xs text-[#A0A5B5] font-mono">kg</span>
                  <button
                    type="button"
                    onClick={() => setWeightInput((prev) => Number((prev + 0.1).toFixed(1)))}
                    className="w-7 h-7 rounded-lg bg-[#292A2E] text-white font-bold text-xs flex items-center justify-center hover:bg-[#383B47]"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Day Note Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white block">
                  Gün Sonu Notu (Enerji, Uyku, Antrenman Hissi):
                </label>
                <textarea
                  value={dayNote}
                  onChange={(e) => setDayNote(e.target.value)}
                  placeholder="Örn: Bugün enerjim çok yüksekti, göğüs antrenmanında iyi ağırlık bastım..."
                  className="w-full h-20 p-3 rounded-xl bg-[#181920] border border-[#262936] text-white text-xs placeholder-[#5A6072] focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              {/* Reset Counters Option */}
              <div
                onClick={() => setResetCounters(!resetCounters)}
                className="p-3 rounded-xl bg-[#181920] border border-[#262936] flex items-center justify-between cursor-pointer hover:border-[#383B47] transition-all"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#292A2E] flex items-center justify-center text-indigo-400">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Yeni Güne Hazırla</span>
                    <span className="text-[10px] text-[#A0A5B5] block">
                      Kayıttan sonra günlük beslenme sayaçlarını sıfırla
                    </span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                    resetCounters ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-[#383B47] bg-[#121317]'
                  }`}
                >
                  {resetCounters && <CheckCircle className="w-3.5 h-3.5" />}
                </div>
              </div>
            </>
          ) : (
            /* Celebration & Success View */
            <div className="py-6 space-y-4 text-center animate-fadeIn">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 animate-bounce">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-white">Gününüz Başarıyla Kaydedildi! 🎉</h4>
                <p className="text-xs text-[#A0A5B5] max-w-xs mx-auto">
                  <strong className="text-white">{dateStr}</strong> tarihli{' '}
                  <strong className="text-indigo-400">{Math.round(nutrition.energyKcal)} kcal</strong> ve makro verileriniz Analiz arşivine eklendi.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#181920] border border-emerald-500/30 text-left text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-white">Arşivlenen Metrikler:</span>
                  <span className="text-emerald-400 font-mono">Kayıt Başarılı</span>
                </div>
                <div className="text-[11px] text-[#A0A5B5] space-y-0.5">
                  <p>• Kalori: {Math.round(nutrition.energyKcal)} / {nutrition.energyTarget} kcal</p>
                  <p>• Protein: {Math.round(nutrition.proteinGrams)}g • Su: {nutrition.hydrationLiters.toFixed(1)}L</p>
                  <p>• Analiz sekmesinden geçmiş günlerle karşılaştırabilirsiniz.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#14151B] border-t border-[#262936] shrink-0">
          {!isSavedSuccess ? (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="h-11 px-4 rounded-xl bg-[#1F1F24] hover:bg-[#292A2E] text-[#A0A5B5] hover:text-white text-xs font-bold border border-[#262936] transition-all"
              >
                İptal
              </button>

              <button
                type="button"
                onClick={handleConfirmFinish}
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98]"
              >
                <Moon className="w-4 h-4" />
                <span>Günü Bitir & Kaloriyi Kaydet</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleFinishAndGoToAnalytics}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-[#FF1E38] to-[#FF5356] hover:from-[#FF334B] hover:to-[#FF1E38] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-[#FF1E38]/25 transition-all active:scale-[0.98]"
              >
                <span>Analiz Sekmesine Git</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSavedSuccess(false);
                  onClose();
                }}
                className="w-full h-9 rounded-xl bg-[#1F1F24] hover:bg-[#292A2E] text-[#A0A5B5] hover:text-white text-xs font-bold transition-all"
              >
                Kapat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
