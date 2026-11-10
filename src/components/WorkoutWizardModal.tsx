import React, { useState } from 'react';
import {
  Wand2,
  X,
  ChevronRight,
  ChevronLeft,
  Dumbbell,
  Flame,
  Activity,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
  Zap,
  Timer,
  TrendingUp,
  Sliders,
  Play,
  Heart,
  Layers,
  Building2,
  Home,
  ShieldAlert,
  Target,
  Clock,
  Calendar,
  CheckSquare,
  Square,
  Ban,
  CheckCircle,
} from 'lucide-react';
import {
  CustomProgram,
  WizardExerciseItem,
  CardioSettings,
  Exercise,
  WizardPreferences,
} from '../types/fitness';
import { EXERCISES_DATA } from '../data/mockData';

interface WorkoutWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProgram: (program: CustomProgram) => void;
  onApplyToLiveWorkout: (program: CustomProgram) => void;
  athleteWeightKg?: number;
}

// Common exercises for the "Sevmediğin / Yapmak İstemediğin Hareketler" step
const EXCLUDABLE_EXERCISES = [
  { id: 'barbell-back-squat', name: 'Barbell Back Squat', target: 'Bacak / Squat' },
  { id: 'barbell-rdl', name: 'Barbell Romanian Deadlift (RDL)', target: 'Arka Bacak / Deadlift' },
  { id: 'barbell-bench-press', name: 'Barbell Bench Press', target: 'Göğüs / Düz Bar' },
  { id: 'overhead-barbell-press', name: 'Overhead Barbell Press (OHP)', target: 'Omuz / Dikey İtiş' },
  { id: 'lat-pulldown', name: 'Wide-Grip Lat Pulldown', target: 'Sırt / Çekiş' },
  { id: 'leg-press-45', name: '45° Leg Press', target: 'Bacak / Makine' },
  { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', target: 'Üst Göğüs / Dambıl' },
  { id: 'seated-cable-row', name: 'Seated Cable Row', target: 'Sırt / Kablo' },
  { id: 'dumbbell-lateral-raise', name: 'Dumbbell Lateral Raise', target: 'Yan Omuz' },
  { id: 'cable-triceps-pushdown', name: 'Cable Triceps Pushdown', target: 'Arka Kol / Halat' },
  { id: 'barbell-biceps-curl', name: 'Barbell Biceps Curl', target: 'Ön Kol / Pazu' },
  { id: 'kneeling-cable-crunch', name: 'Kneeling Cable Crunch', target: 'Karın / Core' },
];

export const WorkoutWizardModal: React.FC<WorkoutWizardModalProps> = ({
  isOpen,
  onClose,
  onSaveProgram,
  onApplyToLiveWorkout,
  athleteWeightKg = 110,
}) => {
  // Current wizard step (1 to 10 for questions, 11 for generated result)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // 1. Hedefin ne?
  const [goal, setGoal] = useState<string>('💪 Kas geliştirmek');

  // 2. Antrenman seviyen
  const [level, setLevel] = useState<string>('Orta');

  // 3. Haftada kaç gün?
  const [daysPerWeek, setDaysPerWeek] = useState<string>('4 gün');

  // 4. Antrenman süresi
  const [duration, setDuration] = useState<string>('60 dk');

  // 5. Nerede antrenman yapıyorsun?
  const [location, setLocation] = useState<string>('🏢 Spor salonu');

  // 6. Ekipman seçimi (Checkbox şeklinde)
  const [equipments, setEquipments] = useState<string[]>([
    'Makine',
    'Dambıl',
    'Halter',
    'Kablo',
    'Vücut ağırlığı',
    'Kardiyo',
  ]);

  // 7. Sevmediğin / yapmak istemediğin hareketler (Excluded list)
  const [excludedExercises, setExcludedExercises] = useState<string[]>([]);

  // 8. Özellikle çalışmak istediğin bölgeler
  const [focusAreas, setFocusAreas] = useState<string[]>([
    'Göğüs',
    'Sırt',
    'Omuz',
    'Kol',
    'Bacak',
  ]);

  // 9. Kardiyo tercihi (8/12/15 Eğim • 10/20/30 dk • 4-6 km/h)
  const [cardioPreference, setCardioPreference] = useState<string>('20 dk • %12 Eğim • 5.0 km/h');

  // 10. Program yapısı
  const [splitStructure, setSplitStructure] = useState<string>('Push / Pull / Legs');

  // Step 11: Generated Program State (Exercises & Cardio)
  const [generatedExercises, setGeneratedExercises] = useState<WizardExerciseItem[]>([]);
  const [generatedCardio, setGeneratedCardio] = useState<CardioSettings | undefined>(undefined);
  const [programTitle, setProgramTitle] = useState<string>('Avalanche Çığ Etkisi Özel Programı');

  if (!isOpen) return null;

  // Toggle equipment checkbox
  const handleToggleEquipment = (eq: string) => {
    if (equipments.includes(eq)) {
      if (equipments.length > 1) {
        setEquipments(equipments.filter((e) => e !== eq));
      }
    } else {
      setEquipments([...equipments, eq]);
    }
  };

  // Toggle excluded exercise (❌)
  const handleToggleExclude = (exId: string) => {
    if (excludedExercises.includes(exId)) {
      setExcludedExercises(excludedExercises.filter((id) => id !== exId));
    } else {
      setExcludedExercises([...excludedExercises, exId]);
    }
  };

  // Toggle focus area
  const handleToggleFocusArea = (area: string) => {
    if (area === 'Tüm vücut') {
      setFocusAreas(['Tüm vücut', 'Göğüs', 'Sırt', 'Omuz', 'Kol', 'Bacak', 'Karın']);
      return;
    }
    if (focusAreas.includes(area)) {
      if (focusAreas.length > 1) {
        setFocusAreas(focusAreas.filter((a) => a !== area && a !== 'Tüm vücut'));
      }
    } else {
      setFocusAreas([...focusAreas.filter((a) => a !== 'Tüm vücut'), area]);
    }
  };

  // Generator engine: builds the personalized workout based on 10 answers
  const generateProgramFromAnswers = () => {
    // Determine target sets based on level
    const defaultSets = level === 'Başlangıç' ? 3 : level === 'İleri' ? 4 : 3;
    const defaultWeightMultiplier = level === 'Başlangıç' ? 0.7 : level === 'İleri' ? 1.15 : 1.0;

    // Filter exercises from catalog that are NOT excluded and match equipment
    const available = EXERCISES_DATA.filter((ex) => {
      // Excluded check
      if (excludedExercises.includes(ex.id)) return false;

      // Equipment match
      const eqReq = ex.equipment?.toLowerCase() || '';
      const hasDumbbell = equipments.includes('Dambıl');
      const hasBarbell = equipments.includes('Halter');
      const hasMachine = equipments.includes('Makine');
      const hasCable = equipments.includes('Kablo');
      const hasBodyweight = equipments.includes('Vücut ağırlığı');

      if (eqReq.includes('dambıl') && !hasDumbbell) return false;
      if (eqReq.includes('halter') && !hasBarbell) return false;
      if (eqReq.includes('kablo') && !hasCable) return false;
      if (eqReq.includes('makine') && !hasMachine) return false;

      return true;
    });

    // Select suitable movements according to split structure and focus areas
    let chosen: Exercise[] = [];

    if (splitStructure === 'Push / Pull / Legs') {
      // PPL split: prioritize Push movements for session A
      chosen = available.filter((e) => e.category?.includes('İtiş') || e.category?.includes('Push'));
      if (chosen.length < 3) {
        chosen = available.slice(0, 4);
      }
    } else if (splitStructure === 'Upper / Lower') {
      chosen = available.filter((e) => !e.category?.includes('Bacak'));
    } else if (splitStructure === 'Full Body') {
      const push = available.find((e) => e.category?.includes('İtiş'));
      const pull = available.find((e) => e.category?.includes('Çekiş'));
      const legs = available.find((e) => e.category?.includes('Bacak'));
      const core = available.find((e) => e.category?.includes('Core') || e.category?.includes('Karın'));
      chosen = [push, pull, legs, core].filter(Boolean) as Exercise[];
    } else if (splitStructure.includes('Göğüs + Triceps')) {
      chosen = available.filter(
        (e) => e.anatomyRegion?.includes('Göğüs') || e.anatomyRegion?.includes('Triceps') || e.targetMuscle?.includes('Triceps')
      );
    } else {
      // Sihirbaz seçsin: pick optimal balance based on focus areas
      chosen = available.slice(0, 5);
    }

    if (chosen.length === 0) {
      chosen = EXERCISES_DATA.slice(0, 4);
    }

    // Convert into WizardExerciseItems with customizable sets & kg
    const exerciseItems: WizardExerciseItem[] = chosen.map((ex, idx) => {
      let baseWeight = 40;
      if (ex.id.includes('bench')) baseWeight = 75;
      else if (ex.id.includes('squat')) baseWeight = 90;
      else if (ex.id.includes('press-45')) baseWeight = 160;
      else if (ex.id.includes('rdl')) baseWeight = 80;
      else if (ex.id.includes('row')) baseWeight = 60;
      else if (ex.id.includes('lat-pull')) baseWeight = 60;
      else if (ex.id.includes('incline')) baseWeight = 30;
      else if (ex.id.includes('pushdown')) baseWeight = 25;
      else if (ex.id.includes('lateral')) baseWeight = 12;
      else if (ex.id.includes('curl')) baseWeight = 30;

      const adjustedWeight = Math.round((baseWeight * defaultWeightMultiplier) / 2.5) * 2.5;

      return {
        id: `wiz-gen-${idx}-${Date.now()}`,
        exerciseId: ex.id,
        exerciseName: ex.name,
        targetSets: defaultSets || 3,
        targetWeightKg: adjustedWeight,
        targetReps: goal.includes('Güç') ? 6 : 12, // 10/12/15 hipertrofi şablonu
        restSeconds: goal.includes('Güç') ? 120 : 90,
        intensityRpe: level === 'İleri' ? '9.0' : '8.0',
        targetMuscle: `${ex.category} • ${ex.targetMuscle}`,
      };
    });

    // Configure Cardio based on cardio preference (8/12/15 eğim • 10/20/30 dk • 4-6 km/h)
    let cardioConf: CardioSettings | undefined = undefined;
    if (cardioPreference !== 'Hiç istemiyorum') {
      let cDuration = 20;
      let cIncline = 12;
      let cSpeed = 5.0;

      if (cardioPreference.includes('10 dk') || cardioPreference.includes('%8')) {
        cDuration = 10;
        cIncline = 8;
        cSpeed = 4.5;
      } else if (cardioPreference.includes('30 dk') || cardioPreference.includes('%15')) {
        cDuration = 30;
        cIncline = 15;
        cSpeed = 5.5;
      } else {
        // Standart: 20 dk, %12 eğim, 5.0 km/h (4-6 km/h arası)
        cDuration = 20;
        cIncline = 12;
        cSpeed = 5.0;
      }

      // Hız 4 ile 6 km/h arasında sınırlandırılır
      cSpeed = Math.max(4.0, Math.min(6.0, cSpeed));

      const speedMPerMin = (cSpeed * 1000) / 60;
      const inclineFraction = cIncline / 100;
      const met = Math.max(3, 3.5 + 0.1 * speedMPerMin + 1.8 * speedMPerMin * inclineFraction);
      const estKcal = Math.round(((met * 3.5 * athleteWeightKg) / 200) * cDuration);

      cardioConf = {
        id: `cardio-wiz-${Date.now()}`,
        type: 'incline_walk',
        name: 'Eğimli Yürüyüş Bandı (Zone 2 Kardiyo)',
        durationMinutes: cDuration,
        inclinePercent: cIncline,
        speedKmh: cSpeed,
        heartRateZone: `Zone 2 Yağ Yakımı (%${cIncline} Eğim • ${cSpeed} km/h)`,
        targetCalories: estKcal,
        completed: false,
      };
    }

    setGeneratedExercises(exerciseItems);
    setGeneratedCardio(cardioConf);
    setProgramTitle(`Avalanche ${splitStructure} Programı (${level})`);
    setCurrentStep(11); // Move to the generated program review screen!
  };

  // Update specific exercise item in the generated result
  const handleUpdateItem = (id: string, updates: Partial<WizardExerciseItem>) => {
    setGeneratedExercises((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Direct cardio adjuster for 8/12/15 incline, 10/20/30 min, 4-6 km/h
  const updateCardioParam = (updates: Partial<CardioSettings>) => {
    if (!generatedCardio) return;
    const dur = updates.durationMinutes ?? generatedCardio.durationMinutes;
    const inc = updates.inclinePercent ?? generatedCardio.inclinePercent;
    const spd = Math.max(4.0, Math.min(6.0, updates.speedKmh ?? generatedCardio.speedKmh));
    const speedMPerMin = (spd * 1000) / 60;
    const inclineFraction = inc / 100;
    const met = Math.max(3, 3.5 + 0.1 * speedMPerMin + 1.8 * speedMPerMin * inclineFraction);
    const estKcal = Math.round(((met * 3.5 * athleteWeightKg) / 200) * dur);
    setGeneratedCardio({
      ...generatedCardio,
      ...updates,
      durationMinutes: dur,
      inclinePercent: inc,
      speedKmh: spd,
      targetCalories: estKcal,
      heartRateZone: `Zone 2 Yağ Yakımı (%${inc} Eğim • ${spd} km/h)`,
    });
  };

  // Remove exercise item from result
  const handleRemoveItem = (id: string) => {
    setGeneratedExercises((prev) => prev.filter((item) => item.id !== id));
  };

  // Build the complete program object to save or launch
  const buildFinalProgram = (): CustomProgram => {
    const preferences: WizardPreferences = {
      goal,
      level,
      daysPerWeek: parseInt(daysPerWeek) || 4,
      durationMinutes: parseInt(duration) || 60,
      location,
      equipments,
      excludedExercises,
      focusAreas,
      cardioPreference,
      splitStructure,
    };

    return {
      id: `prog-${Date.now()}`,
      name: programTitle,
      goal,
      splitDays: `Haftada ${daysPerWeek}`,
      notes: `${level} seviye • ${location} • ${duration}`,
      exercises: generatedExercises,
      cardio: generatedCardio,
      preferences,
      createdAt: new Date().toLocaleDateString('tr-TR'),
    };
  };

  const handleSaveOnly = () => {
    const program = buildFinalProgram();
    onSaveProgram(program);
    onClose();
  };

  const handleApplyAndStart = () => {
    const program = buildFinalProgram();
    onApplyToLiveWorkout(program);
    onClose();
  };

  const totalSets = generatedExercises.reduce((acc, curr) => acc + curr.targetSets, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-md max-h-[92vh] flex flex-col bg-[#121317] border border-[#262936] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Strip */}
        <div className="p-4 bg-[#181920] border-b border-[#262936] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF1E38] to-[#990012] flex items-center justify-center shadow-md shadow-[#FF1E38]/30">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-extrabold text-[#FF5356] uppercase tracking-wider font-mono">
                  AVALANCHE PROGRAM SİHİRBAZI
                </span>
                {currentStep <= 10 && (
                  <span className="px-1.5 py-0.5 rounded bg-[#292A2E] text-[9px] font-mono text-white font-bold">
                    {currentStep} / 10
                  </span>
                )}
              </div>
              <h3 className="text-base font-extrabold text-white">
                {currentStep <= 10 ? 'Akıllı Antrenman Anketi' : 'Kişiselleştirilmiş Programınız'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#292A2E] text-[#A0A5B5] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar for the 10 Questions */}
        {currentStep <= 10 && (
          <div className="w-full h-1 bg-[#1F1F24] shrink-0">
            <div
              className="h-full bg-gradient-to-r from-[#FF1E38] to-[#FF5356] transition-all duration-300"
              style={{ width: `${(currentStep / 10) * 100}%` }}
            />
          </div>
        )}

        {/* Scrollable Wizard Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* ================= 1. HEDEFİN NE? ================= */}
          {currentStep === 1 && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-white flex items-center space-x-2">
                  <span>1. Hedefin ne?</span>
                </h4>
                <p className="text-xs text-[#A0A5B5]">
                  Sihirbaz set aralıklarını, hacmi ve kardiyo protokolünü bu hedefe göre optimize eder.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { id: '🔥 Kilo vermek', label: '🔥 Kilo vermek', desc: 'Yüksek kalori harcaması ve yağ yakım odağı' },
                  { id: '💪 Kas geliştirmek', label: '💪 Kas geliştirmek', desc: 'Hipertrofi, mekanik gerilim ve hacim artışı' },
                  { id: '⚖️ Yağ yakıp kas yapmak', label: '⚖️ Yağ yakıp kas yapmak', desc: 'Vücut rekompozisyonu ve sıkılaşma' },
                  { id: '🏋️ Güçlenmek', label: '🏋️ Güçlenmek', desc: 'Maksimal kuvvet, düşük tekrar & yüksek ağırlık' },
                  { id: '🧘 Genel fitness', label: '🧘 Genel fitness', desc: 'Dayanıklılık, sağlık ve zindelik' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setGoal(opt.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                      goal === opt.id
                        ? 'bg-[#1F1F24] border-[#FF1E38] text-white shadow-lg shadow-[#FF1E38]/15'
                        : 'bg-[#181920] border-[#262936] text-[#A0A5B5] hover:text-white hover:border-[#383B47]'
                    }`}
                  >
                    <div>
                      <span className="text-sm font-extrabold text-white block">{opt.label}</span>
                      <span className="text-[11px] text-[#A0A5B5] mt-0.5 block">{opt.desc}</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        goal === opt.id
                          ? 'border-[#FF1E38] bg-[#FF1E38] text-white'
                          : 'border-[#383B47] bg-[#121317]'
                      }`}
                    >
                      {goal === opt.id && <Check className="w-3 h-3 stroke-[3px]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= 2. ANTRENMAN SEVİYEN ================= */}
          {currentStep === 2 && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-white">
                  2. Antrenman seviyen nedir?
                </h4>
                <p className="text-xs text-[#A0A5B5]">
                  Seviyeniz set sayısı, egzersiz kompleksliği ve ağırlık artış katsayısını belirler.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'Başlangıç', label: 'Başlangıç', desc: '0 - 6 ay deneyim' },
                  { id: 'Başlangıç üstü', label: 'Başlangıç üstü', desc: '6 ay - 1 yıl deneyim' },
                  { id: 'Orta', label: 'Orta', desc: '1 - 3 yıl düzenli antrenman' },
                  { id: 'İleri', label: 'İleri', desc: '3+ yıl disiplinli çalışma' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setLevel(lvl.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      level === lvl.id
                        ? 'bg-[#1F1F24] border-[#FF1E38] text-white shadow-md'
                        : 'bg-[#181920] border-[#262936] text-[#A0A5B5] hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-extrabold text-white block">{lvl.label}</span>
                    <span className="text-[10px] text-[#A0A5B5] mt-1 block">{lvl.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= 3. HAFTADA KAÇ GÜN? ================= */}
          {currentStep === 3 && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-white flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-[#FF5356]" />
                  <span>3. Haftada kaç gün antrenman yapacaksın?</span>
                </h4>
                <p className="text-xs text-[#A0A5B5]">
                  Kas toparlanma süreniz ve split dağılımı buna göre planlanır.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { id: '2 gün', label: '2 gün', desc: 'Tüm vücut (Full Body) odaklı iki yoğun seans' },
                  { id: '3 gün', label: '3 gün', desc: 'İdeal toparlanma: Push / Pull / Legs veya Full Body' },
                  { id: '4 gün', label: '4 gün', desc: 'Alt / Üst Gövde (Upper/Lower) veya İtiş-Çekiş split' },
                  { id: '5 gün', label: '5 gün', desc: 'PPL + Kol & Omuz veya Bölgesel hipertrofi' },
                  { id: '6 gün', label: '6 gün', desc: 'Push-Pull-Legs x2 yüksek hacimli elit tempo' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDaysPerWeek(d.id)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      daysPerWeek === d.id
                        ? 'bg-[#1F1F24] border-[#FF1E38] text-white shadow-md'
                        : 'bg-[#181920] border-[#262936] text-[#A0A5B5] hover:text-white'
                    }`}
                  >
                    <div>
                      <span className="text-sm font-extrabold text-white">{d.label}</span>
                      <span className="text-[11px] text-[#A0A5B5] block mt-0.5">{d.desc}</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        daysPerWeek === d.id ? 'border-[#FF1E38] bg-[#FF1E38]' : 'border-[#383B47]'
                      }`}
                    >
                      {daysPerWeek === d.id && <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= 4. ANTRENMAN SÜRESİ ================= */}
          {currentStep === 4 && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-white flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-[#FF5356]" />
                  <span>4. Bir seansa ayırabileceğin süre?</span>
                </h4>
                <p className="text-xs text-[#A0A5B5]">
                  Toplam hareket sayısı ve dinlenme aralıkları sürenize göre kalibre edilir.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: '30 dk', label: '30 dk', desc: 'Kısa, yoğun süpersetler' },
                  { id: '45 dk', label: '45 dk', desc: 'Dengeli ve tempolu akış' },
                  { id: '60 dk', label: '60 dk', desc: 'Standart hipertrofi süresi' },
                  { id: '75+ dk', label: '75+ dk', desc: 'Ağırlık + Kapsamlı Kardiyo' },
                ].map((dur) => (
                  <button
                    key={dur.id}
                    type="button"
                    onClick={() => setDuration(dur.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      duration === dur.id
                        ? 'bg-[#1F1F24] border-[#FF1E38] text-white shadow-md'
                        : 'bg-[#181920] border-[#262936] text-[#A0A5B5] hover:text-white'
                    }`}
                  >
                    <span className="text-base font-extrabold text-white font-mono block">
                      {dur.label}
                    </span>
                    <span className="text-[11px] text-[#A0A5B5] mt-1 block">{dur.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= 5. NEREDE ANTRENMAN YAPIYORSUN? ================= */}
          {currentStep === 5 && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-white">
                  5. Nerede antrenman yapıyorsun?
                </h4>
                <p className="text-xs text-[#A0A5B5]">
                  Mekan seçimi egzersiz alternatiflerini ve makine gereksinimlerini filtreler.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: '🏢 Spor salonu', title: '🏢 Spor salonu', desc: 'Tüm makineler, kablolar, olimpik barlar ve serbest ağırlıklar' },
                  { id: '🏠 Ev', title: '🏠 Ev', desc: 'Dambıllar, direnç bantları ve kendi vücut ağırlığınız' },
                  { id: '🏠 + 🏢 Karışık', title: '🏠 + 🏢 Karışık (Hibrit)', desc: 'Haftanın bazı günleri salonda, bazı günleri evde' },
                ].map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setLocation(loc.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      location === loc.id
                        ? 'bg-[#1F1F24] border-[#FF1E38] text-white shadow-md'
                        : 'bg-[#181920] border-[#262936] text-[#A0A5B5] hover:text-white'
                    }`}
                  >
                    <div>
                      <span className="text-sm font-extrabold text-white block">{loc.title}</span>
                      <span className="text-[11px] text-[#A0A5B5] mt-0.5 block">{loc.desc}</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        location === loc.id ? 'border-[#FF1E38] bg-[#FF1E38]' : 'border-[#383B47]'
                      }`}
                    >
                      {location === loc.id && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= 6. EKİPMAN SEÇİMİ (CHECKBOX) ================= */}
          {currentStep === 6 && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-white flex items-center space-x-2">
                  <CheckSquare className="w-5 h-5 text-[#FF5356]" />
                  <span>6. Ekipman seçimi</span>
                </h4>
                <p className="text-xs text-[#A0A5B5]">
                  Kullanabileceğin ekipmanları işaretle (birden fazla seçebilirsin):
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Makine', icon: '⚙️', desc: 'Leg Press, Chest Press vs.' },
                  { name: 'Dambıl', icon: '🔩', desc: 'Ayarlanabilir veya sabit' },
                  { name: 'Halter', icon: '🏋️', desc: 'Olimpik bar ve plakalar' },
                  { name: 'Kablo', icon: '⛓️', desc: 'Ayarlanabilir kablo istasyonu' },
                  { name: 'Vücut ağırlığı', icon: '🤸', desc: 'Barfiks, şınav, dips' },
                  { name: 'Kardiyo', icon: '🏃‍♂️', desc: 'Eğimli koşu bandı, bisiklet' },
                ].map((eq) => {
                  const isChecked = equipments.includes(eq.name);
                  return (
                    <button
                      key={eq.name}
                      type="button"
                      onClick={() => handleToggleEquipment(eq.name)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between ${
                        isChecked
                          ? 'bg-[#1F1F24] border-[#FF1E38] text-white shadow-md'
                          : 'bg-[#181920] border-[#262936] text-[#A0A5B5] hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-base">{eq.icon}</span>
                          <span className="text-xs font-extrabold text-white">{eq.name}</span>
                        </div>
                        <span className="text-[10px] text-[#A0A5B5] mt-1 block">{eq.desc}</span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                          isChecked ? 'bg-[#FF1E38] border-[#FF1E38] text-white' : 'border-[#383B47] bg-[#121317]'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= 7. SEVMEDİĞİN / YAPMAK İSTEMEDİĞİN HAREKETLER ================= */}
          {currentStep === 7 && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-white flex items-center space-x-1.5">
                    <Ban className="w-4 h-4 text-[#FF5356]" />
                    <span>7. Sevmediğin / yapmak istemediğin hareketler</span>
                  </h4>
                </div>
                <p className="text-xs text-[#A0A5B5]">
                  İstemediğin hareketlere dokunarak <strong className="text-[#FF5356]">❌ kırmızı</strong> yap. Bu hareketler programına ASLA eklenmez.
                </p>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {EXCLUDABLE_EXERCISES.map((ex) => {
                  const isExcluded = excludedExercises.includes(ex.id);
                  return (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => handleToggleExclude(ex.id)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between text-xs ${
                        isExcluded
                          ? 'bg-[#261317] border-[#FF1E38] text-white shadow-sm'
                          : 'bg-[#181920] border-[#262936] text-[#E3E2E8] hover:border-[#383B47]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white">{ex.name}</span>
                          <span className="text-[10px] text-[#A0A5B5] font-mono">({ex.target})</span>
                        </div>
                      </div>

                      <div
                        className={`px-2 py-1 rounded-lg text-xs font-bold font-mono flex items-center space-x-1 ${
                          isExcluded
                            ? 'bg-[#FF1E38] text-white'
                            : 'bg-[#292A2E] text-[#A0A5B5]'
                        }`}
                      >
                        <span>{isExcluded ? 'Çıkarıldı ❌' : 'Dahil ✅'}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {excludedExercises.length > 0 && (
                <div className="p-2.5 rounded-xl bg-[#261317] border border-[#FF1E38]/30 flex items-center justify-between text-xs">
                  <span className="text-[#FF5356] font-bold">
                    {excludedExercises.length} hareket programdan çıkarıldı.
                  </span>
                  <button
                    onClick={() => setExcludedExercises([])}
                    className="text-[10px] text-[#A0A5B5] underline hover:text-white"
                  >
                    Hepsini Geri Al
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= 8. ÖZELLİKLE ÇALIŞMAK İSTEDİĞİN BÖLGELER ================= */}
          {currentStep === 8 && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-white flex items-center space-x-2">
                  <Target className="w-5 h-5 text-[#FF5356]" />
                  <span>8. Özellikle çalışmak istediğin bölgeler</span>
                </h4>
                <p className="text-xs text-[#A0A5B5]">
                  Öncelik vermek istediğin kas gruplarını işaretle:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Göğüs', icon: '🔴', tag: 'Üst & Alt Pektoral' },
                  { name: 'Sırt', icon: '🔵', tag: 'Kanat & Orta Sırt' },
                  { name: 'Omuz', icon: '🟡', tag: 'Yan & Ön Deltoid' },
                  { name: 'Kol', icon: '💪', tag: 'Biceps & Triceps' },
                  { name: 'Bacak', icon: '🟢', tag: 'Quads & Hamstrings' },
                  { name: 'Karın', icon: '🟣', tag: 'Sixpack & Core' },
                  { name: 'Tüm vücut', icon: '⚪', tag: 'Dengeli Komple Seans' },
                ].map((area) => {
                  const isSelected = focusAreas.includes(area.name);
                  return (
                    <button
                      key={area.name}
                      type="button"
                      onClick={() => handleToggleFocusArea(area.name)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-start justify-between ${
                        isSelected
                          ? 'bg-[#1F1F24] border-[#FF1E38] text-white shadow-md'
                          : 'bg-[#181920] border-[#262936] text-[#A0A5B5] hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span>{area.icon}</span>
                          <span className="text-xs font-extrabold text-white">{area.name}</span>
                        </div>
                        <span className="text-[10px] text-[#A0A5B5] mt-0.5 block">{area.tag}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'bg-[#FF1E38] border-[#FF1E38] text-white' : 'border-[#383B47]'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3px]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= 9. KARDİYO TERCİHİ ================= */}
          {currentStep === 9 && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-white flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <span>9. Kardiyo tercihi</span>
                </h4>
                <p className="text-xs text-[#A0A5B5]">
                  Antrenman sonuna eklenecek eğimli yürüyüş ve kardiyo yoğunluğunu belirle:
                </p>
              </div>

              <div className="space-y-2">
                {[
                  {
                    id: '10 dk • %8 Eğim • 4.5 km/h',
                    title: '10 dk • %8 Eğim • 4.5 km/h',
                    desc: 'Kısa toparlanma & hafif eğimli yürüyüş (4-6 km/h)',
                    badge: '10 DK / %8',
                  },
                  {
                    id: '20 dk • %12 Eğim • 5.0 km/h',
                    title: '20 dk • %12 Eğim • 5.0 km/h (Önerilen)',
                    desc: 'Zone 2 optimal yağ oksidasyonu & dayanıklılık',
                    badge: '20 DK / %12',
                  },
                  {
                    id: '30 dk • %15 Eğim • 5.5 km/h',
                    title: '30 dk • %15 Eğim • 5.5 km/h',
                    desc: 'Yüksek eğim • Maksimum kalori harcama & kondisyon',
                    badge: '30 DK / %15',
                  },
                  {
                    id: 'Hiç istemiyorum',
                    title: 'Kardiyo İstemiyorum',
                    desc: 'Yalnızca ağırlık ve hipertrofi setleri',
                    badge: 'KARDİYO YOK',
                  },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCardioPreference(c.id)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      cardioPreference === c.id
                        ? 'bg-[#1F1F24] border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                        : 'bg-[#181920] border-[#262936] text-[#A0A5B5] hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-extrabold text-white block">{c.title}</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#121317] text-[9px] font-mono text-emerald-400 font-bold border border-emerald-500/30">
                          {c.badge}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#A0A5B5] block mt-0.5">{c.desc}</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        cardioPreference === c.id ? 'border-emerald-500 bg-emerald-500' : 'border-[#383B47]'
                      }`}
                    >
                      {cardioPreference === c.id && <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= 10. PROGRAM YAPISI ================= */}
          {currentStep === 10 && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-white flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-[#FF5356]" />
                  <span>10. Program yapısı</span>
                </h4>
                <p className="text-xs text-[#A0A5B5]">
                  Haftalık antrenman split modelini seç:
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'Push / Pull / Legs', title: 'Push / Pull / Legs (İtiş / Çekiş / Bacak)', desc: 'Mekanik olarak en popüler ve bilimsel hipertrofi spliti' },
                  { id: 'Upper / Lower', title: 'Upper / Lower (Üst Gövde / Alt Gövde)', desc: 'Haftada 4 gün için en yüksek frekans ve güç dengesi' },
                  { id: 'Full Body', title: 'Full Body (Tüm Vücut)', desc: 'Her seansta tüm ana kas gruplarını uyarma' },
                  { id: 'Göğüs + Triceps / Sırt + Biceps / Omuz + Bacak', title: 'Bölgesel (Göğüs+Tri / Sırt+Bi / Omuz+Bacak)', desc: 'Klasik vücut geliştirme bölünmesi' },
                  { id: 'Sihirbaz seçsin', title: 'Sihirbaz seçsin (Akıllı Otomatik)', desc: 'Verdiğin tüm yanıtlara göre en kusursuz spliti üret' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSplitStructure(s.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      splitStructure === s.id
                        ? 'bg-[#1F1F24] border-[#FF1E38] text-white shadow-md'
                        : 'bg-[#181920] border-[#262936] text-[#A0A5B5] hover:text-white'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-extrabold text-white block">{s.title}</span>
                      <span className="text-[10px] text-[#A0A5B5] block mt-0.5">{s.desc}</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        splitStructure === s.id ? 'border-[#FF1E38] bg-[#FF1E38]' : 'border-[#383B47]'
                      }`}
                    >
                      {splitStructure === s.id && <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 11: GENERATED CUSTOMIZED PROGRAM RESULT ================= */}
          {currentStep === 11 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#1C1D24] to-[#121317] border-2 border-[#FF1E38]/50 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FF1E38] animate-pulse" />
                      <span className="text-[10px] font-extrabold text-[#FF5356] uppercase tracking-wider font-mono">
                        SİHİRBAZ TARAFINDAN OLUŞTURULDU
                      </span>
                    </div>
                    <h4 className="text-base font-extrabold text-white mt-0.5">{programTitle}</h4>
                    <p className="text-[11px] text-[#A0A5B5]">
                      {goal} • {level} Seviye • Haftada {daysPerWeek}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded bg-[#292A2E] text-[10px] font-mono text-white font-bold">
                    {generatedExercises.length} Hareket
                  </span>
                </div>

                {/* 3 Telemetry Pillars */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-[#121317] border border-[#262936]">
                    <span className="text-[10px] text-[#A0A5B5] block">Toplam Set</span>
                    <span className="text-sm font-extrabold text-[#FF5356] font-mono mt-0.5 block">
                      {totalSets} Set
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#121317] border border-[#262936]">
                    <span className="text-[10px] text-[#A0A5B5] block">Süre Tahmini</span>
                    <span className="text-sm font-extrabold text-white font-mono mt-0.5 block">
                      {duration}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#121317] border border-[#262936]">
                    <span className="text-[10px] text-[#A0A5B5] block">Kardiyo</span>
                    <span className="text-sm font-extrabold text-emerald-400 font-mono mt-0.5 block">
                      {generatedCardio ? `${generatedCardio.durationMinutes} dk` : 'Yok'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Exercises List with Set & Kg Steppers */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-extrabold text-[#A0A5B5] uppercase block">
                  HAREKETLER & SET / KG ÖZELLEŞTİRMESİ:
                </span>

                {generatedExercises.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-[#181920] border border-[#262936] space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-md bg-[#1F1F24] text-[#FF5356] font-mono font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <h5 className="text-xs font-bold text-white">{item.exerciseName}</h5>
                          <span className="text-[10px] text-[#A0A5B5] font-mono">
                            {item.targetMuscle} • {item.restSeconds}sn Dinlenme
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-[#5A6072] hover:text-[#FF1E38] p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Steppers: KAÇ SET? & KAÇ KG? & 10/12/15 TEKRAR */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {/* SET */}
                      <div className="p-2 rounded-xl bg-[#121317] border border-[#262936] flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#A0A5B5]">SET:</span>
                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateItem(item.id, {
                                targetSets: Math.max(1, item.targetSets - 1),
                              })
                            }
                            className="w-6 h-6 rounded bg-[#1F1F24] text-white text-xs font-bold flex items-center justify-center hover:bg-[#292A2E]"
                          >
                            -
                          </button>
                          <span className="font-mono font-bold text-xs text-white w-4 text-center">
                            {item.targetSets}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateItem(item.id, {
                                targetSets: Math.min(8, item.targetSets + 1),
                              })
                            }
                            className="w-6 h-6 rounded bg-[#1F1F24] text-white text-xs font-bold flex items-center justify-center hover:bg-[#292A2E]"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* KG */}
                      <div className="p-2 rounded-xl bg-[#121317] border border-[#262936] flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#A0A5B5]">KİLO:</span>
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateItem(item.id, {
                                targetWeightKg: Math.max(0, item.targetWeightKg - 2.5),
                              })
                            }
                            className="w-6 h-6 rounded bg-[#1F1F24] text-white text-[10px] font-bold flex items-center justify-center hover:bg-[#292A2E]"
                          >
                            -
                          </button>
                          <span className="font-mono font-bold text-xs text-[#FF5356] px-1">
                            {item.targetWeightKg}kg
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateItem(item.id, {
                                targetWeightKg: item.targetWeightKg + 2.5,
                              })
                            }
                            className="w-6 h-6 rounded bg-[#1F1F24] text-white text-[10px] font-bold flex items-center justify-center hover:bg-[#292A2E]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 10 / 12 / 15 TEKRAR HIZLI SEÇİMİ */}
                    <div className="pt-0.5 flex items-center justify-between bg-[#121317] p-2 rounded-xl border border-[#262936]">
                      <span className="text-[10px] font-bold text-[#A0A5B5]">TEKRAR HEDEFİ:</span>
                      <div className="flex items-center space-x-1">
                        {[10, 12, 15].map((repOption) => (
                          <button
                            key={repOption}
                            type="button"
                            onClick={() => handleUpdateItem(item.id, { targetReps: repOption })}
                            className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold transition-all ${
                              item.targetReps === repOption
                                ? 'bg-[#FF1E38] text-white shadow-sm'
                                : 'bg-[#1F1F24] text-[#A0A5B5] hover:text-white'
                            }`}
                          >
                            {repOption}
                          </button>
                        ))}
                        <span className="text-[10px] text-[#A0A5B5] font-mono ml-1 font-semibold">
                          ({item.targetReps} Tekrar)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cardio settings in result with 8/12/15 eğim, 10/20/30 dk, 4-6 km/h */}
              {generatedCardio && (
                <div className="p-3.5 rounded-2xl bg-[#181920] border-2 border-emerald-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="text-xs font-extrabold text-white block">
                          {generatedCardio.name}
                        </span>
                        <span className="text-[10px] text-[#A0A5B5]">
                          Eğimli Yürüyüş & Yağ Yakımı Protokolü
                        </span>
                      </div>
                    </div>
                    <span className="text-emerald-400 font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#121317] border border-emerald-500/30">
                      ~{generatedCardio.targetCalories} kcal
                    </span>
                  </div>

                  {/* 3 Telemetry Pillars */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-[#121317] border border-[#262936]">
                      <span className="text-[9px] text-[#A0A5B5] block uppercase font-bold">SÜRE</span>
                      <span className="font-mono font-extrabold text-white text-sm mt-0.5 block">
                        {generatedCardio.durationMinutes} dk
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#121317] border border-emerald-500/30">
                      <span className="text-[9px] text-emerald-400 block uppercase font-bold">EĞİM</span>
                      <span className="font-mono font-extrabold text-emerald-400 text-sm mt-0.5 block">
                        %{generatedCardio.inclinePercent} Eğim
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#121317] border border-amber-500/30">
                      <span className="text-[9px] text-amber-400 block uppercase font-bold">HIZ</span>
                      <span className="font-mono font-extrabold text-amber-400 text-sm mt-0.5 block">
                        {generatedCardio.speedKmh} km/h
                      </span>
                    </div>
                  </div>

                  {/* Quick Selectors for 10/20/30 dk, 8/12/15 incline, 4-6 km/h */}
                  <div className="space-y-2 pt-1 border-t border-[#262936]">
                    {/* Süre Butonları */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] font-bold text-[#A0A5B5]">Süre:</span>
                      <div className="flex items-center space-x-1.5">
                        {[10, 20, 30].map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => updateCardioParam({ durationMinutes: d })}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                              generatedCardio.durationMinutes === d
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-[#121317] text-[#A0A5B5] hover:text-white border border-[#262936]'
                            }`}
                          >
                            {d} dk
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Eğim Butonları */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] font-bold text-emerald-400">Eğim:</span>
                      <div className="flex items-center space-x-1.5">
                        {[8, 12, 15].map((inc) => (
                          <button
                            key={inc}
                            type="button"
                            onClick={() => updateCardioParam({ inclinePercent: inc })}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                              generatedCardio.inclinePercent === inc
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-[#121317] text-emerald-400 hover:text-white border border-emerald-500/30'
                            }`}
                          >
                            %{inc} Eğim
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Hız Butonları (4-6 km/h arası) */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] font-bold text-amber-400">Hız (4-6 km/h):</span>
                      <div className="flex items-center space-x-1">
                        {[4.0, 4.5, 5.0, 5.5, 6.0].map((spd) => (
                          <button
                            key={spd}
                            type="button"
                            onClick={() => updateCardioParam({ speedKmh: spd })}
                            className={`px-1.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                              generatedCardio.speedKmh === spd
                                ? 'bg-amber-600 text-white shadow-sm'
                                : 'bg-[#121317] text-amber-400 hover:text-white border border-amber-500/30'
                            }`}
                          >
                            {spd.toFixed(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation & Submit */}
        <div className="p-4 bg-[#14151B] border-t border-[#262936] shrink-0 space-y-2">
          {currentStep <= 10 ? (
            <div className="flex items-center space-x-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                  className="h-11 px-4 rounded-xl bg-[#1F1F24] hover:bg-[#292A2E] text-white text-xs font-bold flex items-center space-x-1 border border-[#262936] transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Geri</span>
                </button>
              )}

              {currentStep < 10 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => Math.min(10, prev + 1))}
                  className="flex-1 h-11 rounded-xl bg-[#FF1E38] hover:bg-[#FF334B] text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-lg shadow-[#FF1E38]/20 transition-all active:scale-[0.98]"
                >
                  <span>Sonraki Soru ({currentStep + 1} / 10)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={generateProgramFromAnswers}
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#FF1E38] to-[#FF5356] hover:from-[#FF334B] hover:to-[#FF1E38] text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-xl shadow-[#FF1E38]/30 transition-all active:scale-[0.98]"
                >
                  <Wand2 className="w-4 h-4 animate-spin" />
                  <span>Programımı Sihirbazla Oluştur ✨</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleApplyAndStart}
                className="w-full h-12 rounded-xl bg-[#FF1E38] hover:bg-[#FF334B] text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-[#FF1E38]/30 transition-all active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Bu Programı Canlı Antrenmana Yükle & Başlat</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="h-10 px-3 rounded-xl bg-[#1F1F24] hover:bg-[#292A2E] text-[#A0A5B5] hover:text-white text-xs font-bold border border-[#262936] transition-all flex items-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Yeniden Başla</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveOnly}
                  className="flex-1 h-10 rounded-xl bg-[#1F1F24] hover:bg-[#292A2E] text-[#E3E2E8] hover:text-white text-xs font-bold border border-[#262936] transition-all flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-4 h-4 text-[#FF5356]" />
                  <span>Yalnızca Profilime Kaydet</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
