import { Bell, Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/": "Dashboard",
  "/students": "Students",
  "/session-grading": "Session Grading",
  "/unit-grading": "Unit Grading",
  "/reports": "Reports",
  "/settings": "Settings",
};

function Header({ onMenuClick }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Gradev";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/5 bg-[#0B0D10]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        <h1 className="truncate text-lg font-semibold sm:text-xl">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          className="rounded-xl p-2.5 text-gray-400 transition hover:bg-white/5 hover:text-white"
          aria-label="Search"
        >
          <Search size={20} />
        </button>

        <button
          className="relative rounded-xl p-2.5 text-gray-400 transition hover:bg-white/5 hover:text-white"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
        </button>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-semibold text-emerald-400">
          T
        </div>
      </div>
    </header>
  );
}

export default Header;
