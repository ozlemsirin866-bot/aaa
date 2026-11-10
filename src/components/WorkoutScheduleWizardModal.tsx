import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Wand2,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
  Flame,
  Activity,
  Dumbbell,
  Search,
  Sparkles,
  X,
  Zap,
  Play,
  Save,
  Clock,
  Layers,
  HeartPulse,
} from 'lucide-react';
import { WeeklyScheduleDay, WizardExerciseItem, CardioSettings, Exercise } from '../types/fitness';
import { USER_MASTER_EXERCISES } from '../data/masterExercisesData';

interface WorkoutScheduleWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  weeklyCalendar: WeeklyScheduleDay[];
  onSaveDay: (updatedDay: WeeklyScheduleDay) => void;
  onApplyDayToWorkout?: (day: WeeklyScheduleDay) => void;
  onApplyPresetSchedule?: (presetKey: string) => void;
  initialDayIndex?: number;
}

const MUSCLE_GROUPS = [
  { id: 'TÜMÜ', label: 'TÜMÜ (96)', icon: '⭐' },
  { id: 'Göğüs', label: 'CHEST – GÖĞÜS (15)', icon: '⚡' },
  { id: 'Omuz', label: 'SHOULDER – OMUZ (19)', icon: '🛡️' },
  { id: 'Bacak', label: 'LEGS – BACAK (15)', icon: '🦵' },
  { id: 'Karın', label: 'ABDOMINAL – KARIN / BEL (13)', icon: '🎯' },
  { id: 'Sırt/Lat', label: 'BACK – SIRT / KANAT (10)', icon: '🦅' },
  { id: 'Biceps', label: 'BICEPS – PAZU / ÖN KOL (13)', icon: '🦾' },
  { id: 'Triceps', label: 'TRICEPS – ARKA KOL (11)', icon: '💪' },
];

