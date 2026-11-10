function Statistics({ statistics = [] }) {
  return (
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
  );
}

export default Statistics;
