import { useNavigate } from "react-router";

export default function UseAppPage() {
    const navigate = useNavigate();
    return (
        <div>
            <div className="bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-pink-400 py-12 text-center px-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Help Post #2: Creating Prompts
                </h1>
                <p className="mt-2 text-white text-sm md:text-base">
                    Guidelines for Personalized Painting Inspiration
                </p>
                <div className="mt-6 flex justify-center gap-4">
                    <button
                        onClick={() => navigate("/home")}
                        className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition"
                    >
                        Get Started
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* Left Section */}
                <div>
                    <h2 className="text-2xl font-bold mb-2">
                        Creating Meaningful Painting Prompts
                    </h2>
                    <p className="text-gray-600">
                        Want to create your own prompt instead of using the
                        dropdowns? Here’s how to write custom input that gets
                        you a meaningful and inspiring painting prompt.
                    </p>
                </div>

                {/* Right Section – Steps */}
                <div className="space-y-6">
                    {[
                        {
                            title: "1. Use Emotion-Based Language",
                            desc: "Good prompt input starts with emotion. Try phrases like: 'I feel overwhelmed and need something peaceful.'",
                            typeOne: "emotion",
                            typeTwo: "language",
                        },
                        {
                            title: "2. Add Visual Hints",
                            desc: "Shape the vibe by mentioning lighting, season, or symbolism. e.g., sunset, forest in fall, growing plants.",
                            typeOne: "visual",
                            typeTwo: "hints",
                        },
                        {
                            title: "3. Combine Mood + Style",
                            desc: "Example custom inputs: 'Something meditative and abstract with cool colors.'",
                            typeOne: "mood",
                            typeTwo: "hints",
                        },
                        {
                            title: "4. Let the AI Do the Rest",
                            desc: "Once you write your custom input, Paint Prompt will generate a scene description, color suggestions, and more!",
                            typeOne: "AI",
                            typeTwo: "creativity",
                        },
                    ].map((step, idx) => (
                        <div
                            key={idx}
                            className="border border-gray-200 rounded-lg p-5 bg-white shadow-md"
                        >
                            <h3 className="font-semibold text-lg text-indigo-700">
                                {step.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {step.desc}
                            </p>
                            <div className="flex gap-2 mt-3">
                                <span className="bg-gray-200 px-2 py-1 rounded text-xs text-gray-700 font-medium">
                                    {step.typeOne}
                                </span>
                                <span className="bg-gray-200 px-2 py-1 rounded text-xs text-gray-700 font-medium">
                                    {step.typeTwo}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Footer */}
            <div className="bg-gray-100 text-center py-6 text-sm text-gray-600 flex flex-row justify-center items-center gap-x-8 text-center flex-wrap">
                <p>© 2023 Paint Prompt. All rights reserved.</p>
                <p>Follow us on social media for updates!</p>
                <p>Privacy Policy | Terms of Service | Help Center</p>
            </div>
        </div>
    );
}
