"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input, Label, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/booking-utils";
import { sortServicesByPrice } from "@/lib/services-data";

type Service = {
  id: number;
  name: string;
  description: string;
  category: string;
  durationMinutes: number;
  priceCents: number;
  isActive: boolean;
};

type EditForm = {
  name: string;
  description: string;
  category: string;
  durationMinutes: string;
  pricePounds: string;
};

function toEditForm(service: Service): EditForm {
  return {
    name: service.name,
    description: service.description,
    category: service.category,
    durationMinutes: String(service.durationMinutes),
    pricePounds: (service.priceCents / 100).toFixed(2),
  };
}

export default function AdminServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Cut & Style",
    durationMinutes: "60",
    pricePounds: "65.00",
  });

  useEffect(() => {
    fetch("/api/admin/services")
      .then((r) => {
        if (r.status === 401) router.push("/admin");
        return r.json();
      })
      .then((rows: Service[]) => setServices(sortServicesByPrice(rows)));
  }, [router]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        category: form.category,
        durationMinutes: Number(form.durationMinutes),
        priceCents: Math.round(Number(form.pricePounds) * 100),
        isActive: true,
      }),
    });
    const created = await res.json();
    setServices((prev) => sortServicesByPrice([...prev, created]));
    setShowForm(false);
    setForm({
      name: "",
      description: "",
      category: "Cut & Style",
      durationMinutes: "60",
      pricePounds: "65.00",
    });
  }

  function startEdit(service: Service) {
    setEditingId(service.id);
    setEditForm(toEditForm(service));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(null);
  }

  async function saveEdit(id: number) {
    if (!editForm) return;
    setSavingId(id);

    const res = await fetch("/api/admin/services", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name: editForm.name,
        description: editForm.description,
        category: editForm.category,
        durationMinutes: Number(editForm.durationMinutes),
        priceCents: Math.round(Number(editForm.pricePounds) * 100),
      }),
    });

    const updated = await res.json();
    setServices((prev) => sortServicesByPrice(prev.map((s) => (s.id === id ? updated : s))));
    setSavingId(null);
    cancelEdit();
  }

  async function toggleActive(id: number, isActive: boolean) {
    const res = await fetch("/api/admin/services", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !isActive }),
    });
    const updated = await res.json();
    setServices((prev) => sortServicesByPrice(prev.map((s) => (s.id === id ? updated : s))));
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">Services & Pricing</h1>
          <p className="mt-2 text-muted">
            Edit prices and services used across Elegant, Young, and Style themes
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/bookings">
            <Button variant="secondary">View Bookings</Button>
          </Link>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add Service"}
          </Button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mt-8 space-y-4 border border-border bg-surface-elevated p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option>Cut & Style</option>
                <option>Color</option>
                <option>Treatment</option>
                <option>Special Occasion</option>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price (£)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={form.pricePounds}
                onChange={(e) => setForm({ ...form, pricePounds: e.target.value })}
                required
              />
            </div>
          </div>
          <Button type="submit">Save Service</Button>
        </form>
      )}

      <div className="mt-8 divide-y divide-border border border-border">
        {services.map((service) => (
          <div key={service.id} className="bg-surface-elevated/50 p-6">
            {editingId === service.id && editForm ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor={`edit-name-${service.id}`}>Name</Label>
                    <Input
                      id={`edit-name-${service.id}`}
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`edit-category-${service.id}`}>Category</Label>
                    <Select
                      id={`edit-category-${service.id}`}
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    >
                      <option>Cut & Style</option>
                      <option>Color</option>
                      <option>Treatment</option>
                      <option>Special Occasion</option>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor={`edit-description-${service.id}`}>Description</Label>
                  <Textarea
                    id={`edit-description-${service.id}`}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor={`edit-duration-${service.id}`}>Duration (minutes)</Label>
                    <Input
                      id={`edit-duration-${service.id}`}
                      type="number"
                      value={editForm.durationMinutes}
                      onChange={(e) => setEditForm({ ...editForm, durationMinutes: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`edit-price-${service.id}`}>Price (£)</Label>
                    <Input
                      id={`edit-price-${service.id}`}
                      type="number"
                      step="0.01"
                      min="0"
                      value={editForm.pricePounds}
                      onChange={(e) => setEditForm({ ...editForm, pricePounds: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => saveEdit(service.id)} loading={savingId === service.id}>
                    Save Changes
                  </Button>
                  <Button variant="ghost" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gold">{service.category}</p>
                  <p className="font-serif text-lg">{service.name}</p>
                  <p className="mt-1 text-sm text-muted">{service.description}</p>
                  <p className="mt-2 text-sm">
                    {service.durationMinutes} min ·{" "}
                    <span className="text-gold-light">{formatPrice(service.priceCents)}</span>
                    {!service.isActive && (
                      <span className="ml-2 text-xs uppercase tracking-widest text-muted">(inactive)</span>
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => startEdit(service)}>
                    Edit
                  </Button>
                  <Button
                    variant={service.isActive ? "ghost" : "primary"}
                    onClick={() => toggleActive(service.id, service.isActive)}
                  >
                    {service.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
