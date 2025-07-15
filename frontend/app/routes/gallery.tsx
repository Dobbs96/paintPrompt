import { useState } from "react";
import { useNavigate } from "react-router";

export default function Gallery() {
  const navigate = useNavigate();
  const [firstArtwork, setFirstArtwork] = useState("");
  const [secondArtwork, setSecondArtwork] = useState("");

  const artworks = [
    { title: "Sunset Views", date: "2023-01-10", image: "/images/sunset.jpg" },
    { title: "Autumn Whispers", date: "2023-02-15", image: "/images/autumn.jpg" },
    { title: "City Life", date: "2023-03-01", image: "/images/city.jpg" },
    { title: "Mountain Retreat", date: "2023-05-05", image: "/images/mountain.jpg" },
    { title: "Abstract Dream", date: "2023-06-20", image: "/images/abstract.jpg" },
    { title: "Ocean Serenity", date: "2023-07-15", image: "/images/ocean.jpg" },
  ];

  const buttonStyle = {
    background: "#AC83CA",
    color: "#fff",
    border: "1px solid #E5E7EB",
  };

  return (
    <div className="p-8 font-sans bg-[#F5F3FF] min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate("/home")}
        className="mb-4 px-4 py-2 rounded-full font-semibold text-white shadow"
        style={buttonStyle}
      >
        ← Back to Home
      </button>

      <header className="bg-pink-300 text-white text-center p-8 rounded-lg mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Painting Journey</h1>
        <p className="text-lg">Explore your artistic growth and creativity.</p>
      </header>

      <section className="mb-12 text-center">
        <h2 className="text-2xl font-semibold mb-1">Gallery</h2>
        <p className="text-gray-600 mb-6">Scroll through your collection of creations and compare your progress.</p>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {artworks.map((art, index) => (
            <div key={index} className="border p-4 rounded-lg bg-white shadow-sm">
              <img src={art.image} alt={art.title} className="w-full h-40 object-cover rounded" />
              <h4 className="text-lg font-semibold mt-3">{art.title}</h4>
              <p className="text-sm text-gray-500">Uploaded on {art.date}</p>
              <span className="inline-block mt-1 text-xs bg-gray-100 px-2 py-1 rounded">You</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12 text-center">
        <h3 className="text-xl font-semibold mb-1">Compare Your Artwork</h3>
        <p className="text-gray-600 mb-4">Select two pieces to compare side by side.</p>
        <div className="max-w-md mx-auto flex flex-col gap-4">
          <input
            type="text"
            value={firstArtwork}
            onChange={(e) => setFirstArtwork(e.target.value)}
            placeholder="Select First Artwork"
            className="border px-4 py-2 rounded"
          />
          <input
            type="text"
            value={secondArtwork}
            onChange={(e) => setSecondArtwork(e.target.value)}
            placeholder="Select Second Artwork"
            className="border px-4 py-2 rounded"
          />
          <div className="flex gap-4 justify-center mt-2">
            <button
              className="px-6 py-2 rounded-full shadow-sm font-semibold transition"
              style={buttonStyle}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 rounded-full shadow-sm font-semibold transition"
              style={buttonStyle}
            >
              Compare
            </button>
          </div>
        </div>
      </section>

      <section className="mb-12 text-center">
        <h3 className="text-xl font-semibold mb-1">Upload or Download Artwork</h3>
        <p className="text-gray-600 mb-4">Share your latest masterpiece with the community.</p>
        <div className="max-w-md mx-auto flex flex-col gap-4">
          <input type="text" placeholder="Artwork Title" className="border px-4 py-2 rounded" />
          <input type="file" accept="image/*" className="border px-4 py-2 rounded" />
          <div className="flex gap-4 justify-center mt-2">
            <button
              className="px-6 py-2 rounded-full shadow-sm font-semibold transition"
              style={buttonStyle}
            >
              Upload
            </button>
            <button
              className="px-6 py-2 rounded-full shadow-sm font-semibold transition"
              style={buttonStyle}
            >
              Publish
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t pt-4 text-sm text-center text-gray-500 flex justify-center gap-6">
        <a href="/privacy" className="hover:underline">Privacy Policy</a>
        <a href="/terms" className="hover:underline">Terms of Service</a>
        <a href="/contact" className="hover:underline">Contact Us</a>
      </footer>
    </div>
  );
}
