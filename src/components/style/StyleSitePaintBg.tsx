const SITE_STRIPES = [
  { color: "#8E33EA", top: "4%", left: "-14%", width: "78%", scale: 1.15, rotate: -24 },
  { color: "#5AEBDA", top: "10%", left: "36%", width: "58%", scale: 0.82, rotate: 18 },
  { color: "#17F51E", top: "17%", left: "-10%", width: "64%", scale: 1.05, rotate: 6 },
  { color: "#0085FF", top: "24%", left: "42%", width: "72%", scale: 0.95, rotate: -20 },
  { color: "#8E33EA", top: "32%", left: "2%", width: "48%", scale: 0.72, rotate: 32 },
  { color: "#5AEBDA", top: "39%", left: "-12%", width: "82%", scale: 1.22, rotate: -12 },
  { color: "#17F51E", top: "47%", left: "38%", width: "62%", scale: 1, rotate: 22 },
  { color: "#0085FF", top: "55%", left: "-8%", width: "70%", scale: 0.9, rotate: -30 },
  { color: "#8E33EA", top: "63%", left: "32%", width: "54%", scale: 0.78, rotate: 10 },
  { color: "#5AEBDA", top: "71%", left: "-16%", width: "86%", scale: 1.28, rotate: -22 },
  { color: "#17F51E", top: "79%", left: "44%", width: "60%", scale: 0.98, rotate: 16 },
  { color: "#0085FF", top: "87%", left: "0%", width: "66%", scale: 1.08, rotate: -8 },
  { color: "#8E33EA", top: "94%", left: "36%", width: "50%", scale: 0.68, rotate: 28 },
] as const;

export function StyleSitePaintBg() {
  return (
    <div className="st-site-paint-bg" aria-hidden="true">
      {SITE_STRIPES.map((stripe, i) => (
        <span
          key={i}
          className="st-site-paint-stripe"
          style={{
            backgroundColor: stripe.color,
            top: stripe.top,
            left: stripe.left,
            width: stripe.width,
            transform: `rotate(${stripe.rotate}deg) scale(${stripe.scale})`,
          }}
        />
      ))}
    </div>
  );
}
