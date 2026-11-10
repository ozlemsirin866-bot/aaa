import React, { useState } from 'react';
import {
  X,
  Search,
  Flame,
  Plus,
  Zap,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
  Pill,
} from 'lucide-react';
import { PROTEINOCEAN_SUPPLEMENTS, ProteinoceanSupplement } from '../data/supplementsData';
import { DailyNutrition, MealItem } from '../types/fitness';

interface ProteinoceanSupplementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  nutrition: DailyNutrition;
  onUpdateNutrition: (updated: DailyNutrition) => void;
}

export const ProteinoceanSupplementsModal: React.FC<ProteinoceanSupplementsModalProps> = ({
  isOpen,
  onClose,
  nutrition,
  onUpdateNutrition,
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('TÜMÜ');
  const [servingMultiplier, setServingMultiplier] = useState<Record<string, number>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    'TÜMÜ',
    'Protein & Gıda',
    'Pre-Workout & Enerji',
    'Amino Asit',
    'Vitamin & Sağlık',
  ];

  const filtered = PROTEINOCEAN_SUPPLEMENTS.filter((item) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.note && item.note.toLowerCase().includes(q));

    const matchesCategory =
      activeCategory === 'TÜMÜ' || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const getMultiplier = (id: string) => servingMultiplier[id] || 1;

  const setMultiplier = (id: string, mult: number) => {
    setServingMultiplier((prev) => ({ ...prev, [id]: mult }));
  };

  const handleAddSupplementToDay = (item: ProteinoceanSupplement) => {
    const mult = getMultiplier(item.id);
    const cal = Math.round(item.calories * mult);
    const p = Math.round(item.protein * mult);
    const c = Math.round(item.carbs * mult);
    const f = Math.round(item.fats * mult);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMeal: MealItem = {
      id: `sup-log-${Date.now()}`,
      name: `${item.name} (${mult !== 1 ? `${mult}x ` : ''}${item.serving})`,
      time: timeStr,
      protein: p,
      carbs: c,
      fats: f,
      calories: cal,
      description: `Proteinocean Takviyesi • ${item.caloriesDisplay}${item.caffeineMg ? ` • ${item.caffeineMg * mult}mg Kafein` : ''}`,
      completed: true,
    };

    const updated: DailyNutrition = {
      ...nutrition,
      energyKcal: nutrition.energyKcal + cal,
      proteinGrams: nutrition.proteinGrams + p,
      carbsGrams: nutrition.carbsGrams + c,
      fatsGrams: nutrition.fatsGrams + f,
      meals: [newMeal, ...(nutrition.meals || [])],
    };

    onUpdateNutrition(updated);
    setToastMessage(`✓ ${item.name} (+${cal} kcal, +${p}g P) günlük kalorinize eklendi!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-lg bg-[#1A1C24] border border-[#262936] rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#262936] bg-[#14151C] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 text-white flex items-center justify-center shadow-md shadow-red-900/40">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-black text-[#FF5356] uppercase tracking-wider font-mono">
                  PROTEINOCEAN
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                  29 TAKVİYE
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white">
                Gıda Takviyeleri & Kalori Listesi
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

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-[#262936] bg-[#121317] space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-[#A0A5B5] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Takviye adı ara (Whey, Isolate, Kreatin, Kafein, BCAA...)"
              className="w-full h-10 pl-9 pr-4 bg-[#1F1F24] border border-[#262936] rounded-xl text-xs text-white placeholder-[#5A6072] focus:outline-none focus:border-[#FF1E38]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#A0A5B5] hover:text-white"
              >
                Temizle
              </button>
            )}
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-[#FF1E38] text-white shadow-sm'
                    : 'bg-[#1F1F24] border border-[#262936] text-[#A0A5B5] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Supplements List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#A0A5B5] text-xs">
              Aramanıza uygun gıda takviyesi bulunamadı.
            </div>
          ) : (
            filtered.map((item) => {
              const mult = getMultiplier(item.id);
              const currentCal = Math.round(item.calories * mult);
              const currentProtein = Math.round(item.protein * mult);

              return (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-[#1F1F24] border border-[#262936] hover:border-[#383A47] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl select-none shrink-0 mt-0.5">
                      {item.emoji}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-bold text-white">
                          {item.name}
                        </h4>
                        <span className="text-[10px] font-mono text-[#A0A5B5] bg-[#121317] px-1.5 py-0.5 rounded border border-[#262936]">
                          {item.serving}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="text-[11px] font-black font-mono text-[#FF5356] bg-red-950/40 px-2 py-0.5 rounded border border-red-900/30">
                          {currentCal} kcal
                        </span>
                        {item.protein > 0 && (
                          <span className="text-[10px] font-bold text-amber-300 font-mono bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-900/30">
                            +{currentProtein}g Protein
                          </span>
                        )}
                        {item.caffeineMg && (
                          <span className="text-[10px] font-bold text-purple-300 font-mono bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-900/30">
                            ⚡ {item.caffeineMg * mult}mg Kafein
                          </span>
                        )}
                        <span className="text-[10px] text-[#A0A5B5]">
                          {item.caloriesDisplay}
                        </span>
                      </div>
                      {item.note && (
                        <p className="text-[10px] text-[#A0A5B5] mt-1 leading-snug">
                          {item.note} {item.timeWindow ? `• Zaman: ${item.timeWindow}` : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions: Multiplier & Add Button */}
                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    {/* Portion multiplier buttons */}
                    <div className="flex items-center bg-[#121317] rounded-lg border border-[#262936] p-0.5 text-[10px] font-mono">
                      {[1, 2].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMultiplier(item.id, m)}
                          className={`px-2 py-0.5 rounded ${
                            mult === m
                              ? 'bg-[#FF1E38] text-white font-bold'
                              : 'text-[#A0A5B5] hover:text-white'
                          }`}
                        >
                          {m}x
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddSupplementToDay(item)}
                      className="px-3 py-1.5 rounded-xl bg-[#FF1E38] hover:bg-[#FF334B] text-white font-bold text-xs flex items-center space-x-1 shadow-md shadow-[#FF1E38]/20 transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Kaloriye Ekle</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Summary */}
        <div className="p-3 border-t border-[#262936] bg-[#14151C] flex items-center justify-between text-xs">
          <div className="text-[#A0A5B5] text-[11px]">
            Bugünkü Alınan: <strong className="text-white font-mono">{nutrition.energyKcal} kcal</strong> • <strong className="text-[#FF5356] font-mono">{nutrition.proteinGrams}g Protein</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#292A2E] hover:bg-[#343439] text-white font-bold text-xs transition-colors"
          >
            Kapat
          </button>
        </div>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="absolute bottom-16 left-4 right-4 z-50 animate-bounce">
            <div className="bg-[#1A1C24] border border-[#FF1E38] text-white p-2.5 rounded-xl shadow-2xl flex items-center justify-center space-x-2 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#FF5356]" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
