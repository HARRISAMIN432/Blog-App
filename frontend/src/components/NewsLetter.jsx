import React, { useState } from "react";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError("");

    try {
      const res = await fetch(`${import.meta.VITE_API_URL}/api/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setEmail("");
      } else {
        setError(data.message || "Subscription failed.");
      }
    } catch {
      setError("Network error. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 my-32">
      <h1 className="md:text-4xl text-2xl font-semibold">Never Miss a Blog!</h1>
      <p className="md:text-lg text-gray-500/70 pb-8">
        Subscribe to get the latest blog, new tech, and exclusive news
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12"
      >
        <input
          type="email"
          placeholder="Enter your email id"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full px-3 text-gray-500 placeholder:text-gray-300"
        />
        <button
          type="submit"
          className="md:px-12 px-8 h-full text-white bg-primary/80 hover:bg-primary transition-all cursor-pointer rounded-md rounded-l-none"
        >
          Subscribe
        </button>
      </form>
      {success && <p className="text-green-600 text-sm">Subscribed!</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default NewsLetter;
