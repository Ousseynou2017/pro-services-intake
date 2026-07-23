"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { findService, services } from "@/lib/services";

type Errors = Record<string, string>;

const fieldClass =
  "w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-base outline-none transition-colors focus:border-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent";

const labelClass = "block text-sm font-medium";

export default function IntakeForm() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [submitError, setSubmitError] = useState("");

  const questions = findService(service)?.questions ?? [];

  function validate(target: number): Errors {
    const next: Errors = {};

    if (target === 1) {
      if (!name.trim()) next.name = "Please tell us your name.";
      if (!email.trim()) {
        next.email = "Please enter an email address.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        next.email = "That does not look like a valid email address.";
      }
    }

    if (target === 2 && !service) {
      next.service = "Please choose a service.";
    }

    if (target === 3) {
      for (const question of questions) {
        const value = (answers[question.id] ?? "").trim();
        if (!value) {
          next[question.id] = "This field is required.";
        } else if (question.type === "textarea" && value.length < 10) {
          next[question.id] = "Please give us a little more detail.";
        }
      }
    }

    return next;
  }

  /** Same rules as validate(), but for a single field and a candidate value. */
  function fieldError(id: string, value: string): string {
    const v = value.trim();
    if (id === "name") return v ? "" : "Please tell us your name.";
    if (id === "email") {
      if (!v) return "Please enter an email address.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        ? ""
        : "That does not look like a valid email address.";
    }
    const question = questions.find((q) => q.id === id);
    if (question) {
      if (!v) return "This field is required.";
      if (question.type === "textarea" && v.length < 10)
        return "Please give us a little more detail.";
    }
    return "";
  }

  /** On change, refresh a field's error only if it already had one, so the
   *  message clears as soon as the field becomes valid — without flagging
   *  fields the user has not submitted yet. */
  function revalidate(id: string, value: string) {
    setErrors((prev) => {
      if (!prev[id]) return prev;
      const message = fieldError(id, value);
      if (message === prev[id]) return prev;
      const next = { ...prev };
      if (message) next[id] = message;
      else delete next[id];
      return next;
    });
  }

  function goNext() {
    const found = validate(step);
    setErrors(found);
    if (Object.keys(found).length === 0) setStep(step + 1);
  }

  function goBack() {
    setErrors({});
    setStep(step - 1);
  }

  /** Changing the service invalidates the previous answers: the questions differ. */
  function pickService(nextService: string) {
    setService(nextService);
    setAnswers({});
    setErrors({});
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validate(3);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("sending");
    setSubmitError("");

    const { error } = await createClient()
      .from("requests")
      .insert({
        name: name.trim(),
        email: email.trim(),
        company: company.trim() || null,
        service,
        answers,
      });

    if (error) {
      setStatus("idle");
      setSubmitError(
        "We could not send your request. Please try again in a moment.",
      );
      return;
    }

    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-line bg-card p-6 sm:p-7">
        <h3 className="font-serif text-2xl">Request received</h3>
        <p className="mt-2 text-base text-muted">
          Thanks {name.trim()}. We have your {service.toLowerCase()} request and
          will reply to {email.trim()} within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-line bg-card p-6 shadow-[var(--shadow-soft)] sm:p-7"
    >
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1 rounded-full bg-line" aria-hidden="true">
          <div
            className="h-1 rounded-full bg-accent transition-[width] duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
        <span className="text-sm text-muted">Step {step} of 3</span>
      </div>

      {/* Step 1 — contact details */}
      {step === 1 && (
        <div className="mt-6 space-y-4">
          <div>
            <label className={labelClass} htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              className={`${fieldClass} mt-1.5`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                revalidate("name", e.target.value);
              }}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && <FieldError id="name-error">{errors.name}</FieldError>}
          </div>

          <div>
            <label className={labelClass} htmlFor="email">
              Work email
            </label>
            <input
              id="email"
              type="email"
              className={`${fieldClass} mt-1.5`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                revalidate("email", e.target.value);
              }}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <FieldError id="email-error">{errors.email}</FieldError>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="company">
              Company <span className="text-muted">(optional)</span>
            </label>
            <input
              id="company"
              className={`${fieldClass} mt-1.5`}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Step 2 — service choice */}
      {step === 2 && (
        <div className="mt-6">
          <p className={labelClass}>Which service do you need?</p>
          <div className="mt-3 space-y-3">
            {services.map((option) => {
              const selected = service === option.name;
              return (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => pickService(option.name)}
                  aria-pressed={selected}
                  className={`block w-full rounded-xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    selected
                      ? "border-accent bg-accent-soft"
                      : "border-line hover:border-accent/40"
                  }`}
                >
                  <span className="font-serif text-lg">{option.name}</span>
                  <span className="mt-1 block text-sm leading-snug text-muted">
                    {option.summary}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.service && (
            <FieldError id="service-error">{errors.service}</FieldError>
          )}
        </div>
      )}

      {/* Step 3 — questions that depend on the chosen service */}
      {step === 3 && (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-muted">
            Tailored to <span className="text-ink">{service}</span>.
          </p>

          {questions.map((question) => {
            const value = answers[question.id] ?? "";
            const setValue = (v: string) => {
              setAnswers({ ...answers, [question.id]: v });
              revalidate(question.id, v);
            };
            const invalid = !!errors[question.id];
            const describedBy = invalid ? `${question.id}-error` : undefined;

            return (
              <div key={question.id}>
                <label className={labelClass} htmlFor={question.id}>
                  {question.label}
                </label>

                {question.type === "select" ? (
                  <select
                    id={question.id}
                    className={`${fieldClass} mt-1.5`}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                  >
                    <option value="">Select an option</option>
                    {question.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : question.type === "textarea" ? (
                  <textarea
                    id={question.id}
                    rows={3}
                    className={`${fieldClass} mt-1.5 resize-y`}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                  />
                ) : (
                  <input
                    id={question.id}
                    className={`${fieldClass} mt-1.5`}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                  />
                )}

                {invalid && (
                  <FieldError id={`${question.id}-error`}>
                    {errors[question.id]}
                  </FieldError>
                )}
              </div>
            );
          })}
        </div>
      )}

      {submitError && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {submitError}
        </p>
      )}

      {/* Navigation */}
      <div className="mt-7 flex items-center justify-between gap-3">
        {step > 1 ? (
          <button
            type="button"
            onClick={goBack}
            className="rounded-full border border-line px-5 py-2.5 text-base transition-colors hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Back
          </button>
        ) : (
          <span />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            className="rounded-full bg-accent px-6 py-2.5 text-base font-medium text-white transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-full bg-accent px-6 py-2.5 text-base font-medium text-white transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Send request"}
          </button>
        )}
      </div>
    </form>
  );
}

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-red-700">
      {children}
    </p>
  );
}
