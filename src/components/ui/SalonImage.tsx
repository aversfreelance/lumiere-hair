"use client";

import { useState } from "react";
import { PlaceholderContent, PlaceholderVariant } from "./placeholders";

type SalonImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  variant?: PlaceholderVariant;
  placeholderLabel?: string;
};

export function SalonImage({
  src,
  alt,
  className = "",
  variant = "square",
  placeholderLabel,
}: SalonImageProps) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src?.trim() || failed;

  if (showPlaceholder) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <PlaceholderContent variant={variant} label={placeholderLabel || alt} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src as string}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}

type SalonBackgroundProps = {
  src?: string | null;
  alt: string;
  className?: string;
  variant?: PlaceholderVariant;
  placeholderLabel?: string;
  children?: React.ReactNode;
};

export function SalonBackground({
  src,
  alt,
  className = "",
  variant = "hero",
  placeholderLabel,
  children,
}: SalonBackgroundProps) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src?.trim() || failed;

  if (showPlaceholder) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <PlaceholderContent variant={variant} label={placeholderLabel || alt} />
        {children}
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src as string}
        alt={alt}
        className="block h-full w-full object-cover object-center"
        onError={() => setFailed(true)}
        loading={variant === "hero" ? "eager" : "lazy"}
        decoding="async"
      />
      {children}
    </div>
  );
}
