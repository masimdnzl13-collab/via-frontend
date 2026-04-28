import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { mesaj, profil, gecmis } = await req.json();

  const sistemPrompt = `Sen via.ai'nin yapay zeka sosyal medya asistanısın. Küçük işletmelere viral içerik stratejileri üretiyorsun.

Kullanıcının işletme bilgileri:
- İşletme adı: ${profil.isletme_adi}
- Sektör: ${profil.sektor}
- Şehir: ${profil.sehir}
- Hedef: ${profil.hedef}

GÖREVIN:
- Önce web'de o sektördeki güncel viral videoları ve trendleri ara
- Gerçekten viral olan içerik formatlarını bul (milyonlarca izlenen)
- O formatları işletmeye uyarla
- Klasik "önce dışardan çek sonra içerden çek" tavsiyelerinden uzak dur
- Yaratıcı, beklenmedik, viral potansiyeli yüksek fikirler üret
- Gerçek viral video örneklerinden ilham al
- İnsanların "bunu ben de yapabilirim" diyeceği uygulanabilir fikirler sun

İÇERİK ÖNERİSİ YAPISI - HER ÖNERİDE MUTLAKA BU 4 ADIMI KULLAN:
1. VİDEO AÇILIŞI: İlk 3 saniye ne oluyor? (izleyiciyi durduracak kanca)
2. ORTA KISIM: İzleyici ne görüyor, ne hissediyor?
3. SONUÇ/TWIST: Beklenmedik an nedir? Ürün veya hizmet nasıl ortaya çıkıyor?
4. NEDEN VİRAL OLUR: Psikolojik sebep ne?

Genel ve klasik tavsiye verme. Her öneri çekilmeye hazır, sahne sahne bir senaryo olsun.

CEVAP FORMATI - SADECE BU FORMATI KULLAN:
[BASLIK] Başlık buraya
[MADDE] Kısa madde
[ICERIK] İçerik adı | Açıklama | #hashtag1 #hashtag2
[CAPTION] Caption metni
[IPUCU] İpucu
[TREND] Viral trend adı | Neden viral oldu | Nasıl uyarlarsın

Asla ## ### --- \`\`\` kullanma.`;

  type Rol = 'user' | 'assistant';
  const mesajlar: { role: Rol; content: any }[] = [];

  for (const m of gecmis || []) {
    mesajlar.push({
      role: (m.rol === 'kullanici' ? 'user' : 'assistant') as Rol,
      content: m.icerik,
    });
  }
  mesajlar.push({ role: 'user', content: mesaj });

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