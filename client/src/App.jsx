import "./App.css";
import { Navigate, useRoutes } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import SignUp from "./pages/user/SignUp";
import Login from "./pages/user/Login";
import Home from "./pages/user/Home";
import AddBlog from "./pages/user/AddBlog";
import ViewBlog from "./pages/user/ViewBlog";
import EditBlog from "./pages/user/EditBlog";
import MyBlogs from "./pages/user/MyBlogs";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import AllUsers from "./pages/admin/AllUsers";

const App = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <Navigate to={"/home"} />,
    },
    {
      path: "/",
      children: [
        {
          index: true,
          path: "home",
          element: (
            <>
              <Navbar role={"user"}/>
              <Home />
              <Footer />
            </>
          ),
        },
        { path: "sign-up", element: <SignUp /> },
        { path: "login", element: <Login /> },
        {
          path: "add-blog/:userId",
          element: (
            <>
              <Navbar role={"user"} />
              <AddBlog />
              <Footer />
            </>
          ),
        },
        {
          path: "/edit-blog/:postId",
          element: (
            <>
              <Navbar role={"user"} />
              <EditBlog />
              <Footer />
            </>
          ),
        },
        {
          path: "/my-blog/:userId",
          element: (
            <>
              <Navbar role={"user"} />
              <MyBlogs />
              <Footer />
            </>
          ),
        },
        {
          path: "view-blog/:postId",
          element: (
            <>
              <Navbar role={"user"} />
              <ViewBlog />
              <Footer />
            </>
          ),
        },
      ],
    },
    {
      path: "/admin",
      element: <Navigate to={"/admin/dashboard"} />,
    },
    {
      path: "/admin",
      children: [
        {
          index: true,
          path: "dashboard",
          element: (
            <>
              <Navbar role={"admin"} />
              <Dashboard />
              <Footer />
            </>
          ),
        },
        { path: "login", element: <AdminLogin /> },
        {
          path: "all-users",
          element: (
            <>
              <Navbar role={"admin"} />
              <AllUsers />
              <Footer />
            </>
          ),
        },
      ],
    },
  ]);
  return element;
};

export default App;
