import Link from "next/link";

const CHECKS = [
  "Nije potreban račun",
  "Dostupno na hrvatskom i engleskom",
  "Upravlja Grad Split",
  "Otvoreni podaci",
];

export default function CallToAction() {
  return (
    <section className="home-inner cta">
      <span className="cta-bg">Split</span>

      <div className="cta-row">
        <div className="cta-left">
          <p className="eyebrow">Djelujte</p>
          <h2 className="demo-title">
            Vidite Problem Na Cesti?<br />
            <span className="accent">Prijavite Ga Odmah.</span>
          </h2>
          <p className="hero-text">
            Svaka prijava čini Split sigurnijim. Traje 30 sekundi i izravno
            stiže gradskim ekipama za održavanje. Registracija nije potrebna.
          </p>
        </div>

        <div className="cta-actions">
          <Link href="#" className="btn-primary"><Pin /> Prijavi problem <Arrow /></Link>
          <Link href="#" className="btn-outline"><Phone /> Preuzmi aplikaciju <Arrow /></Link>
        </div>
      </div>

      <div className="cta-checks">
        {CHECKS.map((c) => (
          <span key={c} className="cta-check"><Check /> {c}</span>
        ))}
      </div>
    </section>
  );
}

function Pin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function Phone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e8843c" strokeWidth="3">
      <path d="M4 12l6 6L20 6" />
    </svg>
  );
}
