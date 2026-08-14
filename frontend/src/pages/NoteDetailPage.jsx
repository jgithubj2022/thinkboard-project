import { useEffect, useState } from "react";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../lib/api";

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/notes/${id}`)
      .then(({ data }) => setForm({ title: data.title, content: data.content }))
      .catch((error) => toast.error(getErrorMessage(error, "Could not load the note")))
      .finally(() => setLoading(false));
  }, [id]);

  const update = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return toast.error("Title and content are required");
    setSaving(true);
    try {
      await api.put(`/notes/${id}`, { title: form.title.trim(), content: form.content.trim() });
      toast.success("Note updated");
      navigate("/");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not update the note"));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm("Delete this note? This cannot be undone.")) return;
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      navigate("/");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not delete the note"));
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center"><span className="loading loading-spinner loading-lg text-primary" /></div>;

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10 sm:px-6">
      <Link to="/" className="btn btn-ghost mb-6 -ml-3"><ArrowLeft className="size-4" />Back to board</Link>
      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xl shadow-base-300/40 sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">Edit note</p>
        <form onSubmit={update} className="mt-6 space-y-6">
          <input aria-label="Note title" className="input input-ghost h-auto w-full px-0 text-4xl font-black tracking-tight focus:bg-transparent" value={form.title} maxLength={120} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea aria-label="Note content" className="textarea textarea-bordered min-h-80 w-full resize-y text-base leading-relaxed" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button type="button" className="btn btn-error btn-outline" onClick={remove}><Trash2 className="size-4" />Delete</button>
            <button className="btn btn-primary" disabled={saving}>{saving ? <span className="loading loading-spinner loading-sm" /> : <Save className="size-4" />}Save changes</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default NoteDetailPage;
