import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Check,
  X as CloseIcon,
  ChevronDown,
  ChevronUp,
  Plus,
  TrendingUp,
  Video,
  BookOpen,
  AlertTriangle,
  Flame,
  Award,
  Sparkles,
  Activity,
  Trash2,
  Calendar,
  Clock,
  Dumbbell,
  Layers,
  History,
  Save,
  CheckCircle2,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  BarChart2,
  Repeat,
  FilePlus,
  Lock,
  Compass,
  Target,
  Zap,
  Shield,
} from 'lucide-react';
import {
  WorkoutSession,
  Exercise,
  WorkoutExercise,
  WorkoutSet,
  CompletedWorkoutRecord,
  CustomProgram,
  CardioSettings,
} from '../../types/fitness';
import { EXERCISES_DATA } from '../../data/mockData';
import {
  FOUR_MONTH_WEEKLY_WORKOUT_DAYS,
  EXCLUDED_EXERCISES_FOR_HERNIATED_DISC,
} from '../../data/fourMonthFitnessPlan';
import { BiomechanicDiagram } from '../BiomechanicDiagram';
import { getComprehensiveExerciseTips } from '../../utils/exerciseTips';

interface HoldCheckButtonProps {
  isCompleted: boolean;
  onComplete: () => void;
  onReset: () => void;
}

const HoldCheckButton: React.FC<HoldCheckButtonProps> = ({
  isCompleted,
  onComplete,
  onReset,
}) => {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const startTimestampRef = React.useRef<number>(0);
  const animationFrameRef = React.useRef<any>(null);

  const HOLD_DURATION_MS = 1000; // 1 saniye basılı tutma

  const startHold = (e: React.MouseEvent | React.TouchEvent) => {
    if (isCompleted) return;
    setHolding(true);
    setProgress(0);
    startTimestampRef.current = Date.now();

    const update = () => {
      const elapsed = Date.now() - startTimestampRef.current;
      const pct = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100);
      setProgress(pct);

      if (elapsed >= HOLD_DURATION_MS) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([40, 30, 40]);
        }
        setHolding(false);
        setProgress(0);
        onComplete();
      } else {
        animationFrameRef.current = requestAnimationFrame(update);
      }
    };

    animationFrameRef.current = requestAnimationFrame(update);
  };

  const endHold = () => {
    if (!isCompleted && holding) {
      setHolding(false);
      setProgress(0);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  if (isCompleted) {
    return (
      <button
        type="button"
        onClick={onReset}
        title="Tamamlandı! Geri almak için dokunun"
        className="h-8 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1 shadow-md shadow-emerald-600/30 transition-all active:scale-95 border border-emerald-400/40 shrink-0 group relative"
      >
        <Check className="w-4 h-4 stroke-[3.5px] text-white" />
        <span className="text-[11px] font-mono">Bitti</span>
      </button>
    );
  }

  return (
    <div className="relative select-none shrink-0">
      <button
        type="button"
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        onTouchCancel={endHold}
        title="Tamamlamak için 1 saniye basılı tutun"
        className={`h-8 px-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all relative overflow-hidden active:scale-95 border ${
          holding
            ? 'bg-[#181920] border-emerald-500 text-emerald-400 scale-105 shadow-md shadow-emerald-500/20'
            : 'bg-[#1F1F24] hover:bg-[#292A2E] border-[#383B47] text-[#A0A5B5] hover:text-white'
        }`}
      >
        {/* Progress fill */}
        {holding && (
          <div
            className="absolute inset-0 bg-emerald-500/35 pointer-events-none transition-none"
            style={{ width: `${progress}%` }}
          />
        )}

        <Check
          className={`w-3.5 h-3.5 stroke-[3px] transition-transform ${
            holding ? 'scale-125 text-emerald-400' : 'text-[#8A90A2]'
          }`}
        />
        <span className="text-[11px] font-mono relative z-10">
          {holding ? `${Math.round((progress / 100) * 10) / 10}s` : '1s Tut'}
        </span>
      </button>

      {holding && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-black/95 text-[9px] font-mono text-emerald-400 font-bold whitespace-nowrap pointer-events-none border border-emerald-500/40 z-30 shadow-lg animate-pulse">
          1 SN BASILI TUTUN
        </span>
      )}
    </div>
  );
};

interface WorkoutLiveTabProps {
  session: WorkoutSession;
  onUpdateSession: (updated: WorkoutSession) => void;
  onOpenExerciseDetail: (exerciseId: string) => void;
  onOpenRestTimer: (exerciseName: string, nextSetInfo: string) => void;
  workoutHistory?: CompletedWorkoutRecord[];
  onCompleteWorkout?: (record: CompletedWorkoutRecord) => void;
  onDeleteWorkoutHistory?: (id: string) => void;
  customPrograms?: CustomProgram[];
  onApplyProgramToWorkout?: (program: CustomProgram, dayIndex?: number) => void;
  athleteWeightKg?: number;
}

