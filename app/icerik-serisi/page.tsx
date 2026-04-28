'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

function SonucKarti({ icerik }: { icerik: string }) {
  const satirlar = icerik.split('\n').filter(s => s.trim());
  const [acikBolumler, setAcikBolumler] = useState<number[]>([0]);

  const bolumler: { baslik: string; satirlar: string[]; index: number }[] = [];
  let mevcutBolum: { baslik: string; satirlar: string[]; index: number } | null = null;
  const genelSatirlar: { satir: string; i: number }[] = [];

  satirlar.forEach((satir, i) => {
    if (satir.startsWith('[BOLUM]')) {
      if (mevcutBolum) bolumler.push(mevcutBolum);
      mevcutBolum = { baslik: satir, satirlar: [], index: bolumler.length };
    } else if (mevcutBolum) {
      mevcutBolum.satirlar.push(satir);
    } else {
      genelSatirlar.push({ satir, i });
    }
  });
  if (mevcutBolum) bolumler.push(mevcutBolum);

  function satirRender(satir: string, i: number) {
    if (satir.startsWith('[SERI]')) {
      const metin = satir.replace('[SERI]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-gradient-to-r from-violet-600/20 to-pink-600/20 border border-violet-500/40 rounded-xl p-4 mt-2">
          <p className="text-violet-300 font-bold text-lg mb-1">🎬 {parcalar[0]?.trim()}</p>
          {parcalar[1] && <p className="text-zinc-300 text-sm mb-1">{parcalar[1].trim()}</p>}
          {parcalar[2] && (
            <div className="bg-violet-500/20 rounded-lg px-3 py-1 inline-block mt-1">
              <p className="text-violet-300 text-xs">🎯 Hedef his: {parcalar[2].trim()}</p>
            </div>
          )}
        </div>
      );
    }
    if (satir.startsWith('[KANCA_TEKNIK]')) {
      const metin = satir.replace('[KANCA_TEKNIK]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mt-1">
          <p className="text-red-400 font-semibold text-sm mb-1">⚡ {parcalar[0]?.trim()}</p>
          {parcalar[1] && <p className="text-zinc-300 text-xs mb-1">{parcalar[1].trim()}</p>}
          {parcalar[2] && <p className="text-zinc-500 text-xs italic">{parcalar[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[ILK3]')) {
      const metin = satir.replace('[ILK3]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mt-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">İLK 3 SANİYE</div>
          </div>
          <p className="text-amber-300 text-sm font-medium mb-1">{parcalar[0]?.trim()}</p>
          {parcalar[1] && <p className="text-zinc-400 text-xs mb-1">📸 {parcalar[1].trim()}</p>}
          {parcalar[2] && <p className="text-zinc-400 text-xs">🎵 {parcalar[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[SENARYO]')) {
      const metin = satir.replace('[SENARYO]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 ml-3">
          <p className="text-white font-semibold text-xs mb-1">🎥 {parcalar[0]?.trim()}</p>
          {parcalar[1] && <p className="text-zinc-300 text-xs mb-1">{parcalar[1].trim()}</p>}
          {parcalar[2] && <p className="text-zinc-500 text-xs italic">Kamera: {parcalar[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[HOOK]')) {
      const metin = satir.replace('[HOOK]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mt-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-green-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">BÖLÜM SONU KANCASI</div>
          </div>
          <p className="text-green-300 text-sm font-medium mb-1">"{parcalar[0]?.trim()}"</p>
          {parcalar[1] && <p className="text-zinc-400 text-xs mb-1">{parcalar[1].trim()}</p>}
          {parcalar[2] && <p className="text-zinc-500 text-xs italic">Neden bekler: {parcalar[2].trim()}</p>}
        </div>
      );
    }
    if (satir.startsWith('[ESTETIK]')) {
      const metin = satir.replace('[ESTETIK]', '').trim();
      const parcalar = metin.split('|');
      return (
        <div key={i} className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mt-1">
          <p className="text-blue-400 font-semibold text-xs mb-2">🎨 Görsel Estetik</p>
          <div className="grid grid-cols-3 gap-2">
            {parcalar.map((p, pi) => p && (
              <div key={pi} className="bg-blue-500/10 rounded-lg p-2 text-center">
                <p className="text-blue-300 text-xs">{p.trim()}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (satir.startsWith('[IPUCU]')) {
      const metin = satir.replace('[IPUCU]', '').trim();
      return (
        <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 mt-1">
          <p className="text-zinc-300 text-xs">📌 {metin}</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="space-y-2">
      {genelSatirlar.map(({ satir, i }) => satirRender(satir, i))}

      {bolumler.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-zinc-500 mb-2">📺 Bölümler ({bolumler.length} bölüm)</p>
          <div className="space-y-2">
            {bolumler.map((bolum, bi) => {
              const baslikParcalar = bolum.baslik.replace('[BOLUM]', '').trim().split('|');
              const acik = acikBolumler.includes(bi);
              return (
                <div key={bi} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setAcikBolumler(prev =>
                      prev.includes(bi) ? prev.filter(x => x !== bi) : [...prev, bi]
                    )}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {baslikParcalar[0]?.trim()}
                      </div>
                      <p className="text-white font-semibold text-sm text-left">
                        {baslikParcalar[1]?.trim()}
                      </p>
                    </div>
                    <span className="text-zinc-500 text-xs">{acik ? '▲' : '▼'}</span>
                  </button>
                  {acik && (
                    <div className="px-4 pb-4 space-y-2">
                      {bolum.satirlar.map((satir, si) => satirRender(satir, si))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function IcerikSerisi() {
  const [profil, setProfil] = useState<any>(null);
  const [seriAdi, setSeriAdi] = useState('');
  const [seriKonusu, setSeriKonusu] = useState('');
  const [bolumSayisi, setBolumSayisi] = useState(5);
  const [sonuc, setSonuc] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  useEffect(() => {
    async function profilGetir() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/giris'; return; }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfil(data);
    }
    profilGetir();
  }, []);

  async function seriOlustur() {
    if (!seriAdi.trim() || !seriKonusu.trim() || yukleniyor) return;
    setYukleniyor(true);
    setSonuc('');

    try {
      const res = await fetch('/api/icerik-serisi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seriAdi, seriKonusu, bolumSayisi, profil }),
      });
      const data = await res.json();
      setSonuc(data.cevap);
    } catch {
      setSonuc('[IPUCU] Bir hata oluştu, tekrar dene.');
    }
    setYukleniyor(false);
  }

  const ornekler = [
    { ad: 'Mutfağın Arkası', konu: 'Restoranımızın mutfağında neler döndüğünü, şefin hikayesini ve yemeklerin nasıl hazırlandığını gösteriyoruz' },
    { ad: 'Esnaf Hikayeleri', konu: 'Dükkanımızın kuruluş hikayesi, zorlu günler, müşteri anıları ve bugüne nasıl geldiğimiz' },
    { ad: 'Dönüşüm Serisi', konu: 'Müşterilerimizin hizmetimizden önceki ve sonraki değişimlerini dramatik şekilde gösteriyoruz' },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black/90 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-zinc-500 hover:text-white transition text-sm">← Dashboard</a>
          <div className="text-lg font-bold">via<span className="text-violet-500">.ai</span></div>
        </div>
        <p className="text-xs text-zinc-500">İçerik Serisi Oluşturucu</p>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">İçerik Serisi Oluşturucu 🎬</h1>
          <p className="text-zinc-400 text-sm">İzleyiciyi bağımlı eden, her bölümü merakla bekleten içerik dizisi planla.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-4">
          <div className="mb-4">
            <label className="text-xs text-zinc-500 mb-2 block">Seri Adı</label>
            <input
              type="text"
              value={seriAdi}
              onChange={e => setSeriAdi(e.target.value)}
              placeholder="Örn: Mutfağın Arkası, Esnaf Hikayeleri..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
            />
          </div>

          <div className="mb-4">
            <label className="text-xs text-zinc-500 mb-2 block">Seri Konusu</label>
            <textarea
              value={seriKonusu}
              onChange={e => setSeriKonusu(e.target.value)}
              placeholder="Bu seri ne anlatacak? Kimler için? Ne göstereceksin?"
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition resize-none"
            />
          </div>

          <div className="mb-4">
            <label className="text-xs text-zinc-500 mb-2 block">Bölüm Sayısı: <span className="text-violet-400 font-bold">{bolumSayisi}</span></label>
            <input
              type="range"
              min={3}
              max={10}
              value={bolumSayisi}
              onChange={e => setBolumSayisi(parseInt(e.target.value))}
              className="w-full accent-violet-600"
            />
            <div className="flex justify-between text-xs text-zinc-600 mt-1">
              <span>3 bölüm</span>
              <span>10 bölüm</span>
            </div>
          </div>

          <button
            onClick={seriOlustur}
            disabled={yukleniyor || !seriAdi.trim() || !seriKonusu.trim()}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-500 py-3 rounded-xl text-sm font-semibold transition"
          >
            {yukleniyor ? 'Seri planlanıyor...' : `${bolumSayisi} Bölümlük Seri Oluştur →`}
          </button>
        </div>

        {!sonuc && !yukleniyor && (
          <div className="mb-6">
            <p className="text-xs text-zinc-500 mb-2">Örnek seriler:</p>
            <div className="space-y-2">
              {ornekler.map((ornek, i) => (
                <button
                  key={i}
                  onClick={() => { setSeriAdi(ornek.ad); setSeriKonusu(ornek.konu); }}
                  className="w-full text-left bg-zinc-900 border border-zinc-800 hover:border-violet-500 px-4 py-3 rounded-xl transition"
                >
                  <p className="text-white text-sm font-medium">{ornek.ad}</p>
                  <p className="text-zinc-500 text-xs mt-0.5 line-clamp-1">{ornek.konu}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {yukleniyor && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
            <div className="flex justify-center gap-1 mb-3">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
            </div>
            <p className="text-zinc-400 text-sm">wantsandneedsbrand_ ve viral hesaplar analiz ediliyor...</p>
            <p className="text-zinc-600 text-xs mt-1">Her bölüm için sahne sahne senaryo yazılıyor</p>
          </div>
        )}

        {sonuc && <SonucKarti icerik={sonuc} />}
      </div>
    </main>
  );
}