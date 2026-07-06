"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format, addDays, startOfToday } from "date-fns";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea, Label, FieldError } from "@/components/ui/Input";
import { formatPrice } from "@/lib/booking-utils";

type Service = {
  id: number;
  name: string;
  durationMinutes: number;
  priceCents: number;
};

type Stylist = {
  id: number;
  name: string;
  title: string;
};

const STEPS = ["Service", "Stylist", "Date & Time", "Details", "Confirm"];

export function BookingForm() {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service");
  const preselectedStylist = searchParams.get("stylist");
  const preselectedDate = searchParams.get("date");
  const preselectedTime = searchParams.get("time");

  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [serviceId, setServiceId] = useState(preselectedService || "");
  const [stylistId, setStylistId] = useState(preselectedStylist || "");
  const [date, setDate] = useState(
    preselectedDate || format(addDays(startOfToday(), 1), "yyyy-MM-dd")
  );
  const [time, setTime] = useState(preselectedTime || "");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then(setServices)
      .catch(() => {});
    fetch("/api/stylists")
      .then((r) => r.json())
      .then(setStylists)
      .catch(() => {});
  }, []);

  const selectedService = services.find((s) => s.id === Number(serviceId));
  const selectedStylist = stylists.find((s) => s.id === Number(stylistId));

  const loadSlots = useCallback(async () => {
    if (!serviceId || !stylistId || !date) return;
    setSlotsLoading(true);
    setTime("");
    try {
      const res = await fetch(
        `/api/availability?stylistId=${stylistId}&serviceId=${serviceId}&date=${date}`
      );
      const data = await res.json();
      setSlots(data.slots || []);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, [serviceId, stylistId, date]);

  useEffect(() => {
    if (step === 2) loadSlots();
  }, [step, loadSlots]);

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: Number(serviceId),
          stylistId: Number(stylistId),
          bookingDate: date,
          startTime: time,
          clientName,
          clientEmail,
          clientPhone,
          notes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="border border-gold/30 bg-surface-elevated p-12 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold">
          <span className="text-2xl text-gold">✓</span>
        </div>
        <h2 className="font-serif text-3xl">Booking Confirmed</h2>
        <p className="mt-4 text-muted">
          Thank you, {clientName}! Your appointment with {selectedStylist?.name} for{" "}
          {selectedService?.name} on {format(new Date(date), "MMMM d, yyyy")} at{" "}
          {time.slice(0, 5)} has been received.
        </p>
        <p className="mt-2 text-sm text-muted">
          A confirmation email will be sent to {clientEmail}.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10 flex items-center justify-between">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center">
            <div
              className={`booking-step-active flex h-8 w-8 items-center justify-center text-xs font-semibold ${
                i <= step
                  ? "gradient-gold text-background"
                  : "border border-border text-muted"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`ml-2 hidden text-xs uppercase tracking-widest sm:inline ${
                i <= step ? "text-gold" : "text-muted"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`mx-4 h-px flex-1 ${i < step ? "bg-gold" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="border border-border bg-surface-elevated p-8">
        {step === 0 && (
          <div>
            <h2 className="font-serif text-2xl">Select a Service</h2>
            <div className="mt-6 grid gap-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setServiceId(String(service.id))}
                  className={`flex items-center justify-between border p-4 text-left transition-all ${
                    serviceId === String(service.id)
                      ? "border-gold bg-gold/5"
                      : "border-border hover:border-gold/30"
                  }`}
                >
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-muted">{service.durationMinutes} minutes</p>
                  </div>
                  <span className="text-gold-light">{formatPrice(service.priceCents)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-serif text-2xl">Choose Your Stylist</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {stylists.map((stylist) => (
                <button
                  key={stylist.id}
                  type="button"
                  onClick={() => setStylistId(String(stylist.id))}
                  className={`border p-6 text-left transition-all ${
                    stylistId === String(stylist.id)
                      ? "border-gold bg-gold/5"
                      : "border-border hover:border-gold/30"
                  }`}
                >
                  <p className="font-serif text-lg">{stylist.name}</p>
                  <p className="text-sm text-muted">{stylist.title}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-serif text-2xl">Pick Date & Time</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  min={format(addDays(startOfToday(), 1), "yyyy-MM-dd")}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6">
              <Label>Available Times</Label>
              {slotsLoading ? (
                <p className="mt-4 text-sm text-muted">Loading availability...</p>
              ) : slots.length === 0 ? (
                <p className="mt-4 text-sm text-muted">No available slots for this date.</p>
              ) : (
                <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`border py-2 text-sm transition-all ${
                        time === slot
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-border hover:border-gold/30"
                      }`}
                    >
                      {slot.slice(0, 5)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-serif text-2xl">Your Details</h2>
            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="clientName">Full Name</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="jane@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="clientPhone">Phone</Label>
                <Input
                  id="clientPhone"
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requests..."
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="font-serif text-2xl">Confirm Your Booking</h2>
            <dl className="mt-6 space-y-4 border border-border p-6">
              <div className="flex justify-between">
                <dt className="text-muted">Service</dt>
                <dd>{selectedService?.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Stylist</dt>
                <dd>{selectedStylist?.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Date</dt>
                <dd>{format(new Date(date), "EEEE, MMMM d, yyyy")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Time</dt>
                <dd>{time.slice(0, 5)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-4">
                <dt className="text-muted">Total</dt>
                <dd className="text-xl text-gold-light">
                  {selectedService ? formatPrice(selectedService.priceCents) : "—"}
                </dd>
              </div>
            </dl>
            <FieldError message={error} />
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Back
          </Button>
          {step < 4 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={
                (step === 0 && !serviceId) ||
                (step === 1 && !stylistId) ||
                (step === 2 && !time) ||
                (step === 3 && (!clientName || !clientEmail || !clientPhone))
              }
            >
              Continue
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={loading}>
              Confirm Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
