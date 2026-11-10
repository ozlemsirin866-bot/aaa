import React from 'react';

interface BiomechanicDiagramProps {
  type: 'bench-press' | 'incline-press' | 'seated-row' | 'lateral-raise' | 'rdl' | 'pushdown' | 'crunch';
  showLabels?: boolean;
}

export const BiomechanicDiagram: React.FC<BiomechanicDiagramProps> = ({ type, showLabels = true }) => {
  return (
    <div className="relative w-full aspect-video bg-[#0D0E12] rounded-xl border border-[#262936] overflow-hidden flex items-center justify-center p-3 select-none">
      {/* Background blueprint grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#A0A5B5" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Dynamic Diagram by Exercise */}
      {type === 'bench-press' && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-[190px]">
          {/* Bench Line */}
          <line x1="80" y1="150" x2="320" y2="150" stroke="#343439" strokeWidth="8" strokeLinecap="round" />
          <line x1="120" y1="150" x2="120" y2="190" stroke="#262936" strokeWidth="5" />
          <line x1="280" y1="150" x2="280" y2="190" stroke="#262936" strokeWidth="5" />

          {/* Torso & Head */}
          <ellipse cx="140" cy="138" rx="14" ry="12" fill="#292A2E" stroke="#5A6072" strokeWidth="2" />
          <path d="M 155 142 Q 220 135 270 148" fill="none" stroke="#E3E2E8" strokeWidth="12" strokeLinecap="round" />
          
          {/* Active Highlight Pectoral Muscles (Red Glow) */}
          <path d="M 180 132 Q 215 125 240 135" fill="none" stroke="#FF1E38" strokeWidth="8" strokeLinecap="round" filter="drop-shadow(0 0 8px rgba(255,30,56,0.8))" />
          
          {/* Arms & Barbell in Bottom Position */}
          <g>
            {/* Shoulder to elbow angle 75 deg */}
            <line x1="190" y1="135" x2="190" y2="168" stroke="#E3E2E8" strokeWidth="6" strokeLinecap="round" />
            <line x1="190" y1="168" x2="208" y2="115" stroke="#E3E2E8" strokeWidth="6" strokeLinecap="round" />
            
            {/* Triceps vector highlight */}
            <line x1="192" y1="140" x2="192" y2="165" stroke="#FF5356" strokeWidth="3" />
            
            {/* Barbell Path & Bar */}
            <line x1="60" y1="115" x2="340" y2="115" stroke="#FFFFFF" strokeWidth="4" />
            <circle cx="208" cy="115" r="5" fill="#FF1E38" />
            <rect x="70" y="95" width="8" height="40" rx="2" fill="#5A6072" />
            <rect x="322" y="95" width="8" height="40" rx="2" fill="#5A6072" />

            {/* Angle Indicator Arc (75°) */}
            <path d="M 190 150 A 15 15 0 0 1 200 160" fill="none" stroke="#FF1E38" strokeWidth="2" strokeDasharray="2 2" />
            <text x="210" y="165" fill="#FF1E38" fontSize="10" fontFamily="sans-serif" fontWeight="700">75° AÇI</text>
          </g>

          {/* Starting Position Ghost Silhouette */}
          <g opacity="0.35">
            <line x1="190" y1="135" x2="208" y2="60" stroke="#A0A5B5" strokeWidth="4" strokeLinecap="round" strokeDasharray="3 3" />
            <line x1="60" y1="60" x2="340" y2="60" stroke="#A0A5B5" strokeWidth="2" strokeDasharray="4 4" />
          </g>

          {/* Biomechanical Telemetry Labels */}
          {showLabels && (
            <>
              <text x="18" y="24" fill="#FF1E38" fontSize="10" fontWeight="800" letterSpacing="0.08em">AKTİVASYON: %88</text>
              <text x="18" y="40" fill="#A0A5B5" fontSize="9" fontWeight="600">PEKTORAL GERİLİM VEKTÖRÜ</text>
              <text x="290" y="24" fill="#E3E2E8" fontSize="9" fontWeight="700">TABAN FAZI</text>
              <line x1="208" y1="110" x2="208" y2="65" stroke="#FF1E38" strokeWidth="1.5" strokeDasharray="2 2" />
              <polygon points="205,70 208,62 211,70" fill="#FF1E38" />
              <text x="218" y="88" fill="#FF1E38" fontSize="9" fontWeight="600">İtiş Vektörü</text>
            </>
          )}
        </svg>
      )}

      {type === 'incline-press' && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-[190px]">
          {/* Incline Bench at 30 degrees */}
          <line x1="100" y1="180" x2="280" y2="75" stroke="#343439" strokeWidth="8" strokeLinecap="round" />
          <line x1="100" y1="180" x2="70" y2="180" stroke="#262936" strokeWidth="6" />
          <line x1="190" y1="130" x2="190" y2="190" stroke="#262936" strokeWidth="5" />

          {/* Torso reclined 30 deg */}
          <path d="M 120 170 L 260 85" stroke="#E3E2E8" strokeWidth="12" strokeLinecap="round" />
          <circle cx="275" cy="75" r="14" fill="#292A2E" stroke="#5A6072" strokeWidth="2" />

          {/* Clavicular Upper Chest Glow */}
          <line x1="200" y1="120" x2="245" y2="92" stroke="#FF1E38" strokeWidth="8" strokeLinecap="round" filter="drop-shadow(0 0 8px rgba(255,30,56,0.9))" />

          {/* Arm & Dumbbell */}
          <line x1="220" y1="105" x2="210" y2="140" stroke="#E3E2E8" strokeWidth="6" strokeLinecap="round" />
          <line x1="210" y1="140" x2="225" y2="80" stroke="#E3E2E8" strokeWidth="6" strokeLinecap="round" />
          {/* Dumbbell */}
          <rect x="215" y="70" width="20" height="8" rx="2" fill="#FF1E38" transform="rotate(-15 225 74)" />
          <circle cx="212" cy="72" r="7" fill="#5A6072" />
          <circle cx="236" cy="76" r="7" fill="#5A6072" />

          {/* 30° Arc */}
          <path d="M 140 180 A 40 40 0 0 1 155 150" fill="none" stroke="#FF1E38" strokeWidth="2" />
          <text x="160" y="172" fill="#FF1E38" fontSize="10" fontWeight="700">30° SEHPA</text>

          {showLabels && (
            <>
              <text x="18" y="24" fill="#FF1E38" fontSize="10" fontWeight="800">ÜST GÖĞÜS (KLAVİKÜLER)</text>
              <text x="18" y="40" fill="#A0A5B5" fontSize="9" fontWeight="600">Aktivasyon: %92 • RPE 8.5</text>
            </>
          )}
        </svg>
      )}

      {type === 'seated-row' && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-[190px]">
          {/* Seat & Cable Machine Foot Rest */}
          <line x1="120" y1="165" x2="260" y2="165" stroke="#343439" strokeWidth="8" />
          <line x1="80" y1="120" x2="80" y2="175" stroke="#262936" strokeWidth="6" strokeLinecap="round" />

          {/* Athlete Spine (90 degrees neutral) */}
          <line x1="200" y1="160" x2="200" y2="85" stroke="#E3E2E8" strokeWidth="12" strokeLinecap="round" />
          <circle cx="200" cy="70" r="13" fill="#292A2E" stroke="#5A6072" strokeWidth="2" />

          {/* Latissimus & Rhomboid Highlight Glow */}
          <path d="M 195 95 Q 185 125 195 145" fill="none" stroke="#FF1E38" strokeWidth="8" strokeLinecap="round" filter="drop-shadow(0 0 8px rgba(255,30,56,0.9))" />
          
          {/* Arms pulling V-bar to navel */}
          <line x1="195" y1="95" x2="235" y2="120" stroke="#E3E2E8" strokeWidth="6" strokeLinecap="round" />
          <line x1="235" y1="120" x2="165" y2="128" stroke="#E3E2E8" strokeWidth="6" strokeLinecap="round" />
          
          {/* Cable line to pulley */}
          <line x1="165" y1="128" x2="40" y2="128" stroke="#FF1E38" strokeWidth="2.5" strokeDasharray="3 3" />
          <circle cx="40" cy="128" r="8" fill="#343439" stroke="#E3E2E8" strokeWidth="2" />

          {showLabels && (
            <>
              <text x="18" y="24" fill="#FF1E38" fontSize="10" fontWeight="800">LATISSIMUS DORSI & RHOMBOIDS</text>
              <text x="18" y="40" fill="#A0A5B5" fontSize="9" fontWeight="600">Dirsek Sürüşü • Skapular Retraksiyon</text>
              <text x="215" y="112" fill="#FF1E38" fontSize="9" fontWeight="700">90° Gövde</text>
            </>
          )}
        </svg>
      )}

      {type === 'lateral-raise' && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-[190px]">
          {/* Torso standing */}
          <line x1="200" y1="180" x2="200" y2="90" stroke="#E3E2E8" strokeWidth="14" strokeLinecap="round" />
          <circle cx="200" cy="72" r="14" fill="#292A2E" stroke="#5A6072" strokeWidth="2" />

          {/* Left & Right Lateral Deltoids Glowing Red */}
          <circle cx="184" cy="94" r="8" fill="#FF1E38" filter="drop-shadow(0 0 6px rgba(255,30,56,0.9))" />
          <circle cx="216" cy="94" r="8" fill="#FF1E38" filter="drop-shadow(0 0 6px rgba(255,30,56,0.9))" />

          {/* Left Arm Raised in Scapular Plane (15° forward) */}
          <line x1="184" y1="94" x2="110" y2="98" stroke="#E3E2E8" strokeWidth="6" strokeLinecap="round" />
          <circle cx="104" cy="98" r="7" fill="#5A6072" />

          {/* Right Arm Raised */}
          <line x1="216" y1="94" x2="290" y2="98" stroke="#E3E2E8" strokeWidth="6" strokeLinecap="round" />
          <circle cx="296" cy="98" r="7" fill="#5A6072" />

          {/* Motion Arc */}
          <path d="M 125 150 Q 110 120 110 98" fill="none" stroke="#FF1E38" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M 275 150 Q 290 120 290 98" fill="none" stroke="#FF1E38" strokeWidth="2" strokeDasharray="3 3" />

          {showLabels && (
            <>
              <text x="18" y="24" fill="#FF1E38" fontSize="10" fontWeight="800">YAN DELTOİD (MEDIAL HEAD)</text>
              <text x="18" y="40" fill="#A0A5B5" fontSize="9" fontWeight="600">15-20° Skapular Düzlem Açısı</text>
            </>
          )}
        </svg>
      )}

      {type === 'rdl' && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-[190px]">
          {/* Ground */}
          <line x1="80" y1="195" x2="320" y2="195" stroke="#262936" strokeWidth="4" />

          {/* Legs standing with slight knee flexion */}
          <line x1="210" y1="195" x2="205" y2="145" stroke="#E3E2E8" strokeWidth="8" strokeLinecap="round" />
          <line x1="205" y1="145" x2="225" y2="110" stroke="#E3E2E8" strokeWidth="8" strokeLinecap="round" />

          {/* Hips Hinged Back (Red Hamstring & Glute Glow) */}
          <line x1="205" y1="145" x2="225" y2="110" stroke="#FF1E38" strokeWidth="6" strokeLinecap="round" filter="drop-shadow(0 0 8px rgba(255,30,56,0.9))" />

          {/* Torso leaning forward flat spine */}
          <line x1="225" y1="110" x2="160" y2="90" stroke="#E3E2E8" strokeWidth="12" strokeLinecap="round" />
          <circle cx="145" cy="85" r="12" fill="#292A2E" stroke="#5A6072" strokeWidth="2" />

          {/* Arms holding barbell close to shins */}
          <line x1="170" y1="95" x2="190" y2="155" stroke="#E3E2E8" strokeWidth="5" strokeLinecap="round" />
          <circle cx="190" cy="155" r="9" fill="#FF1E38" />

          {/* Hip hinge arrow */}
          <path d="M 230 110 L 260 110" stroke="#FF1E38" strokeWidth="2" strokeDasharray="2 2" />
          <polygon points="260,107 267,110 260,113" fill="#FF1E38" />
          <text x="240" y="100" fill="#FF1E38" fontSize="9" fontWeight="700">Kalça Menteşesi</text>

          {showLabels && (
            <>
              <text x="18" y="24" fill="#FF1E38" fontSize="10" fontWeight="800">POSTERİOR ZİNCİR & HAMSTRINGS</text>
              <text x="18" y="40" fill="#A0A5B5" fontSize="9" fontWeight="600">Nötr Lomber Omurga • Derin Esneme</text>
            </>
          )}
        </svg>
      )}

      {type === 'pushdown' && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-[190px]">
          {/* Athlete Torso */}
          <line x1="200" y1="180" x2="200" y2="90" stroke="#E3E2E8" strokeWidth="14" strokeLinecap="round" />
          <circle cx="200" cy="72" r="14" fill="#292A2E" />

          {/* Upper Arm Pinned to Torso */}
          <line x1="195" y1="92" x2="195" y2="135" stroke="#E3E2E8" strokeWidth="6" strokeLinecap="round" />
          
          {/* Triceps Lateral Head Glow */}
          <line x1="198" y1="96" x2="198" y2="130" stroke="#FF1E38" strokeWidth="5" strokeLinecap="round" filter="drop-shadow(0 0 8px rgba(255,30,56,0.9))" />

          {/* Forearm extended down */}
          <line x1="195" y1="135" x2="175" y2="185" stroke="#E3E2E8" strokeWidth="6" strokeLinecap="round" />
          <circle cx="172" cy="188" r="6" fill="#5A6072" />

          {/* Rope Cable */}
          <line x1="150" y1="30" x2="172" y2="188" stroke="#FF1E38" strokeWidth="2" strokeDasharray="3 3" />

          {showLabels && (
            <>
              <text x="18" y="24" fill="#FF1E38" fontSize="10" fontWeight="800">TRICEPS BRACHII (LATERAL/MEDIAL)</text>
              <text x="18" y="40" fill="#A0A5B5" fontSize="9" fontWeight="600">Sabit Dirsek Ekseni • Tam Terminal Ekstansiyon</text>
            </>
          )}
        </svg>
      )}

      {type === 'crunch' && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-[190px]">
          {/* Kneeling Mat & Legs */}
          <line x1="120" y1="180" x2="280" y2="180" stroke="#262936" strokeWidth="6" />
          <line x1="220" y1="180" x2="220" y2="140" stroke="#E3E2E8" strokeWidth="8" strokeLinecap="round" />

          {/* Pelvis fixed 90 degrees */}
          <circle cx="220" cy="140" r="8" fill="#5A6072" />

          {/* Spine Flexing Forward in Arc */}
          <path d="M 220 140 Q 185 130 160 155" fill="none" stroke="#E3E2E8" strokeWidth="12" strokeLinecap="round" />
          
          {/* Rectus Abdominis Contracted Glowing Red */}
          <path d="M 210 142 Q 180 135 170 152" fill="none" stroke="#FF1E38" strokeWidth="8" strokeLinecap="round" filter="drop-shadow(0 0 8px rgba(255,30,56,0.9))" />

          {/* Head & Hands at Temples */}
          <circle cx="150" cy="165" r="12" fill="#292A2E" stroke="#5A6072" strokeWidth="2" />
          <line x1="130" y1="40" x2="150" y2="165" stroke="#FF1E38" strokeWidth="2" strokeDasharray="3 3" />

          {showLabels && (
            <>
              <text x="18" y="24" fill="#FF1E38" fontSize="10" fontWeight="800">RECTUS ABDOMINIS (TAM KARIN)</text>
              <text x="18" y="40" fill="#A0A5B5" fontSize="9" fontWeight="600">Sabit Pelvis • Omurga Yuvarlama</text>
            </>
          )}
        </svg>
      )}
    </div>
  );
};
