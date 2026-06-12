function About() {
  return (
    <main className="min-h-screen bg-cream-50 px-6 py-16">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.3em] text-green-700">
          About Bloomspace
        </p>

        <h1 className="mt-4 text-4xl font-bold text-green-950 md:text-6xl">
          A community garden built from small acts of kindness.
        </h1>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <article className="rounded-3xl bg-white/80 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-green-900">
              Project Origin
            </h2>
            <p className="mt-4 text-green-800">
              Add the nwHacks 2025 origin story here.
            </p>
          </article>

          <article className="rounded-3xl bg-white/80 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-green-900">
              Original Hackathon Team
            </h2>
            <ul className="mt-4 space-y-2 text-green-800">
              <li>Vanessa Victorino — Frontend Development</li>
              <li>[Name] — Concept & Backend Development</li>
              <li>[Name] — Presentation</li>
              <li>[Name] — Project Setup & Support</li>
            </ul>
          </article>

          <article className="rounded-3xl bg-white/80 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-green-900">
              Original Prototype
            </h2>
            <p className="mt-4 text-green-800">
              Add what the hackathon demo included here.
            </p>
          </article>

          <article className="rounded-3xl bg-white/80 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-green-900">
              Revival Version
            </h2>
            <p className="mt-4 text-green-800">
              Add what this rebuild adds here.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default About;