'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const haftalikPlan = [
  { gun: 'Pazartesi', icerik: 'Günlük rutinin arkası', durum: 'tamamlandi', detay: 'Sabah rutinini, hazırlanma sürecini veya gününün başlangıcını göster. "Vlog" tarzı, samimi ve doğal çek. İlk 2 saniyede en ilginç anı göster.' },
  { gun: 'Salı', icerik: 'Niş içerik — bilgi paylaş', durum: 'bekliyor', detay: 'Alanınla ilgili 1 pratik ipucu paylaş. "Bunu bilmiyorsan kaçırıyorsun" formatı çok iyi çalışıyor. Kısa, net, uygulanabilir.' },
  { gun: 'Çarşamba', icerik: 'Trend formatı uygula', durum: 'bekliyor', detay: 'Bu hafta TikTok/Instagram\'da viral olan formata kendi nişinden bir içerik yap. Trend sörfçüsü aracını kullan.' },
  { gun: 'Perşembe', icerik: 'Hikaye — kişisel deneyim', durum: 'bekliyor', detay: '"Bu hatayı yaptım ve şunu öğrendim" formatında kişisel bir deneyim paylaş. İnsanlar hikayeye bağlanır, satışa değil.' },
  { gun: 'Cuma', icerik: 'İşbirliği veya mention', durum: 'bekliyor', detay: 'Nişindeki başka bir içerik üreticiyi etiketle, duet yap veya yanıt videosu çek. Çapraz büyüme en hızlı yöntem.' },
  { gun: 'Cumartesi', icerik: 'Sahne arkası içerik', durum: 'bekliyor', detay: 'İçerik üretme sürecini, editing yaparken ya da fikir geliştirirken çek. "Influencer olmak böyle" tarzı içerikler çok izleniyor.' },
  { gun: 'Pazar', icerik: 'Haftalık özet veya Q&A', durum: 'bekliyor', detay: 'Haftanın en iyi anını paylaş veya takipçilerden gelen soruları yanıtla. Story Q&A aç, cevapları reels\'e dönüştür.' },
];

const istatistikler = [
  { baslik: 'Toplam Takipçi', deger: '12.4K', artis: '+8%', renk: 'text-green-400' },
  { baslik: 'Bu Hafta Kazanılan', deger: '+284', artis: 'takipçi', renk: 'text-green-400' },
  { baslik: 'Ortalama İzlenme', deger: '18.2K', artis: '+31%', renk: 'text-green-400' },
  { baslik: 'Etkileşim Oranı', deger: '%4.8', artis: '+1.2%', renk: 'text-green-400' },
  { baslik: 'En İyi Video', deger: '94K', artis: 'izlenme', renk: 'text-violet-400' },
  { baslik: 'Kaydetme Oranı', deger: '%12.3', artis: '+3.1%', renk: 'text-green-400' },
  { baslik: 'Profil Ziyareti', deger: '3.2K', artis: '+22%', renk: 'text-green-400' },
  { baslik: 'Link Tıklanma', deger: '847', artis: '+18%', renk: 'text-amber-400' },
];

