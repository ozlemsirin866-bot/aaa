import React, { useState } from 'react';
import {
  Wand2,
  X,
  ChevronRight,
  ChevronLeft,
  Flame,
  Droplet,
  Dumbbell,
  Sparkles,
  Check,
  CheckCircle,
  TrendingUp,
  Apple,
  Info,
  Sliders,
  Scale,
  Activity,
  Heart,
  Zap,
} from 'lucide-react';
import { DailyNutrition } from '../types/fitness';

interface NutritionWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNutrition: DailyNutrition;
  onApplyNutritionTargets: (updatedTargets: {
    energyTarget: number;
    proteinTarget: number;
    carbsTarget: number;
    fatsTarget: number;
    hydrationTarget: number;
    goal: string;
  }) => void;
  initialWeightKg?: number;
  initialHeightCm?: number;
}

export const NutritionWizardModal: React.FC<NutritionWizardModalProps> = ({
  isOpen,
  onClose,
  currentNutrition,
  onApplyNutritionTargets,
  initialWeightKg = 110,
  initialHeightCm = 177,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(26);
  const [heightCm, setHeightCm] = useState<number>(initialHeightCm);
  const [weightKg, setWeightKg] = useState<number>(initialWeightKg);
  const [bodyFatCategory, setBodyFatCategory] = useState<'lean' | 'athletic' | 'average' | 'high'>('athletic');

  // Activity Level
  const [activityLevel, setActivityLevel] = useState<number>(1.55); // 1.2, 1.375, 1.55, 1.725, 1.9

  // Primary Goal
  const [goalType, setGoalType] = useState<'cut' | 'lean_bulk' | 'heavy_bulk' | 'maintenance'>('cut');

  // Macro preference
  const [macroPreference, setMacroPreference] = useState<'balanced' | 'high_carb' | 'low_carb'>('balanced');

  // Meal frequency
  const [mealsPerDay, setMealsPerDay] = useState<number>(4);

  if (!isOpen) return null;

  // BMR Calculation (Mifflin - St Jeor)
  // Men: 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) + 5
  // Women: 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) - 161
  const bmr = Math.round(
    gender === 'male'
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161
  );

  // TDEE (Total Daily Energy Expenditure)
  const tdee = Math.round(bmr * activityLevel);

  // Caloric Target based on Goal
  let calorieAdjustment = 0;
  let calculatedGoalTitle = 'KÜTLE KORUMA';

  if (goalType === 'cut') {
    calorieAdjustment = -500;
    calculatedGoalTitle = 'DEFİNASYON';
  } else if (goalType === 'lean_bulk') {
    calorieAdjustment = 300;
    calculatedGoalTitle = 'HİPERTROFİ (BULK)';
  } else if (goalType === 'heavy_bulk') {
    calorieAdjustment = 550;
    calculatedGoalTitle = 'HİPERTROFİ (BULK)';
  } else {
    calorieAdjustment = 0;
    calculatedGoalTitle = 'KÜTLE KORUMA';
  }

  const targetCalories = Math.max(1400, Math.round(tdee + calorieAdjustment));

  // Protein calculation (g / kg)
  // Cut: 2.2g/kg, Lean bulk: 2.0g/kg, Heavy bulk: 1.9g/kg, Maintenance: 2.0g/kg
  let proteinRatio = 2.0;
  if (goalType === 'cut') proteinRatio = 2.2;
  else if (goalType === 'lean_bulk') proteinRatio = 2.0;
  else if (goalType === 'heavy_bulk') proteinRatio = 1.9;
  else proteinRatio = 2.0;

  if (macroPreference === 'low_carb') proteinRatio += 0.2;

  const targetProtein = Math.round(weightKg * proteinRatio);

  // Fat calculation (0.8g - 1.0g per kg, adjusted by macro preference)
  let fatRatio = 0.85;
  if (macroPreference === 'low_carb') fatRatio = 1.1;
  else if (macroPreference === 'high_carb') fatRatio = 0.75;
  const targetFats = Math.round(weightKg * fatRatio);

  // Carbohydrate calculation: Remaining calories
  // Carbs (g) = (targetCalories - (targetProtein * 4 + targetFats * 9)) / 4
  const caloriesFromProteinAndFat = targetProtein * 4 + targetFats * 9;
  const targetCarbs = Math.max(50, Math.round((targetCalories - caloriesFromProteinAndFat) / 4));

  // Hydration calculation: 4.0L optimal su tüketimi hedefi
  const targetWaterLiters = 4.0;

  const handleApply = () => {
    onApplyNutritionTargets({
      energyTarget: targetCalories,
      proteinTarget: targetProtein,
      carbsTarget: targetCarbs,
      fatsTarget: targetFats,
      hydrationTarget: targetWaterLiters,
      goal: calculatedGoalTitle,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#14151C] border border-[#262936] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-white select-none">
        {/* Top Handle on Mobile */}
        <div className="w-12 h-1 bg-[#343439] rounded-full mx-auto mt-3 sm:hidden" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#232635] flex items-center justify-between bg-[#191B24]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF1E38] to-[#FF5356] flex items-center justify-center text-white shadow-md">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-black text-[#FF5356] uppercase tracking-wider font-mono">
                  BİYOMETRİK BESLENME SİHİRBAZI
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#272A3B] text-[#A0A5B5] font-mono">
                  Adım {currentStep} / 5
                </span>
              </div>
              <h2 className="text-base font-extrabold text-white">
                Kişiye Özel Kalori & Makro Planı
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#222533] text-[#A0A5B5] hover:text-white flex items-center justify-center transition-colors border border-[#2E3245]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-[#1F2230]">
          <div
            className="h-full bg-gradient-to-r from-[#FF1E38] to-[#FF5356] transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        {/* Scrollable Wizard Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* STEP 1: Cinsiyet & Yaş */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white uppercase tracking-wide">
                  1. Cinsiyet & Yaşınızı Belirleyin
                </h3>
                <p className="text-xs text-[#A0A5B5]">
                  Bazal metabolizma hızı (BMR) cinsiyet hormonları ve yaşa bağlı metabolik yavaşlama katsayısına göre hesaplanır.
                </p>
              </div>

              {/* Gender selection */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    gender === 'male'
                      ? 'bg-[#1E202C] border-[#FF1E38] shadow-md shadow-[#FF1E38]/15'
                      : 'bg-[#151720] border-[#262936] text-[#A0A5B5] hover:text-white'
                  }`}
                >
                  <span className="text-3xl block mb-1">👨</span>
                  <span className="text-xs font-black block text-white">Erkek</span>
                  <span className="text-[10px] text-[#A0A5B5] block mt-0.5">Yüksek Testosteron / Kas Kütlesi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    gender === 'female'
                      ? 'bg-[#1E202C] border-[#FF1E38] shadow-md shadow-[#FF1E38]/15'
                      : 'bg-[#151720] border-[#262936] text-[#A0A5B5] hover:text-white'
                  }`}
                >
                  <span className="text-3xl block mb-1">👩</span>
                  <span className="text-xs font-black block text-white">Kadın</span>
                  <span className="text-[10px] text-[#A0A5B5] block mt-0.5">Hormonal Denge & Yağ Dağılımı</span>
                </button>
              </div>

              {/* Age Slider / Input */}
              <div className="p-4 rounded-xl bg-[#181A24] border border-[#262936] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white">Yaşınız:</label>
                  <span className="text-sm font-black font-mono text-[#FF5356] bg-red-950/40 px-2 py-0.5 rounded border border-red-900/30">
                    {age} Yaş
                  </span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="70"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full accent-[#FF1E38]"
                />
                <div className="flex justify-between text-[10px] text-[#A0A5B5] font-mono">
                  <span>16</span>
                  <span>30</span>
                  <span>45</span>
                  <span>70</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Boy & Kilo & Vücut Tipi */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white uppercase tracking-wide">
                  2. Boy, Ağırlık ve Vücut Kompozisyonu
                </h3>
                <p className="text-xs text-[#A0A5B5]">
                  Toplam vücut ağırlığı ve boy oranı yağsız kas dokusu hacmini ve günlük su ihtiyacını belirler.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Weight Input */}
                <div className="p-3.5 rounded-xl bg-[#181A24] border border-[#262936] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#A0A5B5]">Mevcut Kilo</span>
                    <Scale className="w-3.5 h-3.5 text-[#FF5356]" />
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <input
                      type="number"
                      step="0.5"
                      min="40"
                      max="160"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value) || 70)}
                      className="w-full text-2xl font-black bg-transparent text-white font-mono focus:outline-none"
                    />
                    <span className="text-xs font-bold text-[#A0A5B5]">kg</span>
                  </div>
                  <span className="text-[10px] text-[#71778E] block">Örn: 110 kg</span>
                </div>

                {/* Height Input */}
                <div className="p-3.5 rounded-xl bg-[#181A24] border border-[#262936] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#A0A5B5]">Boy Ölçüsü</span>
                    <TrendingUp className="w-3.5 h-3.5 text-[#FF5356]" />
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <input
                      type="number"
                      min="140"
                      max="220"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value) || 175)}
                      className="w-full text-2xl font-black bg-transparent text-white font-mono focus:outline-none"
                    />
                    <span className="text-xs font-bold text-[#A0A5B5]">cm</span>
                  </div>
                  <span className="text-[10px] text-[#71778E] block">Örn: 177 cm</span>
                </div>
              </div>

              {/* Body fat categories */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white block">
                  Tahmini Vücut Yağ Durumu:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'lean', label: 'Yağsız / Parçalı', range: '%8 - %12', desc: 'Karın kasları belirgin' },
                    { id: 'athletic', label: 'Atletik / Fit', range: '%13 - %17', desc: 'Hafif hatlar, sert yapı' },
                    { id: 'average', label: 'Normal / Ortalama', range: '%18 - %23', desc: 'Dengeli vücut formu' },
                    { id: 'high', label: 'Hacimli / Dolgun', range: '%24+', desc: 'Yüksek yağ veya off-season' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setBodyFatCategory(cat.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        bodyFatCategory === cat.id
                          ? 'bg-[#1E202C] border-[#FF1E38] text-white shadow-sm'
                          : 'bg-[#151720] border-[#262936] text-[#A0A5B5] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-white">{cat.label}</span>
                        <span className="text-[9px] font-mono text-[#FF5356]">{cat.range}</span>
                      </div>
                      <span className="text-[10px] text-[#71778E] block">{cat.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Günlük Aktivite Seviyesi */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white uppercase tracking-wide">
                  3. Günlük Fiziksel Aktivite Düzeyiniz
                </h3>
                <p className="text-xs text-[#A0A5B5]">
                  Toplam harcanan enerjiyi (TDEE) belirler. Antrenman sıklığınız ve gün içindeki adım sayınızı seçin.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  {
                    mult: 1.2,
                    title: 'Masa Başı / Sedanter',
                    desc: 'Ofis çalışanı, günde 3000-5000 adım, sporsuz veya nadir hareket.',
                    badge: 'x1.20',
                  },
                  {
                    mult: 1.375,
                    title: 'Hafif Hareketli',
                    desc: 'Haftada 1-3 gün hafif spor veya günde 6000-8000 tempolu adım.',
                    badge: 'x1.375',
                  },
                  {
                    mult: 1.55,
                    title: 'Orta Düzeyde Aktif (Önerilen)',
                    desc: 'Haftada 3-5 gün yoğun fitness/ağırlık antrenmanı + günlük aktif yaşam.',
                    badge: 'x1.55',
                    popular: true,
                  },
                  {
                    mult: 1.725,
                    title: 'Çok Aktif / İleri Seviye',
                    desc: 'Haftada 6-7 gün ağır antrenmanlar veya yoğun bedensel meslek.',
                    badge: 'x1.725',
                  },
                  {
                    mult: 1.9,
                    title: 'Ağır Sporcu / Çift Antrenman',
                    desc: 'Günde 2 seans antrenman, profesyonel atlet veya maraton seviyesi.',
                    badge: 'x1.90',
                  },
                ].map((act) => {
                  const isSelected = activityLevel === act.mult;
                  return (
                    <button
                      key={act.mult}
                      type="button"
                      onClick={() => setActivityLevel(act.mult)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#1E202C] border-[#FF1E38] shadow-md shadow-[#FF1E38]/15'
                          : 'bg-[#151720] border-[#262936] hover:border-[#383C4E]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white">{act.title}</span>
                          {act.popular && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-800/40">
                              En Yaygın
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#FF5356] bg-[#111218] px-2 py-0.5 rounded border border-[#262936]">
                          {act.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A0A5B5] leading-snug">{act.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Hedef Belirleme & Makro Yaklaşımı */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white uppercase tracking-wide">
                  4. Fitness Hedefi & Beslenme Modeli
                </h3>
                <p className="text-xs text-[#A0A5B5]">
                  Hedefinize göre günlük kalori açığı veya fazlalığı ve makro oranları otomatik hesaplanır.
                </p>
              </div>

              {/* Goal cards */}
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  {
                    id: 'cut',
                    icon: '⚡',
                    title: 'Definasyon / Yağ Yakımı',
                    sub: '-500 kcal Açık',
                    desc: 'Maksimum kas koruması & hızlı yağ yakımı.',
                    macro: '2.2g/kg Yüksek Protein',
                  },
                  {
                    id: 'lean_bulk',
                    icon: '💪',
                    title: 'Temiz Kütle (Lean Bulk)',
                    sub: '+300 kcal Kontrollü',
                    desc: 'Minimum yağlanma ile saf hipertrofi.',
                    macro: '2.0g/kg Protein & Dolu Glikojen',
                  },
                  {
                    id: 'heavy_bulk',
                    icon: '🦍',
                    title: 'Agresif Bulk & Güç',
                    sub: '+550 kcal Yükleme',
                    desc: 'Hızlı kilo artışı ve tepe kuvvet sinyali.',
                    macro: 'Yüksek Karbonhidrat Odaklı',
                  },
                  {
                    id: 'maintenance',
                    icon: '⚖️',
                    title: 'Kütle Koruma / Rekomp',
                    sub: '0 kcal Denge',
                    desc: 'Aynı kiloda kalıp kas oranını artırma.',
                    macro: '2.0g/kg Protein Dengeli',
                  },
                ].map((g) => {
                  const isSelected = goalType === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoalType(g.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#1E202C] border-[#FF1E38] shadow-md shadow-[#FF1E38]/20'
                          : 'bg-[#151720] border-[#262936] text-[#A0A5B5] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">{g.icon}</span>
                        <span className="text-[10px] font-mono font-bold text-[#FF5356]">{g.sub}</span>
                      </div>
                      <h4 className="text-xs font-black text-white">{g.title}</h4>
                      <p className="text-[10px] text-[#A0A5B5] mt-1 leading-tight">{g.desc}</p>
                      <span className="text-[9px] text-[#71778E] font-mono block mt-1.5 pt-1 border-t border-[#262936]/60">
                        {g.macro}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Macro style preference */}
              <div className="p-3.5 rounded-xl bg-[#181A24] border border-[#262936] space-y-2">
                <label className="text-xs font-bold text-white block">
                  Makro Dağılım Tercihi:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'balanced', label: 'Standart Bodybuilding', desc: '%40K / %35P / %25Y' },
                    { id: 'high_carb', label: 'Yüksek Karb / Enerji', desc: '%50K / %25P / %25Y' },
                    { id: 'low_carb', label: 'Düşük Karb / Ketojenik', desc: '%20K / %45P / %35Y' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMacroPreference(m.id as any)}
                      className={`p-2 rounded-lg text-center border transition-all ${
                        macroPreference === m.id
                          ? 'bg-[#FF1E38] border-[#FF1E38] text-white shadow-sm'
                          : 'bg-[#121318] border-[#262936] text-[#A0A5B5] hover:text-white'
                      }`}
                    >
                      <span className="text-[10px] font-extrabold block truncate">{m.label}</span>
                      <span className="text-[8px] font-mono opacity-80 block mt-0.5">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Kişiye Özel Beslenme Sonuç Ekranı & Ayrıntılı Açıklama */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#1C1720] to-amber-950/30 border border-[#FF1E38]/40 space-y-1">
                <div className="flex items-center space-x-2 text-[#FF5356]">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    KİŞİYE ÖZEL BESLENME PROFİLİNİZ OLUŞTURULDU
                  </span>
                </div>
                <h3 className="text-base font-black text-white">
                  {calculatedGoalTitle} • {targetCalories} kcal / Gün
                </h3>
                <p className="text-xs text-[#A0A5B5]">
                  {weightKg} kg, {heightCm} cm, {age} yaş ve {activityLevel}x aktivite katsayısına göre Mifflin-St Jeor formülüyle optimize edilmiştir.
                </p>
              </div>

              {/* 4 Ana Metrik Kartı */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-3 rounded-xl bg-[#181A24] border border-[#262936] text-center">
                  <span className="text-[10px] text-[#A0A5B5] font-bold block uppercase">BMR (Metabolizma)</span>
                  <span className="text-lg font-black text-white font-mono block mt-0.5">{bmr}</span>
                  <span className="text-[9px] text-[#71778E] font-mono block">kcal bazal</span>
                </div>

                <div className="p-3 rounded-xl bg-[#181A24] border border-[#262936] text-center">
                  <span className="text-[10px] text-[#A0A5B5] font-bold block uppercase">TDEE (Toplam Harcama)</span>
                  <span className="text-lg font-black text-white font-mono block mt-0.5">{tdee}</span>
                  <span className="text-[9px] text-[#71778E] font-mono block">kcal aktif</span>
                </div>

                <div className="p-3 rounded-xl bg-[#1E1920] border border-[#FF1E38]/50 text-center">
                  <span className="text-[10px] text-[#FF5356] font-bold block uppercase">GÜNLÜK HEDEF</span>
                  <span className="text-xl font-black text-[#FF5356] font-mono block mt-0.5">{targetCalories}</span>
                  <span className="text-[9px] text-[#A0A5B5] font-mono block">{calorieAdjustment >= 0 ? `+${calorieAdjustment}` : calorieAdjustment} kcal bütçe</span>
                </div>

                <div className="p-3 rounded-xl bg-[#181A24] border border-blue-500/30 text-center">
                  <span className="text-[10px] text-blue-400 font-bold block uppercase">HİDRASYON</span>
                  <span className="text-lg font-black text-blue-400 font-mono block mt-0.5">{targetWaterLiters}L</span>
                  <span className="text-[9px] text-[#71778E] font-mono block">Günlük Su</span>
                </div>
              </div>

              {/* Makro Dağılım Çubukları */}
              <div className="p-4 rounded-xl bg-[#181A24] border border-[#262936] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Önerilen Günlük Makro Bütçesi
                  </span>
                  <span className="text-[10px] font-mono text-[#A0A5B5]">
                    %{Math.round((targetProtein * 4 / targetCalories) * 100)} P • %{Math.round((targetCarbs * 4 / targetCalories) * 100)} K • %{Math.round((targetFats * 9 / targetCalories) * 100)} Y
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-lg bg-[#121318] border border-[#262936]">
                    <span className="text-[10px] text-[#FF5356] font-bold block uppercase">🥩 Protein</span>
                    <span className="text-base font-black text-white font-mono block mt-0.5">{targetProtein}g</span>
                    <span className="text-[9px] text-[#A0A5B5] font-mono block">({proteinRatio.toFixed(1)}g / kg)</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#121318] border border-[#262936]">
                    <span className="text-[10px] text-amber-400 font-bold block uppercase">🍚 Karbonhidrat</span>
                    <span className="text-base font-black text-white font-mono block mt-0.5">{targetCarbs}g</span>
                    <span className="text-[9px] text-[#A0A5B5] font-mono block">({Math.round(targetCarbs * 4)} kcal)</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#121318] border border-[#262936]">
                    <span className="text-[10px] text-blue-400 font-bold block uppercase">🥑 Sağlıklı Yağ</span>
                    <span className="text-base font-black text-white font-mono block mt-0.5">{targetFats}g</span>
                    <span className="text-[9px] text-[#A0A5B5] font-mono block">({fatRatio.toFixed(2)}g / kg)</span>
                  </div>
                </div>
              </div>

              {/* =========================================================
                  KİŞİYE ÖZEL BESLENME BÖLÜMÜ AÇIKLAMASI (User requested)
                 ========================================================= */}
              <div className="p-4 rounded-xl bg-[#111218] border border-[#262936] space-y-3">
                <div className="flex items-center space-x-2 text-amber-400">
                  <Info className="w-4 h-4 shrink-0" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">
                    Kişiye Özel Beslenme Stratejiniz & Bilimsel Açıklama
                  </h4>
                </div>

                <div className="space-y-2.5 text-xs text-[#A0A5B5] leading-relaxed">
                  <div className="p-2.5 rounded-lg bg-[#181A24] border border-[#262936]/80">
                    <strong className="text-white block mb-0.5">
                      🔥 1. Kalori Dengesi & Enerji Harcaması
                    </strong>
                    Vücudunuz hiçbir şey yapmadan sadece organ fonksiyonlarını sürdürmek için günde{' '}
                    <span className="text-white font-mono font-bold">{bmr} kcal</span> harcar.
                    Günlük spor ve hareket katsayınızla toplam harcamanız{' '}
                    <span className="text-white font-mono font-bold">{tdee} kcal</span> olarak saptandı. Seçtiğiniz {calculatedGoalTitle} hedefi için günlük kalori hedefiniz{' '}
                    <span className="text-[#FF5356] font-mono font-bold">{targetCalories} kcal</span> olarak planlandı.
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#181A24] border border-[#262936]/80">
                    <strong className="text-white block mb-0.5">
                      🥩 2. Protein Stratejisi (Kas Koruma & MPS)
                    </strong>
                    Ağırlığınız başına <span className="text-white font-mono font-bold">{proteinRatio.toFixed(1)}g</span> protein ({targetProtein}g) belirlendi. Kas protein sentezini (MPS) tepe noktada tutmak için bu miktarı gün içine 4 eşit öğüne bölerek öğün başına en az 35-45g protein tüketmeniz lösin eşiğini aşmanızı sağlar.
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#181A24] border border-[#262936]/80">
                    <strong className="text-white block mb-0.5">
                      ⚡ 3. Karbonhidrat & Antrenman Zamanlaması
                    </strong>
                    Günlük <span className="text-white font-mono font-bold">{targetCarbs}g</span> karbonhidrat bütçenizin en az %60'ını antrenmandan 2 saat önceki öğün ile antrenmandan hemen sonraki toparlanma öğününe paylaştırın. Bu sayede kas içi glikojen depoları dolu kalır ve ağırlık rekorlarınız düşmez.
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#181A24] border border-[#262936]/80">
                    <strong className="text-white block mb-0.5">
                      💧 4. Hücresel Hidrasyon Reçetesi
                    </strong>
                    Vücut kilonuz ve antrenmandaki terleme kaybınız gereği günde minimum{' '}
                    <span className="text-blue-400 font-mono font-bold">{targetWaterLiters} Litre</span> su tüketmelisiniz. %2 oranındaki susuzluk dahi kas gücünüzü %15 oranında düşürür.
                  </div>

                  {/* Örnek 4 Öğünlük Şablon */}
                  <div className="p-2.5 rounded-lg bg-[#181A24] border border-amber-500/30">
                    <strong className="text-amber-400 block mb-1">
                      🍽️ Tavsiye Edilen 4 Öğün Dağılımı:
                    </strong>
                    <ul className="space-y-1 text-[11px] list-disc list-inside text-[#CBD0DF]">
                      <li><strong className="text-white">Kahvaltı (08:30):</strong> ~{Math.round(targetCalories * 0.25)} kcal ({Math.round(targetProtein * 0.25)}g Protein)</li>
                      <li><strong className="text-white">Öğle Yemeği (13:00):</strong> ~{Math.round(targetCalories * 0.35)} kcal ({Math.round(targetProtein * 0.35)}g Protein)</li>
                      <li><strong className="text-white">İdman Öncesi/Ara (16:30):</strong> ~{Math.round(targetCalories * 0.15)} kcal ({Math.round(targetProtein * 0.15)}g Protein)</li>
                      <li><strong className="text-white">Akşam Toparlanma (20:00):</strong> ~{Math.round(targetCalories * 0.25)} kcal ({Math.round(targetProtein * 0.25)}g Protein)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Controls */}
        <div className="p-4 border-t border-[#232635] bg-[#191B24] flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="h-10 px-4 rounded-xl bg-[#222533] hover:bg-[#2A2E3F] text-[#A0A5B5] hover:text-white font-bold text-xs flex items-center space-x-1.5 transition-colors border border-[#2E3245]"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Geri</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#FF1E38] to-[#FF5356] hover:from-[#FF334B] hover:to-[#FF1E38] text-white font-black text-xs flex items-center space-x-2 shadow-lg shadow-[#FF1E38]/20 transition-all active:scale-95 ml-auto"
            >
              <span>Sonraki Adım</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApply}
              className="h-10 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95 ml-auto"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Bu Hedefleri Uygula ve Kaydet</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
