import React, { useState } from "react";
import { assets } from "../../assets/assets";

const CommentTableItem = ({ comment, fetchComments }) => {
  const { blog, createdAt, _id, isApproved, content, userId } = comment;
  const [error, setError] = useState("");
  const BlogDate = new Date(createdAt);

  const deleteComment = async () => {
    try {
      const res = await fetch(
        `${import.meta.VITE_API_URL}/api/admin/delete-comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ id: _id }),
        }
      );
      const data = await res.json();
      if (!data.success) setError(data.message);
    } catch (e) {
      setError("Network Error");
    }
    fetchComments();
  };

  const handleApproval = async () => {
    try {
      const res = await fetch(
        `${import.meta.VITE_API_URL}/api/admin/approve-comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ id: _id }),
        }
      );
      const data = await res.json();
      if (!data.success) setError(data.message);
    } catch (e) {
      setError("Network Error");
    }
    fetchComments();
  };

  return (
    <tr className="border-b border-gray-300 text-gray-700">
      <td className="px-6 py-4 text-sm">
        <div>
          <b className="font-medium text-gray-600">Blog:</b> {blog.title}
        </div>
        <div className="mt-2">
          <b className="font-medium text-gray-600">Name:</b>{" "}
          {userId?.name || "Admin"}{" "}
          <span
            className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
              userId ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-700"
            }`}
          >
            {userId ? "User" : "Admin"}
          </span>
        </div>
        <div className="mt-2">
          <b className="font-medium text-gray-600">Comment:</b> {content}
        </div>
        {error && <p className="text-red-500 text-xs mt-2">⚠ {error}</p>}
      </td>
      <td className="px-6 py-4 text-sm max-sm:hidden">
        {BlogDate.toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-sm">
        <div className="inline-flex items-center gap-4">
          {!isApproved ? (
            <img
              onClick={handleApproval}
              src={assets.tick_icon}
              alt="Approve"
              className="w-5 hover:scale-110 transition-all cursor-pointer"
              title="Approve"
            />
          ) : (
            <p className="text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1">
              Approved
            </p>
          )}
          <img
            onClick={deleteComment}
            src={assets.bin_icon}
            alt="Delete"
            className="w-5 hover:scale-110 transition-all cursor-pointer"
            title="Delete"
          />
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem;
