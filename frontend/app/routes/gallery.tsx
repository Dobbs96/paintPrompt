import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
const BUTTON_BG = "#AC83CA";      // same purple as Home
const BUTTON_BORDER = "#E5E7EB";  // light gray border

const API_BASE = "http://localhost:8080";

export default function Gallery() {
  const navigate = useNavigate();
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [artworks, setArtworks] = useState<any[]>([]);
  const [uploadSelected, setUploadSelected] = useState(false);
  const [publishSelected, setPublishSelected] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    if (!username) return;
    const res = await fetch(`${API_BASE}/api/gallery/user-images?currentUser=${username}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (res.ok) {
      const data = await res.json();
      setArtworks(data);
    }
  };

  // Close lightbox on Escape
  useEffect(() => {
    if (!lightboxSrc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxSrc(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxSrc]);

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
        let message = "";
        try {
          const asJson = await response.json();
          message = asJson?.message || JSON.stringify(asJson);
        } catch {
          message = await response.text();
        }
        console.error("❌ Upload failed:", message);

        if (response.status === 413) {
          alert("File too large. Maximum allowed is 25MB.");
        } else if (response.status === 401) {
          alert("Auth error – backend issue");
        } else if (response.status === 404) {
          alert("User not found – frontend issue");
        } else {
          alert("Something went wrong: " + (message || "Unknown error"));
        }
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
        let message = "";
        try {
          const asJson = await response.json();
          message = asJson?.message || JSON.stringify(asJson);
        } catch {
          message = await response.text();
        }
        console.error("❌ Upload failed:", message);

        if (response.status === 413) {
          alert("File too large. Maximum allowed is 25MB.");
        } else if (response.status === 401) {
          alert("Auth error – backend issue");
        } else if (response.status === 404) {
          alert("User not found – frontend issue");
        } else {
          alert("Something went wrong: " + (message || "Unknown error"));
        }
      }
    } catch (err) {
      console.error("🔥 Publish error:", err);
      alert("Network or server error");
    }
  };

  const handlePublishExisting = async (imagePath: string) => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    if (!username || !token) {
      alert("User not logged in");
      return;
    }
    try {
      setLoadingAction(imagePath + "-publish");
      const res = await fetch(
        `${API_BASE}/api/gallery/publish?currentUser=${encodeURIComponent(username)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ imagePath }),
        }
      );
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to publish");
      }
      await fetchArtworks();
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to publish");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteExisting = async (imagePath: string) => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    if (!username || !token) {
      alert("User not logged in");
      return;
    }
    if (!confirm("Delete this image? This cannot be undone.")) return;
    try {
      setLoadingAction(imagePath + "-delete");
      const res = await fetch(
        `${API_BASE}/api/gallery/delete?currentUser=${encodeURIComponent(username)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ imagePath }),
        }
      );
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to delete");
      }
      await fetchArtworks();
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to delete");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
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

    {/* Title */}
    <div className="text-center flex-1">
      <h1 className="text-3xl font-bold">Your Painting Journey</h1>
      <p className="text-lg opacity-90">
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
          Scroll through your collection of creations and compare your progress.
        </p>

        <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {artworks.map((art, index) => {
            const version = encodeURIComponent(art.date ?? art.upload_ts ?? "");
            const baseUrl = art.image?.startsWith("/uploads/")
              ? `${API_BASE}${art.image}`
              : art.image?.startsWith("http")
              ? art.image
              : `https://paintprompt.s3.us-east-2.amazonaws.com/${art.image}`;
            const imgUrl = `${baseUrl}${baseUrl?.includes("?") ? "&" : "?"}v=${version}`;
            const isPublished = !!art.published;
            const avg: number = typeof art.avgRating === "number" ? art.avgRating : 0;
            const filled = Math.round(avg);
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow p-5 border border-gray-200 hover:shadow-md transition text-center"
              >
                <div
                  className="w-full rounded-xl overflow-hidden border border-gray-200 mb-4 bg-white cursor-zoom-in"
                  style={{ aspectRatio: "16 / 9" }}
                  onClick={() => setLightboxSrc(imgUrl)}
                  title="Click to enlarge"
                >
                  <img
                    src={imgUrl}
                    alt={art.title}
                    className="w-full h-full object-contain object-center"
                  />
                </div>

                <h4 className="text-lg font-semibold capitalize">
                  {art.title || "Untitled"}
                </h4>
                <p className="text-sm text-gray-500">Uploaded on {formatDate(art.date ?? art.upload_ts)}</p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full inline-block">You</span>
                  {isPublished && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full inline-block">Published</span>
                  )}
                </div>

                {isPublished ? (
                  <div className="mt-3 text-sm text-gray-700 flex items-center justify-center gap-2">
                    <span className="font-medium">Rating:</span>
                    <div className="flex items-center gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <span
                          key={i}
                          style={{
                            display: "inline-block",
                            width: 10,
                            height: 10,
                            borderRadius: 9999,
                            background: i < filled ? "#AC83CA" : "#E5E7EB",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 text-sm text-gray-500">Not published yet</div>
                )}

                <div className="mt-4 flex gap-3 justify-center">
                  {!isPublished && (
                    <button
                      onClick={() => handlePublishExisting(art.imagePath)}
                      disabled={loadingAction === art.imagePath + "-publish"}
                      className="px-3 py-2 rounded-md text-white text-sm"
                      style={{ background: BUTTON_BG, opacity: loadingAction === art.imagePath + "-publish" ? 0.7 : 1 }}
                    >
                      {loadingAction === art.imagePath + "-publish" ? "Publishing…" : "Publish"}
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteExisting(art.imagePath)}
                    disabled={loadingAction === art.imagePath + "-delete"}
                    className="px-3 py-2 rounded-md text-sm border"
                    style={{ borderColor: "#D1D5DB", color: "#374151" }}
                  >
                    {loadingAction === art.imagePath + "-delete" ? "Deleting…" : "Delete"}
                  </button>
                </div>
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
      ? { background: BUTTON_BG, color: "#fff", border: `1px solid ${BUTTON_BORDER}` }
      : { background: "#fff", color: "#374151", border: "1px solid #D1D5DB" } // neutral chip
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
      ? { background: BUTTON_BG, color: "#fff", border: `1px solid ${BUTTON_BORDER}` }
      : { background: "#fff", color: "#374151", border: "1px solid #D1D5DB" }
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

    <div className="w-full mb-6">
      <input
        ref={fileInputRef}
        id="gallery-file-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-1 rounded-full text-sm font-medium shadow-sm"
          style={{ background: BUTTON_BG, color: "#fff", border: `1px solid ${BUTTON_BORDER}` }}
        >
          Select
        </button>
        <span className="text-sm text-gray-600 truncate">
          {uploadFile?.name || "No file selected"}
        </span>
      </div>
    </div>

    {/* Submit button at the bottom */}
    <button
  onClick={() => {
    if (publishSelected) handlePublish();
    else if (uploadSelected) handleUpload();
  }}
  disabled={!uploadTitle || !uploadFile || (!uploadSelected && !publishSelected)}
  className="w-full px-6 py-3 rounded-xl font-medium transition shadow-sm"
  style={
    !uploadTitle || !uploadFile || (!uploadSelected && !publishSelected)
      ? { background: "#E5E7EB", color: "#9CA3AF", cursor: "not-allowed" }
      : { background: BUTTON_BG, color: "#fff", border: `1px solid ${BUTTON_BORDER}` }
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
    {lightboxSrc && (
      <div
        onClick={() => setLightboxSrc(null)}
        className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="max-w-5xl w-full">
          <img
            src={lightboxSrc || undefined}
            alt="Enlarged artwork"
            className="w-full h-auto max-h-[85vh] object-contain border-none outline-none"
          />
          <div className="text-center text-white/80 text-sm mt-3 select-none">
            Click anywhere to close
          </div>
        </div>
      </div>
    )}
  </>
  );
}

// Lightbox overlay (portal-like) appended within the page tree
// Rendered at the end to sit above content via fixed positioning