export const WorkoutScheduleWizardModal: React.FC<WorkoutScheduleWizardModalProps> = ({
  isOpen,
  onClose,
  weeklyCalendar,
  onSaveDay,
  onApplyDayToWorkout,
  onApplyPresetSchedule,
  initialDayIndex = 0,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(initialDayIndex);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState<string>('TÜMÜ');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Current day being edited (cloned from weeklyCalendar)
  const currentDay = weeklyCalendar[selectedDayIndex] || weeklyCalendar[0];

  // Local state for the day's configuration
  const [dayFocusTitle, setDayFocusTitle] = useState<string>(currentDay?.focusTitle || '');
  const [isRestDay, setIsRestDay] = useState<boolean>(currentDay?.isRestDay || false);
  const [dayNotes, setDayNotes] = useState<string>(currentDay?.notes || '');
  const [exercises, setExercises] = useState<WizardExerciseItem[]>(() => {
    if (currentDay?.exercises && currentDay.exercises.length > 0) {
      return currentDay.exercises;
    }
    // Fallback: match 4 default movements from user master exercises
    const matched = USER_MASTER_EXERCISES.filter((ex) =>
      currentDay?.targetMuscleGroups?.some((g) => ex.anatomyRegion.toLowerCase().includes(g.toLowerCase()))
    ).slice(0, 4);

    return matched.map((ex, idx) => ({
      id: `wiz-ex-${idx}-${Date.now()}`,
      exerciseId: ex.id,
      exerciseName: ex.name,
      targetSets: 3,
      targetWeightKg: ex.equipment === 'Vücut Ağırlığı' ? 0 : 45,
      targetReps: 12,
      restSeconds: 90,
      intensityRpe: '8.5',
      targetMuscle: `${ex.category} • ${ex.targetMuscle}`,
      category: ex.category,
    }));
  });

  const [hasCardio, setHasCardio] = useState<boolean>(
    !!(currentDay?.cardio || (currentDay?.cardioMin && currentDay.cardioMin > 0))
  );

  const [cardioDuration, setCardioDuration] = useState<number>(
    currentDay?.cardio?.durationMinutes || currentDay?.cardioMin || 20
  );
  const [cardioIncline, setCardioIncline] = useState<number>(
    currentDay?.cardio?.inclinePercent || 12
  );
  const [cardioSpeed, setCardioSpeed] = useState<number>(
    currentDay?.cardio?.speedKmh || 5.0
  );

  // When switching days, sync local state
  const handleSelectDay = (idx: number) => {
    setSelectedDayIndex(idx);
    const day = weeklyCalendar[idx];
    if (day) {
      setDayFocusTitle(day.focusTitle);
      setIsRestDay(day.isRestDay);
      setDayNotes(day.notes || '');

      if (day.exercises && day.exercises.length > 0) {
        setExercises(day.exercises);
      } else {
        const matched = USER_MASTER_EXERCISES.filter((ex) =>
          day.targetMuscleGroups?.some((g) => ex.anatomyRegion.toLowerCase().includes(g.toLowerCase()))
        ).slice(0, 4);

        setExercises(
          matched.map((ex, mIdx) => ({
            id: `wiz-ex-${mIdx}-${Date.now()}`,
            exerciseId: ex.id,
            exerciseName: ex.name,
            targetSets: 3,
            targetWeightKg: ex.equipment === 'Vücut Ağırlığı' ? 0 : 45,
            targetReps: 12,
            restSeconds: 90,
            intensityRpe: '8.5',
            targetMuscle: `${ex.category} • ${ex.targetMuscle}`,
            category: ex.category,
          }))
        );
      }

      setHasCardio(!!(day.cardio || (day.cardioMin && day.cardioMin > 0)));
      setCardioDuration(day.cardio?.durationMinutes || day.cardioMin || 20);
      setCardioIncline(day.cardio?.inclinePercent || 12);
      setCardioSpeed(day.cardio?.speedKmh || 5.0);
    }
  };

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 2400);
  };

  // Add exercise from the 96 user master exercises
  const handleAddExercise = (masterEx: Exercise) => {
    const isAlready = exercises.some((e) => e.exerciseId === masterEx.id);
    if (isAlready) {
      showToast(`"${masterEx.name}" zaten günün listesinde bulunuyor.`);
      return;
    }

    const newItem: WizardExerciseItem = {
      id: `sched-item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      exerciseId: masterEx.id,
      exerciseName: masterEx.name,
      targetSets: 3,
      targetWeightKg: masterEx.equipment === 'Vücut Ağırlığı' ? 0 : 40,
      targetReps: 12, // 10/12/15 hipertrofi şablonu
      restSeconds: 90,
      intensityRpe: '8.5',
      targetMuscle: `${masterEx.category} • ${masterEx.targetMuscle}`,
      category: masterEx.category,
    };

    setExercises((prev) => [...prev, newItem]);
    showToast(`✓ "${masterEx.name}" günün listesine eklendi! (3 Set • 10/12/15)`);
  };

  // Remove exercise
  const handleRemoveExercise = (id: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== id));
  };

  // Update exercise properties (sets, reps, weight)
  const handleUpdateItem = (id: string, updates: Partial<WizardExerciseItem>) => {
    setExercises((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Move exercise up or down
  const handleMoveExercise = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= exercises.length) return;
    const newArr = [...exercises];
    const temp = newArr[idx];
    newArr[idx] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    setExercises(newArr);
  };

  // Apply 10/12/15 scheme to all exercises in day
  const handleApplyPyramidToAll = () => {
    setExercises((prev) =>
      prev.map((e) => ({
        ...e,
        targetSets: 3,
        targetReps: 12,
      }))
    );
    showToast('⚡ Tüm hareketlere 10/12/15 piramit şablonu uygulandı!');
  };

  // Filter master exercises for the picker
  const filteredMasterExercises = useMemo(() => {
    return USER_MASTER_EXERCISES.filter((ex) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ex.name.toLowerCase().includes(q) ||
        ex.targetMuscle.toLowerCase().includes(q) ||
        ex.equipment.toLowerCase().includes(q);

      const matchesRegion =
        selectedMuscleFilter === 'TÜMÜ' ||
        ex.anatomyRegion === selectedMuscleFilter ||
        (selectedMuscleFilter === 'Karın' &&
          (ex.anatomyRegion === 'Karın' || ex.anatomyRegion.includes('Bel'))) ||
        (selectedMuscleFilter === 'Sırt/Lat' && ex.anatomyRegion.includes('Sırt'));

      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, selectedMuscleFilter]);

  // Construct updated WeeklyScheduleDay object
  const buildCurrentDayObject = (): WeeklyScheduleDay => {
    const cardioObj: CardioSettings | undefined = hasCardio
      ? {
          id: `cardio-sched-${Date.now()}`,
          type: 'incline_walk',
          name: 'Eğimli Yürüyüş Bandı (Zone 2)',
          durationMinutes: cardioDuration,
          inclinePercent: cardioIncline,
          speedKmh: cardioSpeed,
          heartRateZone: `Zone 2 Yağ Yakımı (%${cardioIncline} Eğim • ${cardioSpeed.toFixed(1)} km/h)`,
          targetCalories: Math.round(cardioDuration * 10.5),
          completed: false,
        }
      : undefined;

    return {
      ...currentDay,
      dayIndex: selectedDayIndex,
      dayName: currentDay.dayName,
      focusTitle: dayFocusTitle.trim() || (isRestDay ? 'Dinlenme Günü' : 'Özel Antrenman'),
      isRestDay,
      notes: dayNotes.trim() || undefined,
      estimatedDurationMin: isRestDay ? 0 : Math.max(30, exercises.length * 10 + (hasCardio ? cardioDuration : 0)),
      cardioMin: hasCardio ? cardioDuration : 0,
      exercises: isRestDay ? [] : exercises,
      cardio: isRestDay ? undefined : cardioObj,
    };
  };

  // Save current day to weekly calendar
  const handleSaveCurrentDay = () => {
    const updated = buildCurrentDayObject();
    onSaveDay(updated);
    showToast(`💾 ${updated.dayName} için spor listesi takvime kaydedildi!`);
  };

  // Load this day directly into live workout session
  const handleLoadToLiveWorkout = () => {
    const updated = buildCurrentDayObject();
    onSaveDay(updated);
    if (onApplyDayToWorkout) {
      onApplyDayToWorkout(updated);
    }
    showToast(`⚡ ${updated.dayName}: "${updated.focusTitle}" canlı antrenmana yüklendi!`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl max-h-[96vh] flex flex-col bg-[#121317] border border-[#262936] sm:rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#181920] via-[#1C1824] to-[#181920] border-b border-[#262936] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF1E38] to-orange-600 flex items-center justify-center shadow-lg shadow-[#FF1E38]/25">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold text-[#FF5356] uppercase tracking-wider font-mono">
                  SPOR TAKVİMİ SİHİRBAZI & LİSTE AYARLAMA
                </span>
                <span className="px-2 py-0.5 rounded bg-[#292A2E] text-[10px] font-mono font-bold text-amber-400 border border-amber-500/20">
                  96 Hareketlik Kütüphane
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Haftalık Spor Takvimi & Günlük Liste Mimarı
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

        {/* 7 Days Selector Bar */}
        <div className="px-4 py-2.5 bg-[#181920] border-b border-[#262936] flex items-center space-x-1.5 overflow-x-auto shrink-0 no-scrollbar">
          {weeklyCalendar.map((d, idx) => {
            const isSelected = selectedDayIndex === idx;
            return (
              <button
                key={d.dayIndex}
                type="button"
                onClick={() => handleSelectDay(idx)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center space-x-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-[#FF1E38] text-white border-[#FF1E38] shadow-md shadow-[#FF1E38]/25'
                    : 'bg-[#121317] hover:bg-[#1D1E26] text-[#A0A5B5] hover:text-white border-[#262936]'
                }`}
              >
                <span>{d.dayName}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    d.isRestDay
                      ? 'bg-blue-500/20 text-blue-300'
                      : isSelected
                      ? 'bg-black/30 text-white'
                      : 'bg-[#262936] text-[#A0A5B5]'
                  }`}
                >
                  {d.isRestDay ? 'Mola' : `${(d.exercises?.length || 4)} Har.`}
                </span>
                {d.completed && <Check className="w-3 h-3 text-amber-300 stroke-[3px]" />}
              </button>
            );
          })}
        </div>

        {/* Quick Split Presets Bar */}
        {onApplyPresetSchedule && (
          <div className="px-4 py-2 bg-[#14151B] border-b border-[#262936] flex items-center justify-between gap-2 overflow-x-auto shrink-0">
            <span className="text-[10px] font-bold text-[#A0A5B5] uppercase shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Hızlı Takvim Şablonları:</span>
            </span>
            <div className="flex items-center space-x-1.5 shrink-0">
              {[
                { id: 'ppl', label: 'PPL (İtiş/Çekiş/Bacak)' },
                { id: 'upper_lower', label: 'Upper / Lower (4 Gün)' },
                { id: 'bro_split', label: 'Bro Split (5 Gün)' },
                { id: 'full_body', label: 'Full Body (3 Gün)' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onApplyPresetSchedule(p.id);
                    showToast(`✨ ${p.label} takvim şablonu uygulandı!`);
                  }}
                  className="px-2 py-1 rounded-lg bg-[#1F1F24] hover:bg-[#292A2E] text-[10px] font-bold text-[#A0A5B5] hover:text-white border border-[#262936] transition-colors shrink-0"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Day Configuration Banner */}
          <div className="rounded-2xl bg-[#181920] border border-[#262936] p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold text-white">
                  {currentDay?.dayName} Konfigürasyonu
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                    isRestDay
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-[#FF1E38]/20 text-[#FF5356] border border-[#FF1E38]/30'
                  }`}
                >
                  {isRestDay ? 'Dinlenme & Hidrasyon' : 'Aktif Spor Günü'}
                </span>
              </div>

              {/* Rest Day Switch Button */}
              <button
                type="button"
                onClick={() => setIsRestDay(!isRestDay)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center space-x-1.5 transition-all ${
                  isRestDay
                    ? 'bg-blue-600/30 text-blue-300 border-blue-500/50'
                    : 'bg-[#292A2E] text-[#A0A5B5] hover:text-white border-[#343439]'
                }`}
              >
                <span>{isRestDay ? '💤 Dinlenme Günü Olarak İşaretli' : '🏋️ Antrenman Günü Yap'}</span>
              </button>
            </div>

            {/* Inputs: Title & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div>
                <label className="text-[10px] font-bold text-[#A0A5B5] uppercase block mb-1">
                  Günün Odak Başlığı
                </label>
                <input
                  type="text"
                  value={dayFocusTitle}
                  onChange={(e) => setDayFocusTitle(e.target.value)}
                  placeholder="örn: Göğüs & Triceps (Push A) veya Bacak & Kalf"
                  className="w-full h-10 px-3 bg-[#121317] border border-[#262936] rounded-xl text-xs text-white placeholder-[#5A6072] focus:outline-none focus:border-[#FF1E38]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#A0A5B5] uppercase block mb-1">
                  Özel Not / Strateji
                </label>
                <input
                  type="text"
                  value={dayNotes}
                  onChange={(e) => setDayNotes(e.target.value)}
                  placeholder="örn: Bench press piramidi ve 20 dk %12 eğimli kardiyo"
                  className="w-full h-10 px-3 bg-[#121317] border border-[#262936] rounded-xl text-xs text-white placeholder-[#5A6072] focus:outline-none focus:border-[#FF1E38]"
                />
              </div>
            </div>
          </div>

          {!isRestDay ? (
            <>
              {/* Günün Ayarlanmış Egzersiz Listesi */}
              <div className="rounded-2xl bg-[#181920] border border-[#262936] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Dumbbell className="w-4 h-4 text-[#FF5356]" />
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                      Günün Egzersiz Listesi ({exercises.length} Hareket)
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyPyramidToAll}
                    className="px-2.5 py-1 rounded-lg bg-[#FF1E38]/20 hover:bg-[#FF1E38]/30 text-[#FF5356] border border-[#FF1E38]/30 text-[10px] font-bold flex items-center space-x-1 transition-colors"
                  >
                    <Zap className="w-3 h-3 fill-current" />
                    <span>Tümüne 10/12/15 Uygula</span>
                  </button>
                </div>

                {exercises.length === 0 ? (
                  <div className="p-6 rounded-xl bg-[#121317] border border-dashed border-[#262936] text-center space-y-2">
                    <p className="text-xs text-[#A0A5B5]">
                      Henüz bu gün için egzersiz eklenmedi.
                    </p>
                    <p className="text-[11px] text-[#71778E]">
                      Aşağıdaki 96 hareketlik listeden dilediğiniz hareketleri tek tıkla ekleyin.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {exercises.map((item, idx) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-[#121317] border border-[#262936] hover:border-[#383B47] transition-all space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center space-x-2 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-[#1F1F24] border border-[#262936] text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white truncate">
                                {item.exerciseName}
                              </h4>
                              <span className="text-[10px] text-[#A0A5B5] truncate block">
                                {item.targetMuscle}
                              </span>
                            </div>
                          </div>

                          {/* Move & Delete Actions */}
                          <div className="flex items-center space-x-1 shrink-0">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveExercise(idx, 'up')}
                              className="w-7 h-7 rounded-lg bg-[#1F1F24] text-[#A0A5B5] hover:text-white disabled:opacity-30 flex items-center justify-center border border-[#262936]"
                              title="Yukarı taşı"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === exercises.length - 1}
                              onClick={() => handleMoveExercise(idx, 'down')}
                              className="w-7 h-7 rounded-lg bg-[#1F1F24] text-[#A0A5B5] hover:text-white disabled:opacity-30 flex items-center justify-center border border-[#262936]"
                              title="Aşağı taşı"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveExercise(item.id)}
                              className="w-7 h-7 rounded-lg bg-red-950/40 text-red-400 hover:text-red-300 hover:bg-red-900/50 flex items-center justify-center border border-red-800/30"
                              title="Listeden çıkar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Controls: Sets, Weight, Reps Presets (10, 12, 15) */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-[#1C1E26]">
                          {/* Sets Stepper */}
                          <div className="flex items-center justify-between bg-[#181920] px-2 py-1 rounded-lg border border-[#262936]">
                            <span className="text-[10px] text-[#A0A5B5] uppercase font-bold">Set:</span>
                            <div className="flex items-center space-x-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateItem(item.id, {
                                    targetSets: Math.max(1, item.targetSets - 1),
                                  })
                                }
                                className="w-5 h-5 rounded bg-[#292A2E] text-white text-xs font-bold flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold text-white font-mono min-w-[20px] text-center">
                                {item.targetSets}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateItem(item.id, {
                                    targetSets: Math.min(8, item.targetSets + 1),
                                  })
                                }
                                className="w-5 h-5 rounded bg-[#292A2E] text-white text-xs font-bold flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Weight Stepper */}
                          <div className="flex items-center justify-between bg-[#181920] px-2 py-1 rounded-lg border border-[#262936]">
                            <span className="text-[10px] text-[#A0A5B5] uppercase font-bold">Hedef Kg:</span>
                            <div className="flex items-center space-x-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateItem(item.id, {
                                    targetWeightKg: Math.max(0, item.targetWeightKg - 2.5),
                                  })
                                }
                                className="w-5 h-5 rounded bg-[#292A2E] text-white text-xs font-bold flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold text-amber-400 font-mono min-w-[36px] text-center">
                                {item.targetWeightKg} kg
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateItem(item.id, {
                                    targetWeightKg: item.targetWeightKg + 2.5,
                                  })
                                }
                                className="w-5 h-5 rounded bg-[#292A2E] text-white text-xs font-bold flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Quick Reps Presets (10, 12, 15) */}
                          <div className="flex items-center justify-between bg-[#181920] px-2 py-1 rounded-lg border border-[#262936]">
                            <span className="text-[10px] text-[#A0A5B5] uppercase font-bold">Tekrar:</span>
                            <div className="flex items-center space-x-1">
                              {[10, 12, 15].map((reps) => (
                                <button
                                  key={reps}
                                  type="button"
                                  onClick={() => handleUpdateItem(item.id, { targetReps: reps })}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                                    item.targetReps === reps
                                      ? 'bg-amber-500 text-black shadow-sm'
                                      : 'bg-[#292A2E] text-[#A0A5B5] hover:text-white'
                                  }`}
                                >
                                  {reps}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 96 Hareketlik Kütüphaneden Listeye Ekleme Bölümü */}
              <div className="rounded-2xl bg-[#181920] border border-[#262936] p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                      96 Hareketlik Kütüphaneden Listeye Ekle
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#A0A5B5]">
                    {filteredMasterExercises.length} Hareket Listelendi
                  </span>
                </div>

                {/* Muscle Groups Filter Pills */}
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {MUSCLE_GROUPS.map((mg) => {
                    const isSelected = selectedMuscleFilter === mg.id;
                    return (
                      <button
                        key={mg.id}
                        type="button"
                        onClick={() => setSelectedMuscleFilter(mg.id)}
                        className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all border shrink-0 flex items-center space-x-1 ${
                          isSelected
                            ? 'bg-amber-500 text-black border-amber-500 shadow-sm'
                            : 'bg-[#121317] hover:bg-[#1D1E26] text-[#A0A5B5] hover:text-white border-[#262936]'
                        }`}
                      >
                        <span>{mg.icon}</span>
                        <span>{mg.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-[#71778E] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="96 hareket arasında ara (örn: bench, curl, squat, lat, press, row...)"
                    className="w-full h-10 pl-9 pr-3 bg-[#121317] border border-[#262936] rounded-xl text-xs text-white placeholder-[#71778E] focus:outline-none focus:border-amber-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#71778E] hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Movements Catalog Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                  {filteredMasterExercises.map((masterEx) => {
                    const isAdded = exercises.some((e) => e.exerciseId === masterEx.id);
                    return (
                      <div
                        key={masterEx.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                          isAdded
                            ? 'bg-emerald-950/20 border-emerald-500/40 text-white'
                            : 'bg-[#121317] border-[#262936] hover:border-[#383B47]'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <h5 className="text-xs font-bold text-white truncate">
                            {masterEx.name}
                          </h5>
                          <span className="text-[10px] text-[#A0A5B5] truncate block">
                            {masterEx.anatomyRegion} • {masterEx.equipment}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddExercise(masterEx)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-all flex items-center space-x-1 ${
                            isAdded
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-[#FF1E38] hover:bg-[#FF334B] text-white shadow-sm'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3 h-3 stroke-[3px]" />
                              <span>Listede</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>Ekle</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Eğimli Kardiyo Protokolü */}
              <div className="rounded-2xl bg-gradient-to-br from-[#181920] to-[#121317] border border-emerald-500/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                      Eğimli Kardiyo Protokolü (Zone 2)
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setHasCardio(!hasCardio)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                      hasCardio
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-[#292A2E] text-[#A0A5B5] border-[#343439]'
                    }`}
                  >
                    {hasCardio ? '✓ Kardiyo Aktif' : '+ Kardiyo Ekle'}
                  </button>
                </div>

                {hasCardio && (
                  <div className="space-y-3 pt-1 border-t border-[#262936]">
                    <div className="grid grid-cols-3 gap-2">
                      {/* SÜRE (10 / 20 / 30 dk) */}
                      <div className="p-2 rounded-xl bg-[#14151B] border border-[#262936] space-y-1">
                        <span className="text-[10px] text-[#A0A5B5] block uppercase font-bold">
                          Süre ({cardioDuration} dk)
                        </span>
                        <div className="flex items-center space-x-1">
                          {[10, 20, 30].map((mins) => (
                            <button
                              key={mins}
                              type="button"
                              onClick={() => setCardioDuration(mins)}
                              className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                                cardioDuration === mins
                                  ? 'bg-emerald-500 text-black shadow-sm'
                                  : 'bg-[#1F1F24] text-[#A0A5B5] hover:text-white'
                              }`}
                            >
                              {mins} dk
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* EĞİM (%8 / %12 / %15) */}
                      <div className="p-2 rounded-xl bg-[#14151B] border border-[#262936] space-y-1">
                        <span className="text-[10px] text-[#A0A5B5] block uppercase font-bold">
                          Eğim (%{cardioIncline})
                        </span>
                        <div className="flex items-center space-x-1">
                          {[8, 12, 15].map((inc) => (
                            <button
                              key={inc}
                              type="button"
                              onClick={() => setCardioIncline(inc)}
                              className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                                cardioIncline === inc
                                  ? 'bg-emerald-500 text-black shadow-sm'
                                  : 'bg-[#1F1F24] text-[#A0A5B5] hover:text-white'
                              }`}
                            >
                              %{inc}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* HIZ (4.5 / 5.0 / 5.5 km/h) */}
                      <div className="p-2 rounded-xl bg-[#14151B] border border-[#262936] space-y-1">
                        <span className="text-[10px] text-[#A0A5B5] block uppercase font-bold">
                          Hız ({cardioSpeed.toFixed(1)} km/h)
                        </span>
                        <div className="flex items-center space-x-1">
                          {[4.5, 5.0, 5.5].map((spd) => (
                            <button
                              key={spd}
                              type="button"
                              onClick={() => setCardioSpeed(spd)}
                              className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                                cardioSpeed === spd
                                  ? 'bg-emerald-500 text-black shadow-sm'
                                  : 'bg-[#1F1F24] text-[#A0A5B5] hover:text-white'
                              }`}
                            >
                              {spd}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold">
                        <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
                        Zone 2 Yağ Yakımı Hedefi: %{cardioIncline} Eğim • {cardioDuration} dk • {cardioSpeed.toFixed(1)} km/h
                      </span>
                      <span className="font-mono font-bold text-white">
                        ~{Math.round(cardioDuration * 10.5)} kcal
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Rest Day Info Card */
            <div className="p-6 rounded-2xl bg-[#181920] border border-blue-500/30 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-white">
                {currentDay?.dayName} Dinlenme & Toparlanma Günü
              </h3>
              <p className="text-xs text-[#A0A5B5] max-w-md mx-auto leading-relaxed">
                Kas liflerinizin süperkompanzasyon fazına geçmesi ve hipertrofi adaptasyonu için dinlenme esastır.{' '}
                <strong className="text-white">Günde 4.0 Litre su tüketimini</strong> ve protein hedefinizi koruyarak zinciri kırmayın.
              </p>
            </div>
          )}
        </div>

        {/* Floating Toast Notification */}
        {feedbackToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 animate-bounce">
            <div className="bg-[#1A1C24] border border-[#FF1E38] text-white px-4 py-2 rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-bold">
              <Check className="w-4 h-4 text-[#FF5356]" />
              <span>{feedbackToast}</span>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 bg-[#181920] border-t border-[#262936] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#292A2E] text-white text-xs font-bold hover:bg-[#343439] transition-colors"
          >
            Kapat
          </button>

          <div className="flex items-center space-x-2">
            {!isRestDay && (
              <button
                type="button"
                onClick={handleLoadToLiveWorkout}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-extrabold flex items-center space-x-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Canlı Antrenmana Aktar</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveCurrentDay}
              className="px-5 py-2.5 rounded-xl bg-[#FF1E38] hover:bg-[#FF334B] text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-[#FF1E38]/20 transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Değişiklikleri Kaydet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
