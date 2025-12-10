import React from "react";
import ImageCarousel from "../components/ImageCarousel";
import Services from "../components/Services";
import StatsSection from "../components/StatsSection";

const Home = () => {
  return (
    <div className="w-full bg-gradient-to-r from-blue-50 via-white to-pink-50">
      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden pt-16 mb-6 ">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover bg-black z-0"
        >
          <source
            src="https://res.cloudinary.com/dlbgabdi1/video/upload/v1754237150/mores_cover_azmxmb.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center z-10">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to <span className="text-[#FFCCBC]">Mores</span>
            </h1>
            <p className="text-lg md:text-2xl mb-6">
              Discover luxury beauty experiences like never before.
            </p>
            
          </div>
        </div>
      </div>

      <StatsSection />

      {/* Services Section */}
      <Services />

    

      {/* Carousel Section */}
      <ImageCarousel />
    </div>
  );
};

export default Home;
