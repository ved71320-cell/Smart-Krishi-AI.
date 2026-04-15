import React, { useState, useEffect } from "react";
import { CloudSun, Sprout, Loader2, MapPin, Calendar } from "lucide-react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import { getCropRecommendations } from "@/src/lib/gemini";

export default function Recommendations() {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Mock weather data for demo (in real app, use geolocation + OpenWeatherMap)
        const mockWeather = {
          temp: 32,
          humidity: 65,
          rainfall: "Low",
          location: "Pune, Maharashtra",
          month: "April"
        };
        setWeather(mockWeather);
        
        const recs = await getCropRecommendations(mockWeather);
        setRecommendations(recs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-text">Crop Recommendations</h2>
        <p className="text-text-muted text-sm">Best crops for your location and weather</p>
      </div>

      {weather && (
        <div className="bg-surface border border-border p-5 rounded-[24px] flex items-center justify-between shadow-polish">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-primary flex items-center justify-center">
              <CloudSun size={24} />
            </div>
            <div>
              <p className="text-xs text-text-muted font-medium flex items-center gap-1">
                <MapPin size={10} /> {weather.location}
              </p>
              <p className="font-bold text-text text-lg">{weather.temp}°C • {weather.humidity}% Humidity</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-muted font-medium flex items-center gap-1 justify-end">
              <Calendar size={10} /> {weather.month}
            </p>
            <p className="text-xs font-bold text-primary uppercase tracking-wider mt-1">Ideal for Sowing</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 size={40} className="text-primary animate-spin" />
          <p className="text-text-muted font-medium">Generating recommendations...</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-surface border border-border rounded-[24px] p-8 shadow-polish prose prose-slate prose-sm max-w-none"
        >
          <div className="flex items-center gap-2 text-primary mb-6">
            <Sprout size={24} />
            <h3 className="text-xl font-bold m-0">AI Suggestions</h3>
          </div>
          <div className="markdown-body text-text leading-relaxed">
            <ReactMarkdown>{recommendations || ""}</ReactMarkdown>
          </div>
        </motion.div>
      )}

      <div className="bg-[#FFF3E0] border border-[#FFE0B2] p-5 rounded-2xl">
        <p className="text-xs text-[#E65100] leading-relaxed font-medium">
          <strong>Note:</strong> These suggestions are based on general weather patterns. Please consult with local agricultural experts for precise planning.
        </p>
      </div>
    </div>
  );
}
