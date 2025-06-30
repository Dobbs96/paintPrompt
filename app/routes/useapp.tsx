import { useNavigate } from "react-router";

export default function UseAppPage() {
    const navigate = useNavigate();
    return (
        <div>
            {/* Footer */}
            <div className="bg-gray-100 text-center py-6 text-sm text-gray-600 flex flex-row justify-center items-center gap-x-8 text-center flex-wrap">
                <p>© 2023 Paint Prompt. All rights reserved.</p>
                <p>Follow us on social media for updates!</p>
                <p>Privacy Policy | Terms of Service | Help Center</p>
            </div>
        </div>
    );
}
