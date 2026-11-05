import {
  BookOpen,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Presentation,
  Settings,
  Users,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigation = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Students", path: "/students", icon: Users },
  { name: "Classes", path: "/classes", icon: Presentation },
  { name: "Session Grading", path: "/session-grading", icon: ClipboardList },
  { name: "Unit Grading", path: "/unit-grading", icon: BookOpen },
  { name: "Reports", path: "/reports", icon: FileText },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity lg:hidden ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/5 bg-[#101216] transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-white/5 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-black">
              <GraduationCap size={21} />
            </div>

            <span className="text-xl font-bold tracking-tight">Gradev</span>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-4 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Workspace
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="border-t border-white/5 p-4">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Settings size={19} />
            Settings
          </NavLink>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
