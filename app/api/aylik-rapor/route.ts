import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { profil, veriler, userId } = await req.json();

  // Instagram verilerini web search ile çek
  const sistemPrompt = `Sen via.ai'nin büyüme analisti ve rapor uzmanısın. İşletmelere ajans kalitesinde aylık performans raporları hazırlıyorsun.

Kullanıcının işletme bilgileri:
- İşletme adı: ${profil.isletme_adi}
- Sektör: ${profil.sektor}
- Şehir: ${profil.sehir}
- Hedef: ${profil.hedef}

Bu ayki veriler:
- Takipçi artışı: ${veriler.takipci_artis}
- Toplam izlenme: ${veriler.toplam_izlenme}
- Toplam beğeni: ${veriler.toplam_begeni}
- Toplam yorum: ${veriler.toplam_yorum}
- Üretilen içerik sayısı: ${veriler.icerik_sayisi}
- En iyi içerik: ${veriler.en_iyi_icerik}
- Ay: ${veriler.ay}/${veriler.yil}

GÖREVIN:
1. Bu verileri derinlemesine analiz et
2. Sektördeki ortalama performansla karşılaştır (web araştır)
3. Bu ayın güçlü ve zayıf noktalarını tespit et
4. Gelecek ay için somut büyüme stratejisi sun
5. Rakamsal hedefler belirle (gelecek ay kaç takipçi, kaç izlenme)
6. Ajans kalitesinde, profesyonel ve güven veren bir rapor yaz

CEVAP FORMATI - SADECE BU TAGLERI KULLAN:
[BASLIK] Rapor başlığı
[OZET] Genel performans özeti | Tek cümle değerlendirme | Genel skor (100 üzerinden)
[METRIK] Metrik adı | Bu ay değeri | Sektör ortalaması | Değerlendirme
[BASARI] Bu ayın en büyük başarısı | Neden önemli
[ZAYIF] Bu ayın zayıf noktası | Neden oluştu | Çözüm
[STRATEJI] Gelecek ay stratejisi | Detay | Beklenen sonuç
[HEDEF] Gelecek ay hedefi | Rakamsal değer | Nasıl ulaşılır
[TAVSIYE] Öncelikli tavsiye | Neden | Nasıl uygulanır
[IPUCU] Kritik not

KESİNLİKLE YASAK:
- ## ### --- kullanma
- Düz paragraf yazma
- Tag dışı metin yazma`;

  const mesajlar: { role: 'user' | 'assistant'; content: any }[] = [
    {
      role: 'user',
      content: `${profil.isletme_adi} işletmesi için ${veriler.ay}. ay büyüme raporunu hazırla. Sektör ortalamasıyla karşılaştır ve gelecek ay için strateji sun.`
    }
  ];

  let aiAnaliz = '';
  let devam = true;

  while (devam) {
    const yanit = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 3000,
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
        if (blok.type === 'text') aiAnaliz += (blok as any).text;
      }
      devam = false;
    }
  }

  // Supabase'e kaydet
  await supabase.from('aylik_raporlar').upsert({
    user_id: userId,
    ay: veriler.ay,
    yil: veriler.yil,
    takipci_artis: veriler.takipci_artis,
    toplam_izlenme: veriler.toplam_izlenme,
    toplam_begeni: veriler.toplam_begeni,
    toplam_yorum: veriler.toplam_yorum,
    icerik_sayisi: veriler.icerik_sayisi,
    en_iyi_icerik: veriler.en_iyi_icerik,
    ai_analiz: aiAnaliz,
  });

  return NextResponse.json({ aiAnaliz });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  const { data } = await supabase
    .from('aylik_raporlar')
    .select('*')
    .eq('user_id', userId)
    .order('yil', { ascending: false })
    .order('ay', { ascending: false });

  return NextResponse.json({ raporlar: data || [] });
}