'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

const TUM_SEKTORLER = [
  'Berber', 'Güzellik Salonu', 'Kafe', 'Restoran', 'Spor Salonu',
  'Butik Mağaza', 'Tırnak Salonu', 'Kuaför', 'Dövme Salonu',
  'Fotoğrafçı', 'Çiçekçi', 'Pastane', 'Pizza', 'Burger',
  'Döner', 'Kebap', 'Sushi', 'Vegan Restoran', 'Kahvaltı Salonu',
  'Terzi', 'Ayakkabıcı', 'Gözlükçü', 'Eczane', 'Veteriner',
  'Diş Kliniği', 'Güzellik Merkezi', 'Masaj Salonu', 'Yoga Studio',
  'Dans Okulu', 'Müzik Okulu', 'Dil Kursu', 'Kitapçı', 'Oyuncakçı',
  'Elektronik', 'Telefon Tamiri', 'Araba Yıkama', 'Oto Servis',
  'Otel', 'Pansiyon', 'Cafe & Bar', 'Nargile Cafe', 'Oyun Salonu',
];

const TUM_SEHIRLER = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya',
  'Ankara', 'Antalya', 'Artvin', 'Aydın', 'Balıkesir',
  'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur',
  'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli',
  'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum',
  'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari',
  'Hatay', 'Isparta', 'İçel', 'İstanbul', 'İzmir',
  'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir',
  'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa',
  'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir',
  'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun',
  'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat',
  'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van',
  'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman',
  'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan',
  'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce',
];

const hedefler = [
  { icon: '👥', ad: 'Daha fazla müşteri' },
  { icon: '📈', ad: 'Daha fazla takipçi' },
  { icon: '📅', ad: 'Randevu almak' },
  { icon: '🛍️', ad: 'Ürün satmak' },
  { icon: '🌟', ad: 'Marka bilinirliği' },
];

const turkceKucuk = (str: string) =>
  str.replace(/İ/g, 'i').replace(/I/g, 'ı').replace(/Ğ/g, 'ğ')
     .replace(/Ü/g, 'ü').replace(/Ş/g, 'ş').replace(/Ö/g, 'ö')
     .replace(/Ç/g, 'ç').toLowerCase();

