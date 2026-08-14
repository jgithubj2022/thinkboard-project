import { ArrowUpRight, CalendarDays, Trash2 } from "lucide-react";
import { Link } from "react-router";

const formatDate = (date) => new Intl.DateTimeFormat(undefined, {
  month: "short", day: "numeric", year: "numeric",
}).format(new Date(date));

const NoteCard = ({ note, onDelete }) => (
  <article className="group flex min-h-56 flex-col rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
    <div className="flex items-start justify-between gap-3">
      <Link to={`/note/${note._id}`} className="line-clamp-2 text-xl font-extrabold tracking-tight transition group-hover:text-primary">{note.title}</Link>
      <Link to={`/note/${note._id}`} className="btn btn-ghost btn-circle btn-sm shrink-0" aria-label={`Open ${note.title}`}><ArrowUpRight className="size-4" /></Link>
    </div>
    <p className="mt-3 line-clamp-4 flex-1 whitespace-pre-wrap text-sm leading-relaxed text-base-content/65">{note.content}</p>
    <div className="mt-6 flex items-center justify-between border-t border-base-300 pt-4">
      <span className="flex items-center gap-1.5 text-xs text-base-content/50"><CalendarDays className="size-3.5" />{formatDate(note.updatedAt || note.createdAt)}</span>
      <button className="btn btn-ghost btn-circle btn-sm text-error" onClick={() => onDelete(note._id)} aria-label={`Delete ${note.title}`}><Trash2 className="size-4" /></button>
    </div>
  </article>
);

export default NoteCard;
