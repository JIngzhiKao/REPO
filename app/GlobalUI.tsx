"use client";
import React, { useEffect, useState } from "react";

export default function GlobalUI({ children }: { children: React.ReactNode }) {
  const [isScanning, setIsScanning] = useState(false);

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
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <div className={`scanline-overlay ${isScanning ? 'active' : ''}`}>
        <div className="scan-beam"></div>
      </div>

      <div className="cursor-aura"></div>
      <div className="grid-bg"></div>

      <nav className="fixed top-0 left-0 w-full z-50 p-6 md:px-12 flex justify-between items-center pointer-events-none">
        <a 
          href="/"
          onClick={(e) => handleNavClick(e, 'home')}
          className="pointer-events-auto block" 
        >
          {/* 🔴 Logo 回歸純靜態圖片，尺寸精緻 h-8 md:h-10 */}
          <img 
            src="/repologo.png" 
            alt="REPO Logo" 
            className="h-8 md:h-10 w-auto object-contain" 
          />
        </a>

        <div className="hidden md:flex gap-10 font-bold text-lg tracking-widest pointer-events-auto">
          {['HOME', 'PROJECT', 'PRICING', 'Contact us'].map((item) => {
            const path = item.toLowerCase().replace(' ', '');
            const targetHref = path === 'home' ? '/' : `/${path}`;
            return (
              <a 
                key={item} 
                href={targetHref} 
                onClick={(e) => handleNavClick(e, path)}
                className="nav-link-custom inline-block" 
              >
                {item}
              </a>
            );
          })} 
        </div>
      </nav>

      {children}

      <div className="ticker-container pointer-events-none">
        <div className="ticker-wrapper">
          <div className="ticker-item">
            <span>SYS.STATUS: ONLINE</span><div className="ticker-dot"></div>
            <span>FRAMEWORK: REPO_V2.0</span><div className="ticker-dot"></div>
            <span>DATA_STREAM: SECURE</span><div className="ticker-dot"></div>
          </div>
          <div className="ticker-item">
            <span>SYS.STATUS: ONLINE</span><div className="ticker-dot"></div>
            <span>FRAMEWORK: REPO_V2.0</span><div className="ticker-dot"></div>
            <span>DATA_STREAM: SECURE</span><div className="ticker-dot"></div>
          </div>
        </div>
      </div>
    </>
  );
}