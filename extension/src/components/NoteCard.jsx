import {
  ArrowUpRight,
  CalendarDays,
  Trash2
} from "lucide-react";

const formatDate = (date) =>
  new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));

const NoteCard = ({ note, onOpen, onDelete }) => (
  <article className="card group min-h-44 border border-base-300 bg-base-100 p-5 shadow-sm transition hover:border-primary/40 hover:shadow-lg">
    <div className="flex items-start justify-between gap-3">
      <button
        type="button"
        className="line-clamp-2 text-left text-xl font-extrabold tracking-tight transition group-hover:text-primary"
        onClick={() => onOpen(note)}
      >
        {note.title}
      </button>

      <button
        type="button"
        className="btn btn-ghost btn-circle btn-sm"
        onClick={() => onOpen(note)}
        aria-label={`Open ${note.title}`}
      >
        <ArrowUpRight className="size-4" />
      </button>
    </div>

    <p className="mt-3 line-clamp-4 flex-1 whitespace-pre-wrap text-sm leading-relaxed text-base-content/65">
      {note.content}
    </p>

    <div className="mt-6 flex items-center justify-between border-t border-base-300 pt-4">
      <span className="flex items-center gap-1.5 text-xs text-base-content/50">
        <CalendarDays className="size-3.5" />
        {formatDate(note.updatedAt || note.createdAt)}
      </span>

      <button
        type="button"
        className="btn btn-ghost btn-circle btn-sm text-error"
        onClick={() => onDelete(note._id)}
        aria-label={`Delete ${note.title}`}
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  </article>
);

export default NoteCard;
