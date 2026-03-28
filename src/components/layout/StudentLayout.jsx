import { Outlet, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, CalendarDays, BookOpenText, Bell, Users, UsersRound } from "lucide-react";
import { motion } from "framer-motion";

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

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 md:pb-0 font-sans">
      
      {/* =========================================
          DESKTOP NAVBAR (Discrete Capsule like segmented control)
          ========================================= */}
      <nav className="hidden md:block sticky top-6 z-50 w-full">
        {/* Discrete capsule container with shadow and border */}
        <div className="w-fit mx-auto bg-white p-1 rounded-full shadow-lg border border-gray-100">
          {/* Inner flex container with light grey background for pill movement */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1 relative z-10">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  /* Links are relative for absolute indicator positioning inside them */
                  className={`relative flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-colors duration-300 z-10 ${
                    isActive ? "text-ios-blue" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2}/>
                  {item.name}
                  {/* Active Indicator: A rounded rectangle background pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activePillIndicator"
                      className="absolute inset-0 bg-white rounded-full shadow-md z-[-1]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* =========================================
          MOBILE HEADER (Hanya tampil di HP)
          ========================================= */}
      <header className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-5 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-ios-blue to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <h1 className="text-lg font-extrabold text-gray-900 tracking-tight">Class Hub</h1>
        </div>
      </header>

      {/* =========================================
          KONTEN UTAMA
          ========================================= */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 pt-16">
        <Outlet />
      </main>

      {/* =========================================
          MOBILE BOTTOM NAVIGATION (Hanya tampil di HP)
          ========================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200 z-50 pb-safe">
        {/* Tambahkan overflow-x-auto agar menu bisa digeser kalau layarnya kekecilan */}
        <div className="flex items-center px-2 py-2 overflow-x-auto scrollbar-hide gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`relative flex flex-col items-center justify-center w-16 min-w-[64px] py-2 rounded-2xl transition-all duration-300 ${
                  isActive ? "text-ios-blue" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? "bg-blue-50/80 scale-110" : "scale-100"}`}>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] mt-1 transition-all duration-300 ${isActive ? "font-bold" : "font-medium"}`}>
                  {item.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="mobileNavIndicator"
                    className="absolute -top-2 w-8 h-1 bg-ios-blue rounded-b-full"
                  />
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

    </div>
  );
}