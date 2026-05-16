const STATS = [
  { num: "1.284", label: "Prijavljenih problema" },
  { num: "96%", label: "Stopa rješavanja" },
  { num: "18h", label: "Pros. vrijeme popravka" },
  { num: "42", label: "Nadziranih četvrti" },
];

export default function StatsBand() {
  return (
    <section className="stats-band">
      <div className="stats-band-inner">
        {STATS.map((s) => (
          <div key={s.label} className="stat-band-item">
            <div className="stat-band-num">{s.num}</div>
            <div className="stat-band-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
