'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const haftalikPlan = [
  { gun: 'Pazartesi', icerik: 'Before/after dönüşüm videosu', durum: 'tamamlandi', detay: 'Müşterinin önceki ve sonraki halini gösteren 30 saniyelik bir reels çek. İlk 2 saniyede final sonucunu göster, sonra başa dön. Trend müzik ekle.' },
  { gun: 'Salı', icerik: 'Story anketi — en sevilen hizmet', durum: 'bekliyor', detay: 'Instagram story\'de anket paylaş: "Hangi hizmeti daha çok seviyorsunuz?" Müşterilerinizin tercihlerini öğrenin ve etkileşim artırın.' },
  { gun: 'Çarşamba', icerik: 'Müşteri yorumu repost', durum: 'bekliyor', detay: 'Memnun bir müşterinizin yorumunu veya fotoğrafını story\'de paylaş. İzin almayı unutma. Üstüne teşekkür mesajı ekle.' },
  { gun: 'Perşembe', icerik: 'Kampanya postu — hafta içi indirim', durum: 'bekliyor', detay: 'Salı-Perşembe arası özel indirim kampanyası paylaş. Net fiyat yaz, süre belirt. "Bugün gel, %20 indirim kazan" formatı iyi çalışır.' },
  { gun: 'Cuma', icerik: 'Trend geçiş videosu', durum: 'bekliyor', detay: 'TikTok\'ta trend olan bir geçiş efekti formatını kullan. Hizmet öncesi/sonrası geçişi bu efektle göster. Trend müzikle eşleştir.' },
  { gun: 'Cumartesi', icerik: 'Dükkan atmosferi videosu', durum: 'bekliyor', detay: 'İşletmeni gündüz dolu halinde, müşterilerle birlikte çek. Arka planda müzik olsun. "Bize gelin" hissiyatı ver.' },
  { gun: 'Pazar', icerik: 'Haftanın en iyi dönüşümü', durum: 'bekliyor', detay: 'Haftanın en iyi işini seç ve paylaş. "Haftanın favorisi" etiketi ekle. Takipçilerin yorum yapmasını teşvik et.' },
];

const istatistikler = [
  { baslik: 'Toplam İzlenme', deger: '48.2K', artis: '+23%', renk: 'text-green-400' },
  { baslik: 'Yeni Takipçi', deger: '284', artis: '+18%', renk: 'text-green-400' },
  { baslik: 'Profil Ziyareti', deger: '1.2K', artis: '+31%', renk: 'text-green-400' },
  { baslik: 'DM Sayısı', deger: '47', artis: '+12%', renk: 'text-green-400' },
  { baslik: 'En İyi İçerik', deger: '4.2K', artis: 'izlenme', renk: 'text-violet-400' },
  { baslik: 'Ortalama İzlenme', deger: '890', artis: 'video başına', renk: 'text-blue-400' },
  { baslik: 'Kaydetme Oranı', deger: '%8.4', artis: '+2.1%', renk: 'text-green-400' },
  { baslik: 'Reklam Etkisi', deger: '3.2x', artis: 'ROI', renk: 'text-amber-400' },
];

const ozellikler = [
  { icon: '🔍', baslik: 'Algoritma & SEO', aciklama: 'Instagram ve TikTok algoritmasını anla, içeriklerini öne çıkar.', href: '/ozellik/algoritma-seo', renk: 'hover:border-violet-500', linkRenk: 'text-violet-400', link: 'Analiz et →' },
  { icon: '🎬', baslik: 'İçerik Serisi', aciklama: 'Birbirine bağlı içerik serileri oluştur, takipçi bağlılığını artır.', href: '/ozellik/icerik-serisi', renk: 'hover:border-violet-500', linkRenk: 'text-violet-400', link: 'Seri oluştur →' },
  { icon: '🚨', baslik: 'Kriz Yönetimi', aciklama: 'Olumsuz yorum veya kriz anında nasıl yanıt vereceğini öğren.', href: '/ozellik/kriz-yonetimi', renk: 'hover:border-red-500', linkRenk: 'text-red-400', link: 'Hızlı yanıt →' },
  { icon: '🚀', baslik: 'Lansman Planı', aciklama: 'Yeni ürün veya hizmet lansmanı için adım adım plan oluştur.', href: '/ozellik/lansman', renk: 'hover:border-violet-500', linkRenk: 'text-violet-400', link: 'Plan oluştur →' },
  { icon: '👥', baslik: 'Müşteri Analizi', aciklama: 'Hedef kitlenı analiz et, en doğru kişilere ulaş.', href: '/ozellik/musteri-analizi', renk: 'hover:border-violet-500', linkRenk: 'text-violet-400', link: 'Analiz et →' },
  { icon: '📤', baslik: 'Paylaşımla Büyü', aciklama: 'Viral paylaşım stratejileri ve işbirliği fırsatlarını keşfet.', href: '/ozellik/paylasimle-buyume', renk: 'hover:border-green-500', linkRenk: 'text-green-400', link: 'Keşfet →' },
  { icon: '📊', baslik: 'Performans Tahmini', aciklama: 'İçeriğini paylaşmadan önce performansını tahmin et.', href: '/ozellik/performans-tahmin', renk: 'hover:border-amber-500', linkRenk: 'text-amber-400', link: 'Tahmin et →' },
  { icon: '🔎', baslik: 'Profil Denetimi', aciklama: 'Instagram ve TikTok profilini analiz et, eksiklerini gör.', href: '/ozellik/profil-denetim', renk: 'hover:border-violet-500', linkRenk: 'text-violet-400', link: 'Denetle →' },
  { icon: '⚔️', baslik: 'Rakip Analizi', aciklama: 'Rakiplerini takip et, onlardan önce trende gir.', href: '/ozellik/rakip', renk: 'hover:border-red-500', linkRenk: 'text-red-400', link: 'Rakibi gör →' },
  { icon: '🕐', baslik: 'En İyi Saat Bulucu', aciklama: 'Takipçilerin en aktif olduğu saatleri bul, o saatte paylaş.', href: '/ozellik/saat-bulucu', renk: 'hover:border-blue-500', linkRenk: 'text-blue-400', link: 'Saati bul →' },
  { icon: '🏄', baslik: 'Trend Sörfçüsü', aciklama: 'Anlık trendleri yakala, viral olmadan önce pozisyon al.', href: '/ozellik/trend-surfcu', renk: 'hover:border-green-500', linkRenk: 'text-green-400', link: 'Trende bin →' },
  { icon: '📈', baslik: 'Aylık Rapor', aciklama: 'Tüm istatistiklerin, büyüme analizin ve öneriler.', href: null, renk: 'hover:border-violet-500', linkRenk: 'text-violet-400', link: 'Raporu gör →' },
];

