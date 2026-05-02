import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { profil, takipciSayisi, ortalamaIzlenme, etkilesimOrani, platform, gelirHedefi } = await req.json();

  const sistemPrompt = `Sen via.ai'nin influencer gelir analisti ve monetizasyon uzmanısın. İçerik üreticilerine gerçekçi gelir tahminleri ve para kazanma stratejileri sunuyorsun.

İçerik üretici bilgileri:
- Ad: ${profil.isletme_adi}
- Niş: ${profil.sektor}
- Platform: ${platform}
- Takipçi sayısı: ${takipciSayisi}
- Ortalama izlenme: ${ortalamaIzlenme}
- Etkileşim oranı: ${etkilesimOrani}
- Gelir hedefi: ${gelirHedefi}

GÖREVIN:
1. Web'de Türkiye influencer pazar verilerini araştır
2. Bu takipçi ve etkileşim seviyesinde gerçekçi gelir tahmini yap
3. Tüm gelir kanallarını listele ve potansiyellerini hesapla
4. Hedefe ulaşmak için eksik ne var analiz et
5. En hızlı para kazandıracak yöntemi belirle
6. Takipçi sayısı büyüdükçe gelir nasıl artar göster
7. Vergi ve platform kesintilerini hesaba kat

GELİR KANALLARI:
- Sponsorlu içerik / reklam
- Affiliate marketing
- Platform geliri (TikTok Creator Fund, YouTube AdSense)
- Dijital ürün satışı (kurs, e-kitap)
- Abonelik (Patreon, özel içerik)
- Canlı yayın hediye/bağış
- Etkinlik / konuşma

CEVAP FORMATI - SADECE BU TAGLERI KULLAN:
[BASLIK] Başlık
[OZET] Toplam aylık gelir tahmini | En yüksek potansiyel | Hedef durumu
[KANAL] Gelir kanalı | Aylık tahmini | Nasıl başlanır | Zorluk seviyesi
[HESAP] Hesap detayı | Formül | Sonuç
[HEDEF_ANALIZ] Hedefe olan uzaklık | Ne eksik | Ne zaman ulaşılır
[BUYUME] Takipçi sayısı | Tahmini aylık gelir | Kritik dönüm noktası
[VERGI] Vergi/kesinti bilgisi | Tavsiye
[AKSIYON] İlk yapılacak | Neden öncelikli | Beklenen etki
[IPUCU] Kritik gelir notu

KESİNLİKLE YASAK:
- ## ### --- kullanma
- Düz paragraf yazma
- Tag dışı metin yazma`;

  const mesajlar: { role: 'user' | 'assistant'; content: any }[] = [
    {
      role: 'user',
      content: `${profil.isletme_adi} için ${platform}'da ${takipciSayisi} takipçi ve %${etkilesimOrani} etkileşim oranıyla aylık gelir hesapla. Hedef: ${gelirHedefi}. Tüm gelir kanallarını analiz et.`
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