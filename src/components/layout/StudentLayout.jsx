import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, CalendarDays, BookOpenText, Bell, Users, UsersRound, Bot, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SplashScreen from "../ui/SplashScreen"; // Pastikan import ini terhubung ke file yang benar

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Jadwal", path: "/schedule", icon: CalendarDays },
  { name: "Materi", path: "/materials", icon: BookOpenText },
  { name: "Tugas", path: "/tasks", icon: Bell },
  { name: "Kelompok", path: "/groups", icon: UsersRound },
  { name: "Teman", path: "/students", icon: Users },
];

export default function StudentLayout() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans relative overflow-x-hidden">
      
      {/* =========================================
          1. INTEGRASI ADVANCE WELCOME ANIMATION
          ========================================= */}
      <AnimatePresence>
        {isLoading && (
          <SplashScreen finishLoading={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* =========================================
          KONTEN UTAMA (Dengan transisi smooth saat loading selesai)
          ========================================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
        animate={!isLoading ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className={isLoading ? "pointer-events-none h-screen overflow-hidden" : ""}
      >
        
        {/* =========================================
            DESKTOP NAVBAR (Gaya Kapsul/Pill)
            ========================================= */}
        {/* Gunakan pointer-events-none agar area kosong tidak menghalangi klik konten di belakangnya */}
        <nav className="hidden md:flex sticky top-6 z-50 w-full px-8 justify-between items-start pointer-events-none">
          {/* Logo Baru (Ganti 'R' jadi 'Bot') */}
          <div className="flex items-center gap-3 shrink-0 pointer-events-auto group w-64">
            <motion.div 
              whileHover={{ rotate: [0, 10, -10, 0] }}
              className="w-11 h-11 p-2 bg-gradient-to-br from-ai-cyan via-ai-indigo to-ai-amber rounded-2xl flex items-center justify-center shadow-md border-2 border-white"
            >
              <Bot size={24} className="text-white drop-shadow-md" strokeWidth={2}/>
            </motion.div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tighter leading-none group-hover:text-ios-blue transition-colors">Class<span className="font-medium text-gray-500">Hub</span></h1>
              <p className="text-[10px] font-semibold text-gray-400 flex items-center gap-1">Kelas R2F Smart Space <Sparkles size={10} className="text-ai-amber animate-pulse" /></p>
            </div>
          </div>

          {/* Bungkus Kapsul/Pill */}
          <div className="pointer-events-auto bg-white p-1 rounded-full shadow-lg border border-gray-100 shrink-0">
            <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1 relative z-10">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 z-10 whitespace-nowrap ${
                      isActive ? "text-ios-blue" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <item.icon size={18} strokeWidth={isActive ? 2.5 : 2}/>
                    {item.name}
                    
                    {/* Indikator Latar Belakang Pill yang Bergeser (Spring Animation) */}
                    {isActive && (
                      <motion.div
                        layoutId="desktopNavPillIndicator"
                        className="absolute inset-0 bg-white rounded-full shadow-sm z-[-1]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Penyeimbang Kosong di Kanan */}
          <div className="w-64"></div>
        </nav>

        {/* =========================================
            MOBILE HEADER
            ========================================= */}
        <header className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-5 py-3.5 flex justify-between items-center shadow-sm relative">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-9 h-9 p-1.5 bg-gradient-to-br from-ai-cyan via-ai-indigo to-ai-amber rounded-xl flex items-center justify-center shadow-sm border-2 border-white">
              <Bot size={18} className="text-white" strokeWidth={2.5}/>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tighter leading-none">ClassHub</h1>
              <p className="text-[10px] font-semibold text-gray-400">R2F Smart Space</p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.1 }} className="p-2 bg-gray-100 rounded-full text-gray-500 relative z-10">
              <Bell size={18} />
          </motion.button>
        </header>

        {/* =========================================
            KONTEN UTAMA (Outlet)
            ========================================= */}
        {/* PERBAIKAN: pb-safe-offset agar konten tidak tertutup fixed mobile nav */}
        <main className="max-w-7xl mx-auto p-4 md:p-8 pt-6 md:pt-16 pb-24 md:pb-8">
          <Outlet />
        </main>

        {/* =========================================
            MOBILE BOTTOM NAVIGATION (Kapsul Melayang yang Fixed)
            ========================================= */}
        {/* PERBAIKAN: Gunakan fixed bottom-0 z-50 agar selalu nempel di bawah.
            pb-safe agar tidak tertutup garis home iPhone. 
            Overflow-x-auto agar bisa di-scroll menyamping. */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe">
          {/* Tambahkan shadow yang kuat agar terlihat 'melayang' */}
          <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200 px-2.5 py-2 overflow-x-auto scrollbar-hide shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-0.5 min-w-max">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={`relative flex flex-col items-center justify-center w-[72px] min-w-[72px] py-1.5 rounded-2xl transition-all duration-300 ${
                      isActive ? "text-ios-blue" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? "bg-blue-50/80 scale-110" : "scale-100"}`}>
                      <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className={`text-[10px] mt-1 transition-all duration-300 whitespace-nowrap ${isActive ? "font-bold" : "font-medium"}`}>
                      {item.name}
                    </span>
                    {/* Indikator Atas */}
                    {isActive && (
                      <motion.div
                        layoutId="mobileNavIndicator"
                        className="absolute -top-1 w-8 h-1 bg-ios-blue rounded-b-full"
                      />
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        </nav>

      </motion.div>
    </div>
  );
}