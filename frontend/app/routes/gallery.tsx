import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
//const API_BASE = "http://localhost:8080";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Gallery() {
    const navigate = useNavigate();
    const [uploadTitle, setUploadTitle] = useState("");
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [artworks, setArtworks] = useState<any[]>([]);

    useEffect(() => {
        const username = localStorage.getItem("username");
        fetch(`${API_BASE}/api/gallery/user-images?currentUser=${username}`)
            .then((res) => res.json())
            .then((data) => setArtworks(data));
    }, []);

    const handleUpload = async () => {
        if (!uploadTitle || !uploadFile) return;

        const username = localStorage.getItem("username");
        if (!username) {
            alert("User not logged in");
            return;
        }

        const formData = new FormData();
        formData.append("file", uploadFile);
        formData.append("username", username);

        try {
            const response = await fetch(
                `${API_BASE}/api/community-ratings/upload-image`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        title: uploadTitle,
                    },
                }
            );

            if (response.ok) {
                console.log("✅ Image uploaded successfully.");
                setUploadTitle("");
                setUploadFile(null);
                // Refresh the artworks by fetching them again
                const username = localStorage.getItem("username");
                fetch(
                    `${API_BASE}/api/gallery/user-images?currentUser=${username}`
                )
                    .then((res) => res.json())
                    .then((data) => setArtworks(data));
            } else {
                const errorText = await response.text();
                console.error("❌ Upload failed:", errorText);

                if (response.status === 401)
                    alert("Auth error – backend issue");
                else if (response.status === 404)
                    alert("User not found – frontend issue");
                else alert("Something went wrong: " + errorText);
            }
        } catch (err) {
            console.error("🔥 Publish error:", err);
            alert("Network or server error");
        }
    };

    const handlePublish = async () => {
        if (!uploadTitle || !uploadFile) return;

        const username = localStorage.getItem("username");
        if (!username) {
            alert("User not logged in");
            return;
        }

        const formData = new FormData();
        formData.append("file", uploadFile);
        formData.append("username", username);

        try {
            const response = await fetch(
                `${API_BASE}/api/community-ratings/upload-image`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        published: "true",
                        title: uploadTitle,
                    },
                }
            );

            if (response.ok) {
                console.log("✅ Image published successfully.");
                setUploadTitle("");
                setUploadFile(null);
                // Refresh the artworks by fetching them again
                const username = localStorage.getItem("username");
                fetch(
                    `${API_BASE}/api/gallery/user-images?currentUser=${username}`
                )
                    .then((res) => res.json())
                    .then((data) => setArtworks(data));
            } else {
                const errorText = await response.text();
                console.error("❌ Upload failed:", errorText);

                if (response.status === 401)
                    alert("Auth error – backend issue");
                else if (response.status === 404)
                    alert("User not found – frontend issue");
                else alert("Something went wrong: " + errorText);
            }
        } catch (err) {
            console.error("🔥 Publish error:", err);
            alert("Network or server error");
        }
    };

    return (
        <div className="p-6 sm:p-8 font-sans bg-[#F5F3FF] min-h-screen">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate("/home")}
                    className="text-purple-600 border border-purple-300 px-4 py-2 rounded-md hover:bg-purple-50 transition"
                >
                    ← Back to Home
                </button>
            </div>

            {/* Header */}
            <header className="bg-pink-300 text-white text-center p-8 rounded-lg mb-8 shadow">
                <h1 className="text-3xl font-bold mb-2">
                    Your Painting Journey
                </h1>
                <p className="text-lg">
                    Explore your artistic growth and creativity.
                </p>
            </header>

            {/* Gallery */}
            <section className="mb-16 text-center">
                <h2 className="text-2xl font-semibold mb-1">Gallery</h2>
                <p className="text-gray-600 mb-6">
                    Scroll through your collection of creations and compare your
                    progress.
                </p>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {artworks.map((art, index) => {
                        console.log("art.image:", art.image); // 👈 See what this prints

                        return (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow p-4 border border-gray-200 hover:shadow-md transition"
                            >
                                <img
                                    src={
                                        art.image?.startsWith("/uploads/")
                                            ? `${API_BASE}${art.image}`
                                            : art.image?.startsWith("http")
                                            ? art.image
                                            : `https://paintprompt.s3.us-east-2.amazonaws.com/${art.image}`
                                    }
                                    alt={art.title}
                                    className="w-full h-48 object-cover rounded-lg border border-gray-300 mb-3"
                                />

                                <h4 className="text-lg font-semibold capitalize">
                                    {art.title || "Untitled"}
                                </h4>
                                <p className="text-sm text-gray-500">
                                    Uploaded on {art.date}
                                </p>
                                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full mt-1 inline-block">
                                    You
                                </span>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Upload Form */}
            <section className="mb-20 text-center">
                <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-2">
                        Upload Artwork
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Add your latest masterpiece to the collection.
                    </p>

                    <input
                        type="text"
                        placeholder="Artwork Title"
                        className="w-full border border-gray-300 px-4 py-2 rounded mb-3"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full border border-gray-300 px-4 py-2 rounded mb-4"
                        onChange={(e) =>
                            setUploadFile(e.target.files?.[0] || null)
                        }
                    />
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={handleUpload}
                            className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                        >
                            Upload
                        </button>
                        <button
                            onClick={handlePublish}
                            className="px-6 py-2 bg-purple-300 text-purple-800 rounded hover:bg-purple-400 transition"
                        >
                            Publish
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
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
