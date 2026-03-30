import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, AlertCircle, ChevronDown, UploadCloud, FileText, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useGoogleSheets } from "../../hooks/useGoogleSheets";

// Masukkan Link CSV dari Google Sheets kamu di sini
const refreshKey = new Date().getTime();
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vSiXsG8UrmsmxF8wc6XtB9t8b1frBI9viftOxbOVQSnFHeme4FXmAeqobDR9tHq43JxUwzNFu3bQv92/pub?gid=1305672077&single=true&output=csv&t=${refreshKey}`;

export default function Tasks() {
  const [activeTab, setActiveTab] = useState("aktif");
  const [expandedId, setExpandedId] = useState(null);
  
  // Mengambil data dari Google Sheets melalui custom hook
  const { data: sheetsData, loading, error } = useGoogleSheets(SHEET_CSV_URL);
  
  // State lokal agar mahasiswa bisa menceklis tugas (manipulasi data di browser)
  const [localTasks, setLocalTasks] = useState([]);

  // Mengisi state lokal saat data dari Google Sheets selesai dimuat
  useEffect(() => {
    if (sheetsData && sheetsData.length > 0) {
      setLocalTasks(sheetsData);
    }
  }, [sheetsData]);

  // Filter tugas berdasarkan tab (aktif / selesai)
  const filteredTasks = localTasks.filter(task => task.status === activeTab);

  // Fungsi untuk memindah tugas dari aktif ke selesai (dan sebaliknya)
  const toggleTaskStatus = (e, taskId) => {
    e.stopPropagation(); 
    setLocalTasks(localTasks.map(task => {
      if (task.id === taskId) {
        return { 
          ...task, 
          status: task.status === "aktif" ? "selesai" : "aktif" 
        };
      }
      return task;
    }));
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case "tinggi": return "bg-red-100 text-red-700 border-red-200";
      case "sedang": return "bg-orange-100 text-orange-700 border-orange-200";
      case "rendah": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // --- TAMPILAN LOADING ---
  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-ios-blue">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-medium text-gray-600">Mengambil data dari server kelas...</p>
      </div>
    );
  }

  // --- TAMPILAN ERROR ---
  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-red-500">
        <AlertCircle className="mb-4" size={48} />
        <h3 className="text-xl font-bold mb-2">Gagal Memuat Tugas</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  // --- TAMPILAN UTAMA (SUKSES) ---
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tighter mb-2">Daftar Tugas</h1>
        <p className="text-gray-500">Pantau deadline dan kumpulkan tugasmu tepat waktu.</p>
      </div>

      <div className="flex p-1 bg-gray-200/60 rounded-full mx-auto w-fit relative glass mb-8">
        {["aktif", "selesai"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setExpandedId(null);
            }}
            className={`relative px-8 py-2.5 rounded-full text-sm font-bold capitalize transition-colors z-10 cursor-pointer ${
              activeTab === tab ? "text-ios-blue" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="taskTabPill"
                className="absolute inset-0 bg-white rounded-full shadow-sm z-[-1]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4 w-full">
        <AnimatePresence initial={false}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => {
              const isExpanded = expandedId === task.id;

              return (
                <motion.div
                  key={task.id}
                  layout 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
                  onClick={() => setExpandedId(isExpanded ? null : task.id)}
                  style={{ borderRadius: isExpanded ? 28 : 20 }}
                  className={`glass w-full overflow-hidden cursor-pointer border transition-colors duration-300 origin-top ${
                    isExpanded ? "border-ios-blue/30 shadow-xl shadow-ios-blue/5" : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <motion.div layout="position" className="p-5 flex items-start gap-4">
                    <button 
                      onClick={(e) => toggleTaskStatus(e, task.id)}
                      className="pt-1 mt-0.5 text-gray-300 hover:text-ios-blue transition-colors cursor-pointer group z-20"
                    >
                      {task.status === "selesai" ? (
                        <CheckCircle2 className="text-green-500 group-hover:text-green-600" size={26} />
                      ) : (
                        <Circle size={26} className="group-hover:fill-ios-blue/10" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${getPriorityStyle(task.priority)}`}>
                          {task.subject}
                        </span>
                      </div>
                      <h3 className={`text-lg font-bold leading-tight pr-8 ${task.status === "selesai" ? "text-gray-400 line-through" : "text-gray-900"}`}>
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        {task.status === "aktif" && task.priority?.toLowerCase() === "tinggi" ? (
                           <AlertCircle size={14} className="text-red-500"/>
                        ) : (
                           <Clock size={14} /> 
                        )}
                        {/* Cek apakah ada deadline sebelum format tanggal */}
                        {task.deadline ? new Date(task.deadline).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute:'2-digit' }) : "-"}
                      </p>
                    </div>

                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-400 p-2"
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </motion.div>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-5 pt-2 border-t border-gray-100/50">
                          <div className="bg-white/50 rounded-lg p-4 mb-4 text-sm text-gray-700 leading-relaxed">
                            <p className="font-semibold mb-1 text-gray-900">Instruksi dari {task.lecturer}:</p>
                            {task.description}
                          </div>

                          {/* {task.status === "aktif" && (
                            <div className="flex gap-3">
                              <button className="flex-1 bg-ios-blue hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer">
                                <UploadCloud size={18} />
                                Kumpulkan Tugas
                              </button>
                              <button className="px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer">
                                <FileText size={18} />
                                Lihat Format
                              </button>
                            </div>
                          )} */}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20 text-gray-500"
            >
              <CheckCircle2 size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">
                {activeTab === "aktif" ? "Yeay! Semua tugas sudah beres." : "Belum ada tugas yang diselesaikan."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}