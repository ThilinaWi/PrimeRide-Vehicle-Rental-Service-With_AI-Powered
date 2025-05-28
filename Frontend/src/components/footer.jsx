import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#2c3e50] py-8 text-white">
      {" "}
      {/* Dark blue-gray */}
      <div className="container mx-auto px-4">
        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <a href="#" className="hover:text-[#f1c40f] transition-colors">
            Home
          </a>{" "}
          {/* Yellow hover */}
          <a href="#" className="hover:text-[#f1c40f] transition-colors">
            Reviews
          </a>
          <a href="#" className="hover:text-[#f1c40f] transition-colors">
            Blog
          </a>
          <a href="#" className="hover:text-[#f1c40f] transition-colors">
            Help Center
          </a>
          <a href="#" className="hover:text-[#f1c40f] transition-colors">
            About
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mb-8">
          <a href="#" className="hover:text-[#f1c40f] transition-colors">
            <FaFacebook size={20} />
          </a>
          <a href="#" className="hover:text-[#f1c40f] transition-colors">
            <FaTwitter size={20} />
          </a>
          <a href="#" className="hover:text-[#f1c40f] transition-colors">
            <FaInstagram size={20} />
          </a>
          <a href="#" className="hover:text-[#f1c40f] transition-colors">
            <FaLinkedin size={20} />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-[#bdc3c7] text-sm">
          {" "}
          {/* Light gray */}
          <p>
            PrimeRide &copy; {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
