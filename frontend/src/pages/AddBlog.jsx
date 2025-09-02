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

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      console.log("Page unload triggered");
      e.preventDefault();
      return "Are you sure you want to leave?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  });

  const submitHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const run = async () => {
      setIsLoading(true);
      setError("");
      const blogDescription = quillRef.current.root.innerHTML;
      if (!quillRef.current || !quillRef.current.root) {
        setError("Quill editor not initialized");
        setIsLoading(false);
        return;
      }
      if (!image) {
        setError("Please upload a thumbnail image for the blog.");
        setIsLoading(false);
        return;
      }
      if (!title || !subtitle || !blogDescription || !category) {
        setError("Please fill all the fields.");
        setIsLoading(false);
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

      if (!category || category === "Select Category" || category === "") {
        setError("Please select a valid blog category.");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("blog", JSON.stringify(blogObject));
      formData.append("image", image);

      try {
        console.log("We have arrived");
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
        console.log("Request sent");
        const data = await res.json();
        if (data.success === false) {
          setError(data.message || "Failed to add blog.");
        }
      } catch (err) {
        setError("Something went wrong while uploading the blog.");
      }
      setIsLoading(false);
      setTitle("");
      setSubtitle("");
      setCategory("Startup");
      setImage(false);
      setPublished(false);
      quillRef.current.root.innerHTML = "";
    };

    run();
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
    if (isGenerating === true)
      quillRef.current.root.innerHTML = "Generating...";
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
          />
        </label>
        <p className="mt-4">Blog title</p>
        <input
          type="text"
          placeholder="Type here"
          className="w-full max-w-lg mt-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <p className="mt-4">Blog subtitle</p>
        <input
          type="text"
          placeholder="Type here"
          className="w-full max-w-lg mt-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setSubtitle(e.target.value)}
          value={subtitle}
        />
        <p className="mt-4">Blog description</p>
        <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
          <div ref={editorRef}></div>
          <button
            type="button"
            onClick={() => generateContent()}
            disabled={isGenerating}
            className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor:pointer"
          >
            {!isGenerating ? "Generate with AI" : "Generating"}
          </button>
        </div>
        <p className="mt-4">Blog Category</p>
        <select
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
          className="mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm"
          onClick={submitHandler}
          disabled={isLoading}
          type="button"
        >
          {!isLoading ? "Add Blog" : "Creating..."}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default AddBlog;
