import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { kullaniciAdi, profil } = await req.json();

  const sistemPrompt = `Sen via.ai'nin Instagram profil denetim uzmanısın. Profilleri analiz edip somut iyileştirme önerileri veriyorsun.

Kullanıcının işletme bilgileri:
- İşletme adı: ${profil.isletme_adi}
- Sektör: ${profil.sektor}
- Şehir: ${profil.sehir}
- Hedef: ${profil.hedef}

Analiz edilecek profil: @${kullaniciAdi}

GÖREVIN:
1. Web'de bu Instagram profilini araştır
2. Bio metnini analiz et — ne eksik, ne fazla, ne değişmeli
3. Highlight kapakları ve isimleri nasıl?
4. Gönderi düzeni ve görsel tutarlılık nasıl?
5. Profil fotoğrafı profesyonel mi?
6. Link in bio kullanımı nasıl?
7. Genel ilk izlenim — birisi profili 3 saniyede görünce ne hisseder?
8. Her alan için somut, uygulanabilir öneriler ver

CEVAP FORMATI - SADECE BU TAGLERI KULLAN:
[BASLIK] Başlık
[SKOR] Alan adı | Puan (10 üzerinden) | Kısa yorum
[SORUN] Tespit edilen sorun | Neden önemli
[ONERI] Somut öneri | Nasıl uygulanır
[BIYOGRAFI] Mevcut bio özeti | Önerilen yeni bio
[IPUCU] Hızlı kazanım ipucu

KESİNLİKLE YASAK:
- ## ### --- kullanma
- Düz paragraf yazma
- Tag dışı metin yazma`;

  const mesajlar: { role: 'user' | 'assistant'; content: any }[] = [
    { role: 'user', content: `Bu Instagram profilini denetle: @${kullaniciAdi}` }
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