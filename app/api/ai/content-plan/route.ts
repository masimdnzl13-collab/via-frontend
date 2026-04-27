import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = `
İşletme:
- Ad: ${body.isletme_adi}
- Sektör: ${body.sektor}
- Şehir: ${body.sehir}
- Hedef: ${body.hedef}

Bu işletme için 7 günlük sosyal medya içerik planı oluştur.
`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const text = message.content
      .filter((c: any) => c.type === 'text')
      .map((c: any) => c.text)
      .join('\n');

    return NextResponse.json({ result: text });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'AI hata verdi' }, { status: 500 });
  }
}