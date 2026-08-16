import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowLeft, LayoutDashboard, Minus, Plus, Save, X } from "lucide-react";
import NoteCard from "./components/NoteCard";
import styles from "./index.css?inline";

const HOST_ID = "thinkboard-notes-extension";
const existingHost = document.getElementById(HOST_ID);

if (existingHost) {
  existingHost.remove();
} else {
  const host = document.createElement("div");
  host.id = HOST_ID;
  const supportsPopover = typeof host.showPopover === "function";
  if (supportsPopover) host.setAttribute("popover", "manual");
  Object.assign(host.style, {
  all: "initial",
  position: "fixed",
  inset: "0",
  width: "100vw",
  height: "100vh",
  margin: "0",
  padding: "0",
  border: "0",
  background: "transparent",
  overflow: "visible",
  pointerEvents: "none",
  zIndex: "2147483647"
});
  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = styles;
  const mount = document.createElement("div");
  shadow.append(style, mount);
  document.body.appendChild(host);

  const root = createRoot(mount);
  root.render(<ThinkboardOverlay onClose={() => { root.unmount(); host.remove(); }} />);

  if (supportsPopover) {
    try {
      host.showPopover();
    } catch (error) {
      host.removeAttribute("popover");
      console.warn("Thinkboard is using its fixed overlay fallback:", error.message);
    }
  }
}

function ThinkboardOverlay({ onClose }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("board");
  const [form, setForm] = useState({ id: null, title: "", content: "" });
  const [saving, setSaving] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [position, setPosition] = useState(() => ({
    x: Math.max(16, window.innerWidth - 436),
    y: Math.max(16, window.innerHeight - 656),
  }));
  const dragRef = useRef(null);

  const send = async (message) => {
    const result = await chrome.runtime.sendMessage(message);
    if (!result?.ok) throw new Error(result?.error || "The notes request failed");
    return result.data;
  };

  const loadNotes = async () => {
    setLoading(true);
    setError("");
    try {
      setNotes(await send({ type: "GET_NOTES" }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadNotes(); }, []);

  useEffect(() => {
    const move = (event) => {
      if (!dragRef.current) return;
      const { offsetX, offsetY } = dragRef.current;
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 300, event.clientX - offsetX)),
        y: Math.max(0, Math.min(window.innerHeight - 56, event.clientY - offsetY)),
      });
    };
    const stop = () => { dragRef.current = null; };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
  }, []);

  const startDrag = (event) => {
    if (event.button !== 0) return;
    dragRef.current = { offsetX: event.clientX - position.x, offsetY: event.clientY - position.y };
    event.preventDefault();
  };

  const openCreate = () => {
    setForm({ id: null, title: "", content: "" });
    setView("editor");
  };

  const openNote = (note) => {
    setForm({ id: note._id, title: note.title, content: note.content });
    setView("editor");
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await send({ type: "DELETE_NOTE", id });
      setNotes((current) => current.filter((note) => note._id !== id));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const saveNote = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError("Add a title and some content first.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const note = { title: form.title.trim(), content: form.content.trim() };
      if (form.id) await send({ type: "UPDATE_NOTE", id: form.id, note });
      else await send({ type: "CREATE_NOTE", note });
      await loadNotes();
      setView("board");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section
      data-theme="bumblebee"
      className={[
        "card pointer-events-auto fixed isolate z-[2147483647]",
        "overflow-hidden border border-base-content/10",
        "bg-white font-sans text-base-content opacity-100 shadow-2xl",
        "transition-[width,height] duration-200",

        minimized
          ? "h-[58px] min-h-[58px] w-[300px] min-w-[300px] resize-none" //minimized state
          : [ //expanded state
              "h-[min(620px,calc(100vh-32px))]",
              "min-h-[280px]",
              "w-[min(400px,calc(100vw-32px))]",
              "min-w-[320px]",
              "resize"
            ].join(" ")
      ].join(" ")}
    >
      <header className="navbar min-h-[58px] cursor-grab select-none gap-3 border-b border-base-content/10 bg-white px-3 py-2 active:cursor-grabbing" onPointerDown={startDrag}>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-content"><LayoutDashboard className="size-4" /></span>
          <div className="min-w-0"><h1 className="truncate text-sm font-black tracking-tight">Thinkboard Notes</h1><p className="text-[11px] text-base-content/50">{notes.length} {notes.length === 1 ? "note" : "notes"}</p></div>
        </div>
        <div className="flex" onPointerDown={(event) => event.stopPropagation()}>
          <button className="btn btn-ghost btn-circle btn-sm" onClick={() => setMinimized((value) => !value)} aria-label="Minimize Thinkboard"><Minus className="size-4" /></button>
          <button className="btn btn-ghost btn-circle btn-sm" onClick={onClose} aria-label="Close Thinkboard"><X className="size-4" /></button>
        </div>
      </header>

      {!minimized && <div className="card-body block flex-1 overflow-y-auto overscroll-contain p-5 [&::-webkit-scrollbar]:w-[7px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-base-content/20">
        {error && <div className="alert alert-error mb-4 py-3 text-sm"><span>{error}</span></div>}
        {view === "editor" ? (
          <form onSubmit={saveNote} className="flex min-h-full flex-col">
            <button type="button" className="btn btn-ghost btn-sm mb-3 w-fit -ml-2" onClick={() => { setView("board"); setError(""); }}><ArrowLeft className="size-4" />Back</button>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{form.id ? "Edit note" : "New note"}</p>
            <input className="input input-ghost mt-2 h-auto w-full px-0 text-2xl font-black" placeholder="Note title" maxLength={120} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} autoFocus />
            <textarea className="textarea textarea-bordered mt-4 min-h-64 flex-1 resize-none text-sm leading-relaxed" placeholder="Write your note…" value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} />
            <button className="btn btn-primary mt-4" disabled={saving}>{saving ? <span className="loading loading-spinner loading-sm" /> : <Save className="size-4" />}{form.id ? "Save changes" : "Create note"}</button>
          </form>
        ) : (
          <>
            <div className="mb-5 flex items-end justify-between gap-3">
              <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Your workspace</p><h2 className="mt-1 text-2xl font-black tracking-tight">Notes worth keeping.</h2></div>
              <button className="btn btn-primary btn-sm shrink-0" onClick={openCreate}><Plus className="size-4" />New</button>
            </div>
            {loading ? <div className="grid gap-3">{[1, 2].map((item) => <div key={item} className="skeleton h-40 rounded-2xl" />)}</div>
              : notes.length ? <div className="grid gap-3">{notes.map((note) => <NoteCard key={note._id} note={note} onOpen={openNote} onDelete={deleteNote} />)}</div>
              : <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-8 text-center"><p className="font-bold">Your board is ready</p><p className="mt-1 text-sm text-base-content/55">Create your first note.</p><button className="btn btn-primary btn-sm mt-4" onClick={openCreate}><Plus className="size-4" />Create note</button></div>}
          </>
        )}
      </div>}
    </section>
  );
}
