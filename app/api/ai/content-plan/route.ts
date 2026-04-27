import { NextResponse } from 'next/server';
import { anthropic } from '@/lib/claude';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      isletme_adi,
      sektor,
      sehir,
      hedef,
    } = body;

    if (!isletme_adi || !sektor || !sehir || !hedef) {
      return NextResponse.json(
        { error: 'Eksik işletme bilgisi var.' },
        { status: 400 }
      );
    }

    const prompt = `
Sen via.ai adlı uygulamanın yapay zeka sosyal medya yöneticisisin.

İşletme bilgileri:
- İşletme adı: ${isletme_adi}
- Sektör: ${sektor}
- Şehir: ${sehir}
- Hedef: ${hedef}

Bu işletme için 7 günlük sosyal medya içerik planı üret.

Her gün için şu alanları ver:
1. Gün
2. İçerik fikri
3. Çekim talimatı
4. Caption
5. Hashtagler
6. Paylaşım saati
7. Neden bu içerik uygun?

Yanıtı sade, Türkçe ve uygulanabilir yaz.
`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1800,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const text = message.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n');

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error('Claude API error:', error);

    return NextResponse.json(
      { error: 'AI içerik planı oluşturulamadı.' },
      { status: 500 }
    );
  }
}