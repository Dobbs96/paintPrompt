import { useNavigate } from "react-router";
import { useState } from "react";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
//const API_BASE = "http://localhost:8080";

export default function Signup() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSignup = async () => {
        if (!username || !email || !password) {
            setMessage("Please fill out all fields.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const result = await response.text();
            setMessage(result);

            if (response.ok && result === "User registered successfully!") {
                setTimeout(() => navigate("/"), 1000);
            }
        } catch (error) {
            setMessage("Failed to connect to server.");
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen justify-center items-center px-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-x-20 gap-y-12">
                {/* left section */}

                <div className="flex flex-col items-center sm:items-end space-y-6 pr-6">
                    <button
                        className="bg-[#AC83CA] hover:bg-[#946BB8] text-white text-lg sm:text-xl font-semibold px-6 py-3 rounded-lg mr-9"
                        onClick={() => navigate("/")}
                    >
                        Back
                    </button>
                    <h1 className="text-3xl sm:text-5xl font-semibold text-gray-900 text-center sm:text-right py-20">
                        Sign Up
                    </h1>
                </div>

                {/* right section */}
                <div className="flex flex-col items-center w-full max-w-md space-y-6">
                    <h2 className="text-xl sm:text-3xl font-semibold text-gray-800 text-center">
                        Create your account and start painting!
                    </h2>

                    {/* username form */}
                    <div className="w-3/4">
                        <label className="block mb-1 font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    {/* email form */}
                    <div className="w-3/4">
                        <label className="block mb-1 font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* password form */}
                    <div className="w-3/4">
                        <label className="block mb-1 font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* sign up confirm */}
                    <div className="pt-2 w-full flex flex-col items-center">
                        <button
                            className="w-40 h-12 text-base font-semibold text-white bg-[#AC83CA] hover:bg-[#946BB8] rounded-md"
                            onClick={handleSignup}
                        >
                            Sign Up
                        </button>
                        {message && (
                            <div className="text-sm text-red-500 pt-2 text-center w-full">
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* footer links */}
            <footer className="mt-12 text-sm sm:text-base text-gray-600 font-medium flex flex-wrap justify-center gap-6 text-center">
                <p>© 2023 Paint Prompt. All rights reserved</p>
                <button onClick={() => navigate("/privacypolicy")}>
                    Privacy Policy
                </button>
                <button onClick={() => navigate("/termsandservice")}>
                    Terms and Service
                </button>
            </footer>
        </div>
    );
}
