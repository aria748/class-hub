import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BotMessageSquare, 
  CalendarDays, 
  Clock, 
  MapPin, 
  AlertCircle, 
  Bell, 
  ChevronRight,
  ChevronDown,
  Loader2,
  CheckCircle2,
  BookOpen
} from "lucide-react";
import { AnimatedCard } from "../../components/ui/AnimatedCard";
import { useGoogleSheets } from "../../hooks/useGoogleSheets";

// GANTI 3 LINK DI BAWAH INI DENGAN LINK CSV MASING-MASING SHEET
const SCHEDULE_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSiXsG8UrmsmxF8wc6XtB9t8b1frBI9viftOxbOVQSnFHeme4FXmAeqobDR9tHq43JxUwzNFu3bQv92/pub?gid=1164980928&single=true&output=csv"; // Sheet Jadwal
const TASKS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSiXsG8UrmsmxF8wc6XtB9t8b1frBI9viftOxbOVQSnFHeme4FXmAeqobDR9tHq43JxUwzNFu3bQv92/pub?gid=0&single=true&output=csv"; // Sheet Tugas
const INFO_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSiXsG8UrmsmxF8wc6XtB9t8b1frBI9viftOxbOVQSnFHeme4FXmAeqobDR9tHq43JxUwzNFu3bQv92/pub?gid=848340989&single=true&output=csv"; // Sheet Info

