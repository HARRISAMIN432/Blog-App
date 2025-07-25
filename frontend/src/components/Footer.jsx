import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/3">
      <div className="py-10 border-b border-gray-500/30 text-gray-500 text-center">
        <img
          src={assets.logo}
          alt="logo"
          className="w-32 sm:w-44 mx-auto mb-6"
        />
        <p className="max-w-5xl mx-auto">
          Blogify is your all-in-one platform for sharing ideas, knowledge, and
          creativity with the world. Whether you're a writer, reader, or
          entrepreneur, our clean interface, powerful editor, and
          community-driven features make blogging effortless and engaging. From
          publishing detailed articles to managing comments and newsletter
          subscribers through the admin dashboard, Blogify gives you full
          control. Stay connected with your audience, explore diverse topics,
          and never miss an update by subscribing to our newsletter. Built for
          simplicity and scalability, Blogify is where stories begin and
          communities grow.
        </p>
      </div>
      <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
        Copyright 2025 QuickBlog - All Right Reserved.
      </p>
    </div>
  );
};

export default Footer;
