'use client';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase'; // Supabase istemci yolunu kontrol et

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // OTP ve Adım Yönetimi için State'ler
  const [step, setStep] = useState(1); // 1: Hero, 2: OTP Ekranı
  const [email, setEmail] = useState('m.asimdnzl13@gmail.com'); // Kayıt sayfasından gelen maili tutar
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  // OTP Doğrulama Fonksiyonu
  const handleVerifyOTP = async () => {
    if (otpCode.length !== 6) {
      alert("Lütfen 6 haneli kodu giriniz.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otpCode,
        type: 'signup',
      });

      if (error) throw error;

      alert("Doğrulama başarılı! Dashboard'a yönlendiriliyorsunuz.");
      // window.location.href = '/dashboard';
    } catch (error: any) {
      alert("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const ozellikler = [
    { icon: '🔍', baslik: 'Algoritma & SEO', aciklama: 'Instagram ve TikTok algoritmasını anla, içeriklerini öne çıkar. Google\'da üst sıralara çık.' },
    { icon: '🎬', baslik: 'İçerik Serisi', aciklama: 'Birbirine bağlı içerik serileri oluştur. Her bölüm için sahne sahne senaryo, izleyiciyi bağımlı et.' },
    { icon: '🚨', baslik: 'Kriz Yönetimi', aciklama: 'Kötü yorum, müşteri şikayeti, viral kriz — 3 farklı profesyonel cevap seçeneği anında hazır.' },
    { icon: '🚀', baslik: 'Lansman Stratejisti', aciklama: 'Ürün daha çıkmadan talep yarat. 14 günlük gün gün lansman takvimi ve reklam stratejisi.' },
    { icon: '👥', baslik: 'Müşteri Kitlesi Analizi', aciklama: 'Hedef kitlenin kim olduğunu öğren. Yaş, ilgi alanı, harcama alışkanlıkları, dijital davranışlar.' },
    { icon: '📤', baslik: 'Paylaşımla Büyüme', aciklama: '"Bunu arkadaşıma göndermem lazım" dedirten video fikirleri. Viral döngü içerikleri üret.' },
    { icon: '📊', baslik: 'Performans Tahmini', aciklama: 'İçeriği paylaşmadan önce viral olma ihtimalini öğren. Skor + gerekçe + iyileştirme önerisi.' },
    { icon: '🔎', baslik: 'Profil Denetimi', aciklama: 'Bio, highlight, gönderi düzeni — her şeyi analiz et. Alternatif bio seçenekleri hazır.' },
    { icon: '⚔️', baslik: 'Rakip Analizi', aciklama: 'Rakibinin boşluklarını bul. Henüz kimsenin yapmadığı içerik formatlarını yakala.' },
    { icon: '🕐', baslik: 'En İyi Saat Bulucu', aciklama: 'Sektör + şehir + hedef kitleye göre hangi gün hangi saat paylaşım yapmalısın.' },
    { icon: '🏄', baslik: 'Trend Sörfçüsü', aciklama: 'Bugün patlayan trendleri yakala. 24 saat içinde nasıl uygulayacağını sahne sahne öğren.' },
    { icon: '📈', baslik: 'Aylık Büyüme Raporu', aciklama: 'Ajans kalitesinde büyüme analizi. Tüm veriler, öneriler ve PDF rapor.' },
  ];

  return (
    <main className="bg-black text-white">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-black/60 backdrop-blur-md border-b border-white/10">
        <div className="text-xl font-bold tracking-wider">
          VIA<span className="text-violet-500">.AI</span>
        </div>
        <div className="flex gap-3">
          <a href="/giris" className="text-zinc-300 hover:text-white px-4 py-2 rounded-lg transition text-sm">
            Giriş Yap
          </a>
          <a href="/kayit" className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg transition text-sm font-semibold">
            Kaydol
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs px-4 py-1.5 rounded-full mb-8 tracking-widest font-medium">
            ✦ YAPAY ZEKA SOSYAL MEDYA MÜHENDİSİ
          </div>
          <h1 className="mb-6 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontWeight: 800 }}>
  <span className="text-white block">YOLUNUZU</span>
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600 block">
    VIA İLE ÇİZİN.
  </span>
</h1>
          <p className="text-zinc-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Sosyal medya içerik planlamalarınızı ve dijital büyümenizi{' '}
            <span className="text-white font-semibold">biz inşa edelim.</span>{' '}
            İşletmeler ve bireyler için{' '}
            <span className="text-violet-400">yapay zeka destekli</span>{' '}
            içerik stratejisi, tek platformda.
          </p>

          {/* DÜZELTİLEN BUTONLAR KISMI */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/kayit"
              className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-8 py-3.5 rounded-full text-sm font-bold transition tracking-wide"
            >
              HEMEN BAŞLA →
            </a>
            <a
              href="/giris"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-full text-sm font-semibold transition"
            >
              Giriş Yap
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-zinc-500 text-xs tracking-widest">
          ↓ AŞAĞI KAYDIR
        </div>
      </section>

      {/* KİMLER İÇİN */}
      <section className="px-8 py-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-violet-600/20 to-violet-900/10 border border-violet-500/30 rounded-2xl p-8">
            <div className="text-3xl mb-4">🏪</div>
            <h3 className="text-xl font-bold mb-3">İşletmeler için</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Kafe, berber, restoran, butik — ne olursa olsun. Rakiplerinden önce trende gir, müşteri kazan, sosyal medyada büyü.
            </p>
            <ul className="text-zinc-300 text-sm space-y-2">
              {['Rakip analizi ve boşluk tespiti', 'Kriz yönetimi ve müşteri ilişkileri', 'Lansman stratejisi ve reklam planı', 'Aylık büyüme raporu'].map(m => (
                <li key={m} className="flex items-center gap-2">
                  <span className="text-violet-400">✓</span> {m}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-pink-600/20 to-pink-900/10 border border-pink-500/30 rounded-2xl p-8">
            <div className="text-3xl mb-4">👤</div>
            <h3 className="text-xl font-bold mb-3">Bireyler & İçerik Üreticiler için</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Influencer olmak istiyorsun, takipçi kazanmak istiyorsun. VIA ile güncel trendleri yakala, algoritmaları yeni.
            </p>
            <ul className="text-zinc-300 text-sm space-y-2">
              {['Trend sörfçüsü ile anlık içerik fikirleri', 'Profil denetimi ve bio optimizasyonu', 'Paylaşımla büyüme stratejileri', 'İçerik serisi planlayıcı'].map(m => (
                <li key={m} className="flex items-center gap-2">
                  <span className="text-pink-400">✓</span> {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ÖZELLİKLER */}
      <section className="px-8 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-violet-400 text-xs tracking-widest font-semibold mb-3">ARAÇLAR</p>
          <h2 className="text-4xl font-black mb-4">Ne yapıyor?</h2>
          <p className="text-zinc-400 max-w-lg mx-auto text-sm leading-relaxed">
            İşletmeler ve bireyler için tasarlanmış 12 güçlü araç. Hepsi yapay zeka destekli, hepsi güncel.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ozellikler.map((o, i) => (
            <div key={i} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 hover:border-violet-500/50 transition group">
              <div className="text-2xl mb-4">{o.icon}</div>
              <h3 className="text-sm font-bold mb-2 group-hover:text-violet-400 transition">{o.baslik}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">{o.aciklama}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section className="px-8 py-20 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <p className="text-violet-400 text-xs tracking-widest font-semibold mb-3">NASIL ÇALIŞIR</p>
          <h2 className="text-4xl font-black mb-4">3 adımda başla</h2>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { adim: '01', baslik: 'Hesap oluştur', aciklama: 'İşletme veya şahıs olarak kaydol. Sektörünü, şehrini ve hedefini belirt.' },
            { adim: '02', baslik: 'AI seni tanısın', aciklama: 'Sosyal medya hesaplarını ekle. VIA sektörüne ve hedefine göre strateji oluşturur.' },
            { adim: '03', baslik: 'Büyümeye başla', aciklama: 'Günlük içerik planları, trend analizleri ve büyüme raporlarıyla takipçi kazan.' },
          ].map((a, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 bg-violet-600/20 border border-violet-500/30 rounded-2xl flex items-center justify-center text-violet-400 font-black text-xl mx-auto mb-4">
                {a.adim}
              </div>
              <h3 className="font-bold text-lg mb-2">{a.baslik}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{a.aciklama}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="text-center py-24 border-t border-zinc-800">
        <p className="text-violet-400 text-xs tracking-widest font-semibold mb-4">HEMEN BAŞLA</p>
        <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
          Sosyal medyada fark<br />yaratmaya hazır mısın?
        </h2>
        <p className="text-zinc-400 mb-10 text-sm">İşletmen veya kişisel hesabın için yapay zeka destekli strateji.</p>
        <a href="/kayit" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-10 py-4 rounded-xl text-base font-bold tracking-wide transition">
          Hesap Oluştur →
        </a>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="text-lg font-bold mb-4">VIA<span className="text-violet-500">.AI</span></div>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Yapay zeka destekli sosyal medya strateji platformu. İşletmeler ve bireyler için.
              </p>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-4">Ürün</p>
              <div className="space-y-2">
                {['Özellikler', 'Nasıl Çalışır', 'Güvenlik'].map(l => (
                  <a key={l} href="#" className="block text-zinc-500 hover:text-white text-xs transition">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-4">Şirket</p>
              <div className="space-y-2">
                {['Hakkımızda', 'Blog', 'Kariyer', 'İletişim'].map(l => (
                  <a key={l} href="#" className="block text-zinc-500 hover:text-white text-xs transition">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-4">Yasal</p>
              <div className="space-y-2">
                {['Gizlilik Politikası', 'Kullanım Şartları', 'KVKK'].map(l => (
                  <a key={l} href="#" className="block text-zinc-500 hover:text-white text-xs transition">{l}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-600 text-xs">© 2026 VIA.AI — Tüm hakları saklıdır.</p>
            <div className="flex gap-4">
              {['Instagram', 'TikTok', 'Twitter/X'].map(s => (
                <a key={s} href="#" className="text-zinc-600 hover:text-white text-xs transition">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}