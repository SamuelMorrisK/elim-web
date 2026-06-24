// components/ContactForm.jsx
"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          name: form.name,
          email: form.email,
          message: form.message,
          subject: `New message from ${form.name} — Elim House of Worship`,
          // Honeypot: bots fill hidden fields; humans don't. (Handled below too.)
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="bg-white border border-[var(--color-forest)]/10 rounded-md p-8 text-center">
        <h3 className="text-2xl mb-2">Thank you, {form.name || "friend"}.</h3>
        <p className="text-[var(--color-muted)]">
          We've received your note and someone from the church will be in touch soon.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-sm border border-[var(--color-forest)]/20 bg-white px-4 py-3 text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot field — hidden from humans, catches bots */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1.5">
          Name
        </label>
        <input
          id="name"
          type="text"
          required
          value={form.name}
          onChange={update("name")}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1.5">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={update("email")}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          required
          value={form.message}
          onChange={update("message")}
          className={inputClass}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-[var(--color-clay)]">
          Something went wrong sending your message. Please try again, or email us
          directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-[var(--color-forest)] text-[var(--color-cream)] px-7 py-3 rounded-sm font-semibold text-sm tracking-wide hover:bg-[var(--color-clay)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}