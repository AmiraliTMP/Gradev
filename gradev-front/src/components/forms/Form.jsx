import { AlertCircle } from "lucide-react";

const INPUT_CLASSES =
  "w-full rounded-xl border border-white/5 bg-[#0B0D10] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50";

const LABEL_CLASSES = "mb-2 block text-sm font-medium text-gray-300";

function Form({
  fields = [],
  values = {},
  onChange,
  error,
  className = "space-y-5",
}) {
  function handleChange(event) {
    const { name, type, value, checked } = event.target;

    onChange?.(name, type === "checkbox" ? checked : value);
  }

  return (
    <div className={className}>
      {fields.map((field) => {
        const {
          name,
          label,
          type = "text",
          placeholder = "",
          options = [],
          required = false,
          disabled = false,
          maxLength,
          rows = 4,
          description,
          colSpan = "col-span-1",
        } = field;

        const value = values[name] ?? "";

        return (
          <div key={name} className={colSpan}>
            {type !== "checkbox" && (
              <label htmlFor={name} className={LABEL_CLASSES}>
                {label}

                {required && <span className="ml-1 text-emerald-400">*</span>}
              </label>
            )}

            {type === "select" ? (
              <select
                id={name}
                name={name}
                value={value}
                onChange={handleChange}
                required={required}
                disabled={disabled}
                className={INPUT_CLASSES}
              >
                {options.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-[#101216]"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            ) : type === "textarea" ? (
              <textarea
                id={name}
                name={name}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                maxLength={maxLength}
                rows={rows}
                className={`${INPUT_CLASSES} resize-y`}
              />
            ) : type === "checkbox" ? (
              <label
                htmlFor={name}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/5 bg-[#0B0D10] p-4 transition hover:border-emerald-500/20"
              >
                <input
                  id={name}
                  name={name}
                  type="checkbox"
                  checked={Boolean(value)}
                  onChange={handleChange}
                  disabled={disabled}
                  className="h-4 w-4 accent-emerald-500"
                />

                <span className="text-sm text-gray-300">{label}</span>
              </label>
            ) : (
              <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                maxLength={maxLength}
                className={INPUT_CLASSES}
              />
            )}

            {description && (
              <p className="mt-2 text-xs text-gray-500">{description}</p>
            )}

            {type === "text" && maxLength && (
              <p className="mt-2 text-right text-xs text-gray-500">
                {String(value).length}/{maxLength}
              </p>
            )}
          </div>
        );
      })}

      {error && (
        <div className="col-span-full flex items-start gap-3 rounded-xl border border-red-500/10 bg-red-500/5 p-3">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-400" />

          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}

export default Form;
