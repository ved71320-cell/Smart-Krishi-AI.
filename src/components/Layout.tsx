import React from "react";
import { Home, Scan, Sprout, TrendingUp, Mic, CloudSun } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "scan", icon: Scan, label: "Scan" },
    { id: "crops", icon: Sprout, label: "Crops" },
    { id: "market", icon: TrendingUp, label: "Market" },
    { id: "voice", icon: Mic, label: "Voice" },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Top Nav */}
      <nav className="h-20 bg-surface border-b border-border flex items-center justify-between px-10 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl">
            K
          </div>
          <div className="text-[22px] font-bold text-primary tracking-tight">
            Smart Krishi AI
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4 bg-[#E8F5E9] px-4 py-2 rounded-[40px] font-medium text-sm text-primary">
          <span>📍 Nashik, MH</span>
          <span className="opacity-30">•</span>
          <span className="flex items-center gap-1"><CloudSun size={16} /> 28°C</span>
          <span className="opacity-30">•</span>
          <span>Humidity 62%</span>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto p-6 md:p-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <main className="flex flex-col gap-6">
          {children}
        </main>

        {/* Side Panel (Desktop only or as a section) */}
        <aside className="hidden lg:flex flex-col gap-6">
          <div className="bg-surface rounded-[24px] border border-border shadow-polish p-6 flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-5">
              <span className="text-lg font-bold">Live Market Prices</span>
              <button className="text-xs font-normal text-primary hover:underline" onClick={() => onTabChange("market")}>View All</button>
            </div>
            
            <ul className="flex flex-col gap-4">
              <PriceItem name="Onion (Nashik)" market="Lasalgaon Mandi" price="₹2,450/q" trend="+4.2%" up />
              <PriceItem name="Cotton (L-Staple)" market="Akola Market" price="₹7,200/q" trend="-0.5%" />
              <PriceItem name="Soybean" market="Latur Mandi" price="₹4,850/q" trend="+1.8%" up />
              <PriceItem name="Grapes (Export)" market="Pimpalgaon" price="₹8,200/q" trend="+12%" up />
            </ul>

            <div className="mt-auto bg-[#FAFAFA] rounded-2xl p-4 border border-dashed border-border flex items-center gap-3">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
              <div className="text-sm">
                <p className="text-text-muted">Listening...</p>
                <p className="font-semibold">"Kapas ke daam kab badhenge?"</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Navigation (Mobile only) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border px-4 py-2 flex justify-between items-center z-50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                isActive ? "text-primary" : "text-text-muted"
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function PriceItem({ name, market, price, trend, up }: { name: string, market: string, price: string, trend: string, up?: boolean }) {
  return (
    <li className="flex items-center justify-between pb-3 border-b border-[#F5F5F5] last:border-0">
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-sm">{name}</span>
        <span className="text-[11px] text-text-muted">{market}</span>
      </div>
      <div className="text-right">
        <span className="font-mono font-bold text-primary text-sm">{price}</span>
        <div className={cn("text-[11px] font-medium", up ? "text-[#D32F2F]" : "text-[#388E3C]")}>
          {up ? "▲" : "▼"} {trend}
        </div>
      </div>
    </li>
  );
}
