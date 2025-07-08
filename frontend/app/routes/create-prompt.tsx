import { useNavigate } from "react-router";

export default function CreatePromptPage() {
    const navigate = useNavigate();
    return (
        <div className="bg-white text-gray-800">
            {/* Header Section */}
            <section className="bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-pink-400 py-12 text-center px-6">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                    Help Post #1: How to Use Paint Prompt Effectively
                </h1>
                <p className="mt-2 text-white text-sm md:text-base">
                    Maximize your painting journey with our tips!
                </p>
                <div className="mt-6 flex justify-center gap-4">
                    <button
                        onClick={() => navigate("/home")}
                        className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition"
                    >
                        Get Started
                    </button>
                </div>
            </section>

            {/* Main Content */}
            <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-start">
                {/* Left Column */}
                <div>
                    <h2 className="text-2xl font-bold mb-2">
                        How to Use Paint Prompt
                    </h2>
                    <p className="text-gray-600">
                        Follow these steps to enhance your creative experience.
                    </p>
                </div>

                {/* Right Column – Steps */}
                <div className="space-y-4">
                    {[
                        {
                            title: "1. Start With Your Mood",
                            desc: "On the homepage, you'll be asked how you're feeling. Pick a mood to receive personalized prompts.",
                        },
                        {
                            title: "2. Pick the Right Complexity",
                            desc: "Choose your skill level: Beginner, Medium, or Advanced to receive prompts that suit you.",
                        },
                        {
                            title: "3. Select Your Format",
                            desc: "Choose from written prompts, video-referrals, or audio prompts (coming soon!) for your painting inspiration.",
                        },
                        {
                            title: "4. Generate Your Prompt",
                            desc: "Click ‘Generate Prompt’ to receive your tailored painting concept and guidance.",
                        },
                        {
                            title: "5. Upload Your Work",
                            desc: "Share your completed artwork and log your title, and you can take notes comparing paintings in your progress gallery.",
                        },
                        {
                            title: "6. Track Your Progress",
                            desc: "Visit the Progress Gallery to see your artistic evolution and keep motivated.",
                        },
                    ].map((step, idx) => (
                        <div
                            key={idx}
                            className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                        >
                            <h3 className="font-semibold text-md text-indigo-700">
                                {step.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Place Holders 
            This will be changed to add randoms user comments */}
            <section className="bg-gray-50 py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-xl font-bold text-center mb-2">
                        What Our Users Say
                    </h2>
                    <p className="text-center text-gray-600 mb-12">
                        Read testimonials from fellow artists!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Testimonial 1 */}
                        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                            <div className="font-semibold mb-2">🎨 Alex M.</div>
                            <p className="text-sm text-gray-700">
                                Paint Prompt has transformed my painting
                                journey! The prompts are so inspiring.
                            </p>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                            <div className="font-semibold mb-2">🖌️ Jake T.</div>
                            <p className="text-sm text-gray-700">
                                I love how personalized the prompts are based on
                                my mood!
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <div className="bg-gray-100 text-center py-6 text-sm text-gray-600 flex flex-row justify-center items-center gap-x-8 text-center flex-wrap">
                <p>© 2023 Paint Prompt. All rights reserved.</p>
                <p>Follow us on social media for updates!</p>
                <p>Privacy Policy | Terms of Service | Help Center</p>
            </div>
        </div>
    );
}
