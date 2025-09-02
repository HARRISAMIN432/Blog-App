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

  const submitHandler = async (e) => {
    e.preventDefault();
    const run = async () => {
      setIsLoading(true);
      const blogDescription = quillRef.current.root.innerHTML;

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

        const data = await res.json();
        if (data.success === false) {
          setError(data.message || "Failed to add blog.");
        }
      } catch (err) {
        setError("Something went wrong while uploading the blog.");
      }

      setIsLoading(false);
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
  });

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  return (
    <form
      onSubmit={(e) => submitHandler(e)}
      className="w-screen min-h-screen bg-blue-50/50 text-gray-600 overflow-y-auto"
    >
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
            onClick={() => generateContent()}
            disabled={isGenerating}
            className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor:pointer"
          >
            {!isGenerating ? "Generate with AI" : "Generating"}
          </button>
        </div>
        <p className="mt-4">Blog Category</p>
        <select
          name="category"
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
          type="submit"
          disabled={isLoading}
        >
          {!isLoading ? "Add Blog" : "Creating..."}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};

export default AddBlog;
