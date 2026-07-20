import IntakeForm from "./intake-form";
import { services } from "@/lib/services";

const stats = [
  { value: "12+", label: "years advising founders" },
  { value: "90 days", label: "to a working fix plan" },
  { value: "40+", label: "engagements delivered" },
];

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line/70 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="flex items-center gap-2 font-serif text-xl tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-sm text-white">
              A
            </span>
            Atlas Consulting
          </span>
          <a
            href="#contact"
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Start a request
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="hero-surface relative overflow-hidden border-b border-line">
          <div className="grid-lines pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-5xl px-6 pt-16 pb-16 sm:pt-24 sm:pb-20">
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-card/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-2" />
              Advisory for founder-led companies
            </p>
            <h1 className="mt-6 max-w-3xl font-serif text-[2.9rem] leading-[1.02] sm:text-[4.5rem]">
              Clear answers to the questions{" "}
              <span className="text-accent">slowing your company down.</span>
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-snug text-muted">
              We work with teams of 10 to 200 on the unglamorous problems —
              margins, process, forecasting — and leave behind a plan your
              people can run without us.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href="#contact"
                className="rounded-full bg-accent px-6 py-3 text-base font-medium text-white shadow-[var(--shadow-lift)] transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Start a request
              </a>
              <span className="text-base text-muted">
                Two minutes. We reply within one business day.
              </span>
            </div>

            <dl className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-line pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-serif text-3xl sm:text-4xl">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-sm leading-snug text-muted">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Services — dark contrast band */}
        <section className="bg-accent text-white">
          <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
            <div className="flex items-end justify-between gap-6">
              <h2 className="font-serif text-3xl sm:text-4xl">What we do</h2>
              <p className="hidden max-w-xs text-sm text-white/60 sm:block">
                Three focused engagements. No retainer you cannot explain to
                your board.
              </p>
            </div>
            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
              {services.map((service, index) => (
                <div
                  key={service.name}
                  className="group bg-accent p-6 transition-colors hover:bg-accent-2 sm:p-7"
                >
                  <span className="font-serif text-2xl text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-serif text-2xl">{service.name}</h3>
                  <p className="mt-2 text-sm leading-snug text-white/70">
                    {service.summary}
                  </p>
                  <ul className="mt-5 space-y-2 border-t border-white/15 pt-5 text-sm">
                    {service.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-center gap-2 text-white/80"
                      >
                        <span className="h-1 w-1 rounded-full bg-gold" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent-2">
            Get started
          </p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
            Start a request
          </h2>
          <p className="mt-3 text-lg leading-snug text-muted">
            Tell us what you need. The questions adapt to the service you pick,
            so you only answer what is relevant.
          </p>
          <div className="mt-8">
            <IntakeForm />
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-card">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span className="font-serif text-base text-ink">
            Atlas Consulting
          </span>
          <span>
            © {new Date().getFullYear()} — a fictional company built as a
            portfolio demonstration.
          </span>
        </div>
      </footer>
    </>
  );
}
