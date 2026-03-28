import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, FileArchive, Image as ImageIcon, Video, FileBadge2, Loader2, AlertCircle } from "lucide-react";
import { AnimatedCard } from "../../components/ui/AnimatedCard";
import { useGoogleSheets } from "../../hooks/useGoogleSheets";

// GANTI LINK INI DENGAN LINK CSV DARI SHEET "MATERI" KAMU:
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSiXsG8UrmsmxF8wc6XtB9t8b1frBI9viftOxbOVQSnFHeme4FXmAeqobDR9tHq43JxUwzNFu3bQv92/pub?gid=566110891&single=true&output=csv";

// Fungsi untuk menentukan icon dan warna berdasarkan tipe file
const getFileStyle = (type) => {
  switch (type?.toLowerCase()) {
    case 'pdf': return { icon: FileText, color: 'text-red-500', bg: 'bg-red-100' };
    case 'doc': return { icon: FileBadge2, color: 'text-blue-500', bg: 'bg-blue-100' };
    case 'zip': return { icon: FileArchive, color: 'text-orange-500', bg: 'bg-orange-100' };
    case 'image': return { icon: ImageIcon, color: 'text-green-500', bg: 'bg-green-100' };
    case 'video': return { icon: Video, color: 'text-purple-500', bg: 'bg-purple-100' };
    default: return { icon: FileText, color: 'text-gray-500', bg: 'bg-gray-100' };
  }
};

export default function Materials() {
  const [filter, setFilter] = useState("Semua");

  // Fetch data dari Google Sheets
  const { data: sheetsData, loading, error } = useGoogleSheets(SHEET_CSV_URL);

  // Dapatkan daftar mata kuliah unik secara otomatis dari data Sheets, abaikan yang kosong
  const subjects = ["Semua", ...new Set((sheetsData || [])
    .map(item => item.subject)
    .filter(subject => subject && subject.trim() !== ""))];

  // Filter materi berdasarkan mata kuliah yang dipilih
  const filteredMaterials = filter === "Semua" 
    ? (sheetsData || [])
    : (sheetsData || []).filter(item => item.subject === filter);

  // --- TAMPILAN LOADING ---
  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-ios-blue">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-medium text-gray-600">Memuat bank materi...</p>
      </div>
    );
  }

  // --- TAMPILAN ERROR ---
  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-red-500">
        <AlertCircle className="mb-4" size={48} />
        <h3 className="text-xl font-bold mb-2">Gagal Memuat Materi</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter mb-2">Bank Materi</h1>
          <p className="text-gray-500">Akses dan download semua materi perkuliahan di sini.</p>
        </div>

        {/* Filter Pills dengan perbaikan shadow glow yang tidak terpotong */}
        <div className="flex gap-2 overflow-x-auto py-4 -my-4 px-2 -mx-2 scrollbar-hide">
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setFilter(subject)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer ${
                filter === subject 
                  ? "bg-ios-blue text-white shadow-lg shadow-ios-blue/40" 
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout untuk Materi */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredMaterials.map((item, index) => {
            const fileStyle = getFileStyle(item.type);
            const FileIcon = fileStyle.icon;
            
            return (
              <motion.div
                key={item.id || index}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <AnimatedCard className="h-full flex flex-col justify-between group border border-transparent hover:border-ios-blue/20">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-4 rounded-2xl ${fileStyle.bg} ${fileStyle.color}`}>
                        <FileIcon size={32} strokeWidth={1.5} />
                      </div>
                      <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider">
                        {item.type || "file"}
                      </span>
                    </div>
                    
                    <p className="text-sm font-bold text-ios-blue mb-1">{item.subject}</p>
                    <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 mb-2">
                      {item.title}
                    </h3>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      <p>{item.size || "-"} • {item.date || "-"}</p>
                      <p className="mt-0.5 font-medium">{item.uploader || "Admin"}</p>
                    </div>
                    
                    {/* Download Button - Diarahkan ke link dari Google Sheets */}
                    <motion.a 
                      href={item.link || "#"}
                      target={item.link ? "_blank" : "_self"}
                      rel="noreferrer"
                      whileHover={{ scale: 1.1, backgroundColor: "#007aff", color: "#fff" }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                      title="Download Materi"
                    >
                      <Download size={18} />
                    </motion.a>
                  </div>
                </AnimatedCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
      
      {filteredMaterials.length === 0 && (
         <motion.p 
           initial={{ opacity: 0 }} animate={{ opacity: 1 }}
           className="text-center text-gray-500 py-10"
         >
           Belum ada materi untuk mata kuliah ini.
         </motion.p>
      )}
    </motion.div>
  );
}