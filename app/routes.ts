import {
    type RouteConfig,
    route,
    index,
    layout,
    prefix,
} from "@react-router/dev/routes";

export default [
    route("/", "routes/welcomepage.tsx"),
    route("/home", "routes/home.tsx"),
    route("/login", "routes/login.tsx"),
    route("/help", "routes/help.tsx"),
    route("/useapp", "routes/useapp.tsx"),
    route("/create-prompt", "routes/create-prompt.tsx"),
    route("/materials", "routes/materials.tsx"),
    route("/signup", "routes/signup.tsx"),
    route("/privacypolicy", "routes/privacypolicy.tsx"),
    route("/termsandservice", "routes/termsandservice.tsx"),
    route("/gallery", "routes/gallery.tsx"),
    route("/forgotpassword", "routes/forgotpassword.tsx"),
    route("/passwordreset", "routes/passwordreset.tsx"),
] satisfies RouteConfig;
