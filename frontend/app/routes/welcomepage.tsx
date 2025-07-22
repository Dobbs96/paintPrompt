import { useNavigate } from "react-router";

export default function Welcomepage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">

      <div className="flex flex-1 flex-col justify-center items-center text-center px-4">

        <h1 className="text-3xl sm:text-4xl font-bold mb-6">
          Welcome to Paint Prompt!
        </h1>
        <p className="text-lg sm:text-xl font-semibold mb-6">
          Inspiration starts with your mood
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            className="w-full sm:w-48 px-6 py-3 border border-gray-300 bg-white hover:bg-gray-100 text-black rounded-lg text-base font-semibold"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
          <button
            className="w-full sm:w-48 px-6 py-3 border-2 border-[#AC83CA] bg-[#AC83CA] hover:bg-[#946BB8] text-white rounded-lg text-base font-semibold"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
        </div>

      </div>

      {/* footer links */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-10 px-4">

        <p className="text-sm sm:text-base font-medium">
          © 2023 Paint Prompt. All rights reserved
        </p>

        <button
          className="text-sm sm:text-base font-medium"
          onClick={() => navigate("/privacypolicy")}
        >
          Privacy Policy
        </button>

        <button
          className="text-sm sm:text-base font-medium"
          onClick={() => navigate("/termsandservice")}
        >
          Terms and Service
        </button>

      </div>

    </div>
  );
}
