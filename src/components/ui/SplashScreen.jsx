import { useEffect } from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export default function SplashScreen({ finishLoading }) {
  useEffect(() => {
    // Diperpanjang menjadi 4.8 detik agar lebih santai dan smooth
    const timer = setTimeout(finishLoading, 4800); 
    return () => clearTimeout(timer);
  }, [finishLoading]);

  const sparks = Array.from({ length: 12 });

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0f1a] overflow-hidden font-sans"
    >
      {/* Teks Booting Kecil (Lebih santai) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0, 1, 1, 0] }}
        transition={{ duration: 3, times: [0, 0.1, 0.2, 0.3, 0.8, 1] }}
        className="absolute top-6 left-6 font-mono text-[10px] text-ai-cyan/70 tracking-widest"
      >
        <p>SYS_INIT_SEQUENCE_START</p>
        <p>LOADING_CLASS_HUB_UI...</p>
        <p>R2F_NETWORK_CONNECTED</p>
      </motion.div>

      {/* Cincin Mekanikal (Berputar lebih lambat dan smooth) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <motion.div 
          initial={{ scale: 3, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute w-[400px] h-[400px] border-[1px] border-dashed border-ai-cyan/40 rounded-full"
        />
        <motion.div 
          initial={{ scale: 0, opacity: 0, rotate: 180 }}
          animate={{ scale: 1, opacity: 1, rotate: -90 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute w-[300px] h-[300px] border-[2px] border-t-transparent border-b-transparent border-ai-indigo/60 rounded-full"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        
        <div className="relative flex items-center justify-center mb-10">
          
          {/* Shockwave (Menyebar lebih lambat) */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0, borderWidth: "10px" }}
            animate={{ scale: 4, opacity: [0, 0.5, 0], borderWidth: "1px" }}
            transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
            className="absolute w-24 h-24 rounded-full border-ai-cyan"
          />

          {/* Partikel Percikan (Gerakan lebih melayang/fluid) */}
          {sparks.map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const radius = 140; 
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.2, 0],
                  x: Math.cos(angle) * radius,
                  y: Math.sin(angle) * radius,
                }}
                transition={{ delay: 1.5, duration: 1.2, ease: "easeOut" }}
                className={`absolute w-1.5 h-6 rounded-full ${i % 2 === 0 ? "bg-ai-cyan" : "bg-ai-amber"}`}
                style={{ transformOrigin: "bottom center", rotate: `${i * 30}deg` }}
              />
            );
          })}

          {/* Ikon Bot (Jatuh dengan pantulan yang sangat lembut) */}
          <motion.div
            initial={{ scale: 3, opacity: 0, y: -100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            // Stiffness diturunkan, damping dinaikkan = pantulan lebih berat dan mewah
            transition={{ delay: 1.2, type: "spring", stiffness: 120, damping: 14 }}
            className="relative p-6 rounded-[2rem] bg-gradient-to-br from-ai-cyan via-ai-indigo to-blue-600 shadow-[0_0_50px_rgba(56,189,248,0.5)] border-2 border-white/20 z-10"
          >
            <Bot size={70} className="text-white drop-shadow-md" strokeWidth={1.5} />
          </motion.div>
        </div>

        {/* TEKS ANIMASI (Slide in lebih rileks) */}
        <div className="flex items-center gap-3 overflow-hidden">
          <motion.h1 
            initial={{ x: -80, opacity: 0, skewX: -10 }}
            animate={{ x: 0, opacity: 1, skewX: 0 }}
            transition={{ delay: 1.8, type: "spring", stiffness: 100, damping: 20 }}
            className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter"
          >
            CLASS
          </motion.h1>
          
          <motion.h1 
            initial={{ x: 80, opacity: 0, skewX: 10 }}
            animate={{ x: 0, opacity: 1, skewX: 0 }}
            transition={{ delay: 1.9, type: "spring", stiffness: 100, damping: 20 }}
            className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-ai-cyan to-ai-indigo tracking-tighter"
          >
            HUB
          </motion.h1>

          <motion.span 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2.3, type: "spring", bounce: 0.4 }}
            className="ml-2 px-3 py-1 bg-white/10 rounded-lg text-ai-amber font-bold text-lg md:text-xl border border-white/10"
          >
            R2F
          </motion.span>
        </div>

      </div>
    </motion.div>
  );
}