import { WizardExerciseItem, CardioSettings, WeeklyScheduleDay } from '../types/fitness';

export interface DayWorkoutPlan {
  dayName: string;
  focusTitle: string;
  isRestDay: boolean;
  notes: string;
  cardioMinutes: number;
  cardioIncline: number;
  cardioSpeed: number;
  exercises: {
    exerciseId: string;
    exerciseName: string;
    sets: number;
    reps: number;
    defaultWeightKg: number;
    category: string;
    targetMuscle: string;
  }[];
}

// 4 Ay Boyunca Kullanılmayacak Bel-Stresli Egzersizler
export const EXCLUDED_EXERCISES_FOR_HERNIATED_DISC = [
  'Squat',
  'Hack Squat',
  'Barbell Deadlift',
  'DB Stiff Leg Deadlift',
  'Barbell Lunge',
  'Front Squat',
  'Bent Over Barbell Rowing',
  'Good-Morning',
  'Hyper Extension',
  'Wide Grip Chin (Barfiks)',
  'Hanging Leg Raise',
  'Sit-Up',
  'Roman Chair Sit-Up',
  'Gym Stick Twist (Sopa Çevirme)',
];

// Haftalık 7 Günlük Ana Düzen (3 x 12 & Eğimli Kardiyo)
export const FOUR_MONTH_WEEKLY_WORKOUT_DAYS: Record<string, DayWorkoutPlan> = {
  Pazartesi: {
    dayName: 'Pazartesi',
    focusTitle: 'Göğüs + Triceps + Kardiyo',
    isRestDay: false,
    notes: 'Chest Press & Incline DB Press • 3x12 • 30 dk %8-12 Eğimli Kardiyo',
    cardioMinutes: 30,
    cardioIncline: 12,
    cardioSpeed: 4.5,
    exercises: [
      { exerciseId: 'chest-press-machine', exerciseName: 'Chest Press Machine', sets: 3, reps: 12, defaultWeightKg: 30, category: 'İtiş (Push)', targetMuscle: 'Göğüs (Pectoralis Major)' },
      { exerciseId: 'incline-bench-dumbbell-press', exerciseName: 'Incline Bench Dumbbell Press', sets: 3, reps: 12, defaultWeightKg: 16, category: 'İtiş (Push)', targetMuscle: 'Üst Göğüs' },
      { exerciseId: 'pec-dec-flying', exerciseName: 'Pec Dec Flying', sets: 3, reps: 12, defaultWeightKg: 35, category: 'İtiş (Push)', targetMuscle: 'Göğüs İzolasyon' },
      { exerciseId: 'cable-cross-over', exerciseName: 'Cable Cross Over', sets: 3, reps: 12, defaultWeightKg: 15, category: 'İtiş (Push)', targetMuscle: 'Alt & İç Göğüs' },
      { exerciseId: 'triceps-push-down', exerciseName: 'Triceps Push Down', sets: 3, reps: 12, defaultWeightKg: 25, category: 'İtiş (Push)', targetMuscle: 'Triceps Lateral Baş' },
      { exerciseId: 'rope-triceps-push-down', exerciseName: 'Rope Triceps Push Down', sets: 3, reps: 12, defaultWeightKg: 20, category: 'İtiş (Push)', targetMuscle: 'Triceps Medial & Uzun Baş' },
    ],
  },
  Salı: {
    dayName: 'Salı',
    focusTitle: 'Sırt + Biceps + Kardiyo',
    isRestDay: false,
    notes: 'Lat Pulldown & Seated Row • 3x12 • 30 dk %8-12 Eğimli Kardiyo',
    cardioMinutes: 30,
    cardioIncline: 12,
    cardioSpeed: 4.5,
    exercises: [
      { exerciseId: 'lat-pulldown', exerciseName: 'Lat Pulldown', sets: 3, reps: 12, defaultWeightKg: 45, category: 'Çekiş (Pull)', targetMuscle: 'Latissimus Dorsi (Kanat)' },
      { exerciseId: 'seated-cable-rowing', exerciseName: 'Seated Cable Rowing', sets: 3, reps: 12, defaultWeightKg: 40, category: 'Çekiş (Pull)', targetMuscle: 'Orta Sırt & Romboid' },
      { exerciseId: 'one-arm-cable-rowing', exerciseName: 'One Arm Cable Rowing', sets: 3, reps: 12, defaultWeightKg: 20, category: 'Çekiş (Pull)', targetMuscle: 'Tek Kol Sırt İzolasyonu' },
      { exerciseId: 'close-grip-pulldown', exerciseName: 'Close Grip Pulldown', sets: 3, reps: 12, defaultWeightKg: 45, category: 'Çekiş (Pull)', targetMuscle: 'Alt Kanat' },
      { exerciseId: 'serratus-extension', exerciseName: 'Serratus Extension', sets: 3, reps: 12, defaultWeightKg: 25, category: 'Çekiş (Pull)', targetMuscle: 'Serratus Anterior & Kanat' },
      { exerciseId: 'standing-dumbbell-curl', exerciseName: 'Standing Dumbbell Curl', sets: 3, reps: 12, defaultWeightKg: 12, category: 'Çekiş (Pull)', targetMuscle: 'Biceps Brachii' },
      { exerciseId: 'hammer-curl', exerciseName: 'Hammer Curl', sets: 3, reps: 12, defaultWeightKg: 12, category: 'Çekiş (Pull)', targetMuscle: 'Brachialis & Ön Kol' },
    ],
  },
  Çarşamba: {
    dayName: 'Çarşamba',
    focusTitle: 'Bacak + Core + Kardiyo',
    isRestDay: false,
    notes: 'Bacak makineleri (Omurga güvende) + Side Plank + 25-30 dk Kardiyo',
    cardioMinutes: 25,
    cardioIncline: 8,
    cardioSpeed: 4.2,
    exercises: [
      { exerciseId: 'leg-press', exerciseName: 'Leg Press', sets: 3, reps: 12, defaultWeightKg: 80, category: 'Bacak (Legs)', targetMuscle: 'Quadriceps & Gluteus' },
      { exerciseId: 'leg-extension', exerciseName: 'Leg Extension', sets: 3, reps: 12, defaultWeightKg: 35, category: 'Bacak (Legs)', targetMuscle: 'Quadriceps İzolasyon' },
      { exerciseId: 'lying-leg-curl', exerciseName: 'Lying Leg Curl', sets: 3, reps: 12, defaultWeightKg: 30, category: 'Bacak (Legs)', targetMuscle: 'Hamstrings (Arka Bacak)' },
      { exerciseId: 'leg-abduction', exerciseName: 'Leg Abduction', sets: 3, reps: 12, defaultWeightKg: 35, category: 'Bacak (Legs)', targetMuscle: 'Dış Kalça & Gluteus Medius' },
      { exerciseId: 'leg-adduction', exerciseName: 'Leg Adduction', sets: 3, reps: 12, defaultWeightKg: 35, category: 'Bacak (Legs)', targetMuscle: 'İç Bacak' },
      { exerciseId: 'leg-press-calf-raise', exerciseName: 'Leg Press Calf Raise', sets: 3, reps: 12, defaultWeightKg: 70, category: 'Bacak (Legs)', targetMuscle: 'Kalf (Gastrocnemius)' },
      { exerciseId: 'calf-raise', exerciseName: 'Calf Raise', sets: 3, reps: 12, defaultWeightKg: 40, category: 'Bacak (Legs)', targetMuscle: 'Soleus & Kalf' },
      { exerciseId: 'side-plank', exerciseName: 'Side Plank', sets: 3, reps: 12, defaultWeightKg: 0, category: 'Core / Karın', targetMuscle: 'Oblikler (25-30 sn)' },
    ],
  },
  Perşembe: {
    dayName: 'Perşembe',
    focusTitle: 'Göğüs + Omuz + Triceps + Kardiyo',
    isRestDay: false,
    notes: 'Incline Bench & Omuz & Triceps • 3x12 • 30 dk Kardiyo',
    cardioMinutes: 30,
    cardioIncline: 12,
    cardioSpeed: 4.5,
    exercises: [
      { exerciseId: 'incline-bench-press', exerciseName: 'Incline Bench Press', sets: 3, reps: 12, defaultWeightKg: 35, category: 'İtiş (Push)', targetMuscle: 'Üst Göğüs' },
      { exerciseId: 'dumbbell-bench-press', exerciseName: 'Dumbbell Bench Press', sets: 3, reps: 12, defaultWeightKg: 18, category: 'İtiş (Push)', targetMuscle: 'Tüm Göğüs' },
      { exerciseId: 'pec-dec-flying', exerciseName: 'Pec Dec Flying', sets: 3, reps: 12, defaultWeightKg: 35, category: 'İtiş (Push)', targetMuscle: 'Göğüs İzolasyon' },
      { exerciseId: 'seated-dumbbell-press', exerciseName: 'Seated Dumbbell Press', sets: 3, reps: 12, defaultWeightKg: 14, category: 'Omuz', targetMuscle: 'Ön & Yan Deltoid' },
      { exerciseId: 'side-lateral-raise-machine', exerciseName: 'Side Lateral Raise Machine', sets: 3, reps: 12, defaultWeightKg: 25, category: 'Omuz', targetMuscle: 'Yan Omuz' },
      { exerciseId: 'facepull', exerciseName: 'Facepull', sets: 3, reps: 12, defaultWeightKg: 20, category: 'Omuz', targetMuscle: 'Arka Omuz & Rotatör' },
      { exerciseId: 'triceps-push-down', exerciseName: 'Triceps Push Down', sets: 3, reps: 12, defaultWeightKg: 25, category: 'İtiş (Push)', targetMuscle: 'Triceps' },
      { exerciseId: 'rope-triceps-push-down', exerciseName: 'Rope Triceps Push Down', sets: 3, reps: 12, defaultWeightKg: 20, category: 'İtiş (Push)', targetMuscle: 'Triceps Uzun Baş' },
    ],
  },
  Cuma: {
    dayName: 'Cuma',
    focusTitle: 'Sırt + Biceps + Kardiyo',
    isRestDay: false,
    notes: 'Lat Pulldown & Preacher Curl • 3x12 • 30-35 dk Kardiyo',
    cardioMinutes: 32,
    cardioIncline: 12,
    cardioSpeed: 4.5,
    exercises: [
      { exerciseId: 'lat-pulldown', exerciseName: 'Lat Pulldown', sets: 3, reps: 12, defaultWeightKg: 45, category: 'Çekiş (Pull)', targetMuscle: 'Latissimus Dorsi' },
      { exerciseId: 'seated-cable-rowing', exerciseName: 'Seated Cable Rowing', sets: 3, reps: 12, defaultWeightKg: 40, category: 'Çekiş (Pull)', targetMuscle: 'Orta Sırt' },
      { exerciseId: 'close-grip-pulldown', exerciseName: 'Close Grip Pulldown', sets: 3, reps: 12, defaultWeightKg: 45, category: 'Çekiş (Pull)', targetMuscle: 'Alt Kanat' },
      { exerciseId: 'one-arm-cable-rowing', exerciseName: 'One Arm Cable Rowing', sets: 3, reps: 12, defaultWeightKg: 20, category: 'Çekiş (Pull)', targetMuscle: 'Sırt İzolasyonu' },
      { exerciseId: 'serratus-extension', exerciseName: 'Serratus Extension', sets: 3, reps: 12, defaultWeightKg: 25, category: 'Çekiş (Pull)', targetMuscle: 'Serratus Anterior' },
      { exerciseId: 'barbell-preacher-curl', exerciseName: 'Barbell Preacher Curl', sets: 3, reps: 12, defaultWeightKg: 22.5, category: 'Çekiş (Pull)', targetMuscle: 'Biceps Kısa Baş' },
      { exerciseId: 'hammer-curl', exerciseName: 'Hammer Curl', sets: 3, reps: 12, defaultWeightKg: 12, category: 'Çekiş (Pull)', targetMuscle: 'Brachialis' },
    ],
  },
  Cumartesi: {
    dayName: 'Cumartesi',
    focusTitle: 'Bacak + Omuz + Kardiyo',
    isRestDay: false,
    notes: 'Leg Press & 3D Deltoid • 3x12 • 30-40 dk Kardiyo',
    cardioMinutes: 35,
    cardioIncline: 10,
    cardioSpeed: 4.5,
    exercises: [
      { exerciseId: 'leg-press', exerciseName: 'Leg Press', sets: 3, reps: 12, defaultWeightKg: 85, category: 'Bacak (Legs)', targetMuscle: 'Quadriceps' },
      { exerciseId: 'leg-extension', exerciseName: 'Leg Extension', sets: 3, reps: 12, defaultWeightKg: 35, category: 'Bacak (Legs)', targetMuscle: 'Quadriceps' },
      { exerciseId: 'lying-leg-curl', exerciseName: 'Lying Leg Curl', sets: 3, reps: 12, defaultWeightKg: 30, category: 'Bacak (Legs)', targetMuscle: 'Arka Bacak' },
      { exerciseId: 'leg-abduction', exerciseName: 'Leg Abduction', sets: 3, reps: 12, defaultWeightKg: 35, category: 'Bacak (Legs)', targetMuscle: 'Dış Kalça' },
      { exerciseId: 'leg-press-calf-raise', exerciseName: 'Leg Press Calf Raise', sets: 3, reps: 12, defaultWeightKg: 70, category: 'Bacak (Legs)', targetMuscle: 'Kalf' },
      { exerciseId: 'seated-dumbbell-press', exerciseName: 'Seated Dumbbell Press', sets: 3, reps: 12, defaultWeightKg: 14, category: 'Omuz', targetMuscle: 'Ön Omuz' },
      { exerciseId: 'lateral-raise', exerciseName: 'Lateral Raise', sets: 3, reps: 12, defaultWeightKg: 8, category: 'Omuz', targetMuscle: 'Yan Omuz' },
      { exerciseId: 'reverse-lateral-arm-raise', exerciseName: 'Reverse Lateral Arm Raise', sets: 3, reps: 12, defaultWeightKg: 8, category: 'Omuz', targetMuscle: 'Arka Omuz' },
      { exerciseId: 'facepull', exerciseName: 'Facepull', sets: 3, reps: 12, defaultWeightKg: 20, category: 'Omuz', targetMuscle: 'Arka Deltoid' },
    ],
  },
  Pazar: {
    dayName: 'Pazar',
    focusTitle: 'Tam Dinlenme & Hidrasyon',
    isRestDay: true,
    notes: 'Ağırlık antrenmanı yok • 4 Litre su • İsteğe bağlı 30-45 dk rahat yürüyüş',
    cardioMinutes: 0,
    cardioIncline: 0,
    cardioSpeed: 0,
    exercises: [],
  },
};

