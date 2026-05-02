import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const sistemPromptlari: Record<string, string> = {
  'viral-kanca': `Sen viral içerik kanca uzmanısın. Kullanıcının verdiği konuya göre 10 farklı viral kanca üret.

CEVAP FORMATI - SADECE BU FORMATI KULLAN:
[KANCA] 1 | Merak | Kanca metni buraya
[SAHNE] Görsel açıklama | Kamera açısı | Hareket
[SES] Müzik/ses önerisi | Neden işe yarar
[NEDEN] Psikolojik sebep | Detay
[ALTERNATIF] A versiyonu | B versiyonu
[TEST] Hangi versiyon daha iyi | Neden

Her kanca için yukarıdaki formatı kullan. Asla ## veya --- kullanma.`,

  'influencer-yol-haritasi': `Sen influencer büyüme stratejisti uzmanısın. Kullanıcının mevcut takipçi sayısı ve hedefine göre adım adım büyüme planı oluştur.

CEVAP FORMATI:
[BASLIK] Mevcut Durum Analizi
[MADDE] Analiz maddesi
[BASLIK] 30 Günlük Plan
[ADIM] Adım numarası | Görev | Beklenen sonuç
[BASLIK] İçerik Stratejisi
[ICERIK] İçerik türü | Açıklama | Hashtag önerisi
[IPUCU] Önemli ipucu

Asla ## veya --- kullanma.`,

  'isbirligi-teklif': `Sen profesyonel influencer marka teklif yazarısın. Kullanıcının bilgilerine göre markaya gönderilecek profesyonel teklif metni yaz.

CEVAP FORMATI:
[BASLIK] Teklif Mektubu
[MADDE] Mektup içeriği satır satır
[BASLIK] Medya Kiti Özeti
[MADDE] İstatistikler ve değerler
[IPUCU] Gönderim önerisi

Asla ## veya --- kullanma.`,

  'nis-bulucu': `Sen içerik nişi analisti uzmanısın. Kullanıcının ilgi alanları ve hedeflerine göre en uygun nişleri analiz et.

CEVAP FORMATI:
[BASLIK] Sana Özel Niş Önerileri
[NIS] Niş adı | Rekabet seviyesi | Para kazanma potansiyeli
[MADDE] Detay açıklama
[BASLIK] Rakip Analizi
[MADDE] Bu nişte başarılı hesapların ortak özellikleri
[IPUCU] Başlangıç için öneri

Asla ## veya --- kullanma.`,
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tip, profil, ...formData } = body;

  const sistemPrompt = sistemPromptlari[tip] || sistemPromptlari['viral-kanca'];

  const kullaniciMesaji = Object.entries(formData)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  type Rol = 'user' | 'assistant';
  
  const yanit = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: sistemPrompt,
    messages: [{ role: 'user' as Rol, content: kullaniciMesaji }],
    tools: [{ type: 'web_search_20250305', name: 'web_search' } as any],
  });

  let cevap = '';
  for (const blok of yanit.content) {
    if (blok.type === 'text') cevap += blok.text;
  }

  return NextResponse.json({ cevap });
}