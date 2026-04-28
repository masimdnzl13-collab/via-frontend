import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { mesaj, profil, gecmis } = await req.json();

  const sistemPrompt = `Sen via.ai'nin yapay zeka sosyal medya asistanısın. Küçük işletmelere viral içerik stratejileri üretiyorsun.

Kullanıcının işletme bilgileri:
- İşletme adı: ${profil.isletme_adi}
- Sektör: ${profil.sektor}
- Şehir: ${profil.sehir}
- Hedef: ${profil.hedef}

GÖREVIN:
- Önce web'de o sektördeki güncel viral videoları ve trendleri ara
- Gerçekten viral olan içerik formatlarını bul (milyonlarca izlenen)
- O formatları işletmeye uyarla
- Klasik "önce dışardan çek sonra içerden çek" tavsiyelerinden uzak dur
- Yaratıcı, beklenmedik, viral potansiyeli yüksek fikirler üret
- Gerçek viral video örneklerinden ilham al ve link ver
- İnsanların "bunu ben de yapabilirim" diyeceği uygulanabilir fikirler sun

CEVAP FORMATI - SADECE BU FORMATI KULLAN:
[BASLIK] Başlık buraya
[MADDE] Kısa madde
[ICERIK] İçerik adı | Açıklama | #hashtag1 #hashtag2
[CAPTION] Caption metni
[IPUCU] İpucu
[TREND] Viral trend adı | Neden viral oldu | Nasıl uyarlarsın

Asla ## ### --- \`\`\` kullanma.`;

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
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: sistemPrompt,
    messages: mesajlar,
    tools: [
      {
        type: 'web_search_20250305',
        name: 'web_search',
      } as any,
    ],
  });

  let cevap = '';
  for (const blok of yanit.content) {
    if (blok.type === 'text') {
      cevap += blok.text;
    }
  }

  return NextResponse.json({ cevap });
}