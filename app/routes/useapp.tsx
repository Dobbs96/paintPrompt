import { useNavigate } from "react-router";

export default function UseAppPage() {
    const navigate = useNavigate();
    return (
        <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-pink-400 py-12 text-center px-6">
                <h1>Header</h1>
            </div>
            {/* Body */}
            {/* Body Left */}
            <div>
                <h2>Creating Meaningful Painting Prompts</h2>
                <p>
                    Want to create your own prompt instead of using the
                    dropdowns? Here’s how to write custom input that gets you a
                    meaningful and inspiring painting prompt.
                </p>
            </div>
            {/* Body Rights */}
            <div>
                <div className="space-y-4">
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
                            className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                        >
                            <h3 className="font-semibold text-md">
                                {step.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {step.desc}
                            </p>
                            <div>
                                <p className="bg-gray-200 text-sm text-gray-600 mt-1">
                                    {step.typeOne}
                                </p>
                                <p className="bg-gray-200 text-sm text-gray-600 mt-1">
                                    {step.typeTwo}
                                </p>
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
