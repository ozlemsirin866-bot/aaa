import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Flame,
  Droplet,
  Plus,
  Check,
  CheckCircle,
  Clock,
  Pill,
  UtensilsCrossed,
  Sparkles,
  TrendingUp,
  Apple,
  RotateCcw,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Calendar,
  BookOpen,
  RefreshCw,
  Trash2,
  Sliders,
  X,
  Zap,
  Moon,
  BarChart3,
  Bookmark,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Bell,
  Search,
  Undo2,
  Info,
  Compass,
  Utensils,
  Target,
  Shield,
  Award,
} from 'lucide-react';
import { DailyNutrition, MealItem, SupplementProtocol } from '../../types/fitness';
import { INITIAL_NUTRITION } from '../../data/mockData';
import { PROTEINOCEAN_SUPPLEMENTS, ProteinoceanSupplement } from '../../data/supplementsData';
import { POPULAR_FOODS, PopularFood } from '../../data/popularFoodsData';
import { ProteinoceanSupplementsModal } from '../ProteinoceanSupplementsModal';
import { FoodConfirmModal } from '../FoodConfirmModal';
import {
  FOUR_MONTH_WEEKS,
  BREAKFAST_ROTATION,
  SNACK_ROTATION,
  PORTION_STANDARDS,
  COOKING_RULES,
  DAYS_ORDER,
  convertDayMenuToMealItems,
} from '../../data/fourMonthNutritionPlan';

interface NutritionTabProps {
  nutrition: DailyNutrition;
  onUpdateNutrition: (updated: DailyNutrition) => void;
  onOpenNutritionModal: () => void;
  onResetNutrition?: () => void;
  onOpenFinishDayModal?: () => void;
  onNavigateToAnalytics?: () => void;
  onNavigateToProfile?: () => void;
  onOpenFourMonthPlan?: () => void;
  customFoods?: PopularFood[];
  athleteWeightKg?: number;
  athleteHeightCm?: number;
  athleteAge?: number;
}

// Sound chime synthesizer for water reminder (Web Audio API)
const playWaterChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // First bell tone (E5 ~ 659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    // Second chime tone (G#5 ~ 830.61 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(830.61, now + 0.2);
    gain2.gain.setValueAtTime(0.25, now + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.2);
    osc2.stop(now + 0.9);
  } catch (err) {
    console.error('Audio play error', err);
  }
};

export interface WaterLogEntry {
  id: string;
  time: string;
  amountLiters: number;
  label: string;
}

export interface ConsumedFoodEntry {
  uniqueKey: string;
  mealId: string;
  mealName: string;
  mealTime: string;
  itemText: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  isStandaloneMeal: boolean;
}

