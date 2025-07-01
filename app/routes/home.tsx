import React, { useState } from "react";
import { useNavigate } from "react-router";

const Home: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [ratingHover, setRatingHover] = useState(0);
    const navigate = useNavigate();

    const mockImages = [
        {
            id: 1,
            src: "https://pm1.aminoapps.com/7636/fd6915edbe01bdb53cc48ba334dc669e0c924159r1-736-736v2_hq.jpg",
            alt: "Mock Image 1",
        },
        {
            id: 2,
            src: "https://pm1.aminoapps.com/7636/95401f5bf802ecd1e7ed1148b745befef8c95236r1-736-736v2_hq.jpg",
            alt: "Mock Image 2",
        },
        {
            id: 3,
            src: "https://pm1.aminoapps.com/7636/8b33e20337137de14359afd5f695e7472c71c4fdr1-736-736v2_hq.jpg",
            alt: "Mock Image 3",
        },
    ];

    return (
        <div className="relative flex h-screen overflow-hidden font-sans bg-gray-950 text-white">
            {/* Prompt Section */}
            <div className="flex-1 px-16 py-10 transition-all duration-300 relative">
                <div className="max-w-3xl mx-auto min-h-[calc(100vh-120px)] relative">
                    <div className="text-center mb-12 pt-6">
                        <h1 className="text-5xl font-semibold text-white tracking-tight mb-2">
                            Paint Prompt
                        </h1>
                        <p className="text-xl text-gray-400 mb-3">
                            How are you feeling today?
                        </p>
                        <p className="text-md text-gray-500 italic">
                            🎨 Tip: Mixing colors leads to unexpectedly
                            beautiful results.
                        </p>
                    </div>

                    <div className="flex justify-center gap-4 mb-6">
                        <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-full shadow-sm transition">
                            Mood
                        </button>
                        <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-full shadow-sm transition">
                            Medium
                        </button>
                        <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-full shadow-sm transition">
                            Complexity
                        </button>
                        <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-full shadow-sm transition">
                            Format
                        </button>
                    </div>

                    <div className="max-w-xl mx-auto">
                        <textarea
                            className="w-full h-24 p-4 bg-gray-800 rounded-xl text-white placeholder-gray-500 resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Describe your mood or painting idea..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <button className="w-full bg-purple-600 hover:bg-purple-500 text-white text-lg py-3 rounded-xl font-medium transition shadow-sm">
                            Generate Prompt
                        </button>
                    </div>

                    {/* Footer Links*/}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-6 text-sm text-gray-400">
                        <a
                            onClick={() => navigate("/help")}
                            className="hover:underline"
                        >
                            Help
                        </a>
                        <a
                            onClick={() => navigate("/help")}
                            className="hover:underline"
                        >
                            Contact Us
                        </a>
                        <a
                            onClick={() => navigate("/privacypolicy")}
                            className="hover:underline"
                        >
                            Privacy Policy
                        </a>
                        <a
                            onClick={() => navigate("/termsandservice")}
                            className="hover:underline"
                        >
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                className={`absolute top-1/2 z-50 transform -translate-y-1/2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
                    isOpen ? "right-60" : "right-4"
                }`}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls="sidebar"
            >
                {isOpen ? "🡢" : "🡠"}
            </button>

            {/* Top Right Links */}
            <div
                className={`absolute top-6 z-40 flex text-sm transition-all duration-300 ${
                    isOpen ? "right-64" : "right-8"
                } pr-6 space-x-6`}
            >
                <a
                    onClick={() => navigate("/gallery")}
                    className="hover:underline text-gray-300"
                >
                    Gallery
                </a>
                <a
                    onClick={() => navigate("/materials")}
                    className="hover:underline text-gray-300"
                >
                    Materials
                </a>
                <a
                    onClick={() => navigate("/")}
                    className="hover:underline text-red-400"
                >
                    Sign Out
                </a>
            </div>

            {/* Sidebar */}
            <div
                id="sidebar"
                className={`relative ${
                    isOpen ? "w-64" : "w-8"
                } transition-all duration-300 bg-gray-900 border-l border-gray-800`}
            >
                <div className="flex flex-col h-full p-4">
                    <div
                        className={`absolute top-0 right-0 w-64 bg-gray-900 text-white p-4 h-full overflow-y-auto border-l border-gray-800 transition-all duration-300 transform ${
                            isOpen
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 translate-x-4 pointer-events-none"
                        }`}
                    >
                        <h2 className="text-xl font-semibold mb-2">
                            Community Ratings
                        </h2>
                        <p className="text-sm text-gray-400 mb-6">
                            Rate other artists' work
                        </p>
                        {mockImages.map((img) => (
                            <div key={img.id} className="mb-6">
                                <div className="bg-gray-800 p-2 rounded-lg">
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className="w-full h-auto rounded-lg"
                                    />
                                </div>
                                <div className="flex mt-2 justify-center">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className="text-2xl cursor-pointer"
                                            onMouseEnter={() =>
                                                setRatingHover(i + 1)
                                            }
                                            onMouseLeave={() =>
                                                setRatingHover(0)
                                            }
                                            style={{
                                                color:
                                                    i < ratingHover
                                                        ? "#facc15"
                                                        : "#4b5563",
                                            }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 text-center mt-1">
                                    Username
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
