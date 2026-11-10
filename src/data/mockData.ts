import { Exercise, WorkoutSession, DailyNutrition, CheckInItem, AthleteProfile, DailyHistoryRecord, CompletedWorkoutRecord } from '../types/fitness';
import { USER_MASTER_EXERCISES } from './masterExercisesData';
import { generateFourMonthWeeklyCalendar } from './fourMonthFitnessPlan';

export const HOTLINK_IMAGE_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUA6SvdergdF35-j63agAveHs4WyAfEvElgYkf0bjnr9qAVDEpSsnfSTf2Mwcb-pHxehiKNF6T3Jc5cRCZ3DiVCX5SriyFMF8oZG26UX9-uUd_UradqfKiRVZq46KQelhayAo9CEq7HoO0vAQxOr-eOrQ3J_Z2xAXN8X5uhqd_8KK0SAJFY1AcPzd3myP7_24YHiHJs663i1TGpeennEYisBifKcblUjjIqW-qu0626L3JITamF24NrQ';

const INITIAL_BASE_EXERCISES: Exercise[] = [
  {
    id: 'barbell-bench-press',
    name: 'Barbell Bench Press',
    category: 'İtiş (Push)',
    anatomyRegion: 'Göğüs',
    equipment: 'Halter',
    targetMuscle: 'Büyük Göğüs (Pectoralis Major)',
    synergistMuscles: 'Triceps • Ön Deltoid',
    type: 'Bileşik (Kompleks)',
    setupAngle: 'Düz Sehpa • Olimpik Bar',
    rpe: '8.5',
    descriptionPurpose: 'Göğüs kaslarını (Pectoralis Major) maksimum mekanik gerilimle çalıştırmak ve omuz sakatlıklarını önlemek.',
    videoDuration: '03:45 / HD',
    videoViews: '142K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: 'rT7DgCr-3pg',
    isPopular: true,
    popularityRank: 1,
    cues: [
      {
        title: 'Skapular Retraksiyon',
        description: 'Kürek kemiklerini sehpaya kilitleyip doğal göğüs kemeri oluşturun.'
      },
      {
        title: 'Dirsek Açısı',
        description: 'İnişte dirsekleri gövdeye 45-75 derece açıyla yönlendirin.'
      }
    ],
    criticalMistake: 'Dirsekleri 90° yanlara açarak omuz kapsülüne aşırı kesme kuvveti bindirmek.',
    steps: [
      {
        stepNumber: 1,
        title: 'Kurulum (Setup)',
        subtitle: 'Başlangıç',
        description: 'Gözlerin barın hemen altında olacak şekilde uzan. Ayaklarını yere sağlam bas, kalçayı ve sırtı sehpaya kilitle.'
      },
      {
        stepNumber: 2,
        title: 'İndiriş (Eksantrik)',
        subtitle: '2-3 Saniye',
        description: 'Barı göğüs kemiğine doğru 2-3 saniyede kontrollü indir. Dirseklerini 45-70 derecelik açıda tut, yanlara aşırı açma.'
      },
      {
        stepNumber: 3,
        title: 'İtiş (Konsantrik)',
        subtitle: 'Patlayıcı Güç',
        description: 'Ayaklarından güç alarak barı patlayıcı şekilde yukarı it. Tepe noktada dirsekleri kitlemeden göğsü sık.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Dirsekleri 90 derece yana açmak',
        note: '(Omuz sakatlığı riski)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Kürek kemiklerini geride ve aşağıda birleştirmek',
        note: '(Skapular Retraksiyon)'
      },
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Barı göğüste zıplatmak',
        note: '(Mekanik tansiyon kaybı ve kaburga baskısı)'
      }
    ],
    biomechanics: {
      activationPercent: 88,
      angleRecommendation: '45-75° dirsek / Sehpa 0°',
      criticalCues: [
        'Kürek kemiklerini sehpaya kilitle (retraksiyon).',
        'Barı göğüs çizgisine 75° dirsek açısıyla kontrollü indir, dirsekleri 90° yana aşırı açma.'
      ],
      breathingRhythm: 'İndirirken 2-3 sn derin nefes al, iterken patlayıcı nefes ver.',
      commonMistakes: 'Barı göğüste zıplatma, kalçayı sehpadan kaldırma ve omuz eklemine aşırı iç rotasyon bindirme.',
      targetMover: 'Pectoralis Major (Göğüs)',
      supportMovers: 'Destekçi: Ön Omuz & Triceps'
    }
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    category: 'İtiş (Push)',
    anatomyRegion: 'Göğüs',
    equipment: 'Dambıl',
    targetMuscle: 'Üst Göğüs (Klaviküler Baş)',
    synergistMuscles: 'Ön Deltoid • Triceps',
    type: 'Bileşik (Kompleks)',
    setupAngle: '30° Sehpa • Dambıl',
    rpe: '8-9',
    descriptionPurpose: 'Klaviküler lifleri maksimum gerilim altına alarak üst göğüs kalınlığını ve hacmini artırmak.',
    videoDuration: '02:50 / HD',
    videoViews: '98K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: '8iPEnn-ltC8',
    cues: [
      {
        title: 'Başlangıç & Eklem Açısı',
        description: 'Dirsekleri gövdeye 45-60° açıda tutun. Kürek kemiklerini (skapula) sehpaya kilitleyin.'
      },
      {
        title: 'Tepe Kasılma & İtiş',
        description: 'Dambılları birbirine çarptırmadan üst göğüs liflerini sıkıştırarak tavana doğru itin.'
      }
    ],
    criticalMistake: 'Dirsekleri 90° yanlara açmak omuz eklem kapsülüne aşırı rotatör yükü bindirir.',
    steps: [
      {
        stepNumber: 1,
        title: 'Açı Ayarı',
        subtitle: '30 Derece',
        description: 'Sehpayı 30 derecelik açıya getirin. 45 dereceden fazlası yükü ön omuza aktarır.'
      },
      {
        stepNumber: 2,
        title: 'Kontrollü Negatif',
        subtitle: '2 Saniye',
        description: 'Dambılları göğüs hizasına kontrollü indirin, esnemeyi göğüs liflerinde hissedin.'
      },
      {
        stepNumber: 3,
        title: 'Sıkıştırma & İtiş',
        subtitle: 'Tepe Odak',
        description: 'Dambılları tepede çarptırmadan dikey çizgide yukarı itin.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Sehpa açısını 45 derecenin üzerine çıkarmak',
        note: '(Yük ön omuza kaçar)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Dambılları indirirken derin pektoral esneme sağlamak',
        note: '(Hipertrofi sinyalini tetikler)'
      }
    ],
    biomechanics: {
      activationPercent: 92,
      angleRecommendation: '30° sehpa açısı / 45-60° dirsek',
      criticalCues: [
        '30 derecelik incline açısı klaviküler pektoral lifleri için biyomekanik olarak en optimal açıdır.',
        'Dambılları indirirken ellerinizi hafif içeri doğru açılı tutun.'
      ],
      breathingRhythm: 'Negatif fazda nefes al, konsantrik itişte ağızdan ver.',
      commonMistakes: 'Dambılları tepede birbirine çarpmak eklem gerilimini düşürür.',
      targetMover: 'Pectoralis Major (Klaviküler Üst Lif)',
      supportMovers: 'Ön Deltoid • Triceps Brachii'
    }
  },
  {
    id: 'seated-cable-row',
    name: 'Seated Cable Row',
    category: 'Çekiş (Pull)',
    anatomyRegion: 'Sırt/Lat',
    equipment: 'Kablo / Makine',
    targetMuscle: 'Latissimus Dorsi & Romboideus',
    synergistMuscles: 'Biceps • Trapez • Arka Omuz',
    type: 'Bileşik (Kompleks)',
    setupAngle: 'Kablo Makinesi • V-Bar',
    rpe: '8',
    descriptionPurpose: 'Orta sırt kalınlığı oluşturmak, kürek kemiklerini kenetleyerek skapular stabiliteyi sağlamlaştırmak.',
    videoDuration: '03:15 / HD',
    videoViews: '115K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: 'GZbfZ033f74',
    cues: [
      {
        title: 'Tam Esneme Fazı',
        description: 'Gövdeyi 90° dik tutarak omuz bıçaklarının öne uzamasına kontrollü izin verin.'
      },
      {
        title: 'Dirsek Sürüşü & Kasılma',
        description: 'Bilekle değil dirseklerle çekin; göbeğin alt hizasına çekip kürek kemiklerini kenetleyin.'
      }
    ],
    criticalMistake: 'Ağır kilolarda belden salınım (momentum) almak L4-L5 disk baskısını 3 katına çıkarır.',
    steps: [
      {
        stepNumber: 1,
        title: 'Oturma Pozisyonu',
        subtitle: 'Dizler Hafif Bükük',
        description: 'Ayaklarınızı platforma yerleştirin, göğsü dik tutun ve omurgayı düzleştirin.'
      },
      {
        stepNumber: 2,
        title: 'Skapular Çekiş',
        subtitle: 'Dirsek Odaklı',
        description: 'Aparatı karnınıza doğru çekerken dirsekleri arkaya doğru sürün.'
      },
      {
        stepNumber: 3,
        title: 'İzometrik Duraklama',
        subtitle: '1 Saniye',
        description: 'Tepe noktada sırt kaslarınızı kilitli tutup 1 saniye bekleyin.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Gövdeyi ileri geri sallayarak çekmek',
        note: '(Bel sakatlığı riski)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Çekişi bilekle değil dirseklerle başlatmak',
        note: '(Lat izolasyonu)'
      }
    ],
    biomechanics: {
      activationPercent: 86,
      angleRecommendation: '90° dik gövde açısı / Göbek altı çekiş',
      criticalCues: [
        'Skapular retraksiyon ve depresyon koordinasyonunu koruyun.',
        'Dirsekleri gövdeye yakın tutarak lats katılımını artırın.'
      ],
      breathingRhythm: 'Ağırlığı bırakırken nefes al, çekerken kuvvetlice ver.',
      commonMistakes: 'Omuzları yukarı kaldırmak trapezi gereksiz aşırı yorar.',
      targetMover: 'Latissimus Dorsi & Rhomboids',
      supportMovers: 'Biceps Brachii & Arka Omuz'
    }
  },
  {
    id: 'dumbbell-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    category: 'İtiş (Push)',
    anatomyRegion: 'Omuz',
    equipment: 'Dambıl',
    targetMuscle: 'Yan Deltoid (Medial)',
    synergistMuscles: 'Üst Trapez • Supraspinatus',
    type: 'İzolasyon',
    setupAngle: 'Ayakta • Dambıl',
    rpe: '9-10',
    descriptionPurpose: 'Omuz genişliği ve 3D omuz görüntüsü için yan omuz başlarını izole ederek mekanik gerilim sağlamak.',
    videoDuration: '02:40 / HD',
    videoViews: '210K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: '3VcKaXpzqRo',
    cues: [
      {
        title: 'Skapular Düzlem Açısı',
        description: 'Kolları tam yan yerine 15-20° öne doğru açarak doğal eklem düzlemine uyun.'
      },
      {
        title: 'Bilek & Dirsek Seviyesi',
        description: 'Dirseğinizi hafif bükük tutun; kaldırırken serçe parmağı önde, el bileği dirsekten yukarı çıkmamalı.'
      }
    ],
    criticalMistake: 'Omuzları yukarı çekip trapezi devreye sokmak lateral deltoid gerilimini yok eder.',
    steps: [
      {
        stepNumber: 1,
        title: 'Duruş ve Tutuş',
        subtitle: 'Hafif Öne Eğim',
        description: 'Vücudunuzu 5-10 derece öne eğin, dambılları kalçanızın yanında konumlandırın.'
      },
      {
        stepNumber: 2,
        title: 'Kaldırış Yolu',
        subtitle: 'Skapular Açıda',
        description: 'Kolları hafif öne açılı şekilde omuz hizasına kadar yükseltin.'
      },
      {
        stepNumber: 3,
        title: 'Yavaş İndiriş',
        subtitle: 'Mekanik Gerilim',
        description: 'Yer çekimine teslim olmadan 2 saniyede başlangıç noktasına indirin.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Ağırlığı bacaklardan fırlatarak savurmak',
        note: '(Tansiyon kaybı)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Dirsekleri bilekten hafif yukarıda tutmak',
        note: '(Lateral baş aktivasyonu)'
      }
    ],
    biomechanics: {
      activationPercent: 94,
      angleRecommendation: '15-20° skapular düzlem açısı',
      criticalCues: [
        'Supraspinatus impingement riskini önlemek için kollar tam 180° yan yerine hafif önde tutulur.',
        'Boyun kaslarını gevşek bırakın.'
      ],
      breathingRhythm: 'Kaldırırken nefes ver, indirirken al.',
      commonMistakes: 'Aşırı ağır kilo seçip momentum kullanmak.',
      targetMover: 'Lateral Deltoid (Orta Omuz)',
      supportMovers: 'Anterior/Posterior Deltoid'
    }
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift (RDL)',
    category: 'Bacak (Legs)',
    anatomyRegion: 'Bacak',
    equipment: 'Halter',
    targetMuscle: 'Arka Bacak (Hamstrings) & Glute',
    synergistMuscles: 'Erector Spinae • Core',
    type: 'Bileşik (Kompleks)',
    setupAngle: 'Dambıl / Halter • Posterior',
    rpe: '8.5',
    descriptionPurpose: 'Posterior zinciri (arka bacak, glute ve omurga dikleştiriciler) esneme altında yükleyerek güçlendirmek.',
    videoDuration: '04:10 / HD',
    videoViews: '164K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: '_oyxCn2iSjU',
    cues: [
      {
        title: 'Kalça Menteşesi (Hip Hinge)',
        description: 'Dizleri hafif kırıp kalçayı geriye doğru duvara dokunacakmış gibi itin. Omurga nötr kalsın.'
      },
      {
        title: 'Ağırlığın Vücuda Yakınlığı',
        description: 'Dambılları kaval kemiklerine yakın sürün; tepe noktada kalçayı sıkın fakat beli aşırı bükmeyin.'
      }
    ],
    criticalMistake: 'Sırtı yuvarlayarak eğilmek lomber bölgeye binen kesme kuvvetini tehlikeli boyuta taşır.',
    steps: [
      {
        stepNumber: 1,
        title: 'Kilit Nokta Ayak Açısı',
        subtitle: 'Kalça Genişliği',
        description: 'Ayaklar kalça hizasında, omuzlar geride kilitli.'
      },
      {
        stepNumber: 2,
        title: 'Kalça Geriye Sürüşü',
        subtitle: 'Esneme Odaklı',
        description: 'Diz bükümünü sabit tutarak kalçayı arkaya doğru itin.'
      },
      {
        stepNumber: 3,
        title: 'Glute İtişi',
        subtitle: 'Tepe Sıkma',
        description: 'Topuklardan güç alarak kalçayı öne getirin ve omurgayı dikleştirin.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Bel omurlarını kamburlaştırarak bükülmek',
        note: '(Lomber disk yaralanması)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Barı bacaklardan ayırmadan yakın hatta tutmak',
        note: '(Kuvvet kolu minimizasyonu)'
      }
    ],
    biomechanics: {
      activationPercent: 91,
      angleRecommendation: '15-20° diz fleksiyonda kilitli',
      criticalCues: [
        'Dizleri squat yapar gibi bükmeyin; hareket tamamen kalça menteşesidir.',
        'Boynu gövdeyle aynı hizada tutun.'
      ],
      breathingRhythm: 'İnerken derin diyafram nefesi al (Valsalva), kalkışın sonunda ver.',
      commonMistakes: 'Ağırlığı yere kadar indirmeye çalışırken sırtı yuvarlamak.',
      targetMover: 'Biceps Femoris & Gluteus Maximus',
      supportMovers: 'Erector Spinae & Core'
    }
  },
  {
    id: 'cable-triceps-pushdown',
    name: 'Cable Triceps Pushdown',
    category: 'İtiş (Push)',
    anatomyRegion: 'Triceps',
    equipment: 'Kablo / Makine',
    targetMuscle: 'Triceps Brachii (Lateral/Medial)',
    synergistMuscles: 'Anconeus • Ön Kol',
    type: 'İzolasyon',
    setupAngle: 'Kablo • Düz Bar / Halat',
    rpe: '9',
    descriptionPurpose: 'Arka kol kaslarını izole ederek dirsek açılışında tepe kasılma ve hipertrofi sağlamak.',
    videoDuration: '02:15 / HD',
    videoViews: '89K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: '2-LAMcpzODU',
    cues: [
      {
        title: 'Dirsek Sabitleme',
        description: 'Dirsekleri kaburgalara sabitleyin; hareket boyunca ileri veya geri oynamamalıdır.'
      },
      {
        title: 'Alt Fazda Kilitleme',
        description: 'Alt pozisyonda dirsekleri tam açıp 1 saniye izometrik kasılma uygulayın.'
      }
    ],
    criticalMistake: 'Gövdeyi öne yatırıp vücut ağırlığıyla basmak triceps gerilimini ön omuza aktarır.',
    steps: [
      {
        stepNumber: 1,
        title: 'Tutuş & Duruş',
        subtitle: 'Halat Aparatı',
        description: 'Halat uçlarını kavrayın, dirsekleri gövdenin iki yanına sabitleyin.'
      },
      {
        stepNumber: 2,
        title: 'Aşağı Basış & Açış',
        subtitle: 'Tepe Kasılma',
        description: 'Dirsekleri oynatmadan kolları düzleştirin, alt uçta halatı iki yana ayırın.'
      },
      {
        stepNumber: 3,
        title: 'Kontrollü Dönüş',
        subtitle: '90 Dereceye Kadar',
        description: 'Ön kollar yatay çizgiye gelene kadar ağırlığı kontrollü bırakın.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Dirsekleri öne ve arkaya savurmak',
        note: '(Omuz aktivasyonu artar)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Alt noktada halatı dışa doğru çevirerek sıkmak',
        note: '(Lateral baş tepe gerilimi)'
      }
    ],
    biomechanics: {
      activationPercent: 89,
      angleRecommendation: 'Dirsek gövdeye 0° kilitli / 90° fleksiyon aralığı',
      criticalCues: [
        'Dirsek ekleminin menteşe gibi çalışmasını sağlayın.',
        'Bilekleri aşırı bükmeyin.'
      ],
      breathingRhythm: 'Basarken nefes ver, dönerken al.',
      commonMistakes: 'Gövdeyi makinenin üzerine abanacak kadar öne eğmek.',
      targetMover: 'Triceps Lateral & Medial Head',
      supportMovers: 'Anconeus'
    }
  },
  {
    id: 'kneeling-cable-crunch',
    name: 'Kneeling Cable Crunch',
    category: 'Core / Karın',
    anatomyRegion: 'Karın',
    equipment: 'Kablo / Makine',
    targetMuscle: 'Rectus Abdominis (Tam Karın)',
    synergistMuscles: 'Oblikler • Serratus',
    type: 'İzolasyon',
    setupAngle: 'Diz Üstü • Halat Kablo',
    rpe: '8.5',
    descriptionPurpose: 'Karın kaslarını omurga fleksiyonu ile dirençli yük altında kalınlaştırıp güçlendirmek.',
    videoDuration: '02:30 / HD',
    videoViews: '72K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: 'X_8vD3H2a-g',
    cues: [
      {
        title: 'Kalça Sabitleme',
        description: 'Kalçayı geriye oturtmayın; pelvis sabit kalmalı, hareket yalnızca omurganın yuvarlanmasıyla yapılmalıdır.'
      },
      {
        title: 'Kaburga-Pelvis Yakınlaşması',
        description: 'Eller şakaklarda sabit, dirsekleri diz kapaklarına doğru bükerek nefesi boşaltıp sıkın.'
      }
    ],
    criticalMistake: 'Kolları ve kalça fleksörlerini kullanarak ağırlığı çekmek karın kasılmasını engeller.',
    steps: [
      {
        stepNumber: 1,
        title: 'Diz Üstü Duruş',
        subtitle: 'Halat Şakaklarda',
        description: 'Kablonun önüne diz çökün, ellerinizi kulaklarınızın hizasında kilitleyin.'
      },
      {
        stepNumber: 2,
        title: 'Omurga Yuvarlama',
        subtitle: 'Nefes Boşaltma',
        description: 'Tüm havayı dışarı üfleyerek göğüs kafesini leğen kemiğinize doğru bükün.'
      },
      {
        stepNumber: 3,
        title: 'Yavaş Açılma',
        subtitle: 'Gerilimi Bırakmama',
        description: 'Kalçanızı oynatmadan nötr pozisyona kontrollü dönün.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Kalçayı topuklara doğru oturtup kaldırmak',
        note: '(Karın çalışmaz)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Konsantrik tepe noktada karındaki havayı tamamen boşaltmak',
        note: '(Derin kasılma)'
      }
    ],
    biomechanics: {
      activationPercent: 87,
      angleRecommendation: 'Sabit kalça 90° / Omurga fleksiyonu 45°',
      criticalCues: [
        'Kollar sadece ipi tutar, kesinlikle kol gücüyle çekilmez.',
        'Tansiyon sadece karın duvarında olmalıdır.'
      ],
      breathingRhythm: 'Kapanırken tam boşalt, açılırken derin nefes al.',
      commonMistakes: 'Bel omurlarını aşırı hiperekstansiyona sokmak.',
      targetMover: 'Rectus Abdominis',
      supportMovers: 'Internal & External Obliques'
    }
  },
  {
    id: 'barbell-back-squat',
    name: 'Barbell Back Squat',
    category: 'Bacak (Legs)',
    anatomyRegion: 'Bacak',
    equipment: 'Halter',
    targetMuscle: 'Quadriceps & Gluteus Maximus',
    synergistMuscles: 'Hamstrings • Adductors • Core',
    type: 'Bileşik (Kompleks)',
    setupAngle: 'Omuz Genişliği • 15° Dışa Açılı Ayaklar',
    rpe: '9.0',
    descriptionPurpose: 'Bacak ve kalça kaslarında mekanik gerilimi maksimize ederek tüm alt gövdede kütle inşa etmek.',
    videoDuration: '04:10 / HD',
    videoViews: '280K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: 'bEv6CCg2BC8',
    cues: [
      {
        title: 'Karın İçi Basınç (Valsalva)',
        description: 'İnmeden önce derin diyafram nefesi alıp core duvarını kilitleyin.'
      },
      {
        title: 'Derinlik & Kalça Sürüşü',
        description: 'Dizler ayak parmakları yönünde açılırken paralelin altına inin.'
      }
    ],
    criticalMistake: 'Dizlerin içeriye doğru çökmesi (valgus) menisküs ve çapraz bağlara zarar verir.',
    steps: [
      {
        stepNumber: 1,
        title: 'Bar Kurulumu',
        subtitle: 'Trapez Üzeri',
        description: 'Barı üst trapez üzerine sabitleyin, dirsekleri geriye kilitleyin.'
      },
      {
        stepNumber: 2,
        title: 'Kontrollü İniş',
        subtitle: 'Paralel Altı',
        description: 'Kalçayı hafif geriye iterek dizleri bükün, dik gövdeyle inin.'
      },
      {
        stepNumber: 3,
        title: 'Patlayıcı Kalkış',
        subtitle: 'Taban İtişi',
        description: 'Topuklardan güç alarak nefesi tepe noktada vererek doğrulun.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Dizlerin içe doğru bükülmesi',
        note: '(Bağ yaralanması riski)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Göğsü dik tutup topuklardan yeri itmek',
        note: '(Maksimum güç iletimi)'
      }
    ],
    biomechanics: {
      activationPercent: 96,
      angleRecommendation: 'Ayaklar omuz genişliği 15-30° dışa / Kalça diz seviyesi altı',
      criticalCues: ['Topukları yere çivileyin.', 'Dizleri ayak parmakları yönünde dışa itin.'],
      breathingRhythm: 'Tepede nefes al ve tut (bracing), kalkarken nefes ver.',
      commonMistakes: 'Dizlerin içeri çökmesi ve topukların yerden kalkması.',
      targetMover: 'Quadriceps & Gluteus Maximus',
      supportMovers: 'Hamstrings • Spinal Erectors'
    }
  },
  {
    id: 'lat-pulldown',
    name: 'Wide-Grip Lat Pulldown',
    category: 'Çekiş (Pull)',
    anatomyRegion: 'Sırt/Lat',
    equipment: 'Kablo / Makine',
    targetMuscle: 'Latissimus Dorsi (Kanat)',
    synergistMuscles: 'Biceps • Rhomboids • Arka Omuz',
    type: 'Bileşik (Kompleks)',
    setupAngle: 'Geniş Tutuş • 75° Açılı Gövde',
    rpe: '8.5',
    descriptionPurpose: 'V-şekilli geniş sırt görünümü ve skapular depresyon mekaniği oluşturmak.',
    videoDuration: '03:00 / HD',
    videoViews: '190K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: 'CAwf7n6Luuc',
    cues: [
      {
        title: 'Dirsekleri Cebe Çekme',
        description: 'Barı ellerinizle değil, dirseklerinizi arka ceplerinize doğru sürerek indirin.'
      },
      {
        title: 'Göğüs Dikliği',
        description: 'Üst göğsü bara doğru hafifçe kaldırın, aşırı geriye yaslanmayın.'
      }
    ],
    criticalMistake: 'Barı ense arkasına çekmek servikal omurgaya ve omuz kapsülüne aşırı zarar verir.',
    steps: [
      {
        stepNumber: 1,
        title: 'Bacak Sabitleme',
        subtitle: 'Sıkı Oturuş',
        description: 'Diz pedlerini uyluklarınıza sabitleyin, omuz genişliğinden biraz geniş tutun.'
      },
      {
        stepNumber: 2,
        title: 'Çekiş Fazı',
        subtitle: 'Üst Göğse Doğru',
        description: 'Dirsekleri aşağı ve geriye çekerek barı köprücük kemiğine getirin.'
      },
      {
        stepNumber: 3,
        title: 'Kontrollü Esneme',
        subtitle: 'Eksantrik Kontrol',
        description: 'Barı 2-3 saniyede kontrollü bırakarak lats kaslarının tam uzamasını sağlayın.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Gövdeyi 45 dereceden fazla geriye yatırmak',
        note: '(Hareketi row hareketine dönüştürür)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Tepe noktada kanat kaslarını 1 saniye sıkıştırmak',
        note: '(Eksenel kasılma)'
      }
    ],
    biomechanics: {
      activationPercent: 91,
      angleRecommendation: '10-15° geriye hafif eğim / Klavikula hizası çekiş',
      criticalCues: ['Skapulayı aşağı bastırın.', 'Dirsekleri yan kaburgalara doğru yönlendirin.'],
      breathingRhythm: 'Aşağı çekerken nefes ver, yukarı uzanırken derin al.',
      commonMistakes: 'Momentumla geriye sallanmak ve barı karna çekmek.',
      targetMover: 'Latissimus Dorsi',
      supportMovers: 'Biceps Brachii • Teres Major'
    }
  },
  {
    id: 'barbell-biceps-curl',
    name: 'Barbell Biceps Curl',
    category: 'Çekiş (Pull)',
    anatomyRegion: 'Biceps',
    equipment: 'Halter',
    targetMuscle: 'Biceps Brachii (Uzun & Kısa Baş)',
    synergistMuscles: 'Brachialis • Brachioradialis',
    type: 'İzolasyon',
    setupAngle: 'Ayakta • Omuz Genişliği',
    rpe: '8.5',
    descriptionPurpose: 'Ön kol ve pazu tepe noktasını (peak) kalınlaştırmak ve konsantrik güç kazanmak.',
    videoDuration: '02:30 / HD',
    videoViews: '160K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: 'ykJmrZ5v0Oo',
    cues: [
      {
        title: 'Dirsekleri Sabitleme',
        description: 'Dirsekleri gövdenin yanında kilitleyin, öne doğru kaydırmayın.'
      },
      {
        title: 'Bilek Nötrlüğü',
        description: 'Bileklerinizi geriye bükmeyin; nötr hatta tutarak pazu gerilimini koruyun.'
      }
    ],
    criticalMistake: 'Belden kuvvet alarak barı savurmak pazudan yükü çeker ve beli zedeler.',
    steps: [
      {
        stepNumber: 1,
        title: 'Başlangıç',
        subtitle: 'Kilitli Duruş',
        description: 'Barı omuz genişliğinde tutun, dirsekleri gövdeye sabitleyin.'
      },
      {
        stepNumber: 2,
        title: 'Kıvırma (Curl)',
        subtitle: 'Tepe Sıkışma',
        description: 'Dirsekleri oynatmadan barı göğse doğru kıvırın ve sıkın.'
      },
      {
        stepNumber: 3,
        title: 'İndirme',
        subtitle: 'Tam Negatif',
        description: '2 saniyede kontrollü olarak dirsekleri kilitlemeden indirin.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Beli geriye atarak barı fırlatmak',
        note: '(Biceps aktivasyonu düşer)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Dirsekleri gövde yanında menteşe gibi tutmak',
        note: '(Tam izolasyon)'
      }
    ],
    biomechanics: {
      activationPercent: 90,
      angleRecommendation: '0° dirsek kayması / Tam supinasyon açısı',
      criticalCues: ['Dirsek eklemi sabit kalmalıdır.', 'Eksantrik inişte direnç hissedilmelidir.'],
      breathingRhythm: 'Kaldırırken nefes ver, indirirken al.',
      commonMistakes: 'Omuzları öne çıkarmak ve dirsekleri kaldırmak.',
      targetMover: 'Biceps Brachii',
      supportMovers: 'Brachialis • Ön Kol Fleksörleri'
    }
  },
  {
    id: 'overhead-barbell-press',
    name: 'Overhead Barbell Press (OHP)',
    category: 'İtiş (Push)',
    anatomyRegion: 'Omuz',
    equipment: 'Halter',
    targetMuscle: 'Ön & Yan Deltoid',
    synergistMuscles: 'Triceps • Üst Göğüs • Core',
    type: 'Bileşik (Kompleks)',
    setupAngle: 'Ayakta • Dikey İtiş',
    rpe: '9.0',
    descriptionPurpose: 'Tüm omuz kuşağını ve dikey itiş gücünü inşa eden en temel bileşik hareket.',
    videoDuration: '03:40 / HD',
    videoViews: '230K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: '2yjwXTZQDDI',
    cues: [
      {
        title: 'Glute ve Core Kilidi',
        description: 'Kalçayı ve karın kaslarını sıkarak bel kavisini nötr tutun.'
      },
      {
        title: 'Baş Geçişi (Head Through)',
        description: 'Bar çene hizasını geçince başı hafifçe öne alıp barın altına girin.'
      }
    ],
    criticalMistake: 'Beli aşırı geriye bükerek göğüs itişine dönüştürmek omurga disklerine yük bindirir.',
    steps: [
      {
        stepNumber: 1,
        title: 'Raf Pozisyonu',
        subtitle: 'Klavikula Üzeri',
        description: 'Barı köprücük kemiğinde tutun, ön kollar yere tam dik olsun.'
      },
      {
        stepNumber: 2,
        title: 'Dikey İtiş',
        subtitle: 'Tavana Doğru',
        description: 'Barı düz bir çizgide yukarı itin, başınızı geriye çekip geçiş sağlayın.'
      },
      {
        stepNumber: 3,
        title: 'Kilitlenme',
        subtitle: 'Tepe Denge',
        description: 'Bar başın tam üzerinde kilitlenirken trapezi yukarı itin.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Beli arkaya fazla büküp eğrilmek',
        note: '(Lomber omurga baskısı)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Kalçayı ve karnı taş gibi sıkmak',
        note: '(Sağlam temel)'
      }
    ],
    biomechanics: {
      activationPercent: 93,
      angleRecommendation: '90° ön kol dikey açısı / Düz dikey bar yolu',
      criticalCues: ['Bilekler barın hemen altında dik durmalı.', 'Tepe noktada kollar kulak hizasında kilitlenmeli.'],
      breathingRhythm: 'Göğüste nefes al, tepeye iterken nefesi ağızdan ver.',
      commonMistakes: 'Dizleri yaylandırarak push-press yapmak (saf omuz gücü kalmaz).',
      targetMover: 'Anterior & Medial Deltoid',
      supportMovers: 'Triceps Brachii • Trapezius'
    }
  },
  {
    id: 'leg-press-45',
    name: '45° Leg Press',
    category: 'Bacak (Legs)',
    anatomyRegion: 'Bacak',
    equipment: 'Kablo / Makine',
    targetMuscle: 'Quadriceps (Ön Bacak)',
    synergistMuscles: 'Gluteus • Adductors',
    type: 'Bileşik (Kompleks)',
    setupAngle: '45° Açı • Platform Ortası',
    rpe: '8.5',
    descriptionPurpose: 'Omurgaya aksiyel yük bindirmeden bacak kaslarını tükenişe kadar aşırı yüklemek.',
    videoDuration: '03:10 / HD',
    videoViews: '175K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: 'IZxyjW7MPJQ',
    cues: [
      {
        title: 'Bel Seleye Yapışık',
        description: 'Kalçanın ve kuyruk sokumunun seleden havalanmasına asla izin vermeyin.'
      },
      {
        title: 'Diz Kilitlememe',
        description: 'Tepe noktada diz eklemini sertçe kilitlemeyin, gerilimi kasta tutun.'
      }
    ],
    criticalMistake: 'Dizleri tepede kilitlemek ve kalçayı koltuktan kaldırmak menisküs ve bel fıtığı riskidir.',
    steps: [
      {
        stepNumber: 1,
        title: 'Yerleşim',
        subtitle: 'Omuz Genişliği',
        description: 'Ayakları platformun ortasına omuz genişliğinde yerleştirin.'
      },
      {
        stepNumber: 2,
        title: 'Derin Bükülme',
        subtitle: '90 Derece',
        description: 'Ağırlığı kontrollü olarak 90 derecelik diz açısına kadar indirin.'
      },
      {
        stepNumber: 3,
        title: 'İtiş Fazı',
        subtitle: 'Dizleri Kilitlemeden',
        description: 'Ayak tabanlarından iterek başlangıca dönün, eklemleri kitlemeyin.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Tepe noktada dizleri geriye kitlemek',
        note: '(Eklem aşınması riski)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Tutacakları çekerek kalçayı koltuğa yapıştırmak',
        note: '(Omurga güvenliği)'
      }
    ],
    biomechanics: {
      activationPercent: 92,
      angleRecommendation: '90° diz fleksiyonu / Kalça seleye 0° boşluksuz yapışık',
      criticalCues: ['Tutacaklardan sıkıca tutunun.', 'Dizleri omuz çizgisi genişliğinde bükün.'],
      breathingRhythm: 'İndirirken nefes al, iterken kuvvetle ver.',
      commonMistakes: 'Elleri dizlere koyup itmek ve kalçayı sehpada kaldırmak.',
      targetMover: 'Quadriceps Femoris',
      supportMovers: 'Gluteus Maximus • Hamstrings'
    }
  },
  {
    id: 'barbell-deadlift',
    name: 'Conventional Barbell Deadlift',
    category: 'Çekiş (Pull)',
    anatomyRegion: 'Sırt/Lat',
    equipment: 'Halter',
    targetMuscle: 'Tüm Posterior Zincir (Erector, Glute, Hamstrings)',
    synergistMuscles: 'Trapezius • Lats • Ön Kol • Quadriceps',
    type: 'Bileşik (Kompleks)',
    setupAngle: 'Zemin • Olimpik Bar',
    rpe: '9.0',
    descriptionPurpose: 'Tüm vücut ham çekiş gücü ve posterior zincir hipertrofisi için kral hareket.',
    videoDuration: '04:45 / HD',
    videoViews: '420K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: 'op9kVnSso6Q',
    isPopular: true,
    popularityRank: 1,
    cues: [
      {
        title: 'Barın Pozisyonu',
        description: 'Bar ayak tarağının tam ortasında olmalı, kaval kemiğine neredeyse temas etmelidir.'
      },
      {
        title: 'Skapular Kilit & Göğüs Dikliği',
        description: 'Kürek kemiklerini ceplerinize sokup bara asılın (slack pull), beli kamburlaştırmayın.'
      }
    ],
    criticalMistake: 'Bel omurlarını yuvarlayarak yükü omurga disklerine bindirmek.',
    steps: [
      {
        stepNumber: 1,
        title: 'Kurulum & Tutuş',
        subtitle: 'Ayaklar Kalça Genişliği',
        description: 'Barın altına girin, kaval kemiği bara değsin. Omuz genişliğinde tutun.'
      },
      {
        stepNumber: 2,
        title: 'Boşluğu Alma (Slack)',
        subtitle: 'Kilitlenme',
        description: 'Barın boşluğunu alıp göğsü dikleştirin, topuklardan yeri itin.'
      },
      {
        stepNumber: 3,
        title: 'Kilit Fazı (Lockout)',
        subtitle: 'Glute Sıkma',
        description: 'Kalçayı öne getirip dik durun, geriye aşırı bükülmeyin.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Beli yuvarlayarak kaldırmak',
        note: '(Ağır fıtık riski)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Yeri ayaklarla iterek çekişi başlatmak',
        note: '(Maksimum bacak ve kalça gücü)'
      }
    ],
    biomechanics: {
      activationPercent: 98,
      angleRecommendation: 'Nötr lomber omurga / 75° kalça açısı',
      criticalCues: ['Barı vücuda yapışık çekin.', 'Nefesi zeminde alıp kitleyin.'],
      breathingRhythm: 'Zeminde derin diyafram nefesi al (Valsalva), tepe kilitlenmede ver.',
      commonMistakes: 'Ağırlığı kollarla bükerek çekmeye çalışmak ve sırtı yuvarlamak.',
      targetMover: 'Erector Spinae • Gluteus Maximus • Hamstrings',
      supportMovers: 'Latissimus Dorsi • Trapezius • Quadriceps'
    }
  },
  {
    id: 'barbell-bent-over-row',
    name: 'Barbell Bent-Over Row',
    category: 'Çekiş (Pull)',
    anatomyRegion: 'Sırt/Lat',
    equipment: 'Halter',
    targetMuscle: 'Orta Sırt & Latissimus Dorsi',
    synergistMuscles: 'Rhomboids • Arka Omuz • Biceps • Erector',
    type: 'Bileşik (Kompleks)',
    setupAngle: '45-60° Gövde Eğimi • Pronated Tutuş',
    rpe: '8.5',
    descriptionPurpose: 'Sırt kalınlığı ve skapular retraksiyon gücünü maksimize eden temel serbest ağırlık çekişi.',
    videoDuration: '03:30 / HD',
    videoViews: '260K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: 'G8l_8chR5BE',
    isPopular: true,
    popularityRank: 5,
    cues: [
      {
        title: 'Gövde Açısı Sabitleme',
        description: 'Omurgayı nötr tutarak 45 derecelik açıda kilitleyin, çekiş sırasında gövdeyi yukarı zıplatmayın.'
      },
      {
        title: 'Göbeğe Doğru Çekiş',
        description: 'Barı göğse değil, alt göbek hizasına doğru dirsekleri arkaya sürerek çekin.'
      }
    ],
    criticalMistake: 'Aşırı dik durup hareketi shrug/trapeze dönüştürmek veya beli kamburlaştırmak.',
    steps: [
      {
        stepNumber: 1,
        title: 'Menteşe Pozisyonu',
        subtitle: 'Kalça Geride',
        description: 'Dizleri hafif büküp kalçayı geriye itin, gövdeyi 45 dereceye sabitleyin.'
      },
      {
        stepNumber: 2,
        title: 'Dirseklerle Çekiş',
        subtitle: 'Skapular Sıkma',
        description: 'Barı alt karın bölgesine çekip kürek kemiklerini birbirine kenetleyin.'
      },
      {
        stepNumber: 3,
        title: 'Kontrollü Bırakış',
        subtitle: 'Tam Uzama',
        description: 'Ağırlığı 2 saniyede kontrollü indirerek sırt kaslarını tam esnetin.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Belden momentumla zıplayarak çekmek',
        note: '(Sırt aktivasyonu kaybolur)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Tepe noktada sırtı 1 saniye kilitli tutmak',
        note: '(Hipertrofi uyarımı)'
      }
    ],
    biomechanics: {
      activationPercent: 91,
      angleRecommendation: '45-60° eğimli gövde / Alt karın çekiş hattı',
      criticalCues: ['Bilekleri bükmeyin, dirseklerinizle çekin.', 'Boynu omurgayla aynı hizada tutun.'],
      breathingRhythm: 'Aşağıda nefes al, çekerken kuvvetle ver.',
      commonMistakes: 'Momentum kullanarak gövdeyi sallamak.',
      targetMover: 'Latissimus Dorsi & Rhomboids',
      supportMovers: 'Posterior Deltoid • Biceps Brachii'
    }
  },
  {
    id: 'pull-up',
    name: 'Pull-Up (Barfiks)',
    category: 'Çekiş (Pull)',
    anatomyRegion: 'Sırt/Lat',
    equipment: 'Vücut Ağırlığı',
    targetMuscle: 'Latissimus Dorsi & Teres Major',
    synergistMuscles: 'Biceps • Rhomboids • Core',
    type: 'Bileşik (Kompleks)',
    setupAngle: 'Asılı Dikey Çekiş • Omuz Genişliği Üstü',
    rpe: '9.0',
    descriptionPurpose: 'Üst gövdenin en temel fonksiyonel çekiş gücü ve kanat genişliği standardı.',
    videoDuration: '03:15 / HD',
    videoViews: '310K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: 'eGo4IYlbE5g',
    isPopular: true,
    popularityRank: 3,
    cues: [
      {
        title: 'Ölü Asılıştan Başlama (Dead Hang)',
        description: 'Her tekrara skapulayı aktifleştirerek başlayın, yarım tekrar yapmayın.'
      },
      {
        title: 'Göğsü Bara Sürme',
        description: 'Çeneyi bara uzatmak yerine göğsü bara yaklaştırmaya odaklanın.'
      }
    ],
    criticalMistake: 'Bacakları savurarak kipping yapmak ve omuz eklemlerini aşırı sarsmak.',
    steps: [
      {
        stepNumber: 1,
        title: 'Asılma ve Kilit',
        subtitle: 'Skapula Aktif',
        description: 'Barı omuzdan geniş kavrayın, omuzları kulaklardan uzaklaştırarak skapulayı indirin.'
      },
      {
        stepNumber: 2,
        title: 'Patlayıcı Çekiş',
        subtitle: 'Dirsekler Cebe',
        description: 'Dirsekleri aşağı ve geriye sürerek çene bar hizasını geçene kadar yükselin.'
      },
      {
        stepNumber: 3,
        title: 'Kontrollü İniş',
        subtitle: '2-3 Saniye',
        description: 'Vücudu sallamadan kontrollü olarak tam uzama pozisyonuna geri dönün.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Bacakları öne sallayarak çekişi kolaylaştırmak',
        note: '(Gerilim lats kasından kaçar)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Karın ve bacak kaslarını kilitli tutmak',
        note: '(Sert gövde dinamiği)'
      }
    ],
    biomechanics: {
      activationPercent: 95,
      angleRecommendation: 'Geniş pronated tutuş / Dikey çekiş vektörü',
      criticalCues: ['Skapular depresyonu hareketin başında başlatın.', 'Bacakları çaprazlayıp sıkın.'],
      breathingRhythm: 'Aşağıda nefes al, yükselirken kuvvetle boşalt.',
      commonMistakes: 'Kolları tam uzatmadan yarım tekrarlar yapmak.',
      targetMover: 'Latissimus Dorsi',
      supportMovers: 'Biceps Brachii • Brachialis • Lower Traps'
    }
  },
  {
    id: 'dips-chest-triceps',
    name: 'Parallel Bar Dips',
    category: 'İtiş (Push)',
    anatomyRegion: 'Göğüs',
    equipment: 'Vücut Ağırlığı',
    targetMuscle: 'Alt Göğüs & Triceps',
    synergistMuscles: 'Ön Deltoid • Core',
    type: 'Bileşik (Kompleks)',
    setupAngle: 'Paralel Bar • 15° Öne Eğim',
    rpe: '8.5',
    descriptionPurpose: 'Üst gövdenin çömelmesi (squat of upper body); alt göğüs çizgisi ve triceps kütlesi inşa eder.',
    videoDuration: '02:55 / HD',
    videoViews: '290K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: '2z8JmcrW-As',
    isPopular: true,
    popularityRank: 4,
    cues: [
      {
        title: 'Öne Hafif Eğim',
        description: 'Göğüs hedefi için gövdeyi 15-20° öne eğin; dik duruş yükü saf tricepse odaklar.'
      },
      {
        title: '90° Dirsek Derinliği',
        description: 'Omuz kapsülünü korumak için 90 derecenin çok altına inmeyin.'
      }
    ],
    criticalMistake: 'Aşırı derine inerek anterior omuz kapsülüne zararlı gerilim bindirmek.',
    steps: [
      {
        stepNumber: 1,
        title: 'Başlangıç Desteği',
        subtitle: 'Kolları Kilitleme',
        description: 'Barlara çıkın, dirsekleri hafif kırık tutun, omuzları bastırın.'
      },
      {
        stepNumber: 2,
        title: 'Kontrollü İniş',
        subtitle: 'Öne Eğimli',
        description: 'Dirsekleri 90 derece bükene kadar kontrollü şekilde alçalın.'
      },
      {
        stepNumber: 3,
        title: 'İtiş & Sıkışma',
        subtitle: 'Tepe Kasılma',
        description: 'Barları aşağı iterek başlangıç noktasına yükselin ve göğsü sıkın.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Omuzları kulaklara kadar bırakıp çökmek',
        note: '(Omuz eklemi sıkışması)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Gövdeyi stabil tutup kontrollü inmek',
        note: '(Hedef kas lifi gerilimi)'
      }
    ],
    biomechanics: {
      activationPercent: 93,
      angleRecommendation: '15-20° öne eğik gövde / 90° dirsek derinliği',
      criticalCues: ['Dirseklerin yanlara aşırı açılmasına izin vermeyin.', 'Omuzları aşağıda sabitleyin.'],
      breathingRhythm: 'İnerken nefes al, iterken tepe noktada ver.',
      commonMistakes: 'Hızlıca aşağı düşüp yaylanarak çıkmak.',
      targetMover: 'Pectoralis Major (Alt Lif) & Triceps Brachii',
      supportMovers: 'Anterior Deltoid • Rhomboids'
    }
  },
  {
    id: 'dumbbell-shoulder-press',
    name: 'Seated Dumbbell Shoulder Press',
    category: 'İtiş (Push)',
    anatomyRegion: 'Omuz',
    equipment: 'Dambıl',
    targetMuscle: 'Ön ve Yan Deltoid',
    synergistMuscles: 'Triceps • Üst Göğüs • Trapezius',
    type: 'Bileşik (Kompleks)',
    setupAngle: '75-80° Sehpa • Dikey İtiş',
    rpe: '8.5',
    descriptionPurpose: 'Her iki omzu bağımsız çalıştırarak kuvvet dengesizliklerini giderir ve omuz hacmini büyütür.',
    videoDuration: '03:10 / HD',
    videoViews: '275K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: 'qEwKCR5JCog',
    isPopular: true,
    popularityRank: 6,
    cues: [
      {
        title: 'Skapular Düzlem',
        description: 'Dirsekleri tam yana açmayın, 20-30° öne doğru yönlendirin.'
      },
      {
        title: 'Dambılları Çarpmama',
        description: 'Tepe noktada dambılları birbirine vurmayın, gerilimi deltoidde tutun.'
      }
    ],
    criticalMistake: 'Beli sehpadan açarak aşırı kavis vermek ve göğüs presine dönüştürmek.',
    steps: [
      {
        stepNumber: 1,
        title: 'Pozisyon & Kaldırış',
        subtitle: 'Diz Desteği',
        description: 'Dambılları dizlerinizle omuz hizasına savurun, sırtı sehpaya yaslayın.'
      },
      {
        stepNumber: 2,
        title: 'Tavana İtiş',
        subtitle: 'Kavisli Yol',
        description: 'Dambılları hafif kavisli bir çizgide başın üzerine doğru itin.'
      },
      {
        stepNumber: 3,
        title: 'Kulak Hizasına İndiriş',
        subtitle: 'Negatif Kontrol',
        description: 'Dambılları kulak memesi hizasına kadar 2 saniyede kontrollü indirin.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Dambılları tepede çarparak eklem şoku oluşturmak',
        note: '(Tansiyon kaybı)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Dirsekleri hafif öne açılı tutmak',
        note: '(Rotatör manşet koruması)'
      }
    ],
    biomechanics: {
      activationPercent: 91,
      angleRecommendation: '75° sehpa eğimi / 30° skapular dirsek açısı',
      criticalCues: ['Ayakları yere sağlam basın.', 'Dambılları omuz genişliğinde indirin.'],
      breathingRhythm: 'İndirirken nefes al, iterken ver.',
      commonMistakes: 'Aşırı ağır kilo seçip yarım tekrar yapmak.',
      targetMover: 'Anterior & Medial Deltoid',
      supportMovers: 'Triceps Brachii • Upper Trapezius'
    }
  },
  {
    id: 'cable-chest-fly',
    name: 'Standing Cable Crossover Fly',
    category: 'İtiş (Push)',
    anatomyRegion: 'Göğüs',
    equipment: 'Kablo / Makine',
    targetMuscle: 'Pectoralis Major (Tüm Göğüs & İç Çizgi)',
    synergistMuscles: 'Ön Deltoid • Biceps Kısa Baş',
    type: 'İzolasyon',
    setupAngle: 'Kablo Çapraz • Hafif Öne Eğim',
    rpe: '9.0',
    descriptionPurpose: 'Sürekli kablo tansiyonuyla göğüs liflerini maksimum tepe kasılmaya ve esnemeye maruz bırakmak.',
    videoDuration: '02:45 / HD',
    videoViews: '240K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: 'taI4XduLpTw',
    isPopular: true,
    popularityRank: 7,
    cues: [
      {
        title: 'Dirsek Açısını Sabit Tutma',
        description: 'Dirsekleri hafif bükük bir açıda kilitleyin; pres hareketine dönüştürmeyin.'
      },
      {
        title: 'Ağaca Sarılma Hissi',
        description: 'Kolları kapatırken dev bir ağaca sarılıyormuş gibi göğüs kaslarını önde birbirine sıkıştırın.'
      }
    ],
    criticalMistake: 'Hareketi press gibi yaparak dirsekleri sürekli büküp açmak.',
    steps: [
      {
        stepNumber: 1,
        title: 'Duruş & Adım',
        subtitle: 'Bir Adım Öne',
        description: 'Kablonun ortasında durun, bir ayağı öne atarak stabil taban oluşturun.'
      },
      {
        stepNumber: 2,
        title: 'Göğüs Esnemesi',
        subtitle: 'Kolları Açma',
        description: 'Göğüs kaslarında derin esneme hissedene kadar kolları yanlara açın.'
      },
      {
        stepNumber: 3,
        title: 'Tepe Sıkıştırma',
        subtitle: 'Önde Birleştirme',
        description: 'Kolları önde birleştirip göğüs kaslarını 1 saniye boyunca maksimum güçle sıkın.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Omuzları öne yuvarlayarak kamburlaşmak',
        note: '(Göğüs izolasyonu biter)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Göğsü sürekli dışarıda ve dik tutmak',
        note: '(Maksimum pektoral gerilim)'
      }
    ],
    biomechanics: {
      activationPercent: 90,
      angleRecommendation: 'Dirseklerde sabit 120-135° büküm / Göğüs hizasında kapanış',
      criticalCues: ['Kürek kemiklerini geride tutun.', 'Tepe kasılmada elleri sıkın.'],
      breathingRhythm: 'Açarken nefes al, kapatırken ver.',
      commonMistakes: 'Gövdeyi sallayarak momentum kullanmak.',
      targetMover: 'Pectoralis Major (Sternal & Klaviküler)',
      supportMovers: 'Anterior Deltoid • Coracobrachialis'
    }
  },
  {
    id: 'face-pull',
    name: 'Cable Rope Face Pull',
    category: 'Çekiş (Pull)',
    anatomyRegion: 'Omuz',
    equipment: 'Kablo / Makine',
    targetMuscle: 'Arka Deltoid & Rotator Cuff (Dış Rotatörler)',
    synergistMuscles: 'Rhomboids • Orta/Üst Trapez • Infraspinatus',
    type: 'İzolasyon',
    setupAngle: 'Göz/Alın Seviyesi Kablo • Halat Aparatı',
    rpe: '8.5',
    descriptionPurpose: 'Omuz sağlığı, postür düzeltme ve 3D yuvarlak omuz görüntüsü için en kritik rehabilitatif hareket.',
    videoDuration: '02:40 / HD',
    videoViews: '330K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: 'rep-qVOkqgk',
    isPopular: true,
    popularityRank: 2,
    cues: [
      {
        title: 'Başparmaklar Geride',
        description: 'Halatı alttan kavrayın, çekerken başparmaklarınızı arkanıza doğru çevirerek dış rotasyon uygulayın.'
      },
      {
        title: 'Alına Doğru Çekiş',
        description: 'Halatın ortasını alnınıza veya göz hizanıza çekip dirsekleri yüksekte tutun.'
      }
    ],
    criticalMistake: 'Dirsekleri aşağı düşürerek hareketi dikey row hareketine dönüştürmek.',
    steps: [
      {
        stepNumber: 1,
        title: 'Tutuş & Duruş',
        subtitle: 'Halat Kavrama',
        description: 'Halat uçlarını tutun, bir adım geriye çekilip gövdeyi hafif geriye eğin.'
      },
      {
        stepNumber: 2,
        title: 'Çekiş & Dış Rotasyon',
        subtitle: 'Çift Aksiyon',
        description: 'Halatı yüzünüze çekerken ellerinizi iki yana açıp kulak hizasına getirin.'
      },
      {
        stepNumber: 3,
        title: 'İzometrik Tutuş',
        subtitle: '1 Saniye',
        description: 'Arka omuz ve kürek kemiklerini sıkıştırıp 1 saniye bekleyin.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Aşırı ağırlık takıp belden sallanmak',
        note: '(Rotatör manşet çalışmaz)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Tepe noktada elleri dirseklerin gerisine döndürmek',
        note: '(Kusursuz dış rotasyon)'
      }
    ],
    biomechanics: {
      activationPercent: 94,
      angleRecommendation: 'Göz hizası çekiş / 90° dirsek abdüksiyonu',
      criticalCues: ['Dirsekler omuz hizasından aşağı düşmemelidir.', 'Boynu kasmayın.'],
      breathingRhythm: 'Çekerken nefes ver, bırakırken al.',
      commonMistakes: 'Dirsekleri aşağı çekmek ve çeneye çekmek.',
      targetMover: 'Posterior Deltoid & Infraspinatus',
      supportMovers: 'Trapezius • Rhomboids'
    }
  },
  {
    id: 'dumbbell-hammer-curl',
    name: 'Dumbbell Hammer Curl',
    category: 'Çekiş (Pull)',
    anatomyRegion: 'Biceps',
    equipment: 'Dambıl',
    targetMuscle: 'Brachialis & Brachioradialis',
    synergistMuscles: 'Biceps Brachii • Ön Kol',
    type: 'İzolasyon',
    setupAngle: 'Nötr Tutuş (Çekiç) • Ayakta / Oturarak',
    rpe: '8.5',
    descriptionPurpose: 'Pazu ile triceps arasındaki brachialis kasını büyüterek kol kalınlığını ve ön kol gücünü artırır.',
    videoDuration: '02:20 / HD',
    videoViews: '220K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: 'zC3nLlEvin4',
    isPopular: true,
    popularityRank: 8,
    cues: [
      {
        title: 'Nötr Avuç İçi',
        description: 'Avuç içleri hareket boyunca birbirine bakmalı, bilekleri döndürmeyin.'
      },
      {
        title: 'Dirsek Sabitleme',
        description: 'Dirsekleri kaburga yanında menteşe gibi tutun, öne savurmayın.'
      }
    ],
    criticalMistake: 'Beli geriye savurarak ağırlığı fırlatmak.',
    steps: [
      {
        stepNumber: 1,
        title: 'Başlangıç',
        subtitle: 'Çekiç Tutuş',
        description: 'Dambılları yanlarda tutun, omuzları geriye kilitleyin.'
      },
      {
        stepNumber: 2,
        title: 'Kıvırma',
        subtitle: 'Omuz Hizasına',
        description: 'Bileği döndürmeden dambılı omuza doğru kıvırın.'
      },
      {
        stepNumber: 3,
        title: 'Negatif Faz',
        subtitle: 'Kontrollü İndirme',
        description: '2 saniyede kontrollü olarak dirseği kilitlemeden başlangıca indirin.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Dirsekleri öne kaldırarak omuza yük bindirmek',
        note: '(Kol izolasyonu kaybolur)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Tepe noktada brachialis kasını sıkmak',
        note: '(Kol kalınlığı etkisi)'
      }
    ],
    biomechanics: {
      activationPercent: 91,
      angleRecommendation: 'Nötr bilek açısı / Sabit dirsek pivotu',
      criticalCues: ['Bilekleri bükmeyin.', 'Kaldırırken dirsek oynamasın.'],
      breathingRhythm: 'Kaldırırken nefes ver, indirirken al.',
      commonMistakes: 'Momentum kullanmak.',
      targetMover: 'Brachialis & Brachioradialis',
      supportMovers: 'Biceps Brachii'
    }
  },
  {
    id: 'skull-crushers',
    name: 'Lying Triceps Extension (Skull Crushers)',
    category: 'İtiş (Push)',
    anatomyRegion: 'Triceps',
    equipment: 'Halter',
    targetMuscle: 'Triceps Brachii (Uzun & Medial Baş)',
    synergistMuscles: 'Ön Kol • Anconeus',
    type: 'İzolasyon',
    setupAngle: 'Düz Sehpa • EZ-Bar / Halter',
    rpe: '8.5',
    descriptionPurpose: 'Triceps uzun başını derin esneme altında çalıştırarak arka kol kütlesini patlatır.',
    videoDuration: '02:50 / HD',
    videoViews: '195K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: 'd_KZxkY_0cM',
    isPopular: true,
    popularityRank: 9,
    cues: [
      {
        title: 'Hafif Geriye Açılı Kollar',
        description: 'Kolları yere tam dik tutmak yerine hafifçe başın arkasına doğru 10° eğik tutarak tansiyonu kesmeyin.'
      },
      {
        title: 'Dirsekleri Kapatma',
        description: 'Dirseklerin yanlara aşırı açılmasına izin vermeyin, paralel tutun.'
      }
    ],
    criticalMistake: 'Dirsekleri yanlara açarak ve barı kontrolsüz indirerek dirsek tendonlarına şok bindirmek.',
    steps: [
      {
        stepNumber: 1,
        title: 'Uzanış & Pozisyon',
        subtitle: 'EZ-Bar Tutuş',
        description: 'Düz sehpaya uzanın, barı dar tutuşla yukarı kaldırın.'
      },
      {
        stepNumber: 2,
        title: 'Alna/Baş Arkasına İndiriş',
        subtitle: 'Eksantrik Esneme',
        description: 'Üst kolları sabit tutarak barı alnın hemen gerisine doğru indirin.'
      },
      {
        stepNumber: 3,
        title: 'Açılış & İtiş',
        subtitle: 'Tepe Sıkışma',
        description: 'Dirsekleri oynatmadan kolları düzleştirerek başlangıca dönün.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Dirsekleri yana açıp hareketi göğüs presine çevirmek',
        note: '(Triceps gerilimi düşer)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Barı alnın hafifçe arkasına indirip esnemeyi hissetmek',
        note: '(Uzun baş aktivasyonu)'
      }
    ],
    biomechanics: {
      activationPercent: 92,
      angleRecommendation: '75-80° humerus açısı / Tam dirsek fleksiyonu',
      criticalCues: ['EZ-bar kullanarak bilek baskısını azaltın.', 'Üst kol sabit kalsın.'],
      breathingRhythm: 'İndirirken nefes al, iterken ver.',
      commonMistakes: 'Omuzları hareket ettirip pullover yapmak.',
      targetMover: 'Triceps Brachii (Long & Medial Head)',
      supportMovers: 'Anconeus'
    }
  },
  {
    id: 'leg-extension',
    name: 'Seated Leg Extension',
    category: 'Bacak (Legs)',
    anatomyRegion: 'Bacak',
    equipment: 'Kablo / Makine',
    targetMuscle: 'Quadriceps (Rectus Femoris & Vastus)',
    synergistMuscles: 'Ön Bacak',
    type: 'İzolasyon',
    setupAngle: 'Oturarak • Ayak Bileği Pedi',
    rpe: '9.0',
    descriptionPurpose: 'Squat yaparken tam izole edilemeyen Rectus Femoris kasını tepe noktada maksimum kilitler.',
    videoDuration: '02:15 / HD',
    videoViews: '190K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: 'YyvSfVjQeL0',
    isPopular: true,
    popularityRank: 10,
    cues: [
      {
        title: 'Diz Eksen Hizalaması',
        description: 'Makinenin dönüş noktasıyla diz kapağınızın yan ekseni tam aynı hizada olmalıdır.'
      },
      {
        title: 'Tepe Noktada 1 Saniye Duraklama',
        description: 'Ağırlığı yukarı savurmayın; bacakları düzleştirip tepe noktada quads kaslarını taş gibi sıkın.'
      }
    ],
    criticalMistake: 'Aşırı ağır takıp kalçayı koltuktan havalandırarak momentumla fırlatmak.',
    steps: [
      {
        stepNumber: 1,
        title: 'Ayar & Oturuş',
        subtitle: 'Sırt Dayanağı',
        description: 'Sırtı mindere yapıştırın, ayak pedini kaval kemiğinin alt ucuna ayarlayın.'
      },
      {
        stepNumber: 2,
        title: 'Kaldırış & Kilit',
        subtitle: 'Tepe Sıkma',
        description: 'Bacakları yukarı doğru düzleştirin ve 1 saniye izometrik kasılma uygulayın.'
      },
      {
        stepNumber: 3,
        title: 'Negatif Kontrol',
        subtitle: '2-3 Saniye',
        description: 'Ağırlığı plakaların birbirine çarpmasına izin vermeden kontrollü indirin.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Ağırlığı hızla fırlatıp diz eklemine şok vermek',
        note: '(Patellar tendon stresi)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Tutacakları yukarı çekerek kalçayı koltuğa yapıştırmak',
        note: '(Tam quad izolasyonu)'
      }
    ],
    biomechanics: {
      activationPercent: 93,
      angleRecommendation: '90° kalça açısı / Tam diz ekstansiyonu',
      criticalCues: ['Tutacaklardan sıkıca tutunun.', 'Ayak uçlarını hafifçe kendinize çekin (dorsifleksiyon).'],
      breathingRhythm: 'Kaldırırken nefes ver, indirirken al.',
      commonMistakes: 'Momentum kullanmak ve kalçayı seleden kaldırmak.',
      targetMover: 'Quadriceps Femoris (Rectus Femoris Odaklı)',
      supportMovers: 'Tensor Fasciae Latae'
    }
  },
  {
    id: 'lying-leg-curl',
    name: 'Lying Hamstring Leg Curl',
    category: 'Bacak (Legs)',
    anatomyRegion: 'Bacak',
    equipment: 'Kablo / Makine',
    targetMuscle: 'Hamstrings (Arka Bacak)',
    synergistMuscles: 'Gastrocnemius • Gluteus',
    type: 'İzolasyon',
    setupAngle: 'Yüzüstü • Baldır Pedi',
    rpe: '9.0',
    descriptionPurpose: 'Diz fleksör fonksiyonu üzerinden arka bacak kaslarını izole ederek sakatlık direncini ve kütleyi artırır.',
    videoDuration: '02:25 / HD',
    videoViews: '180K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: '1Tq3QdYUuHs',
    isPopular: true,
    popularityRank: 11,
    cues: [
      {
        title: 'Pelvis Sehpaya Yapışık',
        description: 'Kıvırırken leğen kemiğinizi sehpadan kaldırmayın; kalçayı mindere bastırın.'
      },
      {
        title: 'Ayak Bileği Pozisyonu',
        description: 'Ayak parmaklarınızı geriye doğru çekerek (dorsifleksiyon) hamstring kasılmasını kuvvetlendirin.'
      }
    ],
    criticalMistake: 'Kalçayı yukarı kaldırarak belden kuvvet almak.',
    steps: [
      {
        stepNumber: 1,
        title: 'Yatış & Ayar',
        subtitle: 'Baldır Arkası Ped',
        description: 'Yüzüstü uzanın, pedi aşil tendonunun hemen üzerine ayarlayın.'
      },
      {
        stepNumber: 2,
        title: 'Kıvırma & Sıkma',
        subtitle: 'Kalçaya Doğru',
        description: 'Pedi kalçanıza doğru bükün ve tepe noktada 1 saniye arka bacağı sıkın.'
      },
      {
        stepNumber: 3,
        title: 'Yavaş Bırakış',
        subtitle: 'Eksantrik Gerilim',
        description: 'Ağırlığı yavaşça indirerek dizlerin tam açılmasına izin vermeden dönün.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Ağırlığı hızlıca geri bırakmak',
        note: '(Kas yırtılma riski)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Tutacakları kavrayıp karnı mindere kilitlemek',
        note: '(Sıfır lomber hareket)'
      }
    ],
    biomechanics: {
      activationPercent: 91,
      angleRecommendation: 'Tam diz fleksiyonu / Düz nötr pelvis',
      criticalCues: ['Diz kapağı sehpa kenarının hemen dışında kalmalıdır.', 'Ayak uçlarını kendinize çekin.'],
      breathingRhythm: 'Kıvırırken nefes ver, uzatırken al.',
      commonMistakes: 'Kalçayı sehpada kamburlaştırmak.',
      targetMover: 'Biceps Femoris • Semitendinosus • Semimembranosus',
      supportMovers: 'Gastrocnemius'
    }
  },
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Leg Raise (Barfiks Asılı Karın)',
    category: 'Core / Karın',
    anatomyRegion: 'Karın',
    equipment: 'Vücut Ağırlığı',
    targetMuscle: 'Alt Karın & Rectus Abdominis',
    synergistMuscles: 'Kalça Fleksörleri • Obliques • Tutuş Gücü',
    type: 'Bileşik (Kompleks)',
    setupAngle: 'Bara Asılı • Dikey',
    rpe: '9.0',
    descriptionPurpose: 'Pelvis posterior tilt mekaniği ile alt karın liflerini vücut ağırlığıyla derin şekilde kalınlaştırır.',
    videoDuration: '02:30 / HD',
    videoViews: '210K İzlenme',
    videoCoachVerified: true,
    videoThumbnailUrl: HOTLINK_IMAGE_URL,
    youtubeVideoId: 'Pr1ieGZ5atk',
    isPopular: true,
    popularityRank: 12,
    cues: [
      {
        title: 'Pelvis Yuvarlama (Tuck)',
        description: 'Sadece bacakları kaldırmayın; leğen kemiğinizi yukarı göğsünüze doğru bükün.'
      },
      {
        title: 'Salınımı Sıfırlama',
        description: 'Vücudu sarkaç gibi sallamayın, her tekrarda kontrollü duraklayın.'
      }
    ],
    criticalMistake: 'Sallanarak momentumla bacakları atmak ve kalça fleksörlerini aşırı yormak.',
    steps: [
      {
        stepNumber: 1,
        title: 'Asılma',
        subtitle: 'Omuzlar Aktif',
        description: 'Barfiks barına asılın, vücut salınımını tamamen durdurun.'
      },
      {
        stepNumber: 2,
        title: 'Kaldırış & Yuvarlama',
        subtitle: 'Pelvis Yukarı',
        description: 'Bacakları 90 dereceye veya göğse kadar çekerek pelvisi yuvarlayın.'
      },
      {
        stepNumber: 3,
        title: 'Kontrollü İndirme',
        subtitle: 'Sallanmadan',
        description: 'Bacakları yavaşça indirin, dip noktada sallanmayı engelleyin.'
      }
    ],
    mistakes: [
      {
        type: 'avoid',
        title: 'YAPILMAMASI GEREKEN',
        description: 'Beli arkaya büküp yaylanarak bacak fırlatmak',
        note: '(Lomber omurga ağrısı)'
      },
      {
        type: 'do',
        title: 'YAPILMASI GEREKEN',
        description: 'Tepe noktada nefesi tamamen boşaltmak',
        note: '(Derin rektus kasılması)'
      }
    ],
    biomechanics: {
      activationPercent: 92,
      angleRecommendation: '90° veya üzeri kalça fleksiyonu / Posterior pelvik tilt',
      criticalCues: ['Omuzları gevşek bırakmayın.', 'Pelvisi yukarı bükün.'],
      breathingRhythm: 'Kaldırırken kuvvetlice ver, indirirken al.',
      commonMistakes: 'Momentum kullanıp sarkaç gibi sallanmak.',
      targetMover: 'Rectus Abdominis (Özellikle Alt Segment)',
      supportMovers: 'Iliopsoas • Obliques • Latissimus Dorsi'
    }
  }
];

