import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  onSubmit,
  submitText = "Save",
  cancelText = "Cancel",
  isSubmitting = false,
  size = "md",
  showFooter = true,
  variant = "default",
}) {
  // ----------------------------------
  // Modal Sizes
  // ----------------------------------

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-4xl",
  };

  // ----------------------------------
  // Modal Variants
  // ----------------------------------

  const variants = {
    default: {
      border: "border-white/5",
      icon: "bg-emerald-500/10 text-emerald-400",
      submit: "bg-emerald-500 text-[#0B0D10] hover:bg-emerald-400",
    },

    danger: {
      border: "border-red-500/10",
      icon: "bg-red-500/10 text-red-400",
      submit: "bg-red-500 text-white hover:bg-red-400",
    },
  };

  const currentVariant = variants[variant] || variants.default;

  // ----------------------------------
  // Escape Key
  // ----------------------------------

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event) {
      if (event.key === "Escape" && !isSubmitting) {
        onClose?.();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isSubmitting, onClose]);

  // ----------------------------------
  // Submit Handler
  // ----------------------------------

  function handleSubmit(event) {
    event.preventDefault();

    if (!onSubmit || isSubmitting) return;

    onSubmit(event);
  }

  // ----------------------------------
  // Modal Visibility
  // ----------------------------------

  if (!isOpen) return null;

  // ----------------------------------
  // Render
  // ----------------------------------

  const Content = onSubmit ? "form" : "div";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose?.();
        }
      }}
    >
      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`flex max-h-[90vh] w-full ${sizes[size] || sizes.md} flex-col overflow-hidden rounded-2xl border ${currentVariant.border} bg-[#101216] shadow-[0_25px_80px_rgba(0,0,0,0.5)]`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/5 bg-[#101216] px-5 py-5 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${currentVariant.icon}`}
            >
              <span className="text-lg font-bold">
                {variant === "danger" ? "!" : "+"}
              </span>
            </div>

            <div className="min-w-0">
              <h2
                id="modal-title"
                className="text-base font-semibold text-white sm:text-lg"
              >
                {title}
              </h2>

              {description && (
                <p className="mt-1 text-xs leading-5 text-gray-400 sm:text-sm">
                  {description}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="shrink-0 rounded-xl border border-white/5 bg-[#1B1F25] p-2 text-gray-400 transition hover:border-white/10 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <Content
          onSubmit={onSubmit ? handleSubmit : undefined}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
            {children}
          </div>

          {/* Footer */}
          {showFooter && (
            <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-white/5 bg-[#0D0F12] p-4 sm:flex-row sm:justify-end sm:px-6 sm:py-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-xl border border-white/5 bg-[#15181D] px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:border-white/10 hover:bg-[#1B1F25] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelText}
              </button>

              {onSubmit && (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${currentVariant.submit}`}
                >
                  {isSubmitting && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  )}

                  {isSubmitting ? "Processing..." : submitText}
                </button>
              )}
            </div>
          )}
        </Content>
      </div>
    </div>
  );
}