export const NutritionTab: React.FC<NutritionTabProps> = ({
  nutrition,
  onUpdateNutrition,
  onOpenNutritionModal,
  onResetNutrition,
  onOpenFinishDayModal,
  onNavigateToAnalytics,
  onOpenFourMonthPlan,
  athleteWeightKg = 110,
  athleteHeightCm = 177,
  athleteAge = 28,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sub-tab Navigation: 'daily' (Günlük Menü) | 'roadmap' (Yol Haritası)
  const [nutritionSubTab, setNutritionSubTab] = useState<'daily' | 'roadmap'>('daily');
  const [roadmapPhase, setRoadmapPhase] = useState<number>(1);

  // Today's consumed water logs
  const [waterLogs, setWaterLogs] = useState<WaterLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('apex_water_logs_today');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('apex_water_logs_today', JSON.stringify(waterLogs));
    } catch {}
  }, [waterLogs]);

  // Popular Food Confirm Modal State
  const [selectedFoodForConfirm, setSelectedFoodForConfirm] = useState<PopularFood | null>(null);
  const [isFoodConfirmModalOpen, setIsFoodConfirmModalOpen] = useState<boolean>(false);

  // Popular Foods Filter & Search State
  const [popularCategory, setPopularCategory] = useState<string>('Tümü');
  const [popularSearch, setPopularSearch] = useState<string>('');

  // Last added meal ID for quick 1-click Undo
  const [lastAddedMeal, setLastAddedMeal] = useState<{ id: string; name: string; calories: number } | null>(null);

  // Custom in-page inputs
  const [customProteinInput, setCustomProteinInput] = useState<string>('');
  const [customWaterInput, setCustomWaterInput] = useState<string>('');
  const [customCalorieInput, setCustomCalorieInput] = useState<string>('');
  const [customCalorieDesc, setCustomCalorieDesc] = useState<string>('');
  const [customCalorieProtein, setCustomCalorieProtein] = useState<string>('');
  const [isProteinoceanModalOpen, setIsProteinoceanModalOpen] = useState<boolean>(false);

  // Expandable form states
  const [isAddingMeal, setIsAddingMeal] = useState<boolean>(false);
  const [newMealName, setNewMealName] = useState<string>('');
  const [newMealProtein, setNewMealProtein] = useState<string>('30');
  const [newMealCarbs, setNewMealCarbs] = useState<string>('40');
  const [newMealFats, setNewMealFats] = useState<string>('10');
  const [newMealCalories, setNewMealCalories] = useState<string>('370');
  const [newMealTime, setNewMealTime] = useState<string>('14:00');

  // Custom Supplement form
  const [isAddingSupplement, setIsAddingSupplement] = useState<boolean>(false);
  const [newSupName, setNewSupName] = useState<string>('');
  const [newSupDosage, setNewSupDosage] = useState<string>('');
  const [newSupTime, setNewSupTime] = useState<string>('Antrenman öncesi');

  // Target customization state
  const [isEditingTargets, setIsEditingTargets] = useState<boolean>(false);
  const [targetForm, setTargetForm] = useState({
    proteinTarget: nutrition?.proteinTarget || 185,
    energyTarget: nutrition?.energyTarget || 1750,
    carbsTarget: nutrition?.carbsTarget || 145,
    fatsTarget: nutrition?.fatsTarget || 44,
    hydrationTarget: nutrition?.hydrationTarget || 3.25,
  });

  // 4-Month Nutrition Plan & Active Day Selection State
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    const dayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
    const map = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    return map[dayIndex] || 'Pazartesi';
  });
  const [isPortionRulesOpen, setIsPortionRulesOpen] = useState<boolean>(false);
  const [rotationModalType, setRotationModalType] = useState<'breakfast' | 'snack' | null>(null);

  // ========================================================
  // 💧 SU HATIRLATMA SAYACI (WATER REMINDER TIMER) STATE
  // ========================================================
  const [waterIntervalMinutes, setWaterIntervalMinutes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('apex_water_interval');
      return saved ? Number(saved) : 45;
    } catch {
      return 45;
    }
  });

  const [waterTimerRemaining, setWaterTimerRemaining] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('apex_water_remaining');
      return saved ? Number(saved) : 45 * 60;
    } catch {
      return 45 * 60;
    }
  });

  const [isWaterTimerRunning, setIsWaterTimerRunning] = useState<boolean>(true);
  const [isWaterAlarmActive, setIsWaterAlarmActive] = useState<boolean>(false);
  const [isWaterSoundEnabled, setIsWaterSoundEnabled] = useState<boolean>(true);

  // Interval timer tick effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isWaterTimerRunning && waterTimerRemaining > 0) {
      timer = setInterval(() => {
        setWaterTimerRemaining((prev) => {
          if (prev <= 1) {
            setIsWaterAlarmActive(true);
            if (isWaterSoundEnabled) {
              playWaterChime();
            }
            showToast('💧 Su İçme Vakti Geldi! Vücudunuz ve kas dokunuz su bekliyor.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isWaterTimerRunning, waterTimerRemaining, isWaterSoundEnabled]);

  // Sync remaining to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('apex_water_remaining', String(waterTimerRemaining));
      localStorage.setItem('apex_water_interval', String(waterIntervalMinutes));
    } catch {
      // Ignore
    }
  }, [waterTimerRemaining, waterIntervalMinutes]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Safe localized number formatting
  const safeNumber = (val: unknown, fallback = 0): number => {
    const num = Number(val);
    return isNaN(num) ? fallback : num;
  };

  const safeLocale = (val: unknown, fallback = 0): string => {
    const num = safeNumber(val, fallback);
    return num.toLocaleString('tr-TR');
  };

  // Safe normalized values
  const proteinGrams = safeNumber(nutrition?.proteinGrams, 0);
  const proteinTarget = Math.max(1, safeNumber(nutrition?.proteinTarget, 185));
  const energyKcal = safeNumber(nutrition?.energyKcal, 0);
  const energyTarget = Math.max(1, safeNumber(nutrition?.energyTarget, 1750));
  const carbsGrams = safeNumber(nutrition?.carbsGrams, 0);
  const carbsTarget = Math.max(1, safeNumber(nutrition?.carbsTarget, 145));
  const fatsGrams = safeNumber(nutrition?.fatsGrams, 0);
  const fatsTarget = Math.max(1, safeNumber(nutrition?.fatsTarget, 44));
  const hydrationLiters = safeNumber(nutrition?.hydrationLiters, 0);
  const hydrationTarget = Math.max(0.1, safeNumber(nutrition?.hydrationTarget, 3.25));
  const sodiumMg = safeNumber(nutrition?.sodiumMg, 2100);
  const sodiumTargetMg = Math.max(1, safeNumber(nutrition?.sodiumTargetMg, 3000));
  const currentGoal = nutrition?.goal || 'KİŞİSEL BESLENME DÜZENİ';

  const meals: MealItem[] = Array.isArray(nutrition?.meals) && nutrition.meals.length > 0
    ? nutrition.meals
    : INITIAL_NUTRITION.meals;

  // Beslenme düzenine göre saat sırasıyla listeleme (08:00 Kahvaltı -> 13:00 Öğle -> 16:30 Ara Öğün -> 19:00 Akşam)
  const sortedMeals = [...meals].sort((a, b) => {
    const timeA = a.time || '12:00';
    const timeB = b.time || '12:00';
    return timeA.localeCompare(timeB);
  });

  const getMealRoutineBadge = (meal: MealItem, idx: number) => {
    const time = meal.time || '';
    const nameLower = meal.name.toLowerCase();
    if (meal.id === 'meal-1' || nameLower.includes('kahvaltı') || time <= '10:30') {
      return { badge: '1. ÖĞÜN • KAHVALTI', color: 'text-amber-400 border-amber-500/30 bg-amber-950/40' };
    }
    if (meal.id === 'meal-2' || nameLower.includes('öğle') || (time > '10:30' && time <= '14:30')) {
      return { badge: '2. ÖĞÜN • ÖĞLE YEMEĞİ', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40' };
    }
    if (meal.id === 'meal-3' || nameLower.includes('ara') || nameLower.includes('pre') || (time > '14:30' && time <= '17:30')) {
      return { badge: '3. ÖĞÜN • ARA ÖĞÜN', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40' };
    }
    if (meal.id === 'meal-4' || nameLower.includes('akşam') || (time > '17:30' && time <= '21:30')) {
      return { badge: '4. ÖĞÜN • AKŞAM YEMEĞİ', color: 'text-purple-400 border-purple-500/30 bg-purple-950/40' };
    }
    return { badge: `${idx + 1}. ÖĞÜN • EK BESLENME`, color: 'text-[#FF5356] border-red-500/30 bg-red-950/40' };
  };

  const supplements: SupplementProtocol[] = Array.isArray(nutrition?.supplements) && nutrition.supplements.length > 0
    ? nutrition.supplements
    : INITIAL_NUTRITION.supplements;

  // Calculated metrics
  const proteinPercent = Math.min(100, Math.round((proteinGrams / proteinTarget) * 100));
  const remainingProtein = Math.max(0, proteinTarget - proteinGrams);
  const energyPercent = Math.min(100, Math.round((energyKcal / energyTarget) * 100));
  const remainingEnergy = Math.max(0, energyTarget - energyKcal);
  const carbsPercent = Math.min(100, Math.round((carbsGrams / carbsTarget) * 100));
  const fatsPercent = Math.min(100, Math.round((fatsGrams / fatsTarget) * 100));
  const hydrationPercent = Math.min(100, Math.round((hydrationLiters / hydrationTarget) * 100));

  // Save customized targets
  const handleSaveTargets = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateNutrition({
      ...nutrition,
      proteinTarget: targetForm.proteinTarget,
      energyTarget: targetForm.energyTarget,
      carbsTarget: targetForm.carbsTarget,
      fatsTarget: targetForm.fatsTarget,
      hydrationTarget: targetForm.hydrationTarget,
    });
    setIsEditingTargets(false);
    showToast('Özel makro ve hidrasyon hedefleri kaydedildi!');
  };

  // Quick Water Increments
  const handleAddWater = (liters: number, customLabel?: string) => {
    const nextHydration = Math.max(0, Number((hydrationLiters + liters).toFixed(2)));
    onUpdateNutrition({
      ...nutrition,
      hydrationLiters: nextHydration,
    });
    if (liters > 0) {
      const newEntry: WaterLogEntry = {
        id: `water-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        amountLiters: liters,
        label: customLabel || `${Math.round(liters * 1000)} ml Su`,
      };
      setWaterLogs((prev) => [newEntry, ...prev]);
      showToast(`💧 +${Math.round(liters * 1000)} ml su kaydedildi.`);
    } else {
      showToast(`${Math.round(Math.abs(liters) * 1000)} ml su geri alındı.`);
    }
  };

  const handleDeleteWaterLog = (logId: string) => {
    const target = waterLogs.find((w) => w.id === logId);
    if (!target) return;
    const nextLogs = waterLogs.filter((w) => w.id !== logId);
    setWaterLogs(nextLogs);
    const nextHydration = Math.max(0, Number((hydrationLiters - target.amountLiters).toFixed(2)));
    onUpdateNutrition({
      ...nutrition,
      hydrationLiters: nextHydration,
    });
    showToast(`🗑️ ${target.label} kaydı çıkarıldı (-${Math.round(target.amountLiters * 1000)} ml geri alındı).`);
  };

  const handleClearAllWater = () => {
    setWaterLogs([]);
    onUpdateNutrition({
      ...nutrition,
      hydrationLiters: 0,
    });
    showToast('💧 Su tüketim kaydı sıfırlandı.');
  };

  // Custom Water Add
  const handleAddCustomWater = (e: React.FormEvent) => {
    e.preventDefault();
    const ml = parseFloat(customWaterInput);
    if (!isNaN(ml) && ml > 0) {
      handleAddWater(ml / 1000);
      setCustomWaterInput('');
    }
  };

  // Handle Water Drink & Timer Restart Action
  const handleDrinkWaterAndRestartTimer = (liters = 0.25) => {
    handleAddWater(liters);
    setIsWaterAlarmActive(false);
    setWaterTimerRemaining(waterIntervalMinutes * 60);
    setIsWaterTimerRunning(true);
    showToast(`💧 +${Math.round(liters * 1000)}ml su eklendi! Sayaç ${waterIntervalMinutes} dakikaya ayarlandı.`);
  };

  // Change Water Interval
  const handleChangeWaterInterval = (mins: number) => {
    setWaterIntervalMinutes(mins);
    setWaterTimerRemaining(mins * 60);
    setIsWaterAlarmActive(false);
    setIsWaterTimerRunning(true);
    showToast(`⏱️ Su hatırlatması ${mins} dakika olarak ayarlandı.`);
  };

  // 4-Month Nutrition Plan Helpers
  const currentWeekPlan = FOUR_MONTH_WEEKS.find((w) => w.weekNumber === selectedWeek) || FOUR_MONTH_WEEKS[0];
  const currentDayPlan = currentWeekPlan.days[selectedDay] || currentWeekPlan.days['Pazartesi'];

  const handleApplyPlannedDay = () => {
    if (!currentDayPlan) return;
    const newMeals = convertDayMenuToMealItems(currentDayPlan);
    onUpdateNutrition({
      ...nutrition,
      energyKcal: 0,
      proteinGrams: 0,
      carbsGrams: 0,
      fatsGrams: 0,
      meals: newMeals,
    });
    showToast(`✅ ${selectedWeek}. Hafta ${selectedDay} menüsü yüklendi!`);
  };

  // Swap breakfast with rotation option
  const handleSelectBreakfastRotation = (option: typeof BREAKFAST_ROTATION[0]) => {
    const updatedMeals = meals.map((m) => {
      const isBreakfast = m.id === 'meal-1' || m.name.toLowerCase().includes('kahvaltı') || (m.time && m.time <= '10:30');
      if (isBreakfast) {
        return {
          ...m,
          name: `Kahvaltı (${option.title})`,
          description: option.items.join(' • '),
          protein: option.protein,
          calories: option.calories,
          carbs: option.carbs,
          fats: option.fats,
        };
      }
      return m;
    });
    onUpdateNutrition({ ...nutrition, meals: updatedMeals });
    setRotationModalType(null);
    showToast(`🍳 Kahvaltı: "${option.title}" olarak değiştirildi!`);
  };

  // Swap snack with rotation option
  const handleSelectSnackRotation = (option: typeof SNACK_ROTATION[0]) => {
    const updatedMeals = meals.map((m) => {
      const isSnack = m.id === 'meal-3' || m.name.toLowerCase().includes('ara') || (m.time && m.time > '14:30' && m.time <= '17:30');
      if (isSnack) {
        return {
          ...m,
          name: `Ara Öğün (${option.title})`,
          description: option.items.join(' • '),
          protein: option.protein,
          calories: option.calories,
          carbs: option.carbs,
          fats: option.fats,
        };
      }
      return m;
    });
    onUpdateNutrition({ ...nutrition, meals: updatedMeals });
    setRotationModalType(null);
    showToast(`🍎 Ara Öğün: "${option.title}" olarak değiştirildi!`);
  };

  const parseMealItems = (meal: MealItem): string[] => {
    let raw = meal.description?.trim();
    if (!raw) {
      raw = meal.name?.trim() || '';
    }
    if (!raw) return [];

    let items: string[] = [];
    if (raw.includes('\n')) {
      items = raw.split('\n').map((s) => s.trim().replace(/^[-*•]\s*/, '')).filter(Boolean);
    } else if (raw.includes('•')) {
      items = raw.split('•').map((s) => s.trim()).filter(Boolean);
    } else if (raw.includes(',')) {
      items = raw.split(',').map((s) => s.trim()).filter(Boolean);
    } else if (raw.includes(' + ')) {
      items = raw.split(' + ').map((s) => s.trim()).filter(Boolean);
    } else if (raw.includes(' / ')) {
      items = raw.split(' / ').map((s) => s.trim()).filter(Boolean);
    } else {
      items = [raw];
    }
    return items;
  };

  // Quick Protein Increments
  const handleAddQuickProtein = (grams: number) => {
    const nextProtein = proteinGrams + grams;
    const nextEnergy = energyKcal + grams * 4;
    onUpdateNutrition({
      ...nutrition,
      proteinGrams: nextProtein,
      energyKcal: nextEnergy,
    });
    showToast(`+${grams}g protein eklendi.`);
  };

  // Custom Protein Add
  const handleAddCustomProtein = (e: React.FormEvent) => {
    e.preventDefault();
    const g = parseFloat(customProteinInput);
    if (!isNaN(g) && g > 0) {
      handleAddQuickProtein(g);
      setCustomProteinInput('');
    }
  };

  // Manual Calorie Add
  const handleAddManualCalorie = (e?: React.FormEvent, directCal?: number, label?: string) => {
    if (e) e.preventDefault();
    const cal = directCal !== undefined ? directCal : Number(customCalorieInput);
    if (!cal || isNaN(cal) || cal <= 0) return;

    const extraProtein = customCalorieProtein ? Number(customCalorieProtein) : 0;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const desc = label || customCalorieDesc.trim() || 'Manuel Kalori Girişi';

    const newMeal: MealItem = {
      id: `manual-cal-${Date.now()}`,
      name: desc,
      time: timeStr,
      calories: cal,
      protein: extraProtein || Math.round((cal * 0.2) / 4),
      carbs: Math.round((cal * 0.5) / 4),
      fats: Math.round((cal * 0.3) / 9),
      description: `Manuel olarak kaydedilen ${cal} kcal${extraProtein ? ` (+${extraProtein}g Protein)` : ''}`,
      completed: true,
    };

    onUpdateNutrition({
      ...nutrition,
      energyKcal: energyKcal + cal,
      proteinGrams: proteinGrams + (extraProtein || Math.round((cal * 0.2) / 4)),
      carbsGrams: carbsGrams + Math.round((cal * 0.5) / 4),
      fatsGrams: fatsGrams + Math.round((cal * 0.3) / 9),
      meals: [newMeal, ...meals],
    });

    setLastAddedMeal({ id: newMeal.id, name: newMeal.name, calories: cal });
    setCustomCalorieInput('');
    setCustomCalorieDesc('');
    setCustomCalorieProtein('');
    showToast(`🔥 +${cal} kcal beslenmenize eklendi!`);
  };

  // ========================================================
  // POPULAR FOOD ADD CONFIRMATION (User Requested)
  // "herhangi bir yemeğe tıklandığında onayladıktan sonra kalori o günün kalorisine eklensin"
  // ========================================================
  const handleOpenFoodConfirm = (food: PopularFood) => {
    setSelectedFoodForConfirm(food);
    setIsFoodConfirmModalOpen(true);
  };

  const handleConfirmAddMeal = (newMeal: MealItem) => {
    onUpdateNutrition({
      ...nutrition,
      energyKcal: energyKcal + (newMeal.calories || 0),
      proteinGrams: proteinGrams + (newMeal.protein || 0),
      carbsGrams: carbsGrams + (newMeal.carbs || 0),
      fatsGrams: fatsGrams + (newMeal.fats || 0),
      meals: [newMeal, ...meals],
    });

    setLastAddedMeal({
      id: newMeal.id,
      name: newMeal.name,
      calories: newMeal.calories,
    });

    showToast(`✅ ${newMeal.name} eklendi (+${newMeal.calories} kcal, +${newMeal.protein}g Protein)!`);
  };

  // Quick Proteinocean Supplement Add
  const handleAddProteinoceanSupplement = (sup: ProteinoceanSupplement) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMealItem: MealItem = {
      id: `sup-${sup.id}-${Date.now()}`,
      name: `${sup.name} (${sup.serving})`,
      time: timeStr,
      protein: sup.protein,
      carbs: sup.carbs,
      fats: sup.fats,
      calories: sup.calories,
      description: `Proteinocean • ${sup.caloriesDisplay}${sup.caffeineMg ? ` • ${sup.caffeineMg}mg Kafein` : ''}`,
      completed: true,
    };

    onUpdateNutrition({
      ...nutrition,
      energyKcal: energyKcal + sup.calories,
      proteinGrams: proteinGrams + sup.protein,
      carbsGrams: carbsGrams + sup.carbs,
      fatsGrams: fatsGrams + sup.fats,
      meals: [newMealItem, ...meals],
    });

    setLastAddedMeal({ id: newMealItem.id, name: sup.name, calories: sup.calories });
    showToast(`${sup.emoji} ${sup.name} eklendi (+${sup.calories} kcal, +${sup.protein}g P)`);
  };

  // Helper to accurately recalculate macros across all meals (handling partial individual items)
  const recalculateAllMealMacros = (updatedMeals: MealItem[]) => {
    let nextProtein = 0;
    let nextCarbs = 0;
    let nextFats = 0;
    let nextEnergy = 0;

    for (const m of updatedMeals) {
      const allItems = parseMealItems(m);
      if (m.completed) {
        nextProtein += m.protein || 0;
        nextCarbs += m.carbs || 0;
        nextFats += m.fats || 0;
        nextEnergy += m.calories || 0;
      } else if (allItems.length > 0 && m.completedItems && m.completedItems.length > 0) {
        const ratio = Math.min(1, m.completedItems.length / allItems.length);
        nextProtein += (m.protein || 0) * ratio;
        nextCarbs += (m.carbs || 0) * ratio;
        nextFats += (m.fats || 0) * ratio;
        nextEnergy += (m.calories || 0) * ratio;
      }
    }

    return {
      proteinGrams: Math.round(nextProtein),
      carbsGrams: Math.round(nextCarbs),
      fatsGrams: Math.round(nextFats),
      energyKcal: Math.round(nextEnergy),
    };
  };

  // Toggle whole meal (Toplu İşaretleme)
  const handleToggleMeal = (mealId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const targetMeal = meals.find((m) => m.id === mealId);
    if (!targetMeal) return;

    const allItems = parseMealItems(targetMeal);
    const isCurrentlyDone = targetMeal.completed || (allItems.length > 0 && (targetMeal.completedItems?.length || 0) >= allItems.length);
    const willComplete = !isCurrentlyDone;

    const updatedMeals = meals.map((m) =>
      m.id === mealId
        ? {
            ...m,
            completed: willComplete,
            completedItems: willComplete ? [...allItems] : [],
          }
        : m
    );

    const calcMacros = recalculateAllMealMacros(updatedMeals);

    onUpdateNutrition({
      ...nutrition,
      ...calcMacros,
      meals: updatedMeals,
    });

    showToast(
      willComplete
        ? `🔥 ${targetMeal.name} tamamı tüketildi (+${targetMeal.protein}g P)!`
        : `↩️ ${targetMeal.name} sıfırlandı`
    );
  };

  // Toggle single food item inside a meal (Ayrı Ayrı İşaretleme)
  const handleToggleMealItem = (mealId: string, itemText: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const targetMeal = meals.find((m) => m.id === mealId);
    if (!targetMeal) return;

    const allItems = parseMealItems(targetMeal);
    const currentCompleted = targetMeal.completedItems
      ? [...targetMeal.completedItems]
      : targetMeal.completed
      ? [...allItems]
      : [];

    const isAlreadyCompleted = currentCompleted.includes(itemText);
    const newCompletedItems = isAlreadyCompleted
      ? currentCompleted.filter((it) => it !== itemText)
      : [...currentCompleted, itemText];

    const isFullyCompleted = allItems.length > 0 && newCompletedItems.length >= allItems.length;

    const updatedMeals = meals.map((m) =>
      m.id === mealId
        ? {
            ...m,
            completed: isFullyCompleted,
            completedItems: newCompletedItems,
          }
        : m
    );

    const calcMacros = recalculateAllMealMacros(updatedMeals);

    onUpdateNutrition({
      ...nutrition,
      ...calcMacros,
      meals: updatedMeals,
    });

    showToast(
      isAlreadyCompleted
        ? `↩️ "${itemText.slice(0, 22)}" geri alındı`
        : `✅ "${itemText.slice(0, 22)}" tüketildi!`
    );
  };

  // ========================================================
  // MEAL DELETION & UNDO (User Requested)
  // "Yanlışlıkla eklediğim yemek olursa çıkartabileyim"
  // ========================================================
  const handleDeleteMeal = (mealId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const targetMeal = meals.find((m) => m.id === mealId);
    if (!targetMeal) return;

    const updatedMeals = meals.filter((m) => m.id !== mealId);
    const calcMacros = recalculateAllMealMacros(updatedMeals);

    onUpdateNutrition({
      ...nutrition,
      ...calcMacros,
      meals: updatedMeals,
    });

    if (lastAddedMeal?.id === mealId) {
      setLastAddedMeal(null);
    }

    showToast(`🗑️ ${targetMeal.name} silindi (-${targetMeal.calories} kcal geri alındı).`);
  };

  // Undo Last Added Meal
  const handleUndoLastAddedMeal = () => {
    if (!lastAddedMeal) return;
    handleDeleteMeal(lastAddedMeal.id);
  };

  // ========================================================
  // CONSUMED FOOD & WATER LIST HELPERS (User Requested)
  // "aldığım gıda ve suyu listele hata varsa çıkarabileceğim şekilde olsun"
  // ========================================================
  const consumedFoodEntries: ConsumedFoodEntry[] = useMemo(() => {
    const list: ConsumedFoodEntry[] = [];
    for (const meal of meals) {
      const items = parseMealItems(meal);
      const isCompleted = meal.completed;
      const completedItems = meal.completedItems || (isCompleted ? items : []);

      if (items.length > 0) {
        const itemCount = items.length;
        const itemCal = Math.round((meal.calories || 0) / itemCount);
        const itemP = Math.round(((meal.protein || 0) / itemCount) * 10) / 10;
        const itemC = Math.round(((meal.carbs || 0) / itemCount) * 10) / 10;
        const itemF = Math.round(((meal.fats || 0) / itemCount) * 10) / 10;

        for (const it of items) {
          if (completedItems.includes(it) || isCompleted) {
            list.push({
              uniqueKey: `${meal.id}-${it}`,
              mealId: meal.id,
              mealName: meal.name,
              mealTime: meal.time || '12:00',
              itemText: it,
              calories: itemCal,
              protein: itemP,
              carbs: itemC,
              fats: itemF,
              isStandaloneMeal: false,
            });
          }
        }
      } else if (isCompleted) {
        list.push({
          uniqueKey: `meal-${meal.id}`,
          mealId: meal.id,
          mealName: meal.name,
          mealTime: meal.time || '12:00',
          itemText: meal.name,
          calories: meal.calories || 0,
          protein: meal.protein || 0,
          carbs: meal.carbs || 0,
          fats: meal.fats || 0,
          isStandaloneMeal: true,
        });
      }
    }
    return list;
  }, [meals]);

  const handleRemoveConsumedFood = (entry: ConsumedFoodEntry) => {
    if (entry.isStandaloneMeal) {
      handleDeleteMeal(entry.mealId);
    } else {
      handleToggleMealItem(entry.mealId, entry.itemText);
    }
  };

  // Add custom meal from in-page form
  const handleCreateMeal = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(newMealProtein) || 0;
    const c = parseFloat(newMealCarbs) || 0;
    const f = parseFloat(newMealFats) || 0;
    const kcal = parseFloat(newMealCalories) || (p * 4 + c * 4 + f * 9);

    const newMeal: MealItem = {
      id: `meal-${Date.now()}`,
      name: newMealName.trim() || 'Özel Öğün',
      time: newMealTime || '12:00',
      protein: p,
      carbs: c,
      fats: f,
      calories: kcal,
      description: `${p}g Protein, ${c}g Karb, ${f}g Yağ`,
      completed: true,
    };

    onUpdateNutrition({
      ...nutrition,
      proteinGrams: proteinGrams + p,
      carbsGrams: carbsGrams + c,
      fatsGrams: fatsGrams + f,
      energyKcal: energyKcal + kcal,
      meals: [newMeal, ...meals],
    });

    setLastAddedMeal({ id: newMeal.id, name: newMeal.name, calories: kcal });
    setNewMealName('');
    setIsAddingMeal(false);
    showToast(`${newMeal.name} başarıyla eklendi!`);
  };

  // Toggle supplement taken
  const handleToggleSupplement = (supId: string) => {
    const updatedSups = supplements.map((s) => {
      if (s.id !== supId) return s;
      return { ...s, taken: !s.taken };
    });
    onUpdateNutrition({ ...nutrition, supplements: updatedSups });
    const sup = supplements.find((s) => s.id === supId);
    showToast(sup && !sup.taken ? `${sup.name} alındı!` : `${sup?.name} durumu güncellendi.`);
  };

  // Add custom supplement
  const handleCreateSupplement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName.trim()) return;

    const newSup: SupplementProtocol = {
      id: `sup-${Date.now()}`,
      name: newSupName.trim(),
      dosage: newSupDosage.trim() || 'Standart ölçek',
      timeWindow: newSupTime.trim() || 'Günlük',
      purpose: 'Performans & toparlanma desteği',
      taken: true,
    };

    onUpdateNutrition({
      ...nutrition,
      supplements: [...supplements, newSup],
    });

    setNewSupName('');
    setNewSupDosage('');
    setIsAddingSupplement(false);
    showToast(`${newSup.name} takviye listesine eklendi!`);
  };

  // Reset today's consumption
  const handleResetDay = () => {
    const resetMeals = meals.map((m) => ({ ...m, completed: false }));
    const resetSups = supplements.map((s) => ({ ...s, taken: false }));
    onUpdateNutrition({
      ...nutrition,
      proteinGrams: 0,
      energyKcal: 0,
      carbsGrams: 0,
      fatsGrams: 0,
      hydrationLiters: 0,
      meals: resetMeals,
      supplements: resetSups,
    });
    showToast('Bugünkü tüketim sıfırlandı. Yeni güne hazırsınız!');
  };

  // Filtered popular foods
  const filteredPopularFoods = POPULAR_FOODS.filter((food) => {
    const matchesCategory = popularCategory === 'Tümü' || food.category === popularCategory;
    const matchesSearch =
      popularSearch.trim() === '' ||
      food.name.toLowerCase().includes(popularSearch.toLowerCase()) ||
      food.description.toLowerCase().includes(popularSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Water timer formatted minutes and seconds
  const timerMins = Math.floor(waterTimerRemaining / 60);
  const timerSecs = waterTimerRemaining % 60;
  const timerFormatted = `${String(timerMins).padStart(2, '0')}:${String(timerSecs).padStart(2, '0')}`;
  const timerTotalSeconds = waterIntervalMinutes * 60;
  const timerProgress = Math.max(0, Math.min(100, ((timerTotalSeconds - waterTimerRemaining) / timerTotalSeconds) * 100));

  return (
    <div className="space-y-4 pb-28 select-none">
      {/* ========================================================
          1. BAŞLIK VE HIZLI EYLEMLER
         ======================================================== */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between pt-1">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-[#FF5356] uppercase tracking-wider font-mono block">
              GÜNLÜK BESLENME VE HİDRASYON
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              BESLENME DÜZENİ
            </h2>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => {
                setTargetForm({
                  proteinTarget,
                  energyTarget,
                  carbsTarget,
                  fatsTarget,
                  hydrationTarget,
                });
                setIsEditingTargets(true);
              }}
              className="h-9 px-2.5 rounded-xl bg-[#1F1F24] hover:bg-[#292A2E] text-[#A0A5B5] hover:text-white border border-[#262936] text-xs font-bold flex items-center space-x-1 transition-all"
            >
              <Sliders className="w-3.5 h-3.5 text-[#FF5356]" />
              <span className="hidden sm:inline">Hedefleri Düzenle</span>
            </button>

            {onOpenFinishDayModal && (
              <button
                type="button"
                onClick={onOpenFinishDayModal}
                className="h-9 px-2.5 sm:px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center space-x-1 shadow-md shadow-indigo-600/25 transition-all active:scale-95"
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Günü Bitir</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAddingMeal(true)}
              className="h-9 px-3 rounded-xl bg-[#FF1E38] hover:bg-[#FF334B] text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-[#FF1E38]/20 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3px]" />
              <span>Öğün Ekle</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. 💧 AKILLI HİDRASYON & SU TAKİBİ (En Üstte - "su üste kalsın")
         ======================================================== */}
      <div className="rounded-2xl bg-gradient-to-br from-[#121824] via-[#141A29] to-[#121319] border border-blue-500/30 p-4 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Droplet className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
              AKILLI HİDRASYON & SU TAKİBİ
            </h3>
          </div>
          <span className="text-[11px] font-bold text-blue-400 font-mono">
            %{hydrationPercent} TAMAMLANDI
          </span>
        </div>

        {/* Hydration Main Readout & Cylinder Meter */}
        <div className="p-3.5 rounded-xl bg-[#0F131C] border border-[#262936] flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-extrabold text-white font-mono tracking-tight tabular-nums">
                {Math.round(hydrationLiters * 1000)} ml
              </span>
              <span className="text-sm font-bold text-[#A0A5B5] font-mono">
                / 3.250 ml Hedef
              </span>
            </div>
            <p className="text-[11px] text-[#A0A5B5] mt-1">
              Hücresel hidrasyon & kas hacmi:{' '}
              <strong className={hydrationPercent >= 80 ? 'text-emerald-400' : 'text-blue-300'}>
                {hydrationPercent >= 100 ? 'Hedef Tamamlandı 🎯' : hydrationPercent >= 80 ? 'Optimal Seviye' : `${Math.max(0, 3250 - Math.round(hydrationLiters * 1000))} ml kaldı`}
              </strong>
            </p>
          </div>

          {/* Graduated Water Flask Graphic */}
          <div className="w-10 h-16 rounded-lg border-2 border-blue-400/40 bg-[#0A0D14] p-1 flex flex-col justify-end relative overflow-hidden shrink-0">
            <div
              className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-sm transition-all duration-500"
              style={{ height: `${Math.min(100, hydrationPercent)}%` }}
            />
            {/* Measurement notches */}
            <div className="absolute inset-0 flex flex-col justify-between py-1.5 pointer-events-none opacity-40">
              <div className="w-2 h-[1px] bg-white ml-auto" />
              <div className="w-3 h-[1px] bg-white ml-auto" />
              <div className="w-2 h-[1px] bg-white ml-auto" />
              <div className="w-3 h-[1px] bg-white ml-auto" />
            </div>
          </div>
        </div>

        {/* SU HATIRLATMA SAYACI WIDGET */}
        <div className="p-3.5 rounded-xl bg-[#0D111A] border border-blue-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isWaterAlarmActive ? 'bg-amber-400 animate-ping' : isWaterTimerRunning ? 'bg-blue-400 animate-pulse' : 'bg-[#5A6072]'}`} />
              <span className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Su Hatırlatma Sayacı</span>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsWaterSoundEnabled(!isWaterSoundEnabled)}
                title={isWaterSoundEnabled ? 'Ses Açık' : 'Ses Sessizde'}
                className="text-[#A0A5B5] hover:text-white p-1"
              >
                {isWaterSoundEnabled ? (
                  <Volume2 className="w-4 h-4 text-blue-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[#71778E]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsWaterTimerRunning(!isWaterTimerRunning)}
                className="text-xs font-bold text-blue-300 hover:text-white px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/40 flex items-center space-x-1"
              >
                {isWaterTimerRunning ? (
                  <>
                    <Pause className="w-3 h-3" />
                    <span>Duraklat</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>Başlat</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Alarm Banner if timer finished */}
          {isWaterAlarmActive && (
            <div className="p-2.5 rounded-lg bg-blue-900/40 border border-blue-400 text-blue-200 text-xs flex items-center justify-between animate-bounce">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-blue-300 animate-wiggle" />
                <span className="font-extrabold">💧 Su İçme Vakti Geldi!</span>
              </div>
              <button
                onClick={() => handleDrinkWaterAndRestartTimer(0.25)}
                className="px-2.5 py-1 rounded bg-blue-500 hover:bg-blue-400 text-white text-[10px] font-black"
              >
                +250ml İçtim & Kapat
              </button>
            </div>
          )}

          {/* Countdown Display & Interval Selection */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#A0A5B5] uppercase font-bold block">
                Sonraki Hatırlatmaya Kalan:
              </span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-3xl font-black font-mono tracking-wider text-white">
                  {timerFormatted}
                </span>
                <span className="text-[10px] font-mono text-blue-400 font-bold">
                  ({waterIntervalMinutes} dk periyot)
                </span>
              </div>
            </div>

            {/* Circular Countdown Progress Mini Graphic */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#1F2432]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-400 transition-all duration-300"
                  strokeDasharray={`${timerProgress}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <Droplet className="w-4 h-4 text-blue-400 absolute" />
            </div>
          </div>

          {/* Reminder Interval Selectors */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] text-[#A0A5B5] font-bold block">Hatırlatma Sıklığı:</span>
            <div className="grid grid-cols-5 gap-1">
              {[30, 45, 60, 90, 120].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleChangeWaterInterval(mins)}
                  className={`py-1 rounded-lg text-center text-[10px] font-bold font-mono transition-all ${
                    waterIntervalMinutes === mins
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-[#151B27] text-[#A0A5B5] hover:text-white border border-[#242C3D]'
                  }`}
                >
                  {mins} dk
                </button>
              ))}
            </div>
          </div>

          {/* One-click Drink & Reset Timer Button */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleDrinkWaterAndRestartTimer(0.25)}
              className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-[11px] font-black flex items-center justify-center space-x-1 shadow-md shadow-blue-600/30 transition-all active:scale-95"
            >
              <span>💧 +250ml Bardak</span>
            </button>

            <button
              type="button"
              onClick={() => handleDrinkWaterAndRestartTimer(0.5)}
              className="py-2.5 px-2 rounded-xl bg-[#151B27] hover:bg-[#1D2536] text-blue-300 hover:text-white border border-blue-500/40 text-[11px] font-bold flex items-center justify-center space-x-1 transition-all active:scale-95"
            >
              <span>🍶 +500ml Matara</span>
            </button>

            <button
              type="button"
              onClick={() => handleDrinkWaterAndRestartTimer(1.0)}
              className="py-2.5 px-2 rounded-xl bg-[#151B27] hover:bg-[#1D2536] text-cyan-300 hover:text-white border border-cyan-500/40 text-[11px] font-bold flex items-center justify-center space-x-1 transition-all active:scale-95"
            >
              <span>🍼 +1 Lt Şişe</span>
            </button>
          </div>
        </div>

        {/* Quick Cup Add Buttons */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => handleAddWater(0.25)}
            className="p-2 rounded-xl bg-[#121317] hover:bg-[#292A2E] text-white border border-[#262936] text-center transition-all active:scale-95"
          >
            <span className="text-base block mb-0.5">🥛</span>
            <span className="text-[10px] font-bold block">+250ml</span>
            <span className="text-[8px] text-[#A0A5B5] block">Bardak</span>
          </button>

          <button
            onClick={() => handleAddWater(0.5)}
            className="p-2 rounded-xl bg-[#121317] hover:bg-[#292A2E] text-white border border-[#262936] text-center transition-all active:scale-95"
          >
            <span className="text-base block mb-0.5">🍶</span>
            <span className="text-[10px] font-bold block">+500ml</span>
            <span className="text-[8px] text-[#A0A5B5] block">Matara</span>
          </button>

          <button
            onClick={() => handleAddWater(1.0)}
            className="p-2 rounded-xl bg-[#121317] hover:bg-[#292A2E] text-white border border-blue-500/40 hover:border-blue-400 text-center transition-all active:scale-95"
          >
            <span className="text-base block mb-0.5">🍼</span>
            <span className="text-[10px] font-bold block text-blue-300">+1.000ml</span>
            <span className="text-[8px] text-blue-400 font-extrabold block">1 Lt Şişe</span>
          </button>

          <button
            onClick={() => handleAddWater(-0.25)}
            className="p-2 rounded-xl bg-[#121317] hover:bg-[#292A2E] text-[#A0A5B5] hover:text-white border border-[#262936] text-center transition-all active:scale-95"
          >
            <span className="text-base block mb-0.5">↩️</span>
            <span className="text-[10px] font-bold block">-250ml</span>
            <span className="text-[8px] text-[#A0A5B5] block">Geri Al</span>
          </button>
        </div>

        {/* Custom Water Numeric Input */}
        <form onSubmit={handleAddCustomWater} className="flex items-center space-x-2 pt-1">
          <div className="relative flex-1">
            <input
              type="number"
              placeholder="Özel su miktarı (ör. 330)"
              value={customWaterInput}
              onChange={(e) => setCustomWaterInput(e.target.value)}
              className="w-full h-8 px-3 bg-[#121317] border border-[#262936] rounded-xl text-xs text-white placeholder-[#5A6072] focus:outline-none focus:border-blue-400"
            />
            <span className="absolute right-3 top-2 text-[10px] font-bold text-[#A0A5B5]">ml</span>
          </div>
          <button
            type="submit"
            disabled={!customWaterInput}
            className="h-8 px-3 rounded-xl bg-[#1F1F24] hover:bg-[#292A2E] text-blue-400 text-xs font-bold border border-[#262936] disabled:opacity-40 transition-all"
          >
            +ml Ekle
          </button>
        </form>

        {/* Elektrolit Telemetri Çubuğu */}
        <div className="p-3 rounded-xl bg-[#121317] border border-[#262936] flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-extrabold text-[#A0A5B5] uppercase block">
              SODYUM & ELEKTROLİT DENGESİ
            </span>
            <span className="text-white font-mono font-bold">
              {safeLocale(sodiumMg)} mg / {safeLocale(sodiumTargetMg)} mg
            </span>
          </div>
          <span className="px-2 py-1 rounded bg-[#292A2E] text-[10px] font-bold text-blue-300 font-mono border border-[#343439]">
            Hücre İçi Pompa OK
          </span>
        </div>
      </div>

      {/* ========================================================
          3. GÜNLÜK HEDEFLERİM KARTI (1.750 kcal • 185g Protein • 3.250 ml Su)
         ======================================================== */}
      <div className="rounded-2xl bg-gradient-to-br from-[#181A22] to-[#121318] border border-[#2B2E3D] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF1E38]" />
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
              GÜNLÜK BESLENME HEDEFLERİ
            </h3>
          </div>
          <span className="text-[10px] font-bold text-[#A0A5B5] font-mono">
            KİŞİSEL PROTOKOL
          </span>
        </div>

        {/* 3 Main Target Telemetry Cards */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {/* Kalori Hedefi: 1.750 kcal */}
          <div className="p-3 rounded-xl bg-[#0F1117] border border-[#262936] space-y-1">
            <div className="flex items-center justify-center space-x-1 text-[10px] font-extrabold text-[#FF5356] uppercase font-mono">
              <Flame className="w-3 h-3 text-[#FF5356]" />
              <span>ENERJİ</span>
            </div>
            <div className="text-base font-black text-white font-mono tracking-tight tabular-nums">
              1.750 <span className="text-[10px] font-normal text-[#A0A5B5]">kcal</span>
            </div>
            <div className="text-[10px] text-[#A0A5B5] font-mono">
              {safeLocale(energyKcal)} / 1.750
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#1A1C24] overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full"
                style={{ width: `${energyPercent}%` }}
              />
            </div>
          </div>

          {/* Protein Hedefi: 185 g */}
          <div className="p-3 rounded-xl bg-[#0F1117] border border-[#262936] space-y-1">
            <div className="flex items-center justify-center space-x-1 text-[10px] font-extrabold text-[#FF5356] uppercase font-mono">
              <span className="w-2 h-2 rounded-full bg-[#FF1E38]" />
              <span>PROTEİN</span>
            </div>
            <div className="text-base font-black text-white font-mono tracking-tight tabular-nums">
              185 <span className="text-[10px] font-normal text-[#A0A5B5]">g</span>
            </div>
            <div className="text-[10px] text-[#A0A5B5] font-mono">
              {proteinGrams}g / 185g
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#1A1C24] overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-[#FF1E38] to-[#FF5356] rounded-full"
                style={{ width: `${proteinPercent}%` }}
              />
            </div>
          </div>

          {/* Su Hedefi: 3.250 ml */}
          <div className="p-3 rounded-xl bg-[#0F1117] border border-[#262936] space-y-1">
            <div className="flex items-center justify-center space-x-1 text-[10px] font-extrabold text-blue-400 uppercase font-mono">
              <Droplet className="w-3 h-3 text-blue-400" />
              <span>SU</span>
            </div>
            <div className="text-base font-black text-white font-mono tracking-tight tabular-nums">
              3.250 <span className="text-[10px] font-normal text-blue-300">ml</span>
            </div>
            <div className="text-[10px] text-[#A0A5B5] font-mono">
              {Math.round(hydrationLiters * 1000)} / 3.250
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#1A1C24] overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                style={{ width: `${hydrationPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Target Customization Modal */}
      {isEditingTargets && (
        <div className="p-4 rounded-2xl bg-[#1A1C24] border border-[#FF1E38]/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-[#FF5356]" />
              <span>ÖZEL HEDEFLERİ BELİRLE</span>
            </h3>
            <button
              onClick={() => setIsEditingTargets(false)}
              className="text-[#A0A5B5] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveTargets} className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[#A0A5B5] font-bold block mb-1">Protein Hedefi (g)</label>
              <input
                type="number"
                value={targetForm.proteinTarget}
                onChange={(e) => setTargetForm({ ...targetForm, proteinTarget: Number(e.target.value) || 0 })}
                className="w-full h-9 px-3 bg-[#121317] border border-[#262936] rounded-lg text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[#A0A5B5] font-bold block mb-1">Enerji Hedefi (kcal)</label>
              <input
                type="number"
                value={targetForm.energyTarget}
                onChange={(e) => setTargetForm({ ...targetForm, energyTarget: Number(e.target.value) || 0 })}
                className="w-full h-9 px-3 bg-[#121317] border border-[#262936] rounded-lg text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[#A0A5B5] font-bold block mb-1">Karbonhidrat (g)</label>
              <input
                type="number"
                value={targetForm.carbsTarget}
                onChange={(e) => setTargetForm({ ...targetForm, carbsTarget: Number(e.target.value) || 0 })}
                className="w-full h-9 px-3 bg-[#121317] border border-[#262936] rounded-lg text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[#A0A5B5] font-bold block mb-1">Yağ Hedefi (g)</label>
              <input
                type="number"
                value={targetForm.fatsTarget}
                onChange={(e) => setTargetForm({ ...targetForm, fatsTarget: Number(e.target.value) || 0 })}
                className="w-full h-9 px-3 bg-[#121317] border border-[#262936] rounded-lg text-white font-mono"
              />
            </div>

            <div className="col-span-2">
              <label className="text-[#A0A5B5] font-bold block mb-1">Günlük Su Hedefi (Litre)</label>
              <input
                type="number"
                step="0.1"
                value={targetForm.hydrationTarget}
                onChange={(e) => setTargetForm({ ...targetForm, hydrationTarget: Number(e.target.value) || 0 })}
                className="w-full h-9 px-3 bg-[#121317] border border-[#262936] rounded-lg text-white font-mono"
              />
            </div>

            <div className="col-span-2 flex items-center space-x-2 pt-1">
              <button
                type="submit"
                className="flex-1 h-9 rounded-xl bg-[#FF1E38] hover:bg-[#FF334B] text-white font-bold text-xs"
              >
                Hedefleri Uygula
              </button>
              <button
                type="button"
                onClick={() => setIsEditingTargets(false)}
                className="h-9 px-3 rounded-xl bg-[#121317] border border-[#262936] text-[#A0A5B5] hover:text-white text-xs"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================
          4. 🍽️ GÜNLÜK BESLENME DÜZENİM (Suyun Altında - 4 Aylık Plan & Net Öğünler)
         ======================================================== */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1A1C24] via-[#161820] to-[#121319] border border-[#2F3548] p-4 shadow-lg space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-1 border-b border-[#262C3E]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF1E38] to-[#FF5356] flex items-center justify-center text-white shadow-md shadow-red-600/30">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black text-[#FF5356] uppercase tracking-wider font-mono block">
                4 AYLIK BESLENME PLANI
              </span>
              <h3 className="text-sm font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
                <span>GÜNLÜK BESLENME DÜZENİM</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-950/70 text-red-300 border border-red-800/40">
                  {sortedMeals.filter((m) => m.completed).length}/{sortedMeals.length} Öğün
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => setIsAddingMeal(!isAddingMeal)}
              className="h-8 px-2.5 rounded-xl bg-[#212534] hover:bg-[#2B3044] text-white text-xs font-bold border border-[#31374C] flex items-center space-x-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-[#FF5356]" />
              <span>{isAddingMeal ? 'Vazgeç' : 'Özel Öğün'}</span>
            </button>
          </div>
        </div>

        {/* 🕒 Günlük Düzen Saat Banner */}
        <div className="p-3 rounded-xl bg-[#0D1017] border border-[#242A3C] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#FF5356] shrink-0" />
            <span className="text-white font-extrabold">
              GÜNLÜK DÜZEN:
            </span>
            <span className="text-[#CBD0DF] font-mono text-[11px]">
              08:00 Kahvaltı • 13:00 Öğle • 16:30 Ara • 19:00 Akşam
            </span>
          </div>
          <span className="text-[10px] text-amber-400 font-medium">
            * Antrenman saatine göre 1–2 saat kaydırılabilir
          </span>
        </div>

        {/* Hafta ve Gün Seçici - 4 Aylık Plan Entegrasyonu */}
        <div className="p-3.5 rounded-xl bg-[#11141D] border border-[#262B3D] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#FF5356]" />
              <span className="text-xs font-bold text-white uppercase font-mono">
                Hafta & Gün Menüsü:
              </span>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
                className="h-7 px-2 bg-[#1A1E2B] border border-[#31374C] rounded-lg text-xs font-bold text-white font-mono focus:outline-none focus:border-[#FF1E38]"
              >
                {FOUR_MONTH_WEEKS.map((w) => (
                  <option key={w.weekNumber} value={w.weekNumber}>
                    {w.weekNumber}. Hafta ({w.monthNumber}. Ay)
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleApplyPlannedDay}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF1E38] to-[#FF5356] hover:from-[#FF334B] hover:to-[#FF686A] text-white text-[11px] font-black flex items-center space-x-1.5 shadow-md shadow-red-600/25 active:scale-95 transition-all"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{selectedDay} Planını Yükle</span>
            </button>
          </div>

          {/* Gün Seçim Butonları (Pazartesi - Pazar) */}
          <div className="grid grid-cols-7 gap-1">
            {DAYS_ORDER.map((day) => {
              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`py-1.5 rounded-xl text-center transition-all ${
                    isSelected
                      ? 'bg-[#FF1E38] text-white shadow-md shadow-red-600/30'
                      : 'bg-[#181C28] text-[#8E94A8] hover:text-white border border-[#252B3C]'
                  }`}
                >
                  <span className="block text-[9px] font-normal opacity-80">
                    {day === 'Çarşamba' ? 'ÇAR' : day === 'Perşembe' ? 'PER' : day === 'Cumartesi' ? 'CMT' : day.slice(0, 3).toUpperCase()}
                  </span>
                  <span className="block text-[11px] font-extrabold font-mono">
                    {day.slice(0, 3)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Günün Menü Özeti Bilgisi */}
          {currentDayPlan && (
            <div className="pt-1 flex items-center justify-between text-[11px] text-[#A0A5B5]">
              <span>
                Seçili: <strong className="text-white">{selectedWeek}. Hafta • {selectedDay}</strong>
              </span>
              <span className="font-mono text-white">
                Hedef: <strong className="text-[#FF5356] font-bold">{currentDayPlan.calories} kcal</strong> • <strong className="text-amber-400 font-bold">{currentDayPlan.protein}g Protein</strong>
              </span>
            </div>
          )}
        </div>

        {/* Quick Undo Banner if a meal was recently added */}
        {lastAddedMeal && (
          <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/40 flex items-center justify-between text-xs animate-fadeIn">
            <div className="flex items-center space-x-2 min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="text-[#CBD0DF] truncate">
                Son eklenen: <strong className="text-white">{lastAddedMeal.name}</strong> (+{lastAddedMeal.calories} kcal)
              </span>
            </div>
            <button
              type="button"
              onClick={handleUndoLastAddedMeal}
              className="px-2.5 py-1 rounded-lg bg-[#FF1E38] hover:bg-[#FF334B] text-white text-[10px] font-black flex items-center space-x-1 shrink-0 ml-2 transition-all active:scale-95"
            >
              <Undo2 className="w-3 h-3" />
              <span>Yanlışlıkla Ekledim, Çıkar</span>
            </button>
          </div>
        )}

        {/* In-page Add Meal Form */}
        {isAddingMeal && (
          <form onSubmit={handleCreateMeal} className="p-3.5 rounded-xl bg-[#121317] border border-[#FF1E38]/40 space-y-2.5 text-xs animate-fadeIn">
            <div className="font-bold text-white flex items-center justify-between">
              <span>Yeni Özel Öğün Bilgileri</span>
              <button
                type="button"
                onClick={() => setIsAddingMeal(false)}
                className="text-[#A0A5B5] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder="Öğün Adı (ör. 200g Tavuk & Pirinç)"
                  value={newMealName}
                  onChange={(e) => setNewMealName(e.target.value)}
                  className="w-full h-8 px-2.5 bg-[#1F1F24] border border-[#262936] rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Saat (13:30)"
                  value={newMealTime}
                  onChange={(e) => setNewMealTime(e.target.value)}
                  className="w-full h-8 px-2.5 bg-[#1F1F24] border border-[#262936] rounded-lg text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              <div>
                <label className="text-[9px] text-[#A0A5B5] block mb-0.5">Protein (g)</label>
                <input
                  type="number"
                  value={newMealProtein}
                  onChange={(e) => setNewMealProtein(e.target.value)}
                  className="w-full h-8 px-2 bg-[#1F1F24] border border-[#262936] rounded-lg text-white text-center font-mono"
                />
              </div>
              <div>
                <label className="text-[9px] text-[#A0A5B5] block mb-0.5">Karb (g)</label>
                <input
                  type="number"
                  value={newMealCarbs}
                  onChange={(e) => setNewMealCarbs(e.target.value)}
                  className="w-full h-8 px-2 bg-[#1F1F24] border border-[#262936] rounded-lg text-white text-center font-mono"
                />
              </div>
              <div>
                <label className="text-[9px] text-[#A0A5B5] block mb-0.5">Yağ (g)</label>
                <input
                  type="number"
                  value={newMealFats}
                  onChange={(e) => setNewMealFats(e.target.value)}
                  className="w-full h-8 px-2 bg-[#1F1F24] border border-[#262936] rounded-lg text-white text-center font-mono"
                />
              </div>
              <div>
                <label className="text-[9px] text-[#A0A5B5] block mb-0.5">Kalori</label>
                <input
                  type="number"
                  value={newMealCalories}
                  onChange={(e) => setNewMealCalories(e.target.value)}
                  className="w-full h-8 px-2 bg-[#1F1F24] border border-[#262936] rounded-lg text-white text-center font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-8 rounded-lg bg-[#FF1E38] hover:bg-[#FF334B] text-white font-bold text-xs shadow-sm transition-all"
            >
              Öğünü Listeye Ekle & Tüket
            </button>
          </form>
        )}

        {/* 🥗 YEMEKLER LİSTESİ - Net, Anlaşılır Maddeler & Tik Kutusu */}
        <div className="space-y-3">
          {sortedMeals.length === 0 ? (
            <div className="p-4 rounded-xl bg-[#121317] border border-[#262936] text-center text-xs text-[#A0A5B5]">
              Henüz öğün eklenmedi. Yukarıdaki "{selectedDay} Planını Yükle" butonuna basarak günün menüsünü aktarabilirsiniz.
            </div>
          ) : (
            sortedMeals.map((meal, idx) => {
              const routine = getMealRoutineBadge(meal, idx);
              const items = parseMealItems(meal);
              const isBreakfast = meal.id === 'meal-1' || meal.name.toLowerCase().includes('kahvaltı') || (meal.time && meal.time <= '10:30');
              const isSnack = meal.id === 'meal-3' || meal.name.toLowerCase().includes('ara') || (meal.time && meal.time > '14:30' && meal.time <= '17:30');
              const completedItems = meal.completedItems || (meal.completed ? items : []);
              const completedCount = completedItems.filter((it) => items.includes(it)).length;
              const isPartial = !meal.completed && completedCount > 0;

              return (
                <div
                  key={meal.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    meal.completed
                      ? 'bg-[#12141C]/80 border-emerald-500/40 shadow-sm'
                      : isPartial
                      ? 'bg-[#161822] border-amber-500/30 shadow-sm'
                      : 'bg-[#181A24] border-[#2E3346] hover:border-[#FF1E38]/60 shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                      {/* Checkbox (Tamamlama Tik Butonu - Toplu) */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleMeal(meal.id, e)}
                        title={meal.completed ? 'Tüm işaretleri kaldır' : 'Tümünü tüketildi olarak işaretle'}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border transition-all active:scale-90 ${
                          meal.completed
                            ? 'bg-[#FF1E38] border-[#FF1E38] text-white shadow-md shadow-red-600/30'
                            : isPartial
                            ? 'bg-amber-500/30 border-amber-500 text-amber-300 shadow-sm'
                            : 'bg-[#212430] border-[#363B4E] text-transparent hover:border-[#FF1E38]'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3px]" />
                      </button>

                      {/* Öğün Bilgisi ve Madde Madde Yemekler */}
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black font-mono border uppercase tracking-wider ${routine.color}`}>
                            {routine.badge}
                          </span>
                          <span className="text-[11px] font-mono font-bold text-white bg-[#262B3B] px-2 py-0.5 rounded-lg flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-[#FF5356]" />
                            <span>{meal.time}</span>
                          </span>
                          {meal.completed ? (
                            <span className="text-[10px] font-bold text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-lg flex items-center gap-1">
                              <Check className="w-3 h-3 stroke-[3px]" />
                              <span>Tamamı Tüketildi ✓</span>
                            </span>
                          ) : isPartial ? (
                            <span className="text-[10px] font-bold text-amber-300 font-mono bg-amber-950/70 border border-amber-500/50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                              <span>{completedCount}/{items.length} Tüketildi (%{Math.round((completedCount / items.length) * 100)})</span>
                            </span>
                          ) : null}
                        </div>

                        <h4 className={`text-base font-extrabold text-white tracking-tight ${meal.completed ? 'line-through opacity-70' : ''}`}>
                          {meal.name}
                        </h4>

                        {/* Anlaşılır Liste Halinde Yemekler - Ayrı Ayrı & Toplu İşaretleme */}
                        <div className="space-y-2 pt-1" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-between text-[10px] font-bold text-[#8E94A8] uppercase tracking-wider">
                            <div className="flex items-center space-x-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5356]" />
                              <span>Öğün İçeriği ({completedCount}/{items.length} Tüketildi):</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => handleToggleMeal(meal.id, e)}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all border ${
                                meal.completed
                                  ? 'bg-red-950/40 border-red-800/40 text-red-300 hover:bg-red-900/50'
                                  : 'bg-emerald-950/50 border-emerald-600/40 text-emerald-300 hover:bg-emerald-900/60'
                              }`}
                            >
                              {meal.completed ? 'Toplu İşareti Kaldır' : 'Tümünü Tüket (Toplu)'}
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            {items.map((item, itemIdx) => {
                              const isItemDone = completedItems.includes(item);
                              return (
                                <div
                                  key={itemIdx}
                                  onClick={(e) => handleToggleMealItem(meal.id, item, e)}
                                  className={`flex items-center justify-between py-2 px-3 rounded-xl border transition-all cursor-pointer select-none group ${
                                    isItemDone
                                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200 shadow-sm'
                                      : 'bg-[#111319] border-[#242838] hover:border-[#383E54] text-white'
                                  }`}
                                >
                                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                                    <button
                                      type="button"
                                      onClick={(e) => handleToggleMealItem(meal.id, item, e)}
                                      className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                                        isItemDone
                                          ? 'bg-emerald-500 border-emerald-400 text-black shadow-sm'
                                          : 'bg-[#1A1D27] border-[#363B4E] text-transparent group-hover:border-emerald-500/60'
                                      }`}
                                    >
                                      <Check className="w-3.5 h-3.5 stroke-[3px]" />
                                    </button>
                                    <span
                                      className={`text-xs font-semibold leading-relaxed break-words flex-1 ${
                                        isItemDone ? 'line-through text-emerald-300/80 font-normal' : 'text-white'
                                      }`}
                                    >
                                      {item}
                                    </span>
                                  </div>

                                  <span
                                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ml-2 shrink-0 ${
                                      isItemDone
                                        ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/30'
                                        : 'bg-[#1C202E] text-[#8E94A8] border border-[#2D3346]'
                                    }`}
                                  >
                                    {isItemDone ? 'Tüketildi ✓' : 'Tek Tıkla İşaretle'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Hızlı Eylemler (Kahvaltı / Ara Öğün Değiştirme ve Silme) */}
                        <div className="flex flex-wrap items-center gap-2 pt-1.5">
                          {isBreakfast && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRotationModalType('breakfast');
                              }}
                              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-lg flex items-center space-x-1 transition-all"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>Kahvaltı Alternatifi Seç (4 Çeşit)</span>
                            </button>
                          )}

                          {isSnack && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRotationModalType('snack');
                              }}
                              className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1 rounded-lg flex items-center space-x-1 transition-all"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>Ara Öğün Alternatifi Seç (4 Çeşit)</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={(e) => handleDeleteMeal(meal.id, e)}
                            title="Öğünü Çıkar"
                            className="text-[11px] text-red-400 hover:text-white bg-red-950/30 hover:bg-red-900/50 border border-red-900/30 px-2.5 py-1 rounded-lg flex items-center space-x-1 transition-all ml-auto"
                          >
                            <Trash2 className="w-3 h-3 text-red-400" />
                            <span>Çıkar</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Makro Göstergesi */}
                    <div className="text-right shrink-0 flex flex-col items-end justify-between self-stretch">
                      <div className="bg-[#101218] border border-[#242938] px-2.5 py-1.5 rounded-xl text-right">
                        <span className="text-sm font-black text-[#FF5356] font-mono block">
                          +{meal.protein}g P
                        </span>
                        <span className="text-[11px] font-bold text-[#A0A5B5] font-mono block mt-0.5">
                          {meal.calories} kcal
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 📏 Porsiyon Standartları & Pişirme Kuralları Akordeonu */}
        <div className="rounded-xl bg-[#11141D] border border-[#262B3D] overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => setIsPortionRulesOpen(!isPortionRulesOpen)}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-[#181C28] transition-colors"
          >
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                📏 Porsiyon Standartları & Pişirme Kuralları
              </span>
            </div>
            {isPortionRulesOpen ? (
              <ChevronUp className="w-4 h-4 text-[#A0A5B5]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#A0A5B5]" />
            )}
          </button>

          {isPortionRulesOpen && (
            <div className="p-3.5 border-t border-[#262B3D] space-y-3 bg-[#0D1017] text-xs">
              <div>
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider font-mono block mb-1.5">
                  ANA YEMEK PORSİYON STANDARDI:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PORTION_STANDARDS.map((ps, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[#141822] border border-[#252B3C] space-y-1">
                      <span className="font-bold text-white block text-xs">{ps.name}</span>
                      <ul className="space-y-0.5 text-[11px] text-[#A0A5B5]">
                        {ps.portions.map((p, pIdx) => (
                          <li key={pIdx}>• {p}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black text-[#FF5356] uppercase tracking-wider font-mono block mb-1.5">
                  PİŞİRME & HAZIRLAMA KURALLARI:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COOKING_RULES.map((cr, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-[#141822] border border-[#252B3C] flex items-start space-x-2">
                      <span className="text-[10px] font-black text-[#FF5356] font-mono shrink-0 uppercase">
                        {cr.category}:
                      </span>
                      <span className="text-[11px] text-[#CBD0DF]">{cr.method}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          4. 🍗 POPÜLER & PRATİK YEMEKLER (User Requested)
          "en popüler yemekleri ekle tavuk göğsü pilav, baget kızartma vs pratik yemekleri ekle yumurta haşlama gibi gibi
          herhangi bir yemeğe tıklandığında onayladıktan sonra kalori o günün kalorisine eklensin"
         ======================================================== */}
      <div className="rounded-2xl bg-[#1F1F24] border border-[#262936] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white text-sm shadow-sm">
              🍗
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider font-mono">
                  PRATİK & EN POPÜLER YEMEKLER
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 font-mono">
                  {POPULAR_FOODS.length} Çeşit
                </span>
              </div>
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                Tek Dokunuşla Seç & Onaylayarak Ekle
              </h3>
            </div>
          </div>

          <span className="text-[10px] text-[#A0A5B5] hidden sm:inline">
            Tıklayınca porsiyon seçilip onaylanır
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#71778E] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Popüler yemek ara (tavuk pilav, baget kızartma, yumurta haşlama, köfte)..."
            value={popularSearch}
            onChange={(e) => setPopularSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 bg-[#121317] border border-[#262936] rounded-xl text-xs text-white placeholder-[#5A6072] focus:outline-none focus:border-[#FF1E38]"
          />
          {popularSearch && (
            <button
              onClick={() => setPopularSearch('')}
              className="absolute right-3 top-2.5 text-[#71778E] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['Tümü', 'Tavuk & Et', 'Kahvaltı & Yumurta', 'Balık & Deniz', 'Ara Öğün & Fit'].map((cat) => (
            <button
              key={cat}
              onClick={() => setPopularCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight shrink-0 transition-all ${
                popularCategory === cat
                  ? 'bg-[#FF1E38] text-white shadow-sm'
                  : 'bg-[#121317] text-[#A0A5B5] hover:text-white border border-[#262936]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-0.5 scrollbar-thin">
          {filteredPopularFoods.map((food) => (
            <div
              key={food.id}
              onClick={() => handleOpenFoodConfirm(food)}
              className="p-3 rounded-xl bg-[#121317] hover:bg-[#181920] border border-[#262936] hover:border-[#FF1E38]/70 text-left transition-all active:scale-[0.98] cursor-pointer group flex items-start justify-between space-x-2.5 shadow-sm"
            >
              <div className="flex items-start space-x-2.5 min-w-0">
                <span className="text-2xl mt-0.5 shrink-0 group-hover:scale-110 transition-transform">
                  {food.emoji}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <h4 className="text-xs font-bold text-white group-hover:text-[#FF5356] transition-colors truncate">
                      {food.name}
                    </h4>
                  </div>
                  <p className="text-[10px] text-[#A0A5B5] truncate mt-0.5">
                    {food.portionLabel}
                  </p>
                  <div className="flex items-center space-x-2 mt-1.5 text-[10px] font-mono">
                    <span className="text-[#FF5356] font-black">+{food.protein}g P</span>
                    <span className="text-[#71778E]">•</span>
                    <span className="text-amber-400 font-bold">{food.carbs}g K</span>
                    <span className="text-[#71778E]">•</span>
                    <span className="text-blue-400 font-bold">{food.fats}g Y</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 flex flex-col items-end">
                <span className="text-xs font-black font-mono text-white bg-red-950/60 border border-red-800/40 px-2 py-0.5 rounded text-red-300">
                  {food.calories} kcal
                </span>
                <span className="text-[9px] font-bold text-[#FF5356] mt-2 flex items-center space-x-0.5 opacity-90 group-hover:opacity-100">
                  <span>Ekle</span>
                  <Plus className="w-3 h-3 stroke-[3px]" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          6. PROTEINOCEAN GIDA TAKVİYELERİ & KALORİ ÖLÇER
         ======================================================== */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1C1618] via-[#1A1820] to-[#14141A] border border-red-500/30 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-amber-600 text-white flex items-center justify-center shadow-sm">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-black text-[#FF5356] uppercase tracking-wider font-mono">
                  PROTEINOCEAN
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-900/40 text-red-300 font-mono">
                  29 TAKVİYE
                </span>
              </div>
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                Gıda Takviyesi Kalorileri
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsProteinoceanModalOpen(true)}
            className="text-[11px] font-bold text-[#FF5356] hover:underline flex items-center space-x-1"
          >
            <span>Tümünü Gör</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-[11px] text-[#A0A5B5] leading-relaxed">
          Kullandığınız Proteinocean takviyesini seçin, kalori ve makroları tek dokunuşla bugünkü tüketiminize eklensin:
        </p>

        {/* Quick horizontal scroll of popular Proteinocean items */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {PROTEINOCEAN_SUPPLEMENTS.slice(0, 12).map((sup) => (
            <button
              key={sup.id}
              type="button"
              onClick={() => handleAddProteinoceanSupplement(sup)}
              className="p-2.5 rounded-xl bg-[#121317] hover:bg-[#181920] border border-[#262936] hover:border-[#FF1E38]/60 text-left transition-all active:scale-95 shrink-0 w-36 group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">{sup.emoji}</span>
                <span className="text-[10px] font-black font-mono text-[#FF5356] bg-red-950/40 px-1.5 py-0.5 rounded border border-red-900/30">
                  {sup.calories} kcal
                </span>
              </div>
              <div className="text-xs font-bold text-white truncate group-hover:text-[#FF5356] transition-colors">
                {sup.name}
              </div>
              <div className="text-[9px] text-[#A0A5B5] truncate mt-0.5">
                {sup.serving}
              </div>
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#262936]/60 text-[10px] font-bold text-[#FF5356]">
                <span>{sup.protein > 0 ? `+${sup.protein}g P` : sup.caffeineMg ? `${sup.caffeineMg}mg Kaf.` : '≈0 kcal'}</span>
                <Plus className="w-3 h-3 group-hover:scale-125 transition-transform" />
              </div>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsProteinoceanModalOpen(true)}
          className="w-full py-2.5 rounded-xl bg-[#1F1F24] hover:bg-[#292A2E] text-white text-xs font-bold border border-[#262936] flex items-center justify-center space-x-1.5 transition-colors"
        >
          <Pill className="w-3.5 h-3.5 text-[#FF5356]" />
          <span>Tüm 29 Proteinocean Takviyesi & Porsiyon Seçici</span>
        </button>
      </div>



      {/* ========================================================
          8. SUPPLEMENT & ERGOJENİK DESTEK PROTOKOLÜ
         ======================================================== */}
      <div className="rounded-2xl bg-[#1F1F24] border border-[#262936] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Pill className="w-4 h-4 text-[#FF5356]" />
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
              SUPPLEMENT & ERGOJENİK PROTOKOLÜ
            </h3>
          </div>
          <button
            onClick={() => setIsAddingSupplement(!isAddingSupplement)}
            className="text-[11px] font-bold text-[#FF5356] hover:underline flex items-center space-x-1"
          >
            <Plus className="w-3 h-3" />
            <span>Takviye Ekle</span>
          </button>
        </div>

        {/* Add custom supplement form */}
        {isAddingSupplement && (
          <form onSubmit={handleCreateSupplement} className="p-3 rounded-xl bg-[#121317] border border-[#FF1E38]/40 space-y-2 text-xs">
            <div className="font-bold text-white">Yeni Takviye</div>
            <input
              type="text"
              placeholder="Takviye Adı (ör. Beta-Alanin)"
              value={newSupName}
              onChange={(e) => setNewSupName(e.target.value)}
              className="w-full h-8 px-2.5 bg-[#1F1F24] border border-[#262936] rounded-lg text-white"
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Doz (ör. 3.2g)"
                value={newSupDosage}
                onChange={(e) => setNewSupDosage(e.target.value)}
                className="w-full h-8 px-2.5 bg-[#1F1F24] border border-[#262936] rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Zaman (ör. 30 dk önce)"
                value={newSupTime}
                onChange={(e) => setNewSupTime(e.target.value)}
                className="w-full h-8 px-2.5 bg-[#1F1F24] border border-[#262936] rounded-lg text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full h-8 rounded-lg bg-[#FF1E38] text-white font-bold"
            >
              Listeye Ekle
            </button>
          </form>
        )}

        <div className="space-y-2">
          {supplements.map((sup) => (
            <div
              key={sup.id}
              onClick={() => handleToggleSupplement(sup.id)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                sup.taken
                  ? 'bg-[#121317] border-[#262936]'
                  : 'bg-[#181920] border-[#FF1E38]/30 hover:border-[#FF1E38]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleSupplement(sup.id);
                  }}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                    sup.taken
                      ? 'bg-[#FF1E38] border-[#FF1E38] text-white shadow-sm'
                      : 'bg-[#292A2E] border-[#343439] text-transparent hover:border-[#FF1E38]'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3px]" />
                </button>
                <div>
                  <h4 className="text-xs font-bold text-white">{sup.name}</h4>
                  <p className="text-[11px] text-[#A0A5B5]">{sup.dosage} • {sup.timeWindow}</p>
                </div>
              </div>

              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded border font-mono ${
                  sup.taken
                    ? 'bg-[#1F1F24] border-[#262936] text-[#FF5356]'
                    : 'bg-[#292A2E] border-[#343439] text-[#A0A5B5]'
                }`}
              >
                {sup.taken ? 'Alındı ✓' : 'Bekliyor'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Day Button */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={handleResetDay}
          className="flex items-center space-x-1.5 text-xs text-[#A0A5B5] hover:text-[#FF5356] transition-colors py-2 px-4 rounded-xl bg-[#121317] border border-[#262936] hover:border-[#FF1E38]/50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Bugünkü Tüketimi Sıfırla (Temiz Başlangıç)</span>
        </button>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50 animate-bounce">
          <div className="bg-[#242735] border border-[#FF1E38] text-white p-3 rounded-xl shadow-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <CheckCircle className="w-4 h-4 text-[#FF5356] shrink-0" />
              <span className="text-xs font-semibold truncate">{toastMessage}</span>
            </div>
            <span className="text-[10px] font-extrabold text-[#A0A5B5] uppercase shrink-0 ml-2">
              BİLDİRİM
            </span>
          </div>
        </div>
      )}

      {/* Proteinocean Supplements Catalog Modal */}
      <ProteinoceanSupplementsModal
        isOpen={isProteinoceanModalOpen}
        onClose={() => setIsProteinoceanModalOpen(false)}
        nutrition={nutrition}
        onUpdateNutrition={onUpdateNutrition}
      />

      {/* ========================================================
          POPULAR FOOD CONFIRM MODAL (User Requested)
         ======================================================== */}
      <FoodConfirmModal
        isOpen={isFoodConfirmModalOpen}
        onClose={() => {
          setIsFoodConfirmModalOpen(false);
          setSelectedFoodForConfirm(null);
        }}
        food={selectedFoodForConfirm}
        onConfirmAddMeal={handleConfirmAddMeal}
      />

      {/* ========================================================
          KAHVALTI ROTASYONU SEÇİM MODALI (4 Alternatif)
         ======================================================== */}
      {rotationModalType === 'breakfast' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-[#181A24] border border-amber-500/40 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#292E40]">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  KAHVALTI ROTASYONU (4 SEÇENEK)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRotationModalType(null)}
                className="text-[#A0A5B5] hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#A0A5B5]">
              Bugünkü kahvaltınızı aşağıdaki 4 standart alternatiften biriyle tek dokunuşla güncelleyebilirsiniz:
            </p>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {BREAKFAST_ROTATION.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleSelectBreakfastRotation(option)}
                  className="p-3.5 rounded-xl bg-[#11131A] hover:bg-[#1C2030] border border-[#272D3F] hover:border-amber-500/60 cursor-pointer transition-all active:scale-[0.99] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-xs">{option.title}</span>
                    <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                      +{option.protein}g Protein • {option.calories} kcal
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1">
                    {option.items.map((it, iIdx) => (
                      <span key={iIdx} className="text-[11px] text-[#CBD0DF] flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span className="truncate">{it}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setRotationModalType(null)}
              className="w-full py-2.5 rounded-xl bg-[#202434] hover:bg-[#2B3146] text-white text-xs font-bold border border-[#31384E] transition-all"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          ARA ÖĞÜN ROTASYONU SEÇİM MODALI (4 Alternatif)
         ======================================================== */}
      {rotationModalType === 'snack' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-[#181A24] border border-cyan-500/40 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#292E40]">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  ARA ÖĞÜN ROTASYONU (4 SEÇENEK)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRotationModalType(null)}
                className="text-[#A0A5B5] hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#A0A5B5]">
              Antrenman ve tokluk durumunuza göre ara öğününüzü değiştirin:
            </p>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {SNACK_ROTATION.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleSelectSnackRotation(option)}
                  className="p-3.5 rounded-xl bg-[#11131A] hover:bg-[#1C2030] border border-[#272D3F] hover:border-cyan-500/60 cursor-pointer transition-all active:scale-[0.99] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-xs">{option.title}</span>
                    <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      +{option.protein}g Protein • {option.calories} kcal
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1">
                    {option.items.map((it, iIdx) => (
                      <span key={iIdx} className="text-[11px] text-[#CBD0DF] flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        <span className="truncate">{it}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setRotationModalType(null)}
              className="w-full py-2.5 rounded-xl bg-[#202434] hover:bg-[#2B3146] text-white text-xs font-bold border border-[#31384E] transition-all"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