// Combine all 96 master exercises with base exercises
const exerciseRegistry = new Map<string, Exercise>();
USER_MASTER_EXERCISES.forEach((ex) => exerciseRegistry.set(ex.id, ex));
INITIAL_BASE_EXERCISES.forEach((ex) => {
  if (!exerciseRegistry.has(ex.id)) {
    exerciseRegistry.set(ex.id, ex);
  }
});

export const EXERCISES_DATA: Exercise[] = Array.from(exerciseRegistry.values());
export { USER_MASTER_EXERCISES };

export const INITIAL_WORKOUT_SESSION: WorkoutSession = {
  id: 'four-month-pazartesi-session',
  title: 'GÖĞÜS + TRICEPS + KARDİYO',
  dayLabel: 'GÜN 1 • PAZARTESİ',
  durationMinutesEstimate: 60,
  exercisesCount: 6,
  totalSets: 18,
  restSecondsDefault: 90,
  nextExercisePreview: 'Chest Press Machine (3×12)',
  nextRpe: 'RPE 8.0',
  exercises: [
    {
      exerciseId: 'chest-press-machine',
      currentSetIndex: 0,
      restSeconds: 90,
      isFinished: false,
      notes: '3 × 12 • Göğüs hizada itiş, dirsekleri kitlemeden tepe noktada sıkışma.',
      sets: [
        { id: 'cpm-1', setNumber: 1, targetWeight: 30, targetReps: 12, completedWeight: 30, completedReps: 12, isCompleted: true, note: 'Set 1 • 12 Tekrar' },
        { id: 'cpm-2', setNumber: 2, targetWeight: 30, targetReps: 12, completedWeight: 30, completedReps: 12, isCompleted: true, note: 'Set 2 • 12 Tekrar' },
        { id: 'cpm-3', setNumber: 3, targetWeight: 30, targetReps: 12, completedWeight: 30, completedReps: 12, isCompleted: false, note: 'Set 3 • 12 Tekrar' }
      ]
    },
    {
      exerciseId: 'incline-bench-dumbbell-press',
      currentSetIndex: 0,
      restSeconds: 90,
      isFinished: false,
      notes: '3 × 12 • 30° Eğim • Üst göğüs odaklı kontrollü negatif.',
      sets: [
        { id: 'ibdp-1', setNumber: 1, targetWeight: 16, targetReps: 12, isCompleted: false, note: 'Set 1 • 12 Tekrar' },
        { id: 'ibdp-2', setNumber: 2, targetWeight: 16, targetReps: 12, isCompleted: false, note: 'Set 2 • 12 Tekrar' },
        { id: 'ibdp-3', setNumber: 3, targetWeight: 16, targetReps: 12, isCompleted: false, note: 'Set 3 • 12 Tekrar' }
      ]
    },
    {
      exerciseId: 'pec-dec-flying',
      currentSetIndex: 0,
      restSeconds: 90,
      isFinished: false,
      notes: '3 × 12 • Göğüs izolasyonu, dirsekler hafif kırık.',
      sets: [
        { id: 'pdf-1', setNumber: 1, targetWeight: 35, targetReps: 12, isCompleted: false, note: 'Set 1 • 12 Tekrar' },
        { id: 'pdf-2', setNumber: 2, targetWeight: 35, targetReps: 12, isCompleted: false, note: 'Set 2 • 12 Tekrar' },
        { id: 'pdf-3', setNumber: 3, targetWeight: 35, targetReps: 12, isCompleted: false, note: 'Set 3 • 12 Tekrar' }
      ]
    },
    {
      exerciseId: 'cable-cross-over',
      currentSetIndex: 0,
      restSeconds: 90,
      isFinished: false,
      notes: '3 × 12 • Alt & iç göğüs liflerinde maksimum tepe gerilim.',
      sets: [
        { id: 'cco-1', setNumber: 1, targetWeight: 15, targetReps: 12, isCompleted: false, note: 'Set 1 • 12 Tekrar' },
        { id: 'cco-2', setNumber: 2, targetWeight: 15, targetReps: 12, isCompleted: false, note: 'Set 2 • 12 Tekrar' },
        { id: 'cco-3', setNumber: 3, targetWeight: 15, targetReps: 12, isCompleted: false, note: 'Set 3 • 12 Tekrar' }
      ]
    },
    {
      exerciseId: 'triceps-push-down',
      currentSetIndex: 0,
      restSeconds: 75,
      isFinished: false,
      notes: '3 × 12 • Düz Bar • Dirsekler gövdeye kilitli.',
      sets: [
        { id: 'tpd-1', setNumber: 1, targetWeight: 25, targetReps: 12, isCompleted: false, note: 'Set 1 • 12 Tekrar' },
        { id: 'tpd-2', setNumber: 2, targetWeight: 25, targetReps: 12, isCompleted: false, note: 'Set 2 • 12 Tekrar' },
        { id: 'tpd-3', setNumber: 3, targetWeight: 25, targetReps: 12, isCompleted: false, note: 'Set 3 • 12 Tekrar' }
      ]
    },
    {
      exerciseId: 'rope-triceps-push-down',
      currentSetIndex: 0,
      restSeconds: 75,
      isFinished: false,
      notes: '3 × 12 • Halat Aparatı • Dipte iki yana açarak triceps uzun başını sıkıştır.',
      sets: [
        { id: 'rtpd-1', setNumber: 1, targetWeight: 20, targetReps: 12, isCompleted: false, note: 'Set 1 • 12 Tekrar' },
        { id: 'rtpd-2', setNumber: 2, targetWeight: 20, targetReps: 12, isCompleted: false, note: 'Set 2 • 12 Tekrar' },
        { id: 'rtpd-3', setNumber: 3, targetWeight: 20, targetReps: 12, isCompleted: false, note: 'Set 3 • 12 Tekrar' }
      ]
    }
  ],
  cardio: {
    id: 'cardio-pazartesi-1',
    type: 'incline_walk',
    name: 'Eğimli Yürüyüş Bandı (Treadmill Zone 2)',
    durationMinutes: 30,
    inclinePercent: 12,
    speedKmh: 4.5,
    heartRateZone: 'Zone 2 Yağ Yakımı (Hız: 4.0–4.5 km/h • Eğim: %8–12)',
    targetCalories: 285,
    completed: false,
  }
};

