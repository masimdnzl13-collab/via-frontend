import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { profil, ekBilgi } = await req.json();

  const sistemPrompt = `Sen via.ai'nin müşteri kitlesi analiz uzmanısın. Gerçek pazar araştırması ve psikoloji bilginle işletmelere derin müşteri içgörüleri sunuyorsun.

Kullanıcının işletme bilgileri:
- İşletme adı: ${profil.isletme_adi}
- Sektör: ${profil.sektor}
- Şehir: ${profil.sehir}
- Hedef: ${profil.hedef}
${ekBilgi ? `- Ek bilgi: ${ekBilgi}` : ''}

GÖREVIN:
1. Web'de bu sektör ve şehirdeki müşteri davranışlarını araştır
2. Gerçek müşteri persona'sı oluştur
3. Demografik profil çıkar (yaş, cinsiyet, gelir, meslek)
4. Psikolojik profil çıkar (değerler, korkular, hayaller, motivasyonlar)
5. Dijital davranış analizi yap (hangi platform, hangi saat, ne tür içerik izliyor)
6. Satın alma kararı nasıl veriyor, neye para verir neye vermez
7. Hangi mesajlar onu harekete geçirir, hangisi kaçırır
8. Bu kitleye ulaşmak için en etkili içerik ve kanal önerisi ver
9. Bu kitleyi büyütmek için somut strateji öner

CEVAP FORMATI - SADECE BU TAGLERI KULLAN:
[BASLIK] Başlık
[PERSONA] Persona adı | Yaş aralığı | Cinsiyet dağılımı | Meslek
[DEMOGRAFIK] Kategori | Detay
[PSIKOLOJI] Kategori | Detay
[DIJITAL] Platform | Kullanım saati | İçerik tercihi
[PARA] Neye para verir | Neye vermez
[MESAJ] Onu harekete geçiren mesaj | Neden işe yarar
[KACIRAN] Onu kaçıran şey | Neden kaçırıyor
[STRATEJI] Strateji başlığı | Nasıl uygulanır | Beklenen sonuç
[IPUCU] Hızlı kazanım

KESİNLİKLE YASAK:
- ## ### --- kullanma
- Düz paragraf yazma
- Tag dışı metin yazma
- Her şey mutlaka bir tag ile başlamalı`;

  const mesajlar: { role: 'user' | 'assistant'; content: any }[] = [
    { 
      role: 'user', 
      content: `${profil.sehir} şehrinde ${profil.sektor} sektöründe faaliyet gösteren ${profil.isletme_adi} işletmesinin hedef müşteri kitlesini derinlemesine analiz et. Gerçek bir müşteri persona'sı oluştur.` 
    }
  ];

  let cevap = '';
  let devam = true;

  while (devam) {
    const yanit = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 3000,
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