const ozellikler = [
  { icon: '🗺️', baslik: 'Influencer Yol Haritası', aciklama: '0\'dan 100K\'ya giden adım adım büyüme planı.', href: '/influencer-yol-haritasi', renk: 'hover:border-violet-500', linkRenk: 'text-violet-400', link: 'Planı gör →' },
  { icon: '🎯', baslik: 'Niş Bulucu', aciklama: 'Hangi alanda içerik üretmelisin? Veri bazlı cevap.', href: '/nis-bulucu', renk: 'hover:border-pink-500', linkRenk: 'text-pink-400', link: 'Nişini bul →' },
  { icon: '🤝', baslik: 'İşbirliği Teklif Yazıcı', aciklama: 'Markaya DM veya mail için profesyonel teklif metni.', href: '/isbirligi-teklif', renk: 'hover:border-green-500', linkRenk: 'text-green-400', link: 'Teklif yaz →' },
  { icon: '💰', baslik: 'Gelir Hesaplayıcı', aciklama: 'Takipçi sayına göre tahmini kazanç potansiyeli.', href: '/gelir-hesaplayici', renk: 'hover:border-amber-500', linkRenk: 'text-amber-400', link: 'Hesapla →' },
  { icon: '⚡', baslik: 'Viral Kanca Üretici', aciklama: 'İlk 3 saniyede izleyiciyi durduran cümle ve sahne fikirleri.', href: '/viral-kanca', renk: 'hover:border-red-500', linkRenk: 'text-red-400', link: 'Kanca üret →' },
  { icon: '🏄', baslik: 'Trend Sörfçüsü', aciklama: 'Bugün patlayan trendleri yakala, 24 saatte uygula.', href: '/trend-surfcu', renk: 'hover:border-green-500', linkRenk: 'text-green-400', link: 'Trende bin →' },
  { icon: '🎬', baslik: 'İçerik Serisi', aciklama: 'İzleyiciyi bağımlı eden dizi formatları planla.', href: '/icerik-serisi', renk: 'hover:border-violet-500', linkRenk: 'text-violet-400', link: 'Seri oluştur →' },
  { icon: '📊', baslik: 'Performans Tahmini', aciklama: 'Paylaşmadan önce viral olma ihtimalini öğren.', href: '/performans-tahmin', renk: 'hover:border-amber-500', linkRenk: 'text-amber-400', link: 'Tahmin et →' },
  { icon: '🔎', baslik: 'Profil Denetimi', aciklama: 'Bio, highlight, gönderi düzenini analiz et.', href: '/profil-denetim', renk: 'hover:border-violet-500', linkRenk: 'text-violet-400', link: 'Denetle →' },
  { icon: '🚨', baslik: 'Kriz Yönetimi', aciklama: 'Olumsuz yorum veya kriz anında profesyonel yanıt.', href: '/kriz-yonetimi', renk: 'hover:border-red-500', linkRenk: 'text-red-400', link: 'Hızlı yanıt →' },
  { icon: '🕐', baslik: 'En İyi Saat Bulucu', aciklama: 'Takipçilerin en aktif olduğu saatte paylaş.', href: '/saat-bulucu', renk: 'hover:border-blue-500', linkRenk: 'text-blue-400', link: 'Saati bul →' },
  { icon: '🔍', baslik: 'Algoritma & SEO', aciklama: 'Algoritmayı yeni, keşfette öne çık.', href: '/algoritma-seo', renk: 'hover:border-violet-500', linkRenk: 'text-violet-400', link: 'Analiz et →' },
];

