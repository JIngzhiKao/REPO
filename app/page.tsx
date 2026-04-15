"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // 🛑 移除了寫死的 bg-[#030303]，改用動態品牌底色
    <main 
      className="relative w-full min-h-screen text-white flex flex-col overflow-hidden font-sans selection:bg-white/20"
      style={{ 
        // 讓底色變成「極暗的品牌主色」，而不是死黑
        backgroundColor: '#050505',
        backgroundImage: 'radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--logo-color-1) 15%, transparent), transparent 80%)'
      }}
    >
      
      {/* ====================================================
          🛑 品牌自訂色引擎 (Brand Color Engine) 🛑
          請務必將下面三個色碼換成你 repologo.jpg 的真實 Hex 碼！
          (如果你不知道怎麼吸色碼，可以用 imagecolorpicker.com 抓取)
         ==================================================== */}
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --logo-color-1: #5B21B6; /* 替換為你的 Logo 主色 (目前預設: 深紫) */
          --logo-color-2: #E11D48; /* 替換為你的 Logo 輔色 (目前預設: 亮粉) */
          --logo-color-3: #0EA5E9; /* 替換為你的 Logo 點綴色 (目前預設: 科技藍) */
        }
        
        /* 漸層文字引擎 */
        .brand-text-gradient {
          background: linear-gradient(135deg, var(--logo-color-1), var(--logo-color-2), var(--logo-color-3));
          -webkit-background-clip: text;
          color: transparent;
        }

        /* 按鈕與邊緣發光引擎 */
        .btn-glow {
          box-shadow: 0 0 30px color-mix(in srgb, var(--logo-color-1) 40%, transparent);
        }
        .btn-glow:hover {
          box-shadow: 0 0 50px color-mix(in srgb, var(--logo-color-2) 60%, transparent);
        }

        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
      `}} />

      {/* ====================================================
          背景巨型光暈：這次大幅強化了亮度和擴散範圍
         ==================================================== */}
      <div 
        className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[80vw] h-[60vh] max-w-[1000px] blur-[150px] rounded-[100%] pointer-events-none z-0 mix-blend-screen opacity-50"
        style={{ backgroundColor: 'var(--logo-color-1)' }}
      />
      <div 
        className="absolute top-[40%] left-[30%] w-[50vw] h-[40vw] max-w-[700px] blur-[120px] rounded-full pointer-events-none z-0 mix-blend-screen opacity-30"
        style={{ backgroundColor: 'var(--logo-color-2)' }}
      />
      <div 
        className="absolute top-[10%] left-[60%] w-[40vw] h-[40vw] max-w-[600px] blur-[120px] rounded-full pointer-events-none z-0 mix-blend-screen opacity-30"
        style={{ backgroundColor: 'var(--logo-color-3)' }}
      />

      {/* 科技網格紋理 (增加高級感) */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 10%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 10%, transparent 100%)'
        }}
      />

      {/* ====================================================
          頂部導覽列 (Header)
         ==================================================== */}
      <header className={`fixed top-0 left-0 w-full px-8 md:px-12 py-6 flex justify-between items-center z-50 transition-all duration-500 ${scrolled ? "bg-black/60 backdrop-blur-2xl border-b border-white/5" : "bg-transparent"}`}>
        
        {/* Logo 區塊 */}
        <div className="font-black text-2xl flex items-center gap-2 tracking-tighter">
          REPONEUR.
        </div>
        
        {/* 導航列 */}
        <nav className="hidden md:flex gap-12 text-[17px] font-serif tracking-wide text-zinc-300">
          {/* Hover 效果綁定 Logo 主色 */}
          {['Feature', 'Project', 'Pricing', 'About Us'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="transition-all duration-300 cursor-pointer hover:scale-105"
              style={{ transition: 'color 0.3s, text-shadow 0.3s' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--logo-color-1)';
                e.currentTarget.style.textShadow = '0 0 10px var(--logo-color-1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '';
                e.currentTarget.style.textShadow = '';
              }}
            >
              {item}
            </a>
          ))}
        </nav>
        
        {/* 右側按鈕 */}
        <div className="flex items-center">
          <button className="bg-white text-black px-7 py-3 rounded-full text-[15px] font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Book a Call
          </button>
        </div>
      </header>

      {/* ====================================================
          主視覺內容 (Hero Center)
         ==================================================== */}
      <section className="flex-1 flex flex-col items-center text-center justify-center px-4 relative z-10 pt-32 pb-48">
        
        <h1 className="text-[4rem] md:text-[6.5rem] lg:text-[8rem] font-medium tracking-tight leading-[1.05] mb-8 text-white animate-fade-in-up drop-shadow-2xl">
          極簡架構，<br />
          <span className="brand-text-gradient font-black">
            建構商業武器。
          </span>
        </h1>

        <p className="text-lg md:text-[22px] text-zinc-300 max-w-3xl leading-relaxed font-medium animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          專為新創打造。捨棄十幾萬的臃腫傳統開發，透過成熟模塊建置，用最合理的預算打造高資安的專屬數位資產。
        </p>

      </section>

      {/* ====================================================
          底部產品露臉 (Dashboard Peek)
         ==================================================== */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl h-[250px] bg-[#0A0A0A] border border-white/10 border-b-0 rounded-t-3xl translate-y-[30%] shadow-[0_-40px_80px_rgba(0,0,0,0.8)] z-20 flex justify-center pt-6 overflow-hidden">
         <div className="w-[85%] h-full border border-white/5 rounded-t-xl bg-white/[0.02] flex flex-col relative overflow-hidden">
            {/* 控制台頂部 */}
            <div className="w-full h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-black/20">
               <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
            </div>
            {/* 控制台內部 */}
            <div className="flex-1 p-6 flex gap-4">
               <div className="w-1/3 h-full bg-white/[0.02] rounded-lg border border-white/5"></div>
               <div className="w-2/3 h-full bg-white/[0.02] rounded-lg border border-white/5 relative">
                 {/* 面板內部光影：吃 Logo 主色 */}
                 <div 
                   className="absolute top-0 right-0 w-48 h-48 blur-[80px] opacity-30"
                   style={{ backgroundColor: 'var(--logo-color-1)' }}
                 ></div>
               </div>
            </div>
         </div>
         {/* 頂部邊緣光：吃 Logo 漸層色 */}
         <div 
           className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px]"
           style={{ background: 'linear-gradient(to right, transparent, var(--logo-color-1), var(--logo-color-2), transparent)' }}
         ></div>
      </div>

    </main>
  );
}