import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "gradient-gold hover:opacity-90 disabled:opacity-50",
  secondary:
    "theme-btn-outline border border-gold/50 text-gold hover:bg-gold/10 disabled:opacity-50",
  ghost:
    "text-muted hover:text-gold disabled:opacity-50",
  danger:
    "border border-red-500/50 text-red-400 hover:bg-red-500/10 disabled:opacity-50",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all ${variants[variant]} ${className}`}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
