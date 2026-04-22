"use client";
import React, { useEffect, useRef } from "react";

export default function Home() {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const repoTextRef = useRef<HTMLDivElement | null>(null); // 新增：用於觸發點擊能量波的 Ref

  useEffect(() => {
    // 磁性按鈕互動邏輯
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

    // 副標題滑動浮現
    setTimeout(() => {
      if (subtitleRef.current) {
        subtitleRef.current.classList.add("active");
      }
    }, 1000);

    return () => {
      if (btn) {
        btn.removeEventListener("mousemove", handleBtnMove);
        btn.removeEventListener("mouseleave", handleBtnLeave);
      }
    };
  }, []);

  // 處理大字點擊的能量波特效
  const handleRepoClick = () => {
    if (repoTextRef.current) {
      repoTextRef.current.classList.remove("clicked");
      void repoTextRef.current.offsetWidth; // 觸發重繪以重複播放動畫
      repoTextRef.current.classList.add("clicked");
    }
  };

  return (
    <main className="relative w-full z-10 flex flex-col items-center">
      {/* 🔴 注入 Proposal A 互動進化版：磁性收合與點擊爆發 CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .hero-repo-container {
          position: relative;
          display: inline-block;
          font-size: clamp(4rem, 15vw, 8.5rem); 
          font-weight: 900;
          color: #1a1a1a;
          letter-spacing: -0.05em;
          text-transform: uppercase;
          line-height: 1;
          cursor: pointer;
          user-select: none;
          transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hero-layer {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease;
          pointer-events: none;
        }

        /* 粉彩馬卡龍色系 3D 圖層 */
        .hero-layer-blue {
          color: #8cc6e7; 
          transform: translate(-10px, 8px);
          z-index: -1;
          opacity: 0.9;
        }
        .hero-layer-green {
          color: #a8d5b2; 
          transform: translate(8px, -12px);
          z-index: -2;
          opacity: 0.9;
        }
        .hero-layer-grey {
          color: #b0b0b0; 
          transform: translate(16px, 12px);
          z-index: -3;
          opacity: 0.9;
        }

        /* Hover: 磁性歸零收合 */
        .hero-repo-container:hover .hero-layer {
          transform: translate(0px, 0px);
        }

        /* Active: 物理下壓與能量炸開 */
        .hero-repo-container:active {
          transform: scale(0.96); 
        }
        .hero-repo-container:active .hero-layer-blue {
          transform: translate(-20px, 16px) !important;
          opacity: 1;
          transition: transform 0.1s ease-out; 
        }
        .hero-repo-container:active .hero-layer-green {
          transform: translate(16px, -24px) !important;
          opacity: 1;
          transition: transform 0.1s ease-out;
        }
        .hero-repo-container:active .hero-layer-grey {
          transform: translate(32px, 24px) !important;
          opacity: 1;
          transition: transform 0.1s ease-out;
        }

        /* 衝擊能量波 */
        .hero-shockwave {
          position: absolute;
          top: 50%; left: 50%;
          width: 0; height: 0;
          border: 2px solid rgba(140, 198, 231, 0.8);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          pointer-events: none;
          z-index: -4;
        }
        .hero-repo-container.clicked .hero-shockwave {
          animation: repo-burst 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes repo-burst {
          0% { width: 50px; height: 50px; opacity: 1; border-width: 10px; }
          100% { width: 500px; height: 500px; opacity: 0; border-width: 1px; }
        }
      `}} />

      {/* ====================================================
         [ SEC.01 ] HERO SECTION
         ==================================================== */}
      <section id="home" className="relative z-10 w-full min-h-[100svh] flex flex-col justify-between items-center text-center px-4 pt-[20vh] pb-[12vh]">
        <div className="crosshair ch-1 hidden md:block"></div>
        <div className="crosshair ch-2 hidden md:block"></div>

        <div className="flex-1 flex flex-col justify-center w-full">
          <div className="hero-title-wrapper select-none">
            
            {/* 🔴 進階互動大字容器 */}
            <div 
              className="hero-repo-container" 
              ref={repoTextRef}
              onMouseDown={handleRepoClick}
            >
              REPO
              <div className="hero-layer hero-layer-blue">REPO</div>
              <div className="hero-layer hero-layer-green">REPO</div>
              <div className="hero-layer hero-layer-grey">REPO</div>
              <div className="hero-shockwave"></div>
            </div>

          </div>
          
          <div className="mt-6 overflow-hidden flex justify-center w-full">
            <p ref={subtitleRef} className="text-[10px] md:text-[11px] text-zinc-500 font-bold reveal-text tracking-[0.5em] text-center px-4 py-2 uppercase opacity-60">
              極簡架構，建構商業武器。
            </p>
          </div>
        </div>

        <div className="z-20 w-full flex justify-center pb-8">
          <button 
            className="magnetic-btn" 
            ref={btnRef}
            onClick={() => window.location.href = '/contactus'}
          >
            <span>INITIALIZE SEQUENCE</span>
          </button>
        </div>
      </section>

      {/* ====================================================
         [ SEC.02 ] ORIGIN & DIRECTIVE (LOCKED 100%)
         ==================================================== */}
      <section id="origin" className="relative z-10 w-full min-h-screen max-w-7xl mx-auto px-6 md:px-12 py-32 border-t border-zinc-200">
        <div className="mb-20">
          <p className="font-mono-sys text-zinc-600 text-sm tracking-[0.3em] mb-4">
            [ SEC.02 ] ORIGIN & DIRECTIVE
          </p>
          <h2 className="text-5xl md:text-[5rem] font-black tracking-tighter uppercase text-[#1a1a1a] leading-tight mb-12">
            終結臃腫，回歸本質
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-7 text-zinc-800 font-medium text-xl leading-loose space-y-8 pr-12">
            <p>我們見證了太多新創團隊與個人品牌，將大筆資金砸入傳統外包的黑洞，換來的卻是難以維護的龐大代碼、無止盡的資安漏洞、以及每個月高昂的伺服器費用。</p>
            <p><strong className="text-zinc-900 font-black text-2xl border-l-4 border-zinc-900 pl-6">REPO 的誕生只有一個目的：剔除所有不必要的開發浪費。</strong></p>
            <p>我們不寫多餘的代碼。我們以最高標準的工業級美學，搭配世界頂尖的第三方模塊，為你組裝真正能帶來商業轉換的數位資產。讓你的資金，精準命中目標。</p>
          </div>

          <div className="md:col-span-5 flex flex-col gap-0 border border-zinc-300 panel-data-flow">
            <div className="data-stream-item bg-white/40">
              <div className="data-stream-marker bg-[#38BDF8]"></div>
              <div>
                <div className="font-mono-sys text-xs text-[#38BDF8] tracking-widest mb-1">TARGET_01</div>
                <h3 className="text-2xl font-black mb-1 text-zinc-900">極端輕量化</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  捨棄傳統主機建置，完全基於無伺服器架構與模塊化串接，保證系統秒級載入。
                </p>
              </div>
            </div>
            
            <div className="data-stream-item bg-zinc-100/40 border-b-0">
              <div className="data-stream-marker bg-[#34D399]"></div>
              <div>
                <div className="font-mono-sys text-xs text-[#34D399] tracking-widest mb-1">TARGET_02</div>
                <h3 className="text-2xl font-black mb-1 text-zinc-900">防彈級營運</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  將數據處理交由世界級平台加密。你不需要擔心駭客攻擊，只需專注於商業擴張。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
         [ SEC.03 ] EXECUTION PROTOCOL (LOCKED 100%)
         ==================================================== */}
      <section id="protocol" className="relative z-10 w-full min-h-screen max-w-7xl mx-auto px-6 md:px-12 py-32 border-t border-zinc-200">
        <div className="mb-20 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <p className="font-mono-sys text-zinc-600 text-sm tracking-[0.3em] mb-4">
              [ SEC.03 ] EXECUTION PROTOCOL
            </p>
            <h2 className="text-5xl md:text-[5rem] font-black tracking-tighter uppercase text-[#1a1a1a] leading-tight">
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
    </main>
  );
}