import { BookOpen, Pencil, Trash2 } from "lucide-react";

export function getClassUnits(classItem) {
  if (!Array.isArray(classItem?.units)) {
    return [];
  }

  return classItem.units;
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#101216] p-3">
      <p className="text-xs text-gray-500">{label}</p>

      <p className="mt-1 truncate text-sm font-medium text-gray-200">
        {value || "—"}
      </p>
    </div>
  );
}

function ClassCard({ classItem, onEdit, onDelete }) {
  const units = getClassUnits(classItem);

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/5 bg-[#101216] transition duration-300 hover:-translate-y-1 hover:border-emerald-500/20 hover:bg-[#12151A]">
      {/* Card Header */}
      <div className="flex items-start justify-between gap-4 border-b border-white/5 p-5">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
            <BookOpen size={23} className="text-emerald-400" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-white">
              {classItem.groupName}
            </h3>

            <p className="mt-1 truncate text-sm text-gray-400">
              {classItem.book} · Level {classItem.level} · Semester{" "}
              {classItem.semester}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(classItem)}
            title="Edit class"
            aria-label="Edit class"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-emerald-500/10 hover:text-emerald-400"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(classItem)}
            title="Delete class"
            aria-label="Delete class"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="space-y-5 p-5">
        <div className="grid grid-cols-2 gap-3">
          <InfoItem label="Book" value={classItem.book} />

          <InfoItem
            label="Level"
            value={
              classItem.level === "Intro" ? "Intro" : `Level ${classItem.level}`
            }
          />

          <InfoItem label="Semester" value={`Semester ${classItem.semester}`} />

          <InfoItem label="Units" value={`${units.length} Units`} />
        </div>

        {/* Units */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Course Units
            </p>

            <span className="text-xs text-gray-500">{units.length} total</span>
          </div>

          {units.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {units.map((unit) => (
                <span
                  key={unit.unitNumber}
                  className="rounded-lg border border-white/5 bg-[#1B1F25] px-3 py-1.5 text-xs text-gray-300"
                >
                  Unit {unit.unitNumber}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500">No units assigned.</p>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between border-t border-white/5 bg-white/2 px-5 py-3">
        <span className="text-xs text-gray-500">Gradev Class</span>

        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Active
        </span>
      </div>
    </article>
  );
}

export default ClassCard;
