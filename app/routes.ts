import {
    type RouteConfig,
    route,
    index,
    layout,
    prefix,
} from "@react-router/dev/routes";

export default [
    route("/", "routes/welcomepage.tsx"),
    route("/home", "./home/Home.tsx"),
    route("/login", "routes/login.tsx"),
    route("/signup", "routes/signup.tsx"),
] satisfies RouteConfig;
