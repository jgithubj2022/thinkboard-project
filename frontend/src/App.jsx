import {Route, Routes} from "react-router";
import toast from "react-hot-toast";
import Homepage from "./pages/Homepage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";

const App = () => {
  return (
    <div>
      <button onClick={() => toast.success("congrats")} className="text-red-500 p-4">click me</button>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/create" element={<CreatePage/>} />
        <Route path="/note/:id" element={<NoteDetailPage/>} />
      </Routes>
      
    </div>
  )
}

export default App
