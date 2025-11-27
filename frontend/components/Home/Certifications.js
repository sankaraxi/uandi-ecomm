"use client";

export default function Certifications() {
  const badges = [
    "/badges/gmp.png",
    "/badges/iso.png",
    "/badges/fda.png",
    "/badges/cruelty-free.png",
]

  return (
    <section className="w-full bg-white py-7">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-10 px-4">
        {badges.map((src, i) => (
          <div
            key={i}
            className="w-32 h-32 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center overflow-hidden"
          >
            <img
              src={src}
              alt="Certification Badge"
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
