import React, { useState, useEffect, useCallback } from "react";
import { blog_data, blogCategories } from "../assets/assets";
import { motion } from "motion/react";
import BlogCard from "./BlogCard";

const BlogList = ({ searchQuery = "", searchCategory = "All" }) => {
  const [menu, setMenu] = useState(searchCategory);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isSearching, setIsSearching] = useState(false);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blog/all`);
      const data = await res.json();
      if (data.success === true) {
        setBlogs(data.blogs);
      } else {
        setError(data.message);
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const searchBlogs = async (query, category = "All", page = 1) => {
    try {
      setLoading(true);
      setIsSearching(true);

      const params = new URLSearchParams();
      if (query && query.trim()) params.append("q", query.trim());
      if (category && category !== "All") params.append("category", category);
      params.append("page", page);
      params.append("limit", 20);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/blog/search?${params}`
      );
      const data = await res.json();

      if (data.success) {
        setSearchResults(data.blogs);
        setPagination(data.pagination);
        setError("");
      } else {
        setError(data.message);
        setSearchResults([]);
      }
    } catch (e) {
      setError("Search failed. Please try again.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query, category) => {
      if (query && query.trim()) {
        searchBlogs(query, category);
      } else {
        setIsSearching(false);
        setSearchResults([]);
        setPagination({});
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    setMenu(searchCategory);
  }, [searchCategory]);

  useEffect(() => {
    if (searchQuery && searchQuery.trim()) {
      debouncedSearch(searchQuery, menu);
    } else {
      setIsSearching(false);
      setSearchResults([]);
      setPagination({});
      setError("");
    }
  }, [searchQuery, menu, debouncedSearch]);

  const displayBlogs =
    isSearching && searchQuery.trim()
      ? searchResults
      : blogs.filter((blog) =>
          menu === "All" ? true : blog.category === menu
        );

  const showNoResults = !loading && displayBlogs.length === 0 && !error;

  return (
    <div>
      {isSearching && searchQuery && (
        <div className="text-center mb-6">
          <p className="text-gray-600">
            {searchResults.length > 0
              ? `Found ${pagination.totalBlogs || searchResults.length} result${
                  (pagination.totalBlogs || searchResults.length) !== 1
                    ? "s"
                    : ""
                } for "${searchQuery}"`
              : `No results found for "${searchQuery}"`}
          </p>
          {pagination.totalPages > 1 && (
            <p className="text-sm text-gray-500 mt-1">
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>
          )}
        </div>
      )}
      <div className="flex justify-center gap-4 sm:gap-8 my-10 relative">
        {blogCategories.map((category) => (
          <div key={category} className="relative">
            <button
              onClick={() => setMenu(category)}
              className={`cursor-pointer text-gray-500 ${
                menu === category && "text-white px-4 pt-0.5"
              }`}
              disabled={loading}
            >
              {category}
              {menu === category && (
                <motion.div
                  layoutId="underline"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                  className="absolute left-0 right-0 top-0 h-7 -z-1 bg-primary rounded-full"
                ></motion.div>
              )}
            </button>
          </div>
        ))}
      </div>
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-500">
            {isSearching ? "Searching..." : "Loading blogs..."}
          </p>
        </div>
      )}
      {error && !loading && (
        <div className="text-center text-red-500 mb-6">
          <p>Error: {error}</p>
        </div>
      )}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40">
          {displayBlogs.length > 0
            ? displayBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))
            : showNoResults && (
                <div className="col-span-full text-center text-gray-500 py-12">
                  {isSearching && searchQuery.trim() ? (
                    <>
                      <div className="text-6xl mb-4">🔍</div>
                      <p className="text-lg font-medium mb-2">No blogs found</p>
                      <p className="text-sm">
                        No results found for "{searchQuery}". Try different
                        keywords or browse all categories.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-6xl mb-4">📝</div>
                      <p className="text-lg font-medium mb-2">
                        No blogs in this category
                      </p>
                      <p className="text-sm">
                        Try selecting a different category or check back later.
                      </p>
                    </>
                  )}
                </div>
              )}
        </div>
      )}
      {isSearching && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mb-16">
          <button
            onClick={() =>
              searchBlogs(searchQuery, menu, pagination.currentPage - 1)
            }
            disabled={!pagination.hasPrevPage || loading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            onClick={() =>
              searchBlogs(searchQuery, menu, pagination.currentPage + 1)
            }
            disabled={!pagination.hasNextPage || loading}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogList;