export const WorkoutLiveTab: React.FC<WorkoutLiveTabProps> = ({
  session,
  onUpdateSession,
  onOpenExerciseDetail,
  onOpenRestTimer,
  workoutHistory = [],
  onCompleteWorkout,
  onDeleteWorkoutHistory,
  customPrograms = [],
  onApplyProgramToWorkout,
  athleteWeightKg = 110,
}) => {
  // Navigation inside Workout Tab: 'live' | 'roadmap' | 'programs' | 'history'
  const [activeSubTab, setActiveSubTab] = useState<'live' | 'roadmap' | 'programs' | 'history'>('live');

  // Live workout stopwatch
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('avalanche_workout_timer');
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [expandedGuides, setExpandedGuides] = useState<Record<string, boolean>>({});
  const [showFinishModal, setShowFinishModal] = useState<boolean>(false);
  const [finishNotes, setFinishNotes] = useState<string>('');
  const [toastNotice, setToastNotice] = useState<string | null>(null);
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState<boolean>(false);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

  // History filtering & search
  const [historySearchQuery, setHistorySearchQuery] = useState<string>('');
  const [historyFilterType, setHistoryFilterType] = useState<string>('all');

  // Add Exercise Catalog Modal filters
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [catalogMuscleFilter, setCatalogMuscleFilter] = useState<string>('all');

  // Manual Workout Entry Modal
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [manualTitle, setManualTitle] = useState<string>('Özel Antrenman Seansı');
  const [manualDate, setManualDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [manualDuration, setManualDuration] = useState<string>('50');
  const [manualSets, setManualSets] = useState<string>('16');
  const [manualVolume, setManualVolume] = useState<string>('8500');
  const [manualNotes, setManualNotes] = useState<string>('');

  // Live Cardio Timer State
  const [isCardioRunning, setIsCardioRunning] = useState<boolean>(false);
  const [cardioElapsedSec, setCardioElapsedSec] = useState<number>(0);

  // 4-Month Workout Roadmap State
  const [roadmapPhase, setRoadmapPhase] = useState<number>(1);
  const [roadmapSelectedDay, setRoadmapSelectedDay] = useState<string>(() => {
    const dayMap = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    return dayMap[new Date().getDay()] || 'Pazartesi';
  });

  const handleLoadRoadmapDayToSession = (dayName: string) => {
    const plan = FOUR_MONTH_WEEKLY_WORKOUT_DAYS[dayName];
    if (!plan || plan.isRestDay) {
      setToastNotice('Pazar günü tam dinlenme ve toparlanma günüdür.');
      return;
    }
    const exercises: WorkoutExercise[] = plan.exercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      currentSetIndex: 0,
      restSeconds: ex.category.includes('Bacak') ? 100 : 90,
      isFinished: false,
      sets: Array.from({ length: ex.sets }, (_, i) => ({
        id: `set-${ex.exerciseId}-${i + 1}-${Date.now()}`,
        setNumber: i + 1,
        targetWeight: ex.defaultWeightKg,
        targetReps: ex.reps,
        isCompleted: false,
      })),
    }));

    const cardioSetting: CardioSettings = {
      id: `cardio-${dayName}-${Date.now()}`,
      type: 'incline_walk',
      name: 'Eğimli Yürüyüş Bandı (Zone 2)',
      durationMinutes: plan.cardioMinutes,
      inclinePercent: plan.cardioIncline,
      speedKmh: plan.cardioSpeed,
      heartRateZone: `Zone 2 Yağ Yakımı (%${plan.cardioIncline} Eğim • ${plan.cardioSpeed} km/h)`,
      targetCalories: Math.round(plan.cardioMinutes * 10),
      completed: false,
    };

    const newSession: WorkoutSession = {
      id: `session-roadmap-${dayName}-${Date.now()}`,
      title: `${dayName}: ${plan.focusTitle}`,
      dayLabel: dayName,
      durationMinutesEstimate: plan.exercises.length * 8 + plan.cardioMinutes,
      exercisesCount: plan.exercises.length,
      totalSets: plan.exercises.length * 3,
      restSecondsDefault: 90,
      nextExercisePreview: plan.exercises[0]?.exerciseName || '',
      nextRpe: '8.0',
      exercises,
      cardio: cardioSetting,
    };

    onUpdateSession(newSession);
    setActiveSubTab('live');
    setToastNotice(`🏋️ "${dayName}: ${plan.focusTitle}" antrenmanı canlı seansa yüklendi!`);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isCardioRunning) {
      interval = setInterval(() => {
        setCardioElapsedSec((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCardioRunning]);

  // Sync timer to localStorage
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          try {
            localStorage.setItem('avalanche_workout_timer', String(next));
          } catch {}
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 2500);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Helper to lookup exercise info
  const getExerciseMeta = (exerciseId: string): Partial<Exercise> => {
    const found = EXERCISES_DATA.find((e) => e.id === exerciseId);
    if (found) return found;
    const fallbackName = exerciseId
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return {
      id: exerciseId,
      name: fallbackName,
      category: 'İtiş (Push)',
      equipment: 'Dambıl',
      targetMuscle: 'Hedef Kas Grubu',
    };
  };

  const getDiagramType = (id: string): 'bench-press' | 'incline-press' | 'seated-row' | 'lateral-raise' | 'rdl' | 'pushdown' | 'crunch' => {
    if (id.includes('incline')) return 'incline-press';
    if (id.includes('bench') || id.includes('fly') || (id.includes('press') && !id.includes('leg'))) return 'bench-press';
    if (id.includes('row') || id.includes('pull') || id.includes('lat')) return 'seated-row';
    if (id.includes('lateral') || id.includes('face') || id.includes('shoulder') || id.includes('overhead')) return 'lateral-raise';
    if (id.includes('deadlift') || id.includes('rdl') || id.includes('squat') || id.includes('leg')) return 'rdl';
    if (id.includes('pushdown') || id.includes('triceps') || id.includes('skull') || id.includes('curl') || id.includes('dips')) return 'pushdown';
    if (id.includes('crunch') || id.includes('plank') || id.includes('raise')) return 'crunch';
    return 'bench-press';
  };

  // Helper to look up and cache last recorded weight for each exercise
  const getLastRecordedWeightForExercise = (exerciseId: string): number | null => {
    try {
      const savedWeights = localStorage.getItem('avalanche_exercise_last_weights');
      if (savedWeights) {
        const parsed = JSON.parse(savedWeights);
        if (parsed && typeof parsed[exerciseId] === 'number') {
          return parsed[exerciseId];
        }
      }
    } catch {}
    if (workoutHistory && workoutHistory.length > 0) {
      for (const record of workoutHistory) {
        const ex = record.exercises.find((e) => e.exerciseId === exerciseId);
        if (ex && ex.sets && ex.sets.length > 0) {
          const completed = ex.sets.filter((s) => s.isCompleted);
          if (completed.length > 0) {
            return completed[completed.length - 1].weight;
          }
          return ex.sets[0].weight;
        }
      }
    }
    return null;
  };

  const saveLastRecordedWeight = (exerciseId: string, weight: number) => {
    try {
      const saved = localStorage.getItem('avalanche_exercise_last_weights');
      const parsed = saved ? JSON.parse(saved) : {};
      parsed[exerciseId] = weight;
      localStorage.setItem('avalanche_exercise_last_weights', JSON.stringify(parsed));
    } catch {}
  };

  // Set yükseltme (+ ile): Sadece 12 tekrardan fazla (13+) olursa yükseltilebilir
  const handleAddFourthSet = (exerciseId: string) => {
    const targetEx = session.exercises.find((ex) => ex.exerciseId === exerciseId);
    if (targetEx) {
      const maxReps = Math.max(
        ...targetEx.sets.map((s) => (s.completedReps !== undefined ? s.completedReps : s.targetReps))
      );
      if (maxReps <= 12) {
        showToast(`⚠️ Kural: Setler sadece 12 tekrardan fazla (13+) yapılırsa '+' ile yükseltilebilir. Şu an: ${maxReps} tekrar. Önce tekrar sayısını '+' ile 12'nin üzerine çıkarın!`);
        return;
      }
    }

    const updatedExercises = session.exercises.map((ex) => {
      if (ex.exerciseId !== exerciseId) return ex;
      const lastSet = ex.sets[ex.sets.length - 1];
      const newSetNumber = ex.sets.length + 1;
      const lastRecorded = getLastRecordedWeightForExercise(exerciseId);
      const baseWeight = lastSet
        ? (lastSet.completedWeight ?? lastSet.targetWeight)
        : (lastRecorded ?? 30);
      const newSet: WorkoutSet = {
        id: `${exerciseId}-s${Date.now()}-${newSetNumber}`,
        setNumber: newSetNumber,
        targetWeight: baseWeight,
        targetReps: 12,
        isCompleted: false,
        note: `Set ${newSetNumber} • 12+ Tekrar (Progresif Yükleme)`,
      };
      return {
        ...ex,
        sets: [...ex.sets, newSet],
      };
    });
    onUpdateSession({ ...session, exercises: updatedExercises, totalSets: session.totalSets + 1 });
    showToast(`✓ 12 tekrar aşıldığı için yeni set başarıyla eklendi!`);
  };

  // Calculate live dynamic metrics
  const { totalSetsTarget, completedSetsCount, totalVolumeKg } = useMemo(() => {
    let targetSets = 0;
    let completedSets = 0;
    let volumeKg = 0;

    session.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        targetSets += 1;
        if (s.isCompleted) {
          completedSets += 1;
          const weight = s.completedWeight !== undefined ? s.completedWeight : s.targetWeight;
          const reps = s.completedReps !== undefined ? s.completedReps : s.targetReps;
          volumeKg += weight * reps;
        }
      });
    });

    return { totalSetsTarget: targetSets, completedSetsCount: completedSets, totalVolumeKg: volumeKg };
  }, [session]);

  const progressPercent = totalSetsTarget > 0 ? Math.min(100, Math.round((completedSetsCount / totalSetsTarget) * 100)) : 0;

  // Toggle guide accordion
  const toggleGuide = (exerciseId: string) => {
    setExpandedGuides((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  // Toggle set completion
  const handleToggleSet = (exerciseId: string, setId: string) => {
    const exMeta = getExerciseMeta(exerciseId);
    let justCompleted = false;
    let nextSetNum = 1;

    const updatedExercises = session.exercises.map((ex) => {
      if (ex.exerciseId !== exerciseId) return ex;
      const updatedSets = ex.sets.map((s) => {
        if (s.id !== setId) return s;
        const willComplete = !s.isCompleted;
        if (willComplete) {
          justCompleted = true;
          nextSetNum = s.setNumber + 1;
        }
        return {
          ...s,
          isCompleted: willComplete,
          completedWeight: s.completedWeight !== undefined ? s.completedWeight : s.targetWeight,
          completedReps: s.completedReps !== undefined ? s.completedReps : s.targetReps,
        };
      });
      return { ...ex, sets: updatedSets };
    });

    onUpdateSession({ ...session, exercises: updatedExercises });

    if (justCompleted) {
      const completedSet = updatedExercises.find((e) => e.exerciseId === exerciseId)?.sets.find((s) => s.id === setId);
      if (completedSet) {
        saveLastRecordedWeight(
          exerciseId,
          completedSet.completedWeight !== undefined ? completedSet.completedWeight : completedSet.targetWeight
        );
      }
      onOpenRestTimer(
        exMeta.name || 'Egzersiz',
        `Set ${nextSetNum} için dinlenme başlatıldı`
      );
      showToast(`✓ Set ${completedSet?.setNumber || ''} tamamlandı! (+${exMeta.name})`);
    }
  };

  // Update set weight
  const handleUpdateSetWeight = (exerciseId: string, setId: string, delta: number) => {
    let finalWeight = 0;
    const updatedExercises = session.exercises.map((ex) => {
      if (ex.exerciseId !== exerciseId) return ex;
      const updatedSets = ex.sets.map((s) => {
        if (s.id !== setId) return s;
        const current = s.completedWeight !== undefined ? s.completedWeight : s.targetWeight;
        const newWeight = Math.max(0, current + delta);
        finalWeight = newWeight;
        return {
          ...s,
          targetWeight: newWeight,
          completedWeight: s.isCompleted ? newWeight : undefined,
        };
      });
      return { ...ex, sets: updatedSets };
    });
    saveLastRecordedWeight(exerciseId, finalWeight);
    onUpdateSession({ ...session, exercises: updatedExercises });
  };

  // Direct set weight input
  const handleDirectSetWeight = (exerciseId: string, setId: string, val: string) => {
    const parsed = parseFloat(val);
    const weightVal = isNaN(parsed) ? 0 : Math.max(0, parsed);
    saveLastRecordedWeight(exerciseId, weightVal);
    const updatedExercises = session.exercises.map((ex) => {
      if (ex.exerciseId !== exerciseId) return ex;
      const updatedSets = ex.sets.map((s) => {
        if (s.id !== setId) return s;
        return {
          ...s,
          targetWeight: weightVal,
          completedWeight: s.isCompleted ? weightVal : undefined,
        };
      });
      return { ...ex, sets: updatedSets };
    });
    onUpdateSession({ ...session, exercises: updatedExercises });
  };

  // Update set reps
  const handleUpdateSetReps = (exerciseId: string, setId: string, delta: number) => {
    const updatedExercises = session.exercises.map((ex) => {
      if (ex.exerciseId !== exerciseId) return ex;
      const updatedSets = ex.sets.map((s) => {
        if (s.id !== setId) return s;
        const current = s.completedReps !== undefined ? s.completedReps : s.targetReps;
        const newReps = Math.max(1, current + delta);
        return {
          ...s,
          targetReps: newReps,
          completedReps: s.isCompleted ? newReps : undefined,
        };
      });
      return { ...ex, sets: updatedSets };
    });
    onUpdateSession({ ...session, exercises: updatedExercises });
  };

  // Direct set reps input
  const handleDirectSetReps = (exerciseId: string, setId: string, val: string) => {
    const parsed = parseInt(val, 10);
    const repVal = isNaN(parsed) ? 1 : Math.max(1, parsed);
    const updatedExercises = session.exercises.map((ex) => {
      if (ex.exerciseId !== exerciseId) return ex;
      const updatedSets = ex.sets.map((s) => {
        if (s.id !== setId) return s;
        return {
          ...s,
          targetReps: repVal,
          completedReps: s.isCompleted ? repVal : undefined,
        };
      });
      return { ...ex, sets: updatedSets };
    });
    onUpdateSession({ ...session, exercises: updatedExercises });
  };

  // Add new set to exercise (Sadece 12 tekrardan fazla olursa + ile yükseltilebilir)
  const handleAddSetToExercise = (exerciseId: string) => {
    const targetEx = session.exercises.find((ex) => ex.exerciseId === exerciseId);
    if (targetEx && targetEx.sets.length >= 3) {
      const maxReps = Math.max(
        ...targetEx.sets.map((s) => (s.completedReps !== undefined ? s.completedReps : s.targetReps))
      );
      if (maxReps <= 12) {
        showToast(`⚠️ Kural: Setler sadece 12 tekrardan fazla (13+) olursa '+' ile yükseltilebilir. Şu an: ${maxReps} tekrar.`);
        return;
      }
    }

    const updatedExercises = session.exercises.map((ex) => {
      if (ex.exerciseId !== exerciseId) return ex;
      const lastSet = ex.sets[ex.sets.length - 1];
      const newSetNumber = ex.sets.length + 1;
      let nextReps = 10;
      if (newSetNumber === 2) nextReps = 12;
      else if (newSetNumber === 3) nextReps = 15;
      else if (lastSet) nextReps = lastSet.completedReps || lastSet.targetReps || 12;

      const newSet: WorkoutSet = {
        id: `${exerciseId}-s${Date.now()}-${newSetNumber}`,
        setNumber: newSetNumber,
        targetWeight: lastSet ? (lastSet.completedWeight || lastSet.targetWeight) : 40,
        targetReps: nextReps,
        isCompleted: false,
        note: `Set ${newSetNumber} • ${nextReps} Tekrar`,
      };
      return {
        ...ex,
        sets: [...ex.sets, newSet],
      };
    });
    onUpdateSession({ ...session, exercises: updatedExercises, totalSets: session.totalSets + 1 });
    showToast(`Set eklendi.`);
  };

  // Configure single exercise to 10 / 12 / 15 rep hypertrophy pyramid
  const handleApply10_12_15_ToExercise = (exerciseId: string) => {
    const updatedExercises = session.exercises.map((ex) => {
      if (ex.exerciseId !== exerciseId) return ex;
      const baseWeight = ex.sets[0]?.targetWeight || 40;
      const newSets: WorkoutSet[] = [
        {
          id: `${exerciseId}-s1-${Date.now()}`,
          setNumber: 1,
          targetWeight: baseWeight,
          targetReps: 10,
          completedWeight: ex.sets[0]?.isCompleted ? (ex.sets[0].completedWeight ?? baseWeight) : undefined,
          completedReps: ex.sets[0]?.isCompleted ? 10 : undefined,
          isCompleted: ex.sets[0]?.isCompleted ?? false,
          note: 'Set 1 • 10 Tekrar',
        },
        {
          id: `${exerciseId}-s2-${Date.now()}`,
          setNumber: 2,
          targetWeight: Math.max(0, baseWeight - 2.5),
          targetReps: 12,
          completedWeight: ex.sets[1]?.isCompleted ? (ex.sets[1].completedWeight ?? Math.max(0, baseWeight - 2.5)) : undefined,
          completedReps: ex.sets[1]?.isCompleted ? 12 : undefined,
          isCompleted: ex.sets[1]?.isCompleted ?? false,
          note: 'Set 2 • 12 Tekrar',
        },
        {
          id: `${exerciseId}-s3-${Date.now()}`,
          setNumber: 3,
          targetWeight: Math.max(0, baseWeight - 5),
          targetReps: 15,
          completedWeight: ex.sets[2]?.isCompleted ? (ex.sets[2].completedWeight ?? Math.max(0, baseWeight - 5)) : undefined,
          completedReps: ex.sets[2]?.isCompleted ? 15 : undefined,
          isCompleted: ex.sets[2]?.isCompleted ?? false,
          note: 'Set 3 • 15 Tekrar (Hipertrofi Tükeniş)',
        },
      ];
      return { ...ex, sets: newSets };
    });
    onUpdateSession({
      ...session,
      exercises: updatedExercises,
      totalSets: updatedExercises.reduce((sum, e) => sum + e.sets.length, 0),
    });
    showToast('Hareket 10 / 12 / 15 set şablonuna ayarlandı!');
  };

  // Configure ALL exercises in the session to 10 / 12 / 15 rep scheme
  const handleApply10_12_15_ToAllExercises = () => {
    const updatedExercises = session.exercises.map((ex) => {
      const baseWeight = ex.sets[0]?.targetWeight || 40;
      const newSets: WorkoutSet[] = [
        {
          id: `${ex.exerciseId}-s1-${Date.now()}`,
          setNumber: 1,
          targetWeight: baseWeight,
          targetReps: 10,
          completedWeight: ex.sets[0]?.isCompleted ? (ex.sets[0].completedWeight ?? baseWeight) : undefined,
          completedReps: ex.sets[0]?.isCompleted ? 10 : undefined,
          isCompleted: ex.sets[0]?.isCompleted ?? false,
          note: 'Set 1 • 10 Tekrar',
        },
        {
          id: `${ex.exerciseId}-s2-${Date.now()}`,
          setNumber: 2,
          targetWeight: Math.max(0, baseWeight - 2.5),
          targetReps: 12,
          completedWeight: ex.sets[1]?.isCompleted ? (ex.sets[1].completedWeight ?? Math.max(0, baseWeight - 2.5)) : undefined,
          completedReps: ex.sets[1]?.isCompleted ? 12 : undefined,
          isCompleted: ex.sets[1]?.isCompleted ?? false,
          note: 'Set 2 • 12 Tekrar',
        },
        {
          id: `${ex.exerciseId}-s3-${Date.now()}`,
          setNumber: 3,
          targetWeight: Math.max(0, baseWeight - 5),
          targetReps: 15,
          completedWeight: ex.sets[2]?.isCompleted ? (ex.sets[2].completedWeight ?? Math.max(0, baseWeight - 5)) : undefined,
          completedReps: ex.sets[2]?.isCompleted ? 15 : undefined,
          isCompleted: ex.sets[2]?.isCompleted ?? false,
          note: 'Set 3 • 15 Tekrar',
        },
      ];
      return { ...ex, sets: newSets };
    });
    onUpdateSession({
      ...session,
      exercises: updatedExercises,
      totalSets: updatedExercises.length * 3,
    });
    showToast('Tüm hareketler 10/12/15 set şablonuna ayarlandı! ✨');
  };

  // Live Cardio Adjuster (8/12/15 incline, 10/20/30 min, 4-6 km/h)
  const handleUpdateLiveCardio = (updates: Partial<CardioSettings>) => {
    if (!session.cardio) return;
    const dur = updates.durationMinutes ?? session.cardio.durationMinutes;
    const inc = updates.inclinePercent ?? session.cardio.inclinePercent;
    const spd = Math.max(4.0, Math.min(6.0, updates.speedKmh ?? session.cardio.speedKmh));
    const speedMPerMin = (spd * 1000) / 60;
    const inclineFraction = inc / 100;
    const met = Math.max(3, 3.5 + 0.1 * speedMPerMin + 1.8 * speedMPerMin * inclineFraction);
    const estKcal = Math.round(((met * 3.5 * athleteWeightKg) / 200) * dur);

    onUpdateSession({
      ...session,
      cardio: {
        ...session.cardio,
        ...updates,
        durationMinutes: dur,
        inclinePercent: inc,
        speedKmh: spd,
        targetCalories: estKcal,
        heartRateZone: `Zone 2 Yağ Yakımı (%${inc} Eğim • ${spd} km/h)`,
      },
    });
    showToast(`Eğimli Kardiyo: ${dur} dk, %${inc} eğim, ${spd} km/h güncellendi.`);
  };

  // Add Default Inclined Cardio (20 dk, %12 Eğim, 5.0 km/h)
  const handleAddDefaultCardio = () => {
    const cardio: CardioSettings = {
      id: `cardio-live-${Date.now()}`,
      type: 'incline_walk',
      name: 'Eğimli Yürüyüş Bandı (Avalanche Zone 2)',
      durationMinutes: 20,
      inclinePercent: 12,
      speedKmh: 5.0,
      heartRateZone: 'Zone 2 Yağ Yakımı (%12 Eğim • 5.0 km/h)',
      targetCalories: 215,
      completed: false,
    };
    onUpdateSession({ ...session, cardio });
    showToast('Eğimli kardiyo eklendi (20 dk • %12 Eğim • 5.0 km/h) 🏃');
  };

  // Remove set from exercise
  const handleRemoveSetFromExercise = (exerciseId: string, setId: string) => {
    const updatedExercises = session.exercises.map((ex) => {
      if (ex.exerciseId !== exerciseId) return ex;
      if (ex.sets.length <= 1) return ex;
      const filtered = ex.sets.filter((s) => s.id !== setId).map((s, idx) => ({ ...s, setNumber: idx + 1 }));
      return { ...ex, sets: filtered };
    });
    onUpdateSession({ ...session, exercises: updatedExercises, totalSets: Math.max(1, session.totalSets - 1) });
    showToast('Set silindi.');
  };

  // Remove entire exercise
  const handleRemoveExercise = (exerciseId: string) => {
    const exMeta = getExerciseMeta(exerciseId);
    const filtered = session.exercises.filter((ex) => ex.exerciseId !== exerciseId);
    onUpdateSession({
      ...session,
      exercises: filtered,
      exercisesCount: filtered.length,
      totalSets: filtered.reduce((acc, e) => acc + e.sets.length, 0),
    });
    showToast(`"${exMeta.name}" seansınızdan çıkarıldı.`);
  };

  // Reorder exercises up/down
  const handleMoveExercise = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= session.exercises.length) return;
    const reordered = [...session.exercises];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    onUpdateSession({ ...session, exercises: reordered });
    showToast('Hareket sırası güncellendi.');
  };

  // Complete all sets for an exercise at once
  const handleCompleteAllSetsForExercise = (exerciseId: string) => {
    const updatedExercises = session.exercises.map((ex) => {
      if (ex.exerciseId !== exerciseId) return ex;
      const allDone = ex.sets.map((s) => ({
        ...s,
        isCompleted: true,
        completedWeight: s.completedWeight !== undefined ? s.completedWeight : s.targetWeight,
        completedReps: s.completedReps !== undefined ? s.completedReps : s.targetReps,
      }));
      return { ...ex, sets: allDone };
    });
    onUpdateSession({ ...session, exercises: updatedExercises });
    showToast('Tüm setler tamamlandı olarak işaretlendi.');
  };

  // Progressive Overload Booster (+2.5 kg to all sets)
  const handleBoostOverload = () => {
    const updated = {
      ...session,
      exercises: session.exercises.map((ex) => ({
        ...ex,
        sets: ex.sets.map((s) => ({
          ...s,
          targetWeight: s.targetWeight + 2.5,
          completedWeight: s.completedWeight ? s.completedWeight + 2.5 : undefined,
        })),
      })),
    };
    onUpdateSession(updated);
    showToast('Tüm hareket hedeflerine +2.5 kg aşamalı yükleme yapıldı!');
  };

  // Add exercise from catalog modal
  const handleAddExerciseFromCatalog = (ex: Exercise) => {
    const existing = session.exercises.find((e) => e.exerciseId === ex.id);
    if (existing) {
      showToast(`"${ex.name}" zaten antrenman seansınızda var.`);
      return;
    }
    const newEx: WorkoutExercise = {
      exerciseId: ex.id,
      currentSetIndex: 0,
      restSeconds: 90,
      isFinished: false,
      notes: ex.criticalMistake,
      sets: [
        { id: `${ex.id}-s1-${Date.now()}`, setNumber: 1, targetWeight: 40, targetReps: 10, isCompleted: false, note: 'Set 1 • 10 Tekrar' },
        { id: `${ex.id}-s2-${Date.now()}`, setNumber: 2, targetWeight: 37.5, targetReps: 12, isCompleted: false, note: 'Set 2 • 12 Tekrar' },
        { id: `${ex.id}-s3-${Date.now()}`, setNumber: 3, targetWeight: 35, targetReps: 15, isCompleted: false, note: 'Set 3 • 15 Tekrar' },
      ],
    };

    onUpdateSession({
      ...session,
      exercises: [...session.exercises, newEx],
      exercisesCount: session.exercises.length + 1,
      totalSets: session.totalSets + 3,
    });
    setIsAddExerciseModalOpen(false);
    showToast(`"${ex.name}" seansa eklendi!`);
  };

  // Finish Workout and Save to History
  const handleConfirmFinishWorkout = () => {
    const now = new Date();
    const isoDate = now.toISOString().split('T')[0];
    const trMonths = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const dateStr = `${now.getDate()} ${trMonths[now.getMonth()]} ${now.getFullYear()}`;

    const exerciseRecords = session.exercises.map((ex) => {
      const meta = getExerciseMeta(ex.exerciseId);
      return {
        exerciseId: ex.exerciseId,
        exerciseName: meta.name || ex.exerciseId,
        sets: ex.sets.map((s) => ({
          setNumber: s.setNumber,
          weight: s.completedWeight !== undefined ? s.completedWeight : s.targetWeight,
          reps: s.completedReps !== undefined ? s.completedReps : s.targetReps,
          isCompleted: s.isCompleted,
        })),
      };
    });

    const newRecord: CompletedWorkoutRecord = {
      id: `wkout-${Date.now()}`,
      title: session.title,
      date: dateStr,
      isoDate: isoDate,
      timestamp: Date.now(),
      durationSeconds: elapsedSeconds,
      durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
      totalVolumeKg: totalVolumeKg,
      totalSetsCompleted: completedSetsCount,
      totalSetsTarget: totalSetsTarget,
      exercises: exerciseRecords,
      cardio: session.cardio?.completed
        ? {
            name: session.cardio.name,
            durationMinutes: session.cardio.durationMinutes,
            caloriesBurned: session.cardio.targetCalories || 240,
          }
        : undefined,
      notes: finishNotes.trim() || undefined,
    };

    if (onCompleteWorkout) {
      onCompleteWorkout(newRecord);
    }

    setShowFinishModal(false);
    setIsTimerRunning(false);
    setElapsedSeconds(0);
    try {
      localStorage.setItem('avalanche_workout_timer', '0');
    } catch {}

    // Reset sets for next session
    const resetExercises = session.exercises.map((ex) => ({
      ...ex,
      isFinished: false,
      sets: ex.sets.map((s) => ({ ...s, isCompleted: false, completedWeight: undefined, completedReps: undefined })),
    }));
    onUpdateSession({ ...session, exercises: resetExercises });

    showToast('🏆 Antrenman başarıyla tamamlandı ve arşive kaydedildi!');
    setActiveSubTab('history');
  };

  // Repeat a past workout routine into the live session
  const handleRepeatPastWorkout = (record: CompletedWorkoutRecord) => {
    if (!record.exercises || record.exercises.length === 0) {
      showToast('Bu antrenmanda kayıtlı hareket detayı bulunamadı.');
      return;
    }
    const newExercises: WorkoutExercise[] = record.exercises.map((item) => {
      const meta = getExerciseMeta(item.exerciseId);
      return {
        exerciseId: item.exerciseId,
        currentSetIndex: 0,
        restSeconds: 90,
        isFinished: false,
        notes: meta.criticalMistake || 'Önceki seans ağırlıkları yüklendi.',
        sets: item.sets.map((s, idx) => ({
          id: `${item.exerciseId}-s${Date.now()}-${idx + 1}`,
          setNumber: s.setNumber,
          targetWeight: s.weight,
          targetReps: s.reps,
          isCompleted: false,
        })),
      };
    });

    const newSession: WorkoutSession = {
      id: `session-${Date.now()}`,
      title: record.title,
      dayLabel: 'Tekrar Edilen Seans',
      durationMinutesEstimate: record.durationMinutes || 45,
      exercisesCount: newExercises.length,
      totalSets: newExercises.reduce((acc, curr) => acc + curr.sets.length, 0),
      restSecondsDefault: 90,
      nextExercisePreview: newExercises[0]?.exerciseId || 'Antrenman',
      nextRpe: '8.5',
      exercises: newExercises,
      cardio: record.cardio
        ? {
            id: `cardio-${Date.now()}`,
            type: 'incline_walk',
            name: record.cardio.name,
            durationMinutes: record.cardio.durationMinutes,
            targetCalories: record.cardio.caloriesBurned,
            inclinePercent: 10,
            speedKmh: 5.5,
            completed: false,
          }
        : undefined,
    };

    onUpdateSession(newSession);
    setActiveSubTab('live');
    showToast(`"${record.title}" canlı seansa yüklendi!`);
  };

  // Handle Save Manual Workout
  const handleSaveManualWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    const durationMin = parseInt(manualDuration, 10) || 45;
    const setsCount = parseInt(manualSets, 10) || 12;
    const vol = parseFloat(manualVolume) || 0;
    const [y, m, d] = manualDate.split('-');
    const trMonths = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const dateFormatted = `${parseInt(d, 10)} ${trMonths[parseInt(m, 10) - 1]} ${y}`;

    const newRecord: CompletedWorkoutRecord = {
      id: `manual-wkout-${Date.now()}`,
      title: manualTitle.trim() || 'Manuel Antrenman',
      date: dateFormatted,
      isoDate: manualDate,
      timestamp: new Date(manualDate).getTime() || Date.now(),
      durationSeconds: durationMin * 60,
      durationMinutes: durationMin,
      totalVolumeKg: vol,
      totalSetsCompleted: setsCount,
      totalSetsTarget: setsCount,
      exercises: [],
      notes: manualNotes.trim() || 'Manuel olarak kaydedildi',
    };

    if (onCompleteWorkout) {
      onCompleteWorkout(newRecord);
    }
    setIsManualModalOpen(false);
    showToast('Manuel antrenman geçmişe kaydedildi!');
  };

  // Pre-configured split loaders
  const handleLoadSplit = (splitType: 'push' | 'pull' | 'legs' | 'upper' | 'lower' | 'fullbody' | 'arnold') => {
    let title = '';
    let exerciseIds: string[] = [];

    if (splitType === 'push') {
      title = 'GÖĞÜS & TRICEPS & ÖN OMUZ (PUSH A)';
      exerciseIds = ['barbell-bench-press', 'incline-dumbbell-press', 'dips-chest-triceps', 'dumbbell-lateral-raise', 'cable-triceps-pushdown'];
    } else if (splitType === 'pull') {
      title = 'SIRT & BICEPS & ARKA OMUZ (PULL A)';
      exerciseIds = ['barbell-deadlift', 'pull-up', 'seated-cable-row', 'face-pull', 'barbell-biceps-curl'];
    } else if (splitType === 'legs') {
      title = 'BACAK & KALF & KARIN (LEGS A)';
      exerciseIds = ['barbell-back-squat', 'leg-press-45', 'romanian-deadlift', 'leg-extension', 'kneeling-cable-crunch'];
    } else if (splitType === 'upper') {
      title = 'ÜST GÖVDE HİPERTROFİ (UPPER)';
      exerciseIds = ['barbell-bench-press', 'barbell-bent-over-row', 'overhead-barbell-press', 'cable-chest-fly', 'dumbbell-hammer-curl'];
    } else if (splitType === 'lower') {
      title = 'ALT GÖVDE & POSTERIOR (LOWER)';
      exerciseIds = ['barbell-back-squat', 'barbell-deadlift', 'lying-leg-curl', 'hanging-leg-raise', 'leg-press-45'];
    } else if (splitType === 'fullbody') {
      title = 'TÜM VÜCUT BİLEŞİK SEANS (FULL BODY)';
      exerciseIds = ['barbell-back-squat', 'barbell-bench-press', 'barbell-bent-over-row', 'dumbbell-lateral-raise', 'cable-triceps-pushdown'];
    } else if (splitType === 'arnold') {
      title = 'ARNOLD GÖĞÜS & SIRT SÜPERSET (ARNOLD)';
      exerciseIds = ['barbell-bench-press', 'pull-up', 'incline-dumbbell-press', 'seated-cable-row', 'cable-chest-fly'];
    }

    const newExercises: WorkoutExercise[] = exerciseIds.map((id) => {
      const meta = getExerciseMeta(id);
      return {
        exerciseId: id,
        currentSetIndex: 0,
        restSeconds: 90,
        isFinished: false,
        notes: meta.criticalMistake || 'Biyomekanik form rehberine dikkat edin.',
        sets: [
          { id: `${id}-s1`, setNumber: 1, targetWeight: 60, targetReps: 10, isCompleted: false },
          { id: `${id}-s2`, setNumber: 2, targetWeight: 65, targetReps: 10, isCompleted: false },
          { id: `${id}-s3`, setNumber: 3, targetWeight: 70, targetReps: 8, isCompleted: false },
        ],
      };
    });

    onUpdateSession({
      ...session,
      title,
      exercises: newExercises,
      exercisesCount: newExercises.length,
      totalSets: newExercises.length * 3,
    });

    setActiveSubTab('live');
    showToast(`"${title}" seansa yüklendi!`);
  };

  // Filtered Exercises for the Catalog Modal
  const filteredCatalogExercises = useMemo(() => {
    return EXERCISES_DATA.filter((ex) => {
      const matchesSearch =
        ex.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        ex.targetMuscle.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        ex.category.toLowerCase().includes(catalogSearch.toLowerCase());

      if (!matchesSearch) return false;

      if (catalogMuscleFilter === 'all') return true;
      if (catalogMuscleFilter === 'push') return ex.category.includes('İtiş') || ex.category.includes('Push');
      if (catalogMuscleFilter === 'pull') return ex.category.includes('Çekiş') || ex.category.includes('Pull');
      if (catalogMuscleFilter === 'legs') return ex.category.includes('Bacak') || ex.category.includes('Leg');
      if (catalogMuscleFilter === 'chest') return ex.targetMuscle.toLowerCase().includes('göğüs') || ex.anatomyRegion.toLowerCase().includes('göğüs');
      if (catalogMuscleFilter === 'back') return ex.targetMuscle.toLowerCase().includes('sırt') || ex.targetMuscle.toLowerCase().includes('lat');
      if (catalogMuscleFilter === 'arms') return ex.targetMuscle.toLowerCase().includes('kol') || ex.targetMuscle.toLowerCase().includes('triceps') || ex.targetMuscle.toLowerCase().includes('biceps');
      if (catalogMuscleFilter === 'core') return ex.targetMuscle.toLowerCase().includes('karın') || ex.targetMuscle.toLowerCase().includes('core');
      return true;
    });
  }, [catalogSearch, catalogMuscleFilter]);

  // Filtered History
  const filteredWorkoutHistory = useMemo(() => {
    return workoutHistory.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
        item.date.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(historySearchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (historyFilterType === 'all') return true;
      if (historyFilterType === 'push') return item.title.toLowerCase().includes('push') || item.title.toLowerCase().includes('göğüs');
      if (historyFilterType === 'pull') return item.title.toLowerCase().includes('pull') || item.title.toLowerCase().includes('sırt');
      if (historyFilterType === 'legs') return item.title.toLowerCase().includes('leg') || item.title.toLowerCase().includes('bacak');
      return true;
    });
  }, [workoutHistory, historySearchQuery, historyFilterType]);

  // Aggregate stats for workout history
  const historySummary = useMemo(() => {
    const totalSessions = workoutHistory.length;
    const totalVolume = workoutHistory.reduce((sum, w) => sum + (w.totalVolumeKg || 0), 0);
    const totalMinutes = workoutHistory.reduce((sum, w) => sum + (w.durationMinutes || 0), 0);
    const totalSets = workoutHistory.reduce((sum, w) => sum + (w.totalSetsCompleted || 0), 0);
    const avgSets = totalSessions > 0 ? Math.round(totalSets / totalSessions) : 0;
    return { totalSessions, totalVolume, totalMinutes, avgSets };
  }, [workoutHistory]);

  return (
    <div className="space-y-4 pb-28 select-none">
      {/* 1. Sub-Navigation Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-[#1F1F24] rounded-2xl border border-[#262936]">
        <button
          type="button"
          onClick={() => setActiveSubTab('live')}
          className={`py-2 px-1 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1 transition-all ${
            activeSubTab === 'live'
              ? 'bg-[#FF1E38] text-white shadow-md shadow-[#FF1E38]/20 scale-[1.01]'
              : 'text-[#A0A5B5] hover:text-white'
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5" />
          <span>Canlı</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('roadmap')}
          className={`py-2 px-1 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1 transition-all ${
            activeSubTab === 'roadmap'
              ? 'bg-[#FF1E38] text-white shadow-md shadow-[#FF1E38]/20 scale-[1.01]'
              : 'text-[#A0A5B5] hover:text-white'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Yol Haritası</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('programs')}
          className={`py-2 px-1 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1 transition-all ${
            activeSubTab === 'programs'
              ? 'bg-[#FF1E38] text-white shadow-md shadow-[#FF1E38]/20 scale-[1.01]'
              : 'text-[#A0A5B5] hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Program</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('history')}
          className={`py-2 px-1 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1 transition-all ${
            activeSubTab === 'history'
              ? 'bg-[#FF1E38] text-white shadow-md shadow-[#FF1E38]/20 scale-[1.01]'
              : 'text-[#A0A5B5] hover:text-white'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Geçmiş ({workoutHistory.length})</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: LIVE WORKOUT SESSION VIEW
         ======================================================== */}
      {activeSubTab === 'live' && (
        <div className="space-y-4">
          {/* Live Workout Session Header */}
          <div className="rounded-2xl bg-[#1F1F24] border border-[#262936] p-4 shadow-sm space-y-3">
            {/* Session Status & Stopwatch */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF1E38] animate-ping" />
                <span className="text-[11px] font-extrabold text-[#E3E2E8] uppercase tracking-wider">
                  CANLI ANTRENMAN SEANSI
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-[#121317] px-3 py-1 rounded-xl border border-[#262936]">
                <span className="text-sm font-extrabold text-white font-mono tabular-nums tracking-tight">
                  {formatTimer(elapsedSeconds)}
                </span>
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="text-[#FF5356] hover:text-white transition-colors"
                  title={isTimerRunning ? 'Duraklat' : 'Başlat'}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setElapsedSeconds(0);
                    showToast('Süre sıfırlandı.');
                  }}
                  className="text-[#A0A5B5] hover:text-white transition-colors ml-1"
                  title="Sıfırla"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Workout Title */}
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {session.title}
              </h2>
              <p className="text-[11px] font-bold text-[#A0A5B5] uppercase tracking-wider mt-0.5">
                {session.dayLabel || 'GÜNLÜK HİPERTROFİ SEANSI'}
              </p>
            </div>

            {/* Live Telemetry Progress: Sets & Volume */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#A0A5B5]">
                  Tamamlanan: <strong className="text-white font-mono">{completedSetsCount}</strong> / {totalSetsTarget} Set
                </span>
                <span className="text-[#FF5356] font-bold font-mono">
                  {totalVolumeKg > 0 ? `${totalVolumeKg.toLocaleString('tr-TR')} kg Tonaj` : '0 kg'}
                </span>
              </div>

              {/* High-contrast Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-[#121317] border border-[#262936] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF1E38] to-[#FF5356] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Live Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#262936]">
              <button
                type="button"
                onClick={handleBoostOverload}
                className="h-9 px-2 rounded-xl bg-[#121317] hover:bg-[#292A2E] text-white text-[11px] font-bold border border-[#262936] flex items-center justify-center space-x-1.5 transition-all active:scale-95"
              >
                <TrendingUp className="w-3.5 h-3.5 text-[#FF5356]" />
                <span>+2.5 kg Yükle</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddExerciseModalOpen(true)}
                className="h-9 px-2 rounded-xl bg-[#121317] hover:bg-[#292A2E] text-white text-[11px] font-bold border border-[#262936] flex items-center justify-center space-x-1.5 transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-[#FF5356]" />
                <span>+ Hareket Ekle</span>
              </button>

              <button
                type="button"
                onClick={handleApply10_12_15_ToAllExercises}
                className="h-9 px-2 rounded-xl bg-[#121317] hover:bg-[#292A2E] text-white text-[11px] font-bold border border-[#FF1E38]/40 hover:border-[#FF1E38] flex items-center justify-center space-x-1.5 transition-all active:scale-95"
                title="Tüm hareketleri 10 / 12 / 15 tekrar şablonuna ayarla"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF5356]" />
                <span>10/12/15 Şablonu</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (session.cardio) {
                    showToast('Eğimli kardiyo zaten aktif.');
                  } else {
                    handleAddDefaultCardio();
                  }
                }}
                className="h-9 px-2 rounded-xl bg-[#121317] hover:bg-[#292A2E] text-white text-[11px] font-bold border border-emerald-500/40 hover:border-emerald-500 flex items-center justify-center space-x-1.5 transition-all active:scale-95"
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Eğimli Kardiyo</span>
              </button>
            </div>
          </div>

          {/* 1. AŞAMA: Başlangıç Kardiyosu (Isınma & Yağ Yakımı • 30 Dakika) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider font-mono">
                  1. AŞAMA • BAŞLANGIÇ KARDİYOSU
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-300/90 font-bold">
                Isınma & Yağ Yakımı (30 Dk)
              </span>
            </div>

            {(() => {
              const effectiveCardio: CardioSettings = session.cardio || {
                id: 'cardio-default-treadmill',
                type: 'incline_walk',
                name: 'Eğimli Yürüyüş Bandı (Incline Treadmill)',
                durationMinutes: 30,
                inclinePercent: 10,
                speedKmh: 4.2,
                targetCalories: 240,
                heartRateZone: 'Zone 2 Yağ Yakımı (4–4.5 km/h, %8–12 Eğim)',
                completed: false,
              };

              const cardioMins = Math.floor(cardioElapsedSec / 60);
              const cardioSecs = cardioElapsedSec % 60;
              const remainingMins = Math.max(0, effectiveCardio.durationMinutes - cardioMins);
              const burnedCalories = Math.round((cardioElapsedSec / 1800) * (effectiveCardio.targetCalories || 240));

              return (
                <div className="rounded-2xl bg-gradient-to-br from-[#181920] to-[#121317] border-2 border-emerald-500/40 p-4 shadow-xl space-y-3.5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest font-mono block">
                        ANTRENMAN BAŞLANGICI:
                      </span>
                      <h3 className="text-xl font-extrabold text-white flex items-center space-x-2">
                        <Activity className="w-5 h-5 text-emerald-400" />
                        <span>Başlangıç Kardiyosu</span>
                      </h3>
                      <p className="text-xs text-[#A0A5B5]">
                        {effectiveCardio.name} • Eğim: %{effectiveCardio.inclinePercent} • Hız: {effectiveCardio.speedKmh} km/h
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-white font-mono block">
                        {effectiveCardio.durationMinutes}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase block font-mono">
                        DAKİKA
                      </span>
                    </div>
                  </div>

                  {/* Live Cardio Dashboard */}
                  {isCardioRunning && (
                    <div className="p-3 rounded-xl bg-[#121317] border border-emerald-500/40 grid grid-cols-3 gap-2 text-center animate-fadeIn">
                      <div>
                        <span className="text-[9px] text-[#A0A5B5] uppercase font-bold block">Geçen Süre</span>
                        <span className="text-lg font-extrabold text-emerald-400 font-mono">
                          {String(cardioMins).padStart(2, '0')}:{String(cardioSecs).padStart(2, '0')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#A0A5B5] uppercase font-bold block">Kalan</span>
                        <span className="text-lg font-extrabold text-white font-mono">
                          ~{remainingMins} dk
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#A0A5B5] uppercase font-bold block">Kalori</span>
                        <span className="text-lg font-extrabold text-amber-400 font-mono">
                          ~{burnedCalories} kcal
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Primary [Başlat] / [Duraklat] / [Tamamla] Button */}
                  <div className="space-y-2">
                    {!isCardioRunning && !effectiveCardio.completed && (
                      <button
                        type="button"
                        onClick={() => setIsCardioRunning(true)}
                        className="w-full h-13 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98]"
                      >
                        <Play className="w-5 h-5 fill-current" />
                        <span>[Başlat]</span>
                      </button>
                    )}

                    {isCardioRunning && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setIsCardioRunning(false)}
                          className="h-11 rounded-xl bg-[#292A2E] hover:bg-[#343439] text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                        >
                          <Pause className="w-4 h-4" />
                          <span>Duraklat</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCardioRunning(false);
                            onUpdateSession({
                              ...session,
                              cardio: {
                                ...effectiveCardio,
                                completed: true,
                              },
                            });
                            showToast(`✓ Başlangıç kardiyosu tamamlandı! (~${burnedCalories || 240} kcal yakıldı)`);
                          }}
                          className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/30 transition-all"
                        >
                          <Check className="w-4 h-4 stroke-[3px]" />
                          <span>Kardiyoyu Tamamla</span>
                        </button>
                      </div>
                    )}

                    {effectiveCardio.completed && (
                      <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-center justify-between text-xs text-emerald-200">
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-emerald-400 stroke-[3px]" />
                          <span className="font-bold">{effectiveCardio.durationMinutes} Dakika Eğimli Kardiyo Tamamlandı!</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateSession({
                              ...session,
                              cardio: {
                                ...effectiveCardio,
                                completed: false,
                              },
                            });
                            setIsCardioRunning(true);
                          }}
                          className="text-[11px] underline text-[#A0A5B5] hover:text-white"
                        >
                          Tekrar Başlat
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quick Adjusters for Duration, Incline, Speed */}
                  <div className="p-3 rounded-xl bg-[#14151B] border border-[#262936] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#A0A5B5] font-bold">Süre:</span>
                      <div className="flex items-center space-x-1.5">
                        {[20, 25, 30, 35, 40].map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => handleUpdateLiveCardio({ durationMinutes: d })}
                            className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                              effectiveCardio.durationMinutes === d
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-[#1F1F24] text-[#A0A5B5] hover:text-white border border-[#262936]'
                            }`}
                          >
                            {d} dk
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-bold">Eğim (%):</span>
                      <div className="flex items-center space-x-1.5">
                        {[8, 10, 12, 15].map((inc) => (
                          <button
                            key={inc}
                            type="button"
                            onClick={() => handleUpdateLiveCardio({ inclinePercent: inc })}
                            className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                              effectiveCardio.inclinePercent === inc
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-[#1F1F24] text-emerald-400 hover:text-white border border-emerald-500/30'
                            }`}
                          >
                            %{inc}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-bold">Hız (km/h):</span>
                      <div className="flex items-center space-x-1">
                        {[4.0, 4.2, 4.5, 5.0].map((spd) => (
                          <button
                            key={spd}
                            type="button"
                            onClick={() => handleUpdateLiveCardio({ speedKmh: spd })}
                            className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                              effectiveCardio.speedKmh === spd
                                ? 'bg-amber-600 text-white shadow-sm'
                                : 'bg-[#1F1F24] text-amber-400 hover:text-white border border-amber-500/30'
                            }`}
                          >
                            {spd.toFixed(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* 2. AŞAMA: Ağırlık Egzersizleri (3×12 Hipertrofi & Güç) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF1E38]" />
                <span className="text-xs font-black text-white uppercase tracking-wider font-mono">
                  2. AŞAMA • AĞIRLIK ANTRENMANI (3×12)
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#A0A5B5]">
                {session.exercises.length} Hareket
              </span>
            </div>
            {session.exercises.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#1F1F24] border border-[#262936] text-center space-y-3">
                <Dumbbell className="w-10 h-10 text-[#A0A5B5] mx-auto opacity-50" />
                <h3 className="text-sm font-bold text-white">Seansınızda Henüz Egzersiz Yok</h3>
                <p className="text-xs text-[#A0A5B5]">Programlar sekmesinden hazır bir split seçebilir veya yeni hareket ekleyebilirsiniz.</p>
                <button
                  type="button"
                  onClick={() => setIsAddExerciseModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#FF1E38] hover:bg-[#FF334B] text-white text-xs font-bold transition-all shadow-md"
                >
                  + Egzersiz Ekle
                </button>
              </div>
            ) : (
              session.exercises.map((workoutEx, exIdx) => {
                const exMeta = getExerciseMeta(workoutEx.exerciseId);
                const isExpanded = expandedGuides[workoutEx.exerciseId];
                const completedCountForEx = workoutEx.sets.filter((s) => s.isCompleted).length;
                const isFirst = exIdx === 0;
                const isLast = exIdx === session.exercises.length - 1;
                const lastRecordedWeight = getLastRecordedWeightForExercise(workoutEx.exerciseId);

                return (
                  <div
                    key={workoutEx.exerciseId}
                    className="rounded-2xl bg-[#1F1F24] border border-[#262936] p-4 shadow-sm space-y-3 transition-all hover:border-[#383A47]"
                  >
                    {/* Exercise Header & Order Controls */}
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-extrabold text-[#FF5356] uppercase tracking-wider block">
                            {exIdx + 1}. EGZERSİZ • {exMeta.category || 'İtiş'}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#121317] border border-[#262936] text-[#A0A5B5] font-mono">
                            {exMeta.equipment || 'Serbest Ağırlık / Makine'}
                          </span>
                        </div>

                        {/* Hareket Adı & 3 x 12 Rozeti */}
                        <div className="flex items-center space-x-2.5 mt-1">
                          <h3 className="text-lg font-extrabold text-white truncate">
                            {exMeta.name}
                          </h3>
                          <span className="px-2 py-0.5 rounded-lg bg-[#FF1E38]/20 border border-[#FF1E38]/40 text-[#FF5356] font-mono font-extrabold text-xs shrink-0">
                            {workoutEx.sets.length} × 12
                          </span>
                        </div>

                        {/* Ağırlık ve Son Antrenman Otomatik Gösterimi */}
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#A0A5B5] mt-1">
                          <span className="font-bold text-white">Ağırlık:</span>
                          {lastRecordedWeight !== null ? (
                            <span className="px-2 py-0.5 rounded bg-[#121317] border border-amber-500/40 text-amber-300 font-mono font-bold text-[11px] flex items-center space-x-1">
                              <span>Son Antrenman: {lastRecordedWeight} kg</span>
                            </span>
                          ) : (
                            <span className="text-[11px] font-mono text-[#8A90A2]">30 kg (Başlangıç)</span>
                          )}
                          <span>•</span>
                          <span>Hedef: <strong className="text-white">{exMeta.targetMuscle}</strong></span>
                        </div>
                      </div>

                      {/* Header Toolset: Reorder, Guide & Delete */}
                      <div className="flex items-center space-x-1 shrink-0">
                        {/* Move Up */}
                        <button
                          type="button"
                          disabled={isFirst}
                          onClick={() => handleMoveExercise(exIdx, 'up')}
                          title="Yukarı Taşı"
                          className="w-7 h-7 rounded-lg bg-[#121317] hover:bg-[#292A2E] text-[#A0A5B5] hover:text-white border border-[#262936] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={isLast}
                          onClick={() => handleMoveExercise(exIdx, 'down')}
                          title="Aşağı Taşı"
                          className="w-7 h-7 rounded-lg bg-[#121317] hover:bg-[#292A2E] text-[#A0A5B5] hover:text-white border border-[#262936] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenExerciseDetail(workoutEx.exerciseId)}
                          title="Rehberde Aç"
                          className="w-7 h-7 rounded-lg bg-[#121317] hover:bg-[#292A2E] text-[#A0A5B5] hover:text-[#FF5356] border border-[#262936] flex items-center justify-center transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveExercise(workoutEx.exerciseId)}
                          title="Hareketi Çıkar"
                          className="w-7 h-7 rounded-lg bg-[#121317] hover:bg-red-950/60 text-[#A0A5B5] hover:text-red-400 border border-[#262936] flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Sets Table: [Set 1 tamamlandı], [Set 2 tamamlandı], [Set 3 tamamlandı] */}
                    <div className="space-y-2">
                      {workoutEx.sets.map((set) => {
                        const weight = set.completedWeight !== undefined ? set.completedWeight : set.targetWeight;
                        const reps = set.completedReps !== undefined ? set.completedReps : set.targetReps;

                        return (
                          <div
                            key={set.id}
                            className={`p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
                              set.isCompleted
                                ? 'bg-[#121317] border-emerald-500/50 text-white'
                                : 'bg-[#181920] border-[#FF1E38]/30 hover:border-[#FF1E38]'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5">
                              {/* Set N Badge */}
                              <div
                                className={`w-7 h-7 rounded-lg text-white font-extrabold text-xs flex items-center justify-center font-mono shrink-0 ${
                                  set.isCompleted ? 'bg-emerald-600' : 'bg-[#292A2E]'
                                }`}
                              >
                                {set.setNumber}
                              </div>

                              {/* Ağırlık Stepper */}
                              <div className="flex items-center space-x-1">
                                <span className="text-[10px] font-bold text-[#A0A5B5] uppercase hidden xs:inline">
                                  Ağırlık:
                                </span>
                                <div className="flex items-center space-x-0.5 bg-[#121317] rounded-lg border border-[#262936] px-1 py-0.5">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateSetWeight(workoutEx.exerciseId, set.id, -2.5)}
                                    className="w-5 h-6 rounded bg-[#1F1F24] hover:bg-[#292A2E] text-white font-bold text-xs flex items-center justify-center"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => handleDirectSetWeight(workoutEx.exerciseId, set.id, e.target.value)}
                                    className="font-mono text-xs font-bold text-white w-12 text-center bg-transparent focus:outline-none focus:text-[#FF5356]"
                                    step="0.5"
                                  />
                                  <span className="text-[10px] font-mono text-[#A0A5B5] pr-1">kg</span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateSetWeight(workoutEx.exerciseId, set.id, 2.5)}
                                    className="w-5 h-6 rounded bg-[#1F1F24] hover:bg-[#292A2E] text-white font-bold text-xs flex items-center justify-center"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* Tekrar Stepper (Default 12, can raise with + if > 12) */}
                              <div className="flex items-center space-x-1">
                                <span className="text-[10px] font-bold text-[#A0A5B5] uppercase hidden xs:inline">
                                  Tekrar:
                                </span>
                                <div className="flex items-center space-x-0.5 bg-[#121317] rounded-lg border border-[#262936] px-1 py-0.5">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateSetReps(workoutEx.exerciseId, set.id, -1)}
                                    className="w-5 h-6 rounded bg-[#1F1F24] hover:bg-[#292A2E] text-white font-bold text-xs flex items-center justify-center"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    value={reps}
                                    onChange={(e) => handleDirectSetReps(workoutEx.exerciseId, set.id, e.target.value)}
                                    className="font-mono text-xs font-bold text-white w-8 text-center bg-transparent focus:outline-none focus:text-[#FF5356]"
                                    min="1"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleUpdateSetReps(workoutEx.exerciseId, set.id, 1);
                                      const cur = set.completedReps !== undefined ? set.completedReps : set.targetReps;
                                      if (cur >= 12) {
                                        showToast(`🔥 12 tekrar aşıldı (${cur + 1} tekrar)! Artık '+' butonuyla yeni set ekleyebilirsiniz.`);
                                      }
                                    }}
                                    title="12 tekrar fazla olursa + ile yükselt"
                                    className="w-5 h-6 rounded bg-[#1F1F24] hover:bg-[#292A2E] text-[#FF5356] font-extrabold text-xs flex items-center justify-center"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* [Set N tamamlandı] yerine Kırmızı Tik veya + İşareti */}
                            <div className="flex items-center justify-end space-x-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleToggleSet(workoutEx.exerciseId, set.id)}
                                title={
                                  set.isCompleted
                                    ? `Set ${set.setNumber} Tamamlandı (Kırmızı Tik ✓) - Geri Almak İçin Tıkla`
                                    : `Set ${set.setNumber} Tamamla (+ işareti)`
                                }
                                className={`h-9 px-3 sm:px-3.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all active:scale-95 shadow-sm group ${
                                  set.isCompleted
                                    ? 'bg-[#270E12] hover:bg-[#341217] text-[#FF1E38] border-2 border-[#FF1E38] shadow-md shadow-[#FF1E38]/30'
                                    : 'bg-[#181920] hover:bg-[#261518] text-white border border-[#FF1E38]/50 hover:border-[#FF1E38]'
                                }`}
                              >
                                {set.isCompleted ? (
                                  <>
                                    <span className="w-5 h-5 rounded-md bg-[#FF1E38] flex items-center justify-center text-white shrink-0 shadow-sm drop-shadow-[0_0_8px_rgba(255,30,56,0.7)]">
                                      <Check className="w-3.5 h-3.5 stroke-[4px] text-white" />
                                    </span>
                                    <span className="font-extrabold text-xs text-[#FF334B] flex items-center space-x-1">
                                      <span>Set {set.setNumber}</span>
                                      <Check className="w-4 h-4 text-[#FF1E38] stroke-[3.5px] inline drop-shadow-[0_0_6px_rgba(255,30,56,0.8)]" />
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="w-5 h-5 rounded-md bg-[#2B1417] group-hover:bg-[#FF1E38] border border-[#FF1E38]/70 flex items-center justify-center text-[#FF1E38] group-hover:text-white font-black text-sm shrink-0 transition-colors shadow-sm">
                                      +
                                    </span>
                                    <span className="font-bold text-xs text-[#E3E2E8]">
                                      Set {set.setNumber}
                                    </span>
                                  </>
                                )}
                              </button>

                              {workoutEx.sets.length > 3 && set.setNumber > 3 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSetFromExercise(workoutEx.exerciseId, set.id)}
                                  title="Ek Seti Kaldır"
                                  className="w-7 h-9 text-[#5A6072] hover:text-red-400 flex items-center justify-center transition-colors"
                                >
                                  <CloseIcon className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Set Yükseltme: Kural gereği sadece 12 tekrar fazla olursa (13+) + ile yükseltilebilir */}
                      {workoutEx.sets.length < 5 && (() => {
                        const maxReps = Math.max(
                          ...workoutEx.sets.map((s) => (s.completedReps !== undefined ? s.completedReps : s.targetReps))
                        );
                        const canIncrease = maxReps > 12;

                        return (
                          <div className="pt-1">
                            {canIncrease ? (
                              <button
                                type="button"
                                onClick={() => handleAddFourthSet(workoutEx.exerciseId)}
                                className="w-full py-2.5 px-3 rounded-xl bg-[#261215] hover:bg-[#38161B] border-2 border-[#FF1E38] text-xs font-black text-white flex items-center justify-center space-x-2 transition-all active:scale-98 shadow-md shadow-[#FF1E38]/25 animate-pulse"
                              >
                                <div className="w-5 h-5 rounded-md bg-[#FF1E38] text-white flex items-center justify-center font-black text-xs shadow-sm">
                                  +
                                </div>
                                <span>+ {workoutEx.sets.length + 1}. Seti Ekle (12 Tekrar Aşıldı: {maxReps} Tekrar!)</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  showToast(`⚠️ Set artırma kuralı: Setler sadece 12 tekrardan fazla (13+) olursa '+' ile yükseltilebilir. Şu an: ${maxReps} tekrar. Önce tekrar sayısını '+' ile 12'nin üzerine çıkarın!`);
                                }}
                                className="w-full py-2 px-3 rounded-xl bg-[#14151B] border border-dashed border-[#383B47] text-[11px] font-medium text-[#7A8094] flex items-center justify-center space-x-2 hover:border-[#FF1E38]/40 hover:text-[#A0A5B5] transition-all cursor-pointer"
                                title="Setler sadece 12 tekrardan fazla olursa + ile yükseltilebilir"
                              >
                                <Lock className="w-3.5 h-3.5 text-[#7A8094]" />
                                <span>+ Set Yükselt: Sadece 12 tekrar fazla olursa (13+) '+' ile açılır (Şu an: {maxReps} tekrar)</span>
                              </button>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Her Hareket Setinin Aşağısında Kalan İpuçları & Dikkat Edilmesi Gerekenler */}
                    {(() => {
                      const tips = getComprehensiveExerciseTips(workoutEx.exerciseId, exMeta);

                      return (
                        <div className="rounded-xl bg-[#14151B] border border-[#2B2E3D] p-3 space-y-2 text-xs shadow-inner">
                          {/* Kritik Hata & Dikkat Alert Box */}
                          <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-900/50 flex items-start space-x-2 text-red-200">
                            <AlertTriangle className="w-4 h-4 text-[#FF334B] shrink-0 mt-0.5" />
                            <div className="text-[11px] leading-snug">
                              <span className="font-black text-[#FF5356] uppercase tracking-wide mr-1.5">
                                ⚠️ DİKKAT EDİLMESİ GEREKEN / KRİTİK HATA:
                              </span>
                              <span className="font-medium text-red-100">{tips.criticalMistake}</span>
                            </div>
                          </div>

                          {/* Doğru Form & Nasıl Yapılır İpuçları */}
                          <div className="space-y-1.5 pt-0.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1.5 text-[11px] font-extrabold text-white">
                                <span className="text-amber-400 text-sm">💡</span>
                                <span className="uppercase tracking-wide">HAREKET İPUÇLARI & FORM REHBERİ:</span>
                              </div>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1F212B] text-amber-300 font-mono font-bold border border-amber-500/30">
                                SETLERİN ALTINDA
                              </span>
                            </div>
                            <ul className="space-y-1 pl-4 list-disc text-[11px] text-[#D0D4E4] leading-relaxed">
                              {tips.formCues.map((cue, cIdx) => (
                                <li key={cIdx}>{cue}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Nefes, Tempo & Odak Kas */}
                          <div className="pt-2 border-t border-[#222430] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[#A0A5B5]">
                            <span className="flex items-center space-x-1">
                              <span>🫁 <strong>Nefes:</strong></span>
                              <span className="text-[#C5C9D8]">{tips.breathing}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <span>⏱️ <strong>Tempo:</strong></span>
                              <span className="text-amber-300 font-bold">{tips.tempo}</span>
                            </span>
                          </div>

                          {/* Biyomekanik Çizim & YouTube Açma Butonları */}
                          <div className="pt-1.5 flex items-center justify-between border-t border-[#1F212B]">
                            <button
                              type="button"
                              onClick={() => toggleGuide(workoutEx.exerciseId)}
                              className="text-[11px] font-bold text-[#FF5356] hover:text-[#FF7073] flex items-center space-x-1 transition-colors"
                            >
                              <span>{isExpanded ? 'Biyomekanik Şemayı Kapat ▲' : 'Biyomekanik Şemayı İncele ▼'}</span>
                            </button>
                            <a
                              href={`https://www.youtube.com/results?search_query=${encodeURIComponent((exMeta.name || '') + ' doğru form yapılışı rehberi')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold text-[#A0A5B5] hover:text-white flex items-center space-x-1 transition-colors"
                            >
                              <Video className="w-3.5 h-3.5 text-[#FF5356]" />
                              <span>YouTube'da Form Videosu</span>
                            </a>
                          </div>

                          {isExpanded && (
                            <div className="mt-2 pt-2 border-t border-[#262936] space-y-2">
                              <div className="relative rounded-xl overflow-hidden">
                                <BiomechanicDiagram type={getDiagramType(workoutEx.exerciseId)} showLabels={true} />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Card Bottom: Summary Stats */}
                    <div className="pt-1 flex items-center justify-between text-[11px] text-[#A0A5B5] font-mono">
                      <span>{completedCountForEx} / {workoutEx.sets.length} Set Tamamlandı</span>
                      <span>
                        Hacim: {workoutEx.sets.filter((s) => s.isCompleted).reduce((sum, s) => sum + (s.completedWeight || s.targetWeight) * (s.completedReps || s.targetReps), 0)} kg
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Sticky Bottom Finish Workout Action */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowFinishModal(true)}
              className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#FF1E38] via-[#FF334B] to-[#FF5356] hover:brightness-110 text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-xl shadow-[#FF1E38]/25 transition-all active:scale-[0.98]"
            >
              <Award className="w-5 h-5" />
              <span>Antrenmanı Bitir & Kaydet</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB: 4-MONTH WORKOUT ROADMAP (Yol Haritası)
         ======================================================== */}
      {activeSubTab === 'roadmap' && (
        <div className="space-y-4 animate-fadeIn select-none">
          {/* Roadmap Header & Mission Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1C1E26] via-[#14151B] to-[#121317] border-2 border-[#FF1E38]/40 shadow-xl space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#FF1E38]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF1E38] animate-ping" />
                  <span className="text-[10px] font-extrabold text-[#FF5356] uppercase tracking-wider font-mono">
                    BİLİMSEL GELİŞİM PLANI
                  </span>
                </div>
                <h3 className="text-lg font-black text-white flex items-center space-x-2">
                  <Compass className="w-5 h-5 text-[#FF1E38]" />
                  <span>4 Aylık Antrenman Yol Haritası</span>
                </h3>
                <p className="text-xs text-[#A0A5B5]">
                  110 kg &rarr; 85 kg Define Atlet Dönüşümü • Bel Fıtığı Korumalı & Spinal-Safe
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-[#121317] border border-[#262936] text-right font-mono shrink-0">
                <span className="text-[9px] text-[#A0A5B5] block uppercase font-bold">Toplam Süre</span>
                <span className="text-xs font-black text-white">16 Hafta • 112 Gün</span>
              </div>
            </div>

            {/* 4 Phases Progress Tracker Bar */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[
                { phase: 1, weeks: '1-4. Hafta', title: '1. Ay: Adaptasyon', color: 'from-blue-600 to-cyan-600' },
                { phase: 2, weeks: '5-8. Hafta', title: '2. Ay: Hacim', color: 'from-emerald-600 to-teal-600' },
                { phase: 3, weeks: '9-12. Hafta', title: '3. Ay: Progresif', color: 'from-amber-600 to-orange-600' },
                { phase: 4, weeks: '13-16. Hafta', title: '4. Ay: Zirve & Definasyon', color: 'from-[#FF1E38] to-rose-600' },
              ].map((p) => {
                const isActive = roadmapPhase === p.phase;
                return (
                  <button
                    key={p.phase}
                    type="button"
                    onClick={() => setRoadmapPhase(p.phase)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      isActive
                        ? 'bg-[#1F1F26] border-[#FF1E38] shadow-md shadow-[#FF1E38]/20 scale-[1.02]'
                        : 'bg-[#121317] border-[#262936] hover:border-[#383B47] opacity-80'
                    }`}
                  >
                    <span className="text-[9px] font-mono font-bold text-[#A0A5B5] block">
                      {p.weeks}
                    </span>
                    <span className="text-[11px] font-extrabold text-white truncate block">
                      {p.title}
                    </span>
                    <div className="w-full h-1 rounded-full bg-[#262936] mt-1.5 overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${p.color}`} style={{ width: '100%' }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Phase Details Card */}
          <div className="p-4 rounded-2xl bg-[#181920] border border-[#262936] space-y-3">
            <div className="flex items-center justify-between border-b border-[#262936] pb-2.5">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-[#FF5356]" />
                <h4 className="text-sm font-extrabold text-white">
                  {roadmapPhase === 1 && '1. Faz: Form Standardizasyonu & Eklem Güçlendirme (1-4. Hafta)'}
                  {roadmapPhase === 2 && '2. Faz: Hacim Artışı & Kardiyo Kondisyonu (5-8. Hafta)'}
                  {roadmapPhase === 3 && '3. Faz: Progresif Aşırı Yüklenme & Hipertrofi (9-12. Hafta)'}
                  {roadmapPhase === 4 && '4. Faz: Maksimum Yağ Yakımı & 85 kg Zirve Definasyon (13-16. Hafta)'}
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#121317] border border-[#262936] text-[#A0A5B5]">
                RPE {roadmapPhase === 1 ? '7.0 - 7.5' : roadmapPhase === 2 ? '7.5 - 8.0' : roadmapPhase === 3 ? '8.0 - 9.0' : '8.5 - 9.5'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#121317] border border-[#262936]">
                <span className="text-[10px] font-bold text-[#A0A5B5] block uppercase">Ağırlık Yüklenmesi</span>
                <p className="text-white font-semibold mt-1">
                  {roadmapPhase === 1 && '3x12 kontrollü tempo, 2-0-2 ritmi, form mükemmelleştirme.'}
                  {roadmapPhase === 2 && 'Her hafta +1.25/+2.5 kg artış, set aralarında 90 sn toparlanma.'}
                  {roadmapPhase === 3 && 'Ağır presler ve izolasyonlarda tepe ağırlıklar, RPE 8.5+.'}
                  {roadmapPhase === 4 && 'Drop-set ve dinlenme-duraklatma (rest-pause) teknikleri, yüksek definasyon.'}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#121317] border border-[#262936]">
                <span className="text-[10px] font-bold text-[#A0A5B5] block uppercase">Kardiyo Protokolü</span>
                <p className="text-[#FF5356] font-semibold mt-1">
                  {roadmapPhase === 1 && '25-30 dk • %8-10 Eğim • 4.2-4.5 km/h Zone 2'}
                  {roadmapPhase === 2 && '30-35 dk • %10-12 Eğim • 4.5 km/h Zone 2'}
                  {roadmapPhase === 3 && '35 dk • %12 Eğim • 4.5-4.8 km/h Yağ Oksidasyonu'}
                  {roadmapPhase === 4 && '35-40 dk • %12-14 Eğim • Maksimum Termojenik Yakım'}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#121317] border border-[#262936]">
                <span className="text-[10px] font-bold text-[#A0A5B5] block uppercase">Bel & Omurga Disiplini</span>
                <p className="text-emerald-400 font-semibold mt-1">
                  Aksiyel omurga yükü yok. Tüm hareketler göğüs/sırt destekli ve makine odaklıdır.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive 7-Day Weekly Workout Breakdown */}
          <div className="p-4 rounded-2xl bg-[#181920] border border-[#262936] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#FF1E38]" />
                <h4 className="text-sm font-extrabold text-white">Haftalık Antrenman Takvimi & Programı</h4>
              </div>
              <span className="text-[10px] font-mono text-[#A0A5B5]">Günü Seç & Canlı Başlat</span>
            </div>

            {/* Days Selector */}
            <div className="grid grid-cols-7 gap-1">
              {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map((dName) => {
                const plan = FOUR_MONTH_WEEKLY_WORKOUT_DAYS[dName];
                const isSelected = roadmapSelectedDay === dName;
                const isRest = plan?.isRestDay;
                const shortNames: Record<string, string> = {
                  Pazartesi: 'Pzt',
                  Salı: 'Sal',
                  Çarşamba: 'Çar',
                  Perşembe: 'Per',
                  Cuma: 'Cum',
                  Cumartesi: 'Cmt',
                  Pazar: 'Paz',
                };
                return (
                  <button
                    key={dName}
                    type="button"
                    onClick={() => setRoadmapSelectedDay(dName)}
                    className={`py-2 px-1 rounded-xl text-center border transition-all ${
                      isSelected
                        ? 'bg-[#FF1E38] border-[#FF1E38] text-white shadow-md font-bold'
                        : isRest
                        ? 'bg-[#121317] border-[#262936] text-[#6A7082] hover:text-[#A0A5B5]'
                        : 'bg-[#121317] border-[#262936] text-white hover:border-[#383B47]'
                    }`}
                  >
                    <span className="text-[10px] font-bold block">{shortNames[dName]}</span>
                    <span className="text-[9px] font-mono opacity-80 block truncate">
                      {isRest ? 'Dinlenme' : plan.focusTitle.split('+')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Day Workout Details */}
            {(() => {
              const currentDayPlan = FOUR_MONTH_WEEKLY_WORKOUT_DAYS[roadmapSelectedDay];
              if (!currentDayPlan) return null;

              return (
                <div className="p-3.5 rounded-xl bg-[#121317] border border-[#262936] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#262936] pb-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-extrabold text-white">{roadmapSelectedDay}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          currentDayPlan.isRestDay
                            ? 'bg-blue-950/40 text-blue-300 border-blue-500/30'
                            : 'bg-[#FF1E38]/20 text-[#FF5356] border-[#FF1E38]/40'
                        }`}>
                          {currentDayPlan.focusTitle}
                        </span>
                      </div>
                      <p className="text-xs text-[#A0A5B5] mt-0.5">{currentDayPlan.notes}</p>
                    </div>

                    {!currentDayPlan.isRestDay && (
                      <button
                        type="button"
                        onClick={() => handleLoadRoadmapDayToSession(roadmapSelectedDay)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FF1E38] to-[#FF5356] hover:brightness-110 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-lg shadow-[#FF1E38]/25 active:scale-95 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Bu Günü Canlı Başlat</span>
                      </button>
                    )}
                  </div>

                  {!currentDayPlan.isRestDay ? (
                    <div className="space-y-2">
                      {/* Cardio Summary Badge */}
                      <div className="p-2.5 rounded-xl bg-[#181920] border border-amber-500/20 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="font-bold text-white">Eğimli Yürüyüş Bandı Kardiyo:</span>
                        </div>
                        <span className="font-mono text-amber-300 font-bold">
                          {currentDayPlan.cardioMinutes} dk • %{currentDayPlan.cardioIncline} Eğim • {currentDayPlan.cardioSpeed} km/h • ~{Math.round(currentDayPlan.cardioMinutes * 10)} kcal
                        </span>
                      </div>

                      {/* Exercises List */}
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-bold text-[#A0A5B5] uppercase px-1">
                          Günün Egzersizleri ({currentDayPlan.exercises.length} Hareket):
                        </div>
                        <div className="grid grid-cols-1 gap-1.5">
                          {currentDayPlan.exercises.map((ex, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-[#181920] border border-[#262936] flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                                <span className="w-5 h-5 rounded-lg bg-[#121317] border border-[#262936] text-[10px] font-mono text-[#A0A5B5] flex items-center justify-center font-bold">
                                  {idx + 1}
                                </span>
                                <div className="min-w-0">
                                  <span className="font-bold text-white block truncate">{ex.exerciseName}</span>
                                  <span className="text-[10px] text-[#A0A5B5]">{ex.targetMuscle}</span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 font-mono text-right shrink-0">
                                <span className="px-2 py-0.5 rounded bg-[#121317] border border-[#262936] text-white font-bold">
                                  {ex.sets} Set x {ex.reps} Tekrar
                                </span>
                                <span className="px-2 py-0.5 rounded bg-[#FF1E38]/20 border border-[#FF1E38]/40 text-[#FF5356] font-bold">
                                  {ex.defaultWeightKg > 0 ? `${ex.defaultWeightKg} kg` : 'Vücut Ağ.'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <h5 className="text-sm font-extrabold text-white">Aktif Toparlanma & Dinlenme Günü</h5>
                      <p className="text-xs text-[#A0A5B5] max-w-md mx-auto">
                        Kas dokusunun büyümesi ve merkezi sinir sisteminin toparlanması için ağırlık antrenmanı yapılmaz. Bol su için (4L) ve isteğe bağlı 30-40 dk hafif yürüyüş yapın.
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Spine-Safe & Excluded Exercises Safety Guard */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/30 to-[#121317] border border-red-500/30 space-y-2">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-[#FF5356]" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Bel Fıtığı Koruması • 4 Ay Boyunca Yasaklı Hareketler
              </h4>
            </div>
            <p className="text-xs text-[#A0A5B5]">
              Omurgaya direkt kompresyon veya bel fleksiyonu yükleyen şu hareketler programdan tamamen çıkarılmıştır:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {EXCLUDED_EXERCISES_FOR_HERNIATED_DISC.map((exName, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg bg-red-950/50 border border-red-800/40 text-red-300 text-[10px] font-mono"
                >
                  ✕ {exName}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: WORKOUT HISTORY & ARCHIVE VIEW (Persisted Data)
         ======================================================== */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          {/* Historical Telemetry Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-3 rounded-2xl bg-[#1F1F24] border border-[#262936] text-center">
              <span className="text-[10px] text-[#A0A5B5] uppercase font-bold block">Toplam Seans</span>
              <span className="text-xl font-extrabold text-white font-mono mt-0.5 block">
                {historySummary.totalSessions}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#1F1F24] border border-[#262936] text-center">
              <span className="text-[10px] text-[#A0A5B5] uppercase font-bold block">Kaldırılan Tonaj</span>
              <span className="text-xl font-extrabold text-[#FF5356] font-mono mt-0.5 block">
                {historySummary.totalVolume > 0 ? `${Math.round(historySummary.totalVolume / 1000)}t` : '0t'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#1F1F24] border border-[#262936] text-center">
              <span className="text-[10px] text-[#A0A5B5] uppercase font-bold block">Toplam Süre</span>
              <span className="text-xl font-extrabold text-amber-400 font-mono mt-0.5 block">
                {Math.round(historySummary.totalMinutes / 60)}s {historySummary.totalMinutes % 60}dk
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#1F1F24] border border-[#262936] text-center">
              <span className="text-[10px] text-[#A0A5B5] uppercase font-bold block">Ort. Set / Seans</span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5 block">
                {historySummary.avgSets}
              </span>
            </div>
          </div>

          {/* Action Header & Search */}
          <div className="rounded-2xl bg-[#1F1F24] border border-[#262936] p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-white">Antrenman Arşivi</h3>
                <p className="text-[11px] text-[#A0A5B5]">Kaydedilen tüm antrenmanlar ve geçmiş setler</p>
              </div>

              <button
                type="button"
                onClick={() => setIsManualModalOpen(true)}
                className="h-8 px-3 rounded-xl bg-[#121317] hover:bg-[#292A2E] text-white text-xs font-bold border border-[#262936] hover:border-[#FF1E38]/50 flex items-center space-x-1.5 transition-all"
              >
                <FilePlus className="w-3.5 h-3.5 text-[#FF5356]" />
                <span>+ Manuel Ekle</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#A0A5B5] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Antrenman adı, tarih veya not ara..."
                value={historySearchQuery}
                onChange={(e) => setHistorySearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 rounded-xl bg-[#121317] border border-[#262936] text-xs text-white placeholder-[#5A6072] focus:outline-none focus:border-[#FF1E38]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 text-[11px]">
              {[
                { id: 'all', label: 'Tümü' },
                { id: 'push', label: 'İtiş (Push)' },
                { id: 'pull', label: 'Çekiş (Pull)' },
                { id: 'legs', label: 'Bacak (Legs)' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setHistoryFilterType(pill.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 ${
                    historyFilterType === pill.id
                      ? 'bg-[#FF1E38] text-white shadow-sm'
                      : 'bg-[#121317] text-[#A0A5B5] hover:text-white border border-[#262936]'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Past Workouts */}
          {filteredWorkoutHistory.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#1F1F24] border border-[#262936] text-center space-y-2">
              <History className="w-8 h-8 text-[#A0A5B5] mx-auto opacity-50" />
              <h4 className="text-sm font-bold text-white">Kayıtlı Antrenman Bulunamadı</h4>
              <p className="text-xs text-[#A0A5B5]">
                {historySearchQuery ? 'Arama kriterlerinize uyan antrenman yok.' : 'Canlı antrenman seansınızı tamamlayarak veya manuel ekleyerek kayıt tutabilirsiniz.'}
              </p>
            </div>
          ) : (
            filteredWorkoutHistory.map((item) => {
              const isExpanded = expandedHistoryId === item.id;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-[#1F1F24] border border-[#262936] overflow-hidden hover:border-[#383A47] transition-all"
                >
                  <div
                    onClick={() => setExpandedHistoryId(isExpanded ? null : item.id)}
                    className="p-4 cursor-pointer hover:bg-[#25262C] transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 text-xs font-bold text-[#FF5356] mb-1 font-mono">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{item.date}</span>
                        </div>
                        <h4 className="text-sm font-extrabold text-white">{item.title}</h4>
                      </div>

                      <div className="flex items-center space-x-2">
                        {onDeleteWorkoutHistory && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteWorkoutHistory(item.id);
                              showToast('Antrenman kaydı silindi.');
                            }}
                            className="w-7 h-7 rounded-lg bg-[#121317] hover:bg-red-950/60 text-[#A0A5B5] hover:text-red-400 flex items-center justify-center transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <span className="text-[#A0A5B5]">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      </div>
                    </div>

                    {/* Stat Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                      <span className="text-[11px] font-mono font-bold bg-[#121317] px-2 py-0.5 rounded border border-[#262936] text-white">
                        ⏱️ {item.durationMinutes} dk
                      </span>
                      <span className="text-[11px] font-mono font-bold bg-red-950/40 px-2 py-0.5 rounded border border-red-900/30 text-[#FF5356]">
                        🏋️ {item.totalVolumeKg > 0 ? `${item.totalVolumeKg.toLocaleString('tr-TR')} kg` : 'Kardiyo'}
                      </span>
                      <span className="text-[11px] font-mono font-bold bg-[#121317] px-2 py-0.5 rounded border border-[#262936] text-amber-300">
                        ✓ {item.totalSetsCompleted} Set
                      </span>
                      {item.cardio && (
                        <span className="text-[11px] font-mono font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/30 text-emerald-400">
                          🏃 {item.cardio.durationMinutes} dk Kardiyo (+{item.cardio.caloriesBurned} kcal)
                        </span>
                      )}
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-[#A0A5B5] italic mt-2 border-t border-[#262936] pt-1.5">
                        "{item.notes}"
                      </p>
                    )}
                  </div>

                  {/* Expanded Sets Details & Repeat Button */}
                  {isExpanded && (
                    <div className="p-4 pt-0 border-t border-[#262936] bg-[#14151C] space-y-3 text-xs">
                      {item.exercises && item.exercises.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-extrabold text-[#A0A5B5] uppercase tracking-wider block mt-3">
                            YAPILAN HAREKETLER & SET DETAYLARI:
                          </span>
                          {item.exercises.map((ex, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-[#1F1F24] border border-[#262936] space-y-1.5">
                              <div className="font-bold text-white flex items-center justify-between">
                                <span>{idx + 1}. {ex.exerciseName}</span>
                                <span className="text-[10px] text-[#A0A5B5]">{ex.sets.length} Set</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {ex.sets.map((s, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                                      s.isCompleted
                                        ? 'bg-[#121317] border-[#FF1E38]/40 text-white'
                                        : 'bg-[#121317] border-[#262936] text-[#A0A5B5]'
                                    }`}
                                  >
                                    S{s.setNumber}: {s.weight}kg x {s.reps} {s.isCompleted ? '✓' : ''}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Repeat past workout button */}
                      <button
                        type="button"
                        onClick={() => handleRepeatPastWorkout(item)}
                        className="w-full py-2.5 rounded-xl bg-[#1F1F24] hover:bg-[#FF1E38] text-white text-xs font-bold border border-[#262936] hover:border-[#FF1E38] flex items-center justify-center space-x-2 transition-all shadow-sm"
                      >
                        <Repeat className="w-3.5 h-3.5 text-[#FF5356] group-hover:text-white" />
                        <span>🔁 Bu Antrenmanı Canlı Seansa Yükle (Tekrar Yap)</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ========================================================
          TAB 3: WORKOUT PROGRAMS & SPLIT SELECTOR
         ======================================================== */}
      {activeSubTab === 'programs' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#1F1F24] border border-[#262936] p-4 shadow-sm space-y-3">
            <div>
              <h3 className="text-base font-extrabold text-white">Hazır Antrenman Splitleri</h3>
              <p className="text-xs text-[#A0A5B5]">Dilediğiniz spliti seçerek canlı antrenman akışınıza anında yükleyin:</p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleLoadSplit('push')}
                className="w-full p-3 rounded-xl bg-[#121317] hover:bg-[#1C1D24] border border-[#262936] hover:border-[#FF1E38]/60 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-[#FF5356] bg-red-950/40 px-1.5 py-0.5 rounded border border-red-900/30">
                      İTİŞ (PUSH)
                    </span>
                    <h4 className="text-xs font-bold text-white">Göğüs • Ön Omuz • Triceps</h4>
                  </div>
                  <p className="text-[10px] text-[#A0A5B5] mt-1">Bench Press, Incline Press, Dips, Lateral Raise, Triceps Pushdown</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#A0A5B5] group-hover:text-white transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => handleLoadSplit('pull')}
                className="w-full p-3 rounded-xl bg-[#121317] hover:bg-[#1C1D24] border border-[#262936] hover:border-[#FF1E38]/60 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-900/30">
                      ÇEKİŞ (PULL)
                    </span>
                    <h4 className="text-xs font-bold text-white">Sırt • Biceps • Arka Omuz</h4>
                  </div>
                  <p className="text-[10px] text-[#A0A5B5] mt-1">Deadlift, Barfiks, Cable Row, Face Pull, Barbell Biceps Curl</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#A0A5B5] group-hover:text-white transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => handleLoadSplit('legs')}
                className="w-full p-3 rounded-xl bg-[#121317] hover:bg-[#1C1D24] border border-[#262936] hover:border-[#FF1E38]/60 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-900/30">
                      BACAK (LEGS)
                    </span>
                    <h4 className="text-xs font-bold text-white">Quadriceps • Hamstrings • Kalf • Karın</h4>
                  </div>
                  <p className="text-[10px] text-[#A0A5B5] mt-1">Back Squat, 45° Leg Press, Romanian Deadlift, Leg Extension, Cable Crunch</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#A0A5B5] group-hover:text-white transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => handleLoadSplit('upper')}
                className="w-full p-3 rounded-xl bg-[#121317] hover:bg-[#1C1D24] border border-[#262936] hover:border-[#FF1E38]/60 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-900/30">
                      ÜST GÖVDE (UPPER)
                    </span>
                    <h4 className="text-xs font-bold text-white">Tüm Üst Gövde Hipertrofi</h4>
                  </div>
                  <p className="text-[10px] text-[#A0A5B5] mt-1">Bench Press, Bent-Over Row, Overhead Press, Cable Fly, Hammer Curl</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#A0A5B5] group-hover:text-white transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => handleLoadSplit('lower')}
                className="w-full p-3 rounded-xl bg-[#121317] hover:bg-[#1C1D24] border border-[#262936] hover:border-[#FF1E38]/60 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-purple-400 bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-900/30">
                      ALT GÖVDE & POSTERIOR (LOWER)
                    </span>
                    <h4 className="text-xs font-bold text-white">Alt Gövde Kuvvet & Stabilizasyon</h4>
                  </div>
                  <p className="text-[10px] text-[#A0A5B5] mt-1">Back Squat, Deadlift, Lying Leg Curl, Hanging Leg Raise, Leg Press</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#A0A5B5] group-hover:text-white transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => handleLoadSplit('fullbody')}
                className="w-full p-3 rounded-xl bg-[#121317] hover:bg-[#1C1D24] border border-[#262936] hover:border-[#FF1E38]/60 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-teal-400 bg-teal-950/40 px-1.5 py-0.5 rounded border border-teal-900/30">
                      TÜM VÜCUT (FULL BODY)
                    </span>
                    <h4 className="text-xs font-bold text-white">Bileşik Hareketler & Anabolik Uyarı</h4>
                  </div>
                  <p className="text-[10px] text-[#A0A5B5] mt-1">Squat, Bench Press, Bent-Over Row, Lateral Raise, Triceps Pushdown</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#A0A5B5] group-hover:text-white transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => handleLoadSplit('arnold')}
                className="w-full p-3 rounded-xl bg-[#121317] hover:bg-[#1C1D24] border border-[#262936] hover:border-[#FF1E38]/60 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-900/30">
                      ARNOLD SPLIT
                    </span>
                    <h4 className="text-xs font-bold text-white">Göğüs & Sırt Antagonist Süperset</h4>
                  </div>
                  <p className="text-[10px] text-[#A0A5B5] mt-1">Bench Press, Barfiks, Incline Dumbbell Press, Cable Row, Cable Fly</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#A0A5B5] group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          {/* User's Custom Wizard Programs */}
          {customPrograms.length > 0 && (
            <div className="rounded-2xl bg-[#1F1F24] border border-[#262936] p-4 shadow-sm space-y-3">
              <div>
                <h3 className="text-base font-extrabold text-white">Sihirbaz ile Oluşturulan Programlarınız</h3>
                <p className="text-xs text-[#A0A5B5]">Özel split günlerinizi doğrudan seansınıza aktarın:</p>
              </div>

              <div className="space-y-2">
                {customPrograms.map((prog) => (
                  <div key={prog.id} className="p-3 rounded-xl bg-[#121317] border border-[#262936] space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{prog.name}</h4>
                      <span className="text-[10px] text-amber-400 font-mono">{prog.splitDays}</span>
                    </div>

                    {prog.days && prog.days.length > 0 ? (
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        {prog.days.map((day, dIdx) => (
                          <button
                            key={day.id || dIdx}
                            type="button"
                            onClick={() => {
                              if (onApplyProgramToWorkout) {
                                onApplyProgramToWorkout(prog, dIdx);
                                setActiveSubTab('live');
                                showToast(`"${day.dayName}" seansa yüklendi!`);
                              }
                            }}
                            className="p-2 rounded-lg bg-[#1F1F24] hover:bg-[#292A2E] text-white text-[11px] font-bold border border-[#262936] text-left truncate transition-colors"
                          >
                            ⚡ {day.dayName}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (onApplyProgramToWorkout) {
                            onApplyProgramToWorkout(prog);
                            setActiveSubTab('live');
                            showToast(`"${prog.name}" seansa yüklendi!`);
                          }
                        }}
                        className="w-full py-1.5 rounded-lg bg-[#FF1E38] text-white text-xs font-bold"
                      >
                        Programı Canlı Seansa Yükle
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          FINISH WORKOUT CELEBRATION MODAL
         ======================================================== */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm bg-[#1A1C24] border border-[#262936] rounded-2xl p-5 shadow-2xl text-center space-y-3.5">
            <div className="w-14 h-14 rounded-full bg-[#FF1E38]/20 border border-[#FF1E38] text-[#FF5356] flex items-center justify-center mx-auto shadow-lg">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white">Antrenman Tamamlandı!</h3>
              <p className="text-xs text-[#A0A5B5] mt-0.5">
                {session.title}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="p-3 rounded-xl bg-[#121317] border border-[#262936] grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[10px] text-[#A0A5B5] uppercase block font-bold">Süre</span>
                <span className="text-sm font-bold text-white font-mono mt-0.5 block">
                  {formatTimer(elapsedSeconds)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#A0A5B5] uppercase block font-bold">Setler</span>
                <span className="text-sm font-bold text-white font-mono mt-0.5 block">
                  {completedSetsCount} / {totalSetsTarget}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#A0A5B5] uppercase block font-bold">Toplam Hacim</span>
                <span className="text-sm font-bold text-[#FF5356] font-mono mt-0.5 block">
                  {totalVolumeKg > 0 ? `${totalVolumeKg.toLocaleString('tr-TR')} kg` : '0 kg'}
                </span>
              </div>
            </div>

            {/* Reflection Note Input */}
            <div className="text-left space-y-1">
              <label className="text-[11px] font-bold text-[#A0A5B5]">Günün Antrenman Notu (İsteğe bağlı):</label>
              <textarea
                rows={2}
                placeholder="Örn: Bench press 90kg çok rahat çıktı, form harikaydı..."
                value={finishNotes}
                onChange={(e) => setFinishNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#121317] border border-[#262936] text-xs text-white placeholder-[#5A6072] focus:outline-none focus:border-[#FF1E38]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setShowFinishModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#292A2E] text-white text-xs font-bold hover:bg-[#343439] transition-colors"
              >
                Geri Dön
              </button>
              <button
                type="button"
                onClick={handleConfirmFinishWorkout}
                className="flex-1 py-2.5 rounded-xl bg-[#FF1E38] hover:bg-[#FF334B] text-white text-xs font-extrabold flex items-center justify-center space-x-1.5 shadow-lg shadow-[#FF1E38]/30 transition-all active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Seansı Kaydet</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ADD EXERCISE FROM CATALOG MODAL (Enhanced with search & filters)
         ======================================================== */}
      {isAddExerciseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#1A1C24] border border-[#262936] rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-[#262936] flex items-center justify-between bg-[#121317]">
              <div>
                <h3 className="text-sm font-extrabold text-white">Antrenmana Egzersiz Ekle</h3>
                <span className="text-[10px] text-[#A0A5B5]">{filteredCatalogExercises.length} egzersiz mevcut</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddExerciseModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#292A2E] text-[#A0A5B5] hover:text-white flex items-center justify-center transition-colors"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Search & Filters */}
            <div className="p-3 bg-[#16171F] border-b border-[#262936] space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#A0A5B5] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Hareket adı veya kas grubu ara..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 rounded-xl bg-[#121317] border border-[#262936] text-xs text-white placeholder-[#5A6072] focus:outline-none focus:border-[#FF1E38]"
                />
              </div>

              <div className="flex items-center space-x-1 overflow-x-auto pb-0.5 text-[10px]">
                {[
                  { id: 'all', label: 'Tümü' },
                  { id: 'push', label: 'İtiş' },
                  { id: 'pull', label: 'Çekiş' },
                  { id: 'legs', label: 'Bacak' },
                  { id: 'chest', label: 'Göğüs' },
                  { id: 'back', label: 'Sırt' },
                  { id: 'arms', label: 'Kol' },
                  { id: 'core', label: 'Karın' },
                ].map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setCatalogMuscleFilter(chip.id)}
                    className={`px-2 py-1 rounded-lg font-bold transition-all shrink-0 ${
                      catalogMuscleFilter === chip.id
                        ? 'bg-[#FF1E38] text-white shadow-sm'
                        : 'bg-[#121317] text-[#A0A5B5] hover:text-white border border-[#262936]'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredCatalogExercises.map((ex) => {
                const isAlreadyAdded = session.exercises.some((e) => e.exerciseId === ex.id);
                return (
                  <div
                    key={ex.id}
                    className="p-3 rounded-xl bg-[#121317] border border-[#262936] flex items-center justify-between hover:border-[#383A47] transition-all"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center space-x-1.5">
                        {ex.isPopular && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-red-950/60 text-[#FF5356] border border-red-900/40 font-bold">
                            🔥 Popüler
                          </span>
                        )}
                        <h4 className="text-xs font-bold text-white truncate">{ex.name}</h4>
                      </div>
                      <p className="text-[10px] text-[#A0A5B5] mt-0.5 truncate">
                        {ex.category} • {ex.equipment} • <strong className="text-white">{ex.targetMuscle}</strong>
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isAlreadyAdded}
                      onClick={() => handleAddExerciseFromCatalog(ex)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                        isAlreadyAdded
                          ? 'bg-[#292A2E] text-[#5A6072] cursor-not-allowed'
                          : 'bg-[#FF1E38] hover:bg-[#FF334B] text-white shadow-sm active:scale-95'
                      }`}
                    >
                      {isAlreadyAdded ? 'Ekli ✓' : '+ Ekle'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MANUAL WORKOUT LOGGING MODAL (Keep Past Workout Data)
         ======================================================== */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm bg-[#1A1C24] border border-[#262936] rounded-2xl p-5 shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#262936] pb-3">
              <div className="flex items-center space-x-2">
                <FilePlus className="w-4 h-4 text-[#FF5356]" />
                <h3 className="text-sm font-extrabold text-white">Geçmiş Antrenman Kaydet</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#292A2E] text-[#A0A5B5] hover:text-white flex items-center justify-center"
              >
                <CloseIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualWorkout} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-[#A0A5B5] uppercase block mb-1">Antrenman Başlığı</label>
                <input
                  type="text"
                  required
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="Örn: Göğüs & Kol Seansı"
                  className="w-full h-8 px-2.5 rounded-lg bg-[#121317] border border-[#262936] text-white focus:outline-none focus:border-[#FF1E38]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#A0A5B5] uppercase block mb-1">Tarih</label>
                  <input
                    type="date"
                    required
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg bg-[#121317] border border-[#262936] text-white focus:outline-none focus:border-[#FF1E38]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#A0A5B5] uppercase block mb-1">Süre (Dakika)</label>
                  <input
                    type="number"
                    required
                    min="5"
                    value={manualDuration}
                    onChange={(e) => setManualDuration(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg bg-[#121317] border border-[#262936] text-white font-mono text-center focus:outline-none focus:border-[#FF1E38]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#A0A5B5] uppercase block mb-1">Toplam Set</label>
                  <input
                    type="number"
                    min="1"
                    value={manualSets}
                    onChange={(e) => setManualSets(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg bg-[#121317] border border-[#262936] text-white font-mono text-center focus:outline-none focus:border-[#FF1E38]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#A0A5B5] uppercase block mb-1">Toplam Tonaj (kg)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={manualVolume}
                    onChange={(e) => setManualVolume(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg bg-[#121317] border border-[#262936] text-white font-mono text-center focus:outline-none focus:border-[#FF1E38]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#A0A5B5] uppercase block mb-1">Antrenman Notu</label>
                <textarea
                  rows={2}
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="Seans hissi, form detayları..."
                  className="w-full p-2 rounded-lg bg-[#121317] border border-[#262936] text-white focus:outline-none focus:border-[#FF1E38]"
                />
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-[#292A2E] text-white font-bold hover:bg-[#343439] transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#FF1E38] hover:bg-[#FF334B] text-white font-bold transition-all shadow-md active:scale-95"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notice */}
      {toastNotice && (
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50 animate-bounce">
          <div className="bg-[#1A1C24] border border-[#FF1E38] text-white p-3 rounded-xl shadow-2xl flex items-center justify-center space-x-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#FF5356]" />
            <span>{toastNotice}</span>
          </div>
        </div>
      )}
    </div>
  );
};
