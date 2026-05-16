const STEPS = [
  {
    num: "01",
    title: "Uočite problem",
    text: "Vidite rupu, pukotinu ili oštećenu površinu ceste? Otvorite RoadMint aplikaciju, registracija nije potrebna.",
  },
  {
    num: "02",
    title: "Prijavite ga",
    text: "Označite lokaciju, slikajte fotografiju i odaberite vrstu oštećenja. Gotovo za manje od 30 sekundi.",
  },
  {
    num: "03",
    title: "Grad dobiva obavijest",
    text: "Prijava odmah stiže na nadzornu ploču gradskog održavanja, razvrstana po ozbiljnosti i lokaciji.",
  },
  {
    num: "04",
    title: "Ekipe na terenu",
    text: "Ekipe za popravak dodjeljuju se i šalju na teren. Napredak možete pratiti u stvarnom vremenu putem aplikacije.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="home-inner">
      <p className="eyebrow">Kako funkcionira</p>

      <div className="how-grid">
        {STEPS.map((s) => (
          <div key={s.num} className="how-card">
            <div className="how-num">{s.num}</div>
            <div className="how-rule" />
            <h3 className="how-title">{s.title}</h3>
            <p className="how-text">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
