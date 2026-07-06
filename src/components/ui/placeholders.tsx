export type PlaceholderVariant = "hero" | "portrait" | "square" | "carousel" | "thumb";

const gradients: Record<PlaceholderVariant, string> = {
  hero: "linear-gradient(135deg, #1c1917 0%, #44403c 50%, #9a7b3c 100%)",
  portrait: "linear-gradient(160deg, #292524 0%, #c9a962 100%)",
  square: "linear-gradient(145deg, #1c1917 0%, #9a7b3c 80%)",
  carousel: "linear-gradient(90deg, #0c0a09 0%, #46424f 50%, #fbaa31 100%)",
  thumb: "linear-gradient(135deg, #232128 0%, #fbaa31 100%)",
};

const icons: Record<PlaceholderVariant, string> = {
  hero: "✦",
  portrait: "👤",
  square: "✂",
  carousel: "☀",
  thumb: "♪",
};

export function getPlaceholderStyle(variant: PlaceholderVariant = "square") {
  return {
    background: gradients[variant],
  } as const;
}

export function PlaceholderContent({
  variant = "square",
  label,
}: {
  variant?: PlaceholderVariant;
  label?: string;
}) {
  return (
    <div
      className="image-placeholder flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center"
      style={getPlaceholderStyle(variant)}
    >
      <span className="image-placeholder-icon text-3xl opacity-80 md:text-4xl">
        {icons[variant]}
      </span>
      {label && (
        <span className="image-placeholder-label max-w-[90%] text-xs font-medium uppercase tracking-widest text-white/90 md:text-sm">
          {label}
        </span>
      )}
    </div>
  );
}

export const PLACEHOLDER_SRC = "/images/placeholder.svg";
