import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
// const API_BASE = "http://localhost:8080";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Gallery() {
    const navigate = useNavigate();
    const [uploadTitle, setUploadTitle] = useState("");
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [artworks, setArtworks] = useState<any[]>([]);
    const [uploadSelected, setUploadSelected] = useState(false);
    const [publishSelected, setPublishSelected] = useState(false);

    function formatDate(d?: string | number | null) {
        if (!d && d !== 0) return "—";
        const dt = new Date(d as any);
        if (isNaN(dt.getTime())) return String(d);
        return dt.toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    useEffect(() => {
        const username = localStorage.getItem("username");
        const token = localStorage.getItem("token");
        fetch(`${API_BASE}/api/gallery/user-images?currentUser=${username}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
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
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${API_BASE}/api/community-ratings/upload-image`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        title: uploadTitle,
                    },
                }
            );

            if (response.ok) {
                console.log("✅ Image uploaded successfully.");
                setUploadTitle("");
                setUploadFile(null);
                // Refresh gallery list
                window.location.reload();
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
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${API_BASE}/api/community-ratings/upload-image`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        published: "true",
                        title: uploadTitle,
                    },
                }
            );

            if (response.ok) {
                console.log("✅ Image published successfully.");
                setUploadTitle("");
                setUploadFile(null);
                // Refresh gallery list
                window.location.reload();
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
            {/* Header (with back button inside, gradient lavender) */}
            <header className="rounded-lg mb-8 shadow bg-gradient-to-r from-[#E9D5FF] via-[#D8B4FE] to-[#C4B5FD]">
                <div className="grid grid-cols-3 items-center p-6 sm:p-8">
                    <button
                        onClick={() => navigate("/home")}
                        className="justify-self-start text-purple-800 border border-purple-300 px-4 py-2 rounded-md hover:bg-white/60 transition"
                    >
                        ← Back to Home
                    </button>

                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-1 text-purple-900">
                            Your Painting Journey
                        </h1>
                        <p className="text-lg text-purple-900/70">
                            Explore your artistic growth and creativity.
                        </p>
                    </div>

                    <div />
                </div>
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
                                    Uploaded on{" "}
                                    {formatDate(art.date ?? art.upload_ts)}
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
                    {/* TOP: Upload / Publish toggles */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <button
                            type="button"
                            onClick={() => setUploadSelected(!uploadSelected)}
                            className={
                                "px-5 py-2 rounded-full border transition " +
                                (uploadSelected
                                    ? "bg-purple-600 text-white border-purple-700"
                                    : "bg-white text-purple-700 border-purple-300 hover:bg-purple-50")
                            }
                        >
                            Upload
                        </button>
                        <button
                            type="button"
                            onClick={() => setPublishSelected(!publishSelected)}
                            className={
                                "px-5 py-2 rounded-full border transition " +
                                (publishSelected
                                    ? "bg-purple-300 text-purple-900 border-purple-400"
                                    : "bg-white text-purple-900 border-purple-200 hover:bg-purple-50")
                            }
                        >
                            Publish
                        </button>
                    </div>

                    {/* TITLE under the buttons */}
                    <h3 className="text-xl font-semibold mb-1">Your Artwork</h3>
                    <p className="text-gray-600 mb-4">
                        Add your latest masterpiece to the collection.
                    </p>

                    {/* Inputs */}
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
                        className="w-full border border-gray-300 px-4 py-2 rounded mb-6"
                        onChange={(e) =>
                            setUploadFile(e.target.files?.[0] || null)
                        }
                    />

                    {/* Submit button at the bottom */}
                    <button
                        onClick={() => {
                            if (publishSelected) {
                                handlePublish(); // publish overrides upload
                            } else if (uploadSelected) {
                                handleUpload();
                            }
                        }}
                        disabled={
                            !uploadTitle ||
                            !uploadFile ||
                            (!uploadSelected && !publishSelected)
                        }
                        className={
                            "w-full px-6 py-3 rounded-lg transition " +
                            (uploadTitle &&
                            uploadFile &&
                            (uploadSelected || publishSelected)
                                ? "bg-black text-white hover:opacity-90"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed")
                        }
                    >
                        Submit
                    </button>
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
