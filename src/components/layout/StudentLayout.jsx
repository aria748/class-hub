import { Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, CalendarDays, BookOpenText, Bell, Users, BrainCircuit, UsersRound } from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Jadwal", path: "/schedule", icon: CalendarDays },
  { name: "Materi", path: "/materials", icon: BookOpenText },
  { name: "Tugas", path: "/tasks", icon: Bell },
  { name: "Teman", path: "/students", icon: Users },
  { name: "Kelompok", path: "/groups", icon: UsersRound },
];

const StudentLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-ios-bg text-[#1d1d1f]">
      {/* Glassmorphism Navbar */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 rounded-b-ios border-none m-2 mt-0">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-ios-blue flex items-center justify-center text-white font-bold">R</div>
            <span className="text-xl font-bold tracking-tight">Class Hub <span className="text-ios-blue">R2F</span></span>
          </div>
          
          <div className="flex items-center gap-1 bg-gray-200/50 rounded-full p-1 relative">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} className="relative px-4 py-2 flex items-center gap-2 rounded-full text-sm font-medium z-10 transition-colors duration-300">
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-ios-blue' : 'text-gray-600'}`} />
                  <span className={isActive ? 'text-ios-blue' : 'text-gray-700'}>{item.name}</span>
                  
                  {/* Animasi Pil Latar Belakang (iOS style) */}
                  {isActive && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute inset-0 bg-white rounded-full shadow-sm z-[-1]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
            
          </div>

          {/* <div className="flex items-center gap-3">
            <span className="text-sm">Aria Putra</span>
            <img src="https://api.dicebear.com/8.x/notionists/svg?seed=Aria" alt="avatar" className="w-10 h-10 rounded-full bg-white border border-gray-200" />
          </div> */}
        </div>
      </nav>

      {/* Main Content Area dengan AnimatePresence untuk transisi halaman */}
      <main className="pt-28 pb-10 px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
    </div>
  );
};

export default StudentLayout;