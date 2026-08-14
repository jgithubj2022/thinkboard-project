import { Route, Routes } from "react-router";
import Homepage from "./pages/Homepage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";

const App = () => (
  <div data-theme="bumblebee" className="min-h-screen bg-base-200 text-base-content">
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="/note/:id" element={<NoteDetailPage />} />
    </Routes>
  </div>
);

export default App;
