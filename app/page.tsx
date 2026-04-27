import { Sparkles, BarChart3, Video, Calendar, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050507] text-white selection:bg-violet-500/30 overflow-x-hidden relative">
      
      {/* --- ARKA PLAN VİDEO KATMANI --- */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover opacity-40 scale-105 brightness-[0.8] contrast-[1.1]"
        >
          {/* Videonun ismini bg-video.mp4 olarak değiştirip public klasörüne atman yeterli */}
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
        
        {/* Karartma ve Derinlik Overlay'i */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050507]/20 via-[#050507]/60 to-[#050507]" />
        
        {/* Grain (Noktalanma) Efekti - Netlik sorununu gizler ve sinematik yapar */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" 
             style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 backdrop-blur-xl border-b border-white/5 bg-black/10">
        <div className="text-2xl font-black tracking-tighter italic">
          VİA<span className="text-violet-500">.AI</span>
        </div>
        <div className="flex items-center gap-8">
          <a href="/giris" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Giriş Yap</a>
          <a href="/icerik" className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all active:scale-95">
            Ücretsiz Başla
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-40 pb-24">
        <div className="inline-flex items-center gap-2 bg-violet-600/10 border border-violet-500/20 backdrop-blur-md text-violet-300 text-[10px] uppercase tracking-[0.2em] font-black px-4 py-2 rounded-full mb-10">
          <Sparkles className="w-3 h-3" />
          Yapay Zeka Sosyal Medya Mühendisi
        </div>
        
        <h1 className="text-6xl md:text-[6.5rem] font-[900] mb-8 tracking-tighter leading-[0.9] italic">
          YOLUNUZU<br />
          <span className="bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            VİA İLE ÇİZİN.
          </span>
        </h1>
        
        <p className="text-zinc-300 text-lg md:text-xl max-w-2xl mb-14 leading-relaxed font-medium drop-shadow-lg">
          İşletmenizin dijital sokağını biz inşa edelim. <span className="text-white">7 günlük strateji</span> ve <span className="text-violet-400">viral içerik planları</span> sadece bir tık uzağınızda.
        </p>

        <a href="/icerik" className="group flex items-center justify-center gap-3 bg-violet-600 text-white px-12 py-5 rounded-2xl text-xl font-black hover:bg-violet-500 transition-all hover:scale-[1.05] active:scale-95 shadow-[0_20px_50px_rgba(124,58,237,0.3)]">
          HEMEN BAŞLA <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </a>
      </section>

      {/* Profesyonel Kartlar (Glassmorphism) */}
      <section className="relative z-10 px-8 py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Calendar className="text-violet-400 w-8 h-8" />,
              title: "Haftalık Plan",
              desc: "Sektörünüze özel, her günü planlanmış 7 günlük profesyonel içerik takvimi."
            },
            {
              icon: <Video className="text-fuchsia-400 w-8 h-8" />,
              title: "Çekim Rehberi",
              desc: "Kamera açılarından ışıklandırmaya kadar detaylı yönetmen notları."
            },
            {
              icon: <BarChart3 className="text-indigo-400 w-8 h-8" />,
              title: "Zeki Analiz",
              desc: "Hangi içeriğin neden çalıştığını çözen ve sizi büyüten algoritma desteği."
            }
          ].map((feature, i) => (
            <div key={i} className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] transition-all hover:bg-white/[0.07] hover:border-violet-500/40">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-600/10 blur-[50px] group-hover:bg-violet-600/20 transition-all" />
              <div className="relative z-10">
                <div className="mb-6 p-4 inline-block bg-zinc-800/50 rounded-[1.5rem] border border-white/5 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 py-12 px-8 text-center">
        <div className="text-xl font-black italic tracking-tighter mb-4">VİA<span className="text-violet-500">.AI</span></div>
        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">© 2026 Tüm Hakları Saklıdır.</p>
      </footer>
    </main>
  );
}