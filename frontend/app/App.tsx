// import {
//     type RouteConfig,
//     route,
//     index,
//     layout,
//     prefix,
// } from "@react-router/dev/routes";

// export default [
//     route("/", "routes/welcomepage.tsx"),
//     route("/home", "routes/home.tsx"),
//     route("/login", "routes/login.tsx"),
//     route("/help", "routes/help.tsx"),
//     route("/useapp", "routes/useapp.tsx"),
//     route("/create-prompt", "routes/create-prompt.tsx"),
//     route("/materials", "routes/materials.tsx"),
//     route("/signup", "routes/signup.tsx"),
//     route("/privacypolicy", "routes/privacypolicy.tsx"),
//     route("/termsandservice", "routes/termsandservice.tsx"),
//     route("/gallery", "routes/gallery.tsx"),
//     route("/forgotpassword", "routes/forgotpassword.tsx"),
//     route("/passwordreset", "routes/passwordreset.tsx"),
// ] satisfies RouteConfig;

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Welcomepage from "./routes/welcomepage";
import Home from "./routes/home";
import Login from "./routes/login";
import Help from "./routes/help";
import UseApp from "./routes/useapp";
import CreatePrompt from "./routes/create-prompt";
import Materials from "./routes/materials";
import Signup from "./routes/signup";
import PrivacyPolicy from "./routes/privacypolicy";
import TermsAndService from "./routes/termsandservice";
import Gallery from "./routes/gallery";
import ForgotPassword from "./routes/forgotpassword";
import PasswordReset from "./routes/passwordreset";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Welcomepage />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/help" element={<Help />} />
                <Route path="/useapp" element={<UseApp />} />
                <Route path="/create-prompt" element={<CreatePrompt />} />
                <Route path="/materials" element={<Materials />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/privacypolicy" element={<PrivacyPolicy />} />
                <Route path="/termsandservice" element={<TermsAndService />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/passwordreset" element={<PasswordReset />} />
            </Routes>
        </Router>
    );
}

export default App;
