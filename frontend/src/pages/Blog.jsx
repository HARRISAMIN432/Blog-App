import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Moment from "moment";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";

const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const username = useSelector((state) => state.user.username);
  const isSigned = useSelector((state) => state.admin.isSigned);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchBlogData = async () => {
    try {
      const res = await fetch(`/api/blog/${id}`);
      const data = await res.json();
      if (data.success === true) setData(data.blog);
      else setError(data.message || "Something went wrong.");
    } catch (err) {
      setError("Network error. Try again later.");
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blogId: id }),
      });
      const data = await res.json();
      if (data.success === true) setComments(data.comments);
      else setError(data.message || "Something went wrong.");
    } catch (err) {
      setError("Network error. Try again later.");
    }
  };

  useEffect(() => {
    fetchBlogData();
    fetchComments();
  }, [id]);

  const addComment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!username && !isSigned) {
      setError("You need to sign in to comment");
      return;
    }
    try {
      const res = await fetch(`/api/comments/add-comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          blog: id,
          content,
        }),
      });
      const data = await res.json();
      if (data.success === true) {
        setMessage("Your comment has been sent for approval");
        setContent("");
        fetchComments();
      } else {
        setError(data.message || "Failed to add comment.");
      }
    } catch (err) {
      setError("Network error. Try again later.");
    }
    setIsLoading(false);
  };

  return data ? (
    <div className="relative">
      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute top-0 left-0 w-full h-full -z-10 object-cover"
      />
      <Navbar />
      <div className="text-center mt-20 text-gray-600">
        <p className="text-primary py-4 font-medium">
          Published on {Moment(data.createdAt).format("MMMM Do YYYY")}
        </p>
        <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800">
          {data.title}
        </h1>
        <h2 className="my-5 max-w-lg truncate mx-auto">{data.subTitle}</h2>
        <p className="inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary">
          {data.user?.name ? data.user.name : "Admin"}
        </p>
      </div>
      <div className="mx-5 max-w-5xl md:mx-auto my-6 mt-6">
        <img
          src={`${data.image}?tr=w-1200,h-600,fo-auto,q-90`}
          alt="Blog Banner"
          className="w-full max-h-[500px] object-cover rounded-3xl mb-10 mx-auto"
        />

        <div
          className="rich-text max-w-3xl mx-auto"
          dangerouslySetInnerHTML={{ __html: data.description }}
        ></div>
        <div className="mt-14 mb-10 max-w-3xl mx-auto">
          <p className="font-semibold mb-4">Comments ({comments.length})</p>
          <div className="flex flex-col gap-4">
            {comments.map((item, index) => (
              <div
                key={index}
                className="relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img src={assets.user_icon} alt="" className="w-6" />
                  <p className="font-medium flex items-center gap-1">
                    {item.userId?.name || (
                      <>
                        <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                          Admin
                        </span>
                      </>
                    )}
                  </p>
                </div>
                <p className="text-sm max-w-wd ml-8">{item.content}</p>
                <div className="absolute right-4 bottom-3 flex items-center gap-2 text-xs">
                  {Moment(item.createdAt).fromNow()}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-3xl mx-auto">
          <p className="font-semibold mb-4">Add your comment</p>
          <form
            onSubmit={addComment}
            className="flex flex-col items-start gap-4 max-w-lg"
          >
            <textarea
              placeholder="Comment"
              onChange={(e) => setContent(e.target.value)}
              value={content}
              className="w-full placeholder:text-gray-300 p-2 border border-gray-300 rounded outline-none h-48"
            ></textarea>
            <button
              className="w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
        <div>
          <p className="text-green-300">{message}</p>
          <p className="font-semibold my-4">
            Share this article on social media
          </p>
          <div className="flex">
            <img src={assets.facebook_icon} alt="" width={50} />
            <img src={assets.twitter_icon} alt="" width={50} />
            <img src={assets.googleplus_icon} alt="" width={50} />
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Footer />
    </div>
  ) : (
    <div>
      <Loader />
    </div>
  );
};

export default Blog;
