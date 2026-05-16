const STEPS = [
  { num: "1", title: "Dodirni za prijavu", text: "Otvori aplikaciju, označi lokaciju" },
  { num: "2", title: "Grad prima obavijest", text: "Trenutna obavijest na ploči" },
  { num: "3", title: "Popravak potvrđen", text: "Rješenje provjereno fotografijom" },
];

export default function Demo() {
  return (
    <section className="home-inner">
      <p className="eyebrow">Pogledajte u akciji</p>

      <h2 className="demo-title">
        Od Rupe Do <span className="accent">Popravka</span> U Nekoliko Sati.
      </h2>

      <p className="hero-text">
        Pogledajte kako RoadMint pretvara prijavu građana u izlazak gradske
        ekipe, od prvog dodira do konačnog popravka.
      </p>

      <div className="demo-video">
        <button type="button" className="demo-play" aria-label="Pokreni video">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#0c0c0c">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <div className="demo-caption">
          <div className="demo-cap-title">RoadMint, kako funkcionira</div>
          <div className="demo-cap-meta">2 min · Pregled sustava</div>
        </div>
        <div className="demo-loc">Split, HR</div>
      </div>

      <div className="demo-steps">
        {STEPS.map((s) => (
          <div key={s.num} className="demo-step">
            <div className="demo-step-num">{s.num}</div>
            <h3 className="demo-step-title">{s.title}</h3>
            <p className="demo-step-text">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
