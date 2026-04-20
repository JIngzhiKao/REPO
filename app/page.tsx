"use client";
import React, { useEffect, useRef, useState } from "react";

interface QueueItem {
  from: string;
  to: string;
  start: number;
  end: number;
  char?: string;
}

export default function Home() {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const scrambleRefs = useRef<(HTMLElement | null)[]>([]);
  
  const [isScanning, setIsScanning] = useState(false);

  // 🔴 導航點擊：保留掃描特效，並改為真實路由跳轉
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();

    // 觸發雷射掃描作為過場特效
    setIsScanning(true);
    
    // 延遲 800ms（等待特效跑完）後執行真正的頁面跳轉
    setTimeout(() => {
      setIsScanning(false);
      
      if (path === 'home' || path === '/') {
        // 若在首頁點擊 HOME，平滑滾動至頂部
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // 導向你剛剛建立的 /project, /pricing, /contactus 等頁面
        window.location.href = `/${path}`;
      }
    }, 800);
  };

  useEffect(() => {
    // 1. 全局滑鼠位移追蹤
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

    // 3. 文字解碼干擾特效
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

    // 4. 滾動視角觀察器 ( cascade 亂碼解碼 )
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
        html { scroll-behavior: smooth; }

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

        /* 背景網格透明度降低至 0.04，減少視覺噪聲 */
        .grid-bg {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0;
          background-image: 
            linear-gradient(to right, rgba(26, 26, 26, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(26, 26, 26, 0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(400px circle at var(--cursor-x) var(--cursor-y), black 20%, transparent 100%);
          -webkit-mask-image: radial-gradient(400px circle at var(--cursor-x) var(--cursor-y), black 20%, transparent 100%);
          pointer-events: none;
        }

        .hero-title-wrapper { position: relative; display: inline-block; }

        .hero-title {
          font-size: clamp(5rem, 16vw, 15rem); font-weight: 900; line-height: 1; letter-spacing: -0.06em;
          position: relative; cursor: crosshair; user-select: none; color: var(--repo-dark);
          text-shadow: 
            calc(var(--mouse-x) * 0.5px) calc(var(--mouse-y) * 0.5px) 0 rgba(56, 189, 248, 0.5),
            calc(var(--mouse-x) * -0.4px) calc(var(--mouse-y) * -0.6px) 0 rgba(52, 211, 153, 0.5),
            calc(var(--mouse-x) * -0.2px) calc(var(--mouse-y) * 0.8px) 0 rgba(148, 163, 184, 0.3);
          transition: text-shadow 0.2s ease-out, transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), letter-spacing 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          z-index: 2;
        }

        .hero-title:hover {
          transform: scale(1.02);
          letter-spacing: -0.03em;
        }

        .reveal-text { position: relative; display: inline-block; overflow: hidden; }
        .reveal-text::after {
          content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background-color: var(--repo-dark); transform-origin: right; transform: scaleX(1); transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1);
        }
        .reveal-text.active::after { transform-origin: left; transform: scaleX(0); }

        .nav-link-custom { 
          color: var(--repo-grey); 
          transition: color 0.3s ease, transform 0.1s ease; 
        }
        .nav-link-custom:hover { 
          color: var(--repo-blue); 
        }
        .nav-link-custom:active {
          transform: scale(0.95);
        }
        
        .crosshair { position: absolute; width: 20px; height: 20px; opacity: 0.3; z-index: 1; }
        .crosshair::before, .crosshair::after { content: ''; position: absolute; background: var(--repo-dark); }
        .crosshair::before { top: 9px; left: 0; width: 20px; height: 2px; }
        .crosshair::after { top: 0; left: 9px; width: 2px; height: 20px; }
        
        .ch-1 { top: 15%; left: 5%; }
        .ch-2 { bottom: 25%; right: 5%; }

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
        .magnetic-btn span { position: relative; z-index: 1; font-size: 0.8rem; letter-spacing: 0.15em; }

        .ticker-container {
          position: fixed; bottom: 0; left: 0; width: 100%; overflow: hidden;
          background: var(--repo-dark); color: var(--repo-grey); padding: 0.6rem 0;
          font-family: monospace; font-size: 0.85rem; letter-spacing: 0.1em; z-index: 50;
        }
        .ticker-wrapper { display: flex; width: max-content; animation: ticker-scroll 30s linear infinite; }
        .ticker-item { padding: 0 2rem; display: flex; align-items: center; gap: 2rem; }
        .ticker-dot { width: 6px; height: 6px; background-color: var(--repo-green); border-radius: 50%; box-shadow: 0 0 8px var(--repo-green); }
        @keyframes ticker-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        .industrial-panel {
          position: relative;
          border-top: 1px solid var(--repo-grey);
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .industrial-panel:hover {
          border-color: var(--repo-dark);
          background: rgba(255, 255, 255, 0.8);
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08);
        }
        .panel-data-flow {
          position: relative;
          overflow: hidden;
        }
        .data-stream-item {
          display: flex; gap: 1rem; align-items: flex-start;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(26, 26, 26, 0.1);
        }
        .data-stream-marker {
          width: 8px; height: 8px; border-radius: 50%; margin-top: 4px;
        }
        .font-mono-sys { font-family: 'Courier New', Courier, monospace; }

        .process-flow-grid {
          position: relative;
          padding-top: 2rem;
        }
        .process-flow-connector {
          position: absolute; top: 0; left: 0; width: 100%; height: 1px;
          background: rgba(26, 26, 26, 0.1);
        }
        .process-step {
          position: relative;
          padding: 2rem;
          transition: all 0.3s;
        }
        .process-step:hover {
          background: white;
          box-shadow: 0 10px 30px -5px rgba(0,0,0,0.05);
        }
        .process-watermark {
          position: absolute; top: 1rem; right: 1rem;
          font-family: 'Courier New', monospace;
          font-size: 5rem; font-weight: 100;
          color: transparent;
          -webkit-text-stroke: 1px rgba(26, 26, 26, 0.08);
          opacity: 1; transition: opacity 0.3s;
        }
        .process-step:hover .process-watermark {
          -webkit-text-stroke: 1px rgba(26, 26, 26, 0.3);
        }

        .scanline-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          pointer-events: none; z-index: 100; overflow: hidden;
          opacity: 0; transition: opacity 0.2s;
        }
        .scanline-overlay.active { opacity: 1; }
        .scan-beam {
          width: 100%; height: 3px; background: var(--repo-blue);
          box-shadow: 0 0 25px 5px var(--repo-blue);
          transform: translateY(-10vh);
        }
        .scanline-overlay.active .scan-beam {
          animation: scan-sweep 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes scan-sweep {
          0% { transform: translateY(-10vh); }
          100% { transform: translateY(110vh); }
        }
      `}} />

      {/* 掃描遮罩 */}
      <div className={`scanline-overlay ${isScanning ? 'active' : ''}`}>
        <div className="scan-beam"></div>
      </div>

      <div className="cursor-aura"></div>
      <div className="grid-bg"></div>

      {/* 導覽列 */}
      <nav className="fixed top-0 left-0 w-full z-50 p-6 md:px-12 flex justify-between items-center pointer-events-none">
        <a 
          href="/"
          onClick={(e) => handleNavClick(e, 'home')}
          className="font-black text-3xl tracking-tighter cursor-pointer text-zinc-900 pointer-events-auto block scramble-target" 
          data-text="REPO.SYS"
        >
          REPO.SYS
        </a>
        <div className="hidden md:flex gap-10 font-bold text-lg tracking-widest pointer-events-auto">
          {['HOME', 'PROJECT', 'PRICING', 'Contact US'].map((item) => {
            const path = item.toLowerCase().replace(' ', '');
            const targetHref = path === 'home' ? '/' : `/${path}`;
            return (
              <a 
                key={item} 
                href={targetHref} 
                onClick={(e) => handleNavClick(e, path)}
                className="nav-link-custom inline-block scramble-target" 
                data-text={item}
              >
                {item}
              </a>
            );
          })}
        </div>
      </nav>

      {/* ====================================================
         第一頁 (Hero Section)
         ==================================================== */}
      <section id="home" className="relative z-10 w-full min-h-[100svh] flex flex-col justify-between items-center text-center px-4 pt-[20vh] pb-[12vh]">
        <div className="crosshair ch-1 hidden md:block"></div>
        <div className="crosshair ch-2 hidden md:block"></div>

        <div className="flex-1 flex flex-col justify-center w-full">
          <div className="hero-title-wrapper">
            <h1 className="hero-title font-sans scramble-target" data-text="REPO">
              REPO
            </h1>
          </div>
          
          <div className="mt-8 md:mt-12 overflow-hidden flex justify-center w-full">
            <p ref={subtitleRef} className="text-base md:text-lg text-zinc-700 font-bold reveal-text tracking-[0.5em] text-center px-4 py-2 uppercase">
              極簡架構，建構商業武器。
            </p>
          </div>
        </div>

        <div className="z-20 w-full flex justify-center pb-8">
          <button className="magnetic-btn" ref={btnRef}>
            <span>INITIALIZE SEQUENCE</span>
          </button>
        </div>
      </section>

      {/* ====================================================
         第二頁 (Contact Us - Origin & Directive)
         ==================================================== */}
      <section id="contactus" className="relative z-10 w-full min-h-screen max-w-7xl mx-auto px-6 md:px-12 py-32 border-t border-zinc-200">
        <div className="mb-20">
          <p className="font-mono-sys text-zinc-600 text-sm tracking-[0.3em] mb-4 scramble-target" data-text="[ SEC.02 ] ORIGIN & DIRECTIVE">
            [ SEC.02 ] ORIGIN & DIRECTIVE
          </p>
          <h2 className="text-5xl md:text-[5rem] font-black tracking-tighter uppercase text-[#1a1a1a] leading-tight mb-12 scramble-target" data-text="終結臃腫，回歸本質">
            終結臃腫，回歸本質
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* 左側宣言 */}
          <div className="md:col-span-7 text-zinc-800 font-medium text-xl leading-loose space-y-8 pr-12">
            <p>我們見證了太多新創團隊與個人品牌，將大筆資金砸入傳統外包的黑洞，換來的卻是難以維護的龐大代碼、無止盡的資安漏洞、以及每個月高昂的伺服器費用。</p>
            <p><strong className="text-zinc-900 font-black text-2xl border-l-4 border-zinc-900 pl-6">REPO 的誕生只有一個目的：剔除所有不必要的開發浪費。</strong></p>
            <p>我們不寫多餘的代碼。我們以最高標準的工業級美學，搭配世界頂尖的第三方模塊，為你組裝真正能帶來商業轉換的數位資產。讓你的資金，精準命中目標。</p>
          </div>

          {/* 右側：數據儀表板敘述 */}
          <div className="md:col-span-5 flex flex-col gap-0 border border-zinc-300 panel-data-flow">
            <div className="data-stream-item bg-white/40">
              <div className="data-stream-marker bg-[#38BDF8]"></div>
              <div>
                <div className="font-mono-sys text-xs text-[#38BDF8] tracking-widest mb-1">TARGET_01</div>
                <h3 className="text-2xl font-black mb-1 text-zinc-900">極端輕量化</h3>
                <p className="text-sm text-zinc-600 leading-relaxed scramble-target" data-text="捨棄傳統主機建置，完全基於無伺服器架構與模塊化串接，保證系統秒級載入。">
                  捨棄傳統主機建置，完全基於無伺服器架構與模塊化串接，保證系統秒級載入。
                </p>
              </div>
            </div>
            
            <div className="data-stream-item bg-zinc-100/40 border-b-0">
              <div className="data-stream-marker bg-[#34D399]"></div>
              <div>
                <div className="font-mono-sys text-xs text-[#34D399] tracking-widest mb-1">TARGET_02</div>
                <h3 className="text-2xl font-black mb-1 text-zinc-900">防彈級營運</h3>
                <p className="text-sm text-zinc-600 leading-relaxed scramble-target" data-text="將數據處理交由世界級平台加密。你不需要擔心駭客攻擊，只需專注於商業擴張。">
                  將數據處理交由世界級平台加密。你不需要擔心駭客攻擊，只需專注於商業擴張。
                </p>
              </div>
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
            <p className="font-mono-sys text-zinc-600 text-sm tracking-[0.3em] mb-4 scramble-target" data-text="[ SEC.03 ] EXECUTION PROTOCOL">
              [ SEC.03 ] EXECUTION PROTOCOL
            </p>
            <h2 className="text-5xl md:text-[5rem] font-black tracking-tighter uppercase text-[#1a1a1a] leading-tight scramble-target" data-text="標準化建置協議">
              標準化建置協議
            </h2>
          </div>
          <div className="font-mono-sys text-sm text-zinc-600 border border-zinc-300 px-4 py-2 bg-white/50">
            STATUS: AWAITING_INIT
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 process-flow-grid border border-zinc-200 bg-white/20">
          {[
            { step: '01', title: '需求解構', sys: 'REQUIREMENT_PARSING', desc: '拆解你的商業目標，剔除無效的虛榮需求，規劃出極簡且致命的模塊架構。' },
            { step: '02', title: '視覺與模塊建置', sys: 'UI_&_MODULE_INTEGRATION', desc: '導入頂級工業美學排版，同時串接世界級高資安的第三方表單與資料處理服務。' },
            { step: '03', title: '壓力與環境測試', sys: 'STRESS_&_ENV_TESTING', desc: '進行全裝置響應式檢測，確保系統在任何網路環境與極端狀態下皆能穩定運行。' },
            { step: '04', title: '系統上線與交付', sys: 'SYSTEM_DEPLOYMENT', desc: '綁定獨立網域正式上線，交接輕量化營運權限，將數位資產完整移交。' }
          ].map((item, idx) => (
            <div key={idx} className="process-step flex flex-col justify-between h-[360px] group border-zinc-200 last:border-b-0 md:border-b md:[&:nth-child(2)]:border-b lg:border-r lg:border-b-0 lg:last:border-r-0">
              <div className="process-watermark select-none">{item.step}</div>
              <div className="relative mb-12 z-10">
                <div className="font-mono-sys text-xs text-zinc-500 tracking-widest mb-4">PHASE {item.step}</div>
                <h3 className="text-2xl font-black text-zinc-900 tracking-tight">{item.title}</h3>
                <p className="font-mono-sys text-[10px] text-[#38BDF8] mt-2 break-words">{item.sys}</p>
              </div>
              <div className="z-10"><p className="text-base text-zinc-800 font-medium leading-relaxed">{item.desc}</p></div>
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