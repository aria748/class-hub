import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentLayout from "./components/layout/StudentLayout";
import Dashboard from "./pages/student/Dashboard";
import Schedule from "./pages/student/Schedule";
import Materials from "./pages/student/Materials";
import Tasks from "./pages/student/Tasks";
import Students from "./pages/student/Students";
import AskAI from "./pages/student/AskAI";
import Groups from "./pages/student/Groups";

// Komponen Placeholder untuk halaman lain agar tidak error saat navigasi diklik
const Placeholder = ({ title }) => (
  <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="glass p-10 rounded-ios-lg">
    <h1 className="text-3xl font-bold">{title} Page</h1>
    <p className="text-gray-500 mt-2">Halaman ini sedang dalam pengembangan.</p>
  </motion.div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route khusus Student */}
        <Route path="/" element={<StudentLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="materials" element={<Materials />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="students" element={<Students />} />
          <Route path="ai" element={<AskAI />} />
          <Route path="groups" element={<Groups />} />
        </Route>
        
        {/* Nanti route Admin dan Login di sini */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;