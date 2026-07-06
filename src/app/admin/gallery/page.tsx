"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input, Label, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GALLERY_CATEGORIES } from "@/lib/gallery-data";

type GalleryItem = {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
};

const emptyForm = {
  title: "",
  category: "Color",
  imageUrl: "",
  sortOrder: "",
};

export default function AdminGalleryPage() {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/gallery")
      .then((r) => {
        if (r.status === 401) router.push("/admin");
        return r.json();
      })
      .then(setItems);
  }, [router]);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  function resetForm() {
    setForm(emptyForm);
    setPhotoFile(null);
    setPhotoPreview(null);
    setError("");
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPhotoFile(null);
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPG, PNG, or WebP images are allowed.");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      e.target.value = "";
      return;
    }
    setError("");
    setPhotoFile(file);
    setForm((prev) => ({ ...prev, imageUrl: "" }));
  }

  async function uploadPhoto(file: File): Promise<string> {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", "gallery");
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url as string;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let imageUrl = form.imageUrl.trim();
      if (photoFile) {
        imageUrl = await uploadPhoto(photoFile);
      }
      if (!imageUrl) {
        throw new Error("Please upload a photo or paste an image URL.");
      }

      const nextSortOrder =
        form.sortOrder.trim() !== ""
          ? Number(form.sortOrder)
          : items.reduce((max, item) => Math.max(max, item.sortOrder), 0) + 1;

      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          imageUrl,
          sortOrder: nextSortOrder,
          isActive: true,
        }),
      });

      const created = await res.json();
      if (!res.ok) throw new Error(created.error || "Failed to save gallery image");

      setItems((prev) => [...prev, created].sort((a, b) => a.sortOrder - b.sortOrder));
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save gallery image");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(id: number, isActive: boolean) {
    const res = await fetch("/api/admin/gallery", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !isActive }),
    });
    const updated = await res.json();
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
  }

  async function deleteItem(id: number) {
    if (!confirm("Delete this gallery image?")) return;
    const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">Gallery</h1>
          <p className="mt-2 text-muted">Upload and manage portfolio images across all themes</p>
        </div>
        <Button
          onClick={() => {
            if (showForm) resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? "Cancel" : "Add Image"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mt-8 space-y-4 border border-border bg-surface-elevated p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
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
                {GALLERY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="photo">Photo</Label>
            <input
              id="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              className="admin-file-input mt-2 block w-full text-sm text-muted file:mr-4 file:rounded-xl file:border-0 file:bg-gold file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-widest file:text-black hover:file:opacity-90"
            />
            {photoPreview && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoPreview} alt="Preview" className="max-h-64 w-full object-cover" />
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="imageUrl">Or image URL</Label>
              <Input
                id="imageUrl"
                value={form.imageUrl}
                onChange={(e) => {
                  setForm({ ...form, imageUrl: e.target.value });
                  if (e.target.value.trim()) setPhotoFile(null);
                }}
                placeholder="https://..."
                disabled={Boolean(photoFile)}
              />
            </div>
            <div>
              <Label htmlFor="sortOrder">Sort order (optional)</Label>
              <Input
                id="sortOrder"
                type="number"
                min={1}
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                placeholder="Auto"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" loading={saving}>
            Save Image
          </Button>
        </form>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className={`overflow-hidden border border-border bg-surface-elevated ${!item.isActive ? "opacity-50" : ""}`}
          >
            <div className="relative aspect-[4/3]">
              <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="400px" unoptimized />
            </div>
            <div className="p-4">
              <p className="text-xs uppercase tracking-widest text-gold">{item.category}</p>
              <h2 className="font-serif mt-1 text-lg">{item.title}</h2>
              <p className="mt-1 text-xs text-muted">Order: {item.sortOrder}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant={item.isActive ? "secondary" : "primary"}
                  onClick={() => toggleActive(item.id, item.isActive)}
                >
                  {item.isActive ? "Hide" : "Show"}
                </Button>
                <Button variant="danger" onClick={() => deleteItem(item.id)}>
                  Delete
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
