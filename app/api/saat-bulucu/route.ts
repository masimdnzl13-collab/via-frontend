import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { profil, platform, icerikTuru } = await req.json();

  const sistemPrompt = `Sen via.ai'nin sosyal medya zamanlama ve algoritma uzmanısın. İşletmelere sektör, şehir ve hedef kitleye göre en iyi paylaşım saatlerini hesaplıyorsun.

Kullanıcının işletme bilgileri:
- İşletme adı: ${profil.isletme_adi}
- Sektör: ${profil.sektor}
- Şehir: ${profil.sehir}
- Hedef: ${profil.hedef}
- Platform: ${platform}
- İçerik türü: ${icerikTuru}

GÖREVIN:
1. Web'de ${profil.sektor} sektörü ve ${profil.sehir} şehri için sosyal medya kullanım verilerini araştır
2. ${platform} algoritmasının güncel çalışma mantığını araştır
3. Hedef kitlenin günlük rutinini analiz et (uyku, iş, yemek, boş zaman)
4. Her gün için en iyi 2-3 paylaşım saatini hesapla
5. Her saatin neden iyi olduğunu psikolojik ve davranışsal gerekçelerle açıkla
6. Farklı içerik türleri için farklı saatler öner
7. Kaçınılması gereken saatleri ve nedenlerini belirt
8. Türkiye'ye özgü sosyal medya kullanım alışkanlıklarını dahil et
9. Bayram, hafta sonu, öğle arası gibi özel durumları hesaba kat

ANALİZ KRİTERLERİ:
- Türkiye saat dilimi (UTC+3)
- ${profil.sehir} şehrinin yaşam ritmi
- ${profil.sektor} sektörünün müşteri profili
- Platform algoritmasının içerikleri ne zaman öne çıkardığı
- Rakip yoğunluğunun düşük olduğu saatler
- Etkileşim oranının en yüksek olduğu zaman dilimleri

CEVAP FORMATI - SADECE BU TAGLERI KULLAN:
[BASLIK] Başlık
[OZET] Genel zamanlama stratejisi | En kritik ipucu | Neden bu işletmeye özel
[GUN] Gün adı | Genel performans skoru (10 üzerinden) | Genel yorum
[SAAT] Saat | Performans skoru | Neden bu saat | Hangi içerik türü | Hedef his
[KACIN] Kaçınılacak saat aralığı | Neden kötü | Alternatif
[ICERIK_SAATI] İçerik türü | En iyi gün | En iyi saat | Neden
[OZEL_DURUM] Özel durum (bayram/hafta sonu vb.) | Öneri | Neden farklı
[ALGORITMA] Platform algoritma ipucu | Nasıl avantaj sağlanır
[IPUCU] Kritik zamanlama notu

KESİNLİKLE YASAK:
- ## ### --- kullanma
- Düz paragraf yazma
- Tag dışı metin yazma
- Her şey mutlaka bir tag ile başlamalı`;

  const mesajlar: { role: 'user' | 'assistant'; content: any }[] = [
    {
      role: 'user',
      content: `${profil.sehir} şehrinde ${profil.sektor} sektöründe faaliyet gösteren ${profil.isletme_adi} için ${platform}'da en iyi paylaşım saatlerini hesapla. İçerik türü: ${icerikTuru}. Türkiye'ye ve bu sektöre özel, genel değil tamamen bu işletmeye özgü analiz yap.`
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