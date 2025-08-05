import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
//import { useLocation } from "react-router";

const RAINBOW_COLORS = [
    "#FF0000", // Red
    "#FF7F00", // Orange
    "#FFFF00", // Yellow
    "#00FF00", // Green
    "#0000FF", // Blue
    "#4B0082", // Indigo
    "#9400D3", // Violet
];

function RainbowText({
    text,
    rainbowDuration = 3000,
    interval = 17000,
}: {
    text: string;
    rainbowDuration?: number;
    interval?: number;
}) {
    const [rainbow, setRainbow] = useState(false);
    const [rainbowStart, setRainbowStart] = useState(0);
    const rainbowLength = 6; // Number of letters to show rainbow at a time
    const steps = text.length + rainbowLength; // allow rainbow to fully exit
    useEffect(() => {
        let rainbowTimeout: NodeJS.Timeout;
        let rainbowInterval: NodeJS.Timeout;
        let colorInterval: NodeJS.Timeout;
        function startRainbow() {
            setRainbow(true);
            setRainbowStart(0);
            let i = 0;
            colorInterval = setInterval(() => {
                setRainbowStart((prev) => prev + 1);
                i++;
            }, rainbowDuration / steps);
            rainbowTimeout = setTimeout(() => {
                setRainbow(false);
                setRainbowStart(0);
                clearInterval(colorInterval);
            }, rainbowDuration);
        }
        startRainbow();
        rainbowInterval = setInterval(() => {
            startRainbow();
        }, interval + rainbowDuration);
        return () => {
            clearInterval(rainbowInterval);
            clearTimeout(rainbowTimeout);
            clearInterval(colorInterval);
        };
    }, [text, rainbowDuration, interval, steps]);
    return (
        <span style={{ color: rainbow ? undefined : "#000" }}>
            {text.split("").map((char, i) => {
                let color = "#000";
                let textShadow = "none";
                if (
                    rainbow &&
                    i >= rainbowStart &&
                    i < rainbowStart + rainbowLength &&
                    char !== " "
                ) {
                    const colorIndex =
                        (i - rainbowStart) % RAINBOW_COLORS.length;
                    color = RAINBOW_COLORS[colorIndex];
                    textShadow = `0 0 8px ${color}, 0 0 16px ${color}`;
                }
                return (
                    <span
                        key={i}
                        style={{
                            color,
                            textShadow,
                            transition:
                                "color 0.3s linear, text-shadow 0.3s linear",
                        }}
                    >
                        {char}
                    </span>
                );
            })}
        </span>
    );
}

const MOODS = [
    "Happy",
    "Sad",
    "Afraid",
    "Angry",
    "Excited",
    "Surprise Me",
    "Other...",
];

const COMPLEXITIES = ["Easy", "Normal", "Hard", "Other..."];

const FORMATS = ["Landscape", "Portrait", "Square", "Other..."];

