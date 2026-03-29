import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, CalendarDays, BookOpenText, Bell, Users, UsersRound, Bot, Sparkles, Heart, Quote, Mail, MailOpen, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SplashScreen from "../ui/SplashScreen";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Jadwal", path: "/schedule", icon: CalendarDays },
  { name: "Materi", path: "/materials", icon: BookOpenText },
  { name: "Tugas", path: "/tasks", icon: Bell },
  { name: "Kelompok", path: "/groups", icon: UsersRound },
  { name: "Teman", path: "/students", icon: Users },
];

// =========================================
// KOMPONEN: PARTIKEL DEBU HANGAT
// =========================================
const DustParticles = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(25)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-amber-200/50 blur-[1px]"
        style={{ width: Math.random() * 4 + 2 + "px", height: Math.random() * 4 + 2 + "px", top: Math.random() * 100 + "%", left: Math.random() * 100 + "%" }}
        animate={{ y: [0, -100, -200], x: [0, Math.random() * 50 - 25, Math.random() * 50 - 25], opacity: [0, 0.8, 0] }}
        transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "linear", delay: Math.random() * 5 }}
      />
    ))}
  </div>
);

// =========================================
// KOMPONEN: MOOD CAPSULE WIDGET (KHUSUS DESKTOP)
// =========================================
function MoodCapsule() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("quote");

  const motivationQuotes = [
    "Tugas kelar, hati tenang! Pelan-pelan aja. 🐢", 
    "Jangan lupa minum air putih, biar fokus! 💧", 
    "Rehat sebentar, matamu juga butuh istirahat ☕", 
    "Satu langkah lebih dekat ke kelulusan! 🎓", 
    "Kelas R2F pasti bisa melewati ini! 🔥", 
    "Kamu luar biasa sudah berjuang sejauh ini ✨", 
    "Tarik napas panjang... hembuskan. 🍃"
  ];
  const [quote, setQuote] = useState(motivationQuotes[0]);

  const shuffleQuote = () => {
    let newQuote;
    do { newQuote = motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)]; } 
    while (newQuote === quote);
    setQuote(newQuote);
  };

  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [letterStage, setLetterStage] = useState("fetching"); 
  
  // State sekarang berupa object agar format selalu rapi
  const [letterContent, setLetterContent] = useState({ opening: "", body: "", closing: "" });

  const handleOpenLetter = async () => {
    setIsOpen(false);
    setIsOverlayOpen(true);
    setLetterStage("fetching");

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      setLetterContent({
        opening: "Pesan Sistem,",
        body: "API Key Groq belum terpasang dengan benar di file .env lokal kamu. Periksa kembali ya!",
        closing: "Salam,\nDeveloper"
      });
      setLetterStage("closed");
      setTimeout(() => setLetterStage("opened"), 800);
      return;
    }

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              // PROMPT DIPERBARUI: Memaksa AI memakai format JSON agar 100% presisi dan sangat pendek
              content: `Kamu adalah sahabat rahasia yang manis. Tulis pesan penyemangat SANGAT SINGKAT untuk mahasiswa yang capek nugas. JANGAN sebut nama.
WAJIB balas dalam format JSON persis seperti ini:
{
  "opening": "Sapaan hangat (Maksimal 3-4 kata)",
  "body": "Isi pesan penyemangat (Wajib pendek, maksimal 15-20 kata)",
  "closing": "Salam penutup (Maksimal 4 kata)"
}`
            }
          ],
          temperature: 0.7,
          max_tokens: 150,
          response_format: { type: "json_object" } // RAHASIA: Memaksa AI mengembalikan data terstruktur
        })
      });
      
      if (!response.ok) throw new Error("API Error");
      
      const data = await response.json();
      const parsedData = JSON.parse(data.choices[0].message.content); // Ekstrak JSON dari AI
      
      setLetterContent({
        opening: parsedData.opening || "Halo kamu,",
        body: parsedData.body || "Jangan lupa bernapas dan istirahat sejenak. Kamu hebat sudah bertahan sejauh ini.",
        closing: parsedData.closing || "Peluk hangat,\nSahabatmu"
      });
    } catch (error) {
      // Fallback pesan pendek
      setLetterContent({
        opening: "Halo orang hebat,",
        body: "Aku tahu tugasnya numpuk, tapi ingat untuk selalu jaga kesehatan ya. Pelan-pelan pasti selesai kok.",
        closing: "Peluk hangat,\nSahabatmu"
      });
    }

    setLetterStage("closed");
    setTimeout(() => setLetterStage("opened"), 800);
  };

  const closeLetter = () => {
    setIsOverlayOpen(false);
    setTimeout(() => setLetterStage("fetching"), 500);
  };

  return (
    <div className="relative z-50 flex items-center">
      <motion.button 
        layout onClick={() => setIsOpen(!isOpen)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm font-bold text-xs transition-colors overflow-hidden group bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100 cursor-pointer"
      >
        <Heart size={16} className={`transition-colors ${isOpen ? "fill-pink-500 text-pink-500" : "fill-pink-200 text-pink-600 group-hover:fill-pink-300"}`} />
        <motion.span layout className="whitespace-nowrap">Mood Capsule</motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(2px)" }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute top-12 right-0 w-[280px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-4 z-50 origin-top-right overflow-hidden"
            >
              <div className="flex bg-gray-100 p-1 rounded-2xl mb-4 relative">
                {[{ id: "quote", label: "Kata-Kata", icon: Quote }, { id: "letter", label: "Untuk Kamu", icon: Mail }].map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl relative z-10 transition-colors text-xs font-bold cursor-pointer ${activeTab === tab.id ? "text-ios-blue" : "text-gray-400 hover:text-gray-600"}`}>
                    <tab.icon size={14} /> {tab.label}
                    {activeTab === tab.id && (<motion.div layoutId="moodTabIndicator" className="absolute inset-0 bg-white rounded-xl shadow-sm z-[-1]" transition={{ type: "spring", stiffness: 300, damping: 25 }} />)}
                  </button>
                ))}
              </div>

              <div className="min-h-[140px] flex flex-col items-center justify-center text-center">
                <AnimatePresence mode="wait">
                  {activeTab === "quote" && (
                    <motion.div key="quote" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex flex-col items-center gap-4 w-full px-2">
                      <p className="text-sm font-bold text-gray-700 leading-relaxed italic">"{quote}"</p>
                      <button onClick={shuffleQuote} className="text-[10px] font-bold text-ios-blue bg-blue-50 hover:bg-blue-100 px-5 py-2 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"><Sparkles size={12}/> Ganti Kata</button>
                    </motion.div>
                  )}
                  {activeTab === "letter" && (
                    <motion.div key="letter" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex flex-col items-center w-full px-2">
                      <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-3 text-amber-500">
                        <MailOpen size={24} />
                      </div>
                      <p className="text-xs font-semibold text-gray-500 mb-4 leading-relaxed">Ada sepucuk surat rahasia yang datang khusus untukmu hari ini.</p>
                      <button onClick={handleOpenLetter} className="w-full flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-400 to-orange-400 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer">
                        Buka Surat
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* OVERLAY ANIMASI BUKA SURAT */}
      <AnimatePresence>
        {isOverlayOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-amber-950/80 backdrop-blur-md"
          >
            <DustParticles />

            <style>
              {`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');
                .surat-kertas::-webkit-scrollbar { display: none; } 
                .surat-kertas { -ms-overflow-style: none; scrollbar-width: none; }
                .font-handwriting { font-family: 'Caveat', cursive; }
              `}
            </style>

            <div className="absolute inset-0 z-0 cursor-pointer" onClick={closeLetter} />

            {letterStage === "opened" && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} onClick={closeLetter} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors z-[210] cursor-pointer">
                <X size={24} />
              </motion.button>
            )}

            {letterStage === "fetching" && (
              <motion.div className="flex flex-col items-center text-amber-100 z-10 pointer-events-none" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <Loader2 size={40} className="animate-spin mb-4 text-amber-300" />
                <p className="font-serif italic tracking-wider text-lg">Tukang pos sedang menulis...</p>
              </motion.div>
            )}

            {(letterStage === "closed" || letterStage === "opened") && (
              <motion.div 
                initial={{ scale: 0.5, y: 100 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative w-[320px] h-[220px] md:w-[400px] md:h-[260px] mx-auto z-10 pointer-events-none"
                style={{ perspective: "1000px" }}
              >
                {/* 1. BAGIAN BELAKANG AMPLOP */}
                <motion.div 
                  animate={ letterStage === "opened" ? { y: 800, rotateZ: -10, opacity: 0 } : { y: 0, rotateZ: 0, opacity: 1 } }
                  transition={{ delay: letterStage === "opened" ? 0.6 : 0, duration: 1, ease: "easeIn" }}
                  className="absolute inset-0 bg-[#c28b4a] rounded-lg shadow-2xl z-0" 
                />

                {/* 2. KERTAS SURAT */}
                <motion.div
                  initial={{ y: 20, height: "120px", rotateX: -85, opacity: 0 }}
                  animate={ letterStage === "opened" ? { 
                    y: -170,           
                    height: "380px",   
                    rotateX: 0,        
                    opacity: 1 
                  } : { y: 20, height: "120px", rotateX: -85, opacity: 0 } }
                  transition={{ 
                    y: { delay: letterStage === "opened" ? 0.6 : 0, duration: 0.6, ease: "easeOut" },
                    opacity: { delay: letterStage === "opened" ? 0.6 : 0, duration: 0.4 },
                    height: { delay: letterStage === "opened" ? 1.4 : 0, duration: 0.8, type: "spring", stiffness: 90, damping: 14 },
                    rotateX: { delay: letterStage === "opened" ? 1.4 : 0, duration: 0.8, type: "spring", stiffness: 90, damping: 14 }
                  }}
                  style={{ 
                    transformOrigin: "top center", 
                    backgroundColor: "#fdfbf7",
                    backgroundImage: "radial-gradient(circle at center, transparent 40%, rgba(212, 175, 55, 0.08) 100%), repeating-linear-gradient(transparent, transparent 27px, rgba(203, 213, 225, 0.6) 28px)",
                    backgroundAttachment: "local",
                    backgroundPosition: "0 10px"
                  }}
                  className="surat-kertas absolute inset-x-3 rounded-md shadow-[0_15px_40px_rgba(0,0,0,0.25)] overflow-y-auto z-10 flex flex-col items-center justify-start pointer-events-auto"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: letterStage === "opened" ? 1 : 0 }}
                    transition={{ delay: 1.9, duration: 0.6 }} 
                    className="w-full h-full flex flex-col justify-between px-6 md:px-8 py-8"
                  >
                    <div className="w-full flex justify-center mb-4">
                       <Sparkles size={24} className="text-amber-500 opacity-60 shrink-0" />
                    </div>
                    
                    {/* FORMAT TERSTRUKTUR DARI JSON AI */}
                    <div className="flex-1 w-full flex flex-col px-1">
                      {/* Sapaan Tangan */}
                      <p className="font-handwriting text-2xl md:text-3xl text-amber-800 text-left mb-3">{letterContent.opening}</p>
                      
                      {/* Pesan Pendek di Tengah */}
                      <p className="font-serif text-amber-950/90 text-sm md:text-base text-center my-auto px-2" style={{ lineHeight: "28px" }}>
                        {letterContent.body}
                      </p>
                      
                      {/* Salam Tangan */}
                      <div className="mt-4 pt-4 border-t border-amber-300/50 text-right">
                        <p className="font-handwriting text-2xl md:text-3xl text-amber-800 leading-tight whitespace-pre-line">{letterContent.closing}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* 3. SAYAP DEPAN AMPLOP */}
                <motion.div
                  animate={ letterStage === "opened" ? { y: 800, rotateZ: -10, opacity: 0 } : { y: 0, rotateZ: 0, opacity: 1 } }
                  transition={{ delay: letterStage === "opened" ? 0.6 : 0, duration: 1, ease: "easeIn" }}
                  className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-b-lg drop-shadow-md"
                >
                  <div className="absolute inset-0 bg-[#e0a65e]" style={{ clipPath: 'polygon(0 0, 52% 50%, 0 100%)' }} />
                  <div className="absolute inset-0 bg-[#e0a65e]" style={{ clipPath: 'polygon(100% 0, 48% 50%, 100% 100%)' }} />
                  <div className="absolute inset-0 bg-[#d69b54]" style={{ clipPath: 'polygon(0 100%, 50% 48%, 100% 100%)' }} />
                </motion.div>

                {/* 4. PENUTUP ATAS AMPLOP */}
                <motion.div
                  initial={{ rotateX: 0, y: 0, opacity: 1, rotateZ: 0 }}
                  animate={ letterStage === "opened" ? { rotateX: 180, y: 800, rotateZ: -10, opacity: 0 } : { rotateX: 0, y: 0, rotateZ: 0, opacity: 1 } }
                  transition={{ 
                    rotateX: { duration: 0.6, type: "spring", stiffness: 100, damping: 14 },
                    y: { delay: letterStage === "opened" ? 0.6 : 0, duration: 1, ease: "easeIn" },
                    rotateZ: { delay: letterStage === "opened" ? 0.6 : 0, duration: 1, ease: "easeIn" },
                    opacity: { delay: letterStage === "opened" ? 0.6 : 0, duration: 1, ease: "easeIn" }
                  }}
                  style={{ transformOrigin: "top", transformStyle: "preserve-3d" }}
                  className={`absolute inset-0 pointer-events-none ${letterStage === "opened" ? "z-5" : "z-30"}`}
                >
                  <div className="absolute inset-0 bg-[#eab068] drop-shadow-lg" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 52%)' }} />
                  <motion.div 
                    animate={{ opacity: letterStage === "opened" ? 0 : 1 }} 
                    transition={{ duration: 0.2 }} 
                    className="absolute top-[45%] left-1/2 -translate-x-1/2 w-10 h-10 bg-red-700 rounded-full shadow-md flex items-center justify-center border-2 border-red-800/50"
                  >
                    <Heart size={14} className="text-red-900/40" fill="currentColor" />
                  </motion.div>
                </motion.div>

              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =========================================
// MAIN STUDENT LAYOUT
// =========================================
export default function StudentLayout() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans relative overflow-x-hidden">
      
      <AnimatePresence mode="wait">
        {isLoading && <SplashScreen finishLoading={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <>
          {/* =========================================
              DESKTOP NAVBAR
              ========================================= */}
          <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.2 }} className="hidden md:flex fixed top-6 z-50 w-full px-8 justify-between items-start pointer-events-none">
            <div className="flex items-center gap-3 shrink-0 pointer-events-auto group w-64">
              <motion.div whileHover={{ rotate: [0, 10, -10, 0] }} className="w-11 h-11 p-2 bg-gradient-to-br from-ai-cyan via-ai-indigo to-ai-amber rounded-2xl flex items-center justify-center shadow-md border-2 border-white">
                <Bot size={24} className="text-white drop-shadow-md" strokeWidth={2}/>
              </motion.div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tighter leading-none group-hover:text-ios-blue transition-colors">Class<span className="font-medium text-gray-500">Hub</span></h1>
                <p className="text-[10px] font-semibold text-gray-400 flex items-center gap-1">R2F Smart Space <Sparkles size={10} className="text-ai-amber animate-pulse" /></p>
              </div>
            </div>

            <div className="pointer-events-auto bg-white p-1 rounded-full shadow-lg border border-gray-100 shrink-0">
              <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1 relative z-10">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink key={item.name} to={item.path} className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 z-10 whitespace-nowrap ${isActive ? "text-ios-blue" : "text-gray-600 hover:text-gray-900"}`}>
                      <item.icon size={18} strokeWidth={isActive ? 2.5 : 2}/> {item.name}
                      {isActive && (<motion.div layoutId="desktopNavPillIndicator" className="absolute inset-0 bg-white rounded-full shadow-sm z-[-1]" transition={{ type: "spring", stiffness: 400, damping: 30 }} />)}
                    </NavLink>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end w-64 pointer-events-auto">
               <MoodCapsule />
            </div>
          </motion.nav>

          {/* =========================================
              MOBILE BOTTOM NAVIGATION
              ========================================= */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-around px-2 py-2 overflow-x-auto scrollbar-hide gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink key={item.name} to={item.path} className={`relative flex flex-col items-center justify-center w-14 py-1.5 rounded-2xl transition-all duration-300 ${isActive ? "text-ios-blue" : "text-gray-400 hover:text-gray-600"}`}>
                    <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? "bg-blue-50/80 scale-110" : "scale-100"}`}>
                      <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className={`text-[9px] mt-1 transition-all duration-300 ${isActive ? "font-bold" : "font-medium"}`}>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </nav>

          {/* KONTEN UTAMA */}
          <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="max-w-7xl mx-auto p-4 md:p-8 pt-6 md:pt-28 pb-24 md:pb-8">
            <Outlet />
          </motion.main>
          
        </>
      )}
    </div>
  );
}