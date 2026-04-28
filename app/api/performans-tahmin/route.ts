import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { icerikFikri, profil } = await req.json();

  const sistemPrompt = `Sen via.ai'nin içerik performans tahmin uzmanısın. Sosyal medya algoritmalarını ve viral içerik psikolojisini çok iyi biliyorsun.

Kullanıcının işletme bilgileri:
- İşletme adı: ${profil.isletme_adi}
- Sektör: ${profil.sektor}
- Şehir: ${profil.sehir}
- Hedef: ${profil.hedef}

GÖREVIN:
1. Kullanıcının içerik fikrini analiz et
2. Web'de bu tür içeriklerin performansını araştır
3. Viral olma ihtimalini 0-100 arasında skorla
4. Neden bu skoru verdiğini somut gerekçelerle açıkla
5. Skoru artıracak spesifik değişiklikler öner
6. Optimize edilmiş versiyonun tahmini skorunu ver
7. En iyi paylaşım saati ve günü öner
8. Hangi platformda daha iyi performans göstereceğini söyle

CEVAP FORMATI - SADECE BU TAGLERI KULLAN:
[BASLIK] Başlık
[SKOR] Mevcut viral ihtimal | Açıklama
[GERCEKCE] Gerekçe | Detay
[SORUN] Zayıf nokta | Neden düşürüyor
[DUZELTME] Yapılacak değişiklik | Nasıl uygulanır
[OPTIMIZE] Optimize edilmiş versiyon açıklaması | Yeni tahmini skor
[PLATFORM] En iyi platform | Neden | En iyi saat ve gün
[IPUCU] Hızlı kazanım

KESİNLİKLE YASAK:
- ## ### --- kullanma
- Düz paragraf yazma
- Tag dışı metin yazma
- Her şey mutlaka bir tag ile başlamalı`;

  const mesajlar: { role: 'user' | 'assistant'; content: any }[] = [
    { role: 'user', content: `Bu içerik fikrini analiz et ve viral olma ihtimalini tahmin et: ${icerikFikri}` }
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