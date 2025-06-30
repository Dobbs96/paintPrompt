import { useNavigate } from "react-router";

export default function Termsandservice() {
    const navigate = useNavigate();

    return (
        <div className = "relative w-full min-h-screen p-8">
            {/* takes user back to welcome page, HOWEVER, this SHOULD take user back to the spot they were last in (maybe not neccessary?) */}
            <div className="w-full h-16 flex items-center mb-8 relative">
                <button 
                    className="text-white text-2xl rounded px-4 py-2 font-semibold absolute left-20" 
                    style={{ backgroundColor: '#AC83CA' }}
                    onClick={() => navigate("/")}
                >
                    Back
                </button>

                {/* Wrap heading in same container width as content */}
                <div className="mx-auto max-w-3xl w-full text-4xl font-semibold text-center">
                    Terms and Services
                </div>
            </div>

            {/* terms and services in a long list format, probably fancy it up at another point, following figma for now*/}
            <div className = "max-w-3xl mx-auto text-lg leading-relaxed text-gray-800">
                <p>
                    <strong>Last Updated: June 23,2025</strong>
                    <br></br>
                    Welcome to Paint Prompt. By using our app, you agree to the following Terms of Use

                </p>
                <p className = "mt-4 text-xl">
                    <strong>1. Acceptance of Terms</strong> 
                    <br></br>
                    By accessing or using Paint Prompt, you agree to be bound by these terms. If you
                    do not agree, please not use the app.
                </p>
                <p className = "mt-2 text-xl">
                    <strong>2. Use of the Service</strong>
                    <br></br>
                    Paint Prompt provides painting ideas based on your input. You agree to use the app only for personal,
                    non-commericial purposes unless otherwise authorized.
                </p>
                <p className = "mt-2 text-xl">
                    <strong>3. User Conduct</strong>
                    <br></br>
                    You agree not to:
                    <ul className ="list-disc list-inside mt-2 pl-6">
                        <li>Use the app for illegal or harmful purposes.</li>
                        <li>Upload offensive or inappropiate content.</li>
                        <li>Interfere with the functioning or security of the app.</li>
                    </ul>
                </p>
                <p className = "mt-2 text-xl">
                    <strong>4. Account</strong>
                    <br></br>
                    You are responsible for  keeping your account information secure.
                    We are not liable for unauthorized use of your account.
                </p>
                <p className = "mt-2 text-xl">
                    <strong>5. Account</strong>
                    <br></br>
                    You are responsible for  keeping your account information secure.
                    We are not liable for unauthorized use of your account.
                </p>
                <p className = "mt-2 text-xl">
                    <strong>6. Termination</strong>
                    <br></br>
                    We reserve the right to suspend or terminate accounts that violate these terms or misuse the service.
                </p>
                <p className = "mt-2 text-xl">
                    <strong>7. Disclaimer</strong>
                    <br></br>
                    This app is provided "as is." We make no guarantees that it will always be available or error-free
                </p>
                <p className = "mt-2 text-xl">
                    <strong>8. Changes to These Terms</strong>
                    <br></br>
                    We may update these terms at any time.
                    If changes are made, we wil post an updated version here.
                </p>
                <p className = "mt-2 text-xl">
                    <strong>9. Contact</strong>
                    <br></br>
                    For questions or concerns about these terms, contact us at:
                    <br></br>
                    <strong>paintpromptteam@gmail.com</strong>
                </p>
            </div>
        </div>
    );
}
