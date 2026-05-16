const FEATURES = [
  {
    num: "01",
    icon: <Pin />,
    title: "Precizna prijava",
    text: "Građani prijavljuju oštećenja ceste s točnim GPS koordinatama izravno s mobitela. Bez obrazaca, bez birokracije.",
  },
  {
    num: "02",
    icon: <Camera />,
    title: "Fotodokaz",
    text: "Priložite fotografije svakoj prijavi. Vizualna dokumentacija ubrzava procjenu i osigurava točne popravke.",
  },
  {
    num: "03",
    icon: <Bolt />,
    title: "Ažuriranja uživo",
    text: "Pratite status svake prijave od podnošenja do rješenja. Transparentnost u svakom koraku.",
  },
  {
    num: "04",
    icon: <Chart />,
    title: "Gradska ploča",
    text: "Gradske ekipe za održavanje koriste našu nadzornu ploču uživo za učinkovito određivanje prioriteta i slanje ekipa.",
  },
  {
    num: "05",
    icon: <Bell />,
    title: "Trenutne obavijesti",
    text: "Primite obavijest čim je vaša prijava dodijeljena, u popravku ili potpuno riješena.",
  },
  {
    num: "06",
    icon: <Shield />,
    title: "Provjereni popravci",
    text: "Sve popravke terenske ekipe potvrđuju fotografijom prije nego što ih sustav označi riješenima.",
  },
];

export default function Features() {
  return (
    <section className="home-inner">
      <p className="eyebrow">Platforma</p>

      <div className="features-head">
        <h2 className="demo-title">
          Stvoreno Za <span className="accent">Split.</span><br />
          Stvoreno Da Traje.
        </h2>
        <p className="features-note">
          Svaka je značajka osmišljena oko jednog cilja: brže ceste, sigurnije
          ulice i grad koji zaista sluša.
        </p>
      </div>

      <div className="features-grid">
        {FEATURES.map((f) => (
          <div key={f.num} className="feature">
            <div className="feature-icon">{f.icon}</div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-text">{f.text}</p>
            <span className="feature-num">{f.num}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function Camera() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 8h3l2-3h8l2 3h3v11H3z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

function Bolt() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
    </svg>
  );
}

function Chart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 20V10M12 20V4M18 20v-6" />
    </svg>
  );
}

function Bell() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 16V11a6 6 0 0 1 12 0v5l2 3H4z" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}

function Shield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z" />
    </svg>
  );
}
