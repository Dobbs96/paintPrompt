import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

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
        fetch(`${API_BASE}/gallery`)
            .then((res) => res.json())
            .then((data) => setArtworks(data));
    }, []);

    const handleUpload = async () => {
        if (!uploadTitle || !uploadFile) return;

        const formData = new FormData();
        formData.append("title", uploadTitle);
        formData.append("file", uploadFile);

        try {
            await fetch("${API_BASE}/gallery/upload", {
                method: "POST",
                body: formData,
            });

            const updatedGallery = await fetch(`${API_BASE}/gallery`).then(
                (res) => res.json()
            );
            setArtworks(updatedGallery);

            setUploadTitle("");
            setUploadFile(null);
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };
    const handlePublish = async () => {
        if (!uploadTitle || !uploadFile) return;
    
        const username = localStorage.getItem("username"); // or however you store it
        if (!username) {
            alert("User not logged in");
            return;
        }
    
        const formData = new FormData();
        formData.append("file", uploadFile);
        formData.append("username", username);
    
        try {
            const response = await fetch(`${API_BASE}/api/community-ratings/upload-image`, {
                method: "POST",
                body: formData,
                headers: {
                    published: "true",
                    title: uploadTitle,
                },
            });
    
            if (response.ok) {
                console.log("✅ Image published successfully.");
                setUploadTitle("");
                setUploadFile(null);
                navigate("/community-ratings"); // update route if needed
            } else {
                const errorText = await response.text();
                console.error("❌ Upload failed:", errorText);
    
                if (response.status === 401) alert("Auth error – backend issue");
                else if (response.status === 404) alert("User not found – frontend issue");
                else alert("Something went wrong: " + errorText);
            }
        } catch (err) {
            console.error("🔥 Publish error:", err);
            alert("Network or server error");
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
                    onClick={handlePublish}
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
