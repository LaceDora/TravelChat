export default function HeroSection() {
  return (
    <section className="relative rounded-3xl overflow-hidden mb-20">
      <img
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
        className="w-full h-[420px] object-cover"
        alt="Hero"
      />

      <div className="absolute inset-0 bg-black/35" />

      <div className="absolute inset-0 flex items-center">
        <div className="px-12 max-w-xl text-white">
          <h1 className="text-4xl font-bold mb-4">
            Discover the Magic of Southeast Asia
          </h1>
          <p className="text-sm mb-6 leading-relaxed">
            Explore unique cultures, breathtaking landscapes, delicious food and
            unforgettable experiences across Southeast Asia.
          </p>
          <a
            href="/locations"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-medium transition"
          >
            Explore Now
          </a>
        </div>
      </div>
    </section>
  );
}
