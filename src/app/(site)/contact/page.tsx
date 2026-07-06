import type { Metadata } from "next";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ThemePageSwitch } from "@/components/theme/ThemePageSwitch";
import { YoungContactPage } from "@/components/young/YoungContactPage";
import { StyleContactPage } from "@/components/style/StyleContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Lumière Hair Atelier.",
};

export default function ContactPage() {
  return (
    <ThemePageSwitch elegant={<ElegantContactPage />} young={<YoungContactPage />} style={<StyleContactPage />} />
  );
}

function ElegantContactPage() {
  return (
    <div>
      <section className="border-b border-border bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">Get in Touch</p>
          <h1 className="font-serif mt-4 text-5xl md:text-6xl">Contact Us</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-serif text-3xl">Visit the Atelier</h2>
            <div className="mt-8 space-y-6 text-muted">
              <div>
                <p className="text-xs uppercase tracking-widest text-gold">Address</p>
                <p className="mt-2">42 Brook Street<br />Mayfair, London W1K 5DB</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gold">Phone</p>
                <p className="mt-2">+44 20 7123 4567</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gold">Email</p>
                <p className="mt-2">hello@lumiere-hair.com</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gold">Hours</p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>Monday – Friday: 9:00 AM – 7:00 PM</li>
                  <li>Saturday: 9:00 AM – 6:00 PM</li>
                  <li>Sunday: Closed</li>
                </ul>
              </div>
            </div>

            <div className="mt-12 aspect-video border border-border bg-surface-elevated">
              <iframe
                title="Salon location"
                src="https://maps.google.com/maps?q=Brook+Street+Mayfair+London&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="h-full w-full border-0 grayscale"
                loading="lazy"
              />
            </div>
          </div>

          <div className="border border-border bg-surface-elevated p-8">
            <h2 className="font-serif text-2xl">Send a Message</h2>
            <form className="mt-8 space-y-6" action="#" method="post">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Your name" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" placeholder="How can we help?" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" placeholder="Your message..." required />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
