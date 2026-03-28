import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Sparkles, ChevronLeft, Loader2, BotMessageSquare, Brain } from "lucide-react";

// Transisi Halaman yang Konsisten
const pageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { type: "spring", stiffness: 350, damping: 30 }
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

export default function AskAI() {
  const navigate = useNavigate();
  const [showInitializing, setShowInitializing] = useState(true);

  // Timer simulasi inisialisasi yang seru
  useEffect(() => {
    const timer = setTimeout(() => {
      // Kita biarkan inisialisasi selama 3.5 detik, lalu pindah ke SplashScreen
      setShowInitializing(false);
    }, 3500); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      /* PERBAIKAN MOBILE: min-h menyesuaikan Navbar, p-2 agar rapi di HP */
      className="relative min-h-[calc(100vh-140px)] flex flex-col p-2 max-w-4xl mx-auto w-full font-sans"
    >
      {/* 1. FUTURISTIC BACKGROUND AURA (Always Active) */}
      <div className="absolute inset-0 z-[-1] overflow-hidden rounded-ios-lg pointer-events-none">
        <motion.div 
          animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] opacity-20 bg-radial from-ai-cyan/20 to-transparent blur-3xl"
        />
        <motion.div 
          animate={{ x: [0, -40, 40, 0], y: [0, 30, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] opacity-20 bg-radial from-ai-amber/20 to-transparent blur-3xl"
        />
      </div>

      {/* 2. MAIN CONTAINER - Glassmorphism intens */}
      <motion.div layout className="glass-deep flex-1 rounded-ios-lg border border-white/30 shadow-2xl flex flex-col overflow-hidden items-center justify-center relative">
        
        {/* Header (Minimalis dengan Tombol Back) */}
        {/* PERBAIKAN MOBILE: padding dikurangi, z-index dipastikan */}
        <div className="absolute top-0 left-0 right-0 px-4 py-3 flex items-center gap-3 z-30 bg-white/40 backdrop-blur-md border-b border-gray-100/50">
          <motion.button 
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")} // Kembali ke Dashboard
            className="p-1.5 rounded-full bg-white/70 text-gray-700 hover:text-ios-blue hover:bg-white shadow-sm transition-all cursor-pointer"
            title="Kembali ke Dashboard"
          >
            <ChevronLeft size={20} />
          </motion.button>
          
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-ai-cyan via-ai-indigo to-ai-amber drop-shadow-ai-intense">
              <BrainCircuit size={16} className="text-white" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-gray-900">Tanya Class Hub AI</h2>
          </div>
        </div>

        {/* 3. CONTENT AREA - UNIQUE LOOP ANIMATION & COMING SOON MESSAGE */}
        <AnimatePresence mode="wait">
          {showInitializing ? (
            /* --- STATE 1: AI INITIALIZING LOOP (Menegangkan & Seru) --- */
            <motion.div
              key="initializing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              /* PERBAIKAN MOBILE: padding p-8 agar rapi di HP */
              className="flex flex-col items-center justify-center p-8 text-center origin-center"
            >
              <div className="relative mb-8 flex items-center justify-center">
                {/* Lingkaran Orbit/Sirkuit */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  /* PERBAIKAN MOBILE: w-40 h-40 mengecil sedikit */
                  className="w-40 h-40 rounded-full border-4 border-dashed border-ai-indigo/40 opacity-50 z-0"
                />
                
                {/* Lingkaran Orbit Kedua (Berlawanan Arah) */}
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  /* PERBAIKAN MOBILE: w-40 h-40 mengecil sedikit */
                  className="absolute w-40 h-40 rounded-full border-2 border-dashed border-ai-cyan/30 opacity-40 z-0"
                />

                {/* Ikon Otak Tengah (Inisialisasi) */}
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center z-10"
                >
                  {/* PERBAIKAN MOBILE: padding p-6, Brain size 50 mengecil sedikit */ }
                  <div className="p-6 rounded-[1.75rem] bg-gradient-to-br from-ai-cyan via-ai-indigo to-ai-amber drop-shadow-ai-intense">
                    <Brain size={50} className="text-white" />
                  </div>
                </motion.div>
                
                {/* Partikel Data Melayang di sekitar orbit */}
                {[...Array(6)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{
                      y: [0, -15, 15, 0], // Jarak vertikal diperkecil
                      x: [0, 15, -15, 0], // Jarak horizontal diperkecil
                      opacity: [0, 0.8, 0],
                    }}
                    transition={{ duration: 3, delay: i * 0.4, repeat: Infinity }}
                    className={`absolute w-2.5 h-2.5 rounded-full ${i % 2 === 0 ? "bg-ai-cyan" : "bg-ai-amber"} blur-[2px]`}
                    style={{ 
                      top: `${20 + Math.random() * 60}%`, // Sebaran dipersempit
                      left: `${20 + Math.random() * 60}%` 
                    }}
                  />
                ))}
              </div>

              <motion.h3 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                /* PERBAIKAN MOBILE: text-xl, gap-2 dikurangi */
                className="text-xl font-bold tracking-tight mb-2 text-gray-900 flex flex-col items-center gap-1"
              >
                Tanya Class Hub AI <span className="font-medium text-sm text-gray-500"> sedang bersiap...</span>
              </motion.h3 >
              
              {/* PERBAIKAN MOBILE: p-3, text-xs dikurangi */ }
              <div className="flex items-center gap-2.5 p-3 bg-gray-100 rounded-2xl text-xs font-medium text-gray-600">
                <Loader2 className="animate-spin text-ios-blue shrink-0" size={16} />
                <p>Menginisialisasi inti neural network asisten kuliah R2F.</p>
              </div>
            </motion.div>

          ) : (
            /* --- STATE 2: COMING SOON SPLASH SCREEN (Optimasi Mobile) --- */
            <motion.div
              key="coming-soon"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              /* PERBAIKAN MOBILE: p-6, pt-20 agar tidak tertutup header */
              className="flex-1 w-full flex flex-col items-center justify-center p-6 pt-20 text-center space-y-6 z-10 origin-bottom"
            >
              
              {/* Desain Komposisi Ikon (Diubah jadi vertical/stacked di HP) */}
              {/* PERBAIKAN MOBILE: p-6, flex-col items-center */ }
              <div className="relative group p-6 bg-white rounded-r-ios-lg rounded-l-md shadow-lg border border-gray-100/50 flex flex-col items-center w-full max-w-sm">
                {/* Pita Penjilid Buku AI */}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-b from-ai-cyan via-ai-indigo to-ai-amber shadow-[inset_-2px_0_3px_rgba(0,0,0,0.15)] z-10" />
                
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  /* PERBAIKAN MOBILE: Posisi disesuaikan jadi center-top, p-4, Bot size 40 */
                  className="absolute -top-10 left-1/2 -translate-x-1/2 p-4 rounded-full bg-ai-indigo drop-shadow-ai-intense text-white z-20 border-4 border-white shadow-2xl"
                >
                  <BotMessageSquare size={40} />
                </motion.div>

                {/* PERBAIKAN MOBILE: space-y-3, text-center */ }
                <div className="pt-8 space-y-3 text-center">
                  <div className="p-2.5 bg-gray-100 rounded-xl w-fit mx-auto text-ai-amber">
                    <Sparkles size={28} />
                  </div>
                  <h3 className="text-lg font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-ai-indigo to-ai-amber leading-tight">
                    Asisten Kuliah Kelas R2F
                  </h3>
                  <p className="text-xs font-semibold text-gray-500 max-w-xs leading-relaxed">Meringkas materi, menjawab tugas, dan mengelola jadwal perkuliahanmu dengan cerdas.</p>
                </div>
              </div>

              {/* Pesan Utama */}
              {/* PERBAIKAN MOBILE: space-y-2.5, text-3xl dikurangi */ }
              <div className="space-y-2.5">
                <h1 className="text-3xl font-extrabold tracking-tighter text-gray-900 leading-snug">
                  Inti Neural Network <span className="font-light text-gray-600">sedang dalam proses <span className="text-transparent bg-clip-text bg-gradient-to-r from-ai-indigo to-ai-amber">pembelajaran</span>.</span>
                </h1>
                <p className="text-base font-medium text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Fitur Tanya AI ini masih dalam tahap pengembangan intensif untuk memastikan kamu mendapatkan asisten terbaik yang akurat, aman, dan dapat diandalkan. Ditunggu *update* selanjutnya, ya! 🚀
                </p>
              </div>

              {/* Tombol Back to Dashboard */}
              {/* PERBAIKAN MOBILE: w-full agar tombol penuh di HP */ }
              <Link to="/" className="w-full md:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-10 py-4 bg-ios-blue text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  <ChevronLeft size={18} strokeWidth={2.5}/>
                  Daftar di Dashboard
                </motion.button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </motion.div>
  );
}