import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Layout from "./pages/Admin/Layout";
import Dashboard from "./pages/Admin/Dashboard";
import AddBlog from "./pages/Admin/AddBlog";
import Comments from "./pages/Admin/Comments";
import ListBlog from "./pages/Admin/ListBlog";
import Login from "./components/Admin/Login";
import "quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import Subscribers from "./pages/Admin/Subscribers";

const App = () => {
  const isSigned = useSelector((state) => state.admin.isSigned);
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="admin" element={isSigned ? <Layout /> : <Login />}>
          <Route path="login" element={<Login />} />
          <Route index element={<Dashboard />} />
          <Route path="subscribers" element={<Subscribers />} />
          <Route path="addBlog" element={<AddBlog />} />
          <Route path="comments" element={<Comments />} />
          <Route path="listBlog" element={<ListBlog />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
