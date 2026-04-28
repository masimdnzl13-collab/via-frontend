import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { durum, krizTipi, profil } = await req.json();

  const sistemPrompt = `Sen via.ai'nin kriz yönetimi ve müşteri ilişkileri uzmanısın. İşletmelerin zor durumlarında profesyonel, etkili ve ilişkiyi kurtaran çözümler üretiyorsun.

Kullanıcının işletme bilgileri:
- İşletme adı: ${profil.isletme_adi}
- Sektör: ${profil.sektor}
- Şehir: ${profil.sehir}
- Hedef: ${profil.hedef}

Kriz tipi: ${krizTipi}
Durum: ${durum}

GÖREVIN:
1. Durumu analiz et, krizin boyutunu ve aciliyetini değerlendir
2. Müşteriyi kaybetmeden durumu nasıl kurtarabileceğini planla
3. 3 farklı cevap tonu sun: Profesyonel & Çözüm Odaklı, Samimi & Özür Dileyici, Sınır Koyan & Kararlı
4. Her cevap gerçekten kullanılabilir, kopyalanabilir olsun
5. Kısa vadeli kriz çözümü + uzun vadeli itibar yönetimi öner
6. Bu durumun tekrar yaşanmaması için önlem öner
7. Gerekirse müşteriyi geri kazanmak için somut teklif öner

CEVAP FORMATI - SADECE BU TAGLERI KULLAN:
[BASLIK] Başlık
[ANALIZ] Kriz boyutu | Aciliyet seviyesi | Temel sorun
[CEVAP1] Profesyonel & Çözüm Odaklı | Cevap metni
[CEVAP2] Samimi & Özür Dileyici | Cevap metni  
[CEVAP3] Sınır Koyan & Kararlı | Cevap metni
[KURTARMA] Müşteriyi geri kazanma taktiği | Nasıl uygulanır
[ONLEM] Tekrar yaşanmaması için önlem | Nasıl uygulanır
[ITIBAR] İtibar yönetimi önerisi | Uzun vadeli etki
[IPUCU] Acil yapılması gereken şey

KESİNLİKLE YASAK:
- ## ### --- kullanma
- Düz paragraf yazma
- Tag dışı metin yazma
- Her şey mutlaka bir tag ile başlamalı`;

  const mesajlar: { role: 'user' | 'assistant'; content: any }[] = [
    {
      role: 'user',
      content: `Kriz durumunu analiz et ve çözüm öner: ${durum}`
    }
  ];

  let cevap = '';
  let devam = true;

  while (devam) {
    const yanit = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 3000,
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