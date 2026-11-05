import {
  ChartNoAxesColumnIncreasing,
  ClipboardList,
  GraduationCap,
  Plus,
  Users,
} from "lucide-react";

const statistics = [
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
];

function Dashboard() {
  return (
    <section className="space-y-8">
      {/* Page Introduction */}
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
        {statistics.map((stat) => {
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

              <p className="mt-2 text-xs text-gray-500">{stat.description}</p>
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
          Start by adding your students. Your grading tables will be generated
          automatically once your class is created.
        </p>

        <button className="mt-6 flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium transition hover:bg-white/5">
          <Plus size={17} />
          Add your first student
        </button>
      </div>
    </section>
  );
}

export default Dashboard;