export const INITIAL_NUTRITION: DailyNutrition = {
  proteinGrams: 0,
  proteinTarget: 185,
  energyKcal: 0,
  energyTarget: 1750,
  carbsGrams: 0,
  carbsTarget: 145,
  fatsGrams: 0,
  fatsTarget: 44,
  hydrationLiters: 0,
  hydrationTarget: 3.25,
  sodiumMg: 0,
  sodiumTargetMg: 3000,
  goal: 'KİŞİSEL BESLENME DÜZENİ',
  meals: [
    {
      id: 'meal-1',
      name: 'Kahvaltı (08:00)',
      time: '08:00',
      protein: 38,
      carbs: 35,
      fats: 16,
      calories: 430,
      description: '3 yumurta, 100g lor, 2 dilim tam buğday ekmeği, domates + salatalık.',
      completed: false,
    },
    {
      id: 'meal-2',
      name: 'Öğle Yemeği (13:00)',
      time: '13:00',
      protein: 60,
      carbs: 48,
      fats: 14,
      calories: 560,
      description: '200g baharatlı tavuk göğsü, 150g pişmiş pirinç, salata, 150g yoğurt.',
      completed: false,
    },
    {
      id: 'meal-3',
      name: 'Ara Öğün (16:30)',
      time: '16:30',
      protein: 26,
      carbs: 22,
      fats: 2,
      calories: 220,
      description: '1 muz + 1 ölçek whey protein.',
      completed: false,
    },
    {
      id: 'meal-4',
      name: 'Akşam Yemeği (19:00)',
      time: '19:00',
      protein: 61,
      carbs: 40,
      fats: 12,
      calories: 540,
      description: '200g az yağlı kıymalı fırın patates, 200g yoğurt, mevsim salatası.',
      completed: false,
    },
  ],
  supplements: [
    {
      id: 'sup-1',
      name: 'Kreatin Monohidrat (Creapure)',
      dosage: '5g',
      timeWindow: 'Antrenman öncesi',
      purpose: 'Hücresel ATP üretimi & güç artışı',
      taken: false,
    },
    {
      id: 'sup-2',
      name: 'Susuz Kafein',
      dosage: '200mg',
      timeWindow: '30 dk önce',
      purpose: 'Santral sinir sistemi uyarımı & odak',
      taken: false,
    },
    {
      id: 'sup-3',
      name: 'Omega-3 Balık Yağı (EPA/DHA)',
      dosage: '2 Kapsül (2000mg)',
      timeWindow: 'Kahvaltı ile',
      purpose: 'Eklem inflamasyonu kontrolü & kardiyovasküler destek',
      taken: false,
    },
    {
      id: 'sup-4',
      name: 'Vitamin D3 (5000 IU) + K2',
      dosage: '1 Damla',
      timeWindow: 'Sabah yağlı öğünle',
      purpose: 'Kemik yoğunluğu & testosteron sentezi',
      taken: false,
    },
    {
      id: 'sup-5',
      name: 'Magnezyum Bisglisinat + Çinko (ZMA)',
      dosage: '400mg',
      timeWindow: 'Uykudan 45 dk önce',
      purpose: 'Derin uyku (REM fazı) & kas gevşemesi',
      taken: false,
    },
  ],
};

