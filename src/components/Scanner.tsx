import React, { useState, useRef } from "react";
import { Camera, Upload, X, Loader2, AlertCircle, CheckCircle2, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { analyzePlantDisease, type DiseaseAnalysis } from "@/src/lib/gemini";
import { cn } from "@/src/lib/utils";

export default function Scanner() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const base64Data = image.split(",")[1];
      const analysis = await analyzePlantDisease(base64Data);
      setResult(analysis);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-text">Plant Disease Scanner</h2>
        <p className="text-text-muted text-sm">Take a photo of a leaf to detect diseases</p>
      </div>

      {!image ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="aspect-video rounded-[24px] border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 bg-surface cursor-pointer active:bg-slate-50 transition-colors shadow-polish"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Camera size={32} />
          </div>
          <div className="text-center">
            <p className="font-bold text-text">Tap to Scan</p>
            <p className="text-xs text-text-muted">Camera or Gallery</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            capture="environment"
            onChange={handleImageUpload} 
          />
        </motion.div>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-video rounded-[24px] overflow-hidden shadow-polish border-4 border-white">
            <img src={image} alt="Leaf" className="w-full h-full object-cover" />
            {!loading && !result && (
              <button 
                onClick={reset}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full backdrop-blur-md"
              >
                <X size={20} />
              </button>
            )}
            {loading && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-3">
                <Loader2 size={40} className="animate-spin" />
                <p className="font-medium">Analyzing Leaf...</p>
              </div>
            )}
          </div>

          {!loading && !result && (
            <button 
              onClick={handleAnalyze}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-polish active:scale-[0.98] transition-all"
            >
              Analyze Image
            </button>
          )}
        </div>
      )}

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700"
          >
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pb-12"
          >
            <div className="bg-surface border border-border rounded-[24px] p-8 shadow-polish space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <CheckCircle2 size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Analysis Complete</span>
                  </div>
                  <h3 className="text-3xl font-bold text-text">{result.diseaseName}</h3>
                </div>
                <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold">
                  {Math.round(result.confidence * 100)}% Match
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-border">
                <div>
                  <h4 className="font-bold text-text flex items-center gap-2 mb-3">
                    <AlertCircle size={18} className="text-accent" />
                    Causes
                  </h4>
                  <ul className="list-disc list-inside text-sm text-text-muted space-y-2">
                    {result.causes.map((cause, i) => <li key={i}>{cause}</li>)}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-[#E8F5E9] rounded-2xl border border-primary/10">
                    <h4 className="font-bold text-primary flex items-center gap-2 mb-3">
                      <Leaf size={18} />
                      Organic Remedies
                    </h4>
                    <ul className="text-sm text-primary/80 space-y-2">
                      {result.organicRemedies.map((rem, i) => <li key={i}>• {rem}</li>)}
                    </ul>
                  </div>

                  <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                    <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-3">
                      <AlertCircle size={18} />
                      Chemical Remedies
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-2">
                      {result.chemicalRemedies.map((rem, i) => <li key={i}>• {rem}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              <button 
                onClick={reset}
                className="w-full py-3 text-text-muted font-bold text-sm hover:text-primary transition-colors"
              >
                Scan Another Plant
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
