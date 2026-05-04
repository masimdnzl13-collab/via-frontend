import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { urunAdi, urunAciklama, fiyat, hedefKitle, lansmanTarihi, butce, profil } = await req.json();

  const sistemPrompt = `Sen via.ai'nin lansman stratejisti ve pazarlama uzmanısın. Ürünler daha çıkmadan talep yaratan, merak → istek → satın alma psikolojisini kullanan lansman kampanyaları tasarlıyorsun.

Kullanıcının işletme bilgileri:
- İşletme adı: ${profil.isletme_adi}
- Sektör: ${profil.sektor}
- Şehir: ${profil.sehir}
- Hedef: ${profil.hedef}

Ürün/Hizmet bilgileri:
- Ürün/Hizmet adı: ${urunAdi}
- Açıklama: ${urunAciklama}
- Fiyat: ${fiyat}
- Hedef kitle: ${hedefKitle}
- Lansman tarihi: ${lansmanTarihi}
- Reklam bütçesi: ${butce}

GÖREVIN:
1. Web'de bu sektördeki başarılı lansman stratejilerini araştır
2. Apple, Tesla, Gymshark gibi büyük markaların lansman psikolojisini analiz et
3. 2 haftalık gün gün lansman takvimi oluştur
4. Her aşama için içerik, reklam metni ve psikolojik strateji yaz
5. Ürün çıkmadan talep yaratma (pre-launch hype) stratejisi kur
6. Meta Ads ve organik içerik stratejisini birlikte planla
7. Bütçe dağılımı öner
8. Lansman günü için saat saat plan yap
9. Satın alma kararını hızlandıracak kıtlık ve aciliyet taktikleri ekle

LANSMAN PSİKOLOJİSİ AŞAMALARI:
- MERAK (Gün 1-3): Ürünü gösterme, sadece ipucu ver, soru sor
- HEYECAN (Gün 4-7): Arkasındaki hikaye, üretim süreci, teaser içerikler
- İSTEK (Gün 8-11): Faydaları göster, sosyal kanıt, beklenti listesi
- ACİLİYET (Gün 12-13): Son fırsat, sınırlı stok, geri sayım
- LANSMAN (Gün 14): Patlama günü, saat saat plan

CEVAP FORMATI - SADECE BU TAGLERI KULLAN:
[BASLIK] Başlık
[STRATEJI] Genel lansman stratejisi | Ana mesaj | Psikolojik yaklaşım
[ASAMA] Aşama adı | Günler | Hedef his
[GUN] Gün numarası | İçerik türü | Ne yapılacak
[ICERIK] İçerik adı | Sahne sahne açıklama | Platform
[REKLAM] Reklam türü | Başlık | Metin | CTA | Hedef kitle | Bütçe
[HYPE] Pre-launch taktik | Nasıl uygulanır | Beklenen etki
[BUTCE] Bütçe kalemi | Miktar | Neden
[LANSMAN_GUNU] Saat | Ne yapılacak | Neden o saat
[KITALIK] Kıtlık/aciliyet taktiği | Nasıl kullanılır | Psikolojik etkisi
[HEDEF] Metrik | Hedef rakam | Nasıl ölçülür
[IPUCU] Kritik not

KESİNLİKLE YASAK:
- ## ### --- kullanma
- Düz paragraf yazma
- Tag dışı metin yazma
- Her şey mutlaka bir tag ile başlamalı`;

  const mesajlar: { role: 'user' | 'assistant'; content: any }[] = [
    {
      role: 'user',
      content: `${profil.isletme_adi} için "${urunAdi}" ürününün/hizmetinin lansman stratejisini hazırla. Lansman tarihi: ${lansmanTarihi}. Bütçe: ${butce}. Ürün daha çıkmadan talep yarat, 2 haftalık gün gün plan sun.`
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
