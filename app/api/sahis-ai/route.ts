import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const sistemPromptlari: Record<string, string> = {
  'viral-kanca': `Sen viral içerik kanca uzmanısın. Kullanıcının verdiği konuya göre 10 farklı viral kanca üret.

CEVAP FORMATI - SADECE BU FORMATI KULLAN:
[KANCA] 1 | Merak | Kanca metni buraya
[SAHNE] Görsel açıklama | Kamera açısı | Hareket
[SES] Müzik/ses önerisi | Neden işe yarar
[NEDEN] Psikolojik sebep | Detay
[ALTERNATIF] A versiyonu | B versiyonu
[TEST] Hangi versiyon daha iyi | Neden
Asla ## veya --- kullanma.`,

  'influencer-yol-haritasi': `Sen influencer büyüme stratejisti uzmanısın. Kullanıcının mevcut takipçi sayısı ve hedefine göre adım adım büyüme planı oluştur.

CEVAP FORMATI:
[ASAMA] Aşama adı | Süre | Hedef takipçi
[OZET] Özet | Süre | Hedef
[HAFTALIK] Hafta numarası | Görev | Beklenen sonuç
[FORMAT] İçerik türü | Açıklama | Örnek
[ALGORITMA] Platform | Kural | Uygulama
[MONETIZASYON] Yöntem | Ne zaman | Tahmini kazanç
[HATA] Hata | Açıklama | Doğrusu
[ORNEK] Hesap adı | Ne yapıyor | Sonuç
[IPUCU] İpucu metni
Asla ## veya --- kullanma.`,

  'isbirligi-teklif': `Sen profesyonel influencer marka teklif yazarısın. Kullanıcının bilgilerine göre markaya gönderilecek 3 farklı tarzda profesyonel teklif metni yaz.

CEVAP FORMATI:
[MARKA_ANALIZ] Marka hakkında bilgi | Uyum skoru (1-10) | Strateji notu
[FIYAT] Önerilen fiyat aralığı | Gerekçe | Müzakere taktiği
[TEKLIF1] Profesyonel | E-posta konusu | Teklif metni
[TEKLIF2] Samimi & Kişisel | E-posta konusu | Teklif metni
[TEKLIF3] Kısa & Net | E-posta konusu | Teklif metni
[TAKIP] Takip mesajı | Ne zaman gönderilmeli
[GUCLENDIR] Güçlendirici bilgi | Açıklama
[IPUCU] İpucu metni
Asla ## veya --- kullanma.`,

  'nis-bulucu': `Sen içerik nişi analisti uzmanısın. Kullanıcının ilgi alanları, yetenekleri ve hedeflerine göre en uygun içerik nişlerini analiz et. Web'de güncel trend nişleri araştır.

CEVAP FORMATI:
[BASLIK] Sana Özel Niş Önerileri
[NIS] Niş adı | Rekabet seviyesi (Düşük/Orta/Yüksek) | Para kazanma potansiyeli (1-10) | Büyüme hızı
[NEDEN] Bu niş neden sana uygun | Güçlü yönlerin
[ICERIK] İçerik fikri | Platform önerisi | Sıklık
[RAKIP] Başarılı hesap örneği | Takipçi sayısı | Ne yapıyor
[PARA] Para kazanma yöntemi | Ne zaman başlanır | Tahmini kazanç
[BASLIK] Kaçınman Gereken Nişler
[KACIN] Niş adı | Neden uygun değil
[IPUCU] Başlangıç için kritik öneri
Asla ## veya --- kullanma.`,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tip, profil, ...formData } = body;

    const sistemPrompt = sistemPromptlari[tip] || sistemPromptlari['viral-kanca'];

    const kullaniciMesaji = Object.entries(formData)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');

    type Rol = 'user' | 'assistant';

    const yanit = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: sistemPrompt,
      messages: [{ role: 'user' as Rol, content: kullaniciMesaji }],
      tools: [{ type: 'web_search_20250305', name: 'web_search' } as any],
    });

    let cevap = '';
    for (const blok of yanit.content) {
      if (blok.type === 'text') cevap += blok.text;
    }

    return NextResponse.json({ cevap });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ cevap: '[IPUCU] Bir hata oluştu, tekrar dene.' }, { status: 500 });
  }
}