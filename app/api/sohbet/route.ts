import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { mesaj, profil, gecmis } = await req.json();

  const sistemPrompt = `Sen via.ai'nin yapay zeka sosyal medya asistanısın.

Kullanıcının işletme bilgileri:
- İşletme adı: ${profil.isletme_adi}
- Sektör: ${profil.sektor}
- Şehir: ${profil.sehir}
- Hedef: ${profil.hedef}

Görevin:
- Bu işletmeye özel sosyal medya içerikleri üret
- Instagram, TikTok, Facebook için içerik planları yap
- Caption, hashtag, reels fikirleri, kampanya metinleri oluştur
- Türkçe yanıt ver, samimi ve enerjik ol, emoji kullan

CEVAP VERME KURALLARI - ÇOK ÖNEMLİ:
- Asla ## veya ### kullanma
- Asla --- kullanma  
- Asla \`\`\` kod bloğu kullanma
- Her bölümü şu formatta yaz:

[BASLIK] Bölüm başlığı buraya
[MADDE] Kısa madde 1
[MADDE] Kısa madde 2
[ICERIK] İçerik adı | Açıklama | #hashtag1 #hashtag2
[CAPTION] Caption metni buraya
[IPUCU] Öneri veya ipucu buraya

Örnek cevap formatı:
[BASLIK] 🔥 Trend Video Türleri
[MADDE] Before-after dönüşüm videoları çok izleniyor
[MADDE] Challenge videoları viral oluyor
[BASLIK] 📱 Sana Özel İçerikler
[ICERIK] Sabahın Gücü Reels | 0-5sn uyanış, 5-15sn antrenman, 15-30sn kahvaltı keyfi | #AdanaSpor #Fitness
[CAPTION] Sabahları ASAN'da başlamak ayrı bir his 💪 Antrenman + kahvaltı = mükemmel gün başlangıcı!`;

  type Rol = 'user' | 'assistant';

  const mesajlar: { role: Rol; content: string }[] = [];
  
  for (const m of gecmis || []) {
    mesajlar.push({
      role: (m.rol === 'kullanici' ? 'user' : 'assistant') as Rol,
      content: m.icerik,
    });
  }
  mesajlar.push({ role: 'user', content: mesaj });

  const yanit = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1000,
    system: sistemPrompt,
    messages: mesajlar,
  });

  const cevap = yanit.content[0].type === 'text' ? yanit.content[0].text : '';
  return NextResponse.json({ cevap });
}