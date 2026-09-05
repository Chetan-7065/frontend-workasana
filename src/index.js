import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Project from "./pages/Project"
import Team from "./pages/Team"
import Report from "./pages/Report"
import Setting from "./pages/Setting"
import ProjectDetails from "./pages/ProjectDetails";
import TeamDetails from "./pages/TeamDetails";
import ProtectedRoute from "./components/ProtectedRoutes";
import reportWebVitals from "./reportWebVitals";
import TaskDetails from "./pages/TaskDetails";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardLayout from "./pages/DashboardLayout";
import {ToastContainer }from "react-toastify"

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },{
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/",
            element: <App />
          },
          {
            path: "/project",
            element: <Project />
          },
          {
            path: "/project/:projectId",
            element: <ProjectDetails />
          },
          {
            path: "/team",
            element: <Team />
          },
          {
            path: "/team/:teamId",
            element: <TeamDetails />
          },
          {
            path: "/task/:taskId",
            element: <TaskDetails />
          },
          {
            path: "/report",
            element: <Report />
          },
          {
            path: "/setting",
            element: <Setting />
          },
        ]
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
    <ToastContainer position="top-center" autoClose={3000}/>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
