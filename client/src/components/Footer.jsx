import React from "react";
import { FaInstagram, FaFacebookF, FaTwitter, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#003463] text-white pt-12 pb-6 px-6 md:px-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-[#8D6E63] pb-10">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Mores Salon</h2>
          <p className="text-sm leading-6">
            Elevating your beauty experience through professional care and luxury services. Visit us for an indulgence you deserve.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Services</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
            <li><a href="#" className="hover:underline">Book Now</a></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Our Services</h3>
          <ul className="space-y-2 text-sm">
            <li>Hair Styling</li>
            <li>Facials & Skin</li>
            <li>Manicure & Pedicure</li>
            <li>Bridal Packages</li>
            <li>Makeovers</li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Get in Touch</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <FaMapMarkerAlt className="mt-1" />
              <span>123 Glam Street, Ranchi, Jharkhand, India</span>
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt /> <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope /> <span>contact@moresalon.in</span>
            </li>
          </ul>
          <div className="flex gap-4 mt-4 text-xl">
            <a href="#" className="hover:text-[#D7CCC8]"><FaInstagram /></a>
            <a href="#" className="hover:text-[#D7CCC8]"><FaFacebookF /></a>
            <a href="#" className="hover:text-[#D7CCC8]"><FaTwitter /></a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-8 text-center text-sm text-[#D7CCC8]">
        &copy; {new Date().getFullYear()} Mores Salon. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
