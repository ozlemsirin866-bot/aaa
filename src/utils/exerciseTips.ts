export interface ExerciseTipInfo {
  criticalMistake: string;
  formCues: string[];
  breathing: string;
  tempo: string;
  focusMuscle: string;
}

export const EXERCISE_TIPS_DATABASE: Record<string, ExerciseTipInfo> = {
  // Göğüs Makineleri & Serbest Ağırlık
  'chest-press-machine': {
    criticalMistake: 'Koltuk ayarını yanlış yapıp tutacakları omuz hizasının üstüne almak veya dirsekleri tepe noktada kilitlemek.',
    formCues: [
      'Koltuk yüksekliğini tutacaklar meme ucu / alt göğüs hizasına gelecek şekilde ayarlayın.',
      'Kürek kemiklerinizi arkaya kenetleyip (skapular retraksiyon) göğsünüzü öne çıkarın.',
      'İtişte dirseklerinizi kitlemeden tepe noktada göğüs kaslarınızı 1 saniye sıkın.',
    ],
    breathing: 'İtiş yaparken güçlü nefes verin, kontrollü geri gelişte (2-3 saniye) nefes alın.',
    tempo: '2 sn iniş (negatif) • 0 sn bekleme • 1 sn patlayıcı itiş (2-0-1)',
    focusMuscle: 'Orta & Alt Göğüs Lifleri, Ön Omuz, Triceps',
  },
  'incline-bench-dumbbell-press': {
    criticalMistake: 'Dirsekleri 90° yanlara açmak omuz eklem kapsülüne aşırı rotatör yükü bindirir; sehpaya 45 dereceden dik açı vermeyin.',
    formCues: [
      'Sehpayı 30° ile en fazla 45° arasına ayarlayın (daha dik açı yükü omuza kaydırır).',
      'Dirseklerinizi gövdenize yaklaşık 45-60 derecelik güvenli açıyla yönlendirin.',
      'Dambılları birbirine çarptırmadan tavana doğru üst göğüs liflerini sıkarak itin.',
    ],
    breathing: 'Yukarı iterken nefes verin, göğüs hizasına kontrollü indirirken derin nefes alın.',
    tempo: '3 sn kontrollü indiriş • 1 sn tepe kasılma (3-0-1)',
    focusMuscle: 'Klaviküler Üst Göğüs Başı (Köprücük Kemik Altı)',
  },
  'pec-dec-flying': {
    criticalMistake: 'Kolları geriye alırken aşırı esnetip omuz ön bağlarını zorlamak veya dirsekleri düzleştirmek.',
    formCues: [
      'Dirseklerinizi hafif bükülü (yay şeklinde) sabit tutun; dirsek eklemini asla oynatmayın.',
      'Kolları birleştirirken elleri değil, dirsekleri birbirine yaklaştırıyormuş gibi odaklanın.',
      'Tepe noktada göğüs liflerini adeta bir ceviz kırıyormuş gibi 1.5 saniye sıkıştırın.',
    ],
    breathing: 'Kolları kapatırken nefes verin, geriye açarken göğsü şişirerek nefes alın.',
    tempo: '2.5 sn kontrollü açılış • 1 sn tepe sıkıştırma (2-1-1)',
    focusMuscle: 'İç & Orta Göğüs İzolasyonu',
  },
  'cable-cross-over': {
    criticalMistake: 'Belden salınım (momentum) alarak vücudu öne-arkaya sallamak veya kolları fazla büküp itişe çevirmek.',
    formCues: [
      'Gövdenizi yaklaşık 15-20° öne eğin, bir ayağınızı öne alarak sağlam bir denge tabanı kurun.',
      'Hareketi gövde hareketiyle değil, sadece göğüs kaslarının kısalmasıyla gerçekleştirin.',
      'Kabloları alt göbek hizasında çaprazlayarak alt ve iç göğüs liflerini kitleyin.',
    ],
    breathing: 'Kabloları birleştirirken nefes verin, geriye açılırken göğüs kafesini açarak nefes alın.',
    tempo: '2 sn kontrollü geriye bırakış • 1 sn tepe sıkışma',
    focusMuscle: 'Alt & Sternal Göğüs Lifleri, Göğüs Ayrımı',
  },
  'triceps-push-down': {
    criticalMistake: 'Dirsekleri yanlara açmak veya dirsekleri ileri-geri savurarak omuzdan yardım almak.',
    formCues: [
      'Dirseklerinizi kaburga kemiklerinize yapıştırın ve hareket boyunca tek bir milimetre bile oynatmayın.',
      'Sadece ön kollarınız hareket etsin; barı aşağı bastırırken bilekleri bükmeyin.',
      'Alt noktada triceps kasınızı tam kitleyip 1 saniye bekleyin.',
    ],
    breathing: 'Barı aşağı iterken nefes verin, 90 dereceye kadar yükseltirken nefes alın.',
    tempo: '2 sn yukarı kontrollü bırakış • 1 sn dipte kilit (2-0-1-1)',
    focusMuscle: 'Triceps Lateral (Dış) & Medial Baş',
  },
  'french-press-triceps': {
    criticalMistake: 'Dirseklerin iki yana açılmasına izin vermek veya barı alına / kafaya kontrolsüz hızla düşürmek.',
    formCues: [
      'Kollarınızı tavana dik tutun, dirseklerinizi içeriye doğru hafifçe kilitleyin.',
      'Hareketi sadece dirsek ekleminden bükerek ağırlığı başın arkasına / tepeye doğru indirin.',
      'İtişte tricepsin uzun başındaki gerilimi hissederek yukarı uzanın.',
    ],
    breathing: 'Ağırlığı tavana doğru iterken nefes verin, başın arkasına indirirken nefes alın.',
    tempo: '3 sn negatif iniş • 1 sn patlayıcı itiş (3-0-1)',
    focusMuscle: 'Triceps Long Head (Arka Kol Uzun Baş - Kolu Kalın Gösteren Bölge)',
  },
  'bench-press': {
    criticalMistake: 'Barı göğüste zıplatmak, kalçayı sehpadan kaldırmak veya dirsekleri 90° yanlara açmak.',
    formCues: [
      'Ayak tabanlarınızı yere yapıştırın, kürek kemiklerinizi geriye sıkıştırıp sehpaya kitleyin.',
      'Barı meme ucunun hemen altına kontrollü şekilde 2-3 saniyede indirin.',
      'Dirseklerinizi gövdenize yaklaşık 45-70° açıyla yönlendirin, bilekleri geriye bükmeyin.',
    ],
    breathing: 'Barı göğse indirirken nefes alın, göğüsten yukarı iterken güçlüce nefes verin.',
    tempo: '2.5 sn kontrollü iniş • 0 sn bekleme • 1 sn güçlü itiş',
    focusMuscle: 'Tüm Pektoralis Majör (Göğüs), Ön Omuz, Triceps',
  },
  'barbell-bench-press': {
    criticalMistake: 'Barı göğüste zıplatmak, kalçayı sehpadan kaldırmak veya dirsekleri 90° yanlara açmak.',
    formCues: [
      'Ayak tabanlarınızı yere yapıştırın, kürek kemiklerinizi geriye sıkıştırıp sehpaya kitleyin.',
      'Barı meme ucunun hemen altına kontrollü şekilde 2-3 saniyede indirin.',
      'Dirseklerinizi gövdenize yaklaşık 45-70° açıyla yönlendirin, bilekleri geriye bükmeyin.',
    ],
    breathing: 'Barı göğse indirirken nefes alın, göğüsten yukarı iterken güçlüce nefes verin.',
    tempo: '2.5 sn kontrollü iniş • 0 sn bekleme • 1 sn güçlü itiş',
    focusMuscle: 'Tüm Pektoralis Majör (Göğüs), Ön Omuz, Triceps',
  },
  'incline-bench-press': {
    criticalMistake: 'Sehpayı 45 dereceden dik yapmak veya barı boğaz hizasına indirmek (omuz sakatlığı riski).',
    formCues: [
      'Açıyı 30 dereceye ayarlayın; barı köprücük kemiğinin 2-3 parmak altına kontrollü indirin.',
      'Kürek kemiklerini sehpaya gömün, kalçayı sehpadan ayırmayın.',
    ],
    breathing: 'İtişte nefes verin, indirişte derin nefes alın.',
    tempo: '2.5 sn iniş • 1 sn itiş',
    focusMuscle: 'Üst Göğüs Lifleri',
  },
  'dumbbell-bench-press': {
    criticalMistake: 'Dambılları kontrolsüzce savurmak veya birbirine çarparak dengeyi kaybetmek.',
    formCues: [
      'Dambılları aşağıda derin esneme sağlayacak derinliğe kadar indirin.',
      'Tepede dambılları birbirine çarptırmadan göğüs kaslarını birbirine doğru sıkın.',
    ],
    breathing: 'İtişte nefes verin, indirişte nefes alın.',
    tempo: '2.5 sn negatif • 1 sn pozitif',
    focusMuscle: 'Göğüs Derin Lifleri & Dengeleyici Kaslar',
  },
  'dumbbell-lateral-raise': {
    criticalMistake: 'Ağır kilo takıp gövdeyi sallayarak (momentum) kaldırmak veya kolları omuz seviyesinden çok yukarı savurmak.',
    formCues: [
      'Dirseklerinizi hafif bükülü tutun, serçe parmağınızı hafifçe yukarıya doğru yönlendirin.',
      'Dambılları yukarı değil, adeta iki yana doğru uzatıyormuş gibi kaldırın.',
      'Omuz hizasına (paralel) geldiğinizde yarım saniye duraklayın, kontrollü indirin.',
    ],
    breathing: 'Kolları yana açarken nefes verin, aşağı indirirken nefes alın.',
    tempo: '2 sn kontrollü iniş • 1 sn kaldırış • 0.5 sn tepe duraklama',
    focusMuscle: 'Yan Omuz (Lateral Deltoid - Omuz Genişliği)',
  },
  'standing-barbell-press': {
    criticalMistake: 'Ağırlığı kaldırırken beli aşırı geriye bükmek (L4-L5 disk baskısı) veya dizleri bükerek push press yapmak.',
    formCues: [
      'Karın ve kalça kaslarınızı sımsıkı kilitleyin (bacaklar düz, korse sıkı).',
      'Bar çenenizi geçerken başınızı hafifçe geriye alın, bar geçtikten sonra başı öne doğal hizaya getirin.',
      'Tepe noktada barı tam başınızın üzerinde kitleyin.',
    ],
    breathing: 'Yukarı preslerken nefes verin, köprücük kemiğine indirirken nefes alın.',
    tempo: '2 sn kontrollü iniş • 1 sn pres',
    focusMuscle: 'Ön & Yan Omuz, Triceps, Karın Core',
  },
  'lat-pulldown': {
    criticalMistake: 'Barı ense arkasına çekmek veya geriye 45° yatarak sırt hareketini kollarla çekişe çevirmek.',
    formCues: [
      'Dizlerinizi pedin altına sağlam yerleştirin, gövdenizi en fazla 10-15° geriye yaslayın.',
      'Çekişi bileklerle değil dirseklerle başlatın; dirseklerinizi ceplerinize doğru çekiyormuş gibi yapın.',
      'Barı üst göğüs kemiğine kadar çekip kürek kemiklerinizi birbirine kenetleyin.',
    ],
    breathing: 'Barı göğse çekerken nefes verin, kollar yukarı uzanırken sırt kaslarını esneterek nefes alın.',
    tempo: '2.5 sn kontrollü yukarı bırakış • 1 sn alt noktada sıkıştırma',
    focusMuscle: 'Latissimus Dorsi (Kanat Kası - V-Taper Sırt)',
  },
  'seated-cable-row': {
    criticalMistake: 'Beli yuvarlayarak öne eğilmek ve geriye doğru momentumla sallanmak.',
    formCues: [
      'Göğsünüzü dik tutun, dizler hafif bükülü kalsın, beli asla bükmeyin.',
      'Kolları öne uzatırken kürek kemiklerini açın; çekerken dirsekleri geriye sürüp göbeğin alt hizasına çekin.',
      'Tepe noktada kürek kemiklerini 1 saniye kenetleyin.',
    ],
    breathing: 'Gövdeye çekerken nefes verin, öne kontrollü bırakırken nefes alın.',
    tempo: '2 sn öne kontrollü esneme • 1 sn çekiş',
    focusMuscle: 'Orta Sırt, Rhomboids, Kanat, Arka Omuz',
  },
  'barbell-bent-over-row': {
    criticalMistake: 'Sırtı kamburlaştırmak (ağır bel fıtığı riski) veya gövdeyi dikleştirip trapez çekişine çevirmek.',
    formCues: [
      'Kalçayı geriye itin, sırtınızı düz bir tahta gibi 45° açıda sabitleyin.',
      'Barı diz kapağının hemen altından kasık / alt karın hizasına doğru dirseklerle çekin.',
    ],
    breathing: 'Çekerken nefes verin, indirirken kontrollü nefes alın.',
    tempo: '2 sn iniş • 1 sn çekiş',
    focusMuscle: 'Tüm Sırt Kalınlığı & Alt Sırt Dengeleyicileri',
  },
  'barbell-back-squat': {
    criticalMistake: 'Dizlerin içeri çökmesi (valgus) ve inişte belin yuvarlanması (butt wink); topukların yerden kalkması.',
    formCues: [
      'Ayaklarınızı omuz genişliğinde açın, parmak uçlarını 15-30° dışarı çevirin.',
      'İlk hareketi kalçayı geriye iterek (sandalyeye oturur gibi) başlatın.',
      'Dizlerinizi ayak parmaklarınızın gösterdiği yöne doğru açın; ağırlığı topuklara ve orta ayağa verin.',
      'Paralel seviyeye (uyluk yere paralel) kadar inip topuklardan patlayıcı güçle doğrulun.',
    ],
    breathing: 'Yukarıda derin nefes alıp karın içine kitleyin (Valsalva), kalktıktan sonra nefes verin.',
    tempo: '3 sn kontrollü çöküş • 1 sn dipte kontrol • 1 sn kalkış (3-1-1)',
    focusMuscle: 'Quadriceps (Ön Bacak), Gluteus Maximus (Kalça), Hamstrings, Core',
  },
  'leg-press-45': {
    criticalMistake: 'Tepe noktada dizleri kitlemek (tehlikeli diz hiperekstansiyonu) veya kalçayı koltuktan kaldırmak.',
    formCues: [
      'Kalçanızı ve belinizi koltuğa sımsıkı yapıştırın, tutacakları kendinize doğru çekin.',
      'Platformu 90 derece diz açısına kadar kontrollü indirin.',
      'İtiş yaparken dizlerinizi kitlemeden hafif bükülü bırakın.',
    ],
    breathing: 'İtişte nefes verin, platform yaklaşırken nefes alın.',
    tempo: '3 sn negatif iniş • 1.5 sn güçlü itiş',
    focusMuscle: 'Quadriceps (Ön Bacak) & Kalça',
  },
  'lying-leg-curl': {
    criticalMistake: 'Ağırlığı kaldırırken kalçayı sehpadan havalandırmak veya beli aşırı bükmek.',
    formCues: [
      'Kalça kemiklerinizi sehpaya bastırın, ayak bileklerini pedin altına yerleştirin.',
      'Topukları kalçaya doğru çekerken arka bacak kaslarınızı sıkın.',
      'İnişte ağırlığın sizi çekmesine izin vermeyin, 2.5 saniyede kontrollü bırakın.',
    ],
    breathing: 'Bacakları bükerken nefes verin, uzatırken nefes alın.',
    tempo: '2.5 sn iniş • 1 sn kasılma',
    focusMuscle: 'Hamstrings (Arka Bacak İzolasyonu)',
  },
  'barbell-deadlift': {
    criticalMistake: 'Sırtı yuvarlamak (kamburlaşmak), barı kaval kemiğinden uzaklaştırmak veya tepede aşırı geriye yaslanmak.',
    formCues: [
      'Bar ayaklarınızın ortasında kaval kemiğine 2-3 cm mesafede olmalı.',
      'Lat kaslarınızı kilitleyin, göğsü dikleştirin, kalçayı arkaya menteşeleyin.',
      'Yeri bacaklarınızla iterek barı vücudunuza yapışık şekilde yukarı sürün.',
    ],
    breathing: 'Harekete başlamadan önce nefesi karın boşluğuna kitleyin, tepeye ulaştıktan sonra verin.',
    tempo: '1.5 sn kalkış • 2.5 sn kontrollü iniş',
    focusMuscle: 'Arka Zincir: Hamstrings, Glutes, Erector Spinae (Bel), Sırt',
  },
  'cable-face-pull': {
    criticalMistake: 'Dirsekleri aşağıda tutarak hareketi sırt çekişine çevirmek veya ağır kiloyla vücudu sallamak.',
    formCues: [
      'Halatı burnunuza veya alnınıza doğru çekerken dirsekleri yüksek ve yanlarda tutun.',
      'Hareketin sonunda elleri dışa doğru açarak dış rotasyon uygulayın (omuz sağlığı için kritik).',
      'Arka omuz ve üst sırt kaslarını 1 saniye sıkın.',
    ],
    breathing: 'Yüze doğru çekerken nefes verin, öne uzanırken nefes alın.',
    tempo: '2 sn öne bırakış • 1 sn çekiş • 1 sn dış rotasyon tutuşu',
    focusMuscle: 'Arka Omuz (Rear Deltoid), Rotator Cuff, Omuz Postürü',
  },
};

