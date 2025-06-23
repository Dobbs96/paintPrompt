import {
    type RouteConfig,
    route,
    index,
    layout,
    prefix,
} from "@react-router/dev/routes";

export default [
<<<<<<< HEAD
    index("routes/welcomepage.tsx"),
    route("/home", "./home/home.tsx"),
=======
  //removing the comment marker below gives me an error, im not sure if it's an issue on my end - kevin
  //index("routes/home.tsx"),
  route("/", "routes/welcomepage.tsx"),
  route("/home", "./home/Home.tsx"),
  route("/login","routes/login.tsx"),

>>>>>>> main
] satisfies RouteConfig;
