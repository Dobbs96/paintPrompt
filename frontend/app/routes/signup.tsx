import { useNavigate } from "react-router";
import { useState } from "react";

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
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    <div className="min-h-screen flex flex-col justify-center items-center relative px-6 max-w-screen-lg mx-auto">
      <div className="flex items-center justify-between w-full px-20 pt-10 pb-10">
        <button
          className="text-white text-5xl rounded px-3 py-3 font-semibold relative z-10"
          style={{ backgroundColor: "#AC83CA" }}
          onClick={() => navigate("/")}
        >
          Back
        </button>

        <h1 className="text-black text-4xl font-semibold text-right max-w-md px-10 mr-40">
          Create your account and start painting!
        </h1>
      </div>

      <div className="absolute inset-y-0 left-0 flex items-center pl-25">
        <h1 className="text-black text-5xl font-semibold">Sign Up</h1>
      </div>

      {/* Input Form */}
      <div className="flex flex-col items-end space-y-2 pl-24 pb-30 ml-15">
        {/* Username */}
        <div className="flex flex-col items-start space-y-2">
          <label className="block font-semibold text-black">Username</label>
          <input
            className="w-72 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500"
            type="text"
            placeholder="Enter your Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col items-start space-y-2">
          <label className="block font-semibold text-black">Email</label>
          <input
            className="w-72 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col items-start space-y-2">
          <label className="block font-semibold text-black">Password</label>
          <input
            className="w-72 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Centered Sign Up button and message */}
        <div className="pt-4 w-full flex flex-col items-center">
          <button
            className="font-semibold rounded text-2xl text-white px-20 py-3"
            style={{ backgroundColor: "#AC83CA" }}
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

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center gap-x-8 py-5 font-semibold text-xl px-4 text-center pt-5">
        <button
          className="whitespace-normal break-words text-center max-w-xs"
          onClick={() => navigate("/copyright")}
        >
          © 2023 Paint Prompt. All rights reserved
        </button>

        <button onClick={() => navigate("/privacypolicy")}>
          Privacy Policy
        </button>

        <button onClick={() => navigate("/termsandservice")}>
          Terms and Service
        </button>
      </div>
    </div>
  );
}
