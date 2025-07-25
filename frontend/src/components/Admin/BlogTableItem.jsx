import React from "react";
import { assets } from "../../assets/assets";

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  const { title, createdAt } = blog;
  const BlogDate = new Date(createdAt);

  const togglePublishStatus = async () => {
    try {
      const res = await fetch(`/api/blog/toggle-publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ id: blog._id }),
      });
      const data = await res.json();
      if (data.success) {
        fetchBlogs();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Network error while updating publish status.");
    }
  };

  const deleteBlog = async () => {
    try {
      const res = await fetch(`/api/blog/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ id: blog._id }),
      });

      const data = await res.json();
      console.log(data);

      if (data.success === true) {
        fetchBlogs();
      } else {
        alert(data.message || "Failed to delete blog.");
      }
    } catch (err) {
      alert("Network error while deleting blog.");
    }
  };

  return (
    <tr className="border-y border-gray-300">
      <th className="px-2 py-4">{index}</th>
      <td className="px-2 py-4"> {title} </td>
      <td className="px-2 py-4 max-sm:hidden">{BlogDate.toDateString()}</td>
      <td className="px-2 py-4 max-sm:hidden">
        <p
          className={`${
            blog.isPublished ? "text-green-600" : "text-orange-700"
          }`}
        >
          {blog.isPublished ? "Published" : "Unpublished"}
        </p>
      </td>
      <td className="px-2 py-4 flex text-xs gap-3">
        <button
          onClick={togglePublishStatus}
          className="border px-2 py-0.5 mt-1 rounded cursor-pointer"
        >
          {blog.isPublished ? "Published" : "Unpublished"}
        </button>
        <img
          src={assets.cross_icon}
          onClick={deleteBlog}
          alt=""
          className="w-8 hover:scale-110 transition-all cursor-pointer"
        />
      </td>
    </tr>
  );
};

export default BlogTableItem;
