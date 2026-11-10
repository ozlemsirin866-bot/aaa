import React, { useState } from 'react';
import { X, Plus, Flame, Droplet, Dumbbell, Check } from 'lucide-react';
import { DailyNutrition } from '../types/fitness';

interface NutritionModalProps {
  isOpen: boolean;
  onClose: () => void;
  nutrition: DailyNutrition;
  onUpdateNutrition: (updated: DailyNutrition) => void;
}

export const NutritionModal: React.FC<NutritionModalProps> = ({
  isOpen,
  onClose,
  nutrition,
  onUpdateNutrition,
}) => {
  const [proteinAdd, setProteinAdd] = useState<number>(25);
  const [energyAdd, setEnergyAdd] = useState<number>(350);
  const [waterAdd, setWaterAdd] = useState<number>(0.25);
  const [mealName, setMealName] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSaveMeal = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMeal = {
      id: `meal-${Date.now()}`,
      name: mealName.trim() || 'Ek Öğün / Atıştırmalık',
      time: timeStr,
      protein: proteinAdd || 0,
      carbs: Math.round(((energyAdd || 0) * 0.45) / 4),
      fats: Math.round(((energyAdd || 0) * 0.25) / 9),
      calories: energyAdd || 0,
      description: mealName.trim() ? `${mealName.trim()} (+${proteinAdd}g Protein, ${energyAdd} kcal)` : 'Kullanıcı tarafından kaydedilen özel öğün.',
      completed: true,
    };

    const updated: DailyNutrition = {
      ...nutrition,
      proteinGrams: nutrition.proteinGrams + (proteinAdd || 0),
      energyKcal: nutrition.energyKcal + (energyAdd || 0),
      hydrationLiters: Number((nutrition.hydrationLiters + (waterAdd || 0)).toFixed(2)),
      meals: [newMeal, ...(nutrition.meals || [])],
    };
    onUpdateNutrition(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#1A1C24] border border-[#262936] rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl">
        <div className="w-12 h-1 bg-[#343439] rounded-full mx-auto mb-4 sm:hidden" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-[#292A2E] text-[#A0A5B5] hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-2 text-[#FF5356] mb-1">
          <Dumbbell className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Beslenme & Makro Girişi</span>
        </div>
        <h3 className="text-xl font-extrabold text-white">Öğün & Hidrasyon Ekle</h3>
        <p className="text-xs text-[#A0A5B5] mt-0.5">Hedef: {nutrition.goal}</p>

        <form onSubmit={handleSaveMeal} className="mt-5 space-y-4">
          {/* Meal Label */}
          <div>
            <label className="text-xs font-bold text-[#A0A5B5] uppercase block mb-1.5">
              Öğün veya Besin Adı
            </label>
            <input
              type="text"
              placeholder="Örn: Izgara Tavuk Göğsü, Protein Shake..."
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              className="w-full h-11 px-3.5 bg-[#121317] border border-[#262936] rounded-xl text-sm text-white placeholder-[#5A6072] focus:outline-none focus:border-[#FF1E38]"
            />
          </div>

          {/* Protein Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-white flex items-center space-x-1.5">
                <span className="text-[#FF5356]">●</span>
                <span>Protein Miktarı</span>
              </label>
              <span className="text-sm font-bold text-[#FF5356] font-mono tabular-nums">+{proteinAdd} g</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[15, 25, 35, 45].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setProteinAdd(val)}
                  className={`h-9 rounded-lg text-xs font-bold border transition-colors ${
                    proteinAdd === val
                      ? 'bg-[#FF1E38] border-[#FF1E38] text-white shadow-md'
                      : 'bg-[#121317] border-[#262936] text-[#A0A5B5] hover:text-white'
                  }`}
                >
                  +{val}g
                </button>
              ))}
            </div>
            <div className="relative mt-2">
              <input
                type="number"
                placeholder="Özel protein girin (ör. 30)"
                value={proteinAdd || ''}
                onChange={(e) => setProteinAdd(Math.max(0, Number(e.target.value)))}
                className="w-full h-10 px-3.5 bg-[#121317] border border-[#262936] rounded-xl text-sm text-white placeholder-[#5A6072] focus:outline-none focus:border-[#FF1E38] font-mono"
              />
              <span className="absolute right-3.5 top-2.5 text-xs font-bold text-[#A0A5B5]">gram</span>
            </div>
          </div>

          {/* Kalori Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Flame className="w-3.5 h-3.5 text-[#FF5356]" />
                <span>Enerji / Kalori</span>
              </label>
              <span className="text-sm font-bold text-white font-mono tabular-nums">+{energyAdd} kcal</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[100, 250, 500, 750].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setEnergyAdd(val)}
                  className={`h-9 rounded-lg text-xs font-bold border transition-colors ${
                    energyAdd === val
                      ? 'bg-[#343439] border-[#FF1E38] text-white'
                      : 'bg-[#121317] border-[#262936] text-[#A0A5B5] hover:text-white'
                  }`}
                >
                  +{val}
                </button>
              ))}
            </div>
            <div className="relative mt-2">
              <input
                type="number"
                placeholder="Manuel kalori girin (ör. 450)"
                value={energyAdd || ''}
                onChange={(e) => setEnergyAdd(Math.max(0, Number(e.target.value)))}
                className="w-full h-10 px-3.5 bg-[#121317] border border-[#262936] rounded-xl text-sm text-white placeholder-[#5A6072] focus:outline-none focus:border-[#FF1E38] font-mono"
              />
              <span className="absolute right-3.5 top-2.5 text-xs font-bold text-[#A0A5B5]">kcal</span>
            </div>
          </div>

          {/* Proteinocean Quick Supplements */}
          <div className="p-3 rounded-xl bg-[#121317] border border-[#262936] space-y-1.5">
            <span className="text-[10px] font-bold text-[#FF5356] uppercase tracking-wider block">
              ⚡ HIZLI PROTEINOCEAN TAKVİYESİ SEÇ:
            </span>
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {[
                { name: 'Whey Protein', cal: 86, p: 19 },
                { name: 'Whey Isolate', cal: 92, p: 22 },
                { name: 'Protein Meal', cal: 194, p: 26 },
                { name: 'Protein Bar', cal: 180, p: 15 },
                { name: 'Pre-Workout Supreme', cal: 5, p: 0 },
                { name: 'Creatine Monohydrate', cal: 0, p: 0 },
                { name: 'BCAA', cal: 20, p: 5 },
                { name: 'Omega 3', cal: 9, p: 0 },
              ].map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => {
                    setMealName(s.name);
                    setEnergyAdd(s.cal);
                    setProteinAdd(s.p);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#1F1F24] hover:bg-[#292A2E] text-white border border-[#262936] hover:border-[#FF1E38]/60 shrink-0 font-medium transition-colors"
                >
                  {s.name} ({s.cal} kcal)
                </button>
              ))}
            </div>
          </div>

          {/* Su Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Droplet className="w-3.5 h-3.5 text-blue-400" />
                <span>Su / Hidrasyon</span>
              </label>
              <span className="text-sm font-bold text-blue-400 font-mono tabular-nums">+{waterAdd} L</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[0.25, 0.5, 0.75].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setWaterAdd(val)}
                  className={`h-9 rounded-lg text-xs font-bold border transition-colors ${
                    waterAdd === val
                      ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                      : 'bg-[#121317] border-[#262936] text-[#A0A5B5] hover:text-white'
                  }`}
                >
                  +{val * 1000} ml
                </button>
              ))}
            </div>
          </div>

          {/* Current Totals Preview */}
          <div className="p-3 rounded-xl bg-[#121317] border border-[#262936] flex items-center justify-between text-xs">
            <span className="text-[#A0A5B5]">Yeni Toplam Protein:</span>
            <span className="font-bold text-white font-mono">
              {nutrition.proteinGrams + proteinAdd} / {nutrition.proteinTarget}g
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={savedSuccess}
            className={`w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md ${
              savedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-[#FF1E38] hover:bg-[#FF334B] text-white'
            }`}
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Başarıyla Kaydedildi!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Günlüğe Ekle & Güncelle</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
