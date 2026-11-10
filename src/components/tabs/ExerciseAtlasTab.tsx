import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Bookmark,
  Heart,
  Plus,
  Play,
  AlertTriangle,
  Flame,
  Dumbbell,
  Shield,
  Layers,
  ChevronRight,
  Maximize2,
  Sparkles,
  TrendingUp,
  Eye,
  CheckCircle2,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { Exercise } from '../../types/fitness';
import { EXERCISES_DATA, HOTLINK_IMAGE_URL } from '../../data/mockData';
import { BiomechanicDiagram } from '../BiomechanicDiagram';

interface ExerciseAtlasTabProps {
  onOpenExerciseDetail: (exercise: Exercise) => void;
  onOpenMatrixModal: () => void;
  onAddExerciseToWorkout: (exercise: Exercise) => void;
}

export const ExerciseAtlasTab: React.FC<ExerciseAtlasTabProps> = ({
  onOpenExerciseDetail,
  onOpenMatrixModal,
  onAddExerciseToWorkout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('POPULER');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('TÜMÜ');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'name' | 'rpe'>('popular');

  const popularCount = useMemo(() => EXERCISES_DATA.filter((e) => e.isPopular).length, []);

  const categories = [
    { id: 'POPULER', label: `🔥 EN POPÜLER (${popularCount})`, isSpecial: true },
    { id: 'TÜMÜ', label: `TÜMÜ (${EXERCISES_DATA.length})` },
    { id: 'İtiş (Push)', label: 'İTİŞ (PUSH)' },
    { id: 'Çekiş (Pull)', label: 'ÇEKİŞ (PULL)' },
    { id: 'Bacak (Legs)', label: 'BACAK (LEGS)' },
    { id: 'Core / Karın', label: 'CORE / KARIN' },
  ];

  const equipments = ['TÜMÜ', 'HALTER', 'DAMBIL', 'KABLO / MAKİNE', 'VÜCUT AĞIRLIĞI'];

  const quickRegions = [
    { id: 'Göğüs', label: 'GÖĞÜS (15)', icon: '⚡' },
    { id: 'Omuz', label: 'OMUZ (19)', icon: '🛡️' },
    { id: 'Bacak', label: 'BACAK (15)', icon: '🦵' },
    { id: 'Karın', label: 'KARIN / BEL (13)', icon: '🎯' },
    { id: 'Sırt/Lat', label: 'SIRT / KANAT (10)', icon: '🦅' },
    { id: 'Biceps', label: 'BİCEPS / PAZU (13)', icon: '🦾' },
    { id: 'Triceps', label: 'TRİCEPS / ARKA KOL (11)', icon: '💪' },
  ];

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = (ex: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddExerciseToWorkout(ex);
    setAddedToast(`"${ex.name}" antrenman seansınıza eklendi!`);
    setTimeout(() => setAddedToast(null), 2500);
  };

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return EXERCISES_DATA.filter((ex) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ex.name.toLowerCase().includes(q) ||
        ex.targetMuscle.toLowerCase().includes(q) ||
        ex.anatomyRegion.toLowerCase().includes(q) ||
        ex.equipment.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === 'TÜMÜ'
          ? true
          : selectedCategory === 'POPULER'
          ? !!ex.isPopular
          : ex.category === selectedCategory;

      const matchesEquipment =
        selectedEquipment === 'TÜMÜ' ||
        ex.equipment.toUpperCase().includes(selectedEquipment.toUpperCase());

      const matchesRegion =
        !selectedRegion || ex.anatomyRegion === selectedRegion;

      return matchesSearch && matchesCategory && matchesEquipment && matchesRegion;
    }).sort((a, b) => {
      if (sortBy === 'popular') {
        // rank by popularityRank or popular flag then views
        const aPop = a.popularityRank ?? (a.isPopular ? 10 : 99);
        const bPop = b.popularityRank ?? (b.isPopular ? 10 : 99);
        return aPop - bPop;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'rpe') {
        return parseFloat(b.rpe || '0') - parseFloat(a.rpe || '0');
      }
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedEquipment, selectedRegion, sortBy]);

  const getDiagramType = (id: string): 'bench-press' | 'incline-press' | 'seated-row' | 'lateral-raise' | 'rdl' | 'pushdown' | 'crunch' => {
    if (id.includes('incline')) return 'incline-press';
    if (id.includes('bench') || id.includes('fly') || id.includes('press') && !id.includes('leg')) return 'bench-press';
    if (id.includes('row') || id.includes('pull') || id.includes('lat')) return 'seated-row';
    if (id.includes('lateral') || id.includes('face') || id.includes('shoulder') || id.includes('overhead')) return 'lateral-raise';
    if (id.includes('deadlift') || id.includes('rdl') || id.includes('squat') || id.includes('leg')) return 'rdl';
    if (id.includes('pushdown') || id.includes('triceps') || id.includes('skull') || id.includes('curl') || id.includes('dips')) return 'pushdown';
    if (id.includes('crunch') || id.includes('plank') || id.includes('raise')) return 'crunch';
    return 'bench-press';
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('POPULER');
    setSelectedEquipment('TÜMÜ');
    setSelectedRegion(null);
  };

  return (
    <div className="space-y-4 pb-28 select-none">
      {/* 1. Header Banner */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-[11px] font-extrabold text-[#FF5356] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#FF1E38] animate-pulse" />
            <span>BİYOMEKANİK FORM ATLASI & EGZERSİZ REHBERİ</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF1E38]/20 text-[#FF5356] font-bold border border-[#FF1E38]/30">
            {EXERCISES_DATA.length} HAREKET
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          EGZERSİZ REHBERİ
        </h2>
        <p className="text-xs text-[#A0A5B5] leading-relaxed">
          Kas aktivasyon açıları, form detayları ve sakatlanma önleme rehberi.
        </p>
      </div>

      {/* 2. Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#A0A5B5] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Egzersiz adı, hedef kas veya ekipman ara (örn: Bench, Squat, Omuz)..."
          className="w-full h-12 pl-10 pr-20 bg-[#1F1F24] border border-[#262936] rounded-xl text-sm text-white placeholder-[#5A6072] focus:outline-none focus:border-[#FF1E38] transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs bg-[#292A2E] px-2 py-1 rounded text-[#A0A5B5] hover:text-white"
          >
            Temizle
          </button>
        )}
      </div>

      {/* 4. Quick Category Filter Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                isSelected
                  ? 'bg-[#FF1E38] text-white shadow-md shadow-[#FF1E38]/20 scale-[1.02]'
                  : cat.isSpecial
                  ? 'bg-[#FF1E38]/15 border border-[#FF1E38]/40 text-[#FF5356] hover:bg-[#FF1E38]/25'
                  : 'bg-[#1F1F24] border border-[#262936] text-[#A0A5B5] hover:text-white'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 5. Quick Muscle Region Filter Horizontal Chips */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-bold text-[#A0A5B5] uppercase">
          <span>KAS BÖLGESİ FİLTRESİ:</span>
          {selectedRegion && (
            <button
              onClick={() => setSelectedRegion(null)}
              className="text-[#FF5356] hover:underline cursor-pointer"
            >
              Tüm Bölgeleri Göster (Sıfırla)
            </button>
          )}
        </div>
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedRegion(null)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
              selectedRegion === null
                ? 'bg-white text-black font-extrabold shadow-sm'
                : 'bg-[#121317] border border-[#262936] text-[#A0A5B5] hover:text-white'
            }`}
          >
            TÜMÜ
          </button>
          {quickRegions.map((r) => {
            const isSelected = selectedRegion === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(isSelected ? null : r.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-[#FF1E38] text-white shadow-md shadow-[#FF1E38]/20'
                    : 'bg-[#121317] border border-[#262936] text-[#A0A5B5] hover:text-white hover:border-[#343439]'
                }`}
              >
                <span>{r.icon}</span>
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Equipment Filter Buttons & Sort Dropdown */}
      <div className="flex items-center justify-between gap-2 text-xs text-[#A0A5B5]">
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none">
          <span className="font-bold text-[10px] uppercase text-[#5A6072] shrink-0 mr-1">
            EKİPMAN:
          </span>
          {equipments.map((eq) => (
            <button
              key={eq}
              onClick={() => setSelectedEquipment(eq)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors whitespace-nowrap ${
                selectedEquipment === eq
                  ? 'bg-[#343439] text-white border border-[#FF1E38]'
                  : 'bg-[#121317] border border-[#262936] text-[#A0A5B5] hover:text-white'
              }`}
            >
              {eq}
            </button>
          ))}
        </div>

        {/* Sort Selector */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-[#121317] border border-[#262936] text-white text-[11px] rounded-lg px-2 py-1 focus:outline-none focus:border-[#FF1E38] shrink-0"
        >
          <option value="popular">🔥 En Popüler</option>
          <option value="name">Alfabetik (A-Z)</option>
          <option value="rpe">Zorluk (RPE)</option>
        </select>
      </div>

      {/* Active Filter State Notice Banner */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1A1C24] border border-[#262936] text-xs">
        <div className="flex items-center space-x-2">
          {selectedCategory === 'POPULER' ? (
            <div className="flex items-center space-x-1.5 text-[#FF5356] font-bold">
              <Flame className="w-4 h-4 fill-[#FF1E38] text-[#FF1E38]" />
              <span>En Popüler Egzersizler Gösteriliyor</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-white font-bold">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#A0A5B5]" />
              <span>Filtrelenen: {filteredExercises.length} egzersiz</span>
            </div>
          )}
          {selectedRegion && (
            <span className="px-2 py-0.5 rounded bg-[#FF1E38]/20 text-[#FF5356] text-[10px] font-mono font-bold">
              {selectedRegion}
            </span>
          )}
        </div>
        {(selectedRegion || selectedEquipment !== 'TÜMÜ' || searchQuery || selectedCategory !== 'POPULER') && (
          <button
            onClick={handleResetFilters}
            className="text-[11px] text-[#A0A5B5] hover:text-white flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Sıfırla</span>
          </button>
        )}
      </div>

      {/* 7. Tam Vücut Aktivasyon Matrisi Banner */}
      <div
        onClick={onOpenMatrixModal}
        className="rounded-2xl bg-gradient-to-r from-[#1A1C24] to-[#121317] border border-[#FF1E38]/40 p-4 shadow-xl cursor-pointer hover:border-[#FF1E38] transition-all group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#FF1E38] animate-ping" />
            <span className="text-[11px] font-extrabold text-[#FF5356] uppercase tracking-wider">
              TAM VÜCUT AKTİVASYON MATRİSİ
            </span>
          </div>
          <button className="px-2.5 py-1 rounded-lg bg-[#292A2E] text-white text-[10px] font-bold flex items-center space-x-1 group-hover:bg-[#FF1E38] transition-colors">
            <Maximize2 className="w-3 h-3" />
            <span>İNCELE</span>
          </button>
        </div>

        <h3 className="text-base font-extrabold text-white">
          Biyomekanik Form Atlası (32+ Hareket)
        </h3>

        {/* Matrix Preview Diagram */}
        <div className="relative aspect-[21/9] rounded-xl overflow-hidden mt-3 border border-[#262936] bg-[#0D0E12] flex items-center justify-center p-2">
          <BiomechanicDiagram type="bench-press" showLabels={false} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E12] via-transparent to-transparent" />
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white font-mono">
            <span className="bg-[#FF1E38] px-2 py-0.5 rounded font-bold">PPL + CORE + OMUZ</span>
            <span className="text-[#A0A5B5]">Detaylı Vektör & Açı Analizleri</span>
            <span className="bg-[#1A1C24] px-1.5 py-0.5 rounded border border-[#262936]">Aktivasyon %</span>
          </div>
        </div>
      </div>

      {/* 8. Detailed Exercise Cards List */}
      <div className="space-y-4">
        {filteredExercises.length === 0 ? (
          <div className="rounded-2xl bg-[#1F1F24] border border-[#262936] p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-[#FF5356] flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Eşleşen Egzersiz Bulunamadı</h4>
            <p className="text-xs text-[#A0A5B5] max-w-xs mx-auto">
              Arama kriterlerinize veya seçilen filtrelere uygun egzersiz bulunamadı. Popüler egzersizlere dönmek için filtreleri temizleyin.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2.5 rounded-xl bg-[#FF1E38] text-white text-xs font-bold inline-flex items-center space-x-1.5 shadow-md shadow-[#FF1E38]/20"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>En Popüler Egzersizleri Listele</span>
            </button>
          </div>
        ) : (
          filteredExercises.map((ex, idx) => {
            const isFav = !!favorites[ex.id];
            return (
              <div
                key={ex.id}
                onClick={() => onOpenExerciseDetail(ex)}
                className="rounded-2xl bg-[#1F1F24] border border-[#262936] overflow-hidden shadow-sm hover:border-[#FF1E38]/60 transition-all cursor-pointer group"
              >
                {/* Card Image / Biomechanic Render Banner */}
                <div className="relative aspect-video w-full bg-[#0D0E12]">
                  <BiomechanicDiagram type={getDiagramType(ex.id)} showLabels={true} />

                  {/* Top Badge Strip */}
                  <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                    {ex.isPopular && (
                      <span className="px-2 py-0.5 rounded bg-gradient-to-r from-amber-500 to-red-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 shadow-md">
                        <Flame className="w-3 h-3 fill-white" />
                        <span>POPÜLER</span>
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-[#FF1E38] text-white text-[10px] font-extrabold uppercase tracking-wider">
                      {ex.category.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#121317]/90 backdrop-blur-sm text-white text-[10px] font-bold border border-[#262936]">
                      {ex.equipment}
                    </span>
                  </div>

                  {/* Favorite Heart Button */}
                  <button
                    onClick={(e) => toggleFav(ex.id, e)}
                    aria-label="Favori"
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-lg bg-[#121317]/80 backdrop-blur-sm flex items-center justify-center text-white hover:text-[#FF5356] border border-[#262936] transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${isFav ? 'fill-[#FF1E38] text-[#FF1E38]' : ''}`}
                    />
                  </button>

                  {/* Click to open badge */}
                  <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-2.5 py-1 rounded-lg bg-[#FF1E38] text-white text-[10px] font-bold shadow-lg flex items-center space-x-1">
                      <Play className="w-3 h-3 fill-white" />
                      <span>Formu İncele</span>
                    </span>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-4 space-y-3">
                  {/* Title & RPE */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-extrabold text-white tracking-tight group-hover:text-[#FF5356] transition-colors">
                          {ex.name}
                        </h3>
                      </div>
                      <p className="text-xs text-[#A0A5B5] mt-0.5">
                        {ex.descriptionPurpose}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded bg-[#292A2E] text-[11px] font-bold text-[#FF5356] font-mono shrink-0 ml-2 border border-[#343439]">
                      RPE {ex.rpe}
                    </span>
                  </div>

                  {/* Primary / Secondary Target Cues */}
                  <div className="space-y-1 text-xs bg-[#121317] p-2.5 rounded-xl border border-[#262936]">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-extrabold text-[#FF5356] uppercase tracking-wider shrink-0">
                        HEDEF KAS:
                      </span>
                      <span className="font-bold text-white uppercase truncate">
                        {ex.targetMuscle}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-[#A0A5B5]">
                      <span className="text-[10px] font-bold uppercase shrink-0">
                        DESTEKÇİ:
                      </span>
                      <span className="truncate">{ex.synergistMuscles}</span>
                    </div>
                  </div>

                  {/* Cues Preview (First cue) */}
                  {ex.cues && ex.cues.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-[#16171D] border border-[#262936] flex items-start space-x-2 text-xs">
                      <span className="w-5 h-5 rounded-full bg-[#FF1E38]/20 text-[#FF5356] flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                        1
                      </span>
                      <div>
                        <strong className="text-white font-bold">{ex.cues[0].title}: </strong>
                        <span className="text-[#A0A5B5]">{ex.cues[0].description}</span>
                      </div>
                    </div>
                  )}

                  {/* Kritik Hata Callout */}
                  <div className="p-2.5 rounded-xl bg-[#93000A]/20 border border-[#93000A]/40 flex items-start space-x-2 text-xs">
                    <AlertTriangle className="w-4 h-4 text-[#FFB4AB] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#E3E2E8]">
                      <strong className="text-[#FFB4AB] font-bold">Kritik Hata: </strong>
                      {ex.criticalMistake}
                    </p>
                  </div>

                  {/* Card Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={(e) => handleAdd(ex, e)}
                      className="h-11 rounded-xl bg-[#FF1E38] hover:bg-[#FF334B] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-md shadow-[#FF1E38]/20 transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4 stroke-[3px]" />
                      <span>LİSTEME EKLE</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenExerciseDetail(ex);
                      }}
                      className="h-11 rounded-xl bg-[#292A2E] hover:bg-[#343439] hover:border-[#FF1E38] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 border border-[#343439] transition-all active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-[#FF1E38] text-[#FF1E38]" />
                      <span>DETAY & FORM</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50 animate-bounce">
          <div className="bg-[#1A1C24] border border-[#FF1E38] text-white p-3 rounded-xl shadow-2xl flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#FF5356]" />
            <span className="text-xs font-bold">{addedToast}</span>
          </div>
        </div>
      )}
    </div>
  );
};
