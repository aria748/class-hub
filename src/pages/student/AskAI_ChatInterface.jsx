import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BotMessageSquare, Sparkles, Paperclip, CornerDownLeft, BrainCircuit, ChevronLeft } from "lucide-react";

const initialMessages = [
  {
    id: "m1",
    sender: "ai",
    text: "Hai Aria! Aku Class Hub AI. Aku bisa meringkas materi atau menjawab pertanyaan seputar kuliah. Ada yang bisa dibantu?"
  },
  {
    id: "m2",
    sender: "student",
    text: "Tolong ringkas Modul 1 Kecerdasan Buatan dong. Poin-poin pentingnya aja."
  },
  {
    id: "m3",
    sender: "ai",
    text: "Tentu! Berdasarkan Modul 1 AI, poin pentingnya meliputi: (1) Sejarah AI & Uji Turing, (2) Perbedaan AI vs Machine Learning, dan (3) Pendekatan Agen Cerdas."
  }
];

const messageVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: { 
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 350, damping: 25 }
  }
};

export default function AskAI() {
  const [messages, setMessages] = useState(initialMessages);
  const [showSplash, setShowSplash] = useState(true); // State untuk mengontrol Title Screen
  const navigate = useNavigate();

  // Timer untuk mematikan Splash Screen setelah 2.5 detik
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-140px)] flex flex-col p-2 max-w-4xl mx-auto w-full">
      
      {/* BACKGROUND AURA (Selalu aktif) */}
      <div className="absolute inset-0 z-[-1] overflow-hidden rounded-ios-lg pointer-events-none">
        <motion.div 
          animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-[120%] h-[120%] opacity-20 bg-radial from-ai-cyan/30 to-transparent blur-3xl"
        />
        <motion.div 
          animate={{ x: [0, -40, 40, 0], y: [0, 30, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] opacity-20 bg-radial from-ai-amber/20 to-transparent blur-3xl"
        />
      </div>

      <AnimatePresence mode="wait">
        {showSplash ? (
          /* =========================================
             TITLE / SPLASH SCREEN AI
             ========================================= */
          <motion.div
            key="splash"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)", transition: { duration: 0.5 } }} // Efek blur saat menghilang
            className="flex-1 flex flex-col items-center justify-center z-10"
          >
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="p-6 rounded-[2rem] bg-gradient-to-br from-ai-cyan via-ai-indigo to-ai-amber drop-shadow-ai-intense mb-6"
            >
              <BrainCircuit size={64} className="text-white" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-ai-indigo to-ai-cyan tracking-tight mb-2"
            >
              Class Hub AI
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-500 font-medium flex items-center gap-2"
            >
              <Sparkles size={16} className="text-ai-amber animate-pulse" />
              Menyiapkan asisten virtual...
            </motion.p>
          </motion.div>

        ) : (
          /* =========================================
             CHAT INTERFACE (Muncul setelah Splash)
             ========================================= */
          <motion.div 
            key="chat"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }} // Efek mekar (bouncy)
            className="glass-deep flex-1 w-full rounded-ios-lg border border-white/40 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header Chat */}
            <div className="px-6 py-4 border-b border-white/40 bg-white/30 backdrop-blur-md flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 rounded-full bg-white/50 text-gray-700 hover:text-ios-blue hover:bg-white shadow-sm transition-all cursor-pointer"
              >
                <ChevronLeft size={24} />
              </motion.button>
              
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-ai-cyan via-ai-indigo to-ai-amber drop-shadow-ai-intense">
                  <BrainCircuit size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-gray-900">Tanya Class Hub AI</h2>
                  <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
                    Aktif
                  </p>
                </div>
              </div>
            </div>

            {/* Chat History Area */}
            <div className="flex-1 px-6 py-6 overflow-y-auto space-y-6 scrollbar-hide">
              <AnimatePresence>
                {messages.map((item) => (
                  <motion.div 
                    key={item.id} 
                    layout="position"
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    className={`flex gap-3 ${item.sender === "student" ? "justify-end" : "justify-start"}`}
                  >
                    {item.sender === "ai" && (
                       <div className="p-2 h-10 w-10 shrink-0 rounded-full bg-white/80 shadow-sm flex items-center justify-center text-ai-indigo border border-white">
                        <BotMessageSquare size={20} />
                       </div>
                    )}
                    
                    <div className="max-w-[80%] flex flex-col gap-1.5">
                      <motion.div
                        className={`${
                          item.sender === "ai"
                            ? "rounded-t-2xl rounded-br-2xl rounded-bl-sm bg-white/90 drop-shadow-ai-pulsate text-gray-800 border border-white/50"
                            : "rounded-t-2xl rounded-bl-2xl rounded-br-sm bg-gradient-to-r from-ios-blue to-blue-500 text-white shadow-md"
                        } p-4 text-[15px] leading-relaxed font-medium`}
                      >
                        {item.text}
                      </motion.div>
                      <span className="text-xs text-gray-500 px-2 font-medium">
                        {item.sender === "ai" ? "Class Hub Bot" : "Aria"} • 09:42
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* INPUT AREA */}
            <div className="p-4 bg-white/50 backdrop-blur-xl border-t border-white/40">
              <div className="flex items-center gap-3 p-2 bg-white/80 backdrop-blur-md border border-gray-200/60 rounded-full shadow-sm hover:shadow-md hover:border-ai-indigo/30 transition-all duration-300">
                <div className="flex items-center gap-1 pl-1">
                  <motion.button 
                    whileHover={{ scale: 1.1, backgroundColor: "#6366f1", color: "#fff" }}
                    className="w-10 h-10 shrink-0 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
                  >
                     <Paperclip size={18} />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1, backgroundColor: "#f59e0b", color: "#fff" }}
                    className="w-10 h-10 shrink-0 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Sparkles size={18} />
                  </motion.button>
                </div>

                <input 
                  type="text" 
                  placeholder="Tanya soal materi, jadwal, atau tugas..."
                  className="flex-1 w-full bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800 font-medium placeholder-gray-400 py-2"
                />

                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-11 h-11 shrink-0 mr-1 rounded-full bg-gradient-to-br from-ai-indigo to-ai-cyan text-white flex items-center justify-center drop-shadow-ai-intense cursor-pointer"
                >
                  <CornerDownLeft size={20} strokeWidth={2.5} />
                </motion.button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}