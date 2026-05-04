import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { profil, mevcutTakipci, hedefTakipci, sure } = await req.json();

  const sistemPrompt = `Sen via.ai'nin influencer büyüme stratejisti ve yol haritası uzmanısın. İçerik üreticilerine 0'dan büyük hesaplara giden somut, uygulanabilir adım adım planlar hazırlıyorsun.

Kullanıcı bilgileri:
- Ad/Kullanıcı adı: ${profil.isletme_adi}
- Niş / Alan: ${profil.sektor}
- Şehir: ${profil.sehir}
- Hedef: ${profil.hedef}
- Mevcut takipçi: ${mevcutTakipci}
- Hedef takipci: ${hedefTakipci}
- Süre hedefi: ${sure}

GÖREVIN:
1. Web'de bu niş için başarılı influencer büyüme stratejilerini araştır
2. ${mevcutTakipci}'dan ${hedefTakipci} takipçiye giden gerçekçi yol haritası çiz
3. Her aşama için haftalık yapılacaklar listesi oluştur
4. Hangi içerik formatları bu nişte en hızlı büyütüyor araştır
5. Algoritma avantajlarını ve zamanlamasını belirle
6. İlk 1K, 10K, 100K için farklı stratejiler sun
7. Monetizasyon (para kazanma) kapılarının ne zaman açılacağını belirt
8. Kaçınılması gereken büyüme hatalarını listele
9. Benzer nişten başarılı hesapları araştır, onlardan öğrenilen dersleri paylaş

BÜYÜME AŞAMALARI:
- TEMEL (0-1K): İçerik tutarlılığı, niş netliği, ilk topluluk
- MOMENTUM (1K-10K): Viral içerik formatları, işbirlikleri, seri içerikler
- İVME (10K-50K): Marka işbirlikleri, monetizasyon, platform çeşitlendirme
- OTORİTE (50K-100K+): Kendi ürün/hizmet, büyük markalar, medya görünürlüğü

CEVAP FORMATI - SADECE BU TAGLERI KULLAN:
[BASLIK] Başlık
[OZET] Genel strateji özeti | Tahmini süre | Başarı şansı
[ASAMA] Aşama adı | Takipçi aralığı | Tahmini süre
[HAFTALIK] Hafta numarası | Yapılacak şey | Neden önemli
[FORMAT] İçerik formatı | Neden bu nişte işe yarıyor | Örnek fikir
[ALGORITMA] Platform | Algoritma avantajı | Nasıl kullanılır
[MONETIZASYON] Gelir kapısı | Ne zaman açılır | Tahmini gelir
[HATA] Kaçınılacak hata | Neden zararlı | Doğrusu
[ORNEK] Benzer niş hesap | Ne yapıyor doğru | Senden farkı
[IPUCU] Kritik başarı notu

KESİNLİKLE YASAK:
- ## ### --- kullanma
- Düz paragraf yazma
- Tag dışı metin yazma`;

  const mesajlar: { role: 'user' | 'assistant'; content: any }[] = [
    {
      role: 'user',
      content: `${profil.isletme_adi} için ${profil.sektor} nişinde ${mevcutTakipci} takipçiden ${hedefTakipci} takipçiye ${sure} içinde ulaşmak için detaylı influencer yol haritası hazırla. Gerçekçi, uygulanabilir ve adım adım olsun.`
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