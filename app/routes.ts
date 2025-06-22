import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("routes/welcomepage.tsx"),
  index("routes/home.tsx"),
  route("/home", "./home/Home.tsx"),
] satisfies RouteConfig;