export const INITIAL_CHECKINS: CheckInItem[] = [
  {
    id: 'chk-1',
    title: 'Uyku İyileşmesi',
    subtitle: 'Hedef: 8 saat',
    metricBadge: '7s 45dk',
    statusText: 'Verimli',
    completed: false,
    type: 'sleep',
    icon: 'bedtime'
  },
  {
    id: 'chk-2',
    title: 'Öğün 3 (13:30)',
    subtitle: 'Tavuklu Pirinç Pilavı',
    metricBadge: '+45g P',
    statusText: '620 kcal',
    completed: false,
    type: 'meal',
    icon: 'restaurant'
  },
  {
    id: 'chk-3',
    title: 'Antrenman Öncesi Takviye',
    subtitle: 'Kreatin 5g + Kafein',
    metricBadge: 'Alındı',
    completed: false,
    type: 'supplement',
    icon: 'pill'
  },
  {
    id: 'chk-4',
    title: 'Akşam Hidrasyon Hedefi',
    subtitle: 'Kalan 700ml su tüketimi',
    metricBadge: 'Bekliyor',
    completed: false,
    type: 'hydration',
    icon: 'water_drop'
  }
];

export const ATHLETE_PROFILE: AthleteProfile = {
  name: 'Utku Can ER',
  program: '4 Aylık Yağ Yakımı & Hipertrofi (3×12 + Kardiyo)',
  heightCm: 177,
  weightKg: 110,
  age: 28,
  bodyFatPercent: 28.5,
  sessionsCompleted: 0,
  weeklyTargetSets: {
    chest: { target: 18, done: 0 },
    back: { target: 18, done: 0 },
    legs: { target: 18, done: 0 },
    shoulders: { target: 15, done: 0 },
    arms: { target: 15, done: 0 }
  },
  zinciriKirma: {
    currentStreak: 1,
    longestStreak: 1,
    totalDaysCompleted: 0,
    lastCompletedDate: undefined,
    weeklyCalendar: generateFourMonthWeeklyCalendar(),
  }
};

