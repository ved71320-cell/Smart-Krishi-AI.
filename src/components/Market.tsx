import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus, MapPin, Search, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

interface MarketPrice {
  id: string;
  crop: string;
  price: string;
  trend: "up" | "down" | "stable";
  region: string;
}

export default function Market() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch("/api/market-prices");
        const data = await res.json();
        setPrices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrices();
  }, []);

  const filteredPrices = prices.filter(p => 
    p.crop.toLowerCase().includes(search.toLowerCase()) || 
    p.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-text">Market Prices</h2>
        <p className="text-text-muted text-sm">Real-time rates from nearby Mandis</p>
      </div>

      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
        <input 
          type="text" 
          placeholder="Search crop or region..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-14 pr-6 py-5 bg-surface border border-border rounded-[20px] shadow-polish focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all text-text"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={40} className="text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPrices.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-surface border border-border p-5 rounded-[20px] flex items-center justify-between shadow-polish hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  item.trend === "up" ? "bg-red-50 text-[#D32F2F]" : 
                  item.trend === "down" ? "bg-green-50 text-[#388E3C]" : 
                  "bg-slate-50 text-text-muted"
                )}>
                  {item.trend === "up" ? <TrendingUp size={24} /> : 
                   item.trend === "down" ? <TrendingDown size={24} /> : 
                   <Minus size={24} />}
                </div>
                <div>
                  <h4 className="font-bold text-text text-lg">{item.crop}</h4>
                  <p className="text-xs text-text-muted flex items-center gap-1">
                    <MapPin size={10} /> {item.region}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-primary text-lg">{item.price}</p>
                <p className={cn(
                  "text-[10px] font-bold uppercase tracking-wider mt-0.5",
                  item.trend === "up" ? "text-[#D32F2F]" : 
                  item.trend === "down" ? "text-[#388E3C]" : 
                  "text-text-muted"
                )}>
                  {item.trend === "up" ? "Rising" : 
                   item.trend === "down" ? "Falling" : 
                   "Stable"}
                </p>
              </div>
            </motion.div>
          ))}
          {filteredPrices.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-text-muted font-medium">No results found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
