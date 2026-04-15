import React from "react";
import { Scan, Sprout, TrendingUp, Mic, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const menuItems = [
    { id: "crops", label: "Crop Advice", icon: Sprout, color: "bg-[#FFF3E0] text-[#E65100]", description: "Recommended for you: Pomegranate based on current soil and weather.", type: "crop" },
    { id: "market", label: "Market Trends", icon: TrendingUp, color: "bg-[#E3F2FD] text-[#1565C0]", description: "Tomato prices are rising. Expected peak in 5 days at Lasalgaon Mandi.", type: "market" },
    { id: "voice", label: "AI Assistant", icon: Mic, color: "bg-[#F3E5F5] text-[#7B1FA2]", description: "Ask anything in Hindi, Marathi, or English. Support available 24/7.", type: "voice" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => onNavigate("scan")}
        className="hero-polish cursor-pointer group"
      >
        <h2 className="text-[32px] font-bold mb-2">Plant Disease Detection</h2>
        <p className="opacity-90 text-lg mb-6 max-w-md">Identify pests and diseases instantly using your camera.</p>
        <button className="btn-polish group-hover:scale-105 transition-transform">
          <Scan size={24} /> Click to Scan Leaf
        </button>
      </motion.section>

      {/* Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onNavigate(item.id)}
              className="card-polish text-left flex flex-col gap-3"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${item.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text">{item.label}</h3>
                <p className="text-sm text-text-muted mt-1 leading-relaxed">{item.description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Recent Scan History */}
      <section className="bg-surface p-6 rounded-[20px] border border-border shadow-polish">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Recent Scan History</h3>
          <button className="text-primary text-sm font-semibold flex items-center gap-1">
            See all <ArrowRight size={14} />
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1 border-l-4 border-[#D32F2F] pl-4 py-1">
            <p className="text-xs text-text-muted mb-1">2 hours ago</p>
            <p className="font-bold text-text">Tomato Late Blight Detected</p>
            <p className="text-[13px] text-text-muted mt-1">Remedy: Apply Copper-based fungicide.</p>
          </div>
          <div className="flex-1 border-l-4 border-[#388E3C] pl-4 py-1">
            <p className="text-xs text-text-muted mb-1">Yesterday</p>
            <p className="font-bold text-text">Healthy Wheat Sample</p>
            <p className="text-[13px] text-text-muted mt-1">Status: Nitrogen levels optimal.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
