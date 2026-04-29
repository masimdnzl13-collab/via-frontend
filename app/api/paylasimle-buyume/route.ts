import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { profil, icerikTonu } = await req.json();

  const sistemPrompt = `Sen via.ai'nin viral paylaşım ve sosyal yayılma uzmanısın. İnsanların "bunu arkadaşıma göndermem lazım" diye düşündüğü içerikler tasarlıyorsun.

Kullanıcının işletme bilgileri:
- İşletme adı: ${profil.isletme_adi}
- Sektör: ${profil.sektor}
- Şehir: ${profil.sehir}
- Hedef: ${profil.hedef}
- İçerik tonu: ${icerikTonu}

GÖREVIN:
1. Web'de en çok paylaşılan viral video formatlarını araştır
2. İnsanların neden bir videoyu arkadaşına gönderdiğini analiz et
3. Bu işletmenin sektörüne özel paylaşım tetikleyici içerikler tasarla
4. Her içerik için sahne sahne senaryo yaz
5. "Bunu arkadaşına gönder" dedirten psikolojik tetikleyiciyi belirle

PAYLAŞIM PSİKOLOJİSİ — İnsanlar şunları paylaşır:
- Güldüren: "Bunu görmeden geçme" dedirten
- Tanıdıklık: "Bu tam da sen/biz/o" dedirten
- Şaşırtan: "Bunu biliyor muydun?" dedirten
- Kışkırtan: "Buna ne dersin?" dedirten tartışmalı
- Duygusal: İçi sıkışan, nostalji, aidiyet hissi
- Karşıtlık: Beklenmedik zıtlık — sinirli aslan vs küçük kedi gibi

ÖRNEK FORMATLAR (bunlar gibi yarat):
- Zıtlık videosu: Devasa bir şey ile minik bir şey yan yana, ikisi de aynı tepkiyi veriyor
- "Bu tam sen" formatı: İzleyici kendini görüyor, hemen arkadaşına gönderiyor
- Beklenti kırma: Video bir şey gibi başlıyor, tamamen farklı bitiyor
- Sessiz komedi: Hiç konuşmadan sadece mimikle anlatılan durum
- "Fark ettim mi?" testi: İzleyici bir şeyi kaçırıyor, tekrar izliyor ve paylaşıyor

CEVAP FORMATI - SADECE BU TAGLERI KULLAN:
[BASLIK] Başlık
[PSIKOLOJI] Paylaşım tetikleyicisi | Neden işe yarar | Hedef duygu
[VIDEO] Video adı | Paylaşım türü (komik/şaşırtıcı/duygusal/kışkırtıcı)
[ACILIS] İlk 3 saniye sahnesi | Görsel detay | Ses efekti
[SAHNE] Sahne adı | Ne oluyor tam olarak | Kamera açısı | Neden paylaştırır
[TWIST] Beklenmedik an | Nasıl gelişiyor | İzleyicinin tepkisi
[PAYLASIM_KANCASI] İzleyiciye hissettirilen şey | Neden gönderir | Kime gönderir
[CAPTION] Hazır caption | Neden bu caption paylaştırır
[IPUCU] Kritik uygulama notu

KESİNLİKLE YASAK:
- ## ### --- kullanma
- Düz paragraf yazma  
- Tag dışı metin yazma
- Her şey mutlaka bir tag ile başlamalı`;

  const mesajlar: { role: 'user' | 'assistant'; content: any }[] = [
    {
      role: 'user',
      content: `${profil.sektor} sektöründeki ${profil.isletme_adi} işletmesi için insanların "bunu arkadaşıma göndermem lazım" diyeceği 4 farklı video fikri üret. Ton: ${icerikTonu}. Sinirli aslan vs küçük kedi gibi zıtlık, beklenti kırma, tanıdıklık, kışkırtma gibi gerçek paylaşım tetikleyicileri kullan. Sahne sahne yaz.`
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