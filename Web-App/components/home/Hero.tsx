import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero">
      <div className="home-inner">
        <div className="hero-col">
          <p className="eyebrow">Split · Hrvatska</p>

          <h1 className="hero-title">
            Zajedno Gradimo<br />
            <span className="accent">Bolje Ceste</span><br />
            <span className="dim">Splita.</span>
          </h1>

          <p className="hero-text">
            RoadMint povezuje građane s gradskim ekipama za održavanje. Uočite
            rupu ili pukotinu i prijavite je u 30 sekundi. Mi rješavamo ostalo.
          </p>

          <div className="hero-actions">
            <Link href="#" className="btn-primary"><Pin /> Prijavi problem <Arrow /></Link>
            <Link href="/map" className="btn-outline">Pogledaj mapu</Link>
            <Link href="#" className="btn-outline">Preuzmi mobilnu aplikaciju</Link>
          </div>
        </div>

        <p className="scroll">Pomakni</p>
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

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}
