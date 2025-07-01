import { useNavigate } from "react-router";

export default function HelpPage() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-white text-gray-800">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-pink-400 text-white py-16 text-center px-4">
                <h1 className="text-3xl md:text-4xl font-bold">
                    Welcome to Paint Prompt Help
                </h1>
                <p className="mt-4 text-sm md:text-base">
                    Find assistance and answers to your questions about using
                    the Paint Prompt application.
                </p>
                <button
                    onClick={() => navigate("/home")}
                    className="mt-6 px-6 py-2 border border-white text-white rounded hover:bg-white hover:text-indigo-500 transition cursor-pointer"
                >
                    Back to Home
                </button>
            </div>

            {/* Help Topics */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold text-center mb-2">
                    Help Topics
                </h2>
                <p className="text-center text-gray-600 mb-12">
                    Explore the various help topics below:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Topic Card */}
                    <button
                        onClick={() => navigate("/useapp")}
                        className="flex p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
                    >
                        <div className="text-3xl mr-4  mt-3">💡</div>
                        <div>
                            <h3 className="text-lg font-semibold">
                                Using the Application
                            </h3>
                            <p className="text-sm text-gray-600">
                                Learn how to navigate and use Paint Prompt
                                effectively.
                            </p>
                        </div>
                    </button>

                    {/* Right Topic Card */}
                    <button
                        onClick={() => navigate("/create-prompt")}
                        className="flex p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
                    >
                        <div className="text-3xl mr-4 mt-3">✏️</div>
                        <div>
                            <h3 className="text-lg font-semibold">
                                Creating Prompts
                            </h3>
                            <p className="text-sm text-gray-600">
                                Guidelines on how to create your personalized
                                painting prompts.
                            </p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gray-50 py-16 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Side */}
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Contact Us</h2>
                        <p className="text-gray-600">
                            Reach out for more specific inquiries or feedback.
                        </p>
                    </div>

                    {/* Right Side */}
                    <div className="space-y-6">
                        {/* Email Contact */}
                        <div className="flex">
                            <div className="text-3xl mr-4 mt-2">📧</div>
                            <div>
                                <h3 className="text-lg font-semibold">
                                    E-Mail Us
                                </h3>
                                <p className="text-sm text-gray-600">
                                    support@paintprompt.com
                                </p>
                            </div>
                        </div>

                        {/* Phone Contact */}
                        <div className="flex">
                            <div className="text-3xl mr-4  mt-2">📞</div>
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Call Us
                                </h3>
                                <p className="text-sm text-gray-600">
                                    +1 (234) 555-6789
                                </p>
                            </div>
                        </div>
                    </div>
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