export default function SahisDashboard() {
  const [profil, setProfil] = useState<any>(null);
  const [haftalikModal, setHaftalikModal] = useState(false);
  const [istatistikModal, setIstatistikModal] = useState(false);
  const [seciliIcerik, setSeciliIcerik] = useState<any>(null);
  const [menuAcik, setMenuAcik] = useState(false);
  const [haftalikBuyumeModal, setHaftalikBuyumeModal] = useState(false);
  const [haftalikForm, setHaftalikForm] = useState({
    instagram_takipci: '', instagram_izlenme: '', instagram_begeni: '', instagram_paylasim: '',
    tiktok_takipci: '', tiktok_izlenme: '', tiktok_begeni: '', tiktok_paylasim: '',
  });
  const [haftalikSonuc, setHaftalikSonuc] = useState('');
  const [haftalikYukleniyor, setHaftalikYukleniyor] = useState(false);

  useEffect(() => {
    async function profilGetir() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/giris'; return; }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data?.kullanici_turu !== 'sahis') { window.location.href = '/dashboard'; return; }
      setProfil(data);
    }
    profilGetir();
  }, []);

  async function haftalikAnalizOlustur() {
    setHaftalikYukleniyor(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const buHafta = new Date().toISOString().split('T')[0];
      await supabase.from('haftalik_veriler').upsert({
        user_id: user?.id,
        hafta_baslangic: buHafta,
        ...Object.fromEntries(
          Object.entries(haftalikForm).map(([k, v]) => [k, parseInt(v as string) || 0])
        ),
      });
      const res = await fetch('/api/haftalik-analiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profil, veriler: haftalikForm }),
      });
      const data = await res.json();
      setHaftalikSonuc(data.analiz);
    } catch { alert('Hata oluştu.'); }
    setHaftalikYukleniyor(false);
  }

  if (!profil) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-zinc-500">Yükleniyor...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-800 sticky top-0 bg-black/90 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <div className="text-xl font-bold">VIA<span className="text-violet-500">.AI</span></div>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-300 text-sm font-medium">{profil.isletme_adi}</span>
          <span className="bg-pink-500/20 text-pink-400 text-xs px-2 py-0.5 rounded-full font-semibold">Şahıs</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuAcik(!menuAcik)}
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 hover:bg-zinc-800 rounded-xl transition"
          >
            <span className="w-5 h-0.5 bg-white rounded-full" />
            <span className="w-5 h-0.5 bg-white rounded-full" />
            <span className="w-5 h-0.5 bg-white rounded-full" />
          </button>
          {menuAcik && (
            <div className="absolute right-0 top-12 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="p-4 border-b border-zinc-800">
                <p className="text-white font-semibold text-sm">{profil.isletme_adi}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{profil.sektor} · {profil.sehir}</p>
                <span className="bg-pink-500/20 text-pink-400 text-xs px-2 py-0.5 rounded-full mt-1 inline-block">Influencer</span>
              </div>
              <div className="p-2">
                {[
                  { icon: '👤', ad: 'Profil', href: '/profil' },
                  { icon: '💳', ad: 'Abonelik', href: '/abonelik' },
                  { icon: '⚙️', ad: 'Ayarlar', href: '/ayarlar' },
                  { icon: '📊', ad: 'Aylık Rapor', href: '/aylik-rapor' },
                  { icon: '📱', ad: 'Sosyal Medya', href: '/ayarlar' },
                  { icon: '❓', ad: 'Yardım', href: '/yardim' },
                ].map((item) => (
                  <a key={item.ad} href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-800 transition text-sm text-zinc-300 hover:text-white">
                    <span>{item.icon}</span>
                    <span>{item.ad}</span>
                  </a>
                ))}
                <div className="border-t border-zinc-800 mt-2 pt-2">
                  <button
                    onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition text-sm text-red-400 w-full text-left"
                  >
                    <span>🚪</span>
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ANA İÇERİK */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ÜST 4 KART */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-xs mb-1">Niş / Alan</p>
            <p className="text-xl font-bold">{profil.sektor}</p>
            <p className="text-zinc-500 text-xs mt-1">{profil.sehir}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-xs mb-1">Hedefin</p>
            <p className="text-base font-bold">{profil.hedef}</p>
          </div>
          <div
            onClick={() => setHaftalikModal(true)}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 cursor-pointer hover:border-pink-500 transition group"
          >
            <p className="text-zinc-500 text-xs mb-1">Bu hafta içerik</p>
            <p className="text-3xl font-bold">7</p>
            <p className="text-green-400 text-xs mt-1 group-hover:text-pink-400 transition">↑ Planlandı — tıkla</p>
          </div>
          <div
            onClick={() => setHaftalikBuyumeModal(true)}
            className="bg-gradient-to-br from-pink-600 to-violet-600 rounded-2xl p-5 cursor-pointer hover:opacity-90 transition"
          >
            <p className="text-white/70 text-xs mb-1">Haftalık Büyüme</p>
            <p className="text-3xl font-bold">+284</p>
            <p className="text-white/60 text-xs mt-1">Bu hafta · tıkla</p>
          </div>
        </div>

        {/* ORTA 3 KOLON */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          {/* Sol — Bugün ne yapmalısın */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-sm font-semibold mb-4">📋 Bugün ne yapmalısın?</h2>
            <div className="space-y-3">
              {[
                { icon: '🎬', gorev: 'Günlük rutin videosu çek', sure: '~15 dk', durum: 'bekliyor' },
                { icon: '📊', gorev: 'Dünkü videonun analizini gör', sure: '~2 dk', durum: 'bekliyor' },
                { icon: '💬', gorev: 'Yorumlara cevap ver', sure: '~10 dk', durum: 'hazir' },
                { icon: '🏄', gorev: 'Bugünkü trendleri kontrol et', sure: '~5 dk', durum: 'bekliyor' },
              ].map((g, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-zinc-800 rounded-xl">
                  <span className="text-lg">{g.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{g.gorev}</p>
                    <p className="text-xs text-zinc-500">{g.sure}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${g.durum === 'hazir' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-700 text-zinc-400'}`}>
                    {g.durum === 'hazir' ? '✓' : '○'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Orta — İçerik üret */}
          <div className="bg-gradient-to-br from-pink-600/10 to-violet-600/10 border border-pink-500/30 rounded-2xl p-6 flex flex-col">
            <h2 className="text-sm font-semibold mb-2">✨ İçerik üret</h2>
            <p className="text-zinc-400 text-xs mb-4 flex-1">AI ile konuş, nişine özel viral içerik fikirleri al.</p>
            <div className="space-y-2">
              <a href="/icerik" className="block w-full bg-gradient-to-r from-pink-600 to-violet-600 hover:opacity-90 py-2.5 rounded-xl font-semibold transition text-xs text-center">
                AI ile Konuş →
              </a>
              <div className="grid grid-cols-2 gap-2">
                {['Reels fikri', 'Kanca cümlesi', 'Caption', 'Hashtag'].map(s => (
                  <a key={s} href="/icerik"
                    className="text-center text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-2 rounded-lg transition text-zinc-400 hover:text-white">
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Sağ — Büyüme istatistikleri */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-sm font-semibold mb-3">📈 Bu ay</h2>
            <div className="grid grid-cols-2 gap-3">
              {istatistikler.slice(0, 4).map((ist, i) => (
                <div key={i} className="bg-zinc-800 rounded-xl p-3">
                  <p className="text-xs text-zinc-500 mb-1">{ist.baslik}</p>
                  <p className="text-base font-bold">{ist.deger}</p>
                  <p className={`text-xs ${ist.renk}`}>{ist.artis}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setIstatistikModal(true)}
              className="w-full mt-3 text-xs text-pink-400 hover:text-pink-300 transition py-2 border border-zinc-800 rounded-xl hover:border-pink-500"
            >
              Tam raporu gör →
            </button>
          </div>
        </div>

        {/* 2. SIRA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold mb-3">📊 Son performans</h2>
            <div className="space-y-3">
              {[
                { icerik: 'Günlük rutin videosu', izlenme: '94K', artis: '+180%' },
                { icerik: 'Niş ipucu reels', izlenme: '28K', artis: '+42%' },
                { icerik: 'Trend format', izlenme: '12K', artis: '-8%' },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium">{p.icerik}</p>
                    <p className="text-xs text-zinc-500">{p.izlenme} izlenme</p>
                  </div>
                  <span className={`text-xs font-semibold ${p.artis.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {p.artis}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold mb-3">🤖 AI Koç</h2>
            <div className="space-y-2">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                <p className="text-xs text-green-400">💡 Günlük rutin formatın çok iyi — devam et.</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                <p className="text-xs text-amber-400">⚠️ Trend içeriklerin zayıf — kancayı güçlendir.</p>
              </div>
              <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-2">
                <p className="text-xs text-pink-400">🎯 Bu hafta 1 işbirliği teklifi gönder.</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold mb-3">💰 Kazanç Potansiyeli</h2>
            <div className="space-y-2">
              <div className="bg-zinc-800 rounded-lg p-3">
                <p className="text-xs text-zinc-400 mb-1">Mevcut takipçiye göre</p>
                <p className="text-base font-bold">₺2.500 — ₺8.000</p>
                <p className="text-xs text-zinc-500">Aylık sponsorluk potansiyeli</p>
              </div>
              <a href="/gelir-hesaplayici"
                className="block text-center text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-2 rounded-lg transition text-zinc-400 hover:text-white">
                Detaylı hesapla →
              </a>
            </div>
          </div>
        </div>

        {/* TÜM ARAÇLAR */}
        <div className="mb-2">
          <h2 className="text-sm font-semibold text-zinc-400 mb-4">🛠️ Tüm araçlar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ozellikler.map((o, i) => (
              <a key={i} href={o.href}
                className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-5 ${o.renk} transition group block`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{o.icon}</span>
                  <h3 className="text-sm font-semibold leading-tight">{o.baslik}</h3>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed mb-3">{o.aciklama}</p>
                <p className={`text-xs ${o.linkRenk} group-hover:opacity-70`}>{o.link}</p>
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* HAFTALIK PLAN MODAL */}
      {haftalikModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => { setHaftalikModal(false); setSeciliIcerik(null); }}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-900">
              <h2 className="text-lg font-bold">📅 Haftalık İçerik Planı</h2>
              <button onClick={() => { setHaftalikModal(false); setSeciliIcerik(null); }}
                className="text-zinc-500 hover:text-white text-xl transition">×</button>
            </div>
            {!seciliIcerik ? (
              <div className="p-4 space-y-2">
                {haftalikPlan.map((g, i) => (
                  <button key={i} onClick={() => setSeciliIcerik(g)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition hover:border-pink-500 ${
                      g.durum === 'tamamlandi' ? 'bg-green-500/10 border-green-500/20' : 'bg-zinc-800 border-zinc-700'
                    }`}>
                    <span className="text-xs text-zinc-500 w-20 flex-shrink-0">{g.gun}</span>
                    <span className="text-sm flex-1">{g.icerik}</span>
                    <span className={`text-xs flex-shrink-0 ${g.durum === 'tamamlandi' ? 'text-green-400' : 'text-zinc-600'}`}>
                      {g.durum === 'tamamlandi' ? '✓ Tamamlandı' : 'Nasıl yapılır →'}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6">
                <button onClick={() => setSeciliIcerik(null)}
                  className="text-zinc-500 hover:text-white text-sm mb-4 transition">← Geri</button>
                <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-4 mb-4">
                  <p className="text-xs text-pink-400 mb-1">{seciliIcerik.gun}</p>
                  <p className="text-base font-bold">{seciliIcerik.icerik}</p>
                </div>
                <div className="bg-zinc-800 rounded-xl p-4">
                  <p className="text-xs text-zinc-400 mb-2 font-semibold">📋 Nasıl yapılır?</p>
                  <p className="text-sm text-zinc-300 leading-relaxed">{seciliIcerik.detay}</p>
                </div>
                <a href="/icerik" className="mt-4 block w-full bg-gradient-to-r from-pink-600 to-violet-600 py-3 rounded-xl font-semibold transition text-sm text-center">
                  AI ile daha fazla detay al →
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HAFTALIK BÜYÜME MODAL */}
      {haftalikBuyumeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => { setHaftalikBuyumeModal(false); setHaftalikSonuc(''); }}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-900">
              <div>
                <h2 className="text-lg font-bold">📈 Haftalık Büyüme</h2>
                <p className="text-zinc-500 text-xs mt-0.5">Bu haftanın verilerini gir, AI analiz etsin</p>
              </div>
              <button onClick={() => { setHaftalikBuyumeModal(false); setHaftalikSonuc(''); }}
                className="text-zinc-500 hover:text-white text-xl transition">×</button>
            </div>

            {!haftalikSonuc ? (
              <div className="p-5 space-y-5">
                {profil?.instagram_kullanici && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-pink-400">📷</span>
                      <p className="text-sm font-semibold">Instagram — @{profil.instagram_kullanici}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'instagram_takipci', label: 'Takipçi Artışı', placeholder: '150' },
                        { key: 'instagram_izlenme', label: 'Toplam İzlenme', placeholder: '25000' },
                        { key: 'instagram_begeni', label: 'Toplam Beğeni', placeholder: '3200' },
                        { key: 'instagram_paylasim', label: 'Paylaşım Sayısı', placeholder: '5' },
                      ].map(({ key, label, placeholder }) => (
                        <div key={key}>
                          <label className="text-xs text-zinc-500 mb-1 block">{label}</label>
                          <input
                            type="number"
                            placeholder={placeholder}
                            value={(haftalikForm as any)[key]}
                            onChange={e => setHaftalikForm(prev => ({ ...prev, [key]: e.target.value }))}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500 transition"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {profil?.tiktok_kullanici && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span>🎵</span>
                      <p className="text-sm font-semibold">TikTok — @{profil.tiktok_kullanici}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'tiktok_takipci', label: 'Takipçi Artışı', placeholder: '200' },
                        { key: 'tiktok_izlenme', label: 'Toplam İzlenme', placeholder: '50000' },
                        { key: 'tiktok_begeni', label: 'Toplam Beğeni', placeholder: '8000' },
                        { key: 'tiktok_paylasim', label: 'Paylaşım Sayısı', placeholder: '7' },
                      ].map(({ key, label, placeholder }) => (
                        <div key={key}>
                          <label className="text-xs text-zinc-500 mb-1 block">{label}</label>
                          <input
                            type="number"
                            placeholder={placeholder}
                            value={(haftalikForm as any)[key]}
                            onChange={e => setHaftalikForm(prev => ({ ...prev, [key]: e.target.value }))}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!profil?.instagram_kullanici && !profil?.tiktok_kullanici && (
                  <div className="text-center py-6">
                    <p className="text-zinc-400 text-sm mb-3">Henüz sosyal medya hesabı eklenmemiş.</p>
                    <a href="/ayarlar" className="text-pink-400 text-sm hover:text-pink-300">Hesap ekle →</a>
                  </div>
                )}

                <button
                  onClick={haftalikAnalizOlustur}
                  disabled={haftalikYukleniyor || (!profil?.instagram_kullanici && !profil?.tiktok_kullanici)}
                  className="w-full bg-gradient-to-r from-pink-600 to-violet-600 hover:opacity-90 disabled:from-zinc-700 disabled:to-zinc-700 py-3 rounded-xl text-sm font-semibold transition"
                >
                  {haftalikYukleniyor ? 'Analiz ediliyor...' : '📊 Haftalık Analizi Oluştur'}
                </button>
              </div>
            ) : (
              <div className="p-5">
                <div className="space-y-2">
                  {haftalikSonuc.split('\n').filter(s => s.trim()).map((satir, i) => {
                    if (satir.startsWith('[BASLIK]')) return (
                      <div key={i} className="bg-pink-600/20 border border-pink-500/40 rounded-xl px-4 py-2 mt-3">
                        <p className="text-pink-300 font-semibold text-sm">{satir.replace('[BASLIK]', '').trim()}</p>
                      </div>
                    );
                    if (satir.startsWith('[METRIK]')) {
                      const p = satir.replace('[METRIK]', '').trim().split('|');
                      const artis = p[2]?.trim() || '';
                      const renk = artis.startsWith('+') ? 'text-green-400' : artis.startsWith('-') ? 'text-red-400' : 'text-zinc-400';
                      return (
                        <div key={i} className="flex items-center justify-between bg-zinc-800 rounded-xl px-3 py-2">
                          <p className="text-zinc-300 text-sm">{p[0]?.trim()}</p>
                          <div className="text-right">
                            <p className="text-white font-bold text-sm">{p[1]?.trim()}</p>
                            <p className={`text-xs ${renk}`}>{artis}</p>
                          </div>
                        </div>
                      );
                    }
                    if (satir.startsWith('[ONERI]')) return (
                      <div key={i} className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-3">
                        <p className="text-pink-400 text-sm">{satir.replace('[ONERI]', '').trim()}</p>
                      </div>
                    );
                    if (satir.startsWith('[IPUCU]')) return (
                      <div key={i} className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2">
                        <p className="text-amber-400 text-xs">{satir.replace('[IPUCU]', '').trim()}</p>
                      </div>
                    );
                    return null;
                  })}
                </div>
                <button onClick={() => setHaftalikSonuc('')}
                  className="w-full mt-4 text-zinc-500 hover:text-white text-sm transition py-2">
                  ← Verileri güncelle
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* İSTATİSTİK MODAL */}
      {istatistikModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIstatistikModal(false)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-900">
              <h2 className="text-lg font-bold">📈 Aylık Büyüme Raporu</h2>
              <button onClick={() => setIstatistikModal(false)}
                className="text-zinc-500 hover:text-white text-xl transition">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-r from-pink-600/20 to-violet-600/20 border border-pink-500/30 rounded-xl p-4">
                <p className="text-xs text-pink-400 mb-1">Genel Büyüme</p>
                <p className="text-3xl font-bold text-pink-400">+18%</p>
                <p className="text-xs text-zinc-500 mt-1">Geçen aya göre</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {istatistikler.map((ist, i) => (
                  <div key={i} className="bg-zinc-800 rounded-xl p-4">
                    <p className="text-xs text-zinc-500 mb-1">{ist.baslik}</p>
                    <p className="text-xl font-bold">{ist.deger}</p>
                    <p className={`text-xs ${ist.renk}`}>{ist.artis}</p>
                  </div>
                ))}
              </div>
              <div className="bg-zinc-800 rounded-xl p-4">
                <p className="text-sm font-semibold mb-3">📊 İçerik Performansı</p>
                <div className="space-y-3">
                  {[
                    { tur: 'Reels / Video', oran: 85, renk: 'bg-pink-500' },
                    { tur: 'Story', oran: 52, renk: 'bg-violet-500' },
                    { tur: 'Post', oran: 28, renk: 'bg-blue-500' },
                  ].map((p, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-400">{p.tur}</span>
                        <span className="text-white">%{p.oran}</span>
                      </div>
                      <div className="h-2 bg-zinc-700 rounded-full">
                        <div className={`h-2 ${p.renk} rounded-full`} style={{ width: `${p.oran}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <p className="text-sm font-semibold text-green-400 mb-2">✅ AI Tavsiyesi</p>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Günlük rutin formatın %180 daha fazla izlenme aldı. Niş ipucu içeriklerin
                  kaydetme oranı çok yüksek. İşbirliği teklifleri için şu an doğru zaman.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}