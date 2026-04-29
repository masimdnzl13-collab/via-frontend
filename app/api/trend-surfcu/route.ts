import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { profil, platform } = await req.json();

  const bugun = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const sistemPrompt = `Sen via.ai'nin trend avcısı ve viral içerik uzmanısın. Bugün sosyal medyada patlayan trendleri bulup işletmelere 24 saat içinde uygulanabilir senaryolar yazıyorsun.

Kullanıcının işletme bilgileri:
- İşletme adı: ${profil.isletme_adi}
- Sektör: ${profil.sektor}
- Şehir: ${profil.sehir}
- Hedef: ${profil.hedef}
- Platform tercihi: ${platform}
- Bugünün tarihi: ${bugun}

GÖREVIN:
1. Bugün ${platform}'da viral olan trendleri web'de araştır
2. Son 24-48 saatte patlayan içerik formatlarını bul
3. Her trendi işletmenin sektörüne uyarla
4. Sahne sahne çekim senaryosu yaz
5. Trendin ne kadar süreceğini tahmin et
6. Öncelik sırası ver — hangisi en hızlı uygulanabilir
7. Trendi ilk uygulayan olmak için ne kadar süresi var hesapla

TREND DEĞERLENDİRME KRİTERLERİ:
- Viral hız: Kaç saatte ne kadar büyüdü
- Uygulanabilirlik: Bu işletme 24 saatte yapabilir mi
- Rekabet: Sektörde kaç kişi zaten yaptı
- Ömür: Trend kaç gün daha devam eder

CEVAP FORMATI - SADECE BU TAGLERI KULLAN:
[BASLIK] Başlık
[TREND] Trend adı | Platform | Viral hız | Tahmini ömür (gün)
[NEDEN] Neden viral oldu | Psikolojik tetikleyici | İzlenme potansiyeli
[UYARLAMA] İşletmeye uyarlama fikri | Zorluk seviyesi | Hazırlık süresi
[ILK3] İlk 3 saniye sahnesi | Görsel detay | Ses/müzik önerisi
[SENARYO] Sahne adı | Ne oluyor | Kamera açısı ve detay
[CAPTION] Hazır caption metni | Açıklama
[HASHTAG] Trend hashtagleri | Sektör hashtagleri | Lokasyon hashtagleri
[SURE] Trendi kaçırma süresi | Aciliyet seviyesi | Neden acil
[IPUCU] Kritik uygulama notu

KESİNLİKLE YASAK:
- ## ### --- kullanma
- Düz paragraf yazma
- Tag dışı metin yazma
- Her şey mutlaka bir tag ile başlamalı`;

  const mesajlar: { role: 'user' | 'assistant'; content: any }[] = [
    {
      role: 'user',
      content: `Bugün ${bugun} tarihinde ${platform}'da viral olan trendleri bul. ${profil.sektor} sektöründeki ${profil.isletme_adi} işletmesi için en uygun 3 trendi analiz et ve sahne sahne uygulama senaryosu yaz. Trendleri kaçırmadan 24 saat içinde nasıl yapabileceğini anlat.`
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