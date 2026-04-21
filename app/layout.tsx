import type { Metadata } from "next";
import "./globals.css"; // 如果你有全域 css 檔案保留這行
import GlobalUI from "./GlobalUI";

export const metadata: Metadata = {
  title: "REPO.SYS",
  description: "極簡架構，建構商業武器。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="relative w-full bg-[#f4f4f5] text-[#1a1a1a] font-sans overflow-x-hidden selection:bg-[#38BDF8]/30 pb-20">
        {/* 保留原本所有的 CSS */}
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
          .cursor-aura { position: fixed; top: 0; left: 0; width: 50vmax; height: 50vmax; border-radius: 50%; background: conic-gradient(from 0deg, var(--repo-blue), transparent, var(--repo-grey), transparent, var(--repo-blue)); filter: blur(100px); opacity: 0.12; z-index: 0; transform: translate(calc(var(--cursor-x) - 50%), calc(var(--cursor-y) - 50%)); pointer-events: none; transition: opacity 0.5s ease; }
          .grid-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0; background-image: linear-gradient(to right, rgba(26, 26, 26, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(26, 26, 26, 0.04) 1px, transparent 1px); background-size: 40px 40px; mask-image: radial-gradient(400px circle at var(--cursor-x) var(--cursor-y), black 20%, transparent 100%); -webkit-mask-image: radial-gradient(400px circle at var(--cursor-x) var(--cursor-y), black 20%, transparent 100%); pointer-events: none; }
          .hero-title-wrapper { position: relative; display: inline-block; }
          .hero-title { font-size: clamp(5rem, 16vw, 15rem); font-weight: 900; line-height: 1; letter-spacing: -0.06em; position: relative; cursor: crosshair; user-select: none; color: var(--repo-dark); text-shadow: calc(var(--mouse-x) * 0.5px) calc(var(--mouse-y) * 0.5px) 0 rgba(56, 189, 248, 0.5), calc(var(--mouse-x) * -0.4px) calc(var(--mouse-y) * -0.6px) 0 rgba(52, 211, 153, 0.5), calc(var(--mouse-x) * -0.2px) calc(var(--mouse-y) * 0.8px) 0 rgba(148, 163, 184, 0.3); transition: text-shadow 0.2s ease-out, transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), letter-spacing 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); z-index: 2; }
          .hero-title:hover { transform: scale(1.02); letter-spacing: -0.03em; }
          .reveal-text { position: relative; display: inline-block; overflow: hidden; }
          .reveal-text::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: var(--repo-dark); transform-origin: right; transform: scaleX(1); transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1); }
          .reveal-text.active::after { transform-origin: left; transform: scaleX(0); }
          .nav-link-custom { color: var(--repo-grey); transition: color 0.3s ease, transform 0.1s ease; }
          .nav-link-custom:hover { color: var(--repo-blue); }
          .nav-link-custom:active { transform: scale(0.95); }
          .crosshair { position: absolute; width: 20px; height: 20px; opacity: 0.3; z-index: 1; }
          .crosshair::before, .crosshair::after { content: ''; position: absolute; background: var(--repo-dark); }
          .crosshair::before { top: 9px; left: 0; width: 20px; height: 2px; }
          .crosshair::after { top: 0; left: 9px; width: 2px; height: 20px; }
          .ch-1 { top: 15%; left: 5%; }
          .ch-2 { bottom: 25%; right: 5%; }
          .magnetic-btn { position: relative; display: inline-flex; justify-content: center; align-items: center; padding: 1.2rem 3rem; border-radius: 999px; background: var(--repo-dark); color: white; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s; }
          .magnetic-btn::before { content: ''; position: absolute; top: 50%; left: 50%; width: 150%; height: 150%; background: radial-gradient(circle, var(--repo-blue) 0%, transparent 70%); transform: translate(-50%, -50%) scale(0); transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1); z-index: 0; opacity: 0.5; }
          .magnetic-btn:hover { box-shadow: 0 10px 30px -10px var(--repo-blue); }
          .magnetic-btn:hover::before { transform: translate(-50%, -50%) scale(1); }
          .magnetic-btn span { position: relative; z-index: 1; font-size: 0.8rem; letter-spacing: 0.15em; }
          .ticker-container { position: fixed; bottom: 0; left: 0; width: 100%; overflow: hidden; background: var(--repo-dark); color: var(--repo-grey); padding: 0.6rem 0; font-family: monospace; font-size: 0.85rem; letter-spacing: 0.1em; z-index: 50; }
          .ticker-wrapper { display: flex; width: max-content; animation: ticker-scroll 30s linear infinite; }
          .ticker-item { padding: 0 2rem; display: flex; align-items: center; gap: 2rem; }
          .ticker-dot { width: 6px; height: 6px; background-color: var(--repo-green); border-radius: 50%; box-shadow: 0 0 8px var(--repo-green); }
          @keyframes ticker-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .industrial-panel { position: relative; border-top: 1px solid var(--repo-grey); background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(8px); transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
          .industrial-panel:hover { border-color: var(--repo-dark); background: rgba(255, 255, 255, 0.8); transform: translateY(-2px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08); }
          .panel-data-flow { position: relative; overflow: hidden; }
          .data-stream-item { display: flex; gap: 1rem; align-items: flex-start; padding: 1.5rem; border-bottom: 1px solid rgba(26, 26, 26, 0.1); }
          .data-stream-marker { width: 8px; height: 8px; border-radius: 50%; margin-top: 4px; }
          .font-mono-sys { font-family: 'Courier New', Courier, monospace; }
          .process-flow-grid { position: relative; padding-top: 2rem; }
          .process-flow-connector { position: absolute; top: 0; left: 0; width: 100%; height: 1px; background: rgba(26, 26, 26, 0.1); }
          .process-step { position: relative; padding: 2rem; transition: all 0.3s; }
          .process-step:hover { background: white; box-shadow: 0 10px 30px -5px rgba(0,0,0,0.05); }
          .process-watermark { position: absolute; top: 1rem; right: 1rem; font-family: 'Courier New', monospace; font-size: 5rem; font-weight: 100; color: transparent; -webkit-text-stroke: 1px rgba(26, 26, 26, 0.08); opacity: 1; transition: opacity 0.3s; }
          .process-step:hover .process-watermark { -webkit-text-stroke: 1px rgba(26, 26, 26, 0.3); }
          .scanline-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 100; overflow: hidden; opacity: 0; transition: opacity 0.2s; }
          .scanline-overlay.active { opacity: 1; }
          .scan-beam { width: 100%; height: 3px; background: var(--repo-blue); box-shadow: 0 0 25px 5px var(--repo-blue); transform: translateY(-10vh); }
          .scanline-overlay.active .scan-beam { animation: scan-sweep 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
          @keyframes scan-sweep { 0% { transform: translateY(-10vh); } 100% { transform: translateY(110vh); } }
        `}} />
        <GlobalUI>
          {children}
        </GlobalUI>
      </body>
    </html>
  );
}