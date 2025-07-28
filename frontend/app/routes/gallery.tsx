import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function Gallery() {
    const navigate = useNavigate();
    const [uploadTitle, setUploadTitle] = useState("");
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [artworks, setArtworks] = useState<any[]>([]);

    const buttonStyle = {
        background: "#AC83CA",
        color: "#fff",
        border: "1px solid #E5E7EB",
    };

    useEffect(() => {
        fetch("http://localhost:8080/gallery")
            .then((res) => res.json())
            .then((data) => setArtworks(data));
    }, []);

    const handleUpload = async () => {
        if (!uploadTitle || !uploadFile) return;

        const formData = new FormData();
        formData.append("title", uploadTitle);
        formData.append("file", uploadFile);

        try {
            await fetch("http://localhost:8080/gallery/upload", {
                method: "POST",
                body: formData,
            });

            const updatedGallery = await fetch(
                "http://localhost:8080/gallery"
            ).then((res) => res.json());
            setArtworks(updatedGallery);

            setUploadTitle("");
            setUploadFile(null);
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    return (
        <div className="p-8 font-sans bg-[#F5F3FF] min-h-screen">
            <button
                onClick={() => navigate("/home")}
                className="mb-4 px-4 py-2 rounded-full font-semibold text-white shadow"
                style={buttonStyle}
            >
                ← Back to Home
            </button>

            <header className="bg-pink-300 text-white text-center p-8 rounded-lg mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    Your Painting Journey
                </h1>
                <p className="text-lg">
                    Explore your artistic growth and creativity.
                </p>
            </header>

            <section className="mb-12 text-center">
                <h2 className="text-2xl font-semibold mb-1">Gallery</h2>
                <p className="text-gray-600 mb-6">
                    Scroll through your collection of creations and compare your
                    progress.
                </p>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {artworks.map((art, index) => (
                        <div
                            key={index}
                            className="border p-4 rounded-lg bg-white shadow-sm"
                        >
                            <img
                                src={`http://localhost:8080${art.image}`} // 🔥 POINTS TO BACKEND
                                alt={art.title}
                            />

                            <h4 className="text-lg font-semibold mt-3">
                                {art.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                                Uploaded on {art.date}
                            </p>
                            <span className="inline-block mt-1 text-xs bg-gray-100 px-2 py-1 rounded">
                                You
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mb-12 text-center">
                <h3 className="text-xl font-semibold mb-1">Upload Artwork</h3>
                <p className="text-gray-600 mb-4">
                    Add your latest masterpiece to the collection.
                </p>
                <div className="max-w-md mx-auto flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Artwork Title"
                        className="border px-4 py-2 rounded"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="border px-4 py-2 rounded"
                        onChange={(e) =>
                            setUploadFile(e.target.files?.[0] || null)
                        }
                    />
                    <div className="flex gap-4 justify-center mt-2">
                        <button
                            onClick={handleUpload}
                            className="px-6 py-2 rounded-full shadow-sm font-semibold transition"
                            style={buttonStyle}
                        >
                            Upload
                        </button>
                        <button
                            onClick={handleUpload}
                            className="px-6 py-2 rounded-full shadow-sm font-semibold transition"
                            style={buttonStyle}
                        >
                            Publish
                        </button>
                    </div>
                </div>
            </section>

            <footer className="border-t pt-4 text-sm text-center text-gray-500 flex justify-center gap-6">
                <a href="/privacy" className="hover:underline">
                    Privacy Policy
                </a>
                <a href="/terms" className="hover:underline">
                    Terms of Service
                </a>
                <a href="/contact" className="hover:underline">
                    Contact Us
                </a>
            </footer>
        </div>
    );
}
