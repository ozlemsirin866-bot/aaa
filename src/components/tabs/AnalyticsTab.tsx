import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Flame,
  Droplet,
  Dumbbell,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
  Trash2,
  Plus,
  Activity,
  Layers,
  Sparkles,
  PieChart,
  BarChart3,
  Filter,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { DailyHistoryRecord, DailyNutrition } from '../../types/fitness';

interface AnalyticsTabProps {
  history: DailyHistoryRecord[];
  currentNutrition: DailyNutrition;
  onDeleteHistoryRecord: (id: string) => void;
  onAddManualRecord: (record: DailyHistoryRecord) => void;
  onOpenFinishDayModal: () => void;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  history,
  currentNutrition,
  onDeleteHistoryRecord,
  onAddManualRecord,
  onOpenFinishDayModal,
}) => {
  // Timeframe filter: '7d' | '14d' | '30d' | 'all'
  const [timeframe, setTimeframe] = useState<'7d' | '14d' | '30d' | 'all'>('7d');
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form state for adding manual record
  const [manualForm, setManualForm] = useState<{
    date: string;
    energyKcal: number;
    proteinGrams: number;
    carbsGrams: number;
    fatsGrams: number;
    waterLiters: number;
    workoutTitle: string;
    notes: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    energyKcal: 2500,
    proteinGrams: 175,
    carbsGrams: 280,
    fatsGrams: 65,
    waterLiters: 3.5,
    workoutTitle: 'Özel Antrenman',
    notes: '',
  });

  // Filter records by timeframe
  const filteredRecords = useMemo(() => {
    let sorted = [...history].sort((a, b) => b.timestamp - a.timestamp);

    if (timeframe === '7d') {
      sorted = sorted.slice(0, 7);
    } else if (timeframe === '14d') {
      sorted = sorted.slice(0, 14);
    } else if (timeframe === '30d') {
      sorted = sorted.slice(0, 30);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      sorted = sorted.filter(
        (r) =>
          r.date.toLowerCase().includes(q) ||
          r.dayName.toLowerCase().includes(q) ||
          (r.workoutTitle && r.workoutTitle.toLowerCase().includes(q)) ||
          (r.notes && r.notes.toLowerCase().includes(q))
      );
    }

    return sorted;
  }, [history, timeframe, searchQuery]);

  // Aggregate Metrics calculation
  const metrics = useMemo(() => {
    if (filteredRecords.length === 0) {
      return {
        totalKcal: 0,
        avgKcal: 0,
        avgProtein: 0,
        avgCarbs: 0,
        avgFats: 0,
        avgWater: 0,
        totalWorkouts: 0,
        targetDeficitSurplus: 0,
        adherencePercent: 0,
      };
    }

    const count = filteredRecords.length;
    const totalKcal = filteredRecords.reduce((acc, r) => acc + r.energyKcal, 0);
    const totalProtein = filteredRecords.reduce((acc, r) => acc + r.proteinGrams, 0);
    const totalCarbs = filteredRecords.reduce((acc, r) => acc + r.carbsGrams, 0);
    const totalFats = filteredRecords.reduce((acc, r) => acc + r.fatsGrams, 0);
    const totalWater = filteredRecords.reduce((acc, r) => acc + r.hydrationLiters, 0);
    const totalWorkouts = filteredRecords.filter((r) => r.workoutCompleted).length;
    const avgTarget = filteredRecords.reduce((acc, r) => acc + r.energyTarget, 0) / count;

    const avgKcal = Math.round(totalKcal / count);
    const avgProtein = Math.round(totalProtein / count);
    const avgCarbs = Math.round(totalCarbs / count);
    const avgFats = Math.round(totalFats / count);
    const avgWater = Number((totalWater / count).toFixed(1));
    const targetDiff = avgKcal - Math.round(avgTarget);

    // Protein adherence: percentage of days meeting at least 90% of protein target
    const proteinTargetMetDays = filteredRecords.filter(
      (r) => r.proteinGrams >= r.proteinTarget * 0.9
    ).length;
    const adherencePercent = Math.round((proteinTargetMetDays / count) * 100);

    return {
      totalKcal,
      avgKcal,
      avgProtein,
      avgCarbs,
      avgFats,
      avgWater,
      totalWorkouts,
      targetDeficitSurplus: targetDiff,
      adherencePercent,
    };
  }, [filteredRecords]);

  // Export data as JSON / CSV
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `avalanche_beslenme_analizi_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = 'Tarih,Gun,Kalori(kcal),Hedef(kcal),Fark(kcal),Protein(g),Karb(g),Yag(g),Su(L),Antrenman\n';
    const rows = history
      .map(
        (r) =>
          `"${r.date}","${r.dayName}",${r.energyKcal},${r.energyTarget},${r.energyKcal - r.energyTarget},${r.proteinGrams},${r.carbsGrams},${r.fatsGrams},${r.hydrationLiters},"${r.workoutTitle || 'Yok'}"`
      )
      .join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `avalanche_kalori_kayitlari_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    const d = new Date(manualForm.date);
    const dateFormatted = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    const dayNameFormatted = d.toLocaleDateString('tr-TR', { weekday: 'long' });

    const newRec: DailyHistoryRecord = {
      id: `manual-${Date.now()}`,
      date: dateFormatted,
      isoDate: manualForm.date,
      dayName: dayNameFormatted,
      timestamp: d.getTime(),
      energyKcal: manualForm.energyKcal,
      energyTarget: 2600,
      proteinGrams: manualForm.proteinGrams,
      proteinTarget: 180,
      carbsGrams: manualForm.carbsGrams,
      carbsTarget: 290,
      fatsGrams: manualForm.fatsGrams,
      fatsTarget: 70,
      hydrationLiters: manualForm.waterLiters,
      hydrationTarget: 3.5,
      completedMealsCount: 4,
      totalMealsCount: 4,
      meals: [],
      workoutCompleted: !!manualForm.workoutTitle,
      workoutTitle: manualForm.workoutTitle || 'Kayıtlı Antrenman',
      workoutDurationMinutes: 50,
      totalSetsCompleted: 15,
      cardioMinutes: 15,
      notes: manualForm.notes.trim() || undefined,
    };

    onAddManualRecord(newRec);
    setIsManualModalOpen(false);
  };

  // Max calorie for bar chart scaling
  const maxChartKcal = useMemo(() => {
    if (filteredRecords.length === 0) return 3000;
    const maxVal = Math.max(...filteredRecords.map((r) => r.energyKcal), 2800);
    return Math.ceil(maxVal / 500) * 500;
  }, [filteredRecords]);

  return (
    <div className="space-y-4 pb-28 select-none">
      {/* 1. Header Banner & Quick Actions */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1C1D24] via-[#15161C] to-[#121317] border border-[#262936] p-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider font-mono">
                BÜTÜNSEL VERİ ANALİZİ & ARŞİV
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <span>Performans & Kalori İstatistiği</span>
            </h2>
            <p className="text-xs text-[#A0A5B5]">
              Günlük kalori alımı, makro dengesi ve antrenman tutarlılık geçmişiniz.
            </p>
          </div>

          <button
            onClick={onOpenFinishDayModal}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98] shrink-0"
          >
            <span>Günü Bitir</span>
          </button>
        </div>

        {/* Live Today Snapshot Pill */}
        <div className="mt-3.5 pt-3 border-t border-[#262936] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
              CANLI BUGÜN
            </span>
            <span className="text-white font-bold">
              {Math.round(currentNutrition.energyKcal)} / {currentNutrition.energyTarget} kcal
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-mono text-[#A0A5B5]">
            <span>{Math.round(currentNutrition.proteinGrams)}g Protein</span>
            <span>•</span>
            <span>{currentNutrition.hydrationLiters.toFixed(1)}L Su</span>
          </div>
        </div>
      </div>

      {/* 2. Timeframe Filter Chips & Export Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center space-x-1.5 bg-[#181920] p-1 rounded-xl border border-[#262936]">
          {[
            { id: '7d', label: 'Son 7 Gün' },
            { id: '14d', label: '14 Gün' },
            { id: '30d', label: '30 Gün' },
            { id: 'all', label: `Tümü (${history.length})` },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTimeframe(item.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeframe === item.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-[#A0A5B5] hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={() => setIsManualModalOpen(true)}
            title="Manuel Kayıt Ekle"
            className="w-8 h-8 rounded-xl bg-[#181920] border border-[#262936] text-[#A0A5B5] hover:text-white flex items-center justify-center transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportCSV}
            title="CSV Olarak İndir"
            className="w-8 h-8 rounded-xl bg-[#181920] border border-[#262936] text-[#A0A5B5] hover:text-emerald-400 flex items-center justify-center transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportJSON}
            title="JSON Yedek İndir"
            className="w-8 h-8 rounded-xl bg-[#181920] border border-[#262936] text-[#A0A5B5] hover:text-indigo-400 flex items-center justify-center transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Aggregate KPI Grid (Toplam & Ortalama Kalori, Protein, Su, Antrenman) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {/* 1. TOPLAM KALORİ */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#1C1820] to-[#14141A] border border-amber-500/40 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[10px] text-[#A0A5B5] font-bold uppercase">
            <span className="text-amber-400 font-extrabold">Toplam Kalori</span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              {metrics.totalKcal.toLocaleString('tr-TR')}
            </span>
            <span className="text-[10px] text-[#A0A5B5] font-mono">kcal</span>
          </div>
          <span className="text-[10px] text-amber-300/80 font-mono block">
            {filteredRecords.length} günün toplamı
          </span>
        </div>

        {/* 2. ORTALAMA KALORİ */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#1A1C24] to-[#12131A] border border-indigo-500/40 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[10px] text-[#A0A5B5] font-bold uppercase">
            <span className="text-indigo-400 font-extrabold">Ortalama Kalori</span>
            <Flame className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              {metrics.avgKcal.toLocaleString('tr-TR')}
            </span>
            <span className="text-[10px] text-[#A0A5B5] font-mono">kcal/gün</span>
          </div>
          <div className="text-[10px] font-mono flex items-center justify-between text-[#8E94A8]">
            {metrics.targetDeficitSurplus <= 0 ? (
              <span className="text-emerald-400 font-bold">
                {Math.abs(metrics.targetDeficitSurplus)} kcal açıkta
              </span>
            ) : (
              <span className="text-amber-400 font-bold">
                +{metrics.targetDeficitSurplus} kcal fazlada
              </span>
            )}
          </div>
        </div>

        {/* 3. ORTALAMA PROTEİN */}
        <div className="p-3.5 rounded-2xl bg-[#181920] border border-[#262936] space-y-1">
          <div className="flex items-center justify-between text-[10px] text-[#A0A5B5] font-bold uppercase">
            <span>Ort. Protein</span>
            <span className="text-[#FF5356] font-mono font-bold">PRO</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl sm:text-2xl font-black text-white font-mono">
              {metrics.avgProtein}
            </span>
            <span className="text-[10px] text-[#A0A5B5] font-mono">g / gün</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono block">
            %{metrics.adherencePercent} hedef başarısı
          </span>
        </div>

        {/* 4. ORTALAMA HİDRASYON */}
        <div className="p-3.5 rounded-2xl bg-[#181920] border border-[#262936] space-y-1">
          <div className="flex items-center justify-between text-[10px] text-[#A0A5B5] font-bold uppercase">
            <span>Ort. Hidrasyon</span>
            <Droplet className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl sm:text-2xl font-black text-white font-mono">
              {metrics.avgWater}
            </span>
            <span className="text-[10px] text-[#A0A5B5] font-mono">Litre</span>
          </div>
          <span className="text-[10px] text-[#A0A5B5] font-mono block">
            Hedef 3.5 Litre
          </span>
        </div>

        {/* 5. ANTRENMAN GÜNLERİ */}
        <div className="p-3.5 rounded-2xl bg-[#181920] border border-[#262936] space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[10px] text-[#A0A5B5] font-bold uppercase">
            <span>Antrenman</span>
            <Dumbbell className="w-3.5 h-3.5 text-[#FF5356]" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl sm:text-2xl font-black text-white font-mono">
              {metrics.totalWorkouts}
            </span>
            <span className="text-[10px] text-[#A0A5B5] font-mono">/ {filteredRecords.length} gün</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono block">
            {filteredRecords.length > 0
              ? `%${Math.round((metrics.totalWorkouts / filteredRecords.length) * 100)} katılım`
              : '-'}
          </span>
        </div>
      </div>

      {/* 4. Visual Daily Calorie Trend Chart (Bar Chart) */}
      <div className="p-4 rounded-2xl bg-[#181920] border border-[#262936] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Günlük Kalori Dağılım Grafiği (kcal)
            </h3>
          </div>
          <div className="flex items-center space-x-2 text-[10px] font-mono">
            <span className="text-[#A0A5B5]">
              Toplam: <strong className="text-white font-bold">{metrics.totalKcal.toLocaleString('tr-TR')} kcal</strong>
            </span>
            <span className="text-[#5A6072]">•</span>
            <span className="text-amber-300">
              Ortalama: <strong className="text-amber-400 font-bold">{metrics.avgKcal.toLocaleString('tr-TR')} kcal/gün</strong>
            </span>
          </div>
        </div>

        {/* CSS/SVG Bar Chart */}
        <div className="pt-4 pb-1">
          <div className="h-40 flex items-end justify-between gap-1.5 sm:gap-3 px-1 border-b border-[#262936] relative">
            {/* Target Line at 2,600 kcal */}
            <div
              className="absolute left-0 right-0 border-b border-dashed border-[#FF1E38]/50 z-10 pointer-events-none"
              style={{
                bottom: `${(2600 / maxChartKcal) * 100}%`,
              }}
            >
              <span className="absolute right-1 -top-3 text-[9px] font-mono text-[#FF5356] font-bold">
                2,600
              </span>
            </div>

            {filteredRecords
              .slice(0, 10)
              .reverse()
              .map((rec) => {
                const heightPercent = Math.min(100, Math.max(12, (rec.energyKcal / maxChartKcal) * 100));
                const isUnder = rec.energyKcal <= rec.energyTarget;
                const isSelected = expandedRecordId === rec.id;

                return (
                  <div
                    key={rec.id}
                    onClick={() => setExpandedRecordId(isSelected ? null : rec.id)}
                    className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer relative"
                  >
                    {/* Tooltip on hover/click */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 px-1.5 py-0.5 rounded bg-[#292A2E] text-white text-[9px] font-mono font-bold pointer-events-none z-20 whitespace-nowrap">
                      {rec.energyKcal} kcal
                    </div>

                    {/* Bar Pill */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 relative ${
                        isSelected
                          ? 'bg-indigo-500 ring-2 ring-indigo-400'
                          : isUnder
                          ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:brightness-110'
                          : 'bg-gradient-to-t from-amber-600 to-amber-400 group-hover:brightness-110'
                      }`}
                    />

                    {/* Date label at bottom */}
                    <span className="text-[9px] font-mono text-[#A0A5B5] mt-1.5 truncate max-w-full text-center">
                      {rec.date.split(' ')[0]} {rec.date.split(' ')[1]?.slice(0, 3)}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#A0A5B5] pt-1">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span>Hedef İçi / Açık</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span>Kalori Fazlası</span>
            </span>
          </div>
          <span>Çubuklara dokunarak günü açın</span>
        </div>
      </div>

      {/* 5. Macro Energy Ratio Bar */}
      <div className="p-3.5 rounded-2xl bg-[#181920] border border-[#262936] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center space-x-1.5">
            <PieChart className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ortalama Makro Kalori Dağılımı</span>
          </span>
          <span className="text-[10px] font-mono text-[#A0A5B5]">
            Protein • Karb • Yağ
          </span>
        </div>

        {/* Ratio bar */}
        <div className="w-full h-3 rounded-full bg-[#121317] overflow-hidden flex">
          <div className="h-full bg-[#FF1E38]" style={{ width: '28%' }} title="Protein (%28)" />
          <div className="h-full bg-amber-400" style={{ width: '48%' }} title="Karbonhidrat (%48)" />
          <div className="h-full bg-indigo-500" style={{ width: '24%' }} title="Yağ (%24)" />
        </div>

        <div className="grid grid-cols-3 text-center text-[10px] font-mono pt-1">
          <span className="text-[#FF5356]">● Protein: {metrics.avgProtein}g (%28)</span>
          <span className="text-amber-400">● Karb: {metrics.avgCarbs}g (%48)</span>
          <span className="text-indigo-400">● Yağ: {metrics.avgFats}g (%24)</span>
        </div>
      </div>

      {/* 6. Comprehensive Historical Days List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Bütün Günlük Kayıtlar ({filteredRecords.length})
            </h3>
          </div>

          <span className="text-[10px] text-[#A0A5B5]">
            En yeniden eskiye
          </span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#181920] border border-[#262936] space-y-2">
            <Flame className="w-8 h-8 text-[#5A6072] mx-auto" />
            <h4 className="text-sm font-bold text-white">Henüz Kaydedilmiş Gün Yok</h4>
            <p className="text-xs text-[#A0A5B5] max-w-xs mx-auto">
              "Günü Bitir" butonuna basarak bugünün kalorisini arşivleyebilir veya yukarıdan manuel kayıt ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredRecords.map((record) => {
              const isExpanded = expandedRecordId === record.id;
              const diff = record.energyKcal - record.energyTarget;
              const isDef = diff < 0;

              return (
                <div
                  key={record.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isExpanded
                      ? 'bg-[#1C1D24] border-indigo-500/60 shadow-lg'
                      : 'bg-[#181920] border-[#262936] hover:border-[#383B47]'
                  }`}
                >
                  {/* Card Header (Click to expand) */}
                  <div
                    onClick={() => setExpandedRecordId(isExpanded ? null : record.id)}
                    className="p-3.5 cursor-pointer flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-extrabold text-white">
                          {record.date}
                        </span>
                        <span className="text-[10px] font-mono text-[#A0A5B5] px-1.5 py-0.2 rounded bg-[#121317]">
                          {record.dayName}
                        </span>
                        {record.workoutCompleted && (
                          <span className="px-1.5 py-0.2 rounded bg-[#FF1E38]/20 text-[#FF5356] text-[9px] font-bold">
                            🏋️ Antrenman
                          </span>
                        )}
                      </div>

                      {/* Macros row */}
                      <div className="flex items-center space-x-2.5 text-[11px] font-mono">
                        <span className="text-white font-bold">
                          {record.energyKcal} kcal
                        </span>
                        <span className="text-[#A0A5B5]">/ {record.energyTarget}</span>
                        <span className="text-[#FF5356]">{record.proteinGrams}g P</span>
                        <span className="text-amber-400">{record.carbsGrams}g K</span>
                        <span className="text-indigo-400">{record.fatsGrams}g Y</span>
                        <span className="text-cyan-400">{record.hydrationLiters}L Su</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div
                        className={`px-2 py-1 rounded-lg text-xs font-mono font-bold ${
                          isDef
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {isDef ? `${Math.abs(diff)} kcal Açık` : `+${diff} kcal`}
                      </div>

                      <div className="text-[#A0A5B5]">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Accordion Details */}
                  {isExpanded && (
                    <div className="p-3.5 pt-0 border-t border-[#262936] space-y-3 bg-[#14151B] animate-fadeIn">
                      {/* Workout & Cardio Summary */}
                      <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                        <div className="p-2.5 rounded-xl bg-[#181920] border border-[#262936] space-y-1">
                          <span className="text-[10px] text-[#A0A5B5] font-bold uppercase block">
                            Antrenman Durumu
                          </span>
                          <span className="font-bold text-white block">
                            {record.workoutTitle || 'Dinlenme Günü'}
                          </span>
                          {record.workoutDurationMinutes ? (
                            <span className="text-[10px] text-[#FF5356] font-mono block">
                              ⏱️ {record.workoutDurationMinutes} dk • {record.totalSetsCompleted || 0} set
                            </span>
                          ) : null}
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#181920] border border-[#262936] space-y-1">
                          <span className="text-[10px] text-[#A0A5B5] font-bold uppercase block">
                            Kardiyo & Kalori
                          </span>
                          <span className="font-bold text-emerald-400 block">
                            {record.cardioMinutes ? `${record.cardioMinutes} dk Kardiyo` : 'Kardiyo Yok'}
                          </span>
                          {record.cardioCalories ? (
                            <span className="text-[10px] text-[#A0A5B5] font-mono block">
                              🔥 ~{record.cardioCalories} kcal yakım
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#A0A5B5] font-mono block">
                              Standart günlük hareket
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Meals eaten breakdown */}
                      {record.meals && record.meals.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-[#A0A5B5] uppercase font-bold block">
                            Günün Öğünleri ({record.completedMealsCount || record.meals.length} Tamamlandı):
                          </span>
                          <div className="space-y-1">
                            {record.meals.map((meal) => (
                              <div
                                key={meal.id}
                                className="p-2 rounded-lg bg-[#181920] border border-[#262936] flex items-center justify-between text-xs"
                              >
                                <div className="flex items-center space-x-2">
                                  <CheckCircle
                                    className={`w-3.5 h-3.5 ${
                                      meal.completed ? 'text-emerald-400' : 'text-[#5A6072]'
                                    }`}
                                  />
                                  <span className="font-bold text-white">{meal.name}</span>
                                  <span className="text-[10px] text-[#A0A5B5] font-mono">{meal.time}</span>
                                </div>
                                <div className="text-[10px] font-mono text-right">
                                  <span className="text-white font-bold">{meal.calories} kcal</span>
                                  <span className="text-[#A0A5B5] ml-1.5">({meal.protein}g P)</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Day Notes */}
                      {record.notes && (
                        <div className="p-2.5 rounded-xl bg-[#181920] border border-[#262936] space-y-0.5">
                          <span className="text-[10px] text-indigo-400 font-bold block uppercase">
                            Günün Notu:
                          </span>
                          <p className="text-xs text-[#E3E2E8] italic">"{record.notes}"</p>
                        </div>
                      )}

                      {/* Delete action */}
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => onDeleteHistoryRecord(record.id)}
                          className="text-[11px] text-[#5A6072] hover:text-[#FF1E38] flex items-center space-x-1 p-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Bu Günü Arşivden Sil</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Manual Entry Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-[#121317] border border-[#262936] rounded-2xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#262936]">
              <h4 className="text-sm font-extrabold text-white flex items-center space-x-1.5">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Geçmiş Gün Verisi Ekle</span>
              </h4>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="text-[#A0A5B5] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManual} className="space-y-2.5 text-xs">
              <div>
                <label className="text-[10px] text-[#A0A5B5] font-bold block uppercase mb-1">
                  Tarih
                </label>
                <input
                  type="date"
                  value={manualForm.date}
                  onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg bg-[#181920] border border-[#262936] text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#A0A5B5] font-bold block uppercase mb-1">
                    Kalori (kcal)
                  </label>
                  <input
                    type="number"
                    value={manualForm.energyKcal}
                    onChange={(e) => setManualForm({ ...manualForm, energyKcal: parseInt(e.target.value) || 0 })}
                    className="w-full h-9 px-3 rounded-lg bg-[#181920] border border-[#262936] text-white font-mono focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#A0A5B5] font-bold block uppercase mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    value={manualForm.proteinGrams}
                    onChange={(e) => setManualForm({ ...manualForm, proteinGrams: parseInt(e.target.value) || 0 })}
                    className="w-full h-9 px-3 rounded-lg bg-[#181920] border border-[#262936] text-white font-mono focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-[#A0A5B5] font-bold block uppercase mb-1">
                    Karb (g)
                  </label>
                  <input
                    type="number"
                    value={manualForm.carbsGrams}
                    onChange={(e) => setManualForm({ ...manualForm, carbsGrams: parseInt(e.target.value) || 0 })}
                    className="w-full h-9 px-2 rounded-lg bg-[#181920] border border-[#262936] text-white font-mono text-center focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#A0A5B5] font-bold block uppercase mb-1">
                    Yağ (g)
                  </label>
                  <input
                    type="number"
                    value={manualForm.fatsGrams}
                    onChange={(e) => setManualForm({ ...manualForm, fatsGrams: parseInt(e.target.value) || 0 })}
                    className="w-full h-9 px-2 rounded-lg bg-[#181920] border border-[#262936] text-white font-mono text-center focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#A0A5B5] font-bold block uppercase mb-1">
                    Su (L)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={manualForm.waterLiters}
                    onChange={(e) => setManualForm({ ...manualForm, waterLiters: parseFloat(e.target.value) || 0 })}
                    className="w-full h-9 px-2 rounded-lg bg-[#181920] border border-[#262936] text-white font-mono text-center focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#A0A5B5] font-bold block uppercase mb-1">
                  Antrenman Başlığı (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={manualForm.workoutTitle}
                  onChange={(e) => setManualForm({ ...manualForm, workoutTitle: e.target.value })}
                  placeholder="Örn: İtiş (Push) Seansı"
                  className="w-full h-9 px-3 rounded-lg bg-[#181920] border border-[#262936] text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#A0A5B5] font-bold block uppercase mb-1">
                  Not
                </label>
                <input
                  type="text"
                  value={manualForm.notes}
                  onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                  placeholder="Opsiyonel gün notu..."
                  className="w-full h-9 px-3 rounded-lg bg-[#181920] border border-[#262936] text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="w-1/2 h-9 rounded-lg bg-[#181920] text-[#A0A5B5] hover:text-white font-bold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="w-1/2 h-9 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
