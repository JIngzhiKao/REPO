"use client";
import React from "react";

export default function ProjectPage() {
  // 你的真實專案資料庫 (Data-Driven)
  const projects = [
    {
      id: "PRJ-01",
      name: "SPLICEISM STUDIO",
      status: "DEPLOYED",
      tech: "Next.js / UI & UX",
      description: "受到結構主義大師 Frank Gehry 啟蒙的室內設計工作室。以極簡的風格展現出專案的代表性。網頁包含專案介紹、服務流程與聯絡我們。",
      color: "var(--repo-green)",
      image: "/spliceismhomepage.png",
      url: "https://frankgarydesign.vercel.app/"
    },
    {
      id: "PRJ-02",
      name: "Ahova",
      status: "DEPLOYED",
      tech: "React / Backend Sync",
      description: "頂級蒸餾水機品牌。網頁功能涵蓋全方位產品展示，並與後臺聯動達成招聘、合作洽談等商業目標，為完整的產品品牌網站。",
      color: "var(--repo-blue)",
      image: "/ahovahomepage.png",
      url: "https://ahova-website.vercel.app/"
    },
    {
      id: "PRJ-03",
      name: "Coffee Aesthetic",
      status: "DEPLOYED",
      tech: "E-Commerce / Vercel",
      description: "精緻咖啡品牌數位店面。完美整合購物車系統、高質感產品介紹與無縫的消費者聯絡體驗。",
      color: "var(--repo-grey)",
      image: "/coffehomepage.png",
      url: "https://coffee-aesthetic.vercel.app/"
    },
    {
      id: "PRJ-04",
      name: "Splender",
      status: "DEPLOYED",
      tech: "Corporate / Web App",
      description: "傳統加工業數位轉型製作。網站涵蓋企業專業形象展示、人才招聘以及 B2B 商業互動入口。",
      color: "var(--repo-green)",
      image: "/splhomepage.png",
      url: "https://splender-website.vercel.app/"
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
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
        {projects.map((project, index) => (
          <a
            key={index}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col block border border-zinc-200 bg-white/20 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-zinc-900 hover:shadow-2xl hover:-translate-y-2"
          >
            {/* 封面圖片區 (特殊交互：灰階 -> 彩色解鎖 + 微放大) */}
            <div className="relative w-full h-[320px] overflow-hidden bg-zinc-100 border-b border-zinc-200">
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1 border border-zinc-200">
                <span className="font-mono-sys text-[10px] tracking-widest uppercase" style={{ color: project.color }}>
                  {project.status}
                </span>
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: project.color, boxShadow: `0 0 8px ${project.color}` }}
                ></div>
              </div>
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover object-top filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              {/* 掃描線陰影層 */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 group-hover:opacity-0 transition-opacity duration-500 z-10"></div>
            </div>

            {/* 數據面板區 (特殊交互：懸停提亮與文字變色) */}
            <div className="relative p-8 flex flex-col justify-between flex-1 bg-white/40 group-hover:bg-white/90 transition-colors duration-500">
              <div>
                <span className="font-mono-sys text-xs tracking-widest text-zinc-500 mb-4 block">
                  {project.id} // SYSTEM_LINK
                </span>
                <h2 className="text-3xl font-black text-zinc-900 mb-2 tracking-tight group-hover:text-[#38BDF8] transition-colors duration-300">
                  {project.name}
                </h2>
                <p className="font-mono-sys text-xs text-[#38BDF8] mb-6 font-bold tracking-wider">
                  {project.tech}
                </p>
                <p className="text-sm text-zinc-700 leading-relaxed font-medium">
                  {project.description}
                </p>
              </div>

              {/* 卡片底部操作區 */}
              <div className="mt-8 pt-4 border-t border-zinc-200/50 flex justify-between items-center">
                <span className="font-mono-sys text-xs font-bold text-zinc-900 group-hover:text-[#38BDF8] transition-colors">
                  ACCESS_SITE
                </span>
                <span className="text-xl font-bold transform group-hover:translate-x-2 transition-transform duration-300 text-zinc-900 group-hover:text-[#38BDF8]">
                  →
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}