import { RouteObject, Navigate } from "react-router";

import Home from "../pages/home";
import Login from "../pages/login";

const routesConfig: RouteObject[] = [
  {
    path: "/",
    element: localStorage.getItem("token") ? <Navigate to="/home" /> : <Navigate to="/login" />,
  },
  {
    path: "/home",
    element: <Home />,
    children: [
      
    ]
  },
  {
    path: "/login",
    element: <Login />
  }
];


export default routesConfig;
