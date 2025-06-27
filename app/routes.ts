import {
    type RouteConfig,
    route,
    index,
    layout,
    prefix,
} from "@react-router/dev/routes";

export default [
    route("/", "routes/welcomepage.tsx"),
    route("/home", "./routes/home.tsx"),
    route("/login", "routes/login.tsx"),
    route("/help", "routes/help.tsx"),
    route("/signup", "routes/signup.tsx"),
] satisfies RouteConfig;
