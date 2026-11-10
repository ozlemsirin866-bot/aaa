import React, { useState } from 'react';
import {
  User,
  Shield,
  Activity,
  Flame,
  Award,
  Settings,
  CheckCircle,
  RotateCcw,
  Sparkles,
  Edit3,
  X,
  Save,
  Trash2,
  TrendingUp,
  Zap,
  Dumbbell,
  AlertTriangle,
  Loader2,
  Calendar,
  Link as LinkIcon,
  Check,
  CheckSquare,
  Plus,
  ChevronRight,
  Clock,
  Layers,
} from 'lucide-react';
import { AthleteProfile, CustomProgram, Exercise, WeeklyScheduleDay, ZinciriKirmaData } from '../../types/fitness';
import { PopularFood } from '../../data/popularFoodsData';
import { EXERCISES_DATA } from '../../data/mockData';

interface ProfileTabProps {
  profile: AthleteProfile;
  onUpdateProfile: (updated: AthleteProfile) => void;
  onApplyProgramToWorkout?: (program: CustomProgram) => void;
  onClearAllData?: () => void;
  customFoods?: PopularFood[];
  onAddCustomFood?: (food: PopularFood) => void;
  onUpdateCustomFood?: (food: PopularFood) => void;
  onDeleteCustomFood?: (foodId: string) => void;
  customExercises?: Exercise[];
  onAddCustomExercise?: (exercise: Exercise) => void;
  onUpdateCustomExercise?: (exercise: Exercise) => void;
  onDeleteCustomExercise?: (exerciseId: string) => void;
  onOpenFoodConfirm?: (food: PopularFood) => void;
  onOpenExerciseDetail?: (exercise: Exercise) => void;
  onAddExerciseToWorkout?: (exercise: Exercise) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  onUpdateProfile,
  onApplyProgramToWorkout,
  onClearAllData,
  customFoods = [],
  onAddCustomFood = () => {},
  onUpdateCustomFood = () => {},
  onDeleteCustomFood = () => {},
  customExercises = [],
  onAddCustomExercise = () => {},
  onUpdateCustomExercise = () => {},
  onDeleteCustomExercise = () => {},
  onOpenFoodConfirm,
  onOpenExerciseDetail,
  onAddExerciseToWorkout,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<AthleteProfile>(profile);

  // Clear data with 1.5s delay states
  const [isClearModalOpen, setIsClearModalOpen] = useState<boolean>(false);
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [clearCountdown, setClearCountdown] = useState<number>(1.5);
  const [clearProgress, setClearProgress] = useState<number>(0);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [toast, setToast] = useState<string | null>(null);

  // Zinciri Kırma & Spor Takvimi States
  const defaultWeeklyCalendar: WeeklyScheduleDay[] = [
    { dayIndex: 0, dayName: 'Pazartesi', isRestDay: false, focusTitle: 'Göğüs & Triceps (Push A)', targetMuscleGroups: ['Göğüs', 'Triceps'], estimatedDurationMin: 50, cardioMin: 20, completed: false, notes: 'Bench Press piramidi ve %12 eğimli kardiyo' },
    { dayIndex: 1, dayName: 'Salı', isRestDay: false, focusTitle: 'Sırt & Biceps (Pull A)', targetMuscleGroups: ['Sırt/Lat', 'Biceps'], estimatedDurationMin: 50, cardioMin: 20, completed: false, notes: 'Barbell row & preacher curl' },
    { dayIndex: 2, dayName: 'Çarşamba', isRestDay: true, focusTitle: 'Aktif Toparlanma & Eğimli Yürüyüş', targetMuscleGroups: ['Core / Karın'], estimatedDurationMin: 30, cardioMin: 30, completed: false, notes: '30 dk %15 eğim Zone 2' },
    { dayIndex: 3, dayName: 'Perşembe', isRestDay: false, focusTitle: 'Bacak & Kalf Hipertrofisi', targetMuscleGroups: ['Bacak'], estimatedDurationMin: 55, cardioMin: 15, completed: false, notes: 'Squat & leg press 10/12/15' },
    { dayIndex: 4, dayName: 'Cuma', isRestDay: false, focusTitle: 'Omuz & Karın / Bel', targetMuscleGroups: ['Omuz', 'Karın'], estimatedDurationMin: 45, cardioMin: 20, completed: false, notes: 'Military press & lateral raise' },
    { dayIndex: 5, dayName: 'Cumartesi', isRestDay: false, focusTitle: 'Full Body & Kol Zirvesi', targetMuscleGroups: ['Biceps', 'Triceps', 'Göğüs'], estimatedDurationMin: 50, cardioMin: 20, completed: false, notes: 'Süper setler' },
    { dayIndex: 6, dayName: 'Pazar', isRestDay: true, focusTitle: 'Tam Dinlenme & Hidrasyon', targetMuscleGroups: [], estimatedDurationMin: 0, cardioMin: 0, completed: false, notes: '4L su tüketimi' },
  ];

  const hasHistoryData = Boolean(
    profile.zinciriKirma &&
    (
      (typeof profile.zinciriKirma.totalDaysCompleted === 'number' && profile.zinciriKirma.totalDaysCompleted > 0 && profile.zinciriKirma.totalDaysCompleted !== 14 && profile.zinciriKirma.totalDaysCompleted !== 34) ||
      Boolean(profile.zinciriKirma.lastCompletedDate) ||
      (profile.zinciriKirma.weeklyCalendar && profile.zinciriKirma.weeklyCalendar.some((d) => d.completed)) ||
      (profile.sessionsCompleted && profile.sessionsCompleted > 0)
    )
  );

  const rawStreak = profile.zinciriKirma?.currentStreak ?? 1;
  const isOldDummyStreak = !hasHistoryData || rawStreak === 14 || rawStreak === 0;
  const currentStreak = isOldDummyStreak ? 1 : Math.max(1, rawStreak);
  const longestStreak = isOldDummyStreak ? 1 : Math.max(currentStreak, profile.zinciriKirma?.longestStreak || 1);
  const totalDaysCompleted = isOldDummyStreak ? 0 : (profile.zinciriKirma?.totalDaysCompleted || 0);

  const currentZinciriKirma: ZinciriKirmaData = {
    currentStreak,
    longestStreak,
    totalDaysCompleted,
    lastCompletedDate: isOldDummyStreak ? undefined : profile.zinciriKirma?.lastCompletedDate,
    weeklyCalendar: profile.zinciriKirma?.weeklyCalendar || defaultWeeklyCalendar,
  };

  const handleToggleChainDay = (dayIndex: number) => {
    const calendar = currentZinciriKirma.weeklyCalendar || defaultWeeklyCalendar;
    const updated = calendar.map((d) => {
      if (d.dayIndex === dayIndex) {
        return { ...d, completed: !d.completed };
      }
      return d;
    });

    const completedCount = updated.filter((d) => d.completed).length;
    const updatedZk: ZinciriKirmaData = {
      ...currentZinciriKirma,
      weeklyCalendar: updated,
      currentStreak: Math.max(1, completedCount),
      longestStreak: Math.max(currentZinciriKirma.longestStreak || 1, completedCount),
      totalDaysCompleted: Math.max(totalDaysCompleted, completedCount),
    };

    onUpdateProfile({
      ...profile,
      zinciriKirma: updatedZk,
    });
    showToast('Zincir halkası güncellendi! 🔥');
  };

  const handleCheckInToday = () => {
    const newStreak = currentStreak + 1;
    const newLongest = Math.max(newStreak, longestStreak);
    const updatedZk: ZinciriKirmaData = {
      ...currentZinciriKirma,
      currentStreak: newStreak,
      longestStreak: newLongest,
      totalDaysCompleted: totalDaysCompleted + 1,
      lastCompletedDate: new Date().toISOString().split('T')[0],
    };
    onUpdateProfile({
      ...profile,
      zinciriKirma: updatedZk,
      sessionsCompleted: (profile.sessionsCompleted || 0) + 1,
    });
    showToast(`🔥 Tebrikler! Zincir kırılmadı: ${newStreak}. gün başarıyla tamamlandı!`);
  };


  const handleImmediateClear = () => {
    if (onClearAllData) {
      onClearAllData();
    }
    setIsClearing(false);
    setIsClearModalOpen(false);
    setClearProgress(0);
    setClearCountdown(1.5);
    showToast('🗑️ Bütün datalar anında sıfırlandı ve temizlendi!');
  };

  const handleTriggerClearAll = () => {
    if (isClearing) return;
    setIsClearing(true);
    setClearCountdown(1.5);
    setClearProgress(0);

    const DURATION_MS = 1500; // 1.5 saniye bekleme süresi
    const INTERVAL_MS = 50;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, (DURATION_MS - elapsed) / 1000);
      const progress = Math.min(100, (elapsed / DURATION_MS) * 100);

      setClearCountdown(Number(remaining.toFixed(1)));
      setClearProgress(progress);

      if (elapsed >= DURATION_MS) {
        clearInterval(timer);
        if (onClearAllData) {
          onClearAllData();
        }
        setIsClearing(false);
        setIsClearModalOpen(false);
        setClearProgress(0);
        setClearCountdown(1.5);
        showToast('🗑️ Bütün datalar başarıyla temizlendi ve sıfırlandı!');
      }
    }, INTERVAL_MS);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const handleOpenEdit = () => {
    setEditForm({ ...profile });
    setIsEditing(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(editForm);
    setIsEditing(false);
    showToast('Profil ve hedefler başarıyla güncellendi!');
  };

  const initials = profile.name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AV';

  return (
    <div className="space-y-4 pb-28 select-none">
      {/* 1. Athlete Header Card */}
      <div className="rounded-2xl bg-[#1F1F24] border border-[#262936] p-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF1E38]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF1E38] via-[#FF334B] to-[#930018] text-white flex items-center justify-center font-extrabold text-lg shadow-lg shadow-[#FF1E38]/20 shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  {profile.name}
                </h2>
                <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase shadow-sm">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                  <span>{currentZinciriKirma.currentStreak} GÜN ZİNCİR</span>
                </div>
              </div>
              <p className="text-xs text-[#A0A5B5] mt-0.5 font-medium">
                {profile.program}
              </p>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={handleOpenEdit}
            className="px-3 py-1.5 rounded-xl bg-[#121317] hover:bg-[#292A2E] text-white text-xs font-bold border border-[#262936] flex items-center space-x-1.5 transition-all active:scale-95 shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#FF5356]" />
            <span>Düzenle</span>
          </button>
        </div>

        {/* Vital Telemetry Grid */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mt-4 pt-3 border-t border-[#262936] text-center">
          <div className="p-2 rounded-xl bg-[#121317]">
            <span className="text-[10px] text-[#A0A5B5] block uppercase font-bold">Kilo</span>
            <span className="text-sm font-extrabold text-white font-mono mt-0.5 block tabular-nums">
              {profile.weightKg} kg
            </span>
          </div>
          <div className="p-2 rounded-xl bg-[#121317]">
            <span className="text-[10px] text-[#A0A5B5] block uppercase font-bold">Boy</span>
            <span className="text-sm font-extrabold text-white font-mono mt-0.5 block tabular-nums">
              {profile.heightCm} cm
            </span>
          </div>
          <div className="p-2 rounded-xl bg-[#121317]">
            <span className="text-[10px] text-[#A0A5B5] block uppercase font-bold">Yaş</span>
            <span className="text-sm font-extrabold text-white font-mono mt-0.5 block tabular-nums">
              {profile.age || 28}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-[#121317]">
            <span className="text-[10px] text-[#A0A5B5] block uppercase font-bold">Yağ Oranı</span>
            <span className="text-sm font-extrabold text-[#FF5356] font-mono mt-0.5 block tabular-nums">
              %{profile.bodyFatPercent}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-[#121317]">
            <span className="text-[10px] text-[#A0A5B5] block uppercase font-bold">Seanslar</span>
            <span className="text-sm font-extrabold text-white font-mono mt-0.5 block tabular-nums">
              {profile.sessionsCompleted}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Avalanche Çığ Etkisi Hipertrofi Manifestosu */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1A1C24] via-[#121317] to-[#1A1C24] border border-[#FF1E38]/30 p-4 space-y-1.5">
        <div className="flex items-center space-x-2 text-[11px] font-extrabold text-[#FF5356] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AVALANCHE • ÇIĞ ETKİSİ PRENSİBİ</span>
        </div>
        <p className="text-xs text-[#A0A5B5] leading-relaxed">
          Her set bir kartanesidir. Ağırlık artışları ve mekanik gerilim birikerek kontrol edilemez bir hipertrofi çığına (<strong className="text-white">Avalanche Effect</strong>) dönüşür.
        </p>
      </div>

      {/* 2.0. ZİNCİRİ ASLA KIRMA (DON'T BREAK THE CHAIN) */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1C1E26] via-[#14151B] to-[#121317] border-2 border-amber-500/30 p-4 space-y-3.5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider font-mono">
                SÜREKLİLİK PROTOKOLÜ
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>Süreklilik Zinciri Takvimi</span>
            </h3>
            <p className="text-xs text-[#A0A5B5] leading-snug">
              Her gün bir halka. İster ağır ağırlık seansı olsun, ister toparlanma yürüyüşü; zinciri asla koparma.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCheckInToday}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-lg shadow-amber-500/20 active:scale-95 shrink-0"
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Bugün Zinciri Kırma!</span>
          </button>
        </div>

        {/* Chain Stats */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-[#121317] border border-amber-500/20">
            <span className="text-[9px] text-[#A0A5B5] block uppercase font-bold">Mevcut Zincir</span>
            <span className="text-base font-extrabold text-amber-400 font-mono mt-0.5 block">
              {currentZinciriKirma.currentStreak} Gün
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#121317] border border-[#262936]">
            <span className="text-[9px] text-[#A0A5B5] block uppercase font-bold">En Uzun Rekor</span>
            <span className="text-base font-extrabold text-white font-mono mt-0.5 block">
              {currentZinciriKirma.longestStreak} Gün
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#121317] border border-[#262936]">
            <span className="text-[9px] text-[#A0A5B5] block uppercase font-bold">Toplam Seans</span>
            <span className="text-base font-extrabold text-emerald-400 font-mono mt-0.5 block">
              {currentZinciriKirma.totalDaysCompleted} Gün
            </span>
          </div>
        </div>

        {/* 7-Days Visual Chain Links */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-[#A0A5B5] uppercase">
            <span>Bu Haftanın Zincir Halkaları</span>
            <span className="text-amber-400 font-mono">
              {(currentZinciriKirma.weeklyCalendar || []).filter((d) => d.completed).length} / 7 Tamamlandı
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 pt-1">
            {(currentZinciriKirma.weeklyCalendar || defaultWeeklyCalendar).map((day) => (
              <button
                key={day.dayIndex}
                type="button"
                onClick={() => handleToggleChainDay(day.dayIndex)}
                title={`${day.dayName}: ${day.focusTitle} (Zincir durumunu değiştirmek için tıkla)`}
                className={`p-2 rounded-xl text-center border transition-all active:scale-95 flex flex-col items-center justify-between ${
                  day.completed
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm shadow-amber-500/10'
                    : 'bg-[#121317] border-[#262936] text-[#A0A5B5] hover:border-[#383B47]'
                }`}
              >
                <span className="text-[9px] font-bold uppercase font-mono block">
                  {day.dayName.slice(0, 3)}
                </span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center my-1 transition-all ${
                    day.completed ? 'bg-amber-500 text-black font-bold' : 'bg-[#1F1F24] text-[#5A6072]'
                  }`}
                >
                  {day.completed ? <Check className="w-3.5 h-3.5 stroke-[3px]" /> : <LinkIcon className="w-3 h-3" />}
                </div>
                <span className="text-[8px] font-medium truncate max-w-full">
                  {day.isRestDay ? 'Mola' : 'Spor'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Haftalık Kas Hacmi Telemetrisi */}
      <div className="rounded-2xl bg-[#1F1F24] border border-[#262936] p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#FF5356]" />
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Haftalık Kas Hacmi (Setler)
            </h3>
          </div>
          <span className="text-[10px] font-bold text-[#A0A5B5] uppercase">
            MEV / MAV Eşiği
          </span>
        </div>

        <div className="space-y-2.5 pt-1">
          {Object.entries(profile.weeklyTargetSets).map(([key, data]) => {
            const labels: Record<string, string> = {
              chest: 'Göğüs (Pectoralis)',
              back: 'Sırt & Lats',
              legs: 'Bacak (Quads/Hams)',
              shoulders: 'Omuz (Deltoid)',
              arms: 'Kollar (Bi/Tri)',
            };
            const percent = Math.min(100, Math.round((data.done / data.target) * 100));
            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-semibold">{labels[key]}</span>
                  <span className="text-[#A0A5B5] font-mono">
                    {data.done} / {data.target} Set ({percent}%)
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#121317] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF1E38] to-[#FF5356] rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Sistem Tercihleri */}
      <div className="rounded-2xl bg-[#1F1F24] border border-[#262936] p-4 space-y-3 shadow-sm">
        <div className="flex items-center space-x-2">
          <Settings className="w-4 h-4 text-[#A0A5B5]" />
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
            Sistem Tercihleri
          </h3>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#121317] border border-[#262936]">
            <div>
              <span className="text-xs font-bold text-white block">Set Sonu Sesli Uyarı</span>
              <span className="text-[10px] text-[#A0A5B5]">Zamanlayıcı bittiğinde ses çal</span>
            </div>
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                showToast(`Ses uyarısı: ${!soundEnabled ? 'Açık' : 'Kapalı'}`);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                soundEnabled ? 'bg-[#FF1E38]' : 'bg-[#343439]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#121317] border border-[#262936]">
            <div>
              <span className="text-xs font-bold text-white block">Titreşim Geri Bildirimi</span>
              <span className="text-[10px] text-[#A0A5B5]">Set onaylarında haptic titreşim</span>
            </div>
            <button
              onClick={() => {
                setVibrationEnabled(!vibrationEnabled);
                showToast(`Titreşim: ${!vibrationEnabled ? 'Açık' : 'Kapalı'}`);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                vibrationEnabled ? 'bg-[#FF1E38]' : 'bg-[#343439]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  vibrationEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 6. Veri Yönetimi & Bütün Dataları Temizle (Tehlikeli Bölge) */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1E1214] to-[#161214] border border-red-900/40 p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>Veri Yönetimi & Sıfırlama</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-900/50 text-red-300 font-mono">SIFIRLA</span>
              </h3>
              <p className="text-[10px] text-[#A0A5B5]">
                Geçmiş kalori, beslenme kayıtları, antrenmanlar ve özel programlar
              </p>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-[#A0A5B5] leading-relaxed bg-[#121317]/60 p-2.5 rounded-xl border border-red-900/20">
          Uygulamadaki tüm antrenman geçmişini, günlük kalori ve beslenme verilerini, tamamlanan seansları ve oluşturduğunuz özel antrenman programlarını sıfırlayabilirsiniz.
        </p>

        {/* Bütün Dataları Temizle Butonu */}
        <button
          type="button"
          onClick={() => setIsClearModalOpen(true)}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600/90 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-red-900/30 transition-all active:scale-[0.98] border border-red-500/30"
        >
          <Trash2 className="w-4 h-4" />
          <span>Bütün Dataları Temizle</span>
          <span className="text-[10px] font-normal opacity-85">(1.5 sn bekleme süreli)</span>
        </button>
      </div>

      {/* ========================================================
          6. PROFİL DÜZENLEME MODALI (Edit Profile Modal)
         ======================================================== */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#1A1C24] border border-[#262936] rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#262936] flex items-center justify-between bg-[#121317]">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#FF1E38]/20 text-[#FF5356] flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Sporcu Profilini Düzenle</h3>
                  <span className="text-[10px] text-[#A0A5B5]">Ölçümler ve Hedef Ayarları</span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-lg bg-[#292A2E] text-[#A0A5B5] hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {/* Ad & Soyad */}
              <div>
                <label className="text-[11px] font-bold text-[#A0A5B5] uppercase block mb-1">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full h-11 px-3 bg-[#121317] border border-[#262936] rounded-xl text-sm text-white focus:outline-none focus:border-[#FF1E38]"
                />
              </div>

              {/* Aktif Program */}
              <div>
                <label className="text-[11px] font-bold text-[#A0A5B5] uppercase block mb-1">
                  Aktif Program
                </label>
                <input
                  type="text"
                  value={editForm.program}
                  onChange={(e) => setEditForm({ ...editForm, program: e.target.value })}
                  className="w-full h-11 px-3 bg-[#121317] border border-[#262936] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF1E38]"
                />
              </div>

              {/* Fiziksel Ölçümler: Kilo, Boy, Yaş, Yağ Oranı, Seans */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#A0A5B5] uppercase block mb-1">
                    Kilo (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.weightKg}
                    onChange={(e) => setEditForm({ ...editForm, weightKg: Number(e.target.value) })}
                    className="w-full h-10 px-2.5 bg-[#121317] border border-[#262936] rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#FF1E38]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#A0A5B5] uppercase block mb-1">
                    Boy (cm)
                  </label>
                  <input
                    type="number"
                    value={editForm.heightCm}
                    onChange={(e) => setEditForm({ ...editForm, heightCm: Number(e.target.value) })}
                    className="w-full h-10 px-2.5 bg-[#121317] border border-[#262936] rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#FF1E38]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#A0A5B5] uppercase block mb-1">
                    Yaş
                  </label>
                  <input
                    type="number"
                    value={editForm.age || 28}
                    onChange={(e) => setEditForm({ ...editForm, age: Number(e.target.value) })}
                    className="w-full h-10 px-2.5 bg-[#121317] border border-[#262936] rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#FF1E38]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#A0A5B5] uppercase block mb-1">
                    Yağ (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.bodyFatPercent}
                    onChange={(e) => setEditForm({ ...editForm, bodyFatPercent: Number(e.target.value) })}
                    className="w-full h-10 px-2.5 bg-[#121317] border border-[#262936] rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#FF1E38]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#A0A5B5] uppercase block mb-1">
                    Seanslar
                  </label>
                  <input
                    type="number"
                    value={editForm.sessionsCompleted}
                    onChange={(e) => setEditForm({ ...editForm, sessionsCompleted: Number(e.target.value) })}
                    className="w-full h-10 px-2.5 bg-[#121317] border border-[#262936] rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#FF1E38]"
                  />
                </div>
              </div>

              {/* Haftalık Hedef Setleri */}
              <div className="pt-2 border-t border-[#262936]">
                <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-2">
                  Haftalık Kas Grubu Hedef Setleri
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-[#A0A5B5] block mb-0.5">Göğüs Seti</label>
                    <input
                      type="number"
                      value={editForm.weeklyTargetSets.chest.target}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          weeklyTargetSets: {
                            ...editForm.weeklyTargetSets,
                            chest: { ...editForm.weeklyTargetSets.chest, target: Number(e.target.value) },
                          },
                        })
                      }
                      className="w-full h-9 px-2.5 bg-[#121317] border border-[#262936] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#FF1E38]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#A0A5B5] block mb-0.5">Sırt & Lats Seti</label>
                    <input
                      type="number"
                      value={editForm.weeklyTargetSets.back.target}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          weeklyTargetSets: {
                            ...editForm.weeklyTargetSets,
                            back: { ...editForm.weeklyTargetSets.back, target: Number(e.target.value) },
                          },
                        })
                      }
                      className="w-full h-9 px-2.5 bg-[#121317] border border-[#262936] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#FF1E38]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#A0A5B5] block mb-0.5">Bacak Seti</label>
                    <input
                      type="number"
                      value={editForm.weeklyTargetSets.legs.target}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          weeklyTargetSets: {
                            ...editForm.weeklyTargetSets,
                            legs: { ...editForm.weeklyTargetSets.legs, target: Number(e.target.value) },
                          },
                        })
                      }
                      className="w-full h-9 px-2.5 bg-[#121317] border border-[#262936] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#FF1E38]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#A0A5B5] block mb-0.5">Omuz Seti</label>
                    <input
                      type="number"
                      value={editForm.weeklyTargetSets.shoulders.target}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          weeklyTargetSets: {
                            ...editForm.weeklyTargetSets,
                            shoulders: { ...editForm.weeklyTargetSets.shoulders, target: Number(e.target.value) },
                          },
                        })
                      }
                      className="w-full h-9 px-2.5 bg-[#121317] border border-[#262936] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#FF1E38]"
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#292A2E] text-white text-xs font-bold hover:bg-[#343439] transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF1E38] hover:bg-[#FF334B] text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-[#FF1E38]/20 transition-all active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Değişiklikleri Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50 animate-bounce">
          <div className="bg-[#292A2E] border border-[#FF1E38] text-white p-3 rounded-xl shadow-2xl flex items-center justify-center space-x-2">
            <CheckCircle className="w-4 h-4 text-[#FF5356]" />
            <span className="text-xs font-bold">{toast}</span>
          </div>
        </div>
      )}

      {/* ========================================================
          7. BÜTÜN DATALARI TEMİZLEME ONAY MODALI (1.5 sn gecikmeli)
         ======================================================== */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm bg-[#1A1C24] border border-red-900/50 rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-scaleIn">
            {/* Header */}
            <div className="p-4 border-b border-[#262936] flex items-center justify-between bg-[#141215]">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Bütün Dataları Temizle</h3>
                  <span className="text-[10px] text-red-300/80 font-mono">1.5 saniye bekleme süresi</span>
                </div>
              </div>
              {!isClearing && (
                <button
                  type="button"
                  onClick={() => setIsClearModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-[#292A2E] text-[#A0A5B5] hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-3.5">
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-xs text-red-200 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5 text-red-300">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  Bu işlem geri alınamaz!
                </p>
                <p className="text-[11px] text-[#A0A5B5] leading-relaxed">
                  Silme butonuna bastıktan sonra sistem <strong className="text-white">1.5 saniye</strong> bekleyecek ve ardından aşağıdaki tüm veriler sıfırlanacaktır:
                </p>
                <ul className="text-[10px] text-[#A0A5B5] space-y-1 list-disc pl-4 pt-1">
                  <li>Tüm günlük kalori, beslenme ve su kayıtları</li>
                  <li>Performans & Analiz sekmesindeki geçmiş veriler</li>
                  <li>Tamamlanan antrenmanlar ve canlı seans verisi</li>
                  <li>Sihirbaz ile oluşturulan özel programlar</li>
                  <li>Günlük check-in ve takviye durumları</li>
                </ul>
              </div>

              {/* Progress bar during 1.5s countdown */}
              {isClearing && (
                <div className="space-y-1.5 p-3 rounded-xl bg-[#121317] border border-red-500/30">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-red-400 flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                      Datalar Temizleniyor...
                    </span>
                    <span className="font-mono text-white font-bold">{clearCountdown.toFixed(1)} sn</span>
                  </div>
                  <div className="w-full h-2 bg-[#262936] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-75"
                      style={{ width: `${clearProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-center text-[#A0A5B5] pt-0.5">
                    Lütfen bekleyin, veriler kalıcı olarak sıfırlanıyor...
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2 pt-1">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    disabled={isClearing}
                    onClick={() => setIsClearModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-[#292A2E] text-white text-xs font-bold hover:bg-[#343439] transition-colors disabled:opacity-40"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="button"
                    disabled={isClearing}
                    onClick={handleImmediateClear}
                    className="flex-1 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hemen Sıfırla</span>
                  </button>
                </div>

                <button
                  type="button"
                  disabled={isClearing}
                  onClick={handleTriggerClearAll}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-95 ${
                    isClearing
                      ? 'bg-red-800/80 text-white cursor-wait'
                      : 'bg-[#292A2E] hover:bg-[#343439] text-[#A0A5B5] hover:text-white border border-[#383B47]'
                  }`}
                >
                  {isClearing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Siliniyor ({clearCountdown.toFixed(1)}s)</span>
                    </>
                  ) : (
                    <>
                      <span>1.5 sn Güvenli Geri Sayımla Sil</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
