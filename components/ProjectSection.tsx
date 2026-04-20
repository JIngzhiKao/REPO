import React from "react";

// 🔴 專案資料矩陣 (完全獨立的資料源)
const PROJECT_DATA = [
  {
    id: 'PRJ-01',
    title: 'AHOVA 蒸餾系統',
    type: 'HARDWARE_DEV',
    spec: 'Tube-in-Tube / 304 SS',
    desc: '運用第一性原理重新定義硬體開發流程。從 CAD 概念建構到材料規格定義，打造純粹且高效的蒸餾水設備。'
  },
  {
    id: 'PRJ-02',
    title: 'PURGE PROTOCOL',
    type: 'SUPPLY_CHAIN',
    spec: 'ST15-ST29 WAREHOUSE',
    desc: '跨廠區大規模呆滯料清理專案。鎖定 W20 與 W25 廠區為首要突破口，優化物流節點與庫存周轉率。'
  },
  {
    id: 'PRJ-03',
    title: 'ARL-U SERIES',
    type: 'PROJECT_MGT',
    spec: 'AbeA / AbeI / ARSP',
    desc: '精準控管鋁件限制來源專案 (Aluminium Restricted Source Project) 矩陣，並修正特定硬體專案的 WIF 報告可視化層級。'
  }
];

export default function App() {
  return (
    <main className="relative w-full bg-[#f4f4f5] text-[#1a1a1a] font-sans min-h-screen">
      
      {/* 🔴 模塊專屬的樣式隔離 (確保在單獨檢視時不跑版) */}
      <style dangerouslySetInnerHTML={{__html: `
        .font-mono-sys { font-family: 'Courier New', Courier, monospace; }

        /* 野獸派儀表板 (Dashboard Panels) 的核心互動 */
        .industrial-panel {
          position: relative;
          border-top: 1px solid #94A3B8;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .industrial-panel:hover {
          border-color: #1a1a1a;
          background: rgba(255, 255, 255, 0.8);
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08);
        }
      `}} />

      <section id="project" className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-20">
        
        {/* 標題區塊 */}
        <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <p className="font-mono-sys text-zinc-600 text-sm tracking-[0.3em] mb-4">
              [ SEC.02.5 ] ASSET REGISTRY
            </p>
            <h2 className="text-5xl md:text-[5rem] font-black tracking-tighter uppercase text-[#1a1a1a] leading-tight">
              核心專案矩陣
            </h2>
          </div>
          <div className="font-mono-sys text-xs text-zinc-500 text-right">
            <p>TOTAL_RECORDS: {PROJECT_DATA.length}</p>
            <p className="text-[#38BDF8]">STATUS: SYNCED</p>
          </div>
        </div>

        {/* 專案列表區塊 */}
        <div className="flex flex-col gap-6">
          {PROJECT_DATA.map((project) => (
            <div 
              key={project.id} 
              className="industrial-panel group flex flex-col md:flex-row justify-between items-start md:items-stretch p-0 overflow-hidden cursor-crosshair"
            >
              
              {/* 區塊 1：左側 ID 與 型態 */}
              <div className="w-full md:w-1/4 bg-zinc-100/50 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-200 group-hover:bg-[#1a1a1a] transition-colors duration-300">
                <div className="font-mono-sys text-xs font-bold text-zinc-400 tracking-widest group-hover:text-zinc-500">
                  {project.id}
                </div>
                <div className="mt-8 md:mt-0 font-mono-sys text-sm tracking-wider text-[#38BDF8]">
                  [{project.type}]
                </div>
              </div>

              {/* 區塊 2：中間 核心資訊 */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                <h3 className="text-3xl font-black text-zinc-900 tracking-tight mb-4 group-hover:translate-x-2 transition-transform duration-300">
                  {project.title}
                </h3>
                <p className="text-base text-zinc-600 leading-relaxed max-w-md">
                  {project.desc}
                </p>
              </div>

              {/* 區塊 3：右側 規格標籤與行動呼籲 */}
              <div className="w-full md:w-1/4 p-6 md:p-8 flex flex-col justify-between items-start md:items-end bg-white/30 border-t md:border-t-0 md:border-l border-zinc-200">
                <div className="font-mono-sys text-[10px] text-zinc-500 uppercase px-3 py-1 border border-zinc-300 bg-white group-hover:border-[#34D399] group-hover:text-[#34D399] transition-colors">
                  {project.spec}
                </div>
                
                {/* 行動呼籲 (Call to Action) */}
                <div className="mt-8 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="font-mono-sys text-xs font-bold border-b-2 border-zinc-900 pb-1 flex items-center gap-2 hover:text-[#38BDF8] hover:border-[#38BDF8] transition-colors">
                    EXTRACT DATA 
                    <div className="w-2 h-2 bg-zinc-900 group-hover:bg-[#38BDF8] rounded-full animate-pulse transition-colors"></div>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>
    </main>
  );
}