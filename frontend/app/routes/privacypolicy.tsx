import { useNavigate } from "react-router";

export default function Privacypolicy() {
    const navigate = useNavigate();

    return (
        <div className="relative w-full min-h-screen px-6 py-10">
            <div className="w-full flex items-center mb-12">
                <button
                    className="text-white text-lg rounded px-4 py-2 font-semibold border-[#AC83CA] bg-[#AC83CA] hover:bg-[#946BB8] transition"
                    onClick={() => navigate("/home")}
                >
                    Back
                </button>
                <div className="flex-grow text-4xl font-semibold text-center">
                    Privacy Policy
                </div>
            </div>

            <div className="flex flex-col space-y-24 max-w-6xl mx-auto">
                {/* actual policies */}
                {[
                    {
                        title: "Introduction",
                        content: `Paint Prompt ("we", "us" or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our painting inspiration web app.`,
                    },
                    {
                        title: "What Data We Collect",
                        content: (
                            <>
                                <strong>
                                    We may collect the following information:
                                </strong>
                                <ul className="list-disc list-inside mt-2 pl-4">
                                    <li>
                                        Name and email address (if you sign up
                                        for an account).
                                    </li>
                                    <li>
                                        Mood, preferences, and painting-related
                                        input.
                                    </li>
                                    <li>
                                        Usage data (how you interact with the
                                        app).
                                    </li>
                                    <li>Uploaded artwork (if applicable).</li>
                                </ul>
                            </>
                        ),
                    },
                    {
                        title: "How We Use Your Data",
                        content: (
                            <>
                                <strong>We use your information to: </strong>
                                <ul className="list-disc list-inside mt-2 pl-4">
                                    <li>
                                        Generate personalized painting prompts.
                                    </li>
                                    <li>
                                        Save and display your progress gallery.
                                    </li>
                                    <li>
                                        Improve our services and user
                                        experience.
                                    </li>
                                    <li>
                                        Communicate with you when necessary.
                                    </li>
                                </ul>
                            </>
                        ),
                    },
                    {
                        title: "Data Sharing and Third Parties",
                        content:
                            "We do not sell your personal information. We may share limited data with trusted third-party services (e.g. OpenAI for prompt generation), solely to operate the app.",
                    },
                    {
                        title: "User Rights and Choices",
                        content:
                            "You can delete your account or request deletion of your data at any time. We retain data only as long as necessary to support your use of the app.",
                    },
                    {
                        title: "Security",
                        content:
                            "We use standard security practices to protect your data. However, no system is completely secure, so we encourage you to use strong passwords and be mindful of the content you share.",
                    },
                ].map(({ title, content }, index) => (
                    <div
                        key={index}
                        className="flex flex-col md:flex-row md:items-start gap-6"
                    >
                        <div className="md:w-1/2 text-3xl font-bold">
                            {title}
                        </div>
                        <div className="md:w-1/2 text-base">
                            {typeof content === "string" ? (
                                <p>{content}</p>
                            ) : (
                                content
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* footer section */}
            <div className="mt-24 text-center text-base font-medium">
                Last updated: October 2023
            </div>
        </div>
    );
}
