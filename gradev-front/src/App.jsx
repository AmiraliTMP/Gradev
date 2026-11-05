import {
  Bell,
  BookOpen,
  ChartNoAxesColumnIncreasing,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings,
  Users,
} from "lucide-react";

const navigationItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    title: "Students",
    icon: Users,
  },
  {
    title: "Session Grading",
    icon: ClipboardList,
  },
  {
    title: "Unit Grading",
    icon: BookOpen,
  },
  {
    title: "Reports",
    icon: ChartNoAxesColumnIncreasing,
  },
];

function App() {
  return (
    <div className="min-h-screen bg-[#0B0D10] text-white">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/5 bg-[#101216] lg:flex lg:flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-white/5 px-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500 text-black">
            <GraduationCap size={24} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">Gradev</h1>
            <p className="text-xs text-gray-500">Academic Assessment</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Workspace
          </p>

          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  item.active
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={19} />
                {item.title}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/5 p-4">
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 hover:bg-white/5">
            <Settings size={19} />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Header */}
        <header className="flex h-20 items-center justify-between border-b border-white/5 px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 text-gray-400 hover:bg-white/5 lg:hidden">
              <Menu size={22} />
            </button>

            <div>
              <h2 className="text-lg font-semibold">Dashboard</h2>
              <p className="text-xs text-gray-500">Welcome back, Teacher</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-xl border border-white/10 p-2.5 text-gray-400 hover:bg-white/5">
              <Search size={19} />
            </button>

            <button className="relative rounded-xl border border-white/10 p-2.5 text-gray-400 hover:bg-white/5">
              <Bell size={19} />
            </button>

            <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10 font-semibold text-emerald-400">
              T
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <section className="space-y-8 p-6 lg:p-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your classes and student assessments.
              </p>
            </div>

            <button className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400">
              <Plus size={18} />
              Add Student
            </button>
          </div>

          {/* Statistics */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Total Students",
                value: "0",
                description: "Students enrolled",
                icon: Users,
              },
              {
                title: "Active Classes",
                value: "0",
                description: "Currently managed",
                icon: GraduationCap,
              },
              {
                title: "Sessions",
                value: "17",
                description: "Assessment sessions",
                icon: ClipboardList,
              },
              {
                title: "Grading Progress",
                value: "0%",
                description: "Grades completed",
                icon: ChartNoAxesColumnIncreasing,
              },
            ].map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-white/5 bg-[#12151A] p-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">{stat.title}</p>

                    <Icon size={20} className="text-emerald-400" />
                  </div>

                  <h3 className="mt-5 text-3xl font-bold">{stat.value}</h3>

                  <p className="mt-2 text-xs text-gray-500">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#12151A] px-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
              <Users size={30} />
            </div>

            <h3 className="mt-5 text-lg font-semibold">No students yet</h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
              Start by adding your students. Your grading tables will be
              generated automatically once your class is created.
            </p>

            <button className="mt-6 flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium transition hover:bg-white/5">
              <Plus size={17} />
              Add your first student
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