export const INITIAL_DAILY_HISTORY: DailyHistoryRecord[] = [
  {
    id: 'hist-20260927',
    date: '27 Eylül 2026',
    isoDate: '2026-09-27',
    dayName: 'Pazar',
    timestamp: 1790467200000,
    energyKcal: 2450,
    energyTarget: 2600,
    proteinGrams: 175,
    proteinTarget: 180,
    carbsGrams: 260,
    carbsTarget: 290,
    fatsGrams: 64,
    fatsTarget: 70,
    hydrationLiters: 3.2,
    hydrationTarget: 3.5,
    completedMealsCount: 4,
    totalMealsCount: 4,
    meals: [
      { id: 'h1', name: 'Yulaf & Whey Karışımı', time: '08:30', protein: 38, carbs: 62, fats: 12, calories: 510, description: 'Yulaf ezmesi, muz ve fıstık ezmesi', completed: true },
      { id: 'h2', name: 'Fırın Somon & Tatlı Patates', time: '13:00', protein: 46, carbs: 70, fats: 20, calories: 650, description: 'Zeytinyağlı yeşil salata ile', completed: true },
      { id: 'h3', name: 'Hindistan Cevizli Yoğurt Kasesi', time: '17:00', protein: 32, carbs: 45, fats: 10, calories: 410, description: 'Böğürtlen ve bal ilaveli', completed: true },
      { id: 'h4', name: 'Izgara Tavuk Fileto & Kinoa', time: '20:30', protein: 59, carbs: 83, fats: 22, calories: 880, description: 'Avokadolu taze kinoa kasesi', completed: true },
    ],
    workoutCompleted: true,
    workoutTitle: 'Zone 2 Eğimli Kardiyo & Mobilite',
    workoutDurationMinutes: 35,
    totalSetsCompleted: 0,
    cardioMinutes: 30,
    cardioCalories: 260,
    weightKg: 110.0,
    notes: 'Dinlenme günü; 30 dk %10 eğimli hafif yürüyüş ile toparlanma sağlandı.',
  },
  {
    id: 'hist-20260926',
    date: '26 Eylül 2026',
    isoDate: '2026-09-26',
    dayName: 'Cumartesi',
    timestamp: 1790380800000,
    energyKcal: 2720,
    energyTarget: 2600,
    proteinGrams: 188,
    proteinTarget: 180,
    carbsGrams: 310,
    carbsTarget: 290,
    fatsGrams: 72,
    fatsTarget: 70,
    hydrationLiters: 3.8,
    hydrationTarget: 3.5,
    completedMealsCount: 4,
    totalMealsCount: 4,
    meals: [
      { id: 'h5', name: '4 Yumurtalı Omlet & Çavdar Ekmeği', time: '09:00', protein: 42, carbs: 55, fats: 22, calories: 580, description: 'Lor peynirli ve avokadolu', completed: true },
      { id: 'h6', name: 'Biftek & Fırın Patates', time: '13:30', protein: 58, carbs: 85, fats: 24, calories: 790, description: 'Bacak öncesi glikojen deposu', completed: true },
      { id: 'h7', name: 'İzole Whey & Pirinç Patlağı', time: '17:30', protein: 36, carbs: 50, fats: 4, calories: 380, description: 'Antrenman sonrası hızlı toparlanma', completed: true },
      { id: 'h8', name: 'Hindi Göğsü & Basmati Pirinç', time: '21:00', protein: 52, carbs: 120, fats: 22, calories: 970, description: 'Günün son ana öğünü', completed: true },
    ],
    workoutCompleted: true,
    workoutTitle: 'Ağır Bacak & Kalf Hipertrofisi',
    workoutDurationMinutes: 62,
    totalSetsCompleted: 18,
    cardioMinutes: 15,
    cardioCalories: 140,
    weightKg: 82.6,
    notes: 'Squat 100kg x 8 tekrar temiz çıktı. Bacaklarda yüksek pump.',
  },
  {
    id: 'hist-20260925',
    date: '25 Eylül 2026',
    isoDate: '2026-09-25',
    dayName: 'Cuma',
    timestamp: 1790294400000,
    energyKcal: 2580,
    energyTarget: 2600,
    proteinGrams: 182,
    proteinTarget: 180,
    carbsGrams: 285,
    carbsTarget: 290,
    fatsGrams: 67,
    fatsTarget: 70,
    hydrationLiters: 3.5,
    hydrationTarget: 3.5,
    completedMealsCount: 4,
    totalMealsCount: 4,
    meals: [
      { id: 'h9', name: 'Yulaf, Çilek & Protein Tozu', time: '08:00', protein: 35, carbs: 65, fats: 10, calories: 490, description: 'Kahvaltı kasesi', completed: true },
      { id: 'h10', name: 'Tavuk Göğsü & Bulgur Pilavı', time: '12:30', protein: 52, carbs: 75, fats: 16, calories: 660, description: 'Yeşillikli öğle yemeği', completed: true },
      { id: 'h11', name: 'Süzme Peynir & Ceviz', time: '16:30', protein: 28, carbs: 20, fats: 18, calories: 360, description: 'İkindi atıştırmalığı', completed: true },
      { id: 'h12', name: 'Ton Balıklı Makarna & Zeytinyağı', time: '20:00', protein: 67, carbs: 125, fats: 23, calories: 1070, description: 'Akşam yemeği', completed: true },
    ],
    workoutCompleted: true,
    workoutTitle: 'Çekiş (Pull) & Kanat / Biceps',
    workoutDurationMinutes: 55,
    totalSetsCompleted: 16,
    cardioMinutes: 20,
    cardioCalories: 180,
    weightKg: 82.4,
    notes: 'Lat pulldown ve Seated Cable Row tam açıyla çalışıldı.',
  },
  {
    id: 'hist-20260924',
    date: '24 Eylül 2026',
    isoDate: '2026-09-24',
    dayName: 'Perşembe',
    timestamp: 1790208000000,
    energyKcal: 2610,
    energyTarget: 2600,
    proteinGrams: 184,
    proteinTarget: 180,
    carbsGrams: 288,
    carbsTarget: 290,
    fatsGrams: 69,
    fatsTarget: 70,
    hydrationLiters: 3.4,
    hydrationTarget: 3.5,
    completedMealsCount: 4,
    totalMealsCount: 4,
    meals: [
      { id: 'h13', name: 'Yumurta Beyazı & Yulaf Pankek', time: '08:15', protein: 40, carbs: 60, fats: 12, calories: 510, description: 'Muzlu şekersiz pankek', completed: true },
      { id: 'h14', name: 'Izgara Köfte & Patates Püresi', time: '13:00', protein: 48, carbs: 80, fats: 24, calories: 730, description: 'Buharda brokoli eşliğinde', completed: true },
      { id: 'h15', name: 'Muzlu Protein Shake', time: '17:00', protein: 32, carbs: 42, fats: 6, calories: 350, description: 'Antrenman öncesi', completed: true },
      { id: 'h16', name: 'Fırın Tavuk Baget & Basmati', time: '20:30', protein: 64, carbs: 106, fats: 27, calories: 1020, description: 'Akşam toparlanma menüsü', completed: true },
    ],
    workoutCompleted: true,
    workoutTitle: 'İtiş (Push) • Göğüs & Omuz & Triceps',
    workoutDurationMinutes: 58,
    totalSetsCompleted: 17,
    cardioMinutes: 20,
    cardioCalories: 190,
    weightKg: 110.4,
    notes: 'Incline Dumbbell Press 32kg ile 9 tekrar yapıldı.',
  },
  {
    id: 'hist-20260923',
    date: '23 Eylül 2026',
    isoDate: '2026-09-23',
    dayName: 'Çarşamba',
    timestamp: 1790121600000,
    energyKcal: 2380,
    energyTarget: 2600,
    proteinGrams: 172,
    proteinTarget: 180,
    carbsGrams: 245,
    carbsTarget: 290,
    fatsGrams: 62,
    fatsTarget: 70,
    hydrationLiters: 3.1,
    hydrationTarget: 3.5,
    completedMealsCount: 3,
    totalMealsCount: 4,
    meals: [
      { id: 'h17', name: 'Granola & Yoğurt', time: '09:00', protein: 28, carbs: 55, fats: 14, calories: 460, description: 'Meyveli kase', completed: true },
      { id: 'h18', name: 'Tavuk Salata & Zeytinyağı', time: '14:00', protein: 55, carbs: 40, fats: 22, calories: 580, description: 'Hafif öğle yemeği', completed: true },
      { id: 'h19', name: 'Somon Izgara & Kuşkonmaz', time: '20:00', protein: 58, carbs: 65, fats: 26, calories: 730, description: 'Omega-3 zengini akşam', completed: true },
      { id: 'h20', name: 'Kazein Proteini & Badem', time: '22:30', protein: 31, carbs: 85, fats: 0, calories: 610, description: 'Gece beslenmesi', completed: false },
    ],
    workoutCompleted: false,
    workoutTitle: 'Tam Dinlenme & Sauna',
    workoutDurationMinutes: 0,
    totalSetsCompleted: 0,
    cardioMinutes: 0,
    cardioCalories: 0,
    weightKg: 110.2,
    notes: 'Pasif toparlanma günü. 200 kcal hafif kalori açığı verildi.',
  },
  {
    id: 'hist-20260922',
    date: '22 Eylül 2026',
    isoDate: '2026-09-22',
    dayName: 'Salı',
    timestamp: 1790035200000,
    energyKcal: 2680,
    energyTarget: 2600,
    proteinGrams: 185,
    proteinTarget: 180,
    carbsGrams: 300,
    carbsTarget: 290,
    fatsGrams: 70,
    fatsTarget: 70,
    hydrationLiters: 3.6,
    hydrationTarget: 3.5,
    completedMealsCount: 4,
    totalMealsCount: 4,
    meals: [
      { id: 'h21', name: 'Omlet & Hindi Füme', time: '08:00', protein: 44, carbs: 45, fats: 18, calories: 520, description: 'Tam buğday ekmekli', completed: true },
      { id: 'h22', name: 'Dana Kıyma & Yasemin Pirinç', time: '13:00', protein: 52, carbs: 85, fats: 20, calories: 730, description: 'Bacak öncesi yükleme', completed: true },
      { id: 'h23', name: 'Pirinç Unu Lapası & Whey', time: '17:30', protein: 35, carbs: 60, fats: 5, calories: 425, description: 'Hızlı sindirilen antrenman sonrası', completed: true },
      { id: 'h24', name: 'Fırında Tavuk Pirzola & Tatlı Patates', time: '21:00', protein: 54, carbs: 110, fats: 27, calories: 1005, description: 'Doyurucu akşam öğünü', completed: true },
    ],
    workoutCompleted: true,
    workoutTitle: 'Bacak Hacmi & Karın Core',
    workoutDurationMinutes: 60,
    totalSetsCompleted: 17,
    cardioMinutes: 20,
    cardioCalories: 175,
    weightKg: 110.7,
    notes: 'Leg press 160kg ile 12 tekrar 4 set. Karın kablo crunch eklendi.',
  },
  {
    id: 'hist-20260921',
    date: '21 Eylül 2026',
    isoDate: '2026-09-21',
    dayName: 'Pazartesi',
    timestamp: 1789948800000,
    energyKcal: 2540,
    energyTarget: 2600,
    proteinGrams: 180,
    proteinTarget: 180,
    carbsGrams: 275,
    carbsTarget: 290,
    fatsGrams: 66,
    fatsTarget: 70,
    hydrationLiters: 3.4,
    hydrationTarget: 3.5,
    completedMealsCount: 4,
    totalMealsCount: 4,
    meals: [
      { id: 'h25', name: 'Yulaf Lapası & Fıstık Ezmesi', time: '08:30', protein: 36, carbs: 60, fats: 16, calories: 530, description: 'Chia tohumlu', completed: true },
      { id: 'h26', name: 'Izgara Tavuk Göğsü & Kinoa', time: '13:00', protein: 50, carbs: 70, fats: 14, calories: 610, description: 'Limonlu ve zeytinyağlı', completed: true },
      { id: 'h27', name: 'Protein Bar & Yeşil Elma', time: '17:00', protein: 25, carbs: 35, fats: 9, calories: 320, description: 'Pratik ara öğün', completed: true },
      { id: 'h28', name: 'Levrek Fileto & Fırın Patates', time: '20:30', protein: 69, carbs: 110, fats: 27, calories: 1080, description: 'Balık ziyafeti', completed: true },
    ],
    workoutCompleted: true,
    workoutTitle: 'Üst Gövde Hipertrofi Seansı',
    workoutDurationMinutes: 65,
    totalSetsCompleted: 18,
    cardioMinutes: 25,
    cardioCalories: 210,
    weightKg: 110.5,
    notes: 'Haftanın ilk antrenmanı yüksek motivasyonla tamamlandı.',
  }
];