export default function Dashboard() {
  const [profil, setProfil] = useState<any>(null);
  const [haftalikModal, setHaftalikModal] = useState(false);
  const [istatistikModal, setIstatistikModal] = useState(false);
  const [seciliIcerik, setSeciliIcerik] = useState<any>(null);

  useEffect(() => {
    async function profilGetir() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/giris'; return; }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfil(data);
    }
    profilGetir();
  }, []);

  if (!profil) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-zinc-500">Yükleniyor...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-800 sticky top-0 bg-black/90 backdrop-blur z-10">
        <div className="text-xl font-bold">via<span className="text-violet-500">.ai</span></div>
        <div className="flex items-center gap-4">
          <span className="text-zinc-400 text-sm">Merhaba, {profil.isletme_adi} 👋</span>
          <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }}
            className="text-zinc-500 hover:text-white text-sm transition">Çıkış</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Üst 4 kart */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-xs mb-1">Sektör</p>
            <p className="text-xl font-bold">{profil.sektor}</p>
            <p className="text-zinc-500 text-xs mt-1">{profil.sehir}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-xs mb-1">Hedefin</p>
            <p className="text-base font-bold">{profil.hedef}</p>
          </div>
          <div onClick={() => setHaftalikModal(true)}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 cursor-pointer hover:border-violet-500 transition group">
            <p className="text-zinc-500 text-xs mb-1">Bu hafta içerik</p>
            <p className="text-3xl font-bold">5</p>
            <p className="text-green-400 text-xs mt-1 group-hover:text-violet-400 transition">↑ Planlandı — tıkla</p>
          </div>
          <div onClick={() => setIstatistikModal(true)}
            className="bg-violet-600 rounded-2xl p-5 cursor-pointer hover:bg-violet-700 transition">
            <p className="text-white/70 text-xs mb-1">Aylık Büyüme</p>
            <p className="text-3xl font-bold">+23%</p>
          </div>
        </div>

        {/* Orta 3 kolon */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          {/* Sol — Bugün ne yapmalısın */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-sm font-semibold mb-4">📋 Bugün ne yapmalısın?</h2>
            <div className="space-y-3">
              {[
                { icon: '🎬', gorev: 'Before/after videosu çek', sure: '~10 dk', durum: 'bekliyor' },
                { icon: '✍️', gorev: 'Caption hazır — paylaşıma hazır', sure: 'Hemen', durum: 'hazir' },
                { icon: '📊', gorev: 'Dünkü videonun performansını gör', sure: '~2 dk', durum: 'bekliyor' },
                { icon: '📱', gorev: 'Story anketi paylaş', sure: '~5 dk', durum: 'bekliyor' },
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
          <div className="bg-violet-600/10 border border-violet-500/30 rounded-2xl p-6 flex flex-col">
            <h2 className="text-sm font-semibold mb-2">✨ İçerik üret</h2>
            <p className="text-zinc-400 text-xs mb-4 flex-1">AI ile sohbet et, sektörüne özel viral içerik fikirleri al.</p>
            <div className="space-y-2">
              <a href="/icerik" className="block w-full bg-violet-600 hover:bg-violet-700 py-2.5 rounded-xl font-semibold transition text-xs text-center">
                AI ile Konuş →
              </a>
              <div className="grid grid-cols-2 gap-2">
                {['Reels fikri', 'Kampanya', 'Caption', 'Hashtag'].map(s => (
                  <a key={s} href="/icerik"
                    className="text-center text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-2 rounded-lg transition text-zinc-400 hover:text-white">
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Sağ — Hızlı istatistikler */}
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
            <button onClick={() => setIstatistikModal(true)}
              className="w-full mt-3 text-xs text-violet-400 hover:text-violet-300 transition py-2 border border-zinc-800 rounded-xl hover:border-violet-500">
              Tam raporu gör →
            </button>
          </div>

        </div>

        {/* 2. sıra — Son performans, AI Koç, Reklam */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold mb-3">📊 Son performans</h2>
            <div className="space-y-3">
              {[
                { icerik: 'Dönüşüm videosu', izlenme: '4.2K', artis: '+38%' },
                { icerik: 'Müşteri reaksiyonu', izlenme: '2.8K', artis: '+12%' },
                { icerik: 'Kampanya postu', izlenme: '890', artis: '-5%' },
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
                <p className="text-xs text-green-400">💡 Dönüşüm videoların çok iyi çalışıyor.</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                <p className="text-xs text-amber-400">⚠️ Kampanya postların zayıf — CTA güçlendir.</p>
              </div>
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-2">
                <p className="text-xs text-violet-400">🎯 Bu hafta 3 reels hedefle.</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold mb-3">📢 Reklam önerisi</h2>
            <div className="space-y-2">
              <div className="bg-zinc-800 rounded-lg p-3">
                <p className="text-xs text-zinc-400 mb-1">Önerilen bütçe</p>
                <p className="text-base font-bold">100 TL/gün</p>
                <p className="text-xs text-zinc-500">5 gün · 18-35 yaş</p>
              </div>
              <a href="/icerik" className="block text-center text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-2 rounded-lg transition text-zinc-400 hover:text-white">
                Reklam planı oluştur →
              </a>
            </div>
          </div>

        </div>

        {/* Tüm özellikler — tam genişlik 4'lü grid */}
        <div className="mb-2">
          <h2 className="text-sm font-semibold text-zinc-400 mb-4">🛠️ Tüm araçlar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ozellikler.map((o, i) => (
              o.href ? (
                <a key={i} href={o.href}
                  className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-5 ${o.renk} transition group block`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{o.icon}</span>
                    <h3 className="text-sm font-semibold leading-tight">{o.baslik}</h3>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-3">{o.aciklama}</p>
                  <p className={`text-xs ${o.linkRenk} group-hover:opacity-70`}>{o.link}</p>
                </a>
              ) : (
                <div key={i} onClick={() => setIstatistikModal(true)}
                  className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-5 ${o.renk} transition group cursor-pointer`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{o.icon}</span>
                    <h3 className="text-sm font-semibold leading-tight">{o.baslik}</h3>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-3">{o.aciklama}</p>
                  <p className={`text-xs ${o.linkRenk} group-hover:opacity-70`}>{o.link}</p>
                </div>
              )
            ))}
          </div>
        </div>

      </div>

      {/* Haftalık plan modal */}
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
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition hover:border-violet-500 ${
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
                  className="text-zinc-500 hover:text-white text-sm mb-4 transition flex items-center gap-2">
                  ← Geri
                </button>
                <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-4 mb-4">
                  <p className="text-xs text-violet-400 mb-1">{seciliIcerik.gun}</p>
                  <p className="text-base font-bold">{seciliIcerik.icerik}</p>
                </div>
                <div className="bg-zinc-800 rounded-xl p-4">
                  <p className="text-xs text-zinc-400 mb-2 font-semibold">📋 Nasıl yapılır?</p>
                  <p className="text-sm text-zinc-300 leading-relaxed">{seciliIcerik.detay}</p>
                </div>
                <a href="/icerik" className="mt-4 block w-full bg-violet-600 hover:bg-violet-700 py-3 rounded-xl font-semibold transition text-sm text-center">
                  AI ile daha fazla detay al →
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* İstatistik modal */}
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
              <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-4">
                <p className="text-xs text-violet-400 mb-1">Genel Büyüme</p>
                <p className="text-3xl font-bold text-violet-400">+23%</p>
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
                    { tur: 'Reels / Video', oran: 78, renk: 'bg-violet-500' },
                    { tur: 'Story', oran: 45, renk: 'bg-blue-500' },
                    { tur: 'Post', oran: 32, renk: 'bg-green-500' },
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
              <div className="bg-zinc-800 rounded-xl p-4">
                <p className="text-sm font-semibold mb-3">🕐 En İyi Paylaşım Saatleri</p>
                <div className="grid grid-cols-3 gap-2">
                  {['18:00', '20:00', '12:00'].map((saat, i) => (
                    <div key={i} className="text-center bg-zinc-700 rounded-lg p-2">
                      <p className="text-sm font-bold">{saat}</p>
                      <p className="text-xs text-zinc-500">{i === 0 ? 'En iyi' : i === 1 ? '2. en iyi' : '3. en iyi'}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <p className="text-sm font-semibold text-green-400 mb-2">✅ AI Tavsiyesi</p>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Bu ay reels içeriklerin %38 daha fazla izlenme aldı. Salı ve Perşembe günleri
                  düşük performans görülüyor. Before/after formatını haftada en az 2 kez kullan.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}