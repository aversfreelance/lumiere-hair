import Link from "next/link";
import { SalonImage } from "@/components/ui/SalonImage";

const stylists = [
  { id: 1, name: "Isabella Chen", title: "Creative Director", bio: "15 years of haute coiffure and visionary colour work.", imageUrl: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&q=80", specialties: ["Balayage", "Editorial", "Colour Correction"] },
  { id: 2, name: "Marcus Webb", title: "Senior Stylist", bio: "Precision cuts and modern men's grooming.", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", specialties: ["Precision Cuts", "Men's Grooming"] },
  { id: 3, name: "Sofia Laurent", title: "Colour Specialist", bio: "Flawless, vibrant colour while maintaining hair health.", imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80", specialties: ["Vivid Colour", "Balayage"] },
  { id: 4, name: "James Okonkwo", title: "Styling Expert", bio: "From red carpet updos to effortless everyday looks.", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80", specialties: ["Bridal", "Updos", "Events"] },
];

export function YoungStylistsPage() {
  return (
    <div className="ss-page-box">
      <h1 className="ss-page-title">
        Our <span>Stylists</span>
      </h1>
      <div className="ss-stylist-grid">
        {stylists.map((stylist) => (
          <div key={stylist.id} className="ss-stylist-card">
            <SalonImage
              src={stylist.imageUrl}
              alt={stylist.name}
              variant="portrait"
              className="h-[120px] w-[120px] shrink-0 object-cover rounded-xl"
            />
            <div>
              <span className="ss-news-category">{stylist.title}</span>
              <h3 className="ss-news-big-title" style={{ fontSize: 18, marginTop: 8 }}>
                {stylist.name}
              </h3>
              <p className="ss-news-lead">{stylist.bio}</p>
              <div className="ss-tags" style={{ marginTop: 12, marginBottom: 12 }}>
                {stylist.specialties.map((s) => (
                  <span key={s} className="ss-tag" style={{ fontSize: 11, padding: "4px 10px" }}>
                    {s}
                  </span>
                ))}
              </div>
              <Link href={`/booking?stylist=${stylist.id}`} className="ss-more-link">
                Book with {stylist.name.split(" ")[0]}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
