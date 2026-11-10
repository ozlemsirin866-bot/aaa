export interface ExerciseStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
}

export interface ExerciseMistake {
  type: 'avoid' | 'do';
  title: string;
  description: string;
  note?: string;
}

export interface BiomechanicsDetail {
  activationPercent: number;
  angleRecommendation: string;
  criticalCues: string[];
  breathingRhythm: string;
  commonMistakes: string;
  targetMover: string;
  supportMovers: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'İtiş (Push)' | 'Çekiş (Pull)' | 'Bacak (Legs)' | 'Core / Karın' | 'Omuz';
  anatomyRegion: 'Göğüs' | 'Sırt/Lat' | 'Omuz' | 'Bacak' | 'Triceps' | 'Biceps' | 'Karın' | 'Kalça/Bel';
  equipment: 'Halter' | 'Dambıl' | 'Kablo / Makine' | 'Vücut Ağırlığı';
  targetMuscle: string;
  synergistMuscles: string;
  type: string;
  setupAngle: string;
  rpe: string;
  descriptionPurpose: string;
  videoDuration?: string;
  videoViews?: string;
  videoCoachVerified?: boolean;
  videoThumbnailUrl: string;
  youtubeVideoId?: string;
  isPopular?: boolean;
  popularityRank?: number;
  cues?: {
    title: string;
    description: string;
  }[];
  criticalMistake?: string;
  steps?: ExerciseStep[];
  mistakes?: ExerciseMistake[];
  biomechanics?: BiomechanicsDetail;
  isCustom?: boolean;
  createdAt?: string;
}

export interface WorkoutSet {
  id: string;
  setNumber: number;
  targetWeight: number;
  targetReps: number;
  completedWeight?: number;
  completedReps?: number;
  rpe?: string;
  note?: string;
  isCompleted: boolean;
  isFailed?: boolean;
}

export interface CardioSettings {
  id: string;
  type: 'treadmill' | 'incline_walk' | 'stairmaster' | 'cycling' | 'rower';
  name: string;
  durationMinutes: number; // kaç dk
  inclinePercent: number; // kaç eğim (%)
  speedKmh: number; // kaç hız (km/h)
  heartRateZone?: string;
  targetCalories?: number;
  completed?: boolean;
}

export interface WizardExerciseItem {
  id: string;
  exerciseId: string;
  exerciseName: string;
  targetSets: number; // kaç set
  targetWeightKg: number; // kaç kg
  targetReps: number; // kaç tekrar
  restSeconds: number; // dinlenme süresi
  intensityRpe: string; // RPE
  targetMuscle?: string;
  category?: string;
}

export interface CustomProgramDay {
  id: string;
  dayName: string; // örn. 'İtiş (Push)', 'Çekiş (Pull)', 'Bacak (Legs)'
  category: string;
  icon?: string;
  exercises: WizardExerciseItem[];
  cardio?: CardioSettings;
}

export interface WizardPreferences {
  goal: string;
  level: string;
  daysPerWeek: number;
  durationMinutes: number;
  location: string;
  equipments: string[];
  excludedExercises: string[];
  focusAreas: string[];
  cardioPreference: string;
  splitStructure: string;
}

export interface CustomProgram {
  id: string;
  name: string;
  goal: string;
  splitDays: string;
  notes?: string;
  exercises: WizardExerciseItem[];
  cardio?: CardioSettings;
  days?: CustomProgramDay[];
  activeDayIndex?: number;
  preferences?: WizardPreferences;
  createdAt: string;
}

export interface CompletedWorkoutExerciseRecord {
  exerciseId: string;
  exerciseName: string;
  sets: {
    setNumber: number;
    weight: number;
    reps: number;
    isCompleted: boolean;
  }[];
}

