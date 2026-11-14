import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const pageTitles = {
  "/": "Dashboard",
  "/students": "Students",
  "/classes": "Classes",
  "/session-grading": "Session Grading",
  "/unit-grading": "Unit Grading",
  "/reports": "Reports",
  "/settings": "Settings",
};

function getInitials(name) {
  if (!name) return "U";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function Header({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const title = pageTitles[location.pathname] || "Gradev";

  const userName = user?.name || user?.fullName || user?.email || "User";

  const initials = getInitials(userName);

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // Authentication state is cleared by AuthContext.
    }

    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/5 bg-[#0B0D10]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
      {/* Page Title */}
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

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search */}
        <button
          className="rounded-xl p-2.5 text-gray-400 transition hover:bg-white/5 hover:text-white"
          aria-label="Search"
        >
          <Search size={20} />
        </button>

        {/* Notifications */}
        <button
          className="relative rounded-xl p-2.5 text-gray-400 transition hover:bg-white/5 hover:text-white"
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
        </button>

        {/* User Avatar */}
        <div
          title={userName}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-semibold text-emerald-400"
        >
          {initials}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="rounded-xl p-2.5 text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
          aria-label="Logout"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

export default Header;
