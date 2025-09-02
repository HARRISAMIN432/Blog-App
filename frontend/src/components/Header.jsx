import React, { useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Header = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [popularSearches, setPopularSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const suggestionsRef = useRef(null);

  useEffect(() => {
    fetchPopularSearches();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchPopularSearches = async () => {
    try {
      const res = await fetch(
        `${import.meta.VITE_API_URL}/api/blog/popular-searches`
      );
      const data = await res.json();
      if (data.success) {
        setPopularSearches(data.popularSearches);
      }
    } catch (error) {
      console.error("Failed to fetch popular searches:", error);
    }
  };

  const fetchSuggestions = async (query) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${
          import.meta.VITE_API_URL
        }/api/blog/suggestions?q=${encodeURIComponent(query.trim())}`
      );
      const data = await res.json();
      if (data.success) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery && showSuggestions) {
        fetchSuggestions(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, showSuggestions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }

    if (onSearch) {
      onSearch(query);
    }
  };

  const handleInputFocus = () => {
    if (searchQuery.trim()) {
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    if (onSearch) {
      onSearch(suggestion);
    }
    setShowSuggestions(false);
  };

  const handlePopularSearchClick = (search) => {
    setSearchQuery(search);
    if (onSearch) {
      onSearch(search);
    }
    setShowSuggestions(false);
  };

  return (
    <div className="mx-8 sm:mx-16 xl:mx-24 relative">
      <div className="text-center mt-20 mb-8">
        <div className="inline-flex items-center justify-center gap-4 px-6 py-1.5 mb-4 border border-primary/40 bg-primary/10 rounded-full text-sm text-primary">
          <p>New AI feature integrated</p>
          <img src={assets.star_icon} alt="" className="w-2.5" />
        </div>
        <h1 className="text-3xl sm:text-6xl font-semibold sm:leading-16 text-gray-700">
          Your own <span className="text-primary">blogging</span> <br />{" "}
          platform
        </h1>
        <p className="my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-gray-500">
          This is your space to think out loud, to share what matters, and to
          write without filters. Whether it's one word or a thousand, your story
          starts right here.
        </p>

        <div className="relative max-w-lg max-sm:scale-75 mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex justify-between border border-gray-300 bg-white rounded overflow-hidden relative"
            ref={searchRef}
          >
            <input
              type="text"
              placeholder="Search for blogs by title, content, or category..."
              className="placeholder:text-gray-400 w-full outline-none px-4 py-2"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />

            <button
              type="submit"
              className="bg-primary text-white px-8 py-2 m-1.5 rounded hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search
            </button>
          </form>
          <button
            onClick={() => navigate("/addBlog")}
            className="bg-primary cursor-pointer hover:scale-105 text-white px-6 py-2 mt-6 rounded-full shadow hover:bg-primary/90 transition-all"
          >
            Create Blog
          </button>

          {showSuggestions && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-80 overflow-y-auto"
            >
              {loading && (
                <div className="p-4 text-center text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  Loading suggestions...
                </div>
              )}

              {!loading && suggestions.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b">
                    Suggestions
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b last:border-b-0 flex items-center gap-2"
                    >
                      <svg
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span className="truncate">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}

              {!loading &&
                suggestions.length === 0 &&
                searchQuery.length >= 2 && (
                  <div className="p-4 text-gray-500 text-center">
                    No suggestions found
                  </div>
                )}

              {!loading &&
                popularSearches.length > 0 &&
                (!searchQuery || searchQuery.length < 2) && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b">
                      Popular Searches
                    </div>
                    {popularSearches.slice(0, 6).map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handlePopularSearchClick(search)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b last:border-b-0 flex items-center gap-2"
                      >
                        <svg
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                        <span className="truncate">{search}</span>
                      </button>
                    ))}
                  </div>
                )}
            </div>
          )}
        </div>

        {searchQuery && (
          <div className="mt-4 text-sm text-gray-500">
            <p>
              💡 Tip: Search works across titles, content, categories, and
              descriptions
            </p>
          </div>
        )}
      </div>

      <img
        src={assets.gradientBackground}
        alt="gradient background"
        className="absolute -top-50 -z-1 opacity-50"
      />
    </div>
  );
};

export default Header;
