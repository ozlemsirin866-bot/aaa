import React, { useState } from 'react';
import { Bell, Flame, CheckCircle, Droplet, Dumbbell, X } from 'lucide-react';

interface HeaderProps {
  currentTab: 'daily' | 'workout' | 'nutrition' | 'analytics' | 'guide' | 'profile';
  focusMode: boolean;
  onToggleFocusMode: () => void;
  onOpenProfile: () => void;
  athleteName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  focusMode,
  onToggleFocusMode,
  onOpenProfile,
  athleteName = 'Utku Can ER',
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Çığ Etkisi Antrenmanı', text: 'Bugün Göğüs & Triceps Odaklı Hipertrofi seansınız hazır.', time: '10 dk önce', icon: Dumbbell, unread: true },
    { id: 2, title: 'Hidrasyon Hatırlatıcısı', text: 'Günlük hedefinize 700ml kaldı.', time: '35 dk önce', icon: Droplet, unread: true },
    { id: 3, title: 'Makro Hedefi', text: '142g protein kaydedildi (%78 tamamlandı).', time: '1 sa önce', icon: Flame, unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const getSubTitle = () => {
    switch (currentTab) {
      case 'daily':
        return 'Günlük';
      case 'workout':
        return 'Antrenman';
      case 'nutrition':
        return 'Beslenme';
      case 'analytics':
        return 'Analiz & Rapor';
      case 'guide':
        return 'Atlas & Biyomekanik';
      case 'profile':
        return 'Profil';
    }
  };

  const initials = athleteName
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#121317]/95 backdrop-blur-md border-b border-[#262936] shadow-sm select-none">
        <div className="max-w-md mx-auto px-4 h-15 flex items-center justify-between">
          {/* Brand Lockup: AVALANCHE */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF1E38] via-[#FF334B] to-[#990012] flex items-center justify-center shadow-[0_0_12px_rgba(255,30,56,0.35)] shrink-0">
              <span className="text-white font-extrabold text-xs tracking-tighter">▼▲</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base tracking-tight text-white leading-none">AVALANCHE</span>
                <span className="text-[10px] font-bold text-[#FF5356] tracking-wider leading-none">ÇIĞ</span>
              </div>
              <span className="text-[10px] font-semibold text-[#A0A5B5] tracking-wide uppercase leading-tight mt-0.5">
                {getSubTitle()}
              </span>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2">
            {/* Focus Mode Pill Toggle */}
            <button
              onClick={onToggleFocusMode}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all flex items-center space-x-1.5 border ${
                focusMode
                  ? 'bg-[#FF1E38]/20 border-[#FF1E38] text-[#FF5356] shadow-[0_0_10px_rgba(255,30,56,0.3)]'
                  : 'bg-[#1A1C24] border-[#262936] text-[#A0A5B5] hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${focusMode ? 'bg-[#FF1E38] animate-pulse' : 'bg-[#5A6072]'}`} />
              <span>ODAK MODU</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                aria-label="Bildirimler"
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 rounded-xl bg-[#1A1C24] border border-[#262936] flex items-center justify-center text-[#E3E2E8] hover:text-[#FF5356] transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF1E38] text-white text-[9px] font-bold flex items-center justify-center shadow-md">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[#1A1C24] border border-[#262936] rounded-xl shadow-2xl p-3 z-50 text-left">
                  <div className="flex items-center justify-between pb-2 border-b border-[#262936]">
                    <span className="text-xs font-bold text-white tracking-wider uppercase">Bildirimler ({unreadCount})</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] text-[#FF5356] hover:underline font-semibold"
                      >
                        Tümünü Oku
                      </button>
                    )}
                  </div>
                  <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                    {notifications.map(n => {
                      const IconComp = n.icon;
                      return (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-lg border flex items-start space-x-2.5 transition-colors ${
                            n.unread
                              ? 'bg-[#1F212B] border-[#FF1E38]/30'
                              : 'bg-[#13141B] border-[#262936] opacity-80'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#292A2E] flex items-center justify-center shrink-0 text-[#FF5356] mt-0.5">
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white leading-tight">{n.title}</p>
                            <p className="text-[11px] text-[#A0A5B5] leading-snug mt-0.5">{n.text}</p>
                            <span className="text-[9px] text-[#5A6072] font-mono mt-1 block">{n.time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Trigger */}
            <button
              aria-label="Profil"
              onClick={onOpenProfile}
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#343439] to-[#454752] border border-[#5A6072] flex items-center justify-center text-white hover:border-[#FF1E38] transition-all overflow-hidden"
            >
              <span className="text-xs font-bold text-white tracking-tight">{initials}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Focus Mode Overlay Indicator Bar if Active */}
      {focusMode && (
        <div className="bg-[#FF1E38] text-white py-1 px-4 text-center text-xs font-bold tracking-wider uppercase flex items-center justify-center space-x-2 select-none shadow-md z-30">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          <span>Odak Modu Aktif • Dikkat Dağıtıcı Bildirimler Duraklatıldı</span>
          <button
            onClick={onToggleFocusMode}
            className="ml-2 hover:opacity-80 p-0.5"
            aria-label="Odak modunu kapat"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </>
  );
};
