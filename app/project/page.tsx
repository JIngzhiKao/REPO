"use client";
import React from "react";

export default function ProjectPage() {
  // 這裡是你專屬的科技感假數據 (Mock Data)
  // 未來你有真實專案時，只需在這裡替換文字即可
  const mockProjects = [
    {
      id: "PRJ-01",
      name: "PROJECT_ALPHA",
      status: "DEPLOYED",
      tech: "Next.js / Vercel",
      description: "極端輕量化的企業級展示系統，捨棄冗餘框架，實現毫秒級載入。",
      color: "var(--repo-green)"
    },
    {
      id: "PRJ-02",
      name: "SYSTEM_CORE",
      status: "IN_PROGRESS",
      tech: "React / Tailwind",
      description: "高轉換率的 B2B 數據儀表板，整合第三方資安防護模組。",
      color: "var(--repo-blue)"
    },
    {
      id: "PRJ-03",
      name: "NEXUS_GATEWAY",
      status: "AWAITING_INIT",
      tech: "Node.js / AWS",
      description: "去中心化 API 閘道器，提供防彈級的資料傳輸與負載平衡。",
      color: "var(--repo-grey)"
    },
    {
      id: "PRJ-04",
      name: "DATA_SYNAPSE",
      status: "DEPLOYED",
      tech: "Python / PostgreSQL",
      description: "自動化數據爬蟲與清洗管線，為機器學習模型提供純淨的訓練集。",
      color: "var(--repo-green)"
    }
  ];

  return (
    <main className="relative z-10 w-full min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center">
      
      {/* 頁面頭部 (Header) */}
      <div className="w-full mb-16 border-b border-zinc-200 pb-8">
        <p className="font-mono-sys text-zinc-600 text-sm tracking-[0.3em] mb-4">
          [ SEC.04 ] PROJECT ARCHIVES
        </p>
        <h1 className="text-5xl md:text-[5rem] font-black tracking-tighter uppercase text-[#1a1a1a] leading-tight">
          專案陣列
        </h1>
      </div>

      {/* 工業風專案矩陣 (Bento Grid) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {mockProjects.map((project, index) => (
          <div key={index} className="industrial-panel p-8 flex flex-col justify-between min-h-[300px] group">
            <div>
              {/* 卡片頂部狀態列 */}
              <div className="flex justify-between items-start mb-6">
                <span className="font-mono-sys text-xs tracking-widest text-zinc-500">
                  {project.id}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono-sys text-[10px] tracking-widest uppercase" style={{ color: project.color }}>
                    {project.status}
                  </span>
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: project.color, boxShadow: `0 0 8px ${project.color}` }}
                  ></div>
                </div>
              </div>
              
              {/* 專案標題與技術標籤 */}
              <h2 className="text-3xl font-black text-zinc-900 mb-2 tracking-tight group-hover:text-[#38BDF8] transition-colors">
                {project.name}
              </h2>
              <p className="font-mono-sys text-xs text-[#38BDF8] mb-6">
                {project.tech}
              </p>
              
              {/* 專案敘述 */}
              <p className="text-sm text-zinc-700 leading-relaxed font-medium">
                {project.description}
              </p>
            </div>

            {/* 卡片底部操作區 */}
            <div className="mt-8 pt-4 border-t border-zinc-200/50">
              <button className="font-mono-sys text-xs font-bold text-zinc-900 hover:text-[#38BDF8] transition-colors flex items-center gap-2">
                ACCESS_DATA <span className="text-lg">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}