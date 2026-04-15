"use client";
import React, { useEffect, useRef, useState } from "react";

// 定義 TextScramble 的佇列型別，解決 TS 報錯
interface QueueItem {
  from: string;
  to: string;
  start: number;
  end: number;
  char?: string;
}

export default function Home() {
  // 補齊所有 useRef 的 TypeScript 型別
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const scrambleRefs = useRef<(HTMLElement | null)[]>([]);
  const glitchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    // 1. 全局滑鼠位移追蹤 (加上 e: MouseEvent 型別)
    const handleMouseMove = (e: MouseEvent) => {
      const xAxis = window.innerWidth / 2 - e.clientX;
      const yAxis = window.innerHeight / 2 - e.clientY;
      const clampX = Math.max(-100, Math.min(100, xAxis));
      const clampY = Math.max(-100, Math.min(100, yAxis));

      document.documentElement.style.setProperty("--mouse-x", clampX.toString());
      document.documentElement.style.setProperty("--mouse-y", clampY.toString());
      document.documentElement.style.setProperty("--cursor-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 2. 磁性按鈕互動
    const btn = btnRef.current;
    const handleBtnMove = (e: MouseEvent) => {
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
    };
    const handleBtnLeave = () => {
      if (!btn) return;
      btn.style.transform = `translate(0px, 0px)`;
    };
    if (btn) {
      btn.addEventListener("mousemove", handleBtnMove);
      btn.addEventListener("mouseleave", handleBtnLeave);
    }

    // 3. 文字解碼干擾特效 (重構加入完整 TypeScript 定義)
    class TextScramble {
      el: HTMLElement;
      chars: string;
      queue: QueueItem[];
      frameRequest: number;
      frame: number;
      resolve: (value: void | PromiseLike<void>) => void;

      constructor(el: HTMLElement) {
        this.el = el;
        this.chars = "!<>-_\\/[]{}—=+*^?#________";
        this.update = this.update.bind(this);
        this.queue = [];
        this.frameRequest = 0;
        this.frame = 0;
        this.resolve = () => {};
      }
      setText(newText: string): Promise<void> {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise<void>((resolve) => (this.resolve = resolve));
        this.queue = [];
        for (let i = 0; i < length; i++) {
          const from = oldText[i] || "";
          const to = newText[i] || "";
          const start = Math.floor(Math.random() * 20);
          const end = start + Math.floor(Math.random() * 20);
          this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
      }
      update() {
        let output = "";
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
          let { from, to, start, end, char } = this.queue[i];
          if (this.frame >= end) {
            complete++;
            output += to;
          } else if (this.frame >= start) {
            if (!char || Math.random() < 0.28) {
              char = this.randomChar();
              this.queue[i].char = char;
            }
            output += char;
          } else {
            output += from;
          }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
          this.resolve();
        } else {
          this.frameRequest = requestAnimationFrame(this.update);
          this.frame++;
        }
      }
      randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
      }
    }

    // 4. 滾動視角觀察器 (加入 Element 轉型防報錯)
    const scrambleTargets = document.querySelectorAll('.scramble-target');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          if (!el.dataset.scrambled) {
            el.dataset.scrambled = "true";
            const text = el.getAttribute("data-text") || el.innerText;
            const fx = new TextScramble(el);
            el.innerText = "";
            fx.setText(text);
          }
        }
      });
    }, { threshold: 0.15 });

    scrambleTargets.forEach(target => observer.observe(target));

    setTimeout(() => {
      if (subtitleRef.current) {
        subtitleRef.current.classList.add("active");
      }
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (btn) {
        btn.removeEventListener("mousemove", handleBtnMove);
        btn.removeEventListener("mouseleave", handleBtnLeave);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <main className="relative w-full bg-[#f4f4f5] text-[#1a1a1a] font-sans overflow-x-hidden selection:bg-[#38BDF8]/30 pb-20">
      
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --repo-blue: #38BDF8;
          --repo-green: #34D399;
          --repo-grey: #94A3B8;
          --repo-dark: #1a1a1a;
          
          --mouse-x: 0;
          --mouse-y: 0;
          --cursor-x: 50vw;
          --cursor-y: 50vh;
        }

        .cursor-aura {
          position: fixed; top: 0; left: 0; width: 50vmax; height: 50vmax;
          border-radius: 50%;
          background: conic-gradient(from 0deg, var(--repo-blue), transparent, var(--repo-grey), transparent, var(--repo-blue));
          filter: blur(100px); opacity: 0.12; z-index: 0;
          transform: translate(calc(var(--cursor-x) - 50%), calc(var(--cursor-y) - 50%));
          pointer-events: none; transition: opacity 0.5s ease;
        }

        .grid-bg {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0;
          background-image: 
            linear-gradient(to right, rgba(26, 26, 26, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(26, 26, 26, 0.08) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(400px circle at var(--cursor-x) var(--cursor-y), black 20%, transparent 100%);
          -webkit-mask-image: radial-gradient(400px circle at var(--cursor-x) var(--cursor-y), black 20%, transparent 100%);
          pointer-events: none;
        }

        .hero-title-wrapper { position: relative; display: inline-block; }

        .hero-title {
          /* 🔴 將最大字體從 14rem 暴增到 18rem，極巨化核心視覺 */
          font-size: clamp(6rem, 20vw, 18rem); font-weight: 900; line-height: 1; letter-spacing: -0.06em;
          position: relative; cursor: crosshair; user-select: none; color: var(--repo-dark);
          text-shadow: 
            calc(var(--mouse-x) * 0.5px) calc(var(--mouse-y) * 0.5px) 0 rgba(56, 189, 248, 0.5),
            calc(var(--mouse-x) * -0.4px) calc(var(--mouse-y) * -0.6px) 0 rgba(52, 211, 153, 0.5),
            calc(var(--mouse-x) * -0.2px) calc(var(--mouse-y) * 0.8px) 0 rgba(148, 163, 184, 0.3);
          transition: text-shadow 0.1s ease-out; z-index: 2;
        }

        /* 拔除失控的偽元素，改用純 text-shadow 動畫保證絕不跑版 */
        .hero-title.is-glitching { 
          animation: glitch-anim 0.2s infinite; 
          color: transparent; 
          -webkit-text-stroke: 2px var(--repo-dark); 
        }

        @keyframes glitch-anim {
          0% { text-shadow: 4px 4px 0px var(--repo-blue), -4px -4px 0px var(--repo-green); }
          25% { text-shadow: -4px 4px 0px var(--repo-blue), 4px -4px 0px var(--repo-green); }
          50% { text-shadow: 4px -4px 0px var(--repo-blue), -4px 4px 0px var(--repo-green); }
          75% { text-shadow: -4px -4px 0px var(--repo-blue), 4px 4px 0px var(--repo-green); }
          100% { text-shadow: 4px 4px 0px var(--repo-blue), -4px -4px 0px var(--repo-green); }
        }

        .reveal-text { position: relative; display: inline-block; overflow: hidden; }
        .reveal-text::after {
          content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background-color: var(--repo-dark); transform-origin: right; transform: scaleX(1); transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1);
        }
        .reveal-text.active::after { transform-origin: left; transform: scaleX(0); }

        .nav-link-custom { mix-blend-mode: difference; color: white; }
        .crosshair { position: absolute; width: 20px; height: 20px; opacity: 0.3; z-index: 1; }
        .crosshair::before, .crosshair::after { content: ''; position: absolute; background: var(--repo-dark); }
        .crosshair::before { top: 9px; left: 0; width: 20px; height: 2px; }
        .crosshair::after { top: 0; left: 9px; width: 2px; height: 20px; }
        
        /* 回歸置中排版，將十字準星放在兩側平衡 */
        .ch-1 { top: 20%; left: 10%; }
        .ch-2 { bottom: 30%; right: 15%; }

        .magnetic-btn {
          position: relative; display: inline-flex; justify-content: center; align-items: center;
          padding: 1.2rem 3rem; border-radius: 999px; background: var(--repo-dark); color: white;
          font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s;
        }
        .magnetic-btn::before {
          content: ''; position: absolute; top: 50%; left: 50%; width: 150%; height: 150%;
          background: radial-gradient(circle, var(--repo-blue) 0%, transparent 70%);
          transform: translate(-50%, -50%) scale(0); transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
          z-index: 0; opacity: 0.5;
        }
        .magnetic-btn:hover { box-shadow: 0 10px 30px -10px var(--repo-blue); }
        .magnetic-btn:hover::before { transform: translate(-50%, -50%) scale(1); }
        .magnetic-btn span { position: relative; z-index: 1; }

        .ticker-container {
          position: fixed; bottom: 0; left: 0; width: 100%; overflow: hidden;
          background: var(--repo-dark); color: var(--repo-grey); padding: 0.6rem 0;
          font-family: monospace; font-size: 0.85rem; letter-spacing: 0.1em; z-index: 50;
        }
        .ticker-wrapper { display: flex; width: max-content; animation: ticker-scroll 30s linear infinite; }
        .ticker-item { padding: 0 2rem; display: flex; align-items: center; gap: 2rem; }
        .ticker-dot { width: 6px; height: 6px; background-color: var(--repo-green); border-radius: 50%; box-shadow: 0 0 8px var(--repo-green); }
        @keyframes ticker-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        .data-panel {
          background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(12px);
          border: 1px solid rgba(26, 26, 26, 0.1); transition: border-color 0.3s, transform 0.3s, background 0.3s, box-shadow 0.3s;
          position: relative; overflow: hidden;
        }
        .data-panel:hover {
          border-color: rgba(26, 26, 26, 0.8); background: rgba(255, 255, 255, 0.9);
          transform: translateY(-2px); box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05);
        }
        .dp-corner {
          position: absolute; width: 10px; height: 10px; border: 1px solid var(--repo-blue);
          opacity: 0; transition: opacity 0.3s;
        }
        .data-panel:hover .dp-corner { opacity: 1; }
        .dp-tl { top: 4px; left: 4px; border-right: none; border-bottom: none; }
        .dp-tr { top: 4px; right: 4px; border-left: none; border-bottom: none; }
        .dp-bl { bottom: 4px; left: 4px; border-right: none; border-top: none; }
        .dp-br { bottom: 4px; right: 4px; border-left: none; border-top: none; }
        .font-mono-sys { font-family: 'Courier New', Courier, monospace; }
        .outline-text { color: transparent; -webkit-text-stroke: 1px rgba(26,26,26,0.1); transition: -webkit-text-stroke 0.3s, color 0.3s; }
        .data-panel:hover .outline-text { -webkit-text-stroke: 1px rgba(26,26,26,0.3); color: rgba(26,26,26,0.05); }
      `}} />

      <div className="cursor-aura"></div>
      <div className="grid-bg"></div>

      <nav className="fixed top-0 left-0 w-full z-50 p-6 md:px-12 flex justify-between items-center pointer-events-none">
        <div className="font-black text-2xl tracking-tighter cursor-pointer nav-link-custom pointer-events-auto scramble-target" data-text="REPO.SYS">
          REPO.SYS
        </div>
        <div className="hidden md:flex gap-10 font-bold text-sm tracking-widest pointer-events-auto">
          {/* 🔴 精簡漏斗：只留下 HOME 與 CONTACT US */}
          {['HOME', 'CONTACT US'].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '')}`} className="hover:line-through transition-all nav-link-custom scramble-target" data-text={item}>
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* ====================================================
          第一頁 (Hero Section) - 🔴 回歸置中霸氣排版 🔴
         ==================================================== */}
      <section id="hero" className="relative z-10 w-full min-h-screen flex flex-col justify-center items-center text-center px-4 pt-32 pb-32">
        
        <div className="crosshair ch-1 hidden md:block"></div>
        <div className="crosshair ch-2 hidden md:block"></div>

        <div className="hero-title-wrapper mt-10 md:mt-0">
          <h1 
            className={`hero-title font-sans ${isGlitching ? 'is-glitching' : ''} scramble-target`} 
            data-text="REPO"
            onMouseEnter={() => {
              setIsGlitching(true);
              if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current);
              glitchTimeoutRef.current = setTimeout(() => setIsGlitching(false), 1000);
            }}
            onMouseLeave={() => {
              setIsGlitching(false);
              if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current);
            }}
          >
            REPO
          </h1>
        </div>
        
        {/* 🔴 副標題回歸置中，顏色加深為 zinc-800 確保辨識度 🔴 */}
        <div className="mt-4 md:mt-6 overflow-hidden flex justify-center w-full">
          <p ref={subtitleRef} className="text-xl md:text-3xl text-zinc-800 font-bold reveal-text tracking-widest text-center max-w-2xl px-4 py-2">
            極簡架構，建構商業武器。
          </p>
        </div>

        {/* 🔴 按鈕回歸置中 🔴 */}
        <div className="mt-16 z-20 flex justify-center w-full">
          <button className="magnetic-btn" ref={btnRef}>
            <span>INITIALIZE SEQUENCE</span>
          </button>
        </div>
      </section>

      {/* ====================================================
          第二頁 (About Us)
         ==================================================== */}
      <section id="aboutus" className="relative z-10 w-full min-h-screen max-w-7xl mx-auto px-6 md:px-12 py-32 border-t border-zinc-200">
        <div className="mb-16 md:mb-24">
          <p className="font-mono-sys text-zinc-600 text-xs tracking-[0.3em] mb-4 scramble-target" data-text="[ SEC.02 ] ORIGIN & DIRECTIVE">
            [ SEC.02 ] ORIGIN & DIRECTIVE
          </p>
          <h2 className="text-4xl md:text-[4rem] font-black tracking-tighter uppercase text-[#1a1a1a] leading-none mb-8 scramble-target" data-text="終結臃腫，回歸本質">
            終結臃腫，回歸本質
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start">
          <div className="text-zinc-800 font-medium text-lg leading-relaxed space-y-6">
            <p>我們見證了太多新創團隊與個人品牌，將大筆資金砸入傳統外包的黑洞，換來的卻是難以維護的龐大代碼、無止盡的資安漏洞、以及每個月高昂的伺服器費用。</p>
            <p><strong className="text-zinc-900 font-bold text-xl">REPO 的誕生只有一個目的：剔除所有不必要的開發浪費。</strong></p>
            <p>我們不寫多餘的代碼。我們以最高標準的工業級美學，搭配世界頂尖的第三方模塊，為你組裝真正能帶來商業轉換的數位資產。讓你的資金，精準命中目標。</p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="data-panel p-8">
              <div className="dp-corner dp-tl"></div><div className="dp-corner dp-tr"></div>
              <div className="dp-corner dp-bl"></div><div className="dp-corner dp-br"></div>
              <div className="font-mono-sys text-[10px] text-[#38BDF8] tracking-widest mb-2">TARGET_01</div>
              <h3 className="text-2xl font-black mb-2 text-zinc-900">極端輕量化</h3>
              <p className="text-sm text-zinc-700 leading-relaxed">捨棄傳統主機建置，完全基於無伺服器架構與模塊化串接，保證系統秒級載入。</p>
            </div>
            <div className="data-panel p-8">
              <div className="dp-corner dp-tl"></div><div className="dp-corner dp-tr"></div>
              <div className="dp-corner dp-bl"></div><div className="dp-corner dp-br"></div>
              <div className="font-mono-sys text-[10px] text-[#34D399] tracking-widest mb-2">TARGET_02</div>
              <h3 className="text-2xl font-black mb-2 text-zinc-900">防彈級營運</h3>
              <p className="text-sm text-zinc-700 leading-relaxed">將數據處理交由世界級平台加密。你不需要擔心駭客攻擊，只需專注於商業擴張。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          第三頁 (Protocol - Process)
         ==================================================== */}
      <section id="protocol" className="relative z-10 w-full min-h-screen max-w-7xl mx-auto px-6 md:px-12 py-32 border-t border-zinc-200">
        <div className="mb-20 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <p className="font-mono-sys text-zinc-600 text-xs tracking-[0.3em] mb-4 scramble-target" data-text="[ SEC.03 ] EXECUTION PROTOCOL">
              [ SEC.03 ] EXECUTION PROTOCOL
            </p>
            <h2 className="text-4xl md:text-[4rem] font-black tracking-tighter uppercase text-[#1a1a1a] leading-none scramble-target" data-text="標準化建置協議">
              標準化建置協議
            </h2>
          </div>
          <div className="font-mono-sys text-xs text-zinc-600 border border-zinc-300 px-3 py-1 bg-white/50">
            STATUS: AWAITING_INIT
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: '需求解構', sys: 'REQUIREMENT_PARSING', desc: '拆解你的商業目標，剔除無效的虛榮需求，規劃出極簡且致命的模塊架構。' },
            { step: '02', title: '視覺與模塊建置', sys: 'UI_&_MODULE_INTEGRATION', desc: '導入頂級工業美學排版，同時串接世界級高資安的第三方表單與資料處理服務。' },
            { step: '03', title: '壓力與環境測試', sys: 'STRESS_&_ENV_TESTING', desc: '進行全裝置響應式檢測，確保系統在任何網路環境與極端狀態下皆能穩定運行。' },
            { step: '04', title: '系統上線與交付', sys: 'SYSTEM_DEPLOYMENT', desc: '綁定獨立網域正式上線，交接輕量化營運權限，將數位資產完整移交。' }
          ].map((item, idx) => (
            <div key={idx} className="data-panel p-8 flex flex-col justify-between min-h-[320px] group">
              <div className="dp-corner dp-tl"></div><div className="dp-corner dp-tr"></div>
              <div className="dp-corner dp-bl"></div><div className="dp-corner dp-br"></div>
              <div className="relative mb-12">
                <div className="font-mono-sys text-[10px] text-zinc-600 tracking-widest mb-4">PHASE {item.step}</div>
                <div className="absolute -top-6 -right-4 text-7xl font-black outline-text select-none">{item.step}</div>
                <h3 className="text-xl font-black text-zinc-900 tracking-tight">{item.title}</h3>
                <p className="font-mono-sys text-[9px] text-[#38BDF8] mt-1 break-words">{item.sys}</p>
              </div>
              <div><p className="text-sm text-zinc-800 font-medium leading-relaxed">{item.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================
          固定底部系統輪播列
         ==================================================== */}
      <div className="ticker-container">
        <div className="ticker-wrapper">
          <div className="ticker-item">
            <span>SYS.STATUS: ONLINE</span><div className="ticker-dot"></div>
            <span>LIGHTWEIGHT ARCHITECTURE DEPLOYED</span><div className="ticker-dot"></div>
            <span>PROTOCOL: BULLETPROOF</span><div className="ticker-dot"></div>
            <span>FRAMEWORK: REPO_V2.0</span><div className="ticker-dot"></div>
            <span>DATA_STREAM: SECURE</span><div className="ticker-dot"></div>
          </div>
          <div className="ticker-item">
            <span>SYS.STATUS: ONLINE</span><div className="ticker-dot"></div>
            <span>LIGHTWEIGHT ARCHITECTURE DEPLOYED</span><div className="ticker-dot"></div>
            <span>PROTOCOL: BULLETPROOF</span><div className="ticker-dot"></div>
            <span>FRAMEWORK: REPO_V2.0</span><div className="ticker-dot"></div>
            <span>DATA_STREAM: SECURE</span><div className="ticker-dot"></div>
          </div>
        </div>
      </div>
    </main>
  );
}