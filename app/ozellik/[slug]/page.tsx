'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const ozellikBilgileri: Record<string, { baslik: string; aciklama: string; icon: string }> = {
  'algoritma-seo': { baslik: 'Algoritma & SEO', aciklama: 'Instagram ve TikTok algoritmasını anla', icon: '🔍' },
  'icerik-serisi': { baslik: 'İçerik Serisi', aciklama: 'Birbirine bağlı içerik serileri oluştur', icon: '🎬' },
  'kriz-yonetimi': { baslik: 'Kriz Yönetimi', aciklama: 'Kriz anında nasıl yanıt vereceğini öğren', icon: '🚨' },
  'lansman': { baslik: 'Lansman Planı', aciklama: 'Yeni ürün lansmanı için adım adım plan', icon: '🚀' },
  'musteri-analizi': { baslik: 'Müşteri Analizi', aciklama: 'Hedef kitlenı analiz et', icon: '👥' },
  'paylasimle-buyume': { baslik: 'Paylaşımla Büyü', aciklama: 'Viral paylaşım stratejileri', icon: '📤' },
  'performans-tahmin': { baslik: 'Performans Tahmini', aciklama: 'İçeriğini paylaşmadan önce tahmin et', icon: '📊' },
  'profil-denetim': { baslik: 'Profil Denetimi', aciklama: 'Profilini analiz et, eksiklerini gör', icon: '🔎' },
  'rakip': { baslik: 'Rakip Analizi', aciklama: 'Rakiplerini takip et', icon: '⚔️' },
  'saat-bulucu': { baslik: 'En İyi Saat Bulucu', aciklama: 'En aktif saatleri bul', icon: '🕐' },
  'trend-surfcu': { baslik: 'Trend Sörfçüsü', aciklama: 'Anlık trendleri yakala', icon: '🏄' },
};

export default function OzellikSayfasi() {
  const params = useParams();
  const slug = params.slug as string;
  const bilgi = ozellikBilgileri[slug];
  const [mesaj, setMesaj] = useState('');
  const [cevap, setCevap] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  async function sor() {
    setYukleniyor(true);
    const res = await fetch('/api/sohbet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mesaj: `${bilgi?.baslik} konusunda yardım istiyorum: ${mesaj}`,
        profil: { isletme_adi: 'İşletmem', sektor: 'Genel', sehir: 'Türkiye', hedef: 'Büyümek' },
        gecmis: [],
      }),
    });
    const data = await res.json();
    setCevap(data.cevap);
    setYukleniyor(false);
  }

  if (!bilgi) return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-zinc-500 mb-4">Sayfa bulunamadı</p>
        <a href="/dashboard" className="text-violet-400">← Dashboard'a dön</a>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <a href="/dashboard" className="text-zinc-500 text-sm hover:text-white transition">← Dashboard</a>
        <div className="flex items-center gap-3 mt-6 mb-8">
          <span className="text-4xl">{bilgi.icon}</span>
          <div>
            <h1 className="text-2xl font-bold">{bilgi.baslik}</h1>
            <p className="text-zinc-400 text-sm">{bilgi.aciklama}</p>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <textarea
            value={mesaj}
            onChange={e => setMesaj(e.target.value)}
            placeholder={`${bilgi.baslik} hakkında ne öğrenmek istiyorsun?`}
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition resize-none"
          />
          <button onClick={sor} disabled={yukleniyor || !mesaj.trim()}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-500 py-3 rounded-xl font-semibold transition text-sm">
            {yukleniyor ? '⏳ AI düşünüyor...' : 'AI\'a Sor →'}
          </button>
          {cevap && (
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{cevap}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}