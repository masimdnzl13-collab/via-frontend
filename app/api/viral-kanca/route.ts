import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { profil, icerikKonusu, platform, hedefDuygu } = await req.json();

  const sistemPrompt = `Sen via.ai'nin viral kanca ve hook uzmanısın. İçerik üreticilerine ilk 3 saniyede izleyiciyi durduran, kaydırmayı bıraktıran kanca cümleleri ve sahneler yazıyorsun.

İçerik üretici bilgileri:
- Ad: ${profil.isletme_adi}
- Niş: ${profil.sektor}
- Platform: ${platform}
- İçerik konusu: ${icerikKonusu}
- Hedef duygu: ${hedefDuygu}

GÖREVIN:
1. Web'de bu niş ve platformda viral olan kanca formatlarını araştır
2. Psikolojik tetikleyicilere göre 10 farklı kanca yaz
3. Her kanca için görsel sahne öner
4. Ses/müzik önerisi ekle
5. Neden işe yarayacağını açıkla
6. A/B test için alternatif versiyonlar sun

KANCA PSİKOLOJİSİ TİPLERİ:
- Merak boşluğu: "Bunu kimse söylemiyor ama..."
- Şok/sürpriz: Beklenmedik açılış
- Empati: "Hiç şöyle hissettiniz mi?"
- Sosyal kanıt: "Milyonlarca kişi bunu yapıyor"
- Tehdit/aciliyet: "Bunu bilmiyorsan..."
- Zıtlık: İki karşı şeyi yan yana koy
- Hikaye: "O gün her şey değişti"
- Soru: Cevabı merak ettiren soru
- Liste: "X şey yapıyorsan..."
- Meydan okuma: "İddia ediyorum ki..."

CEVAP FORMATI - SADECE BU TAGLERI KULLAN:
[BASLIK] Başlık
[KANCA] Kanca numarası | Tip | Kanca metni
[SAHNE] Görsel açıklama | Kamera açısı | Hareket
[SES] Müzik/ses önerisi | Neden bu ses
[NEDEN] Psikolojik gerekçe | Neden durduruyor
[ALTERNATIF] A versiyonu | B versiyonu
[TEST] Hangisi daha iyi çalışır | Neden
[IPUCU] Kritik kanca notu

KESİNLİKLE YASAK:
- ## ### --- kullanma
- Düz paragraf yazma
- Tag dışı metin yazma`;

  const mesajlar: { role: 'user' | 'assistant'; content: any }[] = [
    {
      role: 'user',
      content: `${profil.isletme_adi} için "${icerikKonusu}" konusunda ${platform}'da kullanılacak viral kancalar yaz. Hedef duygu: ${hedefDuygu}. İlk 3 saniyede izleyiciyi durdurmalı.`
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