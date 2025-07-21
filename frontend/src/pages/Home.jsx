import React from "react";
import Navbar from "../components/Navbar";
import BlogList from "../components/BlogList";
import Header from "../components/Header";

const Home = () => {
  return (
    <>
      <Navbar />
      <Header />
      <BlogList />
    </>
  );
};

export default Home;
