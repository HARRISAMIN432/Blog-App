import React, { useEffect, useRef, useState } from "react";
import { assets, blogCategories } from "../assets/assets.js";
import Quill from "quill";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const AddBlog = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const user = useSelector((state) => state.user.id);
  const location = useLocation(); // Get URL query parameters
  const navigate = useNavigate(); // For controlled navigation
  const [image, setImage] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Startup");
  const [subtitle, setSubtitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle URL query parameter for category
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlCategory = params.get("category");
    console.log("URL query category:", urlCategory);
    if (urlCategory && blogCategories.includes(urlCategory)) {
      setCategory(urlCategory);
    }
  }, [location.search]);

  // Log Redux user state
  useEffect(() => {
    console.log("Redux user:", user);
  }, [user]);

  // Detect page reload or navigation
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      console.log("Page is about to reload or navigate");
      // Uncomment to debug by preventing unload
      // event.preventDefault();
      // event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Initialize Quill editor
  useEffect(() => {
    try {
      if (!quillRef.current && editorRef.current) {
        console.log("Initializing Quill editor");
        quillRef.current = new Quill(editorRef.current, { theme: "snow" });
      }
    } catch (err) {
      console.error("Quill initialization error:", err);
      setError("Failed to initialize editor");
    }
  }, []);

  // Update Quill content when generating
  useEffect(() => {
    if (isGenerating && quillRef.current) {
      try {
        quillRef.current.root.innerHTML = "Generating...";
      } catch (err) {
        console.error("Error setting Quill content:", err);
        setError("Error updating editor content");
      }
    }
  }, [isGenerating]);

  const submitHandler = async (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      console.log("Button click event:", event);
    }

    console.log("submitHandler started, user:", user);
    try {
      const run = async () => {
        setIsLoading(true);
        setError("");
        console.log("Checking Quill ref");
        if (!quillRef.current || !quillRef.current.root) {
          setError("Quill editor not initialized");
          setIsLoading(false);
          console.log("Quill error");
          return;
        }
        const blogDescription = quillRef.current.root.innerHTML;
        console.log("Blog description:", blogDescription);

        if (!image) {
          setError("Please upload a thumbnail image for the blog.");
          setIsLoading(false);
          console.log("Image missing");
          return;
        }
        if (!title || !subtitle || !blogDescription || !category) {
          setError("Please fill all the fields.");
          setIsLoading(false);
          console.log("Fields missing");
          return;
        }
        if (!category || category === "Select Category" || category === "") {
          setError("Please select a valid blog category.");
          setIsLoading(false);
          console.log("Invalid category");
          return;
        }

        const blogObject = {
          title,
          subtitle,
          description: blogDescription,
          category,
          isPublished: published,
          ...(user && { user }),
        };

        const formData = new FormData();
        formData.append("blog", JSON.stringify(blogObject));
        formData.append("image", image);

        console.log("API URL:", `${import.meta.env.VITE_API_URL}/api/blog/add`);
        console.log("Authorization token:", localStorage.getItem("token"));

        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/blog/add`,
            {
              method: "POST",
              headers: {
                Authorization: localStorage.getItem("token") || "",
              },
              body: formData,
            }
          );
          console.log("Fetch response status:", res.status, res.statusText);
          console.log(
            "Fetch response headers:",
            Object.fromEntries(res.headers)
          );
          const data = await res.json();
          console.log("Fetch response data:", data);
          if (data.success === false) {
            setError(data.message || "Failed to add blog.");
          } else {
            console.log("Blog added successfully");
            navigate("/blogs");
          }
        } catch (err) {
          console.error("Fetch error:", err.message);
          setError("Something went wrong while uploading the blog.");
        }
        setIsLoading(false);
        setTitle("");
        setSubtitle("");
        setCategory("Startup");
        setImage(false);
        setPublished(false);
        if (quillRef.current) {
          quillRef.current.root.innerHTML = "";
        }
        console.log("submitHandler completed");
      };
      await run();
    } catch (err) {
      console.error("submitHandler error:", err);
      setError("An unexpected error occurred");
      console.log("submitHandler caught error");
      setIsLoading(false);
    }
    console.error("submitHandler final block reached");
  };

  const generateContent = async () => {
    setIsGenerating(true);
    try {
      console.log(
        "Generating content with topic:",
        title,
        "subtitle:",
        subtitle
      );
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/generate-blog`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: title, subtitle }),
        }
      );
      console.log("Generate content response status:", res.status);
      const data = await res.json();
      console.log("Generate content response data:", data);
      if (data.success) {
        let cleanedContent = data.content
          .replace(/^```(?:html)?\s*|\s*```$/g, "")
          .trim();
        if (quillRef.current) {
          quillRef.current.root.innerHTML = cleanedContent;
        }
      } else {
        setError("Failed to generate blog content.");
      }
    } catch (err) {
      setError("Error generating blog.");
    }
    setIsGenerating(false);
  };

  return (
    <div className="w-screen min-h-screen bg-blue-50/50 text-gray-600 overflow-y-auto">
      <Navbar />
      <div className="bg-white w-full max-w-4xl mx-auto my-10 p-6 sm:p-10 shadow rounded-lg">
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
          className="w-full max-w-lg mt-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <p className="mt-4">Blog subtitle</p>
        <input
          type="text"
          placeholder="Type here"
          required
          className="w-full max-w-lg mt-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setSubtitle(e.target.value)}
          value={subtitle}
        />
        <p className="mt-4">Blog description</p>
        <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
          <div ref={editorRef}></div>
          <button
            type="button"
            onClick={() => {
              console.log("Generate button clicked");
              generateContent();
            }}
            disabled={isGenerating}
            className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer"
          >
            {!isGenerating ? "Generate with AI" : "Generating"}
          </button>
        </div>
        <p className="mt-4">Blog Category</p>
        <select
          name="category"
          onChange={(e) => {
            console.log("Category changed to:", e.target.value);
            setCategory(e.target.value);
          }}
          className="mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded"
          value={category}
        >
          {blogCategories.map((blog, index) => (
            <option key={index} value={blog}>
              {blog}
            </option>
          ))}
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
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            console.log("Add Blog button clicked");
            submitHandler(event);
          }}
          disabled={isLoading}
          className="mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm"
        >
          {!isLoading ? "Add Blog" : "Creating..."}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default AddBlog;
