import { useQuery } from "@tanstack/react-query";
import {
  ChartNoAxesColumnIncreasing,
  ClipboardList,
  GraduationCap,
  Plus,
  Users,
} from "lucide-react";

import Statistics from "../../components/Statistics";
import classesServices from "../../services/classes/classes";

function Dashboard() {
  const {
    data: classesResponse,
    isLoading: isClassesLoading,
    isError: isClassesError,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: () => classesServices.getClasses({ limit: 100 }),
  });

  // Extract classes from the API response
  const classes =
    classesResponse?.data?.classes ??
    classesResponse?.classes ??
    classesResponse?.data ??
    [];

  const totalClasses = Array.isArray(classes) ? classes.length : 0;

  const statistics = [
    {
      title: "Total Students",
      value: "0",
      description: "Students enrolled",
      icon: Users,
    },
    {
      title: "Active Classes",
      value: isClassesLoading ? "..." : isClassesError ? "—" : totalClasses,
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
      <Statistics statistics={statistics} />

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
