import React, { useState } from 'react';
import {
  Calendar,
  Utensils,
  Dumbbell,
  ShieldAlert,
  Flame,
  Check,
  Play,
  X,
  Sparkles,
  ChevronRight,
  Activity,
  Droplets,
  HeartPulse,
} from 'lucide-react';
import {
  FOUR_MONTH_WEEKS,
  BREAKFAST_OPTIONS,
  SNACK_OPTIONS,
  convertDayMenuToMealItems,
} from '../data/fourMonthNutritionPlan';
import {
  FOUR_MONTH_WEEKLY_WORKOUT_DAYS,
  EXCLUDED_EXERCISES_FOR_HERNIATED_DISC,
} from '../data/fourMonthFitnessPlan';
import { MealItem, CustomProgram, WizardExerciseItem } from '../types/fitness';

interface FourMonthProgramHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyMealsToNutrition: (meals: MealItem[], calories: number, protein: number) => void;
  onApplyWorkoutToLive: (program: CustomProgram) => void;
}

export const FourMonthProgramHubModal: React.FC<FourMonthProgramHubModalProps> = ({
  isOpen,
  onClose,
  onApplyMealsToNutrition,
  onApplyWorkoutToLive,
}) => {
  const [activeTab, setActiveTab] = useState<'fitness' | 'nutrition' | 'safety' | 'rotations'>('fitness');
  const [selectedFitnessDay, setSelectedFitnessDay] = useState<string>('Pazartesi');
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(0);
  const [selectedNutriDay, setSelectedNutriDay] = useState<string>('Pazartesi');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const fitnessPlan = FOUR_MONTH_WEEKLY_WORKOUT_DAYS[selectedFitnessDay];
  const currentWeek = FOUR_MONTH_WEEKS[selectedWeekIndex] || FOUR_MONTH_WEEKS[0];
  const nutriDayPlan = currentWeek.days[selectedNutriDay] || currentWeek.days['Pazartesi'];

  // Apply selected day's workout to live session
  const handleLoadWorkout = () => {
    if (fitnessPlan.isRestDay) {
      showToast('Pazar günü tam dinlenme günüdür. Ağırlık antrenmanı yoktur.');
      return;
    }

    const wizardExercises: WizardExerciseItem[] = fitnessPlan.exercises.map((ex, idx) => ({
      id: `4m-live-${fitnessPlan.dayName}-${idx}-${Date.now()}`,
      exerciseId: ex.exerciseId,
      exerciseName: ex.exerciseName,
      targetSets: 3,
      targetWeightKg: ex.defaultWeightKg,
      targetReps: 12,
      restSeconds: ex.category.includes('Bacak') ? 100 : 90,
      intensityRpe: '8.0',
      targetMuscle: `${ex.category} • ${ex.targetMuscle}`,
      category: ex.category,
    }));

    const customProg: CustomProgram = {
      id: `4m-prog-${fitnessPlan.dayName}-${Date.now()}`,
      name: `${fitnessPlan.dayName}: ${fitnessPlan.focusTitle}`,
      goal: '4 Aylık Hipertrofi & Yağ Kaybı (3×12)',
      splitDays: fitnessPlan.dayName,
      createdAt: new Date().toISOString(),
      exercises: wizardExercises,
      cardio: {
        id: `cardio-4m-${fitnessPlan.dayName}`,
        type: 'incline_walk',
        name: 'Eğimli Yürüyüş Bandı (Zone 2)',
        durationMinutes: fitnessPlan.cardioMinutes,
        inclinePercent: fitnessPlan.cardioIncline,
        speedKmh: fitnessPlan.cardioSpeed,
        heartRateZone: `Zone 2 Yağ Yakımı (Hız: 4.0–4.5 km/h • Eğim: %${fitnessPlan.cardioIncline})`,
        targetCalories: Math.round(fitnessPlan.cardioMinutes * 9.5),
        completed: false,
      },
    };

    onApplyWorkoutToLive(customProg);
    showToast(`⚡ ${fitnessPlan.dayName}: ${fitnessPlan.focusTitle} canlı seansa aktarıldı!`);
    onClose();
  };

  // Apply selected day's meals to active nutrition
  const handleLoadMeals = () => {
    const mealItems = convertDayMenuToMealItems(nutriDayPlan);
    onApplyMealsToNutrition(mealItems, nutriDayPlan.calories, nutriDayPlan.protein);
    showToast(`🥗 ${currentWeek.weekNumber}. Hafta ${nutriDayPlan.dayName} menüsü yüklendi! (1.750 kcal / 185g P)`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl max-h-[96vh] flex flex-col bg-[#121317] border border-[#262936] sm:rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#181920] via-[#1E1824] to-[#181920] border-b border-[#262936] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF1E38] to-amber-600 flex items-center justify-center shadow-lg shadow-[#FF1E38]/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold text-[#FF5356] uppercase tracking-wider font-mono">
                  RESMİ PROTOKOL
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  1.700–1.800 kcal • 185g Protein • 3×12
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                4 Aylık Fitness & Beslenme Ana Planı
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#292A2E] text-[#A0A5B5] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 py-2 bg-[#181920] border-b border-[#262936] flex items-center space-x-2 overflow-x-auto shrink-0 no-scrollbar">
          {[
            { id: 'fitness', label: '🏋️ 4 Aylık Fitness Programı', desc: '7 Günlük Rutin (3×12)' },
            { id: 'nutrition', label: '🥗 4 Aylık Beslenme Düzeni', desc: '16 Hafta • 4 Öğün' },
            { id: 'rotations', label: '🍳 Kahvaltı & Ara Öğün Rotasyonu', desc: '4 Kahvaltı / 4 Ara Öğün' },
            { id: 'safety', label: '🛡️ Bel Fıtığı & Yasaklı Hareketler', desc: 'Omurga Koruma' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 flex items-center space-x-1.5 ${
                activeTab === t.id
                  ? 'bg-[#FF1E38] text-white border-[#FF1E38] shadow-md shadow-[#FF1E38]/25'
                  : 'bg-[#121317] hover:bg-[#1D1E26] text-[#A0A5B5] hover:text-white border-[#262936]'
              }`}
            >
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: FITNESS PROGRAMI */}
          {activeTab === 'fitness' && (
            <div className="space-y-4">
              {/* Day Selector */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
                {Object.keys(FOUR_MONTH_WEEKLY_WORKOUT_DAYS).map((dName) => {
                  const d = FOUR_MONTH_WEEKLY_WORKOUT_DAYS[dName];
                  const isSel = selectedFitnessDay === dName;
                  return (
                    <button
                      key={dName}
                      type="button"
                      onClick={() => setSelectedFitnessDay(dName)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                        isSel
                          ? 'bg-amber-500 text-black border-amber-500 shadow-sm'
                          : 'bg-[#181920] text-[#A0A5B5] hover:text-white border-[#262936]'
                      }`}
                    >
                      <span>{dName}</span>
                      <span className="block text-[9px] opacity-80 font-mono">
                        {d.isRestDay ? 'Mola' : `${d.exercises.length} Hareket`}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Day Header Summary */}
              <div className="rounded-2xl bg-[#181920] border border-[#262936] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-black text-white uppercase">{fitnessPlan.dayName}</span>
                    <span className="text-xs text-amber-400 font-bold">• {fitnessPlan.focusTitle}</span>
                  </div>
                  <p className="text-xs text-[#A0A5B5]">{fitnessPlan.notes}</p>
                </div>

                {!fitnessPlan.isRestDay && (
                  <button
                    type="button"
                    onClick={handleLoadWorkout}
                    className="px-4 py-2 rounded-xl bg-[#FF1E38] hover:bg-[#FF334B] text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-[#FF1E38]/25 active:scale-95 shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Bu Antrenmanı Canlıya Yükle</span>
                  </button>
                )}
              </div>

              {/* Exercises List (3 x 12 Standardı) */}
              {!fitnessPlan.isRestDay ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-extrabold text-[#A0A5B5] uppercase tracking-wider">
                      Egzersizler (3 × 12 Tekrar Form Standardı)
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">
                      Ağırlık Artışı: 12 Tekrar Rahat Tamamlandığında
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {fitnessPlan.exercises.map((ex, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#181920] border border-[#262936] space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                            <span className="w-5 h-5 rounded bg-[#292A2E] text-amber-400 text-[10px] font-mono font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span>{ex.exerciseName}</span>
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#121317] border border-[#262936] text-[10px] font-mono text-amber-400 font-bold">
                            3 × 12
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-[#A0A5B5] pl-6">
                          <span>{ex.targetMuscle}</span>
                          <span className="font-mono text-white font-bold">{ex.defaultWeightKg} kg</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cardio Protocol Card */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-[#181920] border border-emerald-500/40 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Eğimli Kardiyo (Treadmill Zone 2)</h4>
                        <p className="text-[10px] text-emerald-300">
                          {fitnessPlan.cardioMinutes} dk • Eğim: %{fitnessPlan.cardioIncline} • Hız: {fitnessPlan.cardioSpeed} km/h (Piramit: 5dk %8 → 10dk %12 → 10dk %15 → 5dk %8)
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      ~{Math.round(fitnessPlan.cardioMinutes * 9.5)} kcal
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-[#181920] border border-blue-500/30 text-center space-y-2">
                  <h3 className="text-base font-bold text-white">Pazar: Tam Dinlenme Günü</h3>
                  <p className="text-xs text-[#A0A5B5] max-w-md mx-auto">
                    Ağırlık antrenmanı yoktur. Günde 4.0 Litre su tüketimine devam edin. İsteğe bağlı 30–45 dk rahat tempo toparlanma yürüyüşü yapabilirsiniz.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 4 AYLIK BESLENME DÜZENİ */}
          {activeTab === 'nutrition' && (
            <div className="space-y-4">
              {/* Week Selector */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#A0A5B5] uppercase">Hafta Seçimi:</span>
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {FOUR_MONTH_WEEKS.slice(0, 8).map((w, idx) => (
                    <button
                      key={w.weekNumber}
                      type="button"
                      onClick={() => setSelectedWeekIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                        selectedWeekIndex === idx
                          ? 'bg-[#FF1E38] text-white border-[#FF1E38] shadow-md'
                          : 'bg-[#181920] text-[#A0A5B5] hover:text-white border-[#262936]'
                      }`}
                    >
                      {w.weekNumber}. Hafta
                    </button>
                  ))}
                </div>
              </div>

              {/* Day Selector */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
                {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedNutriDay(d)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border shrink-0 ${
                      selectedNutriDay === d
                        ? 'bg-amber-500 text-black border-amber-500'
                        : 'bg-[#181920] text-[#A0A5B5] border-[#262936]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Macro Bar & Apply Button */}
              <div className="rounded-2xl bg-[#181920] border border-[#262936] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-[10px] text-[#A0A5B5] block uppercase font-bold">Kalori</span>
                    <span className="text-base font-black text-amber-400 font-mono">
                      ~{nutriDayPlan.calories} kcal
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#A0A5B5] block uppercase font-bold">Protein</span>
                    <span className="text-base font-black text-emerald-400 font-mono">
                      ~{nutriDayPlan.protein}g
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#A0A5B5] block uppercase font-bold">Su Hedefi</span>
                    <span className="text-base font-black text-blue-400 font-mono">4.0 Litre</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLoadMeals}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-600/25 active:scale-95 shrink-0"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Bu Günün Menüsünü Uygula</span>
                </button>
              </div>

              {/* 4 Meals Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#181920] border border-[#262936] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">🍳 08:00 — Kahvaltı</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">~38g Protein</span>
                  </div>
                  <p className="text-xs text-[#A0A5B5] leading-relaxed">{nutriDayPlan.breakfast}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#181920] border border-[#262936] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">🍗 13:00 — Öğle Yemeği</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">~60g Protein</span>
                  </div>
                  <p className="text-xs text-[#A0A5B5] leading-relaxed">{nutriDayPlan.lunch}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#181920] border border-[#262936] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">🍌 16:30 — Ara Öğün</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">~26g Protein</span>
                  </div>
                  <p className="text-xs text-[#A0A5B5] leading-relaxed">{nutriDayPlan.snack}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#181920] border border-[#262936] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">🥩 19:00 — Akşam Yemeği</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">~61g Protein</span>
                  </div>
                  <p className="text-xs text-[#A0A5B5] leading-relaxed">{nutriDayPlan.dinner}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ROTASYONLAR & PİŞİRME */}
          {activeTab === 'rotations' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                  4 Kahvaltı Rotasyonu (Her gün biri seçilebilir)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BREAKFAST_OPTIONS.map((k) => (
                    <div key={k.id} className="p-3 rounded-xl bg-[#181920] border border-[#262936] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{k.title}</span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">{k.protein}g P • {k.calories} kcal</span>
                      </div>
                      <p className="text-xs text-[#A0A5B5]">{k.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                  4 Ara Öğün Rotasyonu
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SNACK_OPTIONS.map((a) => (
                    <div key={a.id} className="p-3 rounded-xl bg-[#181920] border border-[#262936] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{a.title}</span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">{a.protein}g P • {a.calories} kcal</span>
                      </div>
                      <p className="text-xs text-[#A0A5B5]">{a.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#181920] border border-[#262936] space-y-1.5 text-xs text-[#A0A5B5]">
                <strong className="text-white block">🔥 Pişirme Kuralları:</strong>
                <p>• Tavuk: Izgara, Airfryer, Fırın veya yapışmaz tavada.</p>
                <p>• Kıyma: Az yağlı, fırın veya yapışmaz tavada.</p>
                <p>• Patates: Haşlama, fırın, airfryer.</p>
                <p>• Makarna: Haşlama, krema kullanılmayacak.</p>
                <p>• Soslar: Domates, yoğurt, sarımsak, kekik, karabiber, pul biber serbest.</p>
              </div>
            </div>
          )}

          {/* TAB 4: BEL FITIĞI & YASAKLI HAREKETLER */}
          {activeTab === 'safety' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/40 space-y-2">
                <div className="flex items-center space-x-2 text-red-400 font-extrabold text-xs uppercase">
                  <ShieldAlert className="w-4 h-4" />
                  <span>4 Ay Boyunca Kesinlikle Kullanılmayacak Egzersizler</span>
                </div>
                <p className="text-xs text-red-200/90 leading-relaxed">
                  Acemi seviye ve bel fıtığı riskini sıfıra indirmek amacıyla omurgaya aksiyel kompresyon (dikey yük) bindiren hareketler programdan tamamen çıkarılmıştır:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-2">
                  {EXCLUDED_EXERCISES_FOR_HERNIATED_DISC.map((exName, i) => (
                    <div
                      key={i}
                      className="px-2 py-1.5 rounded-lg bg-[#141215] border border-red-900/50 text-[10px] font-mono text-red-300 flex items-center space-x-1.5"
                    >
                      <span className="text-red-500 font-bold">✕</span>
                      <span className="truncate">{exName}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#181920] border border-emerald-500/30 space-y-1.5 text-xs text-[#A0A5B5]">
                <strong className="text-emerald-400 block font-bold">
                  ✓ Neden Leg Press & Destekli Makineler?
                </strong>
                <p>
                  Serbest Squat ve Deadlift bel omurlarına yüzlerce kilo baskı bindirirken; Leg Press, Leg Extension ve Lying Leg Curl sırtınızı sehpaya tam destekleyerek omurgayı korur, bacak hipertrofisini maksimum mekanik gerilimle sağlar.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Floating Toast */}
        {toastMsg && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 animate-bounce">
            <div className="bg-[#1A1C24] border border-[#FF1E38] text-white px-4 py-2 rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-bold">
              <Check className="w-4 h-4 text-[#FF5356]" />
              <span>{toastMsg}</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-[#181920] border-t border-[#262936] flex items-center justify-between shrink-0">
          <span className="text-[10px] text-[#A0A5B5] font-mono">
            4 Aylık Avalanche Master Planı • Utku Can ER
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#292A2E] hover:bg-[#343439] text-white text-xs font-bold transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
