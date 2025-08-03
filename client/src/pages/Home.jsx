import React from "react";
import ImageCarousel from "../components/ImageCarousel";
import Services from "../components/Services";
import Refer from "../components/Refer";

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative w-full h-[70vh] overflow-hidden pt-16">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source
            src="https://res.cloudinary.com/dlbgabdi1/video/upload/v1754237150/mores_cover_azmxmb.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 flex items-center justify-center z-10">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to <span className="text-[#FFCCBC]">Mores</span>
            </h1>
            <p className="text-lg md:text-2xl mb-6">
              Discover luxury beauty experiences like never before.
            </p>
            <button className="px-6 py-3 bg-[#8D6E63] hover:bg-[#5D4037] text-white rounded-full shadow-lg transition-transform transform hover:scale-105 duration-300">
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <Services />

      {/* Refer Section */}
      <Refer />

      {/* Carousel Section */}
      <ImageCarousel />
    </div>
  );
};

export default Home;
