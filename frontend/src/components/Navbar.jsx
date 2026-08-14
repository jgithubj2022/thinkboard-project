import { LayoutDashboard, Plus } from "lucide-react";
import { Link } from "react-router";

const Navbar = () => (
  <header className="sticky top-0 z-20 border-b border-base-300/80 bg-base-100/90 backdrop-blur">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
      <Link to="/" className="flex items-center gap-3" aria-label="MERN Board home">
        <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-content shadow-md shadow-primary/20"><LayoutDashboard className="size-5" /></span>
        <div>
          <h1 className="text-lg font-black leading-none tracking-tight">Think Board</h1>
          <p className="mt-1 text-xs text-base-content/50">Small notes, clear mind</p>
        </div>
      </Link>
      <Link to="/create" className="btn btn-primary btn-sm sm:btn-md"><Plus className="size-4" /><span className="hidden sm:inline">New note</span></Link>
    </div>
  </header>
);

export default Navbar;
