import React, { useState, useMemo } from 'react';
import {
  UtensilsCrossed,
  Dumbbell,
  Plus,
  Search,
  Trash2,
  Edit3,
  Check,
  X,
  Flame,
  Sparkles,
  ChevronRight,
  Info,
  ExternalLink,
  Eye,
  Zap,
  RotateCcw,
  CheckCircle2,
  SlidersHorizontal,
  Bookmark,
  PlusCircle,
  HelpCircle,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { PopularFood, POPULAR_FOODS } from '../data/popularFoodsData';
import {
  Exercise,
  ExerciseStep,
  ExerciseMistake,
  BiomechanicsDetail,
  MealItem,
} from '../types/fitness';
import { EXERCISES_DATA, HOTLINK_IMAGE_URL } from '../data/mockData';

interface CustomDatabaseSettingsProps {
  customFoods: PopularFood[];
  onAddCustomFood: (food: PopularFood) => void;
  onUpdateCustomFood: (food: PopularFood) => void;
  onDeleteCustomFood: (foodId: string) => void;
  customExercises: Exercise[];
  onAddCustomExercise: (exercise: Exercise) => void;
  onUpdateCustomExercise: (exercise: Exercise) => void;
  onDeleteCustomExercise: (exerciseId: string) => void;
  onOpenFoodConfirm?: (food: PopularFood) => void;
  onOpenExerciseDetail?: (exercise: Exercise) => void;
  onAddExerciseToWorkout?: (exercise: Exercise) => void;
}

const FOOD_EMOJIS = ['🍗', '🥩', '🍳', '🥪', '🐟', '🍚', '🥗', '🥔', '🥑', '🥣', '🥞', '🥛', '🍌', '🍫', '🧀', '🌯', '🍝', '🍎'];

const FOOD_CATEGORIES: PopularFood['category'][] = [
  'Tavuk & Et',
  'Kahvaltı & Yumurta',
  'Balık & Deniz',
  'Pratik & Karbonhidrat',
  'Ara Öğün & Fit',
];

const EXERCISE_CATEGORIES: Exercise['category'][] = [
  'İtiş (Push)',
  'Çekiş (Pull)',
  'Bacak (Legs)',
  'Core / Karın',
  'Omuz',
];

const ANATOMY_REGIONS: Exercise['anatomyRegion'][] = [
  'Göğüs',
  'Sırt/Lat',
  'Omuz',
  'Bacak',
  'Triceps',
  'Biceps',
  'Karın',
  'Kalça/Bel',
];

const EQUIPMENT_OPTIONS: Exercise['equipment'][] = [
  'Halter',
  'Dambıl',
  'Kablo / Makine',
  'Vücut Ağırlığı',
];

export const CustomDatabaseSettings: React.FC<CustomDatabaseSettingsProps> = ({
  customFoods,
  onAddCustomFood,
  onUpdateCustomFood,
  onDeleteCustomFood,
  customExercises,
  onAddCustomExercise,
  onUpdateCustomExercise,
  onDeleteCustomExercise,
  onOpenFoodConfirm,
  onOpenExerciseDetail,
  onAddExerciseToWorkout,
}) => {
  // Main settings sub-tab: 'foods' | 'exercises'
  const [activeSubTab, setActiveSubTab] = useState<'foods' | 'exercises'>('foods');

  // Search & Filter for Foods
  const [foodSearch, setFoodSearch] = useState<string>('');
  const [selectedFoodCategory, setSelectedFoodCategory] = useState<string>('TÜMÜ');
  const [showOnlyCustomFoods, setShowOnlyCustomFoods] = useState<boolean>(false);

  // Search & Filter for Exercises
  const [exerciseSearch, setExerciseSearch] = useState<string>('');
  const [selectedExerciseCategory, setSelectedExerciseCategory] = useState<string>('TÜMÜ');
  const [showOnlyCustomExercises, setShowOnlyCustomExercises] = useState<boolean>(false);

  // Food Form State (Modal)
  const [isFoodFormOpen, setIsFoodFormOpen] = useState<boolean>(false);
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);
  const [foodFormName, setFoodFormName] = useState<string>('');
  const [foodFormCategory, setFoodFormCategory] = useState<PopularFood['category']>('Tavuk & Et');
  const [foodFormPortion, setFoodFormPortion] = useState<string>('');
  const [foodFormCalories, setFoodFormCalories] = useState<number>(350);
  const [foodFormProtein, setFoodFormProtein] = useState<number>(30);
  const [foodFormCarbs, setFoodFormCarbs] = useState<number>(35);
  const [foodFormFats, setFoodFormFats] = useState<number>(8);
  const [foodFormEmoji, setFoodFormEmoji] = useState<string>('🍗');
  const [foodFormDesc, setFoodFormDesc] = useState<string>('');
  const [foodFormFavorite, setFoodFormFavorite] = useState<boolean>(false);

  // Exercise Form State (Modal)
  const [isExerciseFormOpen, setIsExerciseFormOpen] = useState<boolean>(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [exFormName, setExFormName] = useState<string>('');
  const [exFormCategory, setExFormCategory] = useState<Exercise['category']>('İtiş (Push)');
  const [exFormAnatomy, setExFormAnatomy] = useState<Exercise['anatomyRegion']>('Göğüs');
  const [exFormEquipment, setExFormEquipment] = useState<Exercise['equipment']>('Dambıl');
  const [exFormTargetMuscle, setExFormTargetMuscle] = useState<string>('');
  const [exFormSynergist, setExFormSynergist] = useState<string>('');
  const [exFormRpe, setExFormRpe] = useState<string>('8.5');
  const [exFormAngle, setExFormAngle] = useState<string>('Doğal Duruş • Standart');
  const [exFormPurpose, setExFormPurpose] = useState<string>('');
  const [exFormCue1Title, setExFormCue1Title] = useState<string>('Doğru Açı & Tutuş');
  const [exFormCue1Desc, setExFormCue1Desc] = useState<string>('');
  const [exFormCue2Title, setExFormCue2Title] = useState<string>('Nefes & Konsantrik Faz');
  const [exFormCue2Desc, setExFormCue2Desc] = useState<string>('');
  const [exFormMistake, setExFormMistake] = useState<string>('');
  const [exFormYoutubeId, setExFormYoutubeId] = useState<string>('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Auto-calculate calories when macros change in food form
  const handleAutoCalcCalories = (p: number, c: number, f: number) => {
    const calc = Math.round(p * 4 + c * 4 + f * 9);
    setFoodFormCalories(calc);
  };

  // Open Add Food Form
  const handleOpenAddFood = () => {
    setEditingFoodId(null);
    setFoodFormName('');
    setFoodFormCategory('Tavuk & Et');
    setFoodFormPortion('1 Porsiyon (180g)');
    setFoodFormProtein(32);
    setFoodFormCarbs(40);
    setFoodFormFats(8);
    setFoodFormCalories(360);
    setFoodFormEmoji('🍗');
    setFoodFormDesc('Yüksek proteinli, pratik ve lezzetli sporcu yemeği.');
    setFoodFormFavorite(false);
    setIsFoodFormOpen(true);
  };

  // Open Edit Food Form
  const handleOpenEditFood = (food: PopularFood) => {
    setEditingFoodId(food.id);
    setFoodFormName(food.name);
    setFoodFormCategory(food.category);
    setFoodFormPortion(food.portionLabel);
    setFoodFormProtein(food.protein);
    setFoodFormCarbs(food.carbs);
    setFoodFormFats(food.fats);
    setFoodFormCalories(food.calories);
    setFoodFormEmoji(food.emoji || '🍽️');
    setFoodFormDesc(food.description);
    setFoodFormFavorite(!!food.isFavorite);
    setIsFoodFormOpen(true);
  };

  // Save Food Form (Create or Update)
  const handleSaveFoodForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodFormName.trim()) {
      showToast('Lütfen yemek adını girin!');
      return;
    }

    if (editingFoodId) {
      // Update
      const updatedFood: PopularFood = {
        id: editingFoodId,
        name: foodFormName.trim(),
        category: foodFormCategory,
        portionLabel: foodFormPortion.trim() || '1 Porsiyon',
        calories: Number(foodFormCalories) || 0,
        protein: Number(foodFormProtein) || 0,
        carbs: Number(foodFormCarbs) || 0,
        fats: Number(foodFormFats) || 0,
        emoji: foodFormEmoji || '🍽️',
        description: foodFormDesc.trim() || 'Özel sporcu tarifi',
        isFavorite: foodFormFavorite,
        isCustom: true,
      };
      onUpdateCustomFood(updatedFood);
      showToast(`✅ "${updatedFood.name}" güncellendi!`);
    } else {
      // Create
      const newFood: PopularFood = {
        id: `custom-food-${Date.now()}`,
        name: foodFormName.trim(),
        category: foodFormCategory,
        portionLabel: foodFormPortion.trim() || '1 Porsiyon',
        calories: Number(foodFormCalories) || 0,
        protein: Number(foodFormProtein) || 0,
        carbs: Number(foodFormCarbs) || 0,
        fats: Number(foodFormFats) || 0,
        emoji: foodFormEmoji || '🍽️',
        description: foodFormDesc.trim() || 'Özel sporcu tarifi',
        isFavorite: foodFormFavorite,
        isCustom: true,
        createdAt: new Date().toISOString(),
      };
      onAddCustomFood(newFood);
      showToast(`🎉 "${newFood.name}" başarıyla eklendi! Beslenme sekmesinde hemen kullanabilirsiniz.`);
    }

    setIsFoodFormOpen(false);
  };

  // Quick Food Template
  const applyFoodTemplate = (templateName: string) => {
    if (templateName === 'tost') {
      setFoodFormName('Hindi Füme & Kaşarlı Fit Tost');
      setFoodFormCategory('Kahvaltı & Yumurta');
      setFoodFormPortion('2 Dilim Tam Buğday Ekmek + 80g Hindi Füme + 40g Kaşar');
      setFoodFormProtein(32);
      setFoodFormCarbs(30);
      setFoodFormFats(12);
      setFoodFormCalories(356);
      setFoodFormEmoji('🥪');
      setFoodFormDesc('Tam tahıllı ekmekle hazırlanan pratik ve yüksek proteinli kahvaltı seçeneği.');
    } else if (templateName === 'bowl') {
      setFoodFormName('Izgara Dana Bonfile & Fırın Patates Bowl');
      setFoodFormCategory('Tavuk & Et');
      setFoodFormPortion('180g Bonfile + 150g Fırın Patates + Akdeniz Salata');
      setFoodFormProtein(46);
      setFoodFormCarbs(42);
      setFoodFormFats(14);
      setFoodFormCalories(478);
      setFoodFormEmoji('🥩');
      setFoodFormDesc('Yüksek kreatin, demir ve kaliteli karbonhidrat deposu antrenman sonrası menüsü.');
    } else if (templateName === 'somon') {
      setFoodFormName('Fırında Somon Fileto & Kinoa');
      setFoodFormCategory('Balık & Deniz');
      setFoodFormPortion('200g Somon Fileto + 120g Haşlanmış Kinoa');
      setFoodFormProtein(42);
      setFoodFormCarbs(32);
      setFoodFormFats(22);
      setFoodFormCalories(494);
      setFoodFormEmoji('🐟');
      setFoodFormDesc('Zengin Omega-3 yağ asitleri ve tam amino asit profili ile toparlanma garantili.');
    } else if (templateName === 'yulaf') {
      setFoodFormName('Proteinli Yulaf & Fıstık Ezmesi Lapası (Proats)');
      setFoodFormCategory('Ara Öğün & Fit');
      setFoodFormPortion('60g Yulaf + 1 Ölçek Whey + 15g Fıstık Ezmesi');
      setFoodFormProtein(35);
      setFoodFormCarbs(48);
      setFoodFormFats(10);
      setFoodFormCalories(422);
      setFoodFormEmoji('🥣');
      setFoodFormDesc('Sıcak su veya badem sütüyle pişirilen, antrenman öncesi harika bir enerji kaynağı.');
    }
  };

  // Open Add Exercise Form
  const handleOpenAddExercise = () => {
    setEditingExerciseId(null);
    setExFormName('');
    setExFormCategory('Bacak (Legs)');
    setExFormAnatomy('Bacak');
    setExFormEquipment('Dambıl');
    setExFormTargetMuscle('Quadriceps & Kalça (Gluteus Maximus)');
    setExFormSynergist('Hamstrings • Core Dengeleyiciler');
    setExFormRpe('8.5');
    setExFormAngle('Arka Ayak Sehpada • 90° Diz Açısı');
    setExFormPurpose('Unilateral kuvvet asimetrilerini yok etmek ve kuadrisepsi izole etmek.');
    setExFormCue1Title('Gövde Açısı');
    setExFormCue1Desc('Hafifçe öne eğilerek kalça ve kuadrisepsi tam gerilime sokun.');
    setExFormCue2Title('Diz Takibi');
    setExFormCue2Desc('Ön dizin ayak parmaklarıyla aynı doğrultuda hareket ettiğinden emin olun.');
    setExFormMistake('Arka bacağa aşırı yük verip öndeki çalışan bacağı devre dışı bırakmak.');
    setExFormYoutubeId('');
    setIsExerciseFormOpen(true);
  };

  // Open Edit Exercise Form
  const handleOpenEditExercise = (exercise: Exercise) => {
    setEditingExerciseId(exercise.id);
    setExFormName(exercise.name);
    setExFormCategory(exercise.category);
    setExFormAnatomy(exercise.anatomyRegion);
    setExFormEquipment(exercise.equipment);
    setExFormTargetMuscle(exercise.targetMuscle);
    setExFormSynergist(exercise.synergistMuscles || '');
    setExFormRpe(exercise.rpe || '8.5');
    setExFormAngle(exercise.setupAngle || 'Standart Kurulum');
    setExFormPurpose(exercise.descriptionPurpose || '');
    setExFormCue1Title(exercise.cues?.[0]?.title || 'Doğru Açı');
    setExFormCue1Desc(exercise.cues?.[0]?.description || '');
    setExFormCue2Title(exercise.cues?.[1]?.title || 'Nefes & Hız');
    setExFormCue2Desc(exercise.cues?.[1]?.description || '');
    setExFormMistake(exercise.criticalMistake || '');
    setExFormYoutubeId(exercise.youtubeVideoId || '');
    setIsExerciseFormOpen(true);
  };

  // Quick Exercise Template
  const applyExerciseTemplate = (templateName: string) => {
    if (templateName === 'bulgarian') {
      setExFormName('Bulgarian Split Squat');
      setExFormCategory('Bacak (Legs)');
      setExFormAnatomy('Bacak');
      setExFormEquipment('Dambıl');
      setExFormTargetMuscle('Quadriceps & Kalça (Gluteus Maximus)');
      setExFormSynergist('Hamstrings • Adductors • Core');
      setExFormRpe('9.0');
      setExFormAngle('Arka Ayak Sehpada (40cm) • 90° Diz Açısı');
      setExFormPurpose('Bacaklar arası kuvvet asimetrilerini yok etmek, derin kalça gerilimi sağlamak.');
      setExFormCue1Title('Gövde İleri Eğimi');
      setExFormCue1Desc('Gövdeyi 15 derece öne eğik tutarak kalça liflerine mekanik yük bindirin.');
      setExFormCue2Title('Diz Kontrolü');
      setExFormCue2Desc('Dizinizin içe çökmesine izin vermeyin, ayak parmaklarını takip etsin.');
      setExFormMistake('Arka bacağa gereğinden fazla basıp öndeki çalışan bacağı rahatlatmak.');
    } else if (templateName === 'lateral') {
      setExFormName('Cable Lateral Raise (Kablo Yan Omuz)');
      setExFormCategory('Omuz');
      setExFormAnatomy('Omuz');
      setExFormEquipment('Kablo / Makine');
      setExFormTargetMuscle('Yan Omuz (Lateral Deltoid)');
      setExFormSynergist('Üst Trapez • Supraspinatus');
      setExFormRpe('8.5');
      setExFormAngle('Kablo Bilek Seviyesinde • Gövde 15° Yana Eğimli');
      setExFormPurpose('Hareketin başlangıcından bitişine kadar yan omuza kesintisiz gerilim (tension) sağlamak.');
      setExFormCue1Title('Yana ve İleri İtme');
      setExFormCue1Desc('Ağırlığı yukarı değil, duvarlara doğru yana fırlatır gibi itin.');
      setExFormCue2Title('Trapez İzolasyonu');
      setExFormCue2Desc('Omuzları kulaklara çekmeden sabit tutun.');
      setExFormMistake('Gövdeyi sallayarak momentumla kaldırmak.');
    } else if (templateName === 'smith-incline') {
      setExFormName('Incline Smith Machine Press');
      setExFormCategory('İtiş (Push)');
      setExFormAnatomy('Göğüs');
      setExFormEquipment('Kablo / Makine');
      setExFormTargetMuscle('Üst Göğüs (Clavicular Pectoralis)');
      setExFormSynergist('Ön Deltoid • Triceps');
      setExFormRpe('8.5');
      setExFormAngle('30 Derece Ayarlı Sehpa');
      setExFormPurpose('Stabil ray hattında üst göğse maksimum mekanik gerilim ve güvenli tükeniş.');
      setExFormCue1Title('Köprücük Kemiği Hizası');
      setExFormCue1Desc('Barı köprücük kemiğinin hemen 2-3 cm altına kontrollü indirin.');
      setExFormCue2Title('Dirsek Açısı');
      setExFormCue2Desc('Dirsekleri gövdeye 45-60 derece açıyla yönlendirin.');
      setExFormMistake('Sehpa açısını 45 derecenin üzerine çıkarıp hareketi omuz presine dönüştürmek.');
    } else if (templateName === 'facepull') {
      setExFormName('Rope Face Pull (Halat Çekiş)');
      setExFormCategory('Çekiş (Pull)');
      setExFormAnatomy('Omuz');
      setExFormEquipment('Kablo / Makine');
      setExFormTargetMuscle('Arka Omuz (Posterior Deltoid) & Rotator Cuff');
      setExFormSynergist('Rhomboids • Orta/Alt Trapez');
      setExFormRpe('8.0');
      setExFormAngle('Kablo Göz Seviyesinde • Çift Halat');
      setExFormPurpose('Omuz sağlığını korumak, duruşu düzeltmek ve arka deltoidi güçlendirmek.');
      setExFormCue1Title('Dışa Rotasyon');
      setExFormCue1Desc('Halatı çekerken ellerinizi geriye ve dışa doğru çevirerek çift biceps pozu verin.');
      setExFormCue2Title('Dirsek Yüksekliği');
      setExFormCue2Desc('Dirsekleri omuz hizasında veya biraz yukarıda tutun.');
      setExFormMistake('Gövdeyi geriye atarak belden güç almak.');
    }
  };

  // Save Exercise Form (Create or Update)
  const handleSaveExerciseForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exFormName.trim()) {
      showToast('Lütfen hareket adını girin!');
      return;
    }

    const defaultSteps: ExerciseStep[] = [
      {
        stepNumber: 1,
        title: 'Kurulum & Pozisyon Alma',
        subtitle: 'Başlangıç',
        description: `${exFormAngle || 'Doğal pozisyonda'} duruşu sabitleyin. Karın kaslarını sıkın ve kürek kemiklerini nötr tutun.`,
      },
      {
        stepNumber: 2,
        title: 'Eksantrik Kontrol (İndiriş)',
        subtitle: '2-3 Saniye',
        description: `${exFormCue1Desc || 'Ağırlığı kontrollü şekilde indirin ve hedef kasta tam gerilim hissedin.'}`,
      },
      {
        stepNumber: 3,
        title: 'Konsantrik Güç (İtiş/Çekiş)',
        subtitle: 'Patlayıcı & Odaklı',
        description: `${exFormCue2Desc || 'Hedef kası güçlü şekilde sıkarak tepe noktada 1 saniye bekleyin.'}`,
      },
    ];

    const defaultMistakes: ExerciseMistake[] = [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN HATA',
        description: exFormMistake || 'Momentum kullanarak kontrolsüz tekrar yapmak.',
      },
      {
        type: 'do',
        title: 'DOĞRU UYGULAMA & ODAK',
        description: exFormCue1Desc || 'Kas-zihin bağlantısını koruyarak yavaş eksantrik uygulamak.',
      },
    ];

    const defaultBiomechanics: BiomechanicsDetail = {
      activationPercent: 92,
      angleRecommendation: exFormAngle || 'Standart Açı',
      criticalCues: [
        exFormCue1Title + ': ' + (exFormCue1Desc || 'Kontrollü hareket'),
        exFormCue2Title + ': ' + (exFormCue2Desc || 'Doğru nefes'),
      ],
      breathingRhythm: 'Negatifte nefes al, pozitifte güçlü şekilde nefes ver.',
      commonMistakes: exFormMistake || 'Eklem açısını bozmak.',
      targetMover: exFormTargetMuscle || 'Hedef Kas Grubu',
      supportMovers: exFormSynergist || 'Destekleyici Kaslar',
    };

    if (editingExerciseId) {
      // Update
      const updatedExercise: Exercise = {
        id: editingExerciseId,
        name: exFormName.trim(),
        category: exFormCategory,
        anatomyRegion: exFormAnatomy,
        equipment: exFormEquipment,
        targetMuscle: exFormTargetMuscle.trim() || 'Hedef Kas',
        synergistMuscles: exFormSynergist.trim() || 'Yardımcı Kaslar',
        type: 'Özel Egzersiz',
        setupAngle: exFormAngle.trim() || 'Standart Kurulum',
        rpe: exFormRpe.trim() || '8.5',
        descriptionPurpose: exFormPurpose.trim() || 'Kas hipertrofisi ve mekanik gerilim optimizasyonu.',
        videoDuration: '02:30 / HD',
        videoViews: 'Özel Egzersiz',
        videoCoachVerified: true,
        videoThumbnailUrl: HOTLINK_IMAGE_URL,
        youtubeVideoId: exFormYoutubeId.trim() || undefined,
        isPopular: false,
        isCustom: true,
        cues: [
          {
            title: exFormCue1Title.trim() || 'Form İpucu 1',
            description: exFormCue1Desc.trim() || 'Kontrollü hareket uygulayın.',
          },
          {
            title: exFormCue2Title.trim() || 'Form İpucu 2',
            description: exFormCue2Desc.trim() || 'Nefes ve odaklanmaya dikkat edin.',
          },
        ],
        criticalMistake: exFormMistake.trim() || 'Momentum kullanarak formdan çalmak.',
        steps: defaultSteps,
        mistakes: defaultMistakes,
        biomechanics: defaultBiomechanics,
      };
      onUpdateCustomExercise(updatedExercise);
      showToast(`✅ "${updatedExercise.name}" güncellendi!`);
    } else {
      // Create
      const newExercise: Exercise = {
        id: `custom-ex-${Date.now()}`,
        name: exFormName.trim(),
        category: exFormCategory,
        anatomyRegion: exFormAnatomy,
        equipment: exFormEquipment,
        targetMuscle: exFormTargetMuscle.trim() || 'Hedef Kas',
        synergistMuscles: exFormSynergist.trim() || 'Yardımcı Kaslar',
        type: 'Özel Egzersiz',
        setupAngle: exFormAngle.trim() || 'Standart Kurulum',
        rpe: exFormRpe.trim() || '8.5',
        descriptionPurpose: exFormPurpose.trim() || 'Kas hipertrofisi ve mekanik gerilim optimizasyonu.',
        videoDuration: '02:30 / HD',
        videoViews: 'Özel Egzersiz',
        videoCoachVerified: true,
        videoThumbnailUrl: HOTLINK_IMAGE_URL,
        youtubeVideoId: exFormYoutubeId.trim() || undefined,
        isPopular: true,
        isCustom: true,
        createdAt: new Date().toISOString(),
        cues: [
          {
            title: exFormCue1Title.trim() || 'Form İpucu 1',
            description: exFormCue1Desc.trim() || 'Kontrollü hareket uygulayın.',
          },
          {
            title: exFormCue2Title.trim() || 'Form İpucu 2',
            description: exFormCue2Desc.trim() || 'Nefes ve odaklanmaya dikkat edin.',
          },
        ],
        criticalMistake: exFormMistake.trim() || 'Momentum kullanarak formdan çalmak.',
        steps: defaultSteps,
        mistakes: defaultMistakes,
        biomechanics: defaultBiomechanics,
      };
      onAddCustomExercise(newExercise);
      showToast(`🎉 "${newExercise.name}" başarıyla eklendi! Egzersiz Atlası ve Antrenman akışında hemen kullanılabilir.`);
    }

    setIsExerciseFormOpen(false);
  };

  // Combined foods for search/preview
  const allFoodsCombined = useMemo(() => {
    return [...customFoods, ...POPULAR_FOODS];
  }, [customFoods]);

  const displayedFoods = useMemo(() => {
    return allFoodsCombined.filter((food) => {
      if (showOnlyCustomFoods && !food.isCustom) return false;
      const matchesCategory = selectedFoodCategory === 'TÜMÜ' || food.category === selectedFoodCategory;
      const q = foodSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        food.name.toLowerCase().includes(q) ||
        food.description.toLowerCase().includes(q) ||
        food.portionLabel.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [allFoodsCombined, selectedFoodCategory, foodSearch, showOnlyCustomFoods]);

  // Combined exercises for search/preview
  const allExercisesCombined = useMemo(() => {
    return [...customExercises, ...EXERCISES_DATA];
  }, [customExercises]);

  const displayedExercises = useMemo(() => {
    return allExercisesCombined.filter((ex) => {
      if (showOnlyCustomExercises && !ex.isCustom) return false;
      const matchesCategory = selectedExerciseCategory === 'TÜMÜ' || ex.category === selectedExerciseCategory;
      const q = exerciseSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ex.name.toLowerCase().includes(q) ||
        ex.targetMuscle.toLowerCase().includes(q) ||
        ex.anatomyRegion.toLowerCase().includes(q) ||
        ex.equipment.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [allExercisesCombined, selectedExerciseCategory, exerciseSearch, showOnlyCustomExercises]);

  return (
    <div className="rounded-2xl bg-[#191A21] border border-[#262936] p-4 space-y-4 shadow-sm relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#FF1E38]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#FF1E38] animate-pulse" />
            <span className="text-[10px] font-black uppercase text-[#FF5356] tracking-wider font-mono">
              VERİTABANI & İÇERİK AYARLARI
            </span>
          </div>
          <h3 className="text-base font-extrabold text-white mt-0.5 flex items-center space-x-2">
            <span>Özel Yemek & Hareket Kütüphanesi</span>
          </h3>
          <p className="text-xs text-[#A0A5B5] mt-1 leading-relaxed">
            Beslenme sekmesinde seçmek istediğiniz yeni yemekleri ekleyin veya Egzersiz Atlası'na yeni hareketler tanımlayın.
          </p>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-[#121317] rounded-xl border border-[#262936]">
        <button
          type="button"
          onClick={() => setActiveSubTab('foods')}
          className={`py-2.5 px-3 rounded-lg text-xs font-black flex items-center justify-center space-x-2 transition-all ${
            activeSubTab === 'foods'
              ? 'bg-[#FF1E38] text-white shadow-md shadow-[#FF1E38]/25'
              : 'text-[#A0A5B5] hover:text-white hover:bg-[#1F1F24]'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Yemek Ayarları</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              activeSubTab === 'foods' ? 'bg-black/30 text-white' : 'bg-[#262936] text-[#A0A5B5]'
            }`}
          >
            {customFoods.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('exercises')}
          className={`py-2.5 px-3 rounded-lg text-xs font-black flex items-center justify-center space-x-2 transition-all ${
            activeSubTab === 'exercises'
              ? 'bg-[#FF1E38] text-white shadow-md shadow-[#FF1E38]/25'
              : 'text-[#A0A5B5] hover:text-white hover:bg-[#1F1F24]'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>Hareket Ayarları</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              activeSubTab === 'exercises' ? 'bg-black/30 text-white' : 'bg-[#262936] text-[#A0A5B5]'
            }`}
          >
            {customExercises.length}
          </span>
        </button>
      </div>

      {/* ========================================================
          1. YEMEK AYARLARI BÖLÜMÜ (FOOD SETTINGS)
         ======================================================== */}
      {activeSubTab === 'foods' && (
        <div className="space-y-3.5">
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold text-white">
                Özel Yemekleriniz ({customFoods.length})
              </span>
              <span className="text-[10px] text-[#A0A5B5]">
                • Toplam {allFoodsCombined.length} Besin
              </span>
            </div>

            <button
              type="button"
              onClick={handleOpenAddFood}
              className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#FF1E38] to-[#FF5356] hover:from-[#E0172F] hover:to-[#FF334B] text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-[#FF1E38]/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3px]" />
              <span>Yeni Yemek / Tarif Ekle</span>
            </button>
          </div>

          {/* Quick Info Box */}
          <div className="p-3 rounded-xl bg-[#121317] border border-[#262936] flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-[#FF5356] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#A0A5B5] leading-relaxed">
              Buradan eklediğiniz yemekler <strong>Beslenme sekmesindeki popüler yemek listesine</strong> anında eklenir. Tek dokunuşla porsiyon seçip bugünün kalori hedefine kaydedebilirsiniz.
            </p>
          </div>

          {/* Custom Foods List */}
          {customFoods.length === 0 ? (
            <div className="p-5 rounded-xl bg-[#121317]/80 border border-dashed border-[#262936] text-center space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-[#1F1F24] text-[#A0A5B5] mx-auto flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-[#FF5356]" />
              </div>
              <h4 className="text-xs font-bold text-white">Henüz Özel Yemek Eklenmedi</h4>
              <p className="text-[11px] text-[#A0A5B5] max-w-xs mx-auto">
                Sporcu diyetinizdeki favori yemeklerinizi (örneğin fırın somon, hindi füme tost, lor peynirli omlet vb.) ekleyin.
              </p>
              <button
                type="button"
                onClick={handleOpenAddFood}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#292A2E] hover:bg-[#343439] text-[#FF5356] text-xs font-bold transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>İlk Yemeğini Şimdi Ekle</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {customFoods.map((food) => (
                <div
                  key={food.id}
                  className="p-3 rounded-xl bg-[#121317] border border-[#262936] hover:border-[#FF1E38]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1A1C24] border border-[#262936] text-xl flex items-center justify-center shrink-0">
                      {food.emoji || '🍽️'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-black text-white truncate">{food.name}</h4>
                        <span className="px-1.5 py-0.5 rounded bg-[#FF1E38]/20 text-[#FF5356] border border-[#FF1E38]/30 text-[9px] font-extrabold uppercase shrink-0">
                          ÖZEL
                        </span>
                      </div>
                      <p className="text-[10px] text-[#A0A5B5] truncate mt-0.5">
                        {food.portionLabel} • <span className="text-white/80">{food.category}</span>
                      </p>
                      <div className="flex items-center space-x-2 mt-1.5 text-[10px] font-mono">
                        <span className="font-extrabold text-[#FF5356]">{food.calories} kcal</span>
                        <span className="text-[#343439]">•</span>
                        <span className="text-emerald-400 font-bold">{food.protein}g P</span>
                        <span className="text-[#343439]">•</span>
                        <span className="text-amber-400 font-bold">{food.carbs}g K</span>
                        <span className="text-[#343439]">•</span>
                        <span className="text-purple-400 font-bold">{food.fats}g Y</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1.5 self-end sm:self-center shrink-0">
                    {onOpenFoodConfirm && (
                      <button
                        type="button"
                        onClick={() => onOpenFoodConfirm(food)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold flex items-center space-x-1 transition-all"
                        title="Bugünkü kaloriye ekle"
                      >
                        <Plus className="w-3 h-3 stroke-[3px]" />
                        <span>Beslenmeye Ekle</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleOpenEditFood(food)}
                      className="p-1.5 rounded-lg bg-[#292A2E] hover:bg-[#343439] text-[#A0A5B5] hover:text-white transition-colors"
                      title="Düzenle"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`"${food.name}" yemeğini kütüphaneden silmek istediğinize emin misiniz?`)) {
                          onDeleteCustomFood(food.id);
                          showToast(`🗑️ ${food.name} silindi.`);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors border border-red-900/30"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Search & Preview of All Database Foods */}
          <div className="pt-2 border-t border-[#262936] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-[#A0A5B5] uppercase tracking-wider">
                Tüm Yemek Kütüphanesi Arama & İnceleme
              </span>
              <button
                type="button"
                onClick={() => setShowOnlyCustomFoods(!showOnlyCustomFoods)}
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg transition-colors border ${
                  showOnlyCustomFoods
                    ? 'bg-[#FF1E38]/20 text-[#FF5356] border-[#FF1E38]/40'
                    : 'bg-[#121317] text-[#A0A5B5] border-[#262936]'
                }`}
              >
                {showOnlyCustomFoods ? '✓ Sadece Özel Yemeklerim' : 'Tüm Yemekler'}
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#A0A5B5] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
                placeholder="Yemek, malzeme veya kalori ara..."
                className="w-full h-9 pl-8 pr-3 bg-[#121317] border border-[#262936] rounded-xl text-xs text-white placeholder-[#5A6072] focus:outline-none focus:border-[#FF1E38]"
              />
              {foodSearch && (
                <button
                  type="button"
                  onClick={() => setFoodSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A0A5B5] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedFoodCategory('TÜMÜ')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-colors ${
                  selectedFoodCategory === 'TÜMÜ'
                    ? 'bg-[#FF1E38] text-white'
                    : 'bg-[#121317] text-[#A0A5B5] hover:text-white border border-[#262936]'
                }`}
              >
                Tümü ({allFoodsCombined.length})
              </button>
              {FOOD_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedFoodCategory(cat)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-colors ${
                    selectedFoodCategory === cat
                      ? 'bg-[#FF1E38] text-white'
                      : 'bg-[#121317] text-[#A0A5B5] hover:text-white border border-[#262936]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Compact List of Search Results */}
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {displayedFoods.slice(0, 10).map((food) => (
                <div
                  key={food.id}
                  className="p-2 rounded-lg bg-[#121317]/60 border border-[#262936]/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-base">{food.emoji || '🍽️'}</span>
                    <span className="text-white font-bold truncate">{food.name}</span>
                    {food.isCustom && (
                      <span className="text-[9px] px-1 rounded bg-[#FF1E38]/20 text-[#FF5356] font-mono">
                        ÖZEL
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="font-mono text-[11px] font-extrabold text-[#FF5356]">
                      {food.calories} kcal
                    </span>
                    {onOpenFoodConfirm && (
                      <button
                        type="button"
                        onClick={() => onOpenFoodConfirm(food)}
                        className="px-2 py-0.5 rounded bg-[#292A2E] hover:bg-[#FF1E38] text-white text-[10px] font-bold transition-colors"
                      >
                        + Ekle
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          2. HAREKET AYARLARI BÖLÜMÜ (EXERCISE SETTINGS)
         ======================================================== */}
      {activeSubTab === 'exercises' && (
        <div className="space-y-3.5">
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold text-white">
                Özel Egzersizleriniz ({customExercises.length})
              </span>
              <span className="text-[10px] text-[#A0A5B5]">
                • Toplam {allExercisesCombined.length} Hareket
              </span>
            </div>

            <button
              type="button"
              onClick={handleOpenAddExercise}
              className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#FF1E38] to-[#FF5356] hover:from-[#E0172F] hover:to-[#FF334B] text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-[#FF1E38]/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3px]" />
              <span>Yeni Hareket / Egzersiz Ekle</span>
            </button>
          </div>

          {/* Quick Info Box */}
          <div className="p-3 rounded-xl bg-[#121317] border border-[#262936] flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-[#FF5356] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#A0A5B5] leading-relaxed">
              Eklediğiniz hareketler <strong>Egzersiz Atlası'na</strong>, <strong>Canlı Antrenman Seansına</strong> ve <strong>Antrenman Sihirbazı'na</strong> anında dahil edilir. Biyomekanik ipuçları ve RPE önerileri saklanır.
            </p>
          </div>

          {/* Custom Exercises List */}
          {customExercises.length === 0 ? (
            <div className="p-5 rounded-xl bg-[#121317]/80 border border-dashed border-[#262936] text-center space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-[#1F1F24] text-[#A0A5B5] mx-auto flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-[#FF5356]" />
              </div>
              <h4 className="text-xs font-bold text-white">Henüz Özel Hareket Eklenmedi</h4>
              <p className="text-[11px] text-[#A0A5B5] max-w-xs mx-auto">
                Spor salonunuzda bulunan özel makineleri veya favori varyasyonlarınızı (Bulgarian split squat, incline smith press vb.) ekleyin.
              </p>
              <button
                type="button"
                onClick={handleOpenAddExercise}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#292A2E] hover:bg-[#343439] text-[#FF5356] text-xs font-bold transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>İlk Hareketini Şimdi Ekle</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {customExercises.map((ex) => (
                <div
                  key={ex.id}
                  className="p-3 rounded-xl bg-[#121317] border border-[#262936] hover:border-[#FF1E38]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1A1C24] border border-[#262936] text-[#FF5356] flex items-center justify-center shrink-0">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-black text-white truncate">{ex.name}</h4>
                        <span className="px-1.5 py-0.5 rounded bg-[#FF1E38]/20 text-[#FF5356] border border-[#FF1E38]/30 text-[9px] font-extrabold uppercase shrink-0">
                          ÖZEL
                        </span>
                      </div>
                      <p className="text-[10px] text-[#A0A5B5] truncate mt-0.5">
                        {ex.category} • <span className="text-white/80">{ex.anatomyRegion}</span> • {ex.equipment}
                      </p>
                      <div className="flex items-center space-x-2 mt-1.5 text-[10px]">
                        <span className="font-bold text-white truncate">🎯 {ex.targetMuscle}</span>
                        <span className="text-[#343439]">•</span>
                        <span className="font-mono text-[#FF5356] font-bold">RPE {ex.rpe}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1.5 self-end sm:self-center shrink-0">
                    {onAddExerciseToWorkout && (
                      <button
                        type="button"
                        onClick={() => {
                          onAddExerciseToWorkout(ex);
                          showToast(`⚡ "${ex.name}" antrenman seansına eklendi!`);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#FF1E38]/20 hover:bg-[#FF1E38]/30 text-[#FF5356] border border-[#FF1E38]/30 text-[10px] font-extrabold flex items-center space-x-1 transition-all"
                        title="Canlı antrenmana ekle"
                      >
                        <Zap className="w-3 h-3 fill-current" />
                        <span>Antrenmana Ekle</span>
                      </button>
                    )}

                    {onOpenExerciseDetail && (
                      <button
                        type="button"
                        onClick={() => onOpenExerciseDetail(ex)}
                        className="p-1.5 rounded-lg bg-[#292A2E] hover:bg-[#343439] text-[#A0A5B5] hover:text-white transition-colors"
                        title="Atlas Detayını Gör"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleOpenEditExercise(ex)}
                      className="p-1.5 rounded-lg bg-[#292A2E] hover:bg-[#343439] text-[#A0A5B5] hover:text-white transition-colors"
                      title="Düzenle"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`"${ex.name}" hareketini kütüphaneden silmek istediğinize emin misiniz?`)) {
                          onDeleteCustomExercise(ex.id);
                          showToast(`🗑️ ${ex.name} silindi.`);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors border border-red-900/30"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Search & Preview of All Database Exercises */}
          <div className="pt-2 border-t border-[#262936] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-[#A0A5B5] uppercase tracking-wider">
                Egzersiz Atlası Arama & İnceleme
              </span>
              <button
                type="button"
                onClick={() => setShowOnlyCustomExercises(!showOnlyCustomExercises)}
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg transition-colors border ${
                  showOnlyCustomExercises
                    ? 'bg-[#FF1E38]/20 text-[#FF5356] border-[#FF1E38]/40'
                    : 'bg-[#121317] text-[#A0A5B5] border-[#262936]'
                }`}
              >
                {showOnlyCustomExercises ? '✓ Sadece Özel Hareketlerim' : 'Tüm Hareketler'}
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#A0A5B5] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                placeholder="Hareket adı, kas grubu veya ekipman ara..."
                className="w-full h-9 pl-8 pr-3 bg-[#121317] border border-[#262936] rounded-xl text-xs text-white placeholder-[#5A6072] focus:outline-none focus:border-[#FF1E38]"
              />
              {exerciseSearch && (
                <button
                  type="button"
                  onClick={() => setExerciseSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A0A5B5] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedExerciseCategory('TÜMÜ')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-colors ${
                  selectedExerciseCategory === 'TÜMÜ'
                    ? 'bg-[#FF1E38] text-white'
                    : 'bg-[#121317] text-[#A0A5B5] hover:text-white border border-[#262936]'
                }`}
              >
                Tümü ({allExercisesCombined.length})
              </button>
              {EXERCISE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedExerciseCategory(cat)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-colors ${
                    selectedExerciseCategory === cat
                      ? 'bg-[#FF1E38] text-white'
                      : 'bg-[#121317] text-[#A0A5B5] hover:text-white border border-[#262936]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Compact List of Search Results */}
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {displayedExercises.slice(0, 10).map((ex) => (
                <div
                  key={ex.id}
                  className="p-2 rounded-lg bg-[#121317]/60 border border-[#262936]/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-[#FF5356]">⚡</span>
                    <span className="text-white font-bold truncate">{ex.name}</span>
                    <span className="text-[10px] text-[#A0A5B5]">({ex.anatomyRegion})</span>
                    {ex.isCustom && (
                      <span className="text-[9px] px-1 rounded bg-[#FF1E38]/20 text-[#FF5356] font-mono">
                        ÖZEL
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="font-mono text-[10px] text-[#A0A5B5]">{ex.equipment}</span>
                    {onAddExerciseToWorkout && (
                      <button
                        type="button"
                        onClick={() => {
                          onAddExerciseToWorkout(ex);
                          showToast(`"${ex.name}" antrenmana eklendi!`);
                        }}
                        className="px-2 py-0.5 rounded bg-[#292A2E] hover:bg-[#FF1E38] text-white text-[10px] font-bold transition-colors"
                      >
                        + Antrenman
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          3. YEMEK EKLEME / DÜZENLEME MODALI (FOOD FORM MODAL)
         ======================================================== */}
      {isFoodFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#1A1C24] border border-[#262936] rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#262936] flex items-center justify-between bg-[#121317]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FF1E38]/20 text-[#FF5356] flex items-center justify-center">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    {editingFoodId ? 'Özel Yemeği Düzenle' : 'Yeni Yemek / Tarif Tanımla'}
                  </h3>
                  <span className="text-[10px] text-[#A0A5B5]">
                    Beslenme kütüphanesine eklenecektir
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFoodFormOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#292A2E] text-[#A0A5B5] hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Template Chips */}
            {!editingFoodId && (
              <div className="p-3 bg-[#14151B] border-b border-[#262936] space-y-1.5">
                <span className="text-[10px] font-bold text-[#A0A5B5] uppercase block">
                  ⚡ Hızlı Şablon Seç (Tek Tıkla Doldur):
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => applyFoodTemplate('tost')}
                    className="px-2 py-1 rounded-lg bg-[#1F1F24] hover:bg-[#292A2E] text-white text-[10px] font-bold border border-[#262936] shrink-0"
                  >
                    🥪 Fit Hindi Tost
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFoodTemplate('bowl')}
                    className="px-2 py-1 rounded-lg bg-[#1F1F24] hover:bg-[#292A2E] text-white text-[10px] font-bold border border-[#262936] shrink-0"
                  >
                    🥩 Bonfile & Patates
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFoodTemplate('somon')}
                    className="px-2 py-1 rounded-lg bg-[#1F1F24] hover:bg-[#292A2E] text-white text-[10px] font-bold border border-[#262936] shrink-0"
                  >
                    🐟 Somon & Kinoa
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFoodTemplate('yulaf')}
                    className="px-2 py-1 rounded-lg bg-[#1F1F24] hover:bg-[#292A2E] text-white text-[10px] font-bold border border-[#262936] shrink-0"
                  >
                    🥣 Proats Lapa
                  </button>
                </div>
              </div>
            )}

            {/* Modal Form Body */}
            <form onSubmit={handleSaveFoodForm} className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {/* Yemek Adı */}
              <div>
                <label className="text-[11px] font-bold text-[#A0A5B5] uppercase block mb-1">
                  Yemek / Tarif Adı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="örn. Dana Antrikot & Fırın Patates"
                  value={foodFormName}
                  onChange={(e) => setFoodFormName(e.target.value)}
                  className="w-full h-11 px-3 bg-[#121317] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-[#FF1E38]"
                />
              </div>

              {/* Kategori & Emoji */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-[#A0A5B5] uppercase block mb-1">
                    Kategori
                  </label>
                  <select
                    value={foodFormCategory}
                    onChange={(e) => setFoodFormCategory(e.target.value as PopularFood['category'])}
                    className="w-full h-11 px-3 bg-[#121317] border border-[#262936] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF1E38]"
                  >
                    {FOOD_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#A0A5B5] uppercase block mb-1">
                    Simgesi (Emoji)
                  </label>
                  <div className="flex items-center space-x-1.5">
                    <input
                      type="text"
                      maxLength={4}
                      value={foodFormEmoji}
                      onChange={(e) => setFoodFormEmoji(e.target.value)}
                      className="w-12 h-11 text-center bg-[#121317] border border-[#262936] rounded-xl text-lg text-white focus:outline-none focus:border-[#FF1E38]"
                    />
                    <div className="flex-1 flex items-center gap-1 overflow-x-auto p-1 bg-[#121317] rounded-xl border border-[#262936] scrollbar-none">
                      {FOOD_EMOJIS.slice(0, 5).map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setFoodFormEmoji(em)}
                          className="w-8 h-8 rounded-lg hover:bg-[#292A2E] text-sm flex items-center justify-center shrink-0"
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Porsiyon Tanımı */}
              <div>
                <label className="text-[11px] font-bold text-[#A0A5B5] uppercase block mb-1">
                  Porsiyon Miktarı & Açıklaması
                </label>
                <input
                  type="text"
                  placeholder="örn. 150g Et + 150g Pirinç Pilavı"
                  value={foodFormPortion}
                  onChange={(e) => setFoodFormPortion(e.target.value)}
                  className="w-full h-11 px-3 bg-[#121317] border border-[#262936] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF1E38]"
                />
              </div>

              {/* Makrolar (P / K / Y / Kcal) */}
              <div className="p-3 bg-[#121317] rounded-xl border border-[#262936] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-white uppercase">
                    Makro Değerleri (1 Porsiyon)
                  </span>
                  <span className="text-[10px] text-[#A0A5B5]">
                    Otomatik kalori hesaplanır
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-emerald-400 block mb-1">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={0.5}
                      value={foodFormProtein}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setFoodFormProtein(val);
                        handleAutoCalcCalories(val, foodFormCarbs, foodFormFats);
                      }}
                      className="w-full h-10 px-2.5 bg-[#1F1F24] border border-[#262936] rounded-lg text-xs font-mono text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-amber-400 block mb-1">
                      Karbonhidrat (g)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={0.5}
                      value={foodFormCarbs}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setFoodFormCarbs(val);
                        handleAutoCalcCalories(foodFormProtein, val, foodFormFats);
                      }}
                      className="w-full h-10 px-2.5 bg-[#1F1F24] border border-[#262936] rounded-lg text-xs font-mono text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-purple-400 block mb-1">
                      Yağ (g)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={0.5}
                      value={foodFormFats}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setFoodFormFats(val);
                        handleAutoCalcCalories(foodFormProtein, foodFormCarbs, val);
                      }}
                      className="w-full h-10 px-2.5 bg-[#1F1F24] border border-[#262936] rounded-lg text-xs font-mono text-purple-400 font-bold focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#262936] flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center space-x-1">
                    <Flame className="w-3.5 h-3.5 text-[#FF5356]" />
                    <span>Toplam Kalori (kcal):</span>
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <input
                      type="number"
                      min={0}
                      value={foodFormCalories}
                      onChange={(e) => setFoodFormCalories(parseInt(e.target.value) || 0)}
                      className="w-24 h-9 px-2.5 text-right bg-[#1F1F24] border border-[#FF1E38]/50 rounded-lg text-sm font-mono text-[#FF5356] font-black focus:outline-none"
                    />
                    <span className="text-xs font-mono text-[#FF5356] font-bold">kcal</span>
                  </div>
                </div>
              </div>

              {/* Açıklama / Not */}
              <div>
                <label className="text-[11px] font-bold text-[#A0A5B5] uppercase block mb-1">
                  Açıklama / Pratik Tarif İpuçları
                </label>
                <textarea
                  rows={2}
                  placeholder="Hazırlanış notu, sos önerisi veya besin faydası..."
                  value={foodFormDesc}
                  onChange={(e) => setFoodFormDesc(e.target.value)}
                  className="w-full p-2.5 bg-[#121317] border border-[#262936] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF1E38] resize-none"
                />
              </div>

              {/* Favori Toggle */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#121317] border border-[#262936]">
                <span className="text-xs font-bold text-white">Favorilere Ekle (Öne Çıkar)</span>
                <input
                  type="checkbox"
                  checked={foodFormFavorite}
                  onChange={(e) => setFoodFormFavorite(e.target.checked)}
                  className="w-5 h-5 accent-[#FF1E38] rounded cursor-pointer"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsFoodFormOpen(false)}
                  className="w-1/3 h-11 rounded-xl bg-[#292A2E] text-white text-xs font-bold hover:bg-[#343439] transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#FF1E38] to-[#FF5356] text-white text-xs font-extrabold flex items-center justify-center space-x-2 shadow-lg shadow-[#FF1E38]/25 transition-all active:scale-[0.98]"
                >
                  <Check className="w-4 h-4 stroke-[3px]" />
                  <span>{editingFoodId ? 'Değişiklikleri Kaydet' : 'Yemeği Kütüphaneye Ekle'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          4. HAREKET EKLEME / DÜZENLEME MODALI (EXERCISE FORM MODAL)
         ======================================================== */}
      {isExerciseFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#1A1C24] border border-[#262936] rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#262936] flex items-center justify-between bg-[#121317]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FF1E38]/20 text-[#FF5356] flex items-center justify-center">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    {editingExerciseId ? 'Özel Hareketi Düzenle' : 'Yeni Hareket / Egzersiz Tanımla'}
                  </h3>
                  <span className="text-[10px] text-[#A0A5B5]">
                    Atlas & Antrenman kütüphanesine eklenecektir
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsExerciseFormOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#292A2E] text-[#A0A5B5] hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Template Chips */}
            {!editingExerciseId && (
              <div className="p-3 bg-[#14151B] border-b border-[#262936] space-y-1.5">
                <span className="text-[10px] font-bold text-[#A0A5B5] uppercase block">
                  ⚡ Hızlı Şablon Seç (Tek Tıkla Doldur):
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => applyExerciseTemplate('bulgarian')}
                    className="px-2 py-1 rounded-lg bg-[#1F1F24] hover:bg-[#292A2E] text-white text-[10px] font-bold border border-[#262936] shrink-0"
                  >
                    🦵 Bulgarian Split Squat
                  </button>
                  <button
                    type="button"
                    onClick={() => applyExerciseTemplate('lateral')}
                    className="px-2 py-1 rounded-lg bg-[#1F1F24] hover:bg-[#292A2E] text-white text-[10px] font-bold border border-[#262936] shrink-0"
                  >
                    🛡️ Cable Lateral Raise
                  </button>
                  <button
                    type="button"
                    onClick={() => applyExerciseTemplate('smith-incline')}
                    className="px-2 py-1 rounded-lg bg-[#1F1F24] hover:bg-[#292A2E] text-white text-[10px] font-bold border border-[#262936] shrink-0"
                  >
                    ⚡ Smith Incline Press
                  </button>
                  <button
                    type="button"
                    onClick={() => applyExerciseTemplate('facepull')}
                    className="px-2 py-1 rounded-lg bg-[#1F1F24] hover:bg-[#292A2E] text-white text-[10px] font-bold border border-[#262936] shrink-0"
                  >
                    🦅 Rope Face Pull
                  </button>
                </div>
              </div>
            )}

            {/* Modal Form Body */}
            <form onSubmit={handleSaveExerciseForm} className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {/* Hareket Adı */}
              <div>
                <label className="text-[11px] font-bold text-[#A0A5B5] uppercase block mb-1">
                  Hareket / Egzersiz Adı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="örn. Bulgarian Split Squat"
                  value={exFormName}
                  onChange={(e) => setExFormName(e.target.value)}
                  className="w-full h-11 px-3 bg-[#121317] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-[#FF1E38]"
                />
              </div>

              {/* Kategori & Anatomi Bölgesi */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-[#A0A5B5] uppercase block mb-1">
                    Ana Kategori
                  </label>
                  <select
                    value={exFormCategory}
                    onChange={(e) => setExFormCategory(e.target.value as Exercise['category'])}
                    className="w-full h-11 px-3 bg-[#121317] border border-[#262936] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF1E38]"
                  >
                    {EXERCISE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#A0A5B5] uppercase block mb-1">
                    Vücut Bölgesi
                  </label>
                  <select
                    value={exFormAnatomy}
                    onChange={(e) => setExFormAnatomy(e.target.value as Exercise['anatomyRegion'])}
                    className="w-full h-11 px-3 bg-[#121317] border border-[#262936] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF1E38]"
                  >
                    {ANATOMY_REGIONS.map((reg) => (
                      <option key={reg} value={reg}>
                        {reg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ekipman & RPE */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-[#A0A5B5] uppercase block mb-1">
                    Ekipman Türü
                  </label>
                  <select
                    value={exFormEquipment}
                    onChange={(e) => setExFormEquipment(e.target.value as Exercise['equipment'])}
                    className="w-full h-11 px-3 bg-[#121317] border border-[#262936] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF1E38]"
                  >
                    {EQUIPMENT_OPTIONS.map((eq) => (
                      <option key={eq} value={eq}>
                        {eq}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#A0A5B5] uppercase block mb-1">
                    Önerilen RPE (Zorluk)
                  </label>
                  <input
                    type="text"
                    placeholder="8.5"
                    value={exFormRpe}
                    onChange={(e) => setExFormRpe(e.target.value)}
                    className="w-full h-11 px-3 bg-[#121317] border border-[#262936] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#FF1E38]"
                  />
                </div>
              </div>

              {/* Hedef Kas Grubu & Sinerjistler */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-[#A0A5B5] uppercase block mb-1">
                    Hedef Kas (Agonist)
                  </label>
                  <input
                    type="text"
                    placeholder="örn. Quadriceps & Gluteus"
                    value={exFormTargetMuscle}
                    onChange={(e) => setExFormTargetMuscle(e.target.value)}
                    className="w-full h-11 px-3 bg-[#121317] border border-[#262936] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF1E38]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#A0A5B5] uppercase block mb-1">
                    Yardımcı Kaslar
                  </label>
                  <input
                    type="text"
                    placeholder="örn. Hamstrings • Core"
                    value={exFormSynergist}
                    onChange={(e) => setExFormSynergist(e.target.value)}
                    className="w-full h-11 px-3 bg-[#121317] border border-[#262936] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF1E38]"
                  />
                </div>
              </div>

              {/* Kurulum Açısı & Asıl Amaç */}
              <div>
                <label className="text-[11px] font-bold text-[#A0A5B5] uppercase block mb-1">
                  Sehpa / Kurulum Açısı
                </label>
                <input
                  type="text"
                  placeholder="örn. Arka Ayak Sehpada • 90° Diz Açısı"
                  value={exFormAngle}
                  onChange={(e) => setExFormAngle(e.target.value)}
                  className="w-full h-11 px-3 bg-[#121317] border border-[#262936] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF1E38]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#A0A5B5] uppercase block mb-1">
                  Asıl Amaç & Biyomekanik Açıklama
                </label>
                <textarea
                  rows={2}
                  placeholder="örn. Bacak kuvvet asimetrilerini yok etmek ve kuadrisepsi izole etmek..."
                  value={exFormPurpose}
                  onChange={(e) => setExFormPurpose(e.target.value)}
                  className="w-full p-2.5 bg-[#121317] border border-[#262936] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF1E38] resize-none"
                />
              </div>

              {/* Kritik İpuçları (Cues) */}
              <div className="p-3 bg-[#121317] rounded-xl border border-[#262936] space-y-2.5">
                <span className="text-[11px] font-extrabold text-white uppercase block">
                  🎯 Kritik Form & Uygulama İpuçları (Cues)
                </span>

                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="İpucu 1 Başlık"
                      value={exFormCue1Title}
                      onChange={(e) => setExFormCue1Title(e.target.value)}
                      className="col-span-1 h-9 px-2 bg-[#1F1F24] border border-[#262936] rounded-lg text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="İpucu 1 Açıklama"
                      value={exFormCue1Desc}
                      onChange={(e) => setExFormCue1Desc(e.target.value)}
                      className="col-span-2 h-9 px-2 bg-[#1F1F24] border border-[#262936] rounded-lg text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="İpucu 2 Başlık"
                      value={exFormCue2Title}
                      onChange={(e) => setExFormCue2Title(e.target.value)}
                      className="col-span-1 h-9 px-2 bg-[#1F1F24] border border-[#262936] rounded-lg text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="İpucu 2 Açıklama"
                      value={exFormCue2Desc}
                      onChange={(e) => setExFormCue2Desc(e.target.value)}
                      className="col-span-2 h-9 px-2 bg-[#1F1F24] border border-[#262936] rounded-lg text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Kritik Hata */}
              <div>
                <label className="text-[11px] font-bold text-red-400 uppercase block mb-1">
                  Yapılmaması Gereken Kritik Hata
                </label>
                <input
                  type="text"
                  placeholder="örn. Momentum kullanarak dizleri içe çökertmek..."
                  value={exFormMistake}
                  onChange={(e) => setExFormMistake(e.target.value)}
                  className="w-full h-11 px-3 bg-[#121317] border border-red-900/40 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              {/* YouTube Video ID (Optional) */}
              <div>
                <label className="text-[11px] font-bold text-[#A0A5B5] uppercase block mb-1">
                  YouTube Video ID (İsteğe Bağlı)
                </label>
                <input
                  type="text"
                  placeholder="örn. rT7DgCr-3pg"
                  value={exFormYoutubeId}
                  onChange={(e) => setExFormYoutubeId(e.target.value)}
                  className="w-full h-11 px-3 bg-[#121317] border border-[#262936] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#FF1E38]"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsExerciseFormOpen(false)}
                  className="w-1/3 h-11 rounded-xl bg-[#292A2E] text-white text-xs font-bold hover:bg-[#343439] transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#FF1E38] to-[#FF5356] text-white text-xs font-extrabold flex items-center justify-center space-x-2 shadow-lg shadow-[#FF1E38]/25 transition-all active:scale-[0.98]"
                >
                  <Check className="w-4 h-4 stroke-[3px]" />
                  <span>{editingExerciseId ? 'Değişiklikleri Kaydet' : 'Hareketi Atlasa Ekle'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50 animate-bounce">
          <div className="bg-[#292A2E] border border-[#FF1E38]/60 text-white p-3 rounded-xl shadow-2xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#FF5356] shrink-0" />
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
