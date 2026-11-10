import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DailyDashboardTab } from './components/tabs/DailyDashboardTab';
import { WorkoutLiveTab } from './components/tabs/WorkoutLiveTab';
import { NutritionTab } from './components/tabs/NutritionTab';
import { AnalyticsTab } from './components/tabs/AnalyticsTab';
import { ExerciseAtlasTab } from './components/tabs/ExerciseAtlasTab';
import { ProfileTab } from './components/tabs/ProfileTab';
import { ExerciseDetailModal } from './components/ExerciseDetailModal';
import { RestTimerModal } from './components/RestTimerModal';
import { NutritionModal } from './components/NutritionModal';
import { FullBodyMatrixModal } from './components/FullBodyMatrixModal';
import { FinishDayModal } from './components/FinishDayModal';
import { FourMonthProgramHubModal } from './components/FourMonthProgramHubModal';
import { MealItem } from './types/fitness';
import { generateFourMonthWeeklyCalendar } from './data/fourMonthFitnessPlan';
import {
  INITIAL_NUTRITION,
  INITIAL_CHECKINS,
  INITIAL_WORKOUT_SESSION,
  EXERCISES_DATA,
  ATHLETE_PROFILE,
} from './data/mockData';
import {
  DailyNutrition,
  CheckInItem,
  WorkoutSession,
  Exercise,
  AthleteProfile,
  DailyHistoryRecord,
  CompletedWorkoutRecord,
  CustomProgram,
  WizardExerciseItem,
} from './types/fitness';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'daily' | 'workout' | 'nutrition' | 'analytics' | 'guide' | 'profile'>('daily');
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [isFinishDayModalOpen, setIsFinishDayModalOpen] = useState<boolean>(false);
  const [isFourMonthModalOpen, setIsFourMonthModalOpen] = useState<boolean>(false);

  const handleApplyFourMonthMeals = (meals: MealItem[]) => {
    setNutrition((prev) => ({
      ...prev,
      energyTarget: 1750,
      proteinTarget: 185,
      carbsTarget: 145,
      fatsTarget: 44,
      hydrationTarget: 4.0,
      meals: meals,
      energyKcal: Math.round(meals.reduce((sum, m) => sum + (m.completed ? m.calories : 0), 0)),
      proteinGrams: Math.round(meals.reduce((sum, m) => sum + (m.completed ? m.protein : 0), 0)),
    }));
  };

  // Completed Workouts History state - truly empty if no saved data or after reset
  const [workoutHistory, setWorkoutHistory] = useState<CompletedWorkoutRecord[]>(() => {
    try {
      const saved = localStorage.getItem('avalanche_workout_history');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  // Sync workout history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('avalanche_workout_history', JSON.stringify(workoutHistory));
    } catch (err) {
      console.error('Failed to save workoutHistory', err);
    }
  }, [workoutHistory]);

  // Daily History state (all recorded historical days) - truly empty if no saved data or after reset
  const [dailyHistory, setDailyHistory] = useState<DailyHistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('avalanche_daily_history');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  // Sync daily history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('avalanche_daily_history', JSON.stringify(dailyHistory));
    } catch (err) {
      console.error('Failed to save dailyHistory', err);
    }
  }, [dailyHistory]);

  // Athlete Profile state with real-time streak sanitization ("14 gün diyor data yoksa 1e dönsün")
  const [profile, setProfile] = useState<AthleteProfile>(() => {
    try {
      const saved = localStorage.getItem('avalanche_profile');
      let baseProfile: AthleteProfile = ATHLETE_PROFILE;
      if (saved) {
        const parsed = JSON.parse(saved);
        baseProfile = {
          ...ATHLETE_PROFILE,
          ...parsed,
          name: 'Utku Can ER',
          heightCm: parsed.heightCm === 184 ? 177 : (parsed.heightCm || 177),
          weightKg: parsed.weightKg === 82.5 ? 110 : (parsed.weightKg || 110),
          age: parsed.age || 28,
          tier: undefined,
          zinciriKirma: parsed.zinciriKirma || ATHLETE_PROFILE.zinciriKirma,
        };
      }

      // Check whether real user data actually exists in storage
      const savedDaily = localStorage.getItem('avalanche_daily_history');
      const savedWorkouts = localStorage.getItem('avalanche_workout_history');
      let hasRealHistory = false;
      if (savedDaily) {
        try {
          const d = JSON.parse(savedDaily);
          if (Array.isArray(d) && d.some((r: any) => r.workoutCompleted || (r.completedMealsCount && r.completedMealsCount > 0))) {
            hasRealHistory = true;
          }
        } catch {}
      }
      if (savedWorkouts) {
        try {
          const w = JSON.parse(savedWorkouts);
          if (Array.isArray(w) && w.length > 0) {
            hasRealHistory = true;
          }
        } catch {}
      }
      if (baseProfile.zinciriKirma?.weeklyCalendar?.some((d) => d.completed)) {
        hasRealHistory = true;
      }
      if (baseProfile.sessionsCompleted && baseProfile.sessionsCompleted > 0) {
        hasRealHistory = true;
      }

      const rawStreak = baseProfile.zinciriKirma?.currentStreak ?? 1;

      // If no data exists, or if rawStreak is 14 (old mock legacy), revert to 1!
      if (!hasRealHistory || rawStreak === 14) {
        baseProfile = {
          ...baseProfile,
          sessionsCompleted: hasRealHistory ? (baseProfile.sessionsCompleted || 0) : 0,
          zinciriKirma: {
            ...baseProfile.zinciriKirma,
            currentStreak: 1,
            longestStreak: 1,
            totalDaysCompleted: 0,
            lastCompletedDate: undefined,
            weeklyCalendar: (baseProfile.zinciriKirma?.weeklyCalendar || generateFourMonthWeeklyCalendar()).map((d) => ({
              ...d,
              completed: false,
            })),
          },
        };
      }

      return baseProfile;
    } catch {
      return ATHLETE_PROFILE;
    }
  });

  // Nutrition state with localStorage fallback & deep schema migration (4.0L water target)
  const [nutrition, setNutrition] = useState<DailyNutrition>(() => {
    try {
      const saved = localStorage.getItem('apex_nutrition');
      if (!saved) return INITIAL_NUTRITION;
      const parsed = JSON.parse(saved);
      return {
        ...INITIAL_NUTRITION,
        ...parsed,
        proteinGrams: typeof parsed.proteinGrams === 'number' ? parsed.proteinGrams : INITIAL_NUTRITION.proteinGrams,
        proteinTarget: 185,
        energyKcal: typeof parsed.energyKcal === 'number' ? parsed.energyKcal : INITIAL_NUTRITION.energyKcal,
        energyTarget: 1750,
        carbsGrams: typeof parsed.carbsGrams === 'number' ? parsed.carbsGrams : INITIAL_NUTRITION.carbsGrams,
        carbsTarget: 145,
        fatsGrams: typeof parsed.fatsGrams === 'number' ? parsed.fatsGrams : INITIAL_NUTRITION.fatsGrams,
        fatsTarget: 44,
        hydrationLiters: typeof parsed.hydrationLiters === 'number' ? parsed.hydrationLiters : INITIAL_NUTRITION.hydrationLiters,
        hydrationTarget: 3.25, // 3.250 ml su hedefi
        sodiumMg: typeof parsed.sodiumMg === 'number' ? parsed.sodiumMg : INITIAL_NUTRITION.sodiumMg,
        sodiumTargetMg: typeof parsed.sodiumTargetMg === 'number' ? parsed.sodiumTargetMg : INITIAL_NUTRITION.sodiumTargetMg,
        goal: 'KİŞİSEL BESLENME DÜZENİ',
        meals: Array.isArray(parsed.meals) && parsed.meals.length > 0 ? parsed.meals : INITIAL_NUTRITION.meals,
        supplements: Array.isArray(parsed.supplements) && parsed.supplements.length > 0 ? parsed.supplements : INITIAL_NUTRITION.supplements,
      };
    } catch {
      return INITIAL_NUTRITION;
    }
  });

  // Daily CheckIns state
  const [checkIns, setCheckIns] = useState<CheckInItem[]>(() => {
    try {
      const saved = localStorage.getItem('apex_checkins');
      return saved ? JSON.parse(saved) : INITIAL_CHECKINS;
    } catch {
      return INITIAL_CHECKINS;
    }
  });

  // Live Workout Session state
  const [session, setSession] = useState<WorkoutSession>(() => {
    try {
      const saved = localStorage.getItem('apex_workout_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.exercises) && parsed.exercises.length > 0) {
          return {
            ...parsed,
            cardio: parsed.cardio || INITIAL_WORKOUT_SESSION.cardio,
          };
        }
      }
      return INITIAL_WORKOUT_SESSION;
    } catch {
      return INITIAL_WORKOUT_SESSION;
    }
  });

  // Modal States
  const [detailExercise, setDetailExercise] = useState<Exercise | null>(null);
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);
  const [restTimer, setRestTimer] = useState<{
    isOpen: boolean;
    defaultSeconds: number;
    exerciseName: string;
    nextSetInfo: string;
  }>({
    isOpen: false,
    defaultSeconds: 90,
    exerciseName: '',
    nextSetInfo: '',
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('avalanche_profile', JSON.stringify(profile));
    } catch (e) {
      // ignore
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('apex_nutrition', JSON.stringify(nutrition));
    } catch (e) {
      // ignore
    }
  }, [nutrition]);

  useEffect(() => {
    try {
      localStorage.setItem('apex_checkins', JSON.stringify(checkIns));
    } catch (e) {
      // ignore
    }
  }, [checkIns]);

  useEffect(() => {
    try {
      localStorage.setItem('apex_workout_session', JSON.stringify(session));
    } catch (e) {
      // ignore
    }
  }, [session]);

  const handleToggleCheckIn = (id: string) => {
    setCheckIns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c))
    );
  };

  const handleOpenExerciseById = (exerciseId: string) => {
    const found = EXERCISES_DATA.find((e) => e.id === exerciseId) || EXERCISES_DATA[0];
    setDetailExercise(found);
  };

  const handleAddExerciseToWorkout = (exercise: Exercise) => {
    const existingIndex = session.exercises.findIndex(
      (e) => e.exerciseId === exercise.id
    );
    if (existingIndex === -1) {
      const newEx = {
        exerciseId: exercise.id,
        currentSetIndex: 0,
        restSeconds: 90,
        isFinished: false,
        notes: exercise.criticalMistake,
        sets: [
          { id: `${exercise.id}-s1`, setNumber: 1, targetWeight: 40, targetReps: 10, isCompleted: false },
          { id: `${exercise.id}-s2`, setNumber: 2, targetWeight: 40, targetReps: 10, isCompleted: false },
          { id: `${exercise.id}-s3`, setNumber: 3, targetWeight: 40, targetReps: 10, isCompleted: false },
        ],
      };
      setSession((prev) => ({
        ...prev,
        exercises: [...prev.exercises, newEx],
        exercisesCount: prev.exercisesCount + 1,
        totalSets: prev.totalSets + 3,
      }));
    }
  };

  const handleApplyProgramToWorkout = (program: CustomProgram, selectedDayIndex?: number) => {
    const day =
      program.days && program.days.length > 0
        ? program.days[selectedDayIndex ?? program.activeDayIndex ?? 0]
        : null;

    const exercisesToApply = day ? day.exercises : program.exercises;
    const cardioToApply = day?.cardio || program.cardio;
    const dayTitle = day ? `${program.name} - ${day.dayName}` : program.name;
    const dayLabel = day ? day.dayName : program.splitDays || 'Özel Çığ Seansı';

    const workoutExercises = exercisesToApply.map((item: WizardExerciseItem) => ({
      exerciseId: item.exerciseId,
      currentSetIndex: 0,
      restSeconds: item.restSeconds || 90,
      isFinished: false,
      notes: `${item.targetSets} set × ${item.targetWeightKg} kg • ${item.intensityRpe} RPE`,
      sets: Array.from({ length: item.targetSets }, (_, idx) => ({
        id: `${item.id}-s${idx + 1}`,
        setNumber: idx + 1,
        targetWeight: item.targetWeightKg,
        targetReps: item.targetReps,
        isCompleted: false,
      })),
    }));

    const totalSetsCount = exercisesToApply.reduce((acc: number, curr: WizardExerciseItem) => acc + curr.targetSets, 0);

    const newSession: WorkoutSession = {
      id: `session-${Date.now()}`,
      title: dayTitle,
      dayLabel: dayLabel,
      durationMinutesEstimate: exercisesToApply.length * 10 + (cardioToApply?.durationMinutes || 0),
      exercisesCount: exercisesToApply.length,
      totalSets: totalSetsCount,
      restSecondsDefault: 90,
      nextExercisePreview: exercisesToApply[0]?.exerciseName || 'Antrenman',
      nextRpe: exercisesToApply[0]?.intensityRpe || '8.5',
      exercises: workoutExercises,
      cardio: cardioToApply,
    };

    setSession(newSession);
    setCurrentTab('workout');
  };

  const handleSaveDayToHistory = (record: DailyHistoryRecord, shouldResetDay: boolean) => {
    setDailyHistory((prev) => {
      const idx = prev.findIndex((r) => r.isoDate === record.isoDate);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = record;
        return updated;
      }
      return [record, ...prev];
    });

    if (shouldResetDay) {
      setNutrition((prev) => ({
        ...prev,
        proteinGrams: 0,
        energyKcal: 0,
        carbsGrams: 0,
        fatsGrams: 0,
        hydrationLiters: 0,
        meals: prev.meals.map((m) => ({ ...m, completed: false })),
        supplements: prev.supplements.map((s) => ({ ...s, taken: false })),
      }));
    }
  };

  const handleDeleteHistoryRecord = (id: string) => {
    setDailyHistory((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddManualRecord = (record: DailyHistoryRecord) => {
    setDailyHistory((prev) => [record, ...prev]);
  };

  const handleCompleteWorkout = (record: CompletedWorkoutRecord) => {
    setWorkoutHistory((prev) => [record, ...prev]);

    const todayIso = record.isoDate || new Date().toISOString().split('T')[0];
    const trDays = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const now = new Date();
    const dayName = trDays[now.getDay()];

    // Increment athlete profile session counter and update zinciriKirma streak in real-time
    setProfile((prev) => {
      const zk = prev.zinciriKirma || ATHLETE_PROFILE.zinciriKirma!;
      const isAlreadyCompletedToday = zk?.lastCompletedDate === todayIso;
      const curStreak = zk?.currentStreak || 1;
      const newStreak = isAlreadyCompletedToday ? curStreak : ((zk?.totalDaysCompleted || 0) === 0 ? 1 : curStreak + 1);

      // Update weekly calendar for today
      const updatedWeekly = (zk?.weeklyCalendar || []).map((day) => {
        if (day.dayName.toLowerCase() === dayName.toLowerCase()) {
          return { ...day, completed: true };
        }
        return day;
      });

      return {
        ...prev,
        sessionsCompleted: (prev.sessionsCompleted || 0) + 1,
        zinciriKirma: {
          ...zk,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, zk?.longestStreak || 1),
          totalDaysCompleted: isAlreadyCompletedToday ? (zk?.totalDaysCompleted || 1) : (zk?.totalDaysCompleted || 0) + 1,
          lastCompletedDate: todayIso,
          weeklyCalendar: updatedWeekly,
        },
      };
    });

    // Sync into dailyHistory for today
    setDailyHistory((prev) => {
      const idx = prev.findIndex((r) => r.isoDate === todayIso);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          workoutCompleted: true,
          workoutTitle: record.title,
          workoutDurationMinutes: (updated[idx].workoutDurationMinutes || 0) + record.durationMinutes,
          totalSetsCompleted: (updated[idx].totalSetsCompleted || 0) + record.totalSetsCompleted,
          cardioMinutes: record.cardio?.durationMinutes || updated[idx].cardioMinutes,
          cardioCalories: record.cardio?.caloriesBurned || updated[idx].cardioCalories,
        };
        return updated;
      }

      // If today doesn't exist yet, create a new record so workout data is kept in history!
      const newDailyRecord: DailyHistoryRecord = {
        id: `daily-${Date.now()}`,
        date: record.date || now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
        isoDate: todayIso,
        dayName: dayName,
        timestamp: Date.now(),
        energyKcal: nutrition.energyKcal,
        energyTarget: nutrition.energyTarget,
        proteinGrams: nutrition.proteinGrams,
        proteinTarget: nutrition.proteinTarget,
        carbsGrams: nutrition.carbsGrams,
        carbsTarget: nutrition.carbsTarget,
        fatsGrams: nutrition.fatsGrams,
        fatsTarget: nutrition.fatsTarget,
        hydrationLiters: nutrition.hydrationLiters,
        hydrationTarget: nutrition.hydrationTarget,
        completedMealsCount: nutrition.meals.filter((m) => m.completed).length,
        totalMealsCount: nutrition.meals.length,
        meals: nutrition.meals,
        workoutCompleted: true,
        workoutTitle: record.title,
        workoutDurationMinutes: record.durationMinutes,
        totalSetsCompleted: record.totalSetsCompleted,
        cardioMinutes: record.cardio?.durationMinutes || 0,
        cardioCalories: record.cardio?.caloriesBurned || 0,
        notes: record.notes,
      };
      return [newDailyRecord, ...prev];
    });
  };

  const handleDeleteWorkoutHistory = (id: string) => {
    setWorkoutHistory((prev) => prev.filter((w) => w.id !== id));
  };

  const handleClearAllData = () => {
    try {
      localStorage.clear();
      localStorage.setItem('avalanche_daily_history', JSON.stringify([]));
      localStorage.setItem('avalanche_workout_history', JSON.stringify([]));
      localStorage.setItem('avalanche_workout_timer', '0');
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
    setDailyHistory([]);
    setWorkoutHistory([]);
    setProfile({
      ...ATHLETE_PROFILE,
      sessionsCompleted: 0,
      customPrograms: [],
      activeProgramId: undefined,
      weeklyTargetSets: {
        chest: { target: 18, done: 0 },
        back: { target: 18, done: 0 },
        legs: { target: 18, done: 0 },
        shoulders: { target: 15, done: 0 },
        arms: { target: 15, done: 0 }
      },
      zinciriKirma: {
        currentStreak: 1,
        longestStreak: 1,
        totalDaysCompleted: 0,
        lastCompletedDate: undefined,
        weeklyCalendar: generateFourMonthWeeklyCalendar().map((d) => ({ ...d, completed: false })),
      }
    });
    setNutrition({
      ...INITIAL_NUTRITION,
      energyKcal: 0,
      proteinGrams: 0,
      carbsGrams: 0,
      fatsGrams: 0,
      hydrationLiters: 0,
      meals: INITIAL_NUTRITION.meals.map((m) => ({ ...m, completed: false })),
      supplements: INITIAL_NUTRITION.supplements.map((s) => ({ ...s, taken: false })),
    });
    setCheckIns(INITIAL_CHECKINS.map((c) => ({ ...c, completed: false })));
    setSession({
      ...INITIAL_WORKOUT_SESSION,
      exercises: INITIAL_WORKOUT_SESSION.exercises.map((ex) => ({
        ...ex,
        isFinished: false,
        sets: ex.sets.map((s) => ({ ...s, isCompleted: false })),
      })),
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#E3E2E8] flex justify-center font-sans antialiased">
      {/* Centered Mobile App Container */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#121317] border-x border-[#1A1C24] shadow-2xl relative">
        {/* Sticky Header */}
        <Header
          currentTab={currentTab}
          focusMode={focusMode}
          onToggleFocusMode={() => setFocusMode(!focusMode)}
          onOpenProfile={() => setCurrentTab('profile')}
          athleteName={profile.name}
        />

        {/* Tab Content Body */}
        <main className="flex-1 px-4 py-4 overflow-y-auto">
          {currentTab === 'daily' && (
            <DailyDashboardTab
              nutrition={nutrition}
              onUpdateNutrition={setNutrition}
              checkIns={checkIns}
              onToggleCheckIn={handleToggleCheckIn}
              onStartWorkout={() => setCurrentTab('workout')}
              onOpenNutrition={() => setIsNutritionModalOpen(true)}
              onNavigateToNutrition={() => setCurrentTab('nutrition')}
              onOpenFinishDayModal={() => setIsFinishDayModalOpen(true)}
              onNavigateToAnalytics={() => setCurrentTab('analytics')}
              onOpenExerciseGuide={() => {
                const bench = EXERCISES_DATA[0];
                setDetailExercise(bench);
              }}
              athleteName={profile.name}
              zinciriKirma={profile.zinciriKirma}
              onUpdateZinciriKirma={(zk) => setProfile((prev) => ({ ...prev, zinciriKirma: zk }))}
            />
          )}

          {currentTab === 'workout' && (
            <WorkoutLiveTab
              session={session}
              onUpdateSession={setSession}
              onOpenExerciseDetail={handleOpenExerciseById}
              onOpenRestTimer={(exerciseName, nextSetInfo) => {
                setRestTimer({
                  isOpen: true,
                  defaultSeconds: 90,
                  exerciseName,
                  nextSetInfo,
                });
              }}
              workoutHistory={workoutHistory}
              onCompleteWorkout={handleCompleteWorkout}
              onDeleteWorkoutHistory={handleDeleteWorkoutHistory}
              customPrograms={profile.customPrograms}
              onApplyProgramToWorkout={handleApplyProgramToWorkout}
              athleteWeightKg={profile.weightKg || 110}
            />
          )}

          {currentTab === 'nutrition' && (
            <NutritionTab
              nutrition={nutrition}
              onUpdateNutrition={setNutrition}
              onOpenNutritionModal={() => setIsNutritionModalOpen(true)}
              onResetNutrition={() => setNutrition(INITIAL_NUTRITION)}
              onOpenFinishDayModal={() => setIsFinishDayModalOpen(true)}
              onNavigateToAnalytics={() => setCurrentTab('analytics')}
              onOpenFourMonthPlan={() => setIsFourMonthModalOpen(true)}
              athleteWeightKg={profile.weightKg || 110}
              athleteHeightCm={profile.heightCm || 177}
              athleteAge={profile.age || 28}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsTab
              history={dailyHistory}
              currentNutrition={nutrition}
              onDeleteHistoryRecord={handleDeleteHistoryRecord}
              onAddManualRecord={handleAddManualRecord}
              onOpenFinishDayModal={() => setIsFinishDayModalOpen(true)}
            />
          )}

          {currentTab === 'guide' && (
            <ExerciseAtlasTab
              onOpenExerciseDetail={(ex) => setDetailExercise(ex)}
              onOpenMatrixModal={() => setIsMatrixModalOpen(true)}
              onAddExerciseToWorkout={handleAddExerciseToWorkout}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileTab
              profile={profile}
              onUpdateProfile={setProfile}
              onApplyProgramToWorkout={handleApplyProgramToWorkout}
              onClearAllData={handleClearAllData}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          currentTab={currentTab}
          onChangeTab={setCurrentTab}
          isWorkoutActive={true}
        />

        {/* Modals */}
        <FinishDayModal
          isOpen={isFinishDayModalOpen}
          onClose={() => setIsFinishDayModalOpen(false)}
          nutrition={nutrition}
          session={session}
          athleteWeightKg={profile.weightKg}
          onSaveDayToHistory={handleSaveDayToHistory}
          onNavigateToAnalytics={() => setCurrentTab('analytics')}
        />
        <ExerciseDetailModal
          exercise={detailExercise}
          isOpen={!!detailExercise}
          onClose={() => setDetailExercise(null)}
          onAddToWorkout={handleAddExerciseToWorkout}
          isAlreadyInWorkout={
            !!detailExercise &&
            session.exercises.some((e) => e.exerciseId === detailExercise.id)
          }
          athleteName={profile.name}
        />

        <RestTimerModal
          isOpen={restTimer.isOpen}
          onClose={() => setRestTimer((prev) => ({ ...prev, isOpen: false }))}
          defaultSeconds={restTimer.defaultSeconds}
          exerciseName={restTimer.exerciseName}
          nextSetInfo={restTimer.nextSetInfo}
        />

        <NutritionModal
          isOpen={isNutritionModalOpen}
          onClose={() => setIsNutritionModalOpen(false)}
          nutrition={nutrition}
          onUpdateNutrition={setNutrition}
        />

        <FullBodyMatrixModal
          isOpen={isMatrixModalOpen}
          onClose={() => setIsMatrixModalOpen(false)}
          onSelectExercise={(ex) => setDetailExercise(ex)}
        />

        <FourMonthProgramHubModal
          isOpen={isFourMonthModalOpen}
          onClose={() => setIsFourMonthModalOpen(false)}
          onApplyMealsToNutrition={handleApplyFourMonthMeals}
          onApplyWorkoutToLive={(prog) => {
            handleApplyProgramToWorkout(prog);
            setCurrentTab('workout');
          }}
        />
      </div>
    </div>
  );
}
