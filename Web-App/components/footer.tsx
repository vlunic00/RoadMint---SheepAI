export default function Footer() {
  return (
    <footer className="w-full bg-black text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* TOP SECTION */}
        <div className="mb-8">
          <h2 className="text-white text-xl font-bold">
            Road<span className="text-orange-500">Mint</span>
          </h2>

          <p className="mt-2 text-sm text-gray-400 max-w-xl">
            Službena platforma za prijavu stanja cesta Grada Splita.
            Stvoreno s građanima, za građane.
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Grad Split · 2026
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* PLATFORMA */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">
              Platforma
            </h3>

            <ul className="space-y-2 text-sm">
              <li className="hover:text-orange-400 cursor-pointer">Prijavi problem</li>
              <li className="hover:text-orange-400 cursor-pointer">Mapa uživo</li>
              <li className="hover:text-orange-400 cursor-pointer">Ažuriranja statusa</li>
              <li className="hover:text-orange-400 cursor-pointer">Statistika</li>
              <li className="hover:text-orange-400 cursor-pointer">Kako funkcionira</li>
            </ul>
          </div>

          {/* GRAD */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">
              Grad
            </h3>

            <ul className="space-y-2 text-sm">
              <li className="hover:text-orange-400 cursor-pointer">Grad Split</li>
              <li className="hover:text-orange-400 cursor-pointer">Komunalne službe</li>
              <li className="hover:text-orange-400 cursor-pointer">Otvoreni podaci</li>
              <li className="hover:text-orange-400 cursor-pointer">Mediji</li>
              <li className="hover:text-orange-400 cursor-pointer">Kontakt</li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-gray-500">

          <div>
            © 2026 RoadMint · Služba za stanje cesta Grada Splita
          </div>

          <div className="flex gap-4">
            <span className="hover:text-orange-400 cursor-pointer">Pravila privatnosti</span>
            <span className="hover:text-orange-400 cursor-pointer">Uvjeti korištenja</span>
            <span className="hover:text-orange-400 cursor-pointer">Pristupačnost</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
