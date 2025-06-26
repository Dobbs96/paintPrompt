import { useNavigate } from "react-router";

export default function HelpPage() {
    const navigate = useNavigate();
    return (
        //main wrapper
        <div>
            {/* //header */}
            <div>
                <h1>Welcome to Paint Prompt Help</h1>
                <p>
                    Find assistance and answers to your questions about using
                    the Paint Prompt application.
                </p>
                <button onClick={() => navigate("/home")}>Back to Home</button>
            </div>
            {/* // body1 */}
            <div>
                <h2>Help Topics</h2>
                <p>Explore the various help topics below:</p>

                <div>
                    {/* //left */}
                    <div>
                        <div>light icon</div>
                        <div>
                            <h3>Using the Application</h3>
                            <p>
                                Learn how to navigate and use Paint Prompt
                                effectively.
                            </p>
                        </div>
                    </div>
                    {/* //right */}
                    <div>
                        <div>Pencil icon</div>
                        <div>
                            <h3>Creating Prompts</h3>
                            <p>
                                Guidelines on how to create your personalized
                                painting prompts.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* //body2 */}
            <div>
                {/* //left */}
                <div>
                    <h2>Contact Us</h2>
                    <p>Reach out for more specific inquiries or feedback.</p>
                </div>
                {/* //right */}
                <div>
                    <div>
                        <div>mail icon</div>
                        <div>
                            <h3>E-Mail Us</h3>
                            <p>support@paintprompt.com</p>
                        </div>
                    </div>

                    <div>Phone icon</div>
                    <div>
                        <h3>Call Us</h3>
                        <p>+1(234) 555-6789</p>
                    </div>
                </div>
            </div>
            {/* //footer */}
            <div>
                <p>© 2023 Paint Prompt. All rights reserved.</p>
                <p>Follow us on social media for updates!</p>
                <p>Privacy Policy | Terms of Service | Help Center</p>
            </div>
        </div>
    );
}
