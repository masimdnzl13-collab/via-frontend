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
     model: 'claude-3-5-sonnet-20241022',
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
   } catch (err: any) {
    console.error('CLAUDE ERROR:', err);

    return NextResponse.json(
      {
        error: err?.message || 'AI hata verdi',
        detail: JSON.stringify(err, null, 2),
      },
      { status: 500 }
    );
  }