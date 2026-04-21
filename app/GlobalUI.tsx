"use client";
import React, { useEffect, useState } from "react";

interface QueueItem {
  from: string;
  to: string;
  start: number;
  end: number;
  char?: string;
}

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
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
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
}

export default function GlobalUI({ children }: { children: React.ReactNode }) {
  const [isScanning, setIsScanning] = useState(false);

  // 實裝你確認過的路由跳轉邏輯
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (path === 'home' || path === '/') {
        if (window.location.pathname === '/') {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          window.location.href = '/';
        }
      } else {
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

    // 2. 導覽列獨立解碼特效 (確保換頁時 Navbar 也能解碼)
    const navTargets = document.querySelectorAll('.nav-scramble-target');
    navTargets.forEach((el) => {
      const htmlEl = el as HTMLElement;
      if (!htmlEl.dataset.scrambled) {
        htmlEl.dataset.scrambled = "true";
        const text = htmlEl.getAttribute("data-text") || htmlEl.innerText;
        const fx = new TextScramble(htmlEl);
        htmlEl.innerText = "";
        fx.setText(text);
      }
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
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
          className="font-black text-3xl tracking-tighter cursor-pointer text-zinc-900 pointer-events-auto block nav-scramble-target" 
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
                className="nav-link-custom inline-block nav-scramble-target" 
                data-text={item}
              >
                {item}
              </a>
            );
          })}
        </div>
      </nav>

      {/* 頁面主要內容注入點 */}
      {children}

      {/* 底部系統輪播列 */}
      <div className="ticker-container pointer-events-none">
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
    </>
  );
}