import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
// const BUTTON_BG = "#AC83CA";      // same purple as Home
const BUTTON_BORDER = "#E5E7EB"; // light gray border
const BUTTON_BG = "#AC83CA"; // same purple as Home
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
            <header
                className="mb-10 p-8 text-white rounded-lg"
                style={{
                    background: "#AC83CA", // Trademark purple
                }}
            >
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/home")}
                        className="px-6 py-2 rounded-full font-semibold transition"
                        style={{
                            background: "#AC83CA",
                            border: "2px solid white",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#8B5FBF"; // darker purple on hover
                            e.currentTarget.style.fontWeight = "bold";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#AC83CA";
                            e.currentTarget.style.fontWeight = "600";
                        }}
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

                    {/* Right-side spacer */}
                    <div style={{ width: "135px" }} />
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
                        const version = encodeURIComponent(
                            art.date ?? art.upload_ts ?? ""
                        );
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow p-4 border border-gray-200 hover:shadow-md transition"
                            >
                                <img
                                    src={
                                        art.image?.startsWith("/uploads/")
                                            ? `${API_BASE}${art.image}?v=${version}`
                                            : art.image?.startsWith("http")
                                            ? art.image
                                            : `https://paintprompt.s3.us-east-2.amazonaws.com/${art.image}?v=${version}`
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
                            className="px-6 py-2 rounded-full shadow-sm font-semibold transition"
                            style={
                                uploadSelected
                                    ? {
                                          background: BUTTON_BG,
                                          color: "#fff",
                                          border: `1px solid ${BUTTON_BORDER}`,
                                      }
                                    : {
                                          background: "#fff",
                                          color: "#374151",
                                          border: "1px solid #D1D5DB",
                                      } // neutral chip
                            }
                        >
                            Upload
                        </button>

                        <button
                            type="button"
                            onClick={() => setPublishSelected(!publishSelected)}
                            className="px-6 py-2 rounded-full shadow-sm font-semibold transition"
                            style={
                                publishSelected
                                    ? {
                                          background: BUTTON_BG,
                                          color: "#fff",
                                          border: `1px solid ${BUTTON_BORDER}`,
                                      }
                                    : {
                                          background: "#fff",
                                          color: "#374151",
                                          border: "1px solid #D1D5DB",
                                      }
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
                            if (publishSelected) handlePublish();
                            else if (uploadSelected) handleUpload();
                        }}
                        disabled={
                            !uploadTitle ||
                            !uploadFile ||
                            (!uploadSelected && !publishSelected)
                        }
                        className="w-full px-6 py-3 rounded-xl font-medium transition shadow-sm"
                        style={
                            !uploadTitle ||
                            !uploadFile ||
                            (!uploadSelected && !publishSelected)
                                ? {
                                      background: "#E5E7EB",
                                      color: "#9CA3AF",
                                      cursor: "not-allowed",
                                  }
                                : {
                                      background: BUTTON_BG,
                                      color: "#fff",
                                      border: `1px solid ${BUTTON_BORDER}`,
                                  }
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