export interface CompletedWorkoutRecord {
  id: string;
  title: string;
  date: string;
  isoDate: string;
  timestamp: number;
  durationSeconds: number;
  durationMinutes: number;
  totalVolumeKg: number;
  totalSetsCompleted: number;
  totalSetsTarget: number;
  exercises: CompletedWorkoutExerciseRecord[];
  cardio?: {
    name: string;
    durationMinutes: number;
    caloriesBurned: number;
  };
  notes?: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: WorkoutSet[];
  currentSetIndex: number;
  restSeconds: number;
  isFinished: boolean;
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  title: string;
  dayLabel: string;
  durationMinutesEstimate: number;
  exercisesCount: number;
  totalSets: number;
  restSecondsDefault: number;
  nextExercisePreview: string;
  nextRpe: string;
  exercises: WorkoutExercise[];
  cardio?: CardioSettings;
}

export interface MealItem {
  id: string;
  name: string;
  time: string;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  description: string;
  completed: boolean;
  completedItems?: string[];
}

export interface SupplementProtocol {
  id: string;
  name: string;
  dosage: string;
  timeWindow: string;
  purpose: string;
  taken: boolean;
}

export interface DailyHistoryRecord {
  id: string;
  date: string; // e.g. "28 Eylül 2026"
  isoDate: string; // "2026-09-28"
  dayName: string; // "Pazartesi"
  timestamp: number;
  energyKcal: number;
  energyTarget: number;
  proteinGrams: number;
  proteinTarget: number;
  carbsGrams: number;
  carbsTarget: number;
  fatsGrams: number;
  fatsTarget: number;
  hydrationLiters: number;
  hydrationTarget: number;
  completedMealsCount: number;
  totalMealsCount: number;
  meals: MealItem[];
  workoutCompleted?: boolean;
  workoutTitle?: string;
  workoutDurationMinutes?: number;
  totalSetsCompleted?: number;
  cardioMinutes?: number;
  cardioCalories?: number;
  weightKg?: number;
  notes?: string;
}

export interface DailyNutrition {
  proteinGrams: number;
  proteinTarget: number;
  energyKcal: number;
  energyTarget: number;
  carbsGrams: number;
  carbsTarget: number;
  fatsGrams: number;
  fatsTarget: number;
  hydrationLiters: number;
  hydrationTarget: number;
  sodiumMg: number;
  sodiumTargetMg: number;
  goal: string;
  meals: MealItem[];
  supplements: SupplementProtocol[];
}

export interface CheckInItem {
  id: string;
  title: string;
  subtitle: string;
  metricBadge: string;
  statusText?: string;
  completed: boolean;
  type: 'sleep' | 'meal' | 'supplement' | 'hydration';
  icon: string;
}

export interface WeeklyScheduleDay {
  dayIndex: number; // 0: Pazartesi ... 6: Pazar
  dayName: string; // 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'
  isRestDay: boolean; // Dinlenme günü
  focusTitle: string; // örn. 'Göğüs & Triceps (Push A)', 'Sırt & Biceps', 'Bacak & Karın'
  targetMuscleGroups: string[];
  estimatedDurationMin: number;
  cardioMin?: number;
  completed: boolean; // Zincir halkası tamamlandı mı?
  completedDate?: string;
  notes?: string;
  exercises?: WizardExerciseItem[];
  cardio?: CardioSettings;
}

export interface ZinciriKirmaData {
  currentStreak: number; // Güncel kırılmayan zincir sayısı
  longestStreak: number; // En uzun zincir rekoru
  totalDaysCompleted: number; // Toplam başarılan gün
  lastCompletedDate?: string; // 'YYYY-MM-DD'
  weeklyCalendar: WeeklyScheduleDay[];
}

export interface AthleteProfile {
  name: string;
  tier?: string; // Seviye/ünvan sistemi kaldırıldı, opsiyonel bırakıldı
  program: string;
  heightCm: number;
  weightKg: number;
  age?: number;
  bodyFatPercent: number;
  sessionsCompleted: number;
  weeklyTargetSets: {
    chest: { target: number; done: number };
    back: { target: number; done: number };
    legs: { target: number; done: number };
    shoulders: { target: number; done: number };
    arms: { target: number; done: number };
  };
  customPrograms?: CustomProgram[];
  activeProgramId?: string;
  zinciriKirma?: ZinciriKirmaData;
}