const Home: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState("");
    //const [ratingHover, setRatingHover] = useState(0);

    const [showMoodOptions, setShowMoodOptions] = useState(false);
    const [moodOptionsVisible, setMoodOptionsVisible] = useState(false); // for fade-out
    const [selectedMood, setSelectedMood] = useState("");
    const [customMood, setCustomMood] = useState("");

    const navigate = useNavigate();

    const [showComplexOptions, setShowComplexOptions] = useState(false);
    const [complexOptionsVisible, setComplexOptionsVisible] = useState(false); // fade out
    const [selectedComplex, setSelectedComplex] = useState("");
    const [customComplex, setCustomComplex] = useState("");

    const [showFormatOptions, setShowFormatOptions] = useState(false);
    const [formatOptionsVisible, setFormatOptionsVisible] = useState(false); // fade out
    const [selectedFormat, setSelectedFormat] = useState("");
    const [customFormat, setCustomFormat] = useState("");

    const [showMediumOptions, setShowMediumOptions] = useState(false);
    const [mediumOptionVisible, setMediumOptionsVisible] = useState(false);
    const [selectedMedium, setSelectedMedium] = useState("");
    const [customMedium, setCustomMedium] = useState("");

    const [username, setUsername] = useState<string | null>(null);
    //const [password, setPassword] = useState("");
    const [_message, setMessage] = useState("");
    const [materials, setMaterials] = useState<string[]>([]);
    const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
    const [loadingPrompt, setLoadingPrompt] = useState(false);
    const [showPromptError, setShowPromptError] = useState(false);

    //const location = useLocation();

    const getMaterials = async () => {
        if (!username) {
            // Don't show error in UI, just return
            return;
        }
        try {
            const response = await fetch(
                `${API_BASE}/api/user/get/materials?username=${encodeURIComponent(
                    username
                )}`
            );
            const result = await response.text();
            if (response.ok) {
                const parsedMaterials = result
                    .split(",")
                    .map((m) => m.trim())
                    .filter(Boolean);
                setMaterials(parsedMaterials);
            }
            // Don't setMessage here
        } catch (error) {
            // Don't setMessage here
            console.error("Error fetching materials:", error);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            setUsername(localStorage.getItem("username"));
        }
    }, []);

    useEffect(() => {
        getMaterials();
    }, [username]);

    useEffect(() => {
        if (showMoodOptions) {
            setMoodOptionsVisible(true);
        } else {
            // If mood options are closed without selection (no fade-out), hide immediately
            setMoodOptionsVisible(false);
        }

        if (showComplexOptions) {
            setComplexOptionsVisible(true);
        } else {
            setComplexOptionsVisible(false);
        }

        if (showFormatOptions) {
            setFormatOptionsVisible(true);
        } else {
            setFormatOptionsVisible(false);
        }

        if (showMediumOptions) {
            setMediumOptionsVisible(true);
        } else {
            setMediumOptionsVisible(false);
        }
    }, [
        showMoodOptions,
        showComplexOptions,
        showFormatOptions,
        showMediumOptions,
    ]);

    // Community Ratings State
    const [communityImages, setCommunityImages] = useState<any[]>([]);
    const [communityPage, setCommunityPage] = useState(0);
    const [communityHasMore, setCommunityHasMore] = useState(true);
    const [communityLoading, setCommunityLoading] = useState(false);
    const [communityError, setCommunityError] = useState("");
    const communityObserver = React.useRef<IntersectionObserver | null>(null);

    // Reset community images and page when sidebar is opened
    useEffect(() => {
        if (isOpen) {
            setCommunityImages([]);
            setCommunityPage(0);
            setCommunityHasMore(true);
            setCommunityError("");
        }
    }, [isOpen]);

    const lastCommunityImageRef = React.useCallback(
        (node: HTMLDivElement | null) => {
            if (communityLoading) return;
            if (communityObserver.current)
                communityObserver.current.disconnect();
            communityObserver.current = new window.IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && communityHasMore) {
                        setCommunityPage((prev) => prev + 1);
                    }
                }
            );
            if (node) communityObserver.current.observe(node);
        },
        [communityLoading, communityHasMore]
    );

    useEffect(() => {
        if (!isOpen || !username) return;
        setCommunityLoading(true);
        setCommunityError("");
        console.log("Fetching community images", {
            page: communityPage,
            username,
        });
        fetch(
            `${API_BASE}/api/community-ratings/images?currentUser=${encodeURIComponent(
                username ?? ""
            )}&page=${communityPage}&size=10`
        )
            .then((res) => res.json())
            .then((data) => {
                setCommunityImages((prev) => [...prev, ...data.images]);
                setCommunityHasMore(data.images.length === 10);
                setCommunityLoading(false);
            })
            .catch(() => {
                setCommunityError("Failed to load images");
                setCommunityLoading(false);
            });
    }, [communityPage, isOpen, username]);

    const handleCommunityRate = async (
        targetUsername: string,
        imagePath: string,
        rating: number
    ) => {
        try {
            await fetch(
                `${API_BASE}/api/community-ratings/rate?currentUser=${encodeURIComponent(
                    username ?? ""
                )}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ targetUsername, imagePath, rating }),
                }
            );
            setCommunityImages((prev) =>
                prev.map((img) =>
                    img.imagePath === imagePath &&
                    img.username === targetUsername
                        ? { ...img, avgRating: rating, ratingCount: 1 }
                        : img
                )
            );
        } catch {
            alert("Failed to submit rating");
        }
    };

    // StarRating component for ratings UI
    const StarRating: React.FC<{
        value: number;
        onChange: (v: number) => void;
        disabled?: boolean;
    }> = ({ value, onChange, disabled }) => {
        const [hover, setHover] = useState(0);
        return (
            <div style={{ display: "flex", gap: 2 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        style={{
                            cursor: disabled ? "not-allowed" : "pointer",
                            color:
                                (hover || value) >= star ? "#f5b301" : "#ccc",
                            fontSize: 22,
                        }}
                        onMouseEnter={() => !disabled && setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => !disabled && onChange(star)}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    // Color palette to match the rest of the app
    const mainBg = "#F5F3FF"; // light purple
    const cardBg = "#AC83CA"; // main accent
    const buttonBg = "#AC83CA";
    //const buttonHover = "#8B5FBF";
    const textColor = "#1A1A1A";
    const secondaryText = "#6B7280";
    const borderColor = "#E5E7EB";

    const generatePrompt = async () => {
        setShowPromptError(false);
        if (!username) {
            setMessage("Login is Required");
            setShowPromptError(true);
            return;
        }
        setLoadingPrompt(true);
        setGeneratedPrompt("");
        setMessage("");
        try {
            // Only include params that are set
            const params = new URLSearchParams();
            if (selectedMood) params.append("mood", selectedMood);
            if (selectedMedium) params.append("medium", selectedMedium);
            if (selectedComplex) params.append("complexity", selectedComplex);
            if (selectedFormat) params.append("format", selectedFormat);
            if (prompt) params.append("prompt", prompt);
            const response = await fetch(
                `${API_BASE}/api/prompt/generate?${params.toString()}`
            );
            const result = await response.text();
            if (response.ok) {
                setGeneratedPrompt(result);
            } else {
                setMessage(result || "Failed to generate prompt.");
                setShowPromptError(true);
            }
        } catch (error) {
            setMessage("Error connecting to server.");
            setShowPromptError(true);
        } finally {
            setLoadingPrompt(false);
        }
    };

    return (
        <div
            className="relative flex h-screen overflow-hidden font-sans"
            style={{
                backgroundImage: "url('/user_images/paint-texture.jpg')",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundBlendMode: "normal", // ← simplified
                color: textColor,
              }}

        >
            {/* Prompt Section */}
            <div className="flex-1 px-16 py-10 transition-all duration-300 relative">
                <div className="max-w-3xl mx-auto min-h-[calc(100vh-120px)] relative">
                    <div className="text-center mb-12 pt-6">
                        <h1 className="text-5xl font-semibold tracking-tight mb-2">
                            <RainbowText
                                text="Paint Prompt"
                                rainbowDuration={3000}
                                interval={17000}
                            />
                        </h1>
                        <p
                            className="text-xl mb-3"
                            style={{ color: secondaryText }}
                        >
                            How are you feeling today?
                        </p>
                        <p
                            className="text-md italic"
                            style={{ color: buttonBg }}
                        >
                            🎨 Tip: Mixing colors leads to unexpectedly
                            beautiful results.
                        </p>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button
                            className="px-6 py-2 rounded-full shadow-sm font-semibold transition "
                            style={{
                                background: buttonBg,
                                color: "#fff",
                                border: `1px solid ${borderColor}`,
                            }}
                            onClick={() => {
                                setShowMoodOptions((prev) => !prev);
                                setShowMediumOptions(false);
                                setShowComplexOptions(false);
                                setShowFormatOptions(false);
                            }}
                        >
                            Mood
                        </button>
                        <button
                            className="px-6 py-2 rounded-full shadow-sm font-semibold transition"
                            style={{
                                background: buttonBg,
                                color: "#fff",
                                border: `1px solid ${borderColor}`,
                            }}
                            onClick={() => {
                                setShowMoodOptions(false);
                                setShowMediumOptions((prev) => !prev);
                                setShowComplexOptions(false);
                                setShowFormatOptions(false);
                            }}
                        >
                            Medium
                        </button>
                        <button
                            className="px-6 py-2 rounded-full shadow-sm font-semibold transition"
                            style={{
                                background: buttonBg,
                                color: "#fff",
                                border: `1px solid ${borderColor}`,
                            }}
                            onClick={() => {
                                setShowMoodOptions(false);
                                setShowMediumOptions(false);
                                setShowComplexOptions((prev) => !prev);
                                setShowFormatOptions(false);
                            }}
                        >
                            Complexity
                        </button>
                        <button
                            className="px-6 py-2 rounded-full shadow-sm font-semibold transition"
                            style={{
                                background: buttonBg,
                                color: "#fff",
                                border: `1px solid ${borderColor}`,
                            }}
                            onClick={() => {
                                setShowMoodOptions(false);
                                setShowMediumOptions(false);
                                setShowComplexOptions(false);
                                setShowFormatOptions((prev) => !prev);
                            }}
                        >
                            Format
                        </button>
                    </div>

                    {mediumOptionVisible && (
                        <div
                            className={`flex flex-row items-center justify-center gap-1 mt-2 transition-opacity duration-500 ${
                                showMediumOptions
                                    ? "opacity-100"
                                    : "opacity-0 pointer-events-none"
                            }`}
                            style={{ zIndex: 2 }}
                        >
                            {materials.slice(0, 6).map((medium) => {
                                const isSelected = selectedMedium === medium;
                                return (
                                    <button
                                        key={medium}
                                        className={`px-4 py-2 whitespace-nowrap rounded-full font-semibold shadow-sm border transition hover:bg-gray-100 bg-white text-gray-700 ${
                                            isSelected
                                                ? "border-[#AC83CA] font-bold"
                                                : "border-gray-300"
                                        }`}
                                        style={{ margin: "0 0.1rem" }}
                                        onClick={() => {
                                            setSelectedMedium(medium);
                                            setTimeout(() => {
                                                setShowMediumOptions(false);
                                                setTimeout(
                                                    () =>
                                                        setMediumOptionsVisible(
                                                            false
                                                        ),
                                                    500
                                                );
                                            }, 1000);
                                        }}
                                    >
                                        {medium}
                                    </button>
                                );
                            })}
                            <div
                                key="other"
                                className="flex flex-col items-center"
                                style={{ margin: "0 0.1rem" }}
                            >
                                {!customMedium && (
                                    <button
                                        className={`px-4 py-2 whitespace-nowrap rounded-full font-semibold shadow-sm border transition hover:bg-gray-100 bg-white text-gray-700 ${
                                            selectedMedium &&
                                            !materials.includes(selectedMedium)
                                                ? "border-[#AC83CA] font-bold"
                                                : "border-gray-300"
                                        }`}
                                        onClick={() =>
                                            setCustomMedium("typing")
                                        }
                                        style={{ minWidth: 0 }}
                                    >
                                        Other...
                                    </button>
                                )}
                                {customMedium === "typing" && (
                                    <input
                                        autoFocus
                                        className="px-2 py-2 rounded-full bg-white text-gray-700 font-bold shadow-sm border border-[#AC83CA] text-center outline-none"
                                        style={{ minWidth: 80, maxWidth: 160 }}
                                        placeholder="Other..."
                                        value={selectedMedium}
                                        onChange={(e) =>
                                            setSelectedMedium(e.target.value)
                                        }
                                        onBlur={() => {
                                            if (selectedMedium.trim()) {
                                                setTimeout(() => {
                                                    setShowMediumOptions(false);
                                                    setTimeout(
                                                        () =>
                                                            setMediumOptionsVisible(
                                                                false
                                                            ),
                                                        500
                                                    );
                                                }, 1000);
                                            }
                                            setCustomMedium("");
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                if (selectedMedium.trim()) {
                                                    setTimeout(() => {
                                                        setShowMediumOptions(
                                                            false
                                                        );
                                                        setTimeout(
                                                            () =>
                                                                setMediumOptionsVisible(
                                                                    false
                                                                ),
                                                            500
                                                        );
                                                    }, 1000);
                                                }
                                                setCustomMedium("");
                                            }
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Format Options Animation - now directly below with a small gap */}
                    {formatOptionsVisible && (
                        <div
                            className={`flex flex-row items-center justify-center gap-1 mt-2 transition-opacity duration-500 ${
                                showFormatOptions
                                    ? "opacity-100"
                                    : "opacity-0 pointer-events-none"
                            }`}
                            style={{ zIndex: 2 }}
                        >
                            {FORMATS.map((format) => {
                                const isSelected = selectedFormat === format;
                                return format !== "Other..." ? (
                                    <button
                                        key={format}
                                        className={`px-4 py-2 whitespace-nowrap rounded-full font-semibold shadow-sm border transition hover:bg-gray-100 bg-white text-gray-700 ${
                                            isSelected
                                                ? "border-[#AC83CA] font-bold"
                                                : "border-gray-300"
                                        }`}
                                        style={{ margin: "0 0.1rem" }}
                                        onClick={() => {
                                            setSelectedFormat(format);
                                            setTimeout(() => {
                                                setShowFormatOptions(false);
                                                setTimeout(
                                                    () =>
                                                        setFormatOptionsVisible(
                                                            false
                                                        ),
                                                    500
                                                ); // match fade duration
                                            }, 1000);
                                        }}
                                    >
                                        {format}
                                    </button>
                                ) : (
                                    <div
                                        key="other"
                                        className="flex flex-col items-center"
                                        style={{ margin: "0 0.1rem" }}
                                    >
                                        {!customFormat && (
                                            <button
                                                className={`px-4 py-2 whitespace-nowrap rounded-full font-semibold shadow-sm border transition hover:bg-gray-100 bg-white text-gray-700 ${
                                                    selectedFormat &&
                                                    !FORMATS.includes(
                                                        selectedFormat
                                                    )
                                                        ? "border-[#AC83CA] font-bold"
                                                        : "border-gray-300"
                                                }`}
                                                onClick={() =>
                                                    setCustomFormat("typing")
                                                }
                                                style={{ minWidth: 0 }}
                                            >
                                                Other...
                                            </button>
                                        )}
                                        {customFormat === "typing" && (
                                            <input
                                                autoFocus
                                                className="px-2 py-2 rounded-full bg-white text-gray-700 font-bold shadow-sm border border-[#AC83CA] text-center outline-none"
                                                style={{
                                                    minWidth: 80,
                                                    maxWidth: 160,
                                                }}
                                                placeholder="Other..."
                                                value={selectedFormat}
                                                onChange={(e) =>
                                                    setSelectedFormat(
                                                        e.target.value
                                                    )
                                                }
                                                onBlur={() => {
                                                    if (selectedFormat.trim()) {
                                                        setTimeout(() => {
                                                            setShowFormatOptions(
                                                                false
                                                            );
                                                            setTimeout(
                                                                () =>
                                                                    setFormatOptionsVisible(
                                                                        false
                                                                    ),
                                                                500
                                                            );
                                                        }, 1000);
                                                    }
                                                    setCustomFormat("");
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        if (
                                                            selectedFormat.trim()
                                                        ) {
                                                            setTimeout(() => {
                                                                setShowFormatOptions(
                                                                    false
                                                                );
                                                                setTimeout(
                                                                    () =>
                                                                        setFormatOptionsVisible(
                                                                            false
                                                                        ),
                                                                    500
                                                                );
                                                            }, 1000);
                                                        }
                                                        setCustomFormat("");
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Complex Options Animation - now directly below with a small gap */}
                    {complexOptionsVisible && (
                        <div
                            className={`flex flex-row items-center justify-center gap-1 mt-2 transition-opacity duration-500 ${
                                showComplexOptions
                                    ? "opacity-100"
                                    : "opacity-0 pointer-events-none"
                            }`}
                            style={{ zIndex: 2 }}
                        >
                            {COMPLEXITIES.map((complexity) => {
                                const isSelected =
                                    selectedComplex === complexity;
                                return complexity !== "Other..." ? (
                                    <button
                                        key={complexity}
                                        className={`px-4 py-2 whitespace-nowrap rounded-full font-semibold shadow-sm border transition hover:bg-gray-100 bg-white text-gray-700  ${
                                            isSelected
                                                ? "border-[#AC83CA] font-bold"
                                                : "border-gray-300"
                                        }`}
                                        style={{ margin: "0 0.1rem" }}
                                        onClick={() => {
                                            setSelectedComplex(complexity);
                                            setTimeout(() => {
                                                setShowComplexOptions(false);
                                                setTimeout(
                                                    () =>
                                                        setComplexOptionsVisible(
                                                            false
                                                        ),
                                                    500
                                                ); // match fade duration
                                            }, 1000);
                                        }}
                                    >
                                        {complexity}
                                    </button>
                                ) : (
                                    <div
                                        key="other"
                                        className="flex flex-col items-center"
                                        style={{ margin: "0 0.1rem" }}
                                    >
                                        {!customComplex && (
                                            <button
                                                className={`px-4 py-2 whitespace-nowrap rounded-full font-semibold shadow-sm border transition hover:bg-gray-100 bg-white text-gray-700 ${
                                                    selectedComplex &&
                                                    !COMPLEXITIES.includes(
                                                        selectedComplex
                                                    )
                                                        ? "border-[#AC83CA] font-bold"
                                                        : "border-gray-300"
                                                }`}
                                                onClick={() =>
                                                    setCustomComplex("typing")
                                                }
                                                style={{ minWidth: 0 }}
                                            >
                                                Other...
                                            </button>
                                        )}
                                        {customComplex === "typing" && (
                                            <input
                                                autoFocus
                                                className="px-2 py-2 rounded-full bg-white text-gray-700 font-bold shadow-sm border border-[#AC83CA] text-center outline-none"
                                                style={{
                                                    minWidth: 80,
                                                    maxWidth: 160,
                                                }}
                                                placeholder="Other..."
                                                value={selectedComplex}
                                                onChange={(e) =>
                                                    setSelectedComplex(
                                                        e.target.value
                                                    )
                                                }
                                                onBlur={() => {
                                                    if (
                                                        selectedComplex.trim()
                                                    ) {
                                                        setTimeout(() => {
                                                            setShowComplexOptions(
                                                                false
                                                            );
                                                            setTimeout(
                                                                () =>
                                                                    setComplexOptionsVisible(
                                                                        false
                                                                    ),
                                                                500
                                                            );
                                                        }, 1000);
                                                    }
                                                    setCustomComplex("");
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        if (
                                                            selectedComplex.trim()
                                                        ) {
                                                            setTimeout(() => {
                                                                setShowComplexOptions(
                                                                    false
                                                                );
                                                                setTimeout(
                                                                    () =>
                                                                        setComplexOptionsVisible(
                                                                            false
                                                                        ),
                                                                    500
                                                                );
                                                            }, 1000);
                                                        }
                                                        setCustomComplex("");
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Mood Options Animation - now directly below with a small gap */}
                    {moodOptionsVisible && (
                        <div
                            className={`flex flex-row items-center justify-center gap-1 mt-2 transition-opacity duration-500 ${
                                showMoodOptions
                                    ? "opacity-100"
                                    : "opacity-0 pointer-events-none"
                            }`}
                            style={{ zIndex: 2 }}
                        >
                            {MOODS.map((mood) => {
                                const isSelected = selectedMood === mood;
                                return mood !== "Other..." ? (
                                    <button
                                        key={mood}
                                        className={`px-4 py-2 whitespace-nowrap rounded-full font-semibold shadow-sm border transition hover:bg-gray-100 bg-white text-gray-700 ${
                                            isSelected
                                                ? "border-[#AC83CA] font-bold"
                                                : "border-gray-300"
                                        }`}
                                        style={{ margin: "0 0.1rem" }}
                                        onClick={() => {
                                            setSelectedMood(mood);
                                            setTimeout(() => {
                                                setShowMoodOptions(false);
                                                setTimeout(
                                                    () =>
                                                        setMoodOptionsVisible(
                                                            false
                                                        ),
                                                    500
                                                ); // match fade duration
                                            }, 1000);
                                        }}
                                    >
                                        {mood}
                                    </button>
                                ) : (
                                    <div
                                        key="other"
                                        className="flex flex-col items-center"
                                        style={{ margin: "0 0.1rem" }}
                                    >
                                        {!customMood && (
                                            <button
                                                className={`px-4 py-2 whitespace-nowrap rounded-full font-semibold shadow-sm border transition hover:bg-gray-100 bg-white text-gray-700 ${
                                                    selectedMood &&
                                                    !MOODS.includes(
                                                        selectedMood
                                                    )
                                                        ? "border-[#AC83CA] font-bold"
                                                        : "border-gray-300"
                                                }`}
                                                onClick={() =>
                                                    setCustomMood("typing")
                                                }
                                                style={{ minWidth: 0 }}
                                            >
                                                Other...
                                            </button>
                                        )}
                                        {customMood === "typing" && (
                                            <input
                                                autoFocus
                                                className="px-2 py-2 rounded-full bg-white text-gray-700 font-bold shadow-sm border border-[#AC83CA] text-center outline-none"
                                                style={{
                                                    minWidth: 80,
                                                    maxWidth: 160,
                                                }}
                                                placeholder="Other..."
                                                value={selectedMood}
                                                onChange={(e) =>
                                                    setSelectedMood(
                                                        e.target.value
                                                    )
                                                }
                                                onBlur={() => {
                                                    if (selectedMood.trim()) {
                                                        setTimeout(() => {
                                                            setShowMoodOptions(
                                                                false
                                                            );
                                                            setTimeout(
                                                                () =>
                                                                    setMoodOptionsVisible(
                                                                        false
                                                                    ),
                                                                500
                                                            );
                                                        }, 1000);
                                                    }
                                                    setCustomMood("");
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        if (
                                                            selectedMood.trim()
                                                        ) {
                                                            setTimeout(() => {
                                                                setShowMoodOptions(
                                                                    false
                                                                );
                                                                setTimeout(
                                                                    () =>
                                                                        setMoodOptionsVisible(
                                                                            false
                                                                        ),
                                                                    500
                                                                );
                                                            }, 1000);
                                                        }
                                                        setCustomMood("");
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <div
                        className={`max-w-xl mx-auto transition-all duration-500 ${
                            moodOptionsVisible ? "mt-3" : "mt-3"
                        }`}
                        style={{ zIndex: 1 }}
                    >
                        <textarea
                            className="w-full h-24 p-4 rounded-xl placeholder-gray-500 resize-none mb-4 focus:outline-none focus:ring-2"
                            style={{
                                background: "#D1D5DB",
                                color: textColor,
                                border: `1px solid ${borderColor}`,
                            }}
                            placeholder="Describe your mood or painting idea..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={loadingPrompt}
                        />
                        <button
                            className="w-full text-lg py-3 rounded-xl font-medium transition shadow-sm"
                            style={{ background: buttonBg, color: "#fff" }}
                            onClick={generatePrompt}
                            disabled={loadingPrompt}
                        >
                            {loadingPrompt
                                ? "Generating..."
                                : "Generate Prompt"}
                        </button>
                        {generatedPrompt && (
                            <div className="mt-4 p-4 rounded-xl bg-white text-gray-800 border border-[#AC83CA] shadow">
                                <div className="font-bold mb-2">
                                    Generated Prompt:
                                </div>
                                <div>{generatedPrompt}</div>
                            </div>
                        )}
                        {showPromptError && _message && (
                            <div className="mt-2 text-red-600 font-semibold">
                                {_message}
                            </div>
                        )}
                    </div>

                    {/* Footer Links*/}
                    <div
                        className="absolute bottom-0 left-0 right-0 flex justify-center space-x-6 text-sm"
                        style={{ color: secondaryText }}
                    >
                        <a
                            onClick={() => navigate("/help")}
                            className="hover:underline cursor-pointer"
                        >
                            Help
                        </a>
                        <a
                            onClick={() => navigate("/help")}
                            className="hover:underline cursor-pointer"
                        >
                            Contact Us
                        </a>
                        <a
                            onClick={() => navigate("/privacypolicy")}
                            className="hover:underline cursor-pointer"
                        >
                            Privacy Policy
                        </a>
                        <a
                            onClick={() => navigate("/termsandservice")}
                            className="hover:underline cursor-pointer"
                        >
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                className={`absolute top-1/2 z-50 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
                    isOpen ? "right-60" : "right-4"
                }`}
                style={{
                    background: buttonBg,
                    color: "#fff",
                    border: `2px solid ${borderColor}`,
                }}
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
                    className="hover:underline cursor-pointer"
                    style={{ color: buttonBg }}
                >
                    Gallery
                </a>
                <a
                    onClick={() => navigate("/materials")}
                    className="hover:underline cursor-pointer"
                    style={{ color: buttonBg }}
                >
                    Materials
                </a>
                <a
                    onClick={() => navigate("/")}
                    className="hover:underline cursor-pointer"
                    style={{ color: "#E11D48" }}
                >
                    Sign Out
                </a>
            </div>

            {/* Sidebar */}
            <div
                id="sidebar"
                className={`relative ${
                    isOpen ? "w-64" : "w-8"
                } transition-all duration-300`}
                style={{
                    background: cardBg,
                    borderLeft: `1px solid ${borderColor}`,
                }}
            >
                <div className="flex flex-col h-full p-4">
                    <div
                        className={`absolute top-0 right-0 w-64 p-4 h-full overflow-y-auto border-l transition-all duration-300 transform ${
                            isOpen
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 translate-x-4 pointer-events-none"
                        }`}
                        style={{
                            background: cardBg,
                            color: "#fff",
                            borderLeft: `1px solid ${borderColor}`,
                        }}
                    >
                        <h2 className="text-xl font-semibold mb-2">
                            Community Ratings
                        </h2>
                        <p
                            className="text-sm mb-6"
                            style={{ color: "#E0E7FF" }}
                        >
                            Rate other artists' work
                        </p>
                        {communityImages.map((img, idx) => {
                            const isLast = idx === communityImages.length - 1;
                            return (
                                <div
                                    className="mb-6 community-image-card"
                                    key={img.username + img.imagePath}
                                    ref={
                                        isLast
                                            ? lastCommunityImageRef
                                            : undefined
                                    }
                                >
                                    <div
                                        className="p-2 rounded-lg img-container"
                                        style={{ background: "#fff" }}
                                    >
                                        <img
                                            src={`/user_images/${img.imagePath}`}
                                            alt={img.title}
                                            className="w-full h-auto rounded-lg"
                                            style={{
                                                width: "100%",
                                                height: 220,
                                                objectFit: "cover",
                                                borderRadius: 8,
                                            }}
                                            onError={(e) =>
                                                (e.currentTarget.style.display =
                                                    "none")
                                            }
                                        />
                                    </div>
                                    <div
                                        className="img-title"
                                        style={{
                                            fontWeight: 600,
                                            margin: "8px 0 4px 0",
                                        }}
                                    >
                                        {img.title}
                                    </div>
                                    <div
                                        className="img-rating"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <StarRating
                                            value={img.avgRating}
                                            onChange={(rating) =>
                                                handleCommunityRate(
                                                    img.username,
                                                    img.imagePath,
                                                    rating
                                                )
                                            }
                                            disabled={img.username === username}
                                        />
                                        <span
                                            className="rating-count"
                                            style={{
                                                marginLeft: 8,
                                                color: "#888",
                                            }}
                                        >
                                            {img.ratingCount > 0
                                                ? `(${img.ratingCount})`
                                                : ""}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        {communityLoading && (
                            <div
                                className="loading"
                                style={{
                                    textAlign: "center",
                                    margin: "16px 0",
                                }}
                            >
                                Loading...
                            </div>
                        )}
                        {communityError && (
                            <div
                                className="error"
                                style={{
                                    textAlign: "center",
                                    margin: "16px 0",
                                }}
                            >
                                {communityError}
                            </div>
                        )}
                        {!communityHasMore && !communityLoading && (
                            <div
                                className="end"
                                style={{
                                    textAlign: "center",
                                    margin: "16px 0",
                                }}
                            >
                                No more images
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
