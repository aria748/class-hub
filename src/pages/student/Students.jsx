import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Phone, MessageCircle, Loader2, AlertCircle, Users } from "lucide-react";
import { useGoogleSheets } from "../../hooks/useGoogleSheets";

// GANTI LINK INI DENGAN LINK CSV DARI SHEET "TEMAN" KAMU:
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSiXsG8UrmsmxF8wc6XtB9t8b1frBI9viftOxbOVQSnFHeme4FXmAeqobDR9tHq43JxUwzNFu3bQv92/pub?gid=1413119314&single=true&output=csv";

export default function Students() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mengambil data kontak dari Google Sheets
  const { data: sheetsData, loading, error } = useGoogleSheets(SHEET_CSV_URL);

  // Filter mencari dari awalan kata atau awalan NPM
  const filteredStudents = (sheetsData || []).filter((student) => {
    const query = searchQuery.toLowerCase();
    
    // Jika kolom pencarian kosong, tampilkan semua
    if (!query) return true; 

    const name = student.name?.toLowerCase() || "";
    const npm = student.npm || "";

    // Cek apakah query cocok dengan awal nama, ATAU cocok dengan awal kata setelah spasi
    const matchName = name.startsWith(query) || name.includes(" " + query);
    
    // Cek apakah NPM cocok dari digit pertama
    const matchNpm = npm.startsWith(query);

    return matchName || matchNpm;
  });

  // --- TAMPILAN LOADING ---
  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-ios-blue">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-medium text-gray-600">Memuat daftar kontak mahasiswa...</p>
      </div>
    );
  }

  // --- TAMPILAN ERROR ---
  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-red-500">
        <AlertCircle className="mb-4" size={48} />
        <h3 className="text-xl font-bold mb-2">Gagal Memuat Data</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tighter mb-2">Teman Kelas</h1>
        <p className="text-gray-500">Daftar kontak mahasiswa kelas R2F.</p>
      </div>

      {/* iOS Style Search Bar */}
      <div className="relative group z-10">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="text-gray-400 group-focus-within:text-ios-blue transition-colors" size={20} />
        </div>
        <input
          type="text"
          placeholder="Cari nama atau NPM..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-ios-blue/20 focus:border-ios-blue/50 transition-all shadow-sm text-gray-800 font-medium"
        />
      </div>

      {/* List Kontak */}
      <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl p-2 shadow-xl shadow-gray-200/50">
        <motion.ul layout className="flex flex-col">
          <AnimatePresence initial={false}>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <motion.li
                  key={student.id || index}
                  layout="position"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
                  className={`flex items-center gap-4 p-4 hover:bg-white/60 transition-colors rounded-2xl ${
                    index !== filteredStudents.length - 1 ? "border-b border-gray-100/50" : ""
                  }`}
                >
                  {/* Avatar dari DiceBear API */}
                  <img
                    src={`https://api.dicebear.com/8.x/notionists/svg?seed=${student.name || 'Student'}&backgroundColor=e5e7eb`}
                    alt={student.name}
                    className="w-12 h-12 rounded-full border border-gray-200 bg-white"
                  />

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                      {student.name || "Nama Tidak Diketahui"}
                    </h3>
                    <p className="text-sm font-mono text-gray-500 mt-0.5">
                      {student.npm || "-"}
                    </p>
                  </div>

                  {/* Tombol Aksi Kanan (Hanya muncul jika ada nomor HP) */}
                  {student.phone && (
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${student.phone}`}
                        className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-green-100 hover:text-green-600 transition-colors cursor-pointer"
                        title="Telepon"
                      >
                        <Phone size={18} />
                      </a>
                      <a
                        href={`https://wa.me/62${student.phone.substring(1)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors cursor-pointer"
                        title="WhatsApp"
                      >
                        <MessageCircle size={18} />
                      </a>
                    </div>
                  )}
                </motion.li>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center text-gray-500 flex flex-col items-center"
              >
                {searchQuery ? (
                  <>
                    <Search className="mb-3 text-gray-300" size={40} />
                    <p>Tidak ada mahasiswa dengan nama atau NPM "{searchQuery}"</p>
                  </>
                ) : (
                  <>
                    <Users className="mb-3 text-gray-300" size={40} />
                    <p>Belum ada data mahasiswa.</p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.ul>
      </div>
    </motion.div>
  );
}