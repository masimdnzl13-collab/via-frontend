import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { rakipLink, profil } = await req.json();

  const sistemPrompt = `Sen via.ai'nin rakip analiz uzmanısın. Sosyal medya hesaplarını analiz edip işletmelere rekabet avantajı sağlıyorsun.

Kullanıcının işletme bilgileri:
- İşletme adı: ${profil.isletme_adi}
- Sektör: ${profil.sektor}
- Şehir: ${profil.sehir}
- Hedef: ${profil.hedef}

Analiz edilecek rakip: ${rakipLink}

GÖREVIN:
1. Web'de bu rakip hesabı araştır
2. Hangi içerik formatlarını kullandığını bul
3. Kaç takipçisi var, ne sıklıkta paylaşım yapıyor
4. En çok etkileşim alan içerik tipleri neler
5. Hangi hashtag stratejisini kullanıyor
6. Zayıf noktaları ve boşlukları tespit et
7. Kullanıcının bu rakipten daha iyi yapabileceği şeyleri öner

CEVAP FORMATI - SADECE BU TAGLERI KULLAN:
[BASLIK] Başlık
[RAKIP] Rakip hesap adı | Takipçi sayısı tahmini | Paylaşım sıklığı
[FORMAT] Kullandığı içerik formatı | Açıklama | Etkileşim seviyesi
[BOSLUK] Rakibin yapmadığı şey | Neden fırsat | Nasıl kullanırsın
[ONERI] Somut içerik önerisi | Rakipten nasıl ayrışırsın
[IPUCU] Strateji ipucu

KESİNLİKLE YASAK:
- ## ### --- kullanma
- Düz paragraf yazma
- Tag dışı metin yazma
- Her şey mutlaka bir tag ile başlamalı`;

  const mesajlar: { role: 'user' | 'assistant'; content: any }[] = [
    { role: 'user', content: `Bu rakip hesabı analiz et: ${rakipLink}` }
  ];

  let cevap = '';
  let devam = true;

  while (devam) {
    const yanit = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      system: sistemPrompt,
      messages: mesajlar,
      tools: [
        {
          type: 'web_search_20250305' as const,
          name: 'web_search',
        },
      ],
    });

    mesajlar.push({ role: 'assistant', content: yanit.content });

    if (yanit.stop_reason === 'tool_use') {
      const toolResults = yanit.content
        .filter((b: any) => b.type === 'tool_use')
        .map((b: any) => ({
          type: 'tool_result' as const,
          tool_use_id: b.id,
          content: b.input?.query || '',
        }));

      mesajlar.push({ role: 'user', content: toolResults });
    } else {
      for (const blok of yanit.content) {
        if (blok.type === 'text') {
          cevap += (blok as any).text;
        }
      }
      devam = false;
    }
  }

  return NextResponse.json({ cevap });
}