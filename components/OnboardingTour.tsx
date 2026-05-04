'use client';
import { useState } from 'react';

const ISLETME_ADIMLARI = [
  {
    hedef: 'icerik-uret',           // dashboard'daki elementin id'si
    baslik: '✨ İçerik Üret',
    aciklama: 'AI ile sohbet et — sektörüne özel reels fikirleri, caption ve hashtag önerileri al. Tek tıkla içerik planına ekle.',
  },
  {
    hedef: 'haftalik-buyume',
    baslik: '📈 Haftalık Büyüme',
    aciklama: 'Bu haftanın Instagram ve TikTok verilerini gir, AI büyüme analizini ve öneri listeni saniyeler içinde çıkarsın.',
  },
  {
    hedef: 'haftalik-plan',
    baslik: '📅 Haftalık Plan',
    aciklama: '7 günlük içerik planın hazır. Her güne tıkla — nasıl çekeceğini, ne yazacağını adım adım öğren.',
  },
  {
    hedef: 'tum-araclar',
    baslik: '🛠️ Tüm Araçlar',
    aciklama: 'Rakip analizi, profil denetimi, trend sörfçüsü ve daha fazlası. 12 farklı AI aracı seni bekliyor.',
  },
];

const SAHIS_ADIMLARI = [
  {
    hedef: 'icerik-uret',
    baslik: '✨ İçerik Üret',
    aciklama: 'Nişine özel viral fikirler, kanca cümleleri ve caption\'lar. AI ile konuş, dakikada içerik planını oluştur.',
  },
  {
    hedef: 'haftalik-buyume',
    baslik: '📈 Haftalık Büyüme',
    aciklama: 'Takipçi artışını, izlenmeleri ve etkileşimi gir — AI bu haftanın analizini ve önümüzdeki hafta için stratejiyi yazar.',
  },
  {
    hedef: 'haftalik-plan',
    baslik: '📅 Haftalık Plan',
    aciklama: '7 günlük influencer içerik planın hazır. Günlük rutin, trend format, işbirliği — her gün ne yapacağını bil.',
  },
  {
    hedef: 'tum-araclar',
    baslik: '🛠️ Tüm Araçlar',
    aciklama: 'Niş bulucu, viral kanca üretici, gelir hesaplayıcı ve daha fazlası. 12 AI aracıyla büyümeni hızlandır.',
  },
];

interface Props {
  tip: 'isletme' | 'sahis';
  onKapat: () => void;
}

export default function OnboardingTour({ tip, onKapat }: Props) {
  const [adim, setAdim] = useState(0);
  const adimlar = tip === 'isletme' ? ISLETME_ADIMLARI : SAHIS_ADIMLARI;
  const suanki = adimlar[adim];
  const sonAdim = adim === adimlar.length - 1;
  const accentRenk = tip === 'isletme' ? '#7c3aed' : '#ec4899';

  // Hedef elementi bul ve konumuna göre tooltip yerleştir
  const [konum, setKonum] = useState({ top: 0, left: 0, ok: 'top' as 'top' | 'bottom' });

  useState(() => {
    setTimeout(() => konumHesapla(suanki.hedef), 100);
  });

  function konumHesapla(hedefId: string) {
    const el = document.getElementById(hedefId);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const windowH = window.innerHeight;
    const altaYeterliMi = rect.bottom + 220 < windowH;

    setKonum({
      top: altaYeterliMi ? rect.bottom + window.scrollY + 12 : rect.top + window.scrollY - 220,
      left: Math.min(Math.max(rect.left + rect.width / 2 - 180, 16), window.innerWidth - 376),
      ok: altaYeterliMi ? 'top' : 'bottom',
    });

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function sonraki() {
    if (sonAdim) { onKapat(); return; }
    const yeniAdim = adim + 1;
    setAdim(yeniAdim);
    konumHesapla(adimlar[yeniAdim].hedef);
  }

  // Aktif elementi highlight et
  const aktifEl = typeof document !== 'undefined'
    ? document.getElementById(suanki.hedef)
    : null;

  if (aktifEl) {
    // Önceki tüm highlight'ları temizle
    document.querySelectorAll('[data-onboarding-highlight]').forEach(el => {
      (el as HTMLElement).style.position = '';
      (el as HTMLElement).style.zIndex = '';
      (el as HTMLElement).style.boxShadow = '';
      (el as HTMLElement).style.borderRadius = '';
      el.removeAttribute('data-onboarding-highlight');
    });
    // Yeni elementi highlight et
    aktifEl.style.position = 'relative';
    aktifEl.style.zIndex = '10001';
    aktifEl.style.boxShadow = `0 0 0 4px ${accentRenk}, 0 0 0 8px ${accentRenk}40`;
    aktifEl.style.borderRadius = '16px';
    aktifEl.setAttribute('data-onboarding-highlight', 'true');
  }

  return (
    <>
      {/* Karartma */}
      <div
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.75)',
          zIndex: 10000,
          backdropFilter: 'blur(2px)',
        }}
        onClick={onKapat}
      />

      {/* Tooltip kutusu */}
      <div
        style={{
          position: 'absolute',
          top: konum.top,
          left: konum.left,
          width: 360,
          background: '#18181b',
          border: `1px solid ${accentRenk}60`,
          borderRadius: 16,
          padding: '20px 22px',
          zIndex: 10002,
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${accentRenk}30`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Ok işareti */}
        {konum.ok === 'top' && (
          <div style={{
            position: 'absolute', top: -8, left: 28,
            width: 16, height: 8,
            background: '#18181b',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            border: `1px solid ${accentRenk}60`,
          }} />
        )}
        {konum.ok === 'bottom' && (
          <div style={{
            position: 'absolute', bottom: -8, left: 28,
            width: 16, height: 8,
            background: '#18181b',
            clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
            border: `1px solid ${accentRenk}60`,
          }} />
        )}

        {/* Progress */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          {adimlar.map((_, i) => (
            <div key={i} style={{
              height: 3, flex: 1, borderRadius: 99,
              background: i <= adim ? accentRenk : '#3f3f46',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {/* İçerik */}
        <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
          {suanki.baslik}
        </p>
        <p style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.65, marginBottom: 18 }}>
          {suanki.aciklama}
        </p>

        {/* Alt butonlar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#52525b' }}>
            {adim + 1} / {adimlar.length}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onKapat}
              style={{
                background: 'none', border: '1px solid #3f3f46',
                color: '#71717a', borderRadius: 10, padding: '7px 14px',
                fontSize: 13, cursor: 'pointer',
              }}
            >
              Atla
            </button>
            <button
              onClick={sonraki}
              style={{
                background: accentRenk, border: 'none',
                color: '#fff', borderRadius: 10, padding: '7px 18px',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {sonAdim ? 'Başlayalım 🚀' : 'Devam →'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}