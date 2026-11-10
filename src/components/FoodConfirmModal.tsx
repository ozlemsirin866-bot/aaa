import React, { useState } from 'react';
import { X, Check, Flame, Plus, Minus, Clock, Utensils, Info } from 'lucide-react';
import { PopularFood } from '../data/popularFoodsData';
import { MealItem } from '../types/fitness';

interface FoodConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  food: PopularFood | null;
  onConfirmAddMeal: (meal: MealItem) => void;
}

export const FoodConfirmModal: React.FC<FoodConfirmModalProps> = ({
  isOpen,
  onClose,
  food,
  onConfirmAddMeal,
}) => {
  const [portionMultiplier, setPortionMultiplier] = useState<number>(1.0);
  const [mealTime, setMealTime] = useState<string>(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [note, setNote] = useState<string>('');

  if (!isOpen || !food) return null;

  const currentCalories = Math.round(food.calories * portionMultiplier);
  const currentProtein = Math.round(food.protein * portionMultiplier * 10) / 10;
  const currentCarbs = Math.round(food.carbs * portionMultiplier * 10) / 10;
  const currentFats = Math.round(food.fats * portionMultiplier * 10) / 10;

  const handleConfirm = () => {
    const portionText =
      portionMultiplier === 1.0
        ? '1 Porsiyon'
        : portionMultiplier === 0.5
        ? 'Yarım (0.5) Porsiyon'
        : portionMultiplier === 1.5
        ? '1.5 Büyük Porsiyon'
        : `${portionMultiplier}x Çift Porsiyon`;

    const description = `${food.portionLabel} (${portionText})${note.trim() ? ` • Not: ${note.trim()}` : ''}`;

    const newMeal: MealItem = {
      id: `food-${food.id}-${Date.now()}`,
      name: `${food.name} (${portionMultiplier}x)`,
      time: mealTime || '12:00',
      protein: currentProtein,
      carbs: currentCarbs,
      fats: currentFats,
      calories: currentCalories,
      description: description,
      completed: true,
    };

    onConfirmAddMeal(newMeal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#161720] border border-[#262936] rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl text-white select-none">
        {/* Mobile handle indicator */}
        <div className="w-12 h-1 bg-[#343439] rounded-full mx-auto mb-4 sm:hidden" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-[#222430] text-[#A0A5B5] hover:text-white flex items-center justify-center transition-colors border border-[#2D3142]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Food Header Card */}
        <div className="flex items-start space-x-3.5 pr-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2A2B38] to-[#1E1F2A] border border-[#3A3D52] flex items-center justify-center text-3xl shadow-md shrink-0">
            {food.emoji}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-red-950/60 border border-red-800/40 text-red-400 font-mono">
                {food.category}
              </span>
            </div>
            <h3 className="text-lg font-black text-white mt-1 leading-snug">
              {food.name}
            </h3>
            <p className="text-xs text-[#A0A5B5] mt-0.5">
              {food.portionLabel}
            </p>
          </div>
        </div>

        {/* Portion Selector Buttons */}
        <div className="mt-4 p-3.5 rounded-xl bg-[#111218] border border-[#262936] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#A0A5B5] flex items-center space-x-1.5">
              <Utensils className="w-3.5 h-3.5 text-[#FF5356]" />
              <span>Porsiyon Tercihi:</span>
            </span>
            <span className="text-xs font-mono font-bold text-white">
              {portionMultiplier}x Çarpan
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '0.5x', sub: 'Yarım', val: 0.5 },
              { label: '1.0x', sub: 'Standart', val: 1.0 },
              { label: '1.5x', sub: 'Büyük', val: 1.5 },
              { label: '2.0x', sub: 'Doyurucu', val: 2.0 },
            ].map((p) => {
              const isSelected = portionMultiplier === p.val;
              return (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setPortionMultiplier(p.val)}
                  className={`py-2 px-1 rounded-xl text-center border transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#FF1E38] to-[#D8182E] border-[#FF5356] text-white shadow-md shadow-[#FF1E38]/20'
                      : 'bg-[#181A22] border-[#2A2D3C] text-[#A0A5B5] hover:text-white hover:border-[#3E4256]'
                  }`}
                >
                  <span className="block text-xs font-black font-mono">{p.label}</span>
                  <span className="block text-[9px] opacity-80">{p.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Calculated Nutrition Telemetry */}
        <div className="mt-3.5 p-4 rounded-xl bg-gradient-to-br from-[#1C1618] via-[#1B1922] to-[#121319] border border-red-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-[#FF5356]" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Günün Kalorisine Eklenecek:
              </span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-white font-mono tracking-tight tabular-nums text-red-400">
                +{currentCalories}
              </span>
              <span className="text-xs font-bold text-[#A0A5B5] font-mono">kcal</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-[#2D3040]">
            <div className="p-2 rounded-lg bg-[#111218] border border-[#262936]">
              <span className="text-[10px] text-[#FF5356] font-extrabold uppercase block">
                Protein
              </span>
              <span className="text-sm font-black text-white font-mono block mt-0.5">
                +{currentProtein}g
              </span>
            </div>

            <div className="p-2 rounded-lg bg-[#111218] border border-[#262936]">
              <span className="text-[10px] text-amber-400 font-extrabold uppercase block">
                Karbonhidrat
              </span>
              <span className="text-sm font-black text-white font-mono block mt-0.5">
                +{currentCarbs}g
              </span>
            </div>

            <div className="p-2 rounded-lg bg-[#111218] border border-[#262936]">
              <span className="text-[10px] text-blue-400 font-extrabold uppercase block">
                Yağ
              </span>
              <span className="text-sm font-black text-white font-mono block mt-0.5">
                +{currentFats}g
              </span>
            </div>
          </div>
        </div>

        {/* Meal Time & Note */}
        <div className="mt-3.5 grid grid-cols-3 gap-2">
          <div className="relative">
            <label className="text-[10px] text-[#A0A5B5] font-bold block mb-1">Öğün Saati</label>
            <div className="relative">
              <input
                type="text"
                value={mealTime}
                onChange={(e) => setMealTime(e.target.value)}
                placeholder="13:30"
                className="w-full h-8 px-2.5 bg-[#111218] border border-[#262936] rounded-lg text-xs text-white font-mono text-center"
              />
            </div>
          </div>

          <div className="col-span-2">
            <label className="text-[10px] text-[#A0A5B5] font-bold block mb-1">Özel Not (Opsiyonel)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Örn: Antrenmandan 1 saat sonra"
              className="w-full h-8 px-2.5 bg-[#111218] border border-[#262936] rounded-lg text-xs text-white placeholder-[#5A6072]"
            />
          </div>
        </div>

        <div className="mt-2.5 flex items-center space-x-1.5 text-[11px] text-[#A0A5B5] bg-[#111218] p-2 rounded-lg border border-[#262936]/60">
          <Info className="w-3.5 h-3.5 text-[#FF5356] shrink-0" />
          <span>Onayladığınızda bugünkü toplam kalori ve makro bütçenize anında yansır.</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl bg-[#1A1C24] hover:bg-[#222530] text-[#A0A5B5] hover:text-white font-bold text-xs border border-[#2C3040] transition-all"
          >
            Vazgeç
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="h-11 rounded-xl bg-gradient-to-r from-[#FF1E38] to-[#E6142E] hover:from-[#FF334B] hover:to-[#FF1E38] text-white font-black text-xs shadow-lg shadow-[#FF1E38]/25 flex items-center justify-center space-x-2 transition-all active:scale-95"
          >
            <Check className="w-4 h-4 stroke-[3px]" />
            <span>Onayla & Kaloriye Ekle</span>
          </button>
        </div>
      </div>
    </div>
  );
};
