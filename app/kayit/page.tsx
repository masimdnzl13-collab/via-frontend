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

export default function Kayit() {
  const [adim, setAdim] = useState(1);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [sektorArama, setSektorArama] = useState('');
  const [sehirArama, setSehirArama] = useState('');
  const [form, setForm] = useState({
    isletme_adi: '',
    sektor: '',
    sehir: '',
    hedef: '',
    email: '',
    sifre: '',
  });

  const filtreliSektorler = TUM_SEKTORLER.filter(s =>
    s.toLowerCase().startsWith(sektorArama.toLowerCase())
  );

  const filtreliSehirler = TUM_SEHIRLER.filter(s =>
    s.toLowerCase().startsWith(sehirArama.toLowerCase())
  );

  async function kayitOl() {
    setYukleniyor(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.sifre,
      });

      if (error) {
        alert('Hata: ' + error.message);
        setYukleniyor(false);
        return;
      }

      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          isletme_adi: form.isletme_adi,
          sektor: form.sektor,
          sehir: form.sehir,
          hedef: form.hedef,
        });
      }

      window.location.href = '/dashboard';
    } catch (err) {
      alert('Bir hata oluştu.');
    }
    setYukleniyor(false);
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-10">
      
      <div className="text-2xl font-bold mb-10">
        via<span className="text-violet-500">.ai</span>
      </div>

      <div className="w-full max-w-md mb-8">
        <div className="flex gap-2">
          {[1,2,3].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= adim ? 'bg-violet-500' : 'bg-zinc-800'}`} />
          ))}
        </div>
        <p className="text-zinc-500 text-sm mt-2">Adım {adim} / 3</p>
      </div>

      {adim === 1 && (
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2">Hesap oluştur</h2>
          <p className="text-zinc-400 mb-8">Ücretsiz başla, 14 gün dene.</p>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="E-posta adresin"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition"
            />
            <input
              type="password"
              placeholder="Şifre (min. 6 karakter)"
              value={form.sifre}
              onChange={e => setForm({...form, sifre: e.target.value})}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition"
            />
            <button
              onClick={() => setAdim(2)}
              disabled={!form.email || form.sifre.length < 6}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-500 py-3 rounded-xl font-semibold transition"
            >
              Devam Et →
            </button>
          </div>
        </div>
      )}

      {adim === 2 && (
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2">İşletmeni tanıt</h2>
          <p className="text-zinc-400 mb-6">AI seni tanısın, sana özel plan yapsın.</p>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="İşletme adın"
              value={form.isletme_adi}
              onChange={e => setForm({...form, isletme_adi: e.target.value})}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition"
            />

            {/* Sektör arama */}
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Sektörün</label>
              <input
                type="text"
                placeholder="Sektör ara... (örn. berber, kafe)"
                value={sektorArama}
                onChange={e => {
                  setSektorArama(e.target.value);
                  setForm({...form, sektor: ''});
                }}
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
                    <button
                      key={s}
                      onClick={() => {
                        setForm({...form, sektor: s});
                        setSektorArama(s);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-800 transition text-zinc-300"
                    >
                      {s}
                    </button>
                  )) : (
                    <div className="px-4 py-2 text-sm text-zinc-500">Sonuç bulunamadı</div>
                  )}
                </div>
              )}
            </div>

            {/* Şehir arama */}
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Şehrin</label>
              <input
                type="text"
                placeholder="Şehir ara... (örn. İstanbul, Ankara)"
                value={sehirArama}
                onChange={e => {
                  setSehirArama(e.target.value);
                  setForm({...form, sehir: ''});
                }}
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
                    <button
                      key={s}
                      onClick={() => {
                        setForm({...form, sehir: s});
                        setSehirArama(s);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-800 transition text-zinc-300"
                    >
                      {s}
                    </button>
                  )) : (
                    <div className="px-4 py-2 text-sm text-zinc-500">Sonuç bulunamadı</div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setAdim(3)}
              disabled={!form.isletme_adi || !form.sehir || !form.sektor}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-500 py-3 rounded-xl font-semibold transition"
            >
              Devam Et →
            </button>
          </div>
        </div>
      )}

      {adim === 3 && (
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2">Hedefin ne?</h2>
          <p className="text-zinc-400 mb-8">AI içerikleri buna göre üretecek.</p>
          <div className="space-y-3 mb-6">
            {hedefler.map(h => (
              <button
                key={h.ad}
                onClick={() => setForm({...form, hedef: h.ad})}
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
            onClick={kayitOl}
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