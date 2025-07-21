import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcomepage from "./routes/welcomepage";
import Home from "./routes/home";
import Login from "./routes/login";
import HelpPage from "./routes/help";
import UseAppPage from "./routes/useapp";
import Materials from "./routes/Materials";
import Signup from "./routes/signup";
import Privacypolicy from "./routes/privacypolicy";
import Termsandservice from "./routes/termsandservice";
import Gallery from "./routes/gallery";
import ForgotPassword from "./routes/forgotpassword";
import CreatePromptPage from "./routes/create-prompt";
import ResetPassword from "./routes/passwordreset";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Welcomepage />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/useapp" element={<UseAppPage />} />
                <Route path="/create-prompt" element={<CreatePromptPage />} />
                <Route path="/materials" element={<Materials />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/privacypolicy" element={<Privacypolicy />} />
                <Route path="/termsandservice" element={<Termsandservice />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/passwordreset" element={<ResetPassword />} />
            </Routes>
        </Router>
    );
}

export default App;