export default function Kayit() {
  const [adim, setAdim] = useState(1);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [dogrulamaGonderildi, setDogrulamaGonderildi] = useState(false);
  const [dogrulamaKodu, setDogrulamaKodu] = useState('');
  const [sektorArama, setSektorArama] = useState('');
  const [sehirArama, setSehirArama] = useState('');
  const [form, setForm] = useState({
    isletme_adi: '',
    sektor: '',
    sehir: '',
    hedef: '',
    email: '',
    sifre: '',
    kullanici_turu: 'isletme',
  });

  const filtreliSektorler = TUM_SEKTORLER.filter(s =>
    turkceKucuk(s).startsWith(turkceKucuk(sektorArama))
  );
  const filtreliSehirler = TUM_SEHIRLER.filter(s =>
    turkceKucuk(s).startsWith(turkceKucuk(sehirArama))
  );

  async function googleIleGiris() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  }

  async function mailIleDevam() {
  setYukleniyor(true);

  const { error } = await supabase.auth.signInWithOtp({
    email: form.email,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) {
    alert('Hata: ' + error.message);
    setYukleniyor(false);
    return;
  }

  setDogrulamaGonderildi(true);
  setYukleniyor(false);
}
    setDogrulamaGonderildi(true);
    setYukleniyor(false);
  }

  async function dogrulamaYap() {
    setYukleniyor(true);
    const { error } = await supabase.auth.verifyOtp({
      email: form.email,
      token: dogrulamaKodu,
      type: 'signup',
    });
    if (error) {
      alert('Kod hatalı: ' + error.message);
      setYukleniyor(false);
      return;
    }
    setAdim(2);
    setYukleniyor(false);
  }

  async function kayitTamamla() {
    setYukleniyor(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          isletme_adi: form.isletme_adi,
          sektor: form.sektor,
          sehir: form.sehir,
          hedef: form.hedef,
          kullanici_turu: form.kullanici_turu,
        });
      }
      window.location.href = '/dashboard';
    } catch {
      alert('Bir hata oluştu.');
    }
    setYukleniyor(false);
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-10">

      <a href="/" className="text-2xl font-bold mb-10">
        via<span className="text-violet-500">.ai</span>
      </a>

      {/* Progress bar */}
      <div className="w-full max-w-md mb-8">
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= adim ? 'bg-violet-500' : 'bg-zinc-800'}`} />
          ))}
        </div>
        <p className="text-zinc-500 text-sm mt-2">Adım {adim} / 3</p>
      </div>

      {/* ADIM 1 — Hesap oluştur */}
      {adim === 1 && !dogrulamaGonderildi && (
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2">Hesap oluştur</h2>
          <p className="text-zinc-400 mb-6">Ücretsiz başla, 14 gün dene.</p>

          {/* Kullanıcı türü seçimi */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setForm({ ...form, kullanici_turu: 'isletme' })}
              className={`p-4 rounded-xl border text-sm transition flex flex-col items-center gap-2 ${
                form.kullanici_turu === 'isletme'
                  ? 'border-violet-500 bg-violet-600/20 text-white'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400'
              }`}
            >
              <span className="text-2xl">🏪</span>
              <span className="font-semibold">İşletme</span>
              <span className="text-xs text-zinc-500">Kafe, berber, mağaza...</span>
            </button>
            <button
              onClick={() => setForm({ ...form, kullanici_turu: 'sahis' })}
              className={`p-4 rounded-xl border text-sm transition flex flex-col items-center gap-2 ${
                form.kullanici_turu === 'sahis'
                  ? 'border-violet-500 bg-violet-600/20 text-white'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400'
              }`}
            >
              <span className="text-2xl">👤</span>
              <span className="font-semibold">Şahıs</span>
              <span className="text-xs text-zinc-500">Influencer, içerik üretici...</span>
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="E-posta adresin"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition"
            />
            <input
              type="password"
              placeholder="Şifre (min. 6 karakter)"
              value={form.sifre}
              onChange={e => setForm({ ...form, sifre: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition"
            />
            <button
              onClick={mailIleDevam}
              disabled={yukleniyor || !form.email || form.sifre.length < 6}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-500 py-3 rounded-xl font-semibold transition"
            >
              {yukleniyor ? '⏳ Gönderiliyor...' : 'Mail ile Devam Et →'}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-zinc-600 text-xs">veya</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            <button
              onClick={googleIleGiris}
              className="w-full bg-white text-black py-3 rounded-xl font-semibold transition hover:bg-zinc-100 flex items-center justify-center gap-3"
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
              Google ile Devam Et
            </button>

            <p className="text-center text-zinc-500 text-sm">
              Zaten hesabın var mı?{' '}
              <a href="/giris" className="text-violet-400 hover:text-violet-300">Giriş yap</a>
            </p>
          </div>
        </div>
      )}

      {/* Doğrulama kodu ekranı */}
      {adim === 1 && dogrulamaGonderildi && (
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-2xl font-bold mb-2">Mailine bak!</h2>
            <p className="text-zinc-400">
              <span className="text-white">{form.email}</span> adresine doğrulama kodu gönderdik.
            </p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="6 haneli kod"
              value={dogrulamaKodu}
              onChange={e => setDogrulamaKodu(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 focus:outline-none focus:border-violet-500 transition text-center text-2xl tracking-widest font-mono"
              maxLength={6}
            />
            <button
              onClick={dogrulamaYap}
              disabled={yukleniyor || dogrulamaKodu.length !== 6}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-500 py-3 rounded-xl font-semibold transition"
            >
              {yukleniyor ? '⏳ Doğrulanıyor...' : 'Doğrula →'}
            </button>
            <button
              onClick={() => setDogrulamaGonderildi(false)}
              className="w-full text-zinc-500 hover:text-white text-sm transition py-2"
            >
              ← Geri dön
            </button>
          </div>
        </div>
      )}

      {/* ADIM 2 — İşletme / Şahıs bilgileri */}
      {adim === 2 && (
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2">
            {form.kullanici_turu === 'sahis' ? 'Kendini tanıt' : 'İşletmeni tanıt'}
          </h2>
          <p className="text-zinc-400 mb-6">AI seni tanısın, sana özel plan yapsın.</p>
          <div className="space-y-4">
            <input
              type="text"
              placeholder={form.kullanici_turu === 'sahis' ? 'Adın veya kullanıcı adın' : 'İşletme adın'}
              value={form.isletme_adi}
              onChange={e => setForm({ ...form, isletme_adi: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition"
            />

            {form.kullanici_turu === 'isletme' && (
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Sektörün</label>
                <input
                  type="text"
                  placeholder="Sektör ara... (örn. berber, kafe)"
                  value={sektorArama}
                  onChange={e => { setSektorArama(e.target.value); setForm({ ...form, sektor: '' }); }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition mb-2"
                />
                {form.sektor && (
                  <div className="bg-violet-600/20 border border-violet-500 rounded-xl px-4 py-2 text-sm text-violet-300 mb-2">
                    ✓ Seçilen: {form.sektor}
                  </div>
                )}
                {sektorArama && (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-h-40 overflow-y-auto">
                    {filtreliSektorler.length > 0 ? filtreliSektorler.map(s => (
                      <button key={s} onClick={() => { setForm({ ...form, sektor: s }); setSektorArama(s); }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-800 transition text-zinc-300">
                        {s}
                      </button>
                    )) : <div className="px-4 py-2 text-sm text-zinc-500">Sonuç bulunamadı</div>}
                  </div>
                )}
              </div>
            )}

            {form.kullanici_turu === 'sahis' && (
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">İlgi alanın / Niş</label>
                <input
                  type="text"
                  placeholder="örn. moda, teknoloji, yemek, spor..."
                  value={form.sektor}
                  onChange={e => setForm({ ...form, sektor: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition"
                />
              </div>
            )}

            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Şehrin</label>
              <input
                type="text"
                placeholder="Şehir ara..."
                value={sehirArama}
                onChange={e => { setSehirArama(e.target.value); setForm({ ...form, sehir: '' }); }}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition mb-2"
              />
              {form.sehir && (
                <div className="bg-violet-600/20 border border-violet-500 rounded-xl px-4 py-2 text-sm text-violet-300 mb-2">
                  ✓ Seçilen: {form.sehir}
                </div>
              )}
              {sehirArama && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-h-40 overflow-y-auto">
                  {filtreliSehirler.length > 0 ? filtreliSehirler.map(s => (
                    <button key={s} onClick={() => { setForm({ ...form, sehir: s }); setSehirArama(s); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-800 transition text-zinc-300">
                      {s}
                    </button>
                  )) : <div className="px-4 py-2 text-sm text-zinc-500">Sonuç bulunamadı</div>}
                </div>
              )}
            </div>

            <button
              onClick={() => setAdim(3)}
              disabled={!form.isletme_adi || !form.sehir || (form.kullanici_turu === 'isletme' && !form.sektor) || (form.kullanici_turu === 'sahis' && !form.sektor)}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-500 py-3 rounded-xl font-semibold transition"
            >
              Devam Et →
            </button>
          </div>
        </div>
      )}

      {/* ADIM 3 — Hedef */}
      {adim === 3 && (
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2">Hedefin ne?</h2>
          <p className="text-zinc-400 mb-8">AI içerikleri buna göre üretecek.</p>
          <div className="space-y-3 mb-6">
            {hedefler.map(h => (
              <button
                key={h.ad}
                onClick={() => setForm({ ...form, hedef: h.ad })}
                className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 transition ${
                  form.hedef === h.ad
                    ? 'border-violet-500 bg-violet-600/20'
                    : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'
                }`}
              >
                <span className="text-2xl">{h.icon}</span>
                <span>{h.ad}</span>
              </button>
            ))}
          </div>
          <button
            onClick={kayitTamamla}
            disabled={yukleniyor || !form.hedef}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-500 py-3 rounded-xl font-semibold transition"
          >
            {yukleniyor ? '⏳ Kaydediliyor...' : 'Başla 🚀'}
          </button>
        </div>
      )}

    </main>
  );
}