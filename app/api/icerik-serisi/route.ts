import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { seriAdi, seriKonusu, bolumSayisi, profil } = await req.json();

  const sistemPrompt = `Sen via.ai'nin içerik serisi ve viral video uzmanısın. İşletmelere izleyiciyi bağımlı eden, her bölümü merakla bekleten içerik dizileri tasarlıyorsun.

Kullanıcının işletme bilgileri:
- İşletme adı: ${profil.isletme_adi}
- Sektör: ${profil.sektor}
- Şehir: ${profil.sehir}
- Hedef: ${profil.hedef}

Seri adı: ${seriAdi}
Seri konusu: ${seriKonusu}
Bölüm sayısı: ${bolumSayisi}

GÖREVIN:
1. Önce wantsandneedsbrand_ Instagram hesabını ve benzeri viral hesapları web'de araştır
2. İlk 3 saniyede izleyiciyi donduran kanca tekniklerini analiz et
3. Bu teknikleri işletmenin sektörüne uyarla
4. Her bölüm için sahne sahne senaryo yaz
5. Her bölümün sonuna bir sonraki bölümü merakla bekletecek kanca ekle
6. İlk 3 saniye için özel dikkat çekici açılış tekniği belirle
7. Seri boyunca tutarlı bir his ve estetik oluştur

İLK 3 SANİYE KURALLARI - HER BÖLÜMDE MUTLAKA UYGULA:
- Beklenmedik görsel veya ses ile başla
- İzleyiciyi "bu ne?" dedirtecek bir soru veya durum yarat
- Hareket, kontrast veya şok etkisi kullan
- Hiçbir zaman "Merhaba bugün size..." ile başlama
- wantsandneedsbrand_ tarzı: ürün göstermeden önce duygu ve merak yarat

CEVAP FORMATI - SADECE BU TAGLERI KULLAN:
[SERI] Seri adı | Genel konsept | Hedef his
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
- Tag dışı metin yazma
- Her şey mutlaka bir tag ile başlamalı`;

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