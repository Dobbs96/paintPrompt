import { useNavigate } from "react-router";

export default function Privacypolicy() {
    const navigate = useNavigate();

    return (

        <div className="relative w-full min-h-screen p-8">

            {/* header section */}
            <div className="w-full h-16 flex items-center mb-30 relative">
                {/* probably should redirect to previous page user was in, just redirects to welcome page (maybe redirect to home?)*/}
                <button
                    className="text-white text-2xl rounded px-4 py-2 font-semibold absolute left-20"
                    style={{ backgroundColor: '#AC83CA' }}
                    onClick={() => navigate("/")}
                >
                    Back
                </button>
                <div className="mx-auto max-w-3xl w-full text-5xl font-semibold text-center">
                    Privacy Policy
                </div>
            </div>

            
            <div className="flex flex-col space-y-40 max-w-6xl mx-auto">

                <div className="flex w-full items-center">
                    <div className="w-1/2 text-4xl font-bold pr-4">
                        Introduction
                    </div>
                    <div className="w-1/2 text-lg">
                        <strong>Introduction</strong>
                        <br></br>
                        Paint Prompt ("we", "us" or "our") is committed to protecting your privacy.
                        This Privacy Policy explains how we collect, use, and protect your information 
                        when you use our painting inspiration web app.
                    </div>
                </div>

                <div className="flex w-full items-center">
                    <div className="w-1/2 text-4xl font-bold pr-4">
                        What Data We Collect
                    </div>
                    <div className="w-1/2 text-lg">
                        <strong>What Data We Collect</strong>
                        <br></br>
                        We may collect the following information:
                        <ul className ="list-disc list-inside mt-2 pl-6">
                            <li>Name and email address (if you sign up for an account).</li>
                            <li>Mood, preferences, and painting-related input.</li>
                            <li>Usage data (how you interact with the app).</li>
                            <li>Uploaded artwork (if applicable).</li>
                        </ul>
                    </div>
                </div>

                <div className="flex w-full items-center">
                    <div className="w-1/2 text-4xl font-bold pr-4">
                        How We Use Your Data
                    </div>
                    <div className="w-1/2 text-lg">
                        <strong>Introduction</strong>
                        <br></br>
                        We use your information to:
                        <ul className ="list-disc list-inside mt-2 pl-6">
                            <li>Generate personalized painting prompts.</li>
                            <li>Save and display your progress gallery.</li>
                            <li>Improve our services and user experience.</li>
                            <li>Communicate with you when necessary.</li>
                        </ul>
                    </div>
                </div>

                <div className="flex w-full items-center">
                    <div className="w-1/2 text-4xl font-bold pr-4">
                        Data Sharing and Third Parties
                    </div>
                    <div className="w-1/2 text-lg">
                        <strong>Data Sharing and Third Parties</strong>
                        <br></br>
                        We do not sell your personal information.
                        We may share limited data with trusted third-party services
                        (e.g. OpenAI for prompt generation),
                        solely to operate the app.
                    </div>
                </div>

                <div className="flex w-full items-center">
                    <div className="w-1/2 text-4xl font-bold pr-4">
                        User Rights and Choices
                    </div>
                    <div className="w-1/2 text-lg">
                        <strong>User Rights and Choices</strong>
                        <br></br>
                        You can delete your account or request deletion of your data at any time.
                        We retain data only as long as necessary to support your use of the app.
                    </div>
                </div>

                <div className="flex w-full items-center">
                    <div className="w-1/2 text-4xl font-bold pr-4">
                        Security
                    </div>
                    <div className="w-1/2 text-lg">
                        <strong>Security</strong>
                        <br></br>
                        We use standard security practices to protect your data.
                        However, no system is completely secure,
                        so we encourage you to use strong passwords and be mindful of the content you share.
                    </div>
                </div>

            </div>
            
            {/*footer section*/}
            <div className="mt-48 text-center text-lg">
                Last updated: October 2023
            </div>
        </div>

        
    );
}