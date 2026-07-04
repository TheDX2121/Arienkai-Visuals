const tiers = [
  {
    name: "Free",
    price: "₹0",
    tagline: "Start learning and posting.",
    features: ["Upload artwork", "Follow artists", "Free tutorials", "Basic preview ratings"]
  },
  {
    name: "Creator",
    price: "₹199/mo",
    tagline: "Best for serious editors.",
    features: ["Premium courses", "GFX pack access", "Advanced preview ratings", "Save collections", "Priority news feed"],
    featured: true
  },
  {
    name: "Studio",
    price: "₹499/mo",
    tagline: "For teams and power users.",
    features: ["Everything in Creator", "Team profiles", "Asset licensing tools", "Analytics dashboard", "Early beta features"]
  }
];

export default function PremiumPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <div className="pill mx-auto mb-4 w-fit">Premium access</div>
        <h1 className="text-5xl font-black tracking-tight">High-level resources without luxury pricing.</h1>
        <p className="mt-4 text-white/55">The subscription layer is designed for affordability first. Connect Stripe or Razorpay to activate payments.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {tiers.map((tier) => (
          <article key={tier.name} className={`glass-panel rounded-[2rem] p-6 ${tier.featured ? "border-brand/60 shadow-glow" : ""}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">{tier.name}</h2>
              {tier.featured ? <span className="pill bg-brand/20 text-red-100">Popular</span> : null}
            </div>
            <div className="mt-5 text-4xl font-black">{tier.price}</div>
            <p className="mt-2 text-sm text-white/55">{tier.tagline}</p>
            <ul className="mt-6 grid gap-3 text-sm text-white/70">
              {tier.features.map((feature) => <li key={feature}>✓ {feature}</li>)}
            </ul>
            <button className={tier.featured ? "primary-button mt-8 w-full" : "secondary-button mt-8 w-full"}>Choose {tier.name}</button>
          </article>
        ))}
      </div>
    </section>
  );
}
