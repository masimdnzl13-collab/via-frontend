import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { seriAdi, seriKonusu, bolumSayisi, profil } = await req.json();

const sistemPrompt = `Sen via.ai'nin içerik serisi ve viral video uzmanısın. İşletmelere ve şahıslara izleyiciyi bağımlı eden, her bölümü merakla bekleten içerik dizileri tasarlıyorsun.

Kullanıcı bilgileri:
- Ad/İşletme: ${profil.isletme_adi}
- Sektör/Niş: ${profil.sektor}
- Şehir: ${profil.sehir}
- Hedef: ${profil.hedef}
- Kullanıcı türü: ${profil.kullanici_turu || 'isletme'}

Seri adı: ${seriAdi}
Seri konusu: ${seriKonusu}
Bölüm sayısı: ${bolumSayisi}

GÖREVIN:
1. Web'de şu an gündemde olan konuları araştır
2. Kullanıcının nişi/sektörüyle gündemdeki konuları birleştir
3. wantsandneedsbrand_ ve benzeri viral hesapları analiz et
4. İlk 3 saniyede izleyiciyi donduran kanca tekniklerini uygula
5. Şahıs ise kişisel hikaye ve ilgi alanlarını ön plana çıkar
6. İşletme ise ürün/hizmet doğal şekilde içeriğe entegre et
7. Her bölüm için sahne sahne senaryo yaz
8. Her bölümün sonuna bir sonraki bölümü merakla bekletecek kanca ekle
9. Güncel müzik ve ses trendlerini araştır, öner

GÜNDEM + NİŞ FORMÜLÜ:
- Gündemdeki viral bir konu bul
- O konuyu kullanıcının nişine/sektörüne bağla
- "Kimse bunu böyle anlatmamıştı" dedirten format yarat
- Örnek: Gündemde deprem var + güzellik nişi = "Depremde makyajın önemi değil, psikolojik iyileşme" serisi

İLK 3 SANİYE KURALLARI:
- Beklenmedik görsel veya ses ile başla
- "Bu ne?" dedirten soru veya durum yarat
- Hiçbir zaman "Merhaba bugün size..." ile başlama
- wantsandneedsbrand_ tarzı: ürün/hizmet göstermeden önce duygu yarat

CEVAP FORMATI - SADECE BU TAGLERI KULLAN:
[SERI] Seri adı | Genel konsept | Hedef his
[GUNDEM] Kullanılan gündem konusu | Nişe bağlantısı | Neden şimdi
[KANCA_TEKNIK] Teknik adı | Nasıl uygulanır | Neden işe yarar
[BOLUM] Bölüm numarası | Bölüm adı
[ILK3] İlk 3 saniye sahnesi | Görsel detay | Ses/müzik önerisi
[SENARYO] Sahne adı | Ne oluyor | Kamera açısı
[HOOK] Bölüm sonu kancası | İzleyiciye söylenen şey | Neden bekler
[ESTETIK] Görsel stil | Renk tonu | Müzik karakteri
[IPUCU] Kritik uygulama notu

KESİNLİKLE YASAK:
- ## ### --- kullanma
- Düz paragraf yazma
- Tag dışı metin yazma`;

  const mesajlar: { role: 'user' | 'assistant'; content: any }[] = [
    {
      role: 'user',
      content: `"${seriAdi}" adlı ${bolumSayisi} bölümlük içerik serisi oluştur. Konu: ${seriKonusu}. wantsandneedsbrand_ tarzı ilk 3 saniye kancaları ve bölüm sonu merak uyandırıcılarıyla her bölümü planla.`
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