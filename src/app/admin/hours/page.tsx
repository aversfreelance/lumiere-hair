"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  DAY_LABELS,
  FALLBACK_OPENING_HOURS,
  toTimeInputValue,
  type OpeningHourRow,
} from "@/lib/opening-hours";

type DayForm = {
  dayOfWeek: number;
  isOpen: boolean;
  startTime: string;
  endTime: string;
};

function toForm(rows: OpeningHourRow[]): DayForm[] {
  return DAY_LABELS.map((_, dayOfWeek) => {
    const row = rows.find((r) => r.dayOfWeek === dayOfWeek) ?? FALLBACK_OPENING_HOURS[dayOfWeek];
    return {
      dayOfWeek,
      isOpen: row.isOpen,
      startTime: toTimeInputValue(row.startTime),
      endTime: toTimeInputValue(row.endTime),
    };
  });
}

export default function AdminOpeningHoursPage() {
  const router = useRouter();
  const [days, setDays] = useState<DayForm[]>(toForm(FALLBACK_OPENING_HOURS));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/opening-hours")
      .then((r) => {
        if (r.status === 401) router.push("/admin");
        return r.json();
      })
      .then((rows: OpeningHourRow[]) => {
        if (Array.isArray(rows) && rows.length > 0) {
          setDays(toForm(rows));
        }
      });
  }, [router]);

  function updateDay(dayOfWeek: number, patch: Partial<DayForm>) {
    setSaved(false);
    setDays((prev) => prev.map((day) => (day.dayOfWeek === dayOfWeek ? { ...day, ...patch } : day)));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/admin/opening-hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(days),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save opening hours");
      setDays(toForm(data));
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save opening hours");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div>
        <h1 className="font-serif text-3xl">Opening Hours</h1>
        <p className="mt-2 text-muted">
          Booking slots and homepage schedules follow these hours across all themes.
        </p>
      </div>

      <form onSubmit={handleSave} className="mt-8 space-y-4">
        <div className="overflow-x-auto border border-border bg-surface-elevated">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-widest text-muted">
              <tr>
                <th className="p-4">Day</th>
                <th className="p-4">Open</th>
                <th className="p-4">Opens</th>
                <th className="p-4">Closes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {days.map((day) => (
                <tr key={day.dayOfWeek}>
                  <td className="p-4 font-medium">{DAY_LABELS[day.dayOfWeek]}</td>
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={day.isOpen}
                      onChange={(e) => updateDay(day.dayOfWeek, { isOpen: e.target.checked })}
                      className="h-4 w-4 accent-[var(--ss-orange,#fbaa31)]"
                    />
                  </td>
                  <td className="p-4">
                    <Input
                      type="time"
                      value={day.startTime}
                      disabled={!day.isOpen}
                      onChange={(e) => updateDay(day.dayOfWeek, { startTime: e.target.value })}
                    />
                  </td>
                  <td className="p-4">
                    <Input
                      type="time"
                      value={day.endTime}
                      disabled={!day.isOpen}
                      onChange={(e) => updateDay(day.dayOfWeek, { endTime: e.target.value })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {saved && <p className="text-sm text-gold">Opening hours saved.</p>}

        <Button type="submit" loading={saving}>
          Save Opening Hours
        </Button>
      </form>
    </div>
  );
}
