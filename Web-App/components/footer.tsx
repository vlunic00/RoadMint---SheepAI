export default function Footer() {
  return (
    <footer className="w-full bg-black border-t border-orange-500/20 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* TOP SECTION */}
        <div className="mb-8">
          <h2 className="text-white text-xl font-bold">
            Road<span className="text-orange-500">Mint</span>
          </h2>

          <p className="mt-2 text-sm text-gray-400 max-w-xl">
            The official road health reporting platform for the City of Split.
            Built with citizens, for citizens.
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Grad Split · 2026
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* PLATFORM */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">
              Platform
            </h3>

            <ul className="space-y-2 text-sm">
              <li className="hover:text-orange-400 cursor-pointer">Report an Issue</li>
              <li className="hover:text-orange-400 cursor-pointer">Live Map</li>
              <li className="hover:text-orange-400 cursor-pointer">Status Updates</li>
              <li className="hover:text-orange-400 cursor-pointer">Statistics</li>
              <li className="hover:text-orange-400 cursor-pointer">How It Works</li>
            </ul>
          </div>

          {/* CITY */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">
              City
            </h3>

            <ul className="space-y-2 text-sm">
              <li className="hover:text-orange-400 cursor-pointer">City of Split</li>
              <li className="hover:text-orange-400 cursor-pointer">Communal Services</li>
              <li className="hover:text-orange-400 cursor-pointer">Open Data</li>
              <li className="hover:text-orange-400 cursor-pointer">Press</li>
              <li className="hover:text-orange-400 cursor-pointer">Contact</li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-gray-500">

          <div>
            © 2026 RoadMint · City of Split Road Health Service
          </div>

          <div className="flex gap-4">
            <span className="hover:text-orange-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-orange-400 cursor-pointer">Terms of Use</span>
            <span className="hover:text-orange-400 cursor-pointer">Accessibility</span>
          </div>

        </div>
      </div>
    </footer>
  );
}