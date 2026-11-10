import React, { useState } from 'react';
import { X, Layers, Flame, Check, Info } from 'lucide-react';
import { EXERCISES_DATA } from '../data/mockData';
import { Exercise } from '../types/fitness';

interface FullBodyMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

export const FullBodyMatrixModal: React.FC<FullBodyMatrixModalProps> = ({
  isOpen,
  onClose,
  onSelectExercise,
}) => {
  const [selectedMuscle, setSelectedMuscle] = useState<string>('Göğüs');

  if (!isOpen) return null;

  const muscleDivisions = [
    { id: 'Göğüs', label: 'Göğüs', count: 6, prime: 'Pectoralis Major' },
    { id: 'Sırt/Lat', label: 'Sırt & Lats', count: 6, prime: 'Latissimus Dorsi' },
    { id: 'Omuz', label: 'Omuz (3 Baş)', count: 5, prime: 'Deltoideus' },
    { id: 'Bacak', label: 'Bacak & Glute', count: 6, prime: 'Quadriceps / Hamstrings' },
    { id: 'Triceps', label: 'Triceps', count: 3, prime: 'Triceps Brachii' },
    { id: 'Karın', label: 'Core & Karın', count: 4, prime: 'Rectus Abdominis' },
  ];

  const filteredExercises = EXERCISES_DATA.filter((ex) =>
    selectedMuscle === 'Göğüs' ? ex.anatomyRegion === 'Göğüs' :
    selectedMuscle === 'Sırt/Lat' ? ex.anatomyRegion === 'Sırt/Lat' :
    selectedMuscle === 'Omuz' ? ex.anatomyRegion === 'Omuz' :
    selectedMuscle === 'Bacak' ? ex.anatomyRegion === 'Bacak' :
    selectedMuscle === 'Triceps' ? ex.anatomyRegion === 'Triceps' :
    ex.anatomyRegion === 'Karın'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#1A1C24] border border-[#262936] rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Modal Bar */}
        <div className="p-4 border-b border-[#262936] flex items-center justify-between shrink-0 bg-[#121317]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF1E38]/20 text-[#FF5356] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#FF5356] uppercase tracking-wider block">BİYOMEKANİK AKTİVASYON</span>
              <h3 className="text-base font-extrabold text-white">Tam Vücut Aktivasyon Matrisi</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#292A2E] text-[#A0A5B5] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Anatomical Region Selector Tabs */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {muscleDivisions.map((division) => (
              <button
                key={division.id}
                onClick={() => setSelectedMuscle(division.id)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedMuscle === division.id
                    ? 'bg-[#FF1E38] border-[#FF1E38] text-white shadow-lg shadow-[#FF1E38]/25'
                    : 'bg-[#121317] border-[#262936] text-[#A0A5B5] hover:text-white hover:border-[#343439]'
                }`}
              >
                <span className="text-xs font-bold block truncate">{division.label}</span>
                <span className="text-[10px] opacity-75 font-mono">{division.count} Form</span>
              </button>
            ))}
          </div>

          {/* Interactive Visual Biomechanical Muscle Matrix Overview */}
          <div className="p-4 rounded-xl bg-[#0D0E12] border border-[#262936] relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-[#FF5356]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Bölgesel Hipertrofi Vektör Analizi: {selectedMuscle}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#FF1E38]/20 text-[#FF5356] text-[10px] font-bold border border-[#FF1E38]/40">
                PPL + CORE TELEMETRY
              </span>
            </div>

            <p className="text-xs text-[#A0A5B5] leading-relaxed">
              Bu bölgedeki hareketler, kas liflerinin oryantasyon açısına göre seçilmiştir. Her egzersiz mekanik gerilim, esneme altında yüklenme ve sakatlanma önleme faktörlerine göre puanlanmıştır.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-[#262936] text-center">
              <div className="p-2 rounded-lg bg-[#1A1C24]">
                <span className="text-[10px] text-[#A0A5B5] block uppercase">Primer Kas</span>
                <span className="text-xs font-bold text-[#FF5356] truncate block mt-0.5">
                  {selectedMuscle === 'Göğüs' ? 'Pectoralis Major' : selectedMuscle === 'Sırt/Lat' ? 'Latissimus Dorsi' : 'Deltoideus'}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[#1A1C24]">
                <span className="text-[10px] text-[#A0A5B5] block uppercase">Önerilen RPE</span>
                <span className="text-xs font-bold text-white font-mono block mt-0.5">8 - 9.5</span>
              </div>
              <div className="p-2 rounded-lg bg-[#1A1C24]">
                <span className="text-[10px] text-[#A0A5B5] block uppercase">Optimal Frekans</span>
                <span className="text-xs font-bold text-white block mt-0.5">2x / Hafta</span>
              </div>
              <div className="p-2 rounded-lg bg-[#1A1C24]">
                <span className="text-[10px] text-[#A0A5B5] block uppercase">Kritik Açı</span>
                <span className="text-xs font-bold text-[#FF5356] font-mono block mt-0.5">45° - 75°</span>
              </div>
            </div>
          </div>

          {/* Filtered Exercise Cards */}
          <div>
            <h4 className="text-xs font-bold text-[#A0A5B5] uppercase tracking-wider mb-2">
              Seçili Bölge Egzersizleri ({filteredExercises.length})
            </h4>
            <div className="space-y-2">
              {filteredExercises.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => {
                    onSelectExercise(ex);
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-[#121317] hover:bg-[#1A1C24] border border-[#262936] hover:border-[#FF1E38]/50 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-[#292A2E] text-[#FF5356] flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#FF1E38] group-hover:text-white transition-colors">
                      {ex.setupAngle.slice(0, 3)}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white group-hover:text-[#FF5356] transition-colors">
                        {ex.name}
                      </h5>
                      <p className="text-[11px] text-[#A0A5B5]">
                        {ex.targetMuscle} • {ex.equipment}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 rounded bg-[#292A2E] text-[11px] font-bold text-[#A0A5B5] font-mono">
                      RPE {ex.rpe}
                    </span>
                    <button className="px-3 py-1.5 rounded-lg bg-[#FF1E38] text-white text-xs font-bold flex items-center space-x-1">
                      <span>İncele</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#262936] bg-[#121317] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#292A2E] text-white text-xs font-bold hover:bg-[#343439] transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
