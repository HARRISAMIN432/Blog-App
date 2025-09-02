import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { assets } from "../assets/assets";
import { useDispatch, useSelector } from "react-redux";
import { userUpdate } from "../redux/userSlice";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (activeTab === "blogs") fetchUserBlogs();
    if (activeTab === "comments") fetchUserComments();
  }, [activeTab]);

  const fetchUserBlogs = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/my-blogs`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await res.json();
      if (data.success) setBlogs(data.blogs);
    } catch (err) {
      console.error("Failed to fetch blogs");
    }
  };

  const fetchUserComments = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/my-comments`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await res.json();
      if (data.success) setComments(data.comments);
    } catch (err) {
      console.error("Failed to fetch comments");
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ name, email }),
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("Profile updated successfully!");
        dispatch(userUpdate({ username: name }));
      } else {
        alert(data.message);
      }
    } catch {
      alert("Failed to update profile");
    }
    setIsUpdating(false);
  };

  const handleDeleteBlog = async (blogId) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/delete-blog`,
        {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: blogId }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setBlogs(blogs.filter((blog) => blog._id !== blogId));
        alert("Blog deleted successfully!");
      } else {
        alert(data.message);
      }
    } catch {
      alert("Failed to delete blog");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/delete-comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setComments(comments.filter((comment) => comment._id !== commentId));
        alert("Comment deleted successfully!");
      } else {
        alert(data.message);
      }
    } catch {
      alert("Failed to delete comment");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <img
                src={user.photo || assets.user_icon}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {user.username || name || "User"}
            </h1>
            <p className="text-gray-600">{user.email || email}</p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex bg-white rounded-lg p-1 shadow-sm border">
              {[
                { id: "profile", label: "Profile", icon: "👤" },
                { id: "blogs", label: `Blogs (${blogs.length})`, icon: "📝" },
                {
                  id: "comments",
                  label: `Comments (${comments.length})`,
                  icon: "💬",
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border">
            {activeTab === "profile" && (
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <span>✏️</span>
                  Edit Profile
                </h2>

                <div className="max-w-md mx-auto space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter your display name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <button
                    onClick={handleUpdateProfile}
                    disabled={isUpdating}
                    className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <span>💾</span>
                        Update Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Blogs Tab */}
            {activeTab === "blogs" && (
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <span>📝</span>
                  My Blogs
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                    {blogs.length}
                  </span>
                </h2>

                {blogs.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📄</div>
                    <h3 className="text-xl font-medium text-gray-600 mb-2">
                      No blogs yet
                    </h3>
                    <p className="text-gray-500">
                      Start writing your first blog to see it here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blogs.map((blog) => (
                      <div
                        key={blog._id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                              {blog.title}
                            </h3>
                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {blog.subtitle}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>📅 {formatDate(blog.createdAt)}</span>
                              {blog.category && (
                                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                                  {blog.category}
                                </span>
                              )}
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  blog.isPublished
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {blog.isPublished ? "✅ Published" : "⏳ Draft"}
                              </span>
                            </div>
                          </div>
                          <img
                            onClick={() => handleDeleteBlog(blog._id)}
                            src={assets.bin_icon}
                            alt="Delete"
                            className="ml-4 w-5 hover:scale-110 transition-all cursor-pointer"
                            title="Delete blog"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "comments" && (
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <span>💬</span>
                  My Comments
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                    {comments.length}
                  </span>
                </h2>

                {comments.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">💭</div>
                    <h3 className="text-xl font-medium text-gray-600 mb-2">
                      No comments yet
                    </h3>
                    <p className="text-gray-500">
                      Your comments on blogs will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="border border-gray-200 rounded-lg p-6"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="text-sm text-gray-600">
                            <span>💬 Commented on: </span>
                            <span className="font-medium text-primary">
                              {comment.blog?.title || "Unknown Blog"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">
                              📅 {formatDate(comment.createdAt)}
                            </span>
                            <img
                              onClick={() => handleDeleteComment(comment._id)}
                              src={assets.bin_icon}
                              alt="Delete"
                              className="w-5 hover:scale-110 transition-all cursor-pointer"
                              title="Delete comment"
                            />
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-primary">
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
