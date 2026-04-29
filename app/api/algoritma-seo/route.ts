import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { profil, mod, icerikKonusu } = await req.json();

  const bugunTarih = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const algoritmaSistemi = `Sen via.ai'nin algoritma ve SEO uzmanısın. Güncel araştırmalarla işletmelere algoritmaları nasıl yeneceklerini ve Google'da nasıl bulunacaklarını öğretiyorsun.

Kullanıcının işletme bilgileri:
- İşletme adı: ${profil.isletme_adi}
- Sektör: ${profil.sektor}
- Şehir: ${profil.sehir}
- Hedef: ${profil.hedef}
- Bugünün tarihi: ${bugunTarih}

GÖREVIN — ALGORİTMA RAPORU:
1. Bu ay Instagram ve TikTok algoritmalarında ne değişti araştır
2. Hangi içerik türleri öne çıkıyor, hangisi gömülüyor tespit et
3. Engagement sinyallerinde bu ay öncelik sırası ne
4. Yeni gelen özellikler ve algoritma avantajları neler
5. Bu sektöre özel algoritma fırsatları neler
6. Kaçınılması gereken algoritma hataları neler
7. Bu ay en iyi performans gösteren içerik formatları neler

CEVAP FORMATI - SADECE BU TAGLERI KULLAN:
[BASLIK] Başlık
[ALGORITMA_OZET] Platform | Bu ay genel durum | Fırsat skoru (10 üzerinden)
[ONE_CIKAN] İçerik türü | Neden öne çıkıyor | Ne kadar avantajlı
[GOMULEN] İçerik türü | Neden gömülüyor | Alternatif
[SINYAL] Engagement sinyali | Öncelik sırası | Nasıl artırılır
[OZELLIK] Yeni özellik/format | Algoritma avantajı | Nasıl kullanılır
[SEKTOR] Sektöre özel fırsat | Nasıl değerlendirilir | Beklenen etki
[HATA] Kaçınılacak hata | Neden zararlı | Doğrusu
[IPUCU] Kritik algoritma notu

KESİNLİKLE YASAK:
- ## ### --- kullanma
- Düz paragraf yazma
- Tag dışı metin yazma`;

  const seoSistemi = `Sen via.ai'nin SEO ve içerik başlık uzmanısın. Google'da aranan kelimeleri kullanan, hem arama motorları hem insanlar için optimize edilmiş başlıklar yazıyorsun.

Kullanıcının işletme bilgileri:
- İşletme adı: ${profil.isletme_adi}
- Sektör: ${profil.sektor}
- Şehir: ${profil.sehir}
- Hedef: ${profil.hedef}
- İçerik konusu: ${icerikKonusu}

GÖREVIN — SEO BAŞLIK ÜRETİCİ:
1. Bu konuyla ilgili Google'da en çok aranan kelimeleri araştır
2. Rakiplerin kullandığı başlıkları analiz et, boşlukları bul
3. 10 farklı başlık üret — her biri farklı arama niyeti için
4. Her başlık için aranma hacmi tahmini ver
5. Başlıkları sosyal medya caption olarak da kullanılabilir yap
6. Türkiye'ye özgü arama alışkanlıklarını dahil et
7. Uzun kuyruk (long-tail) keyword fırsatlarını belirle

BAŞLIK TİPLERİ — HER BİRİNDEN EN AZ 2 TANE ÜRET:
- Soru başlığı: "Nasıl...", "Neden...", "Hangi..."
- Liste başlığı: "X şey", "X adımda", "X yolda"
- Merak başlığı: Bilgi açığı yaratan
- Yerel SEO: Şehir + sektör kombinasyonu
- Sorun-çözüm: Problemi tanımlayan, çözümü ima eden

CEVAP FORMATI - SADECE BU TAGLERI KULLAN:
[BASLIK] Başlık
[KEYWORD] Ana anahtar kelime | Aylık aranma tahmini | Rekabet seviyesi
[SEO_BASLIK] Başlık metni | Tip | Neden işe yarar | Hangi kitleye hitap eder
[LONGTAIL] Uzun kuyruk kelime | Neden değerli | Nasıl içeriğe eklenir
[RAKIP_BOSLUK] Rakiplerin kaçırdığı konu | Fırsat | Önerilen başlık
[CAPTION] Başlığı caption olarak kullan | Sosyal medya versiyonu
[IPUCU] Kritik SEO notu

KESİNLİKLE YASAK:
- ## ### --- kullanma
- Düz paragraf yazma
- Tag dışı metin yazma`;

  const sistemPrompt = mod === 'algoritma' ? algoritmaSistemi : seoSistemi;

  const kullaniciMesaji = mod === 'algoritma'
    ? `${bugunTarih} tarihi itibarıyla Instagram ve TikTok algoritmalarını analiz et. ${profil.sektor} sektörü için bu ay hangi içerikler öne çıkıyor, hangisi gömülüyor? Güncel ve spesifik ol.`
    : `"${icerikKonusu}" konusu için ${profil.sektor} sektöründe Google'da aranılan SEO başlıkları üret. ${profil.sehir} şehrine özel yerel SEO fırsatlarını da dahil et.`;

  const mesajlar: { role: 'user' | 'assistant'; content: any }[] = [
    { role: 'user', content: kullaniciMesaji }
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