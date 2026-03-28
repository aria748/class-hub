import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Dices, UserCheck, Loader2, Shuffle, Settings2, UserRound, UserRoundPlus, BookOpen, StickyNote, AlertCircle, ChevronLeft, Library } from "lucide-react";
import { useGoogleSheets } from "../../hooks/useGoogleSheets";
import { AnimatedCard } from "../../components/ui/AnimatedCard";

// GANTI DENGAN LINK CSV SHEET "TEMAN" (Untuk bahan Spin)
const STUDENTS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSiXsG8UrmsmxF8wc6XtB9t8b1frBI9viftOxbOVQSnFHeme4FXmAeqobDR9tHq43JxUwzNFu3bQv92/pub?gid=1413119314&single=true&output=csv";

// GANTI DENGAN LINK CSV SHEET "KELOMPOK" (Untuk Daftar Kelompok)
const GROUPS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSiXsG8UrmsmxF8wc6XtB9t8b1frBI9viftOxbOVQSnFHeme4FXmAeqobDR9tHq43JxUwzNFu3bQv92/pub?gid=204350887&single=true&output=csv";

export default function Groups() {
  const [activeTab, setActiveTab] = useState("daftar");
  const [selectedSubject, setSelectedSubject] = useState(null); // State untuk melacak buku/matkul yang dibuka
  const [isSpinning, setIsSpinning] = useState(false);
  const [spunResults, setSpunResults] = useState(null);

  // State Pengaturan Spin
  const [spinMode, setSpinMode] = useState("normal");
  const [numGroups, setNumGroups] = useState(2);
  const [countBoy, setCountBoy] = useState(3);
  const [countGirl, setCountGirl] = useState(3);

  // Fetch Data dari Google Sheets
  const { data: studentsData, loading: studentsLoading } = useGoogleSheets(STUDENTS_CSV_URL);
  const { data: groupsData, loading: groupsLoading, error: groupsError } = useGoogleSheets(GROUPS_CSV_URL);

  // Mengelompokkan data dari Google Sheets berdasarkan Mata Kuliah
  const groupedGroups = (groupsData || []).reduce((acc, group) => {
    const subj = group.subject || "Mata Kuliah Umum";
    if (!acc[subj]) acc[subj] = [];
    acc[subj].push(group);
    return acc;
  }, {});

  const subjects = Object.keys(groupedGroups);

  // Fungsi Logika Spin Kelompok
  const handleSpin = () => {
    if (!studentsData || studentsData.length === 0) return;
    setIsSpinning(true);
    setSpunResults(null);

    setTimeout(() => {
      let groups = [];
      const shuffled = [...studentsData].sort(() => 0.5 - Math.random());

      if (spinMode === "normal") {
        groups = Array.from({ length: numGroups }, () => []);
        shuffled.forEach((student, index) => {
          groups[index % numGroups].push(student);
        });
      } else {
        const boys = shuffled.filter(s => s.gender?.toLowerCase().includes('l') || s.gender?.toLowerCase().includes('cowok'));
        const girls = shuffled.filter(s => s.gender?.toLowerCase().includes('p') || s.gender?.toLowerCase().includes('cewek'));

        let boyIndex = 0;
        let girlIndex = 0;

        while (boyIndex < boys.length || girlIndex < girls.length) {
          const currentGroup = [];
          for (let i = 0; i < countBoy && boyIndex < boys.length; i++) {
            currentGroup.push(boys[boyIndex]);
            boyIndex++;
          }
          for (let i = 0; i < countGirl && girlIndex < girls.length; i++) {
            currentGroup.push(girls[girlIndex]);
            girlIndex++;
          }
          if (currentGroup.length > 0) groups.push(currentGroup);
        }
      }

      setSpunResults(groups);
      setIsSpinning(false);
    }, 1500);
  };

  // Varian Animasi 3D "Open Book" (Membuka Halaman)
  const bookFlipVariants = {
    hidden: { opacity: 0, scaleX: 0, originX: 0 }, // Menggunakan originX: 0 (poros kiri)
    visible: { 
      opacity: 1, 
      scaleX: 1, 
      originX: 0, 
      transition: { duration: 0.4, ease: "easeOut" } 
    },
    exit: { 
      opacity: 0, 
      scaleX: 0, 
      originX: 0, 
      transition: { duration: 0.3, ease: "easeIn" } 
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tighter mb-2">Kelompok Tugas</h1>
        <p className="text-gray-500">Lihat daftar kelompok atau acak anggota baru secara adil.</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex p-1 bg-gray-200/60 rounded-full mx-auto w-fit relative glass mb-8">
        {[
          { id: "daftar", label: "Daftar Kelompok", icon: Library },
          { id: "spin", label: "Alat Spin", icon: Dices }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedSubject(null); // Tutup buku kalau pindah tab
            }}
            className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-colors z-10 cursor-pointer ${
              activeTab === tab.id ? "text-ios-blue" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="groupTabPill"
                className="absolute inset-0 bg-white rounded-full shadow-sm z-[-1]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "daftar" ? (
          /* =========================================
             TAB 1: DAFTAR KELOMPOK AKTIF
             ========================================= */
          <motion.div
            key="daftar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full"
          >
            {groupsLoading ? (
               <div className="flex flex-col items-center justify-center py-20 text-ios-blue">
                 <Loader2 className="animate-spin mb-4" size={40} />
                 <p className="font-medium text-gray-600">Menyusun rak buku kelompok...</p>
               </div>
            ) : groupsError ? (
               <div className="flex flex-col items-center justify-center py-20 text-red-500">
                 <AlertCircle size={48} className="mb-4" />
                 <p>Gagal memuat: {groupsError}</p>
               </div>
            ) : subjects.length > 0 ? (
              
              /* Container dengan Perspective untuk Efek 3D */
              <div className="w-full">
                <AnimatePresence mode="wait">
                  
                  {!selectedSubject ? (
                    /* --- TAMPILAN 1: RAK BUKU MATA KULIAH (GRID) --- */
                    <motion.div
                      key="grid-buku"
                      variants={bookFlipVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    >
                      {subjects.map((subject) => (
                        <motion.div
                          key={subject}
                          whileHover={{ scale: 1.05, x: 5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedSubject(subject)}
                          className="relative bg-white rounded-r-2xl rounded-l-md shadow-md hover:shadow-xl hover:shadow-ios-blue/20 cursor-pointer border border-gray-100 overflow-hidden flex flex-col h-40 group transition-all"
                        >
                          {/* Tulang Buku (Spine) di sisi kiri */}
                          <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-gradient-to-b from-ios-blue to-blue-600 shadow-[inset_-2px_0_4px_rgba(0,0,0,0.2)] z-10" />
                          
                          <div className="pl-7 p-4 flex-1 flex flex-col justify-center relative">
                            <BookOpen size={24} className="text-ios-blue mb-3 opacity-80 group-hover:scale-110 transition-transform" />
                            <h3 className="font-bold text-gray-800 leading-tight line-clamp-2 text-sm md:text-base">{subject}</h3>
                            <p className="text-xs font-semibold text-gray-400 mt-2 bg-gray-50 w-fit px-2 py-1 rounded">
                              {groupedGroups[subject].length} Kelompok
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    
                    /* --- TAMPILAN 2: HALAMAN DALAM BUKU (DETAIL KELOMPOK) --- */
                    <motion.div
                        key="detail-buku"
                        variants={bookFlipVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="w-full bg-white/90 rounded-3xl p-3 md:p-6 border border-gray-100 shadow-xl"
>
                      {/* Header Buku Terbuka */}
                      <div className="flex items-center gap-4 mb-8">
                        <motion.button 
                          whileHover={{ scale: 1.1, x: -2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedSubject(null)}
                          className="p-2 bg-white rounded-full shadow-sm text-gray-600 hover:text-ios-blue transition-colors cursor-pointer"
                        >
                          <ChevronLeft size={24} />
                        </motion.button>
                        <div>
                          <p className="text-sm font-bold text-ios-blue uppercase tracking-wider mb-1">Mata Kuliah</p>
                          <h2 className="text-2xl font-extrabold text-gray-900">{selectedSubject}</h2>
                        </div>
                      </div>

                      {/* List Kelompok di Dalam Mata Kuliah Tersebut */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        {groupedGroups[selectedSubject].map((group, index) => {
                          const memberList = group.members ? group.members.split(",").map(m => m.trim()) : [];
                          return (
                            <AnimatedCard key={group.id || index} className="border border-gray-200 bg-white flex flex-col h-full shadow-sm hover:shadow-md">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-xl bg-ios-blue/10 text-ios-blue shrink-0">
                                  <Users size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                  {group.group_name || `Kelompok ${index + 1}`}
                                </h3>
                              </div>

                              {group.note && (
                                <div className="mb-5 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800 flex items-start gap-2.5">
                                  <StickyNote size={16} className="shrink-0 mt-0.5 text-amber-600" />
                                  <p className="leading-relaxed font-medium">{group.note}</p>
                                </div>
                              )}

                              <div className="mt-auto">
                                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                                  Anggota Tim ({memberList.length})
                                </h4>
                                <ul className="space-y-2 border-t border-gray-100 pt-3">
                                  {memberList.map((member, i) => (
                                    <li key={i} className="flex items-center gap-2.5 text-gray-700 font-semibold bg-gray-50 p-2.5 rounded-xl text-sm border border-gray-100/50">
                                      <UserCheck size={16} className="text-green-500 shrink-0" />
                                      {member}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </AnimatedCard>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            ) : (
              <div className="text-center py-20 text-gray-500 flex flex-col items-center">
                <Library className="mb-4 text-gray-300" size={56} />
                <p className="text-lg font-medium text-gray-800 mb-1">Rak buku masih kosong</p>
                <p className="text-sm">Admin belum menambahkan daftar kelompok untuk tugas apa pun.</p>
              </div>
            )}
          </motion.div>
        ) : (
          /* =========================================
             TAB 2: ALAT SPIN KELOMPOK (TETAP SAMA)
             ========================================= */
          <motion.div key="spin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            {/* Control Panel Spin */}
            <div className="glass p-6 rounded-ios-lg border border-gray-200 shadow-sm max-w-lg mx-auto">
              <h2 className="text-xl font-bold mb-5 flex items-center justify-center gap-2 text-center">
                <Settings2 className="text-ai-indigo" /> Pengaturan Spin
              </h2>
              
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                <button 
                  onClick={() => setSpinMode("normal")}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${spinMode === "normal" ? "bg-white shadow-sm text-ios-blue" : "text-gray-500"}`}
                >
                  Bagi Rata (Acak)
                </button>
                <button 
                  onClick={() => setSpinMode("gender")}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${spinMode === "gender" ? "bg-white shadow-sm text-ios-blue" : "text-gray-500"}`}
                >
                  Kustom Gender
                </button>
              </div>

              <AnimatePresence mode="wait">
                {spinMode === "normal" ? (
                  <motion.div key="normal" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center justify-between mb-6 px-2">
                    <label className="font-medium text-gray-700">Jumlah Kelompok:</label>
                    <input type="number" min="2" max="15" value={numGroups} onChange={(e) => setNumGroups(Number(e.target.value))} className="w-20 text-center py-2 px-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ios-blue outline-none font-bold" />
                  </motion.div>
                ) : (
                  <motion.div key="gender" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4 mb-6 px-2">
                    <div className="flex items-center justify-between">
                      <label className="font-medium text-gray-700 flex items-center gap-2"><UserRound size={16} className="text-blue-500"/> Cowok per Kelompok:</label>
                      <input type="number" min="0" max="10" value={countBoy} onChange={(e) => setCountBoy(Number(e.target.value))} className="w-20 text-center py-2 px-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ios-blue outline-none font-bold" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="font-medium text-gray-700 flex items-center gap-2"><UserRoundPlus size={16} className="text-pink-500"/> Cewek per Kelompok:</label>
                      <input type="number" min="0" max="10" value={countGirl} onChange={(e) => setCountGirl(Number(e.target.value))} className="w-20 text-center py-2 px-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ios-blue outline-none font-bold" />
                    </div>
                    <p className="text-xs text-gray-500 text-center">*Sisa mahasiswa yang tidak pas kuota otomatis masuk kelompok terakhir.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSpin}
                disabled={studentsLoading || isSpinning}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-ios-blue to-ai-indigo text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSpinning ? <Loader2 className="animate-spin" /> : <Shuffle />}
                {isSpinning ? "Sedang Mengocok..." : "Mulai Spin!"}
              </motion.button>
            </div>

            {/* Hasil Spin */}
            <AnimatePresence>
              {spunResults && !isSpinning && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {spunResults.map((group, index) => (
                    <motion.div key={index} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}>
                      <AnimatedCard className="border-t-4 border-t-ai-indigo bg-gradient-to-b from-white to-gray-50">
                        <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
                           <h3 className="text-lg font-bold text-gray-900">Kelompok {index + 1}</h3>
                           <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{group.length} Orang</span>
                        </div>
                        <ul className="space-y-1">
                          {group.map((student, i) => {
                            const isBoy = student.gender?.toLowerCase().includes('l') || student.gender?.toLowerCase().includes('cowok');
                            const genderColor = isBoy ? 'text-blue-500 bg-blue-50' : 'text-pink-500 bg-pink-50';
                            return (
                              <li key={i} className="flex items-center gap-2 py-1.5 text-gray-700 font-medium text-sm">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${student.gender ? genderColor : 'bg-gray-200 text-gray-500'}`}>
                                  {student.gender ? student.gender.substring(0,1).toUpperCase() : i + 1}
                                </span>
                                {student.name || "Anonim"}
                              </li>
                            );
                          })}
                        </ul>
                      </AnimatedCard>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}