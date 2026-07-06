"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Stylist = {
  id: number;
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
  specialties: string[];
  isActive: boolean;
};

export default function AdminStylistsPage() {
  const router = useRouter();
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    title: "",
    bio: "",
    imageUrl: "",
    specialties: "",
  });

  useEffect(() => {
    fetch("/api/admin/stylists")
      .then((r) => {
        if (r.status === 401) router.push("/admin");
        return r.json();
      })
      .then(setStylists);
  }, [router]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/stylists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        specialties: form.specialties.split(",").map((s) => s.trim()).filter(Boolean),
        isActive: true,
      }),
    });
    const created = await res.json();
    setStylists((prev) => [...prev, created]);
    setShowForm(false);
    setForm({ name: "", title: "", bio: "", imageUrl: "", specialties: "" });
  }

  async function toggleActive(id: number, isActive: boolean) {
    const res = await fetch("/api/admin/stylists", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !isActive }),
    });
    const updated = await res.json();
    setStylists((prev) => prev.map((s) => (s.id === id ? updated : s)));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">Stylists</h1>
          <p className="mt-2 text-muted">Manage your team of hair stylists</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Stylist"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mt-8 space-y-4 border border-border bg-surface-elevated p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="specialties">Specialties (comma-separated)</Label>
            <Input id="specialties" value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} />
          </div>
          <Button type="submit">Save Stylist</Button>
        </form>
      )}

      <div className="mt-8 grid gap-4">
        {stylists.map((stylist) => (
          <div key={stylist.id} className="flex items-center justify-between border border-border bg-surface-elevated p-6">
            <div>
              <p className="font-serif text-lg">{stylist.name}</p>
              <p className="text-sm text-muted">{stylist.title}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {stylist.specialties?.map((s) => (
                  <span key={s} className="text-xs text-gold">{s}</span>
                ))}
              </div>
            </div>
            <Button
              variant={stylist.isActive ? "secondary" : "primary"}
              onClick={() => toggleActive(stylist.id, stylist.isActive)}
            >
              {stylist.isActive ? "Deactivate" : "Activate"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