// 7 Günlük WeeklyScheduleDay Listesi Oluşturucu
export const generateFourMonthWeeklyCalendar = (): WeeklyScheduleDay[] => {
  const daysOrder = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  return daysOrder.map((name, index) => {
    const plan = FOUR_MONTH_WEEKLY_WORKOUT_DAYS[name];
    const wizardExercises: WizardExerciseItem[] = plan.exercises.map((ex, idx) => ({
      id: `4m-${name}-${idx}-${ex.exerciseId}`,
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

    const cardioSetting: CardioSettings | undefined = !plan.isRestDay
      ? {
          id: `cardio-4m-${name}`,
          type: 'incline_walk',
          name: 'Eğimli Yürüyüş Bandı (Zone 2)',
          durationMinutes: plan.cardioMinutes,
          inclinePercent: plan.cardioIncline,
          speedKmh: plan.cardioSpeed,
          heartRateZone: `Zone 2 Yağ Yakımı (%${plan.cardioIncline} Eğim • ${plan.cardioSpeed} km/h)`,
          targetCalories: Math.round(plan.cardioMinutes * 10),
          completed: false,
        }
      : undefined;

    return {
      dayIndex: index,
      dayName: name,
      isRestDay: plan.isRestDay,
      focusTitle: plan.focusTitle,
      targetMuscleGroups: plan.exercises.map((e) => e.category),
      estimatedDurationMin: plan.isRestDay ? 0 : plan.exercises.length * 8 + plan.cardioMinutes,
      cardioMin: plan.cardioMinutes,
      completed: false,
      notes: plan.notes,
      exercises: wizardExercises,
      cardio: cardioSetting,
    };
  });
};
