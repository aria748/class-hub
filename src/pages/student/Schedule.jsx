import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, User, BookOpen, Loader2, AlertCircle } from "lucide-react";
import { AnimatedCard } from "../../components/ui/AnimatedCard";
import { useGoogleSheets } from "../../hooks/useGoogleSheets";

// GANTI LINK INI DENGAN LINK CSV DARI SHEET "JADWAL" KAMU:
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSiXsG8UrmsmxF8wc6XtB9t8b1frBI9viftOxbOVQSnFHeme4FXmAeqobDR9tHq43JxUwzNFu3bQv92/pub?gid=1164980928&single=true&output=csv";

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

export default function Schedule() {
  const [activeDay, setActiveDay] = useState("Senin");

  // Mengambil data jadwal dari Google Sheets
  const { data: sheetsData, loading, error } = useGoogleSheets(SHEET_CSV_URL);

  // Varian animasi
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  // --- TAMPILAN LOADING ---
  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-ios-blue">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-medium text-gray-600">Mengambil jadwal dari server kelas...</p>
      </div>
    );
  }

  // --- TAMPILAN ERROR ---
  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-red-500">
        <AlertCircle className="mb-4" size={48} />
        <h3 className="text-xl font-bold mb-2">Gagal Memuat Jadwal</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  // Filter jadwal berdasarkan hari yang sedang aktif
  // Pastikan header di Google Sheets bernama "day"
  const currentSchedule = sheetsData.filter(item => item.day === activeDay);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tighter mb-2">Jadwal Kuliah</h1>
        <p className="text-gray-500">Cek jadwal harianmu di kelas R2F.</p>
      </div>

      {/* iOS Style Segmented Control (Tabs) */}
      {/* 1. Tambahkan overflow-x-auto dan scrollbar-hide di div pembungkus */}
      <div className="flex p-1 bg-gray-200/60 rounded-full mx-auto w-full md:w-fit relative glass overflow-x-auto scrollbar-hide">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            /* 2. Tambahkan shrink-0 dan whitespace-nowrap di tombol */
            className={`relative shrink-0 whitespace-nowrap flex-1 md:flex-none px-6 py-3 rounded-full text-sm font-semibold transition-colors z-10 cursor-pointer ${
              activeDay === day ? "text-ios-blue" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {activeDay === day && (
              <motion.div
                layoutId="activeDayPill"
                className="absolute inset-0 bg-white rounded-full shadow-sm z-[-1]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {day}
          </button>
        ))}
      </div>

      {/* Schedule Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            variants={listVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            {currentSchedule.length > 0 ? (
              currentSchedule.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <AnimatedCard className="flex flex-col md:flex-row md:items-center gap-6 p-6 border border-gray-100 hover:border-ios-blue/30 transition-colors">
                    
                    {/* Time Section */}
                    <div className="flex md:flex-col items-center md:items-start gap-2 md:min-w-[120px]">
                      <div className="p-3 bg-ios-blue/10 text-ios-blue rounded-2xl">
                        <Clock size={24} />
                      </div>
                      <span className="font-mono font-bold text-lg text-gray-800">
                        {/* Mencegah error jika time kosong di Sheets */}
                        {item.time ? item.time.split(" - ")[0] : "-"}
                      </span>
                    </div>

                    {/* Details Section */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                          item.type?.toLowerCase() === 'praktek' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.type || "Teori"}
                        </span>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">
                          {item.subject}
                        </h2>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-3 md:gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-400" />
                          <span className="font-medium">{item.lecturer}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-gray-400" />
                          <span className="font-medium">{item.room}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 md:mt-0 px-4 py-2 bg-gray-100 hover:bg-ios-blue hover:text-white text-gray-700 rounded-full text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer w-fit"
                    >
                      <BookOpen size={16} />
                      Materi
                    </motion.button>
                  </AnimatedCard>
                </motion.div>
              ))
            ) : (
              // Empty State untuk hari libur / tidak ada jadwal
              <motion.div 
                variants={itemVariants}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Yeay, Kosong!</h3>
                <p className="text-gray-500">Tidak ada jadwal kuliah untuk hari {activeDay}. Waktunya istirahat atau ngerjain tugas!</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}