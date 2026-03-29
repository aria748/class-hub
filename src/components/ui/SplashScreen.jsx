import { useEffect } from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export default function SplashScreen({ finishLoading }) {
  useEffect(() => {
    // Animasi selesai dalam 3.8 detik
    const timer = setTimeout(finishLoading, 3800); 
    return () => clearTimeout(timer);
  }, [finishLoading]);

  // Array untuk membuat 12 partikel yang meledak ke segala arah
  const sparks = Array.from({ length: 12 });

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      // Latar belakang gelap (Dark Mode) khusus untuk bumper screen
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0f1a] overflow-hidden font-sans"
    >
      
      {/* 1. Teks Booting Kecil ala Terminal (Kiri Atas) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0, 1, 1, 0] }}
        transition={{ duration: 2, times: [0, 0.1, 0.2, 0.3, 0.8, 1] }}
        className="absolute top-6 left-6 font-mono text-[10px] text-ai-cyan/70 tracking-widest"
      >
        <p>SYS_INIT_SEQUENCE_START</p>
        <p>LOADING_CLASS_HUB_UI...</p>
        <p>R2F_NETWORK_CONNECTED</p>
      </motion.div>

      {/* 2. Cincin Mekanikal Besar (Assembling) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        {/* Cincin Luar Berputar Cepat */}
        <motion.div 
          initial={{ scale: 3, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
          className="absolute w-[400px] h-[400px] border-[1px] border-dashed border-ai-cyan/40 rounded-full"
        />
        {/* Cincin Dalam Berlawanan Arah */}
        <motion.div 
          initial={{ scale: 0, opacity: 0, rotate: 180 }}
          animate={{ scale: 1, opacity: 1, rotate: -90 }}
          transition={{ duration: 1.5, type: "spring", bounce: 0.5 }}
          className="absolute w-[300px] h-[300px] border-[2px] border-t-transparent border-b-transparent border-ai-indigo/60 rounded-full"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        
        {/* 3. LOGO LOCK-IN & SHOCKWAVE (The Slam Effect) */}
        <div className="relative flex items-center justify-center mb-8">
          
          {/* Efek Shockwave (Cincin yang meledak saat logo jatuh) */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0, borderWidth: "10px" }}
            animate={{ scale: 3, opacity: [0, 1, 0], borderWidth: "1px" }}
            transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
            className="absolute w-24 h-24 rounded-full border-ai-cyan"
          />

          {/* Partikel Percikan Api (Sparks) */}
          {sparks.map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const radius = 120; // Jarak ledakan
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0],
                  x: Math.cos(angle) * radius,
                  y: Math.sin(angle) * radius,
                }}
                transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
                className={`absolute w-1.5 h-6 rounded-full ${i % 2 === 0 ? "bg-ai-cyan" : "bg-ai-amber"}`}
                style={{ transformOrigin: "bottom center", rotate: `${i * 30}deg` }}
              />
            );
          })}

          {/* Ikon Bot (Jatuh dari atas dan membal) */}
          <motion.div
            initial={{ scale: 5, opacity: 0, y: -100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 300, damping: 12 }}
            className="relative p-6 rounded-[2rem] bg-gradient-to-br from-ai-cyan via-ai-indigo to-blue-600 shadow-[0_0_50px_rgba(56,189,248,0.5)] border-2 border-white/20 z-10"
          >
            <Bot size={70} className="text-white drop-shadow-md" strokeWidth={1.5} />
          </motion.div>
        </div>

        {/* 4. TEKS ANIMASI (Glitch / Slide In) */}
        <div className="flex items-center gap-3 overflow-hidden">
          {/* CLASS masuk dari Kiri */}
          <motion.h1 
            initial={{ x: -100, opacity: 0, skewX: -20 }}
            animate={{ x: 0, opacity: 1, skewX: 0 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 400, damping: 20 }}
            className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter"
          >
            CLASS
          </motion.h1>
          
          {/* HUB masuk dari Kanan */}
          <motion.h1 
            initial={{ x: 100, opacity: 0, skewX: 20 }}
            animate={{ x: 0, opacity: 1, skewX: 0 }}
            transition={{ delay: 1.3, type: "spring", stiffness: 400, damping: 20 }}
            className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-ai-cyan to-ai-indigo tracking-tighter"
          >
            HUB
          </motion.h1>

          {/* R2F Bouncing */}
          <motion.span 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.6, type: "spring", bounce: 0.6 }}
            className="ml-2 px-3 py-1 bg-white/10 rounded-lg text-ai-amber font-bold text-lg md:text-xl border border-white/10"
          >
            R2F
          </motion.span>
        </div>

      </div>
    </motion.div>
  );
}