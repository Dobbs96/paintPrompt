import { useNavigate } from "react-router";

export default function ForgotPassword() {

  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-start items-center h-screen text-center px-4 pt-20 space-y-6">

      <h1 className="text-4xl font-bold">
        Forgot your password? No problem.
      </h1>

      <p className="text-lg font-bold">
        Please enter the email associated with your account.
      </p>

      <input 
        type="email" 
        placeholder="Email address" 
        className="px-4 py-3 w-72 rounded-lg border-2 border-gray-300 text-base"
      />

      <button 
        className="px-6 py-3 bg-[#AC83CA] text-white rounded-lg font-bold text-base hover:bg-[#946cb5] transition"
        onClick={() => navigate("/passwordreset")}
      >
        Send Reset Link
      </button>

      {/* figma showed the back to login to be on the bottom left, i just kept it in the middle so it doesnt break when page shrinks for now */}
      <div 
        className="mt-10 text-sm text-[#AC83CA] font-bold cursor-pointer flex items-center gap-1"
        onClick={() => navigate("/login")}
      >
        <span className="text-lg">←</span>
        <span>Back to Login</span>
      </div>
      
    </div>
  );
}
