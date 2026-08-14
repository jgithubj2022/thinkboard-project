import { useCallback, useEffect, useState } from "react";
import { FileText, Plus } from "lucide-react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import RateLimitedUI from "../components/RateLimitedUI";
import api, { isRateLimitError } from "../lib/api";

const Homepage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setIsRateLimited(false);
    try {
      const { data } = await api.get("/notes");
      setNotes(data);
    } catch (error) {
      if (isRateLimitError(error)) setIsRateLimited(true);
      else toast.error("Could not load your notes. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    api.get("/notes")
      .then(({ data }) => setNotes(data))
      .catch((error) => {
        if (isRateLimitError(error)) setIsRateLimited(true);
        else toast.error("Could not load your notes. Is the server running?");
      })
      .finally(() => setLoading(false));
  }, []);

  const deleteNote = async (id) => {
    if (!window.confirm("Delete this note? This cannot be undone.")) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes((current) => current.filter((note) => note._id !== id));
      toast.success("Note deleted");
    } catch (error) {
      if (isRateLimitError(error)) setIsRateLimited(true);
      else toast.error("Could not delete the note");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <section className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.22em] text-primary">Your workspace</p>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Notes worth keeping.</h2>
            <p className="mt-3 max-w-xl text-base-content/65">Capture an idea, come back to it, and keep everything in one simple board.</p>
          </div>
          <div className="stat w-auto rounded-2xl border border-base-300 bg-base-100 shadow-sm">
            <div className="stat-title">Total notes</div>
            <div className="stat-value text-primary">{notes.length}</div>
          </div>
        </section>

        {isRateLimited ? (
          <RateLimitedUI onRetry={fetchNotes} />
        ) : loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading notes">
            {[1, 2, 3].map((item) => <div key={item} className="skeleton h-56 rounded-2xl" />)}
          </div>
        ) : notes.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => <NoteCard key={note._id} note={note} onDelete={deleteNote} />)}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-base-content/20 bg-base-100 px-6 py-16 text-center">
            <FileText className="mx-auto mb-4 size-12 text-primary" />
            <h3 className="text-2xl font-bold">Your board is ready</h3>
            <p className="mx-auto mt-2 max-w-md text-base-content/60">Create your first note and it will appear here.</p>
            <Link to="/create" className="btn btn-primary mt-6"><Plus className="size-4" />Create a note</Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Homepage;
