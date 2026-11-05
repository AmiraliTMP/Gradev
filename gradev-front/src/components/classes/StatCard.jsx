function StatCard({ title, value, icon: Icon, color = "emerald" }) {
  const colorClasses = {
    emerald: "bg-emerald-500/10 text-emerald-400",
    blue: "bg-blue-500/10 text-blue-400",
    purple: "bg-purple-500/10 text-purple-400",
    orange: "bg-orange-500/10 text-orange-400",
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-[#101216] p-5 transition hover:border-white/10">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{title}</p>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            colorClasses[color] || colorClasses.emerald
          }`}
        >
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold tracking-tight text-white">
        {value}
      </p>
    </div>
  );
}

export default StatCard;
