import { useNavigate } from "react-router";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage("Please fill out all fields.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.text();
      setMessage(result);
      if (response.ok && result === "Sign in successful!") {
        localStorage.setItem("username", username);
        setTimeout(() => navigate("/Home"), 1000);
      }
    } catch (error) {
      setMessage("Failed to connect to server.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <button
        className="text-white text-5xl rounded px-3 py-3 font-semibold"
        style={{ backgroundColor: "#AC83CA" }}
        onClick={() => navigate("/")}
      >
        Back
      </button>
      <h1 className="text-black text-5xl py-15 font-semibold">Log In</h1>
      <div className="flex gap-4">
        <div>
          <label className="block font-semibold text-black w-125">
            Username
          </label>
          <input
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-semibold text-black w-125">
            Password
          </label>
          <input
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-4 py-15">
        <button
          className="font-semibold border rounded bg-white border rounded text-xl px-12 py-2"
          onClick={() => navigate("/forgotpassword")}
        >
          Forgot Password?
        </button>
        <button
          className="font-semibold rounded text-2xl text-white text-xl px-25 py-3"
          style={{ backgroundColor: "#AC83CA" }}
          onClick={handleLogin}
        >
          Log In
        </button>
      </div>
      {message && (
        <div className="text-sm text-red-500 pt-2 text-center w-full">
          {message}
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-6 py-10 font-semibold text-xl">
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
