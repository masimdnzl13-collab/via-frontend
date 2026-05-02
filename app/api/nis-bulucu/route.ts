import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profil, ilgiAlanlari, yetenekler, hedef, zaman, deneyim } = body;

    const sistemPrompt = `Sen içerik nişi analisti uzmanısın. Kullanıcının ilgi alanları, yetenekleri ve hedeflerine göre en uygun içerik nişlerini analiz et. Web'de güncel trend nişleri araştır.

CEVAP FORMATI:
[BASLIK] Sana Özel Niş Önerileri
[NIS] Niş adı | Rekabet seviyesi (Düşük/Orta/Yüksek) | Para kazanma potansiyeli (1-10) | Büyüme hızı
[NEDEN] Bu niş neden sana uygun | Güçlü yönlerin
[ICERIK] İçerik fikri | Platform önerisi | Sıklık
[RAKIP] Başarılı hesap örneği | Takipçi sayısı | Ne yapıyor
[PARA] Para kazanma yöntemi | Ne zaman başlanır | Tahmini kazanç
[BASLIK] Kaçınman Gereken Nişler
[KACIN] Niş adı | Neden uygun değil
[IPUCU] Başlangıç için kritik öneri
Asla ## veya --- kullanma.`;

    const kullaniciMesaji = `
Kullanıcı bilgileri:
- Ad/Kullanıcı adı: ${profil?.isletme_adi || 'Belirtilmedi'}
- Mevcut niş/alan: ${profil?.sektor || 'Belirtilmedi'}
- Şehir: ${profil?.sehir || 'Belirtilmedi'}
- İlgi alanları: ${ilgiAlanlari}
- Yetenekler: ${yetenekler || 'Belirtilmedi'}
- Ana hedef: ${hedef}
- Haftalık zaman: ${zaman}
- Deneyim seviyesi: ${deneyim}
    `;

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
  } catch (err) {
    console.error(err);
    return NextResponse.json({ cevap: '[IPUCU] Bir hata oluştu, tekrar dene.' }, { status: 500 });
  }
}