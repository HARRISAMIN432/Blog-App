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

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="admin" element={true ? <Layout /> : <Login />}>
          <Route index element={<Dashboard />} />
          <Route path="addBlog" element={<AddBlog />} />
          <Route path="comments" element={<Comments />} />
          <Route path="listBlog" element={<ListBlog />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
