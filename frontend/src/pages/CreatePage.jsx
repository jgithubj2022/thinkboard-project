import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../lib/api";

const CreatePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "" });
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return toast.error("Add a title and some content");
    setSaving(true);
    try {
      await api.post("/notes", { title: form.title.trim(), content: form.content.trim() });
      toast.success("Note created");
      navigate("/");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not create the note"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10 sm:px-6">
      <Link to="/" className="btn btn-ghost mb-6 -ml-3"><ArrowLeft className="size-4" />Back to board</Link>
      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xl shadow-base-300/40 sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">New note</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">What’s on your mind?</h1>
        <form onSubmit={submit} className="mt-8 space-y-6">
          <label className="form-control">
            <span className="label-text mb-2 font-semibold">Title</span>
            <input className="input input-bordered w-full text-lg" placeholder="A clear, memorable title" maxLength={120} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} autoFocus />
          </label>
          <label className="form-control">
            <span className="label-text mb-2 font-semibold">Content</span>
            <textarea className="textarea textarea-bordered min-h-64 w-full resize-y text-base leading-relaxed" placeholder="Write your note here…" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </label>
          <div className="flex justify-end gap-3">
            <Link to="/" className="btn btn-ghost">Cancel</Link>
            <button className="btn btn-primary" disabled={saving}>{saving ? <span className="loading loading-spinner loading-sm" /> : <Save className="size-4" />}Save note</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreatePage;
