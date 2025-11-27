export default function AISkincarePage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border shadow-sm">
        {/* Background gradient using brand colors */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(135deg, #FFD3D5 0%, #ffffff 50%, #FFD3D5 100%)",
          }}
        />

        {/* Accent blob */}
        <div
          className="absolute -top-12 -right-12 w-56 h-56 rounded-full opacity-30 blur-3xl"
          style={{ backgroundColor: "#D8234B" }}
        />

        <section className="relative p-8 sm:p-12 text-center">
          <div className="mx-auto max-w-2xl">
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mb-4"
              style={{ color: "#D8234B" }}
            >
              AI Skincare
            </h1>
            <p className="text-sm sm:text-base text-gray-700 mb-2">Coming Soon…</p>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-700">
              Discover your personalized skincare with AI — smart analysis, tailored routines, and product picks made
              just for you.
            </p>

            {/* Logo and love note */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <img
                src="/logo.png"
                alt="Brand Logo"
                className="h-10 sm:h-12 w-auto drop-shadow"
                loading="lazy"
              />
              <span className=" flex items-center text-xs sm:text-sm" style={{ color: "#8c2b3d" }}>
                Made with <span className="align-middle" aria-label="love">❤</span> for your daily care
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}