import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { profil, markaAdi, markaAlani, teklifTuru, takipciSayisi, ortalamaIzlenme } = await req.json();

  const sistemPrompt = `Sen via.ai'nin influencer pazarlama ve işbirliği teklif uzmanısın. İçerik üreticilerine markalara göndermek için profesyonel, ikna edici işbirliği teklifleri yazıyorsun.

İçerik üretici bilgileri:
- Ad: ${profil.isletme_adi}
- Niş: ${profil.sektor}
- Şehir: ${profil.sehir}
- Takipçi sayısı: ${takipciSayisi}
- Ortalama izlenme: ${ortalamaIzlenme}

Teklif bilgileri:
- Marka adı: ${markaAdi}
- Marka alanı: ${markaAlani}
- Teklif türü: ${teklifTuru}

GÖREVIN:
1. Web'de bu markayı araştır
2. Markanın hedef kitlesi ve değerleriyle uyumu analiz et
3. 3 farklı teklif tonu yaz: Profesyonel, Samimi, Kısa & Net
4. Her teklif için konu satırı yaz
5. Fiyat/ücret önerisi sun
6. Takip mesajı yaz (cevap gelmezse)
7. Teklifi güçlendirecek istatistikleri öner

CEVAP FORMATI - SADECE BU TAGLERI KULLAN:
[BASLIK] Başlık
[MARKA_ANALIZ] Marka değerlendirmesi | Uyum skoru | Neden uygun
[FIYAT] Önerilen ücret | Neden bu fiyat | Müzakere aralığı
[TEKLIF1] Profesyonel | Konu satırı | Teklif metni
[TEKLIF2] Samimi & Kişisel | Konu satırı | Teklif metni
[TEKLIF3] Kısa & Net | Konu satırı | Teklif metni
[TAKIP] Takip mesajı | Ne zaman gönderilir
[GUCLENDIR] Teklife eklenecek istatistik | Neden ikna edici
[IPUCU] Kritik teklif notu

KESİNLİKLE YASAK:
- ## ### --- kullanma
- Düz paragraf yazma
- Tag dışı metin yazma`;

  const mesajlar: { role: 'user' | 'assistant'; content: any }[] = [
    {
      role: 'user',
      content: `${profil.isletme_adi} için ${markaAdi} markasına ${teklifTuru} işbirliği teklifi yaz. Takipçi: ${takipciSayisi}, Ortalama izlenme: ${ortalamaIzlenme}.`
    }
  ];

  let cevap = '';
  let devam = true;

  while (devam) {
    const yanit = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4000,
      system: sistemPrompt,
      messages: mesajlar,
      tools: [{ type: 'web_search_20250305' as const, name: 'web_search' }],
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
        if (blok.type === 'text') cevap += (blok as any).text;
      }
      devam = false;
    }
  }

  return NextResponse.json({ cevap });
}