export const getComprehensiveExerciseTips = (exerciseId: string, exMeta?: Partial<any>): ExerciseTipInfo => {
  // 1. Direct database match
  if (EXERCISE_TIPS_DATABASE[exerciseId]) {
    return EXERCISE_TIPS_DATABASE[exerciseId];
  }

  // 2. Fallback matching based on ID keywords
  const id = exerciseId.toLowerCase();
  for (const [key, value] of Object.entries(EXERCISE_TIPS_DATABASE)) {
    if (id.includes(key) || key.includes(id)) {
      return value;
    }
  }

  // 3. Fallback based on movement category or muscle group
  const cat = (exMeta?.category || '').toLowerCase();
  const muscle = (exMeta?.targetMuscle || '').toLowerCase();
  const name = (exMeta?.name || exerciseId).toLowerCase();

  if (id.includes('press') || cat.includes('itiş') || muscle.includes('göğüs')) {
    return {
      criticalMistake: exMeta?.criticalMistake || 'Dirsekleri 90° yanlara aşırı açarak omuz kapsülüne kesme kuvveti bindirmek veya eklemleri kitlemek.',
      formCues: [
        'Kürek kemiklerini sehpaya / koltuğa kilitleyin (skapular retraksiyon) ve göğsü öne çıkarın.',
        'Dirsekleri gövdeye 45-60° açıyla tutarak omuzları koruyun.',
        'Tepe noktada göğüs kaslarını 1 saniye sıkıştırın, eklemleri kitlemeyin.',
      ],
      breathing: 'İtişte güçlü nefes verin, kontrollü indirişte (2-3 saniye) derin nefes alın.',
      tempo: '2-3 sn negatif iniş • 1 sn patlayıcı itiş (3-0-1)',
      focusMuscle: exMeta?.targetMuscle || 'Göğüs, Ön Omuz, Triceps',
    };
  }

  if (id.includes('pull') || id.includes('row') || cat.includes('çekiş') || muscle.includes('sırt')) {
    return {
      criticalMistake: exMeta?.criticalMistake || 'Beli bükerek veya belden salınım (momentum) alarak çekmek; bileklerle çekiş yapmak.',
      formCues: [
        'Göğsü dik tutun, çekişi bileklerle değil dirseklerle başlatın.',
        'Dirsekleri geriye sürerek kürek kemiklerini birbirine kenetleyin.',
        'Tepe noktada sırt liflerini 1 saniye sıkıştırın, öne kontrollü esnetin.',
      ],
      breathing: 'Çekerken nefes verin, ağırlığı bırakırken derin nefes alın.',
      tempo: '2.5 sn kontrollü uzanış • 1 sn sıkıştırma',
      focusMuscle: exMeta?.targetMuscle || 'Sırt (Kanat & Orta Sırt)',
    };
  }

  if (id.includes('squat') || id.includes('leg') || cat.includes('bacak') || muscle.includes('bacak')) {
    return {
      criticalMistake: exMeta?.criticalMistake || 'Dizlerin içe çökmesi veya tepe noktada dizleri aşırı kitlemek; topukların yerden kalkması.',
      formCues: [
        'Ağırlığı topuklara ve orta ayağa verin, dizleri ayak ucu hizasında açın.',
        'Kalçayı arkaya itin, sırtı dik ve göğsü açık tutun.',
        'Tepe noktada dizleri kitlemeden bacak ve kalça kaslarını sıkın.',
      ],
      breathing: 'Çökerken nefes alın ve karında tutun, kalkışta nefes verin.',
      tempo: '3 sn kontrollü iniş • 1 sn patlayıcı kalkış',
      focusMuscle: exMeta?.targetMuscle || 'Bacak & Kalça Grubu',
    };
  }

  if (id.includes('triceps') || id.includes('pushdown') || muscle.includes('triceps')) {
    return {
      criticalMistake: exMeta?.criticalMistake || 'Dirsekleri gövdeden ayırarak omuzdan yardım almak.',
      formCues: [
        'Dirsekleri kaburgalara sabitleyin, sadece ön kollar hareket etsin.',
        'Dip noktada triceps kasını 1 saniye tam sıkıştırın.',
      ],
      breathing: 'İterken nefes verin, bırakırken nefes alın.',
      tempo: '2 sn bırakış • 1 sn itiş',
      focusMuscle: exMeta?.targetMuscle || 'Triceps (Arka Kol)',
    };
  }

  if (id.includes('biceps') || id.includes('curl') || muscle.includes('biceps')) {
    return {
      criticalMistake: exMeta?.criticalMistake || 'Beli geriye atarak momentumla kaldırmak.',
      formCues: [
        'Dirsekleri gövdenin yanında sabit tutun, vücudu sallamayın.',
        'Tepe noktada biceps kasını 1 saniye sıkın.',
      ],
      breathing: 'Kaldırırken nefes verin, indirirken nefes alın.',
      tempo: '2.5 sn indiriş • 1 sn kaldırış',
      focusMuscle: exMeta?.targetMuscle || 'Biceps (Ön Kol)',
    };
  }

  // Generic Default
  return {
    criticalMistake: exMeta?.criticalMistake || 'Hareketi aceleye getirerek kontrolsüz savurmak veya eklemleri aşırı kitlemek.',
    formCues: [
      'Doğru postürü koruyun: Göğüs dik, karın sıkı, omurga nötr.',
      'Ağırlığı savurmadan kas gerilimiyle hareket ettirin.',
      'Tepe kasılma noktasında 1 saniye duraklayıp kasa odaklanın.',
    ],
    breathing: 'Zorlanma (itiş/çekiş) anında nefes verin, indirişte nefes alın.',
    tempo: '2.5 sn kontrollü negatif • 1 sn pozitif',
    focusMuscle: exMeta?.targetMuscle || 'Hedef Kas Grubu',
  };
};
