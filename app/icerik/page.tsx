'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';

interface Mesaj {
  rol: 'kullanici' | 'ai';
  icerik: string;
}
function MesajKarti({ icerik }: { icerik: string }) {
  const satirlar = icerik.split('\n').filter(s => s.trim());
  
  return (
    <div className="space-y-2">
      {satirlar.map((satir, i) => {
        if (satir.startsWith('[BASLIK]')) {
          const metin = satir.replace('[BASLIK]', '').trim();
          return (
            <div key={i} className="bg-violet-600/20 border border-violet-500/40 rounded-xl px-4 py-2 mt-3">
              <p className="text-violet-300 font-semibold text-sm">{metin}</p>
            </div>
          );
        }
        if (satir.startsWith('[MADDE]')) {
          const metin = satir.replace('[MADDE]', '').trim();
          return (
            <div key={i} className="flex items-start gap-2 px-2">
              <span className="text-violet-400 mt-0.5 flex-shrink-0">•</span>
              <p className="text-zinc-300 text-sm">{metin}</p>
            </div>
          );
        }
        if (satir.startsWith('[ICERIK]')) {
          const metin = satir.replace('[ICERIK]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1">
              {parcalar[0] && <p className="text-white font-semibold text-sm mb-1">🎬 {parcalar[0].trim()}</p>}
              {parcalar[1] && <p className="text-zinc-400 text-xs mb-2">{parcalar[1].trim()}</p>}
              {parcalar[2] && <p className="text-violet-400 text-xs">{parcalar[2].trim()}</p>}
            </div>
          );
        }
        if (satir.startsWith('[CAPTION]')) {
          const metin = satir.replace('[CAPTION]', '').trim();
          return (
            <div key={i} className="bg-zinc-800 border border-violet-500/30 rounded-xl p-3 mt-1">
              <p className="text-xs text-violet-400 mb-1 font-semibold">📝 Caption</p>
              <p className="text-zinc-300 text-sm">{metin}</p>
            </div>
          );
        }
        if (satir.startsWith('[TREND]')) {
          const metin = satir.replace('[TREND]', '').trim();
          const parcalar = metin.split('|');
          return (
            <div key={i} className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mt-1">
              <p className="text-green-400 font-semibold text-sm mb-1">🔥 {parcalar[0]?.trim()}</p>
              {parcalar[1] && <p className="text-zinc-400 text-xs mb-1">{parcalar[1].trim()}</p>}
              {parcalar[2] && <p className="text-zinc-300 text-xs">{parcalar[2].trim()}</p>}
            </div>
          );
        }
        if (satir.trim()) {
          return <p key={i} className="text-zinc-300 text-sm px-2">{satir}</p>;
        }
        return null;
      })}
    </div>
  );
}
export default function IcerikUret() {
  const [mesajlar, setMesajlar] = useState<Mesaj[]>([]);
  const [input, setInput] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [profil, setProfil] = useState<any>(null);
  const altRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function profilGetir() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/giris'; return; }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfil(data);
      if (data) {
        setMesajlar([{
          rol: 'ai',
          icerik: `Merhaba! Ben via.ai'nin yapay zeka asistanıyım. 🚀\n\n**${data.isletme_adi}** işletmen için buradayım.\n\nSektörün: **${data.sektor}** | Şehrin: **${data.sehir}** | Hedefin: **${data.hedef}**\n\nBana şunları sorabilirsin:\n• Bu hafta için içerik planı yap\n• Instagram reels fikri ver\n• Kampanya metni yaz\n• Hashtag öner\n• Rakip analizi yap\n• Reklam metni oluştur\n\nNe yapmamı istersin?`
        }]);
      }
    }
    profilGetir();
  }, []);

  useEffect(() => {
    altRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mesajlar]);

  async function mesajGonder() {
    if (!input.trim() || yukleniyor) return;

    const kullaniciMesaj = input.trim();
    setInput('');
    setMesajlar(prev => [...prev, { rol: 'kullanici', icerik: kullaniciMesaj }]);
    setYukleniyor(true);

    try {
      const res = await fetch('/api/sohbet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mesaj: kullaniciMesaj,
          profil: profil,
          gecmis: mesajlar.slice(-10),
        }),
      });
      const data = await res.json();
      setMesajlar(prev => [...prev, { rol: 'ai', icerik: data.cevap }]);
    } catch {
      setMesajlar(prev => [...prev, { rol: 'ai', icerik: 'Bir hata oluştu, tekrar dene.' }]);
    }
    setYukleniyor(false);
  }

  function enterBasildi(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      mesajGonder();
    }
  }

  const hizliSorular = [
    'Bu hafta için içerik planı yap',
    'Instagram reels fikri ver',
    'Kampanya metni yaz',
    'En iyi hashtag\'leri öner',
  ];

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black/90 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-zinc-500 hover:text-white transition text-sm">← Dashboard</a>
          <div className="text-lg font-bold">via<span className="text-violet-500">.ai</span></div>
        </div>
        {profil && (
          <div className="text-xs text-zinc-500">
            {profil.isletme_adi} · {profil.sektor} · {profil.sehir}
          </div>
        )}
      </nav>

      {/* Mesaj alanı */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full">
        {mesajlar.map((m, i) => (
          <div key={i} className={`mb-6 flex ${m.rol === 'kullanici' ? 'justify-end' : 'justify-start'}`}>
            {m.rol === 'ai' && (
              <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-1">
                AI
              </div>
            )}
            <div className={`max-w-xl rounded-2xl text-sm leading-relaxed ${
  m.rol === 'kullanici'
    ? 'bg-violet-600 text-white rounded-br-sm px-4 py-3'
    : 'rounded-bl-sm'
}`}>
  {m.rol === 'kullanici' ? m.icerik : <MesajKarti icerik={m.icerik} />}
</div>
            {m.rol === 'kullanici' && (
              <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-xs font-bold ml-3 flex-shrink-0 mt-1">
                {profil?.isletme_adi?.[0] || 'S'}
              </div>
            )}
          </div>
        ))}

        {yukleniyor && (
          <div className="mb-6 flex justify-start">
            <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">
              AI
            </div>
            <div className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1 items-center h-5">
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
              </div>
            </div>
          </div>
        )}
        <div ref={altRef} />
      </div>

      {/* Hızlı sorular */}
      {mesajlar.length <= 1 && (
        <div className="px-4 pb-4 max-w-3xl mx-auto w-full">
          <div className="grid grid-cols-2 gap-2">
            {hizliSorular.map((s, i) => (
              <button
                key={i}
                onClick={() => { setInput(s); }}
                className="text-left text-sm bg-zinc-900 border border-zinc-800 hover:border-violet-500 px-4 py-3 rounded-xl transition text-zinc-400 hover:text-white"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input alanı */}
      <div className="px-4 pb-6 pt-2 max-w-3xl mx-auto w-full">
        <div className="flex gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 focus-within:border-violet-500 transition">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={enterBasildi}
            placeholder="Ne yapmamı istersin? (Enter ile gönder)"
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 resize-none focus:outline-none leading-relaxed"
            style={{minHeight: '24px', maxHeight: '120px'}}
          />
          <button
            onClick={mesajGonder}
            disabled={yukleniyor || !input.trim()}
            className="bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-500 w-10 h-10 rounded-xl flex items-center justify-center transition flex-shrink-0"
          >
            ↑
          </button>
        </div>
        <p className="text-xs text-zinc-600 text-center mt-2">via.ai · {profil?.sektor} uzmanı</p>
      </div>

    </main>
  );
}