import React, { useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Play,
  Pause,
  ExternalLink,
  Target,
  Check,
  X as CloseIcon,
  CheckCircle,
  PlusCircle,
  ShieldCheck,
  Eye,
  Tv,
} from 'lucide-react';
import { Exercise } from '../types/fitness';
import { BiomechanicDiagram } from './BiomechanicDiagram';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToWorkout: (exercise: Exercise) => void;
  isAlreadyInWorkout?: boolean;
  athleteName?: string;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  isOpen,
  onClose,
  onAddToWorkout,
  isAlreadyInWorkout = false,
  athleteName = 'Mert Yılmaz',
}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAdded, setIsAdded] = useState(isAlreadyInWorkout);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const initials = athleteName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AV';

  if (!isOpen || !exercise) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleToggleFavorite = () => {
    const nextState = !isFavorited;
    setIsFavorited(nextState);
    showToast(
      nextState
        ? `${exercise.name} favorilere kaydedildi.`
        : 'Favorilerden kaldırıldı.'
    );
  };

  const handleAddClick = () => {
    const nextState = !isAdded;
    setIsAdded(nextState);
    if (nextState) {
      onAddToWorkout(exercise);
      showToast(`${exercise.name} güncel antrenman akışına eklendi!`);
    } else {
      showToast(`${exercise.name} antrenmandan çıkarıldı.`);
    }
  };

  const getDiagramType = (id: string): any => {
    if (id.includes('bench')) return 'bench-press';
    if (id.includes('incline')) return 'incline-press';
    if (id.includes('row')) return 'seated-row';
    if (id.includes('lateral')) return 'lateral-raise';
    if (id.includes('deadlift') || id.includes('rdl')) return 'rdl';
    if (id.includes('pushdown')) return 'pushdown';
    if (id.includes('crunch')) return 'crunch';
    return 'bench-press';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#121317] text-[#E3E2E8] flex flex-col font-sans select-none animate-fadeIn">
      {/* Fixed Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-[#121317]/90 backdrop-blur-xl border-b border-[#262936] shadow-[0_1px_8px_rgba(0,0,0,0.3)]">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <button
              onClick={onClose}
              aria-label="Geri dön"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#E3E2E8] hover:text-[#FF5356] transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-[#E3E2E8] tracking-tight truncate max-w-[240px]">
              Egzersiz Detayı Ve Form Analizi
            </h1>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#FF1E38] text-white flex items-center justify-center font-bold text-xs">
            {initials}
          </div>
        </div>
      </header>

      {/* Main Body Content */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-4 space-y-4 pb-28">
        {/* Title & Favorite Bar */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-2 h-5 bg-[#FF1E38] rounded-sm shrink-0" />
            <div className="truncate">
              <span className="text-[11px] font-extrabold text-[#A0A5B5] uppercase tracking-wider block">
                {exercise.category.toUpperCase()} • HİPERTROFİ
              </span>
              <h2 className="text-xl font-bold text-white truncate">
                {exercise.name}
              </h2>
            </div>
          </div>
          <button
            onClick={handleToggleFavorite}
            aria-label="Favorilere Ekle"
            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all active:scale-95 shrink-0 ${
              isFavorited
                ? 'bg-[#FF1E38]/20 border-[#FF1E38] text-[#FF5356]'
                : 'bg-[#1F1F24] border-[#262936] text-[#A0A5B5] hover:text-white'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Video / Biomechanics Player Card */}
        <div className="relative w-full rounded-2xl bg-[#1F1F24] border border-[#262936] overflow-hidden shadow-xl group">
          <div className="relative w-full aspect-video bg-[#0D0E12]">
            {isPlayingVideo ? (
              <div className="relative w-full h-full bg-black">
                <iframe
                  className="w-full h-full border-0"
                  src={`https://www.youtube-nocookie.com/embed/${exercise.youtubeVideoId || 'rT7DgCr-3pg'}?autoplay=1&rel=0&modestbranding=1`}
                  title={`${exercise.name} YouTube video rehberi`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <button
                  onClick={() => setIsPlayingVideo(false)}
                  className="absolute top-2 right-2 px-2 py-1 rounded bg-[#0D0E12]/80 text-white text-[10px] font-bold border border-[#262936] hover:bg-[#FF1E38] transition-colors z-10"
                >
                  Kapat
                </button>
              </div>
            ) : (
              <>
                <img
                  src={exercise.videoThumbnailUrl}
                  alt={exercise.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E12] via-[#0D0E12]/40 to-transparent" />

                {/* Duration Badge */}
                <div className="absolute top-3 right-3 flex items-center space-x-1.5 px-2 py-1 rounded bg-[#0D0E12]/90 backdrop-blur-sm text-white border border-[#262936]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E38] animate-pulse" />
                  <span className="text-[11px] font-bold tracking-wider font-mono">
                    {exercise.videoDuration}
                  </span>
                </div>

                {/* Center Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => {
                      setIsPlayingVideo(true);
                      showToast('YouTube videosu başlatılıyor...');
                    }}
                    aria-label="Videoyu Oynat"
                    className="w-14 h-14 rounded-full bg-[#FF1E38] hover:bg-[#FF334B] text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,30,56,0.6)] transition-transform duration-200 hover:scale-110 active:scale-95"
                  >
                    <Play className="w-7 h-7 translate-x-0.5 fill-current" />
                  </button>
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div className="pr-2 min-w-0">
                    <span className="text-[10px] font-extrabold text-[#FF5356] uppercase tracking-wider block">
                      RESMİ ANALİZ
                    </span>
                    <p className="text-xs font-bold text-white truncate">
                      Doğru Biyomekanik ve Form Rehberi
                    </p>
                  </div>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + ' form rehberi biyomekanik')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-[#292A2E]/90 hover:bg-[#FF1E38] text-white flex items-center space-x-1.5 shrink-0 transition-colors border border-[#343439]"
                  >
                    <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span className="text-[11px] font-bold">YouTube</span>
                  </a>
                </div>
              </>
            )}
          </div>

          {/* Control Bar Below Player */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#1A1B20] text-[#A0A5B5] border-t border-[#262936] text-xs">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                className="flex items-center space-x-1.5 text-white hover:text-[#FF5356] font-semibold transition-colors"
              >
                {isPlayingVideo ? (
                  <>
                    <Pause className="w-4 h-4 text-[#FF5356]" />
                    <span>Durdur</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-[#FF5356] fill-current" />
                    <span>Uygulamada İzle</span>
                  </>
                )}
              </button>
              <span className="text-[#343439]">•</span>
              <div className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5" />
                <span className="font-mono text-[11px]">{exercise.videoViews}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-[#FF5356] font-bold text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Koç Onaylı</span>
            </div>
          </div>
        </div>

        {/* Purpose & Anatomy Summary Card */}
        <div className="rounded-2xl bg-[#1F1F24] border border-[#262936] p-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#292A2E] flex items-center justify-center shrink-0 text-[#FF5356] mt-0.5">
              <Target className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-extrabold text-[#FF5356] uppercase tracking-wider block">
                ASIL AMAÇ
              </span>
              <p className="text-xs text-white mt-1 leading-relaxed">
                {exercise.descriptionPurpose}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 bg-[#1A1B20] rounded-xl p-2.5 text-center border border-[#262936]">
            <div>
              <span className="text-[10px] font-extrabold text-[#A0A5B5] block uppercase">
                HEDEF KAS
              </span>
              <span className="text-xs font-bold text-white block mt-0.5 truncate">
                {exercise.targetMuscle.split(' ')[0]} {exercise.targetMuscle.split(' ')[1] || ''}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-[#A0A5B5] block uppercase">
                SİNERJİST
              </span>
              <span className="text-xs font-bold text-white block mt-0.5 truncate">
                {exercise.synergistMuscles}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-[#A0A5B5] block uppercase">
                TİP
              </span>
              <span className="text-xs font-bold text-white block mt-0.5 truncate">
                {exercise.type}
              </span>
            </div>
          </div>
        </div>

        {/* Step-by-Step Form Execution (3 Critical Phases) */}
        {exercise.steps && exercise.steps.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-base font-bold text-white">Adım Adım Form</h3>
              <span className="text-[11px] font-extrabold text-[#A0A5B5] uppercase tracking-wider">
                {exercise.steps.length} KRİTİK FAZ
              </span>
            </div>

            <div className="space-y-2">
              {exercise.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="rounded-xl bg-[#1F1F24] border border-[#262936] p-3.5 transition-colors hover:bg-[#292A2E]"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-7 h-7 rounded-lg bg-[#343439] text-[#FF5356] flex items-center justify-center shrink-0 font-mono font-extrabold text-sm border border-[#5A6072]/30">
                      {step.stepNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">{step.title}</h4>
                        <span className="text-[10px] font-bold text-[#A0A5B5] uppercase tracking-wider">
                          {step.subtitle}
                        </span>
                      </div>
                      <p className="text-xs text-[#A0A5B5] mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Mistakes (DO & DON'T) */}
        {exercise.mistakes && exercise.mistakes.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-base font-bold text-white">Form Hataları</h3>
              <span className="text-[11px] font-extrabold text-[#A0A5B5] uppercase tracking-wider">
                DOĞRU / YANLIŞ
              </span>
            </div>

            <div className="space-y-2">
              {exercise.mistakes.map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-[#1F1F24] border border-[#262936] p-3 flex items-start space-x-3"
                >
                  {m.type === 'avoid' ? (
                    <div className="w-6 h-6 rounded-lg bg-[#93000A]/40 border border-[#93000A] text-[#FFB4AB] flex items-center justify-center shrink-0 mt-0.5">
                      <CloseIcon className="w-3.5 h-3.5 stroke-[3px]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-[#1A1B20] border border-[#FF1E38]/50 text-[#FF5356] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3px]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-[10px] font-extrabold tracking-wider block ${
                        m.type === 'avoid' ? 'text-[#FF5356]' : 'text-emerald-400'
                      }`}
                    >
                      {m.title}
                    </span>
                    <p className="text-xs text-white mt-0.5">
                      {m.description}{' '}
                      {m.note && <span className="text-[#A0A5B5] font-normal">{m.note}</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Sticky Action CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/95 to-transparent z-40 border-t border-[#262936]">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleAddClick}
            className={`w-full h-14 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-xl active:scale-[0.99] ${
              isAdded
                ? 'bg-[#343439] text-[#FF5356] border border-[#FF1E38]/50'
                : 'bg-[#FF1E38] hover:bg-[#FF334B] text-white shadow-[#FF1E38]/25'
            }`}
          >
            {isAdded ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Antrenmana Eklendi (Kaldırmak İçin Dokun)</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                <span>Bu Hareketi Antrenmanıma Ekle</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50 animate-bounce">
          <div className="bg-[#292A2E] border border-[#FF1E38]/60 text-white p-3 rounded-xl shadow-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-[#FF5356]" />
              <span className="text-xs font-semibold">{toastMessage}</span>
            </div>
            <span className="text-[10px] font-extrabold text-[#A0A5B5] uppercase">
              TAMAMLANDI
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
