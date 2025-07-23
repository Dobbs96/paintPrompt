import { useNavigate } from "react-router";

export default function ResetPassword() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow flex flex-col items-center px-4 pt-20 space-y-6">

                <h1 className="text-4xl font-bold text-center">Password Reset</h1>
                <p className="text-lg font-medium text-center max-w-md">
                    Thanks for verifying your email! Please enter your password below.
                </p>

                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 items-center">
                    <div className="flex justify-center md:justify-end">
                        <h2 className="text-3xl font-bold text-right">Set New Password</h2>
                    </div>

                    {/* forms */}
                    <div className="flex flex-col space-y-6">

                        {/* new password */}
                        <div className="flex flex-col">
                            <label
                                htmlFor="new-password"
                                className="text-base font-semibold mb-1"
                            >
                                New Password
                            </label>
                            <input
                                type="password"
                                id="new-password"
                                placeholder="Enter new password"
                                className="px-4 py-2 rounded-md border border-gray-300 text-base"
                            />
                            <span className="text-sm text-gray-500 mt-1">
                                Must be at least 8 characters long
                            </span>
                        </div>

                        {/* confirm password */}
                        <div className="flex flex-col">
                            <label
                                htmlFor="confirm-password"
                                className="text-base font-semibold mb-1"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirm-password"
                                placeholder="Confirm new password"
                                className="px-4 py-2 rounded-md border border-gray-300 text-base"
                            />
                            <span className="text-sm text-gray-500 mt-1">
                                Please make sure both passwords match
                            </span>
                        </div>

                        {/* buttons */}
                        <div className="flex space-x-4">
                            <button
                                className="px-5 py-2 text-black border border-gray-300 bg-white hover:bg-gray-100 rounded-md text-base transition"
                                onClick={() => navigate("/")}
                            >
                                Cancel
                            </button>

                            <button
                                className="px-5 py-2 border-[#AC83CA] bg-[#AC83CA] hover:bg-[#946BB8] text-white rounded-md font-semibold text-base transition"
                                onClick={() => navigate("/login")}
                            >
                                Reset Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* footer links */}
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
