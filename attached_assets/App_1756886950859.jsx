export default function App() {
  return (
    <div className="min-h-screen p-10" style={{ background: 'var(--gradient-hero)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="display text-4xl md:text-6xl font-bold text-[var(--color-neutral-white)]">
          Collaborative Intelligence, redefined.
        </h1>
        <p className="text-[var(--color-neutral-white)]/80">
          Make intelligence collaborative.
        </p>
        <div className="flex gap-4">
          <button className="button-primary">Get Started</button>
          <button className="button-secondary">Learn More</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="card">
            <h3 className="font-heading font-semibold mb-2">Card One</h3>
            <p className="text-sm text-[var(--text-secondary)]">Panel using SymbiosoAi tokens.</p>
          </div>
          <div className="card">
            <h3 className="font-heading font-semibold mb-2">Card Two</h3>
            <p className="text-sm text-[var(--text-secondary)]">Buttons, gradient, radii are token-driven.</p>
          </div>
          <div className="card">
            <h3 className="font-heading font-semibold mb-2">Card Three</h3>
            <p className="text-sm text-[var(--text-secondary)]">Swap to dark mode by toggling [data-theme="dark"].</p>
          </div>
        </div>
      </div>
    </div>
  )
}
