import React, { useState } from "react";
import { assets } from "../../assets/assets";

const CommentTableItem = ({ comment, fetchComments }) => {
  const { blog, createdAt, _id } = comment;
  const [error, setError] = useState("");
  const BlogDate = new Date(createdAt);

  const deleteComment = async () => {
    try {
      const res = await fetch(`/api/admin/delete-comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ id: _id }),
      });
      const data = await res.json();
      if (!data.success) setError(data.message);
    } catch (e) {
      setError("Network Error");
    }
    fetchComments();
  };

  const handleApproval = async () => {
    try {
      const res = await fetch(`/api/admin/approve-comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ id: _id }),
      });
      const data = await res.json();
      console.log(data);
      if (!data.success) setError(data.message);
    } catch (e) {
      console.log(e);
    }
    fetchComments();
  };

  return (
    <tr className="order-y border-gray-300">
      <td className="px-6 py-4">
        <b className="font-medium text-gray-600">Blog</b> : {blog.title}
        <br />
        <br />
        <b className="font-medium text-gray-600">Name</b> : {comment.name}
        <br />
        <b className="font-medium text-gray-600">Comment</b> : {comment.content}
      </td>
      <td className="px-6 py-4 max-sm:hidden">
        {BlogDate.toLocaleDateString()}
      </td>
      <td className="px-6 py-4">
        <div className="inline-flex items-center gap-4">
          {!comment.isApproved ? (
            <img
              onClick={handleApproval}
              src={assets.tick_icon}
              className="w-5 hover:scale-110 transition-all cursor-pointer"
            />
          ) : (
            <p className="text-xs border border-green-600 bg-green-100 text-green-600 rounded-full ox-3 py-1">
              Approved
            </p>
          )}
          <img
            src={assets.bin_icon}
            onClick={deleteComment}
            alt=""
            className="w-5 hover:scale-110 transition-all cursor-pointer"
          />
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem;