export default function Dashboard() {
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);

  // Ambil Data dari Google Sheets
  const { data: scheduleData, loading: scheduleLoading } = useGoogleSheets(SCHEDULE_CSV_URL);
  const { data: tasksData, loading: tasksLoading } = useGoogleSheets(TASKS_CSV_URL);
  const { data: infoData, loading: infoLoading } = useGoogleSheets(INFO_CSV_URL);

  // 1. Logika Jadwal HARI INI
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const currentDayName = days[new Date().getDay()]; 
  const todaySchedule = (scheduleData || []).filter(item => item.day === currentDayName);

  // 2. Logika Tugas Aktif Terdekat
  const activeTasks = (tasksData || []).filter(item => item.status === "aktif");
  const urgentTask = activeTasks.length > 0 ? activeTasks[0] : null;

  // 3. Logika Info Kelas
  const latestInfo = infoData && infoData.length > 0 ? infoData[0] : null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-gray-900">Selamat Pagi, Mahasiswa!</h1>
          <p className="text-gray-500 mt-1 text-lg">Siap untuk belajar hari ini di kelas R2F?</p>
        </div>
        
        <Link to="/ai">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-ios-blue text-white rounded-full font-bold shadow-lg shadow-ios-blue/30 transition-all cursor-pointer"
          >
            <BotMessageSquare size={18} />
            Tanya AI
          </motion.button>
        </Link>
      </motion.div>

      {/* Quick Panels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* PANEL 1: JADWAL HARI INI */}
        <motion.div layout variants={itemVariants} className="md:col-span-7">
          <AnimatedCard className="border border-gray-100 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-ios-blue/10 text-ios-blue">
                  <CalendarDays size={20} />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-gray-900">Jadwal Hari Ini</h2>
              </div>
              <span className="text-sm font-bold text-ios-blue bg-blue-50 px-3 py-1 rounded-full">
                {currentDayName}
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-4">
              {scheduleLoading ? (
                <div className="flex flex-col items-center text-gray-400 py-6">
                  <Loader2 className="animate-spin mb-2" size={24} />
                  <p className="text-sm">Memuat jadwal...</p>
                </div>
              ) : todaySchedule.length > 0 ? (
                todaySchedule.slice(0, 2).map((item, index) => (
                  <div key={item.id || index} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="font-mono font-bold text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm text-center">
                      {item.time ? item.time.split(" - ")[0] : "-"}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight">{item.subject}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 font-medium">
                        <span className="flex items-center gap-1"><MapPin size={14} /> {item.room}</span>
                        <span className="flex items-center gap-1"><BookOpen size={14} /> {item.type || "Teori"}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p className="font-medium text-lg text-gray-500">Yeay, Kosong! 🎉</p>
                  <p className="text-sm">Tidak ada jadwal kuliah hari ini.</p>
                </div>
              )}
            </div>

            <Link to="/schedule" className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-ios-blue hover:text-blue-700 transition-colors w-full bg-blue-50/50 py-3 rounded-xl">
              Lihat Jadwal Lengkap <ChevronRight size={16} />
            </Link>
          </AnimatedCard>
        </motion.div>

        {/* PANEL SAMPING */}
        <div className="md:col-span-5 flex flex-col gap-6">
          
          {/* PANEL 2: INFO KELAS (PENGUMUMAN) - DENGAN FITUR EXPAND */}
          <motion.div layout variants={itemVariants} className="flex-none">
            <motion.div 
              layout 
              onClick={() => setIsInfoExpanded(!isInfoExpanded)}
              className="p-6 rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-ios-blue/10 transition-shadow cursor-pointer overflow-hidden flex flex-col bg-white shadow-sm relative z-10"
            >
              {/* Tambahkan layout="position" agar header tidak ikut melar */}
              <motion.div layout="position" className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${latestInfo?.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-ios-blue/10 text-ios-blue'}`}>
                    <AlertCircle size={20} />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-gray-900">
                    Info Kelas
                  </h2>
                </div>
                <motion.div animate={{ rotate: isInfoExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown size={20} className="text-gray-400" />
                </motion.div>
              </motion.div>
              
              {infoLoading ? (
                 <div className="flex justify-center py-4"><Loader2 className="animate-spin text-gray-300" size={24}/></div>
              ) : (
                <AnimatePresence initial={false} mode="wait">
                  {!isInfoExpanded ? (
                    /* --- STATE 1: COLLAPSED --- */
                    <motion.div
                      key="collapsed"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      {latestInfo ? (
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1 leading-tight">{latestInfo.title}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed font-medium line-clamp-2">
                            {latestInfo.content}
                          </p>
                          <p className="text-xs text-gray-400 mt-3 font-semibold">{latestInfo.date}</p>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm italic">Belum ada pengumuman terbaru.</p>
                      )}
                    </motion.div>
                  ) : (
                    /* --- STATE 2: EXPANDED --- */
                    <motion.div
                      key="expanded"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-4 overflow-hidden"
                    >
                      <div className="max-h-[350px] overflow-y-auto scrollbar-hide pr-2 flex flex-col gap-3 pb-2 pt-1">
                        {infoData.map((info, index) => {
                          const isLatest = index === 0;

                          return (
                            <motion.div 
                              key={info.id || index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              /* KUNCI PERBAIKAN: Tambahkan shrink-0 di sini */
                              className={`shrink-0 p-4 rounded-2xl border relative overflow-hidden transition-all ${
                                isLatest 
                                  ? "bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-sm" 
                                  : "bg-gray-50 border-gray-100 opacity-70 hover:opacity-100"
                              }`}
                            >
                              {/* Animasi Glow Aura untuk Info Terbaru */}
                              {isLatest && (
                                <motion.div 
                                  animate={{ opacity: [0.1, 0.4, 0.1] }} 
                                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} 
                                  className="absolute -top-10 -right-10 w-32 h-32 bg-ios-blue blur-3xl rounded-full pointer-events-none" 
                                />
                              )}
                              
                              <div className="flex justify-between items-start mb-2 relative z-10">
                                <h3 className={`font-bold ${isLatest ? 'text-ios-blue text-base' : 'text-gray-700 text-sm'}`}>
                                  {info.title}
                                </h3>
                                {/* Label NEW berdenyut */}
                                {isLatest && (
                                  <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold shadow-md animate-pulse shrink-0 ml-2">
                                    NEW
                                  </span>
                                )}
                              </div>
                              <p className={`leading-relaxed font-medium relative z-10 ${isLatest ? 'text-gray-700 text-sm' : 'text-gray-500 text-xs'}`}>
                                {info.content}
                              </p>
                              <p className="text-[11px] font-semibold text-gray-400 mt-2 relative z-10">{info.date}</p>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          </motion.div>
          

          {/* PANEL 3: DEADLINE TUGAS */}
          <motion.div layout variants={itemVariants} className="flex-1">
            <AnimatedCard className="h-full border border-gray-100 bg-gradient-to-br from-white to-gray-50">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-red-100 text-red-500">
                    <Bell size={20} />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-gray-900">Tugas Aktif</h2>
                </div>
                {activeTasks.length > 0 && (
                  <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
                    {activeTasks.length}
                  </span>
                )}
              </div>

              {tasksLoading ? (
                <div className="flex justify-center py-4"><Loader2 className="animate-spin text-gray-300" size={24}/></div>
              ) : urgentTask ? (
                <Link to="/tasks" className="block p-4 bg-white border border-gray-200 rounded-2xl hover:border-ios-blue hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-100">
                      {urgentTask.subject || "Tugas"}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-ios-blue transition-colors line-clamp-1">
                    {urgentTask.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5 font-medium">
                    <Clock size={14} className="text-gray-400" /> 
                    {urgentTask.deadline ? urgentTask.deadline : "Cek detail"}
                  </p>
                </Link>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
                  <CheckCircle2 size={24} className="text-green-500 shrink-0" />
                  <p className="text-sm font-bold text-green-700">Mantap! Semua tugas beres.</p>
                </div>
              )}
            </AnimatedCard>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}