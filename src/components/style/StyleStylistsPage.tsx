import Link from "next/link";
import { StylePageHero } from "@/components/style/StylePageHero";
import { StyleStylistPortrait } from "@/components/style/StyleStylistPortrait";

const stylists = [
  { id: 1, name: "Isabelle Laurent", title: "Creative Director", bio: "15 years crafting bespoke looks for London's fashion elite.", image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&q=80" },
  { id: 2, name: "Marcus Chen", title: "Senior Colourist", bio: "Specialist in balayage, creative colour, and seamless root blends.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { id: 3, name: "Sophie Williams", title: "Styling Specialist", bio: "Bridal and editorial styling with an eye for timeless elegance.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
  { id: 4, name: "James Okonkwo", title: "Men's Grooming Lead", bio: "Contemporary men's cuts and grooming with precision and care.", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
];

export function StyleStylistsPage() {
  return (
    <>
      <StylePageHero title="Stylists" subtitle="meet our team" />
      <section className="st-hosts-section st-hosts-section-page">
        <div className="st-container st-page">
        <div className="st-hosts-track st-hosts-page">
          {stylists.map((stylist, i) => (
            <div key={stylist.id} className="st-host-slide">
              <StyleStylistPortrait src={stylist.image} alt={stylist.name} index={i} />
              <h3 className="st-host-slide-name">{stylist.name.split(" ")[0]}</h3>
              <p className="st-host-role">{stylist.title}</p>
              <p className="st-host-bio">{stylist.bio}</p>
              <Link href={`/booking?stylist=${stylist.id}`} className="st-btn st-btn-teal">
                Book with {stylist.name.split(" ")[0]}
              </Link>
            </div>
          ))}
        </div>
        </div>
      </section>
    </>
  );
}
