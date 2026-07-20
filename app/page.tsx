const services = [
  {
    name: "Operations Audit",
    summary:
      "We map how work actually moves through your company, then remove the steps that cost you time and margin.",
    points: ["Process mapping", "Tooling review", "90-day fix plan"],
  },
  {
    name: "Financial Planning",
    summary:
      "Forecasts you can defend in a board meeting, built on your real numbers rather than a template.",
    points: ["Cash-flow modelling", "Pricing review", "Scenario planning"],
  },
  {
    name: "Growth Strategy",
    summary:
      "A focused plan for the next twelve months, sized to the team and budget you actually have.",
    points: ["Market positioning", "Channel selection", "Quarterly roadmap"],
  },
];

export default function Home() {
  return (
    <>
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <span className="font-serif text-xl tracking-tight">
            Atlas Consulting
          </span>
          <a
            href="#contact"
            className="rounded-full border border-line px-4 py-2 text-sm transition-colors hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Start a request
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <p className="text-sm uppercase tracking-[0.2em] text-muted">
            Advisory for founder-led companies
          </p>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-[1.1] sm:text-6xl">
            Clear answers to the operational questions slowing your company
            down.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            We work with teams of 10 to 200 on the unglamorous problems —
            margins, process, forecasting — and leave behind a plan your people
            can run without us.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Start a request
            </a>
            <span className="text-sm text-muted">
              Takes two minutes. We reply within one business day.
            </span>
          </div>
        </section>

        {/* Services */}
        <section className="border-y border-line bg-card">
          <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
            <h2 className="font-serif text-3xl sm:text-4xl">What we do</h2>
            <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
              {services.map((service) => (
                <div key={service.name}>
                  <h3 className="font-serif text-xl">{service.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {service.summary}
                  </p>
                  <ul className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
                    {service.points.map((point) => (
                      <li key={point} className="text-muted">
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
        <section id="contact" className="mx-auto max-w-2xl px-6 py-20 sm:py-28">
          <h2 className="font-serif text-3xl sm:text-4xl">Start a request</h2>
          <p className="mt-4 text-muted">
            Tell us what you need. The questions adapt to the service you pick,
            so you only answer what is relevant.
          </p>
          <div className="mt-10 rounded-2xl border border-line bg-card p-6 sm:p-8">
            <p className="text-sm text-muted">Intake form coming next.</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-muted">
          © {new Date().getFullYear()} Atlas Consulting. A fictional company
          built as a portfolio demonstration.
        </div>
      </footer>
    </>
  );
}
