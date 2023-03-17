import { RouteObject, Navigate } from "react-router";

import Layout from "../pages/layout";
import Login from "../pages/login";
import Home from "../pages/home";
import Node from "../pages/node";
import Pod from "../pages/pod";
import Algorithm from "../pages/algorithm";

const routesConfig: RouteObject[] = [
  {
    path: "/",
    element: localStorage.getItem("token") ? <Layout /> : <Navigate to="/login" />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/node",
        element: <Node/>,
      },
      {
        path: "/pod",
        element: <Pod />,
      },
      {
        path: "/algorithm",
        element: <Algorithm />,
      },
    ]
  },
  {
    path: "/login",
    element: <Login />
  }
];


export default routesConfig;
