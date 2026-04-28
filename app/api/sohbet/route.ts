import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { mesaj, profil, gecmis } = await req.json();

  const sistemPrompt = `Sen via.ai'nin yapay zeka sosyal medya asistanısın.

Kullanıcının işletme bilgileri:
- İşletme adı: ${profil.isletme_adi}
- Sektör: ${profil.sektor}
- Şehir: ${profil.sehir}
- Hedef: ${profil.hedef}

Görevin:
- Bu işletmeye özel sosyal medya içerikleri üret
- Instagram, TikTok, Facebook için içerik planları yap
- Caption, hashtag, reels fikirleri, kampanya metinleri oluştur
- İşletmenin sektörüne ve hedefine göre strateji öner
- Türkçe yanıt ver
- Kısa, net ve uygulanabilir öneriler sun
- Emoji kullan, samimi ol`;

  type Rol = 'user' | 'assistant';

  const mesajlar: { role: Rol; content: string }[] = [];
  
  for (const m of gecmis || []) {
    mesajlar.push({
      role: (m.rol === 'kullanici' ? 'user' : 'assistant') as Rol,
      content: m.icerik,
    });
  }
  mesajlar.push({ role: 'user', content: mesaj });

  const yanit = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1000,
    system: sistemPrompt,
    messages: mesajlar,
  });

  const cevap = yanit.content[0].type === 'text' ? yanit.content[0].text : '';
  return NextResponse.json({ cevap });
}