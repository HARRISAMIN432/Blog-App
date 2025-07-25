import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import BlogList from "../components/BlogList";
import NewsLetter from "../components/NewsLetter";
import Footer from "../components/Footer";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <>
      <Navbar />
      <Header onSearch={handleSearch} />

      {searchQuery && searchQuery.trim() && (
        <div className="text-center mb-4 mx-8 sm:mx-16 xl:mx-40">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Search Results for "{searchQuery}"
            </h2>
            <button
              onClick={handleClearSearch}
              className="text-sm text-primary hover:text-primary/80 underline transition-colors"
            >
              Clear Search
            </button>
          </div>
        </div>
      )}

      <BlogList searchQuery={searchQuery} />
      <NewsLetter />
      <Footer />
    </>
  );
};

export default Home;
