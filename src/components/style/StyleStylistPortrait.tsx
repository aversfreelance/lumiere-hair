export function StyleStylistPortrait({
  src,
  alt,
}: {
  src: string;
  alt: string;
  index?: number;
}) {
  return (
    <div className="st-host-photo-wrap">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="st-host-photo" />
    </div>
  );
}