export const INITIAL_WORKOUT_HISTORY: CompletedWorkoutRecord[] = [
  {
    id: 'wkout-20260927-1',
    title: 'Zone 2 Eğimli Kardiyo & Mobilite',
    date: '27 Eylül 2026',
    isoDate: '2026-09-27',
    timestamp: 1790467200000,
    durationSeconds: 2100,
    durationMinutes: 35,
    totalVolumeKg: 0,
    totalSetsCompleted: 0,
    totalSetsTarget: 0,
    exercises: [],
    cardio: {
      name: 'Eğimli Yürüyüş Bandı (Incline Walk)',
      durationMinutes: 30,
      caloriesBurned: 260,
    },
    notes: 'Dinlenme günü toparlanma kardiyosu.',
  },
  {
    id: 'wkout-20260926-1',
    title: 'Ağır Bacak & Kalf Hipertrofisi',
    date: '26 Eylül 2026',
    isoDate: '2026-09-26',
    timestamp: 1790380800000,
    durationSeconds: 3720,
    durationMinutes: 62,
    totalVolumeKg: 14850,
    totalSetsCompleted: 18,
    totalSetsTarget: 18,
    exercises: [
      {
        exerciseId: 'barbell-back-squat',
        exerciseName: 'Barbell Back Squat',
        sets: [
          { setNumber: 1, weight: 100, reps: 10, isCompleted: true },
          { setNumber: 2, weight: 110, reps: 8, isCompleted: true },
          { setNumber: 3, weight: 120, reps: 6, isCompleted: true },
          { setNumber: 4, weight: 125, reps: 5, isCompleted: true },
        ],
      },
      {
        exerciseId: 'leg-press-45',
        exerciseName: '45° Leg Press',
        sets: [
          { setNumber: 1, weight: 160, reps: 12, isCompleted: true },
          { setNumber: 2, weight: 180, reps: 10, isCompleted: true },
          { setNumber: 3, weight: 200, reps: 8, isCompleted: true },
        ],
      },
      {
        exerciseId: 'romanian-deadlift',
        exerciseName: 'Romanian Deadlift (RDL)',
        sets: [
          { setNumber: 1, weight: 80, reps: 10, isCompleted: true },
          { setNumber: 2, weight: 90, reps: 8, isCompleted: true },
          { setNumber: 3, weight: 100, reps: 8, isCompleted: true },
        ],
      },
      {
        exerciseId: 'leg-extension',
        exerciseName: 'Seated Leg Extension',
        sets: [
          { setNumber: 1, weight: 55, reps: 12, isCompleted: true },
          { setNumber: 2, weight: 60, reps: 12, isCompleted: true },
          { setNumber: 3, weight: 65, reps: 10, isCompleted: true },
        ],
      },
      {
        exerciseId: 'lying-leg-curl',
        exerciseName: 'Lying Hamstring Leg Curl',
        sets: [
          { setNumber: 1, weight: 45, reps: 12, isCompleted: true },
          { setNumber: 2, weight: 50, reps: 10, isCompleted: true },
          { setNumber: 3, weight: 50, reps: 10, isCompleted: true },
        ],
      },
    ],
    cardio: {
      name: 'Yürüyüş Bandı Eğimli Yürüyüş',
      durationMinutes: 15,
      caloriesBurned: 140,
    },
    notes: 'Squat 125 kg yeni PR! Bacak pompası harikaydı.',
  },
  {
    id: 'wkout-20260925-1',
    title: 'Çekiş & Biceps Güç Seansı (Pull A)',
    date: '25 Eylül 2026',
    isoDate: '2026-09-25',
    timestamp: 1790294400000,
    durationSeconds: 3480,
    durationMinutes: 58,
    totalVolumeKg: 11420,
    totalSetsCompleted: 16,
    totalSetsTarget: 16,
    exercises: [
      {
        exerciseId: 'barbell-deadlift',
        exerciseName: 'Conventional Barbell Deadlift',
        sets: [
          { setNumber: 1, weight: 120, reps: 6, isCompleted: true },
          { setNumber: 2, weight: 140, reps: 5, isCompleted: true },
          { setNumber: 3, weight: 150, reps: 4, isCompleted: true },
        ],
      },
      {
        exerciseId: 'pull-up',
        exerciseName: 'Pull-Up (Barfiks)',
        sets: [
          { setNumber: 1, weight: 82.5, reps: 10, isCompleted: true },
          { setNumber: 2, weight: 82.5, reps: 8, isCompleted: true },
          { setNumber: 3, weight: 82.5, reps: 8, isCompleted: true },
        ],
      },
      {
        exerciseId: 'seated-cable-row',
        exerciseName: 'Seated Cable Row',
        sets: [
          { setNumber: 1, weight: 65, reps: 10, isCompleted: true },
          { setNumber: 2, weight: 70, reps: 10, isCompleted: true },
          { setNumber: 3, weight: 75, reps: 8, isCompleted: true },
        ],
      },
      {
        exerciseId: 'barbell-biceps-curl',
        exerciseName: 'Barbell Biceps Curl',
        sets: [
          { setNumber: 1, weight: 35, reps: 10, isCompleted: true },
          { setNumber: 2, weight: 40, reps: 8, isCompleted: true },
          { setNumber: 3, weight: 40, reps: 8, isCompleted: true },
        ],
      },
    ],
    cardio: {
      name: 'Eliptik Bisiklet',
      durationMinutes: 20,
      caloriesBurned: 180,
    },
    notes: 'Deadlift 150 kg 4 tekrar temiz lockout.',
  },
  {
    id: 'wkout-20260923-1',
    title: 'Göğüs & Triceps Güç Seansı (Push A)',
    date: '23 Eylül 2026',
    isoDate: '2026-09-23',
    timestamp: 1790121600000,
    durationSeconds: 3300,
    durationMinutes: 55,
    totalVolumeKg: 10980,
    totalSetsCompleted: 16,
    totalSetsTarget: 16,
    exercises: [
      {
        exerciseId: 'barbell-bench-press',
        exerciseName: 'Barbell Bench Press',
        sets: [
          { setNumber: 1, weight: 80, reps: 10, isCompleted: true },
          { setNumber: 2, weight: 85, reps: 8, isCompleted: true },
          { setNumber: 3, weight: 90, reps: 6, isCompleted: true },
          { setNumber: 4, weight: 90, reps: 6, isCompleted: true },
        ],
      },
      {
        exerciseId: 'incline-dumbbell-press',
        exerciseName: 'Incline Dumbbell Press',
        sets: [
          { setNumber: 1, weight: 32, reps: 10, isCompleted: true },
          { setNumber: 2, weight: 34, reps: 10, isCompleted: true },
          { setNumber: 3, weight: 34, reps: 8, isCompleted: true },
        ],
      },
      {
        exerciseId: 'cable-triceps-pushdown',
        exerciseName: 'Cable Triceps Pushdown',
        sets: [
          { setNumber: 1, weight: 30, reps: 15, isCompleted: true },
          { setNumber: 2, weight: 32.5, reps: 12, isCompleted: true },
          { setNumber: 3, weight: 35, reps: 10, isCompleted: true },
        ],
      },
    ],
    cardio: {
      name: 'Yürüyüş Bandı Eğimli',
      durationMinutes: 20,
      caloriesBurned: 190,
    },
    notes: 'Bench press 90 kg ile 6 tekrar başarıyla tamamlandı.',
  }
];


