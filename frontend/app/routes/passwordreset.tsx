import { useNavigate } from "react-router";

export default function ResetPassword() {

  const navigate = useNavigate();

  return (

    <div className="min-h-screen flex flex-col">
    
        <div className="flex-grow flex flex-col items-center px-4 pt-20 space-y-6">

            {/* head section */}
            <h1 className="text-4xl font-bold">
                Password Reset
            </h1>
            <p className="text-lg font-bold text-center">
                Thanks for verifying your email! Please enter your password below.
            </p>

            <div className="flex justify-center items-center space-x-50">

                <div className="w-1/4 flex justify-start ml-8">
                    <h2 className="text-5xl font-bold">
                        New Password
                    </h2>
                </div>

                {/* input forms */}
                <div className="flex flex-col space-y-4 items-start">

                    <div className="flex flex-col items-start">

                        <label htmlFor="new-password" className="text-base font-semibold mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="new-password"
                            placeholder="Enter new password"
                            className="px-4 py-3 w-72 rounded-lg border-2 border-gray-300 text-base"
                        />
                        <span className="text-sm text-gray-500 mt-1">
                            Must be at least 8 characters long
                        </span>

                    </div>

                    <div className="flex flex-col items-start">

                        <label htmlFor="confirm-password" className="text-base font-semibold mb-1">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            id="confirm-password"
                            placeholder="Confirm new password"
                            className="px-4 py-3 w-72 rounded-lg border-2 border-gray-300 text-base"
                        />
                        <span className="text-sm text-gray-500 mt-1">
                            Please make sure both passwords match
                        </span>
                    </div>

                    
                    {/* buttons, wasnt sure if reset password should take user to login or homepage, decided login page for now */}
                    <div className="mt-4 flex space-x-4">
                        <button
                            className="px-6 py-3 bg-white text-black border-2 border-black rounded-lg text-base hover:bg-gray-100 transition"
                            onClick={() => navigate("/")}
                        >
                            Cancel
                        </button>

                        <button 
                            className="px-6 py-3 bg-[#AC83CA] text-white rounded-lg font-bold text-base hover:bg-[#946cb5] transition"
                            onClick={() => navigate("/login")}
                        >
                            Reset Password
                        </button>

                    </div>
                    
                </div>
            </div>
        </div>

        {/* footer links*/}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-10 px-4">

            <p className="text-sm sm:text-base font-bold">
            © 2023 Paint Prompt. All rights reserved
            </p>

            <button
                className="text-sm sm:text-base font-bold"
                onClick={() => navigate("/privacypolicy")}
            >
                Privacy Policy
            </button>

            <button
                className="text-sm sm:text-base font-bold"
                onClick={() => navigate("/termsandservice")}
            >
                Terms and Service
            </button>

        </div>

    </div>
  );
}
