"use client";

import React, { useRef, useState } from "react";
import { Check, ArrowRight, Terminal, Cpu, ChevronDown } from "lucide-react";

// --- 磁性按鈕組件 (維持 REPO 標誌性互動) ---
const MagneticButton = ({ 
  children, 
  primaryColor 
}: { 
  children: React.ReactNode; 
  primaryColor: string 
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative px-8 py-4 rounded-xl text-white font-bold tracking-widest uppercase overflow-hidden transition-all duration-300 w-full"
      style={{
        backgroundColor: "#1a1a1a",
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <div 
        className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-500"
        style={{ backgroundColor: primaryColor }}
      />
      <span className="relative z-10 flex justify-center items-center gap-2 text-sm">
        {children}
      </span>
    </button>
  );
};

// --- 伺服器刀鋒面板組件 (Accordion Item) ---
const ServerBlade = ({ plan, isOpen, onToggle }: { plan: any, isOpen: boolean, onToggle: () => void }) => {
  // 狀態管理：維護方案選擇 (standalone: 單次, monthly: 月繳, annual: 年繳)
  const [maintenanceType, setMaintenanceType] = useState<'standalone' | 'monthly' | 'annual'>('monthly');
  const activeMaintenance = plan.maintenance[maintenanceType];

  return (
    <div className="w-full flex flex-col border-b border-zinc-200/80 group">
      {/* 面板標題區 (可點擊) */}
      <div 
        onClick={onToggle}
        className="relative w-full flex flex-col md:flex-row items-start md:items-center justify-between py-8 md:py-10 px-4 md:px-8 cursor-pointer transition-all duration-300 hover:bg-zinc-50/50 active:scale-[0.99] overflow-hidden"
      >
        {/* 左側高亮指示條 */}
        <div 
          className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}
          style={{ backgroundColor: plan.color }}
        />

        <div className="flex flex-col md:flex-row md:items-center gap-6 w-full">
          {/* 狀態與圖示 */}
          <div className="flex items-center gap-4 w-48 shrink-0">
            <div 
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-500 ${isOpen ? 'bg-[#1a1a1a] text-white' : 'bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200'}`}
            >
              {plan.icon}
            </div>
            <div>
              <div className="font-mono text-[10px] text-zinc-400 tracking-widest mb-1">{plan.id}</div>
              <div className={`text-xs font-bold tracking-wider uppercase transition-colors duration-300 ${isOpen ? '' : 'text-zinc-500'}`} style={{ color: isOpen ? plan.color : undefined }}>
                {isOpen ? 'ACTIVE' : 'STANDBY'}
              </div>
            </div>
          </div>

          {/* 方案名稱 */}
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-black text-[#1a1a1a] tracking-tight">{plan.title}</h2>
            <p className="text-sm text-zinc-500 font-mono tracking-widest mt-1 uppercase">{plan.subtitle}</p>
          </div>

          {/* 方案基礎定價與展開箭頭 */}
          <div className="flex items-center justify-between w-full md:w-auto gap-8 mt-4 md:mt-0">
            <div className="text-left md:text-right">
              <div className="flex items-baseline gap-1 md:justify-end">
                <span className="text-sm font-bold text-zinc-400">NT$</span>
                <span className="text-4xl font-black text-[#1a1a1a] tracking-tighter">{plan.basePrice}</span>
              </div>
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mt-1">/ Deployment (建置費)</div>
            </div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-500 ${isOpen ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white rotate-180' : 'border-zinc-300 text-zinc-400 group-hover:border-zinc-400'}`}>
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* 面板展開內容區 (CSS Grid 絲滑動畫) */}
      <div 
        className="grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="p-4 md:p-8 pt-0 md:pt-0 bg-white/30 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 border-t border-zinc-100 pt-8 pl-4 md:pl-8 border-l-2" style={{ borderLeftColor: plan.color }}>
              
              {/* 左側：基礎建設功能清單 */}
              <div className="flex-1">
                <h4 className="font-mono text-xs font-bold tracking-widest text-zinc-400 uppercase mb-6">System Specifications (基礎建置)</h4>
                <ul className="space-y-4">
                  {plan.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-600 font-medium">
                      <Check size={16} className="shrink-0 mt-0.5" style={{ color: plan.color }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 右側：維護方案選擇器 (Maintenance Protocol) */}
              <div className="lg:w-[45%] flex flex-col justify-between bg-zinc-50/80 p-6 md:p-8 rounded-2xl border border-zinc-100">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-mono text-xs font-bold tracking-widest text-zinc-400 uppercase">Maintenance Protocol</h4>
                  </div>
                  
                  {/* 選項切換按鈕 (Tabs) */}
                  <div className="flex bg-zinc-200/60 p-1 rounded-lg mb-6">
                    {(['standalone', 'monthly', 'annual'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setMaintenanceType(type)}
                        className={`flex-1 py-2 text-[11px] font-bold tracking-widest uppercase rounded-md transition-all duration-300 ${
                          maintenanceType === type 
                            ? 'bg-white shadow-sm text-[#1a1a1a]' 
                            : 'text-zinc-400 hover:text-zinc-600'
                        }`}
                      >
                        {type === 'standalone' ? '單次交付' : type === 'monthly' ? '月繳' : '年繳'}
                      </button>
                    ))}
                  </div>

                  {/* 動態顯示價格與說明 */}
                  <div className="flex items-baseline gap-2 mb-2">
                    {maintenanceType === 'annual' ? (
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg text-zinc-400 line-through decoration-zinc-400/60 decoration-2 font-medium">NT${activeMaintenance.originalMonthly}</span>
                          <span className="text-3xl font-black text-[#1a1a1a] tracking-tighter">NT${activeMaintenance.equivalentMonthly}</span>
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">/ {activeMaintenance.period}</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="text-3xl font-black text-[#1a1a1a] tracking-tighter">
                          {maintenanceType === 'standalone' ? 'NT$0' : `NT$${activeMaintenance.price}`}
                        </span>
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">/ {activeMaintenance.period}</span>
                      </>
                    )}
                  </div>
                  
                  <p className="text-sm text-zinc-500 font-medium min-h-[3rem] mt-3 leading-relaxed">
                    {activeMaintenance.desc}
                  </p>

                  {/* 年繳專屬高光標籤 */}
                  {maintenanceType === 'annual' && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#1a1a1a] text-white text-[10px] font-mono tracking-widest shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: plan.color }}></span>
                      每月現省 NT${activeMaintenance.monthlySaving} (1 MONTH FREE)
                    </div>
                  )}
                </div>
                
                <div className="mt-8">
                  <MagneticButton primaryColor={plan.color}>
                    {maintenanceType === 'standalone' ? '啟動單次建置' : '啟動訂閱建置'} <ArrowRight size={16} />
                  </MagneticButton>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PricingPage() {
  const [openBladeId, setOpenBladeId] = useState<string>("SYS_01");

  // 真實商業數據整合 (包含單次、月繳、年繳邏輯)
  const plans = [
    {
      id: "SYS_01",
      title: "輕量化品牌官網",
      subtitle: "Lightweight Website",
      basePrice: "19,800",
      color: "#8cc6e7", // 淺湖藍
      icon: <Terminal size={20} />,
      recommended: false,
      features: [
        "最快 10 個工作天初版交付",
        "支援單頁 (On-page) 或多頁架構",
        "純淨 HTML 輕量化網頁代碼",
        "專注展示店鋪特色與聯絡資訊"
      ],
      maintenance: {
        standalone: { 
          price: "0", period: "買斷", 
          desc: "專案完成後將網頁文件打包，包含創建的串聯密碼與 API 等全數交付。結案後不包含後續修改與維護服務。" 
        },
        monthly: { 
          price: "1,600", period: "月", 
          desc: "包含專屬後台管理、Domain(網域)維護，以及每 15 天 1 次的內容文字修改服務 (排版改動另計)。使用綠界定期扣款。" 
        },
        annual: { 
          originalMonthly: "1,600",
          equivalentMonthly: "1,466",
          monthlySaving: "134",
          period: "月 (年繳攤提)", 
          desc: "享免收一個月優惠。總金額 NT$17,600 將於啟動建置後一併結算。包含完整月繳方案之所有內容修改與維護服務。" 
        }
      }
    },
    {
      id: "SYS_02",
      title: "進階 SEO 商業引擎",
      subtitle: "Advanced SEO Engine",
      basePrice: "32,890",
      color: "#a8d5b2", // 薄荷綠
      icon: <Cpu size={20} />,
      recommended: true,
      features: [
        "包含「輕量化品牌官網」所有基礎建設",
        "專為知名線下店鋪與成熟商業模式打造",
        "深度優化網站結構，提升 Google 搜尋排名",
        "針對獲取自然流量量身定製的轉換率優化"
      ],
      maintenance: {
        standalone: { 
          price: "0", period: "買斷", 
          desc: "專案完成後將網頁文件與 SEO 初始架構打包，密碼與 API 全數交付。結案後不包含後續更新服務。" 
        },
        monthly: { 
          price: "2,780", period: "月", 
          desc: "進階專屬商業維護。包含每月 3 次深度內容更新額度，且無更新時間間隔限制，隨時支援商業發布。" 
        },
        annual: { 
          originalMonthly: "2,780",
          equivalentMonthly: "2,548",
          monthlySaving: "232",
          period: "月 (年繳攤提)", 
          desc: "享免收一個月優惠。總金額 NT$30,580 將於啟動建置後一併結算。包含完整月繳方案之進階維護服務。" 
        }
      }
    }
  ];

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 flex flex-col items-center relative z-10 overflow-hidden">
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />

      {/* --- 頁面標題區塊 --- */}
      <div className="text-center mb-16 max-w-4xl mx-auto animate-fade-in">
        <div className="font-mono text-xs font-bold tracking-[0.2em] mb-4 text-zinc-400">
          [ SEC.04 ] DEPLOYMENT PROTOCOL
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-[#1a1a1a] tracking-tighter uppercase mb-6 leading-none">
          Select your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a1a1a] to-[#b0b0b0]">
            Architecture.
          </span>
        </h1>
        <p className="text-zinc-500 text-sm md:text-base max-w-xl mx-auto font-medium">
          剔除無意義的假方案。我們提供模塊化的伺服器級定價，點擊展開面板，自由配置你的專屬數位武器與維護協議。
        </p>
      </div>

      {/* --- 伺服器刀鋒面板 (Cyber-Industrial Accordion) --- */}
      <div className="w-full max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
        <div className="border-t border-zinc-200/80">
          {plans.map((plan) => (
            <ServerBlade 
              key={plan.id} 
              plan={plan} 
              isOpen={openBladeId === plan.id}
              onToggle={() => setOpenBladeId(openBladeId === plan.id ? "" : plan.id)}
            />
          ))}
        </div>
      </div>

      {/* 底部補充說明 */}
      <div className="mt-16 text-center font-mono text-[10px] text-zinc-400 uppercase tracking-[0.2em] animate-fade-in" style={{ animationDelay: '0.4s', opacity: 0 }}>
        <p>※ 點擊面板展開詳細架構。排版與核心視覺改動將視專案複雜度另行報價。</p>
        <p className="mt-2">SYS.ACCORDION_UI: READY</p>
      </div>
      
    </main>
  );
}