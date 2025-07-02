import { useNavigate } from "react-router";

export default function Signup() {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col justify-center items-center relative px-6 max-w-screen-lg mx-auto">

            <div className="flex items-center justify-between w-full px-20 pt-10 pb-10">

                <button 
                    className = "text-white text-3xl rounded px-3 py-3 font-semibold relative z-10" 
                    style = {{backgroundColor: '#AC83CA'}}
                    onClick = {() => navigate("/")}
                >
                    Back
                </button>

                <h1 className="text-black text-4xl font-semibold text-right max-w-md px-10 mr-40">
                    Create your account and start painting.
                </h1>
            </div>


            <div className="absolute inset-y-0 left-0 flex items-center pl-25">
                <h1 className="text-black text-5xl font-semibold">
                    Sign Up
                </h1>
            </div>
                        
            {/* user forms, none of them actually do anything yet */}
            <div className="flex flex-col items-end space-y-2 pl-24 pb-30 ml-15">

                {/* ask for name */}
                <div className="flex flex-col items-start space-y-2">
                    <label className="block font-semibold text-black">
                        Full Name
                    </label>
                    <input
                        className="w-72 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500"
                        type="text"
                        placeholder="Enter your full name"
                    />
                </div>

                {/* ask for email */}
                <div className="flex flex-col items-start space-y-2">
                    <label className="block font-semibold text-black">
                        Email
                    </label>
                    <input
                        className="w-72 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500"
                        type="email"
                        placeholder="Enter your email"
                    />
                </div>

                {/* ask for password, should probably add a reconfirm password input */}
                <div className="flex flex-col items-start space-y-2">
                    <label className="block font-semibold text-black">
                        Password
                    </label>
                    <input
                        className="w-72 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500"
                        type="password"
                        placeholder="Enter your password"
                    />
                </div>

                {/* i think this should go to some confirmation page, for now just takes user back to home page regardless of previous inputs */}
                <div className="self-start pt-4 ml-10">
                    <button 
                        className="font-semibold rounded text-2xl text-white px-20 py-3"
                        style={{ backgroundColor: '#AC83CA' }}
                        onClick={() => navigate("/")}
                    >
                        Log In
                    </button>
                </div>

            </div>

            {/* footer buttons */}
             <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center gap-x-8 py-5 font-semibold text-xl px-4 text-center pt-5">
                
                <button
                    className = "whitespace-normal break-words text-center max-w-xs"
                    onClick = {() => navigate("/copyright")}
                >
                    © 2023 Paint Prompt. All rights reserved
                </button>

                <button
                    onClick = {() => navigate("/privacypolicy")}
                >
                    Privacy Policy
                </button>
                
                <button
                    onClick = {() => navigate("/termsandservice")}
                >
                    Terms and Service
                </button>

            </div>



        </div>
    );
}
