import { useNavigate } from "react-router";

export default function Login() {

    const navigate = useNavigate();

    return (
        
        <div className = "min-h-screen flex flex-col justify-center items-center">
            
            {/* back button should be able to redirect user to welcome page */}
            <button 
                className = "text-white text-5xl rounded px-3 py-3 font-semibold" 
                style = {{backgroundColor: '#AC83CA'}}
                onClick = {() => navigate("/")}
            >
                Back
            </button>

            <h1
                className= "text-black text-5xl py-15 font-semibold"
            >
                Log In
            </h1>

            {/* let user type their email and password */}
            <div className = "flex gap-4">
                
                <div>
                    <label className = "block font-semibold text-black w-125">
                        Email
                    </label>
                    <input
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500"
                        type = "text"
                        placeholder = "Enter your email"
                    >
                    </input>
                </div>

                <div>
                    <label className = "block font-semibold text-black w-125">
                        Password
                    </label>
                    <input
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500"
                        type = "text"
                        placeholder = "Enter your password">
                    </input>
                </div>

            </div>

            {/* buttons for user forgetting password or logging in (which right now simply takes user to home page even if they input nothing) */}
            <div className = "flex gap-4 py-15">

                <button
                    className = "font-semibold border rounded bg-white border rounded text-xl px-12 py-2" 
                    onClick = {() => navigate("/forgotpassword")}
                >
                    Forgot Password?
                </button>

                <button 
                    className = "font-semibold rounded text-2xl text-white text-xl px-25 py-3" 
                    style = {{backgroundColor: '#AC83CA'}}
                    onClick = {() => navigate("/Home")}
                >
                    Log In
                </button>
            </div>

            {/* footer buttons */}
             <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-6 py-10 font-semibold text-xl">
                
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