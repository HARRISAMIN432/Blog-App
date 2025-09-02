import React, { useEffect, useRef, useState } from "react";
import { assets, blogCategories } from "../assets/assets.js";
import Quill from "quill";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";

const AddBlog = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  let user = useSelector((state) => state.user.id);
  const [image, setImage] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Startup");
  const [subtitle, setSubtitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Add comprehensive debugging
  useEffect(() => {
    console.log("AddBlog component mounted");
    console.log("Current URL:", window.location.href);

    // Capture ALL navigation events
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      console.log("History pushState called:", args);
      console.trace("pushState call stack");
      return originalPushState.apply(this, args);
    };

    history.replaceState = function (...args) {
      console.log("History replaceState called:", args);
      console.trace("replaceState call stack");
      return originalReplaceState.apply(this, args);
    };

    // Listen for any form submissions on the page
    const handleDocumentSubmit = (e) => {
      console.log("Document submit detected:", e.target);
      console.log("Form action:", e.target.action);
      console.log("Form method:", e.target.method);
    };

    const handleDocumentClick = (e) => {
      if (e.target.type === "submit" || e.target.tagName === "BUTTON") {
        console.log("Button/submit clicked:", e.target);
        console.log("Button type:", e.target.type);
        console.log("Button form:", e.target.form);
      }
    };

    document.addEventListener("submit", handleDocumentSubmit, true);
    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      // Restore original functions
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      document.removeEventListener("submit", handleDocumentSubmit, true);
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, []);

  const submitHandler = async (e) => {
    console.log("=== SUBMIT HANDLER CALLED ===");
    console.log("Event type:", e.type);
    console.log("Event target:", e.target);
    console.log("Event currentTarget:", e.currentTarget);
    console.log("URL before preventDefault:", window.location.href);

    e.preventDefault();
    e.stopPropagation();

    console.log("URL after preventDefault:", window.location.href);

    if (isLoading) {
      console.log("Already loading, returning");
      return;
    }

    const run = async () => {
      console.log("Starting API call...");
      setIsLoading(true);
      setError("");

      try {
        const blogDescription = quillRef.current.root.innerHTML;

        if (!quillRef.current || !quillRef.current.root) {
          setError("Quill editor not initialized");
          return;
        }

        if (!image) {
          setError("Please upload a thumbnail image for the blog.");
          return;
        }

        if (!title || !subtitle || !blogDescription || !category) {
          setError("Please fill all the fields.");
          return;
        }

        if (!category || category === "Select Category" || category === "") {
          setError("Please select a valid blog category.");
          return;
        }

        let blogObject = {};
        if (!user) {
          blogObject = {
            title,
            subtitle,
            description: blogDescription,
            category,
            isPublished: published,
          };
        } else {
          blogObject = {
            title,
            subtitle,
            description: blogDescription,
            category,
            isPublished: published,
            user,
          };
        }

        const formData = new FormData();
        formData.append("blog", JSON.stringify(blogObject));
        formData.append("image", image);

        console.log("About to make fetch request...");
        console.log("URL before fetch:", window.location.href);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/blog/add`,
          {
            method: "POST",
            headers: {
              Authorization: localStorage.getItem("token"),
            },
            body: formData,
          }
        );

        console.log("Fetch completed, response:", res.status);
        console.log("URL after fetch:", window.location.href);

        const data = await res.json();

        if (data.success === false) {
          setError(data.message || "Failed to add blog.");
          return;
        }

        console.log("Success! Resetting form...");
        // Success case - reset form
        setTitle("");
        setSubtitle("");
        setCategory("Startup");
        setImage(false);
        setPublished(false);
        if (quillRef.current) {
          quillRef.current.root.innerHTML = "";
        }

        setError("");
      } catch (err) {
        console.error("Error uploading blog:", err);
        setError("Something went wrong while uploading the blog.");
      } finally {
        setIsLoading(false);
      }
    };

    await run();
  };

  const generateContent = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/generate-blog`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: title, subtitle }),
        }
      );
      const data = await res.json();
      if (data.success) {
        let cleanedContent = data.content
          .replace(/^```(?:html)?\s*|\s*```$/g, "")
          .trim();
        quillRef.current.root.innerHTML = cleanedContent;
      } else {
        setError("Failed to generate blog content.");
      }
    } catch (err) {
      setError("Error generating blog.");
    }
    setIsGenerating(false);
  };

  useEffect(() => {
    if (isGenerating === true && quillRef.current) {
      quillRef.current.root.innerHTML = "Generating...";
    }
  }, [isGenerating]);

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  return (
    <div className="w-screen min-h-screen bg-blue-50/50 text-gray-600 overflow-y-auto">
      <Navbar />
      <div className="bg-white w-full max-w-4xl mx-auto my-10 p-6 sm:p-10 shadow rounded-lg">
        {/* Prevent any form nesting issues */}
        <form
          onSubmit={submitHandler}
          noValidate
          autoComplete="off"
          method="post"
          action=""
          onReset={(e) => e.preventDefault()}
        >
          <p>Upload thumbnail</p>
          <label htmlFor="image">
            <img
              src={!image ? assets.upload_area : URL.createObjectURL(image)}
              alt=""
              className="mt-2 h-16 rounded cursor-pointer"
            />
            <input
              type="file"
              id="image"
              onChange={(e) => setImage(e.target.files[0])}
              hidden
              required
            />
          </label>

          <p className="mt-4">Blog title</p>
          <input
            type="text"
            placeholder="Type here"
            required
            className="w-full max-w-lg mt-2 border border-gray-300 outline-none rounded px-3 py-2"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />

          <p className="mt-4">Blog subtitle</p>
          <input
            type="text"
            placeholder="Type here"
            required
            className="w-full max-w-lg mt-2 border border-gray-300 outline-none rounded px-3 py-2"
            onChange={(e) => setSubtitle(e.target.value)}
            value={subtitle}
          />

          <p className="mt-4">Blog description</p>
          <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
            <div ref={editorRef}></div>
            <button
              type="button"
              onClick={generateContent}
              disabled={isGenerating}
              className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer disabled:opacity-50"
            >
              {!isGenerating ? "Generate with AI" : "Generating"}
            </button>
          </div>

          <p className="mt-4">Blog Category</p>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded"
          >
            {blogCategories.map((blog, index) => {
              return (
                <option key={index} value={blog}>
                  {blog}
                </option>
              );
            })}
          </select>

          <div className="flex gap-2 mt-4">
            <p>Publish Now</p>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="scale-125 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
            onMouseDown={(e) => {
              console.log("Submit button mouse down");
              e.stopPropagation();
            }}
            onFocus={(e) => {
              console.log("Submit button focused");
            }}
          >
            {!isLoading ? "Add Blog" : "Creating..."}
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default AddBlog;
