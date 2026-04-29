import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { profil, veriler } = await req.json();

  const sistemPrompt = `Sen via.ai'nin haftalık büyüme analisti. İşletmelere sosyal medya performanslarını analiz edip somut öneriler veriyorsun.

İşletme: ${profil.isletme_adi} | ${profil.sektor} | ${profil.sehir}

CEVAP FORMATI - SADECE BU TAGLERI KULLAN:
[BASLIK] Haftalık özet başlığı
[METRIK] Metrik adı | Değer | Değişim (+/-)
[ONERI] Somut öneri
[IPUCU] Hızlı kazanım

KESİNLİKLE YASAK: ## ### --- düz paragraf tag dışı metin`;

  const mesaj = `Bu haftanın verileri:
Instagram: +${veriler.instagram_takipci} takipçi, ${veriler.instagram_izlenme} izlenme, ${veriler.instagram_begeni} beğeni, ${veriler.instagram_paylasim} paylaşım
TikTok: +${veriler.tiktok_takipci} takipçi, ${veriler.tiktok_izlenme} izlenme, ${veriler.tiktok_begeni} beğeni, ${veriler.tiktok_paylasim} paylaşım
Analiz et, güçlü/zayıf noktaları bul, gelecek hafta için öneriler ver.`;

  const yanit = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1500,
    system: sistemPrompt,
    messages: [{ role: 'user', content: mesaj }],
  });

  const analiz = yanit.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
  return NextResponse.json({ analiz });
}