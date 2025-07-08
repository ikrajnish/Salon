import React from "react";
import coverVideo from "../assets/mores_cover.mp4"; // ✅ Your import is fine

const Home = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* ✅ Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src={coverVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* ✅ Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-opacity-40 flex items-center justify-center z-10">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Mores</h1>
          <p className="text-lg md:text-2xl mb-6">Discover luxury beauty experiences like never before.</p>
          <button className="px-6 py-3 bg-[#8D6E63] hover:bg-[#5D4037] text-white rounded-full shadow-lg transition duration-300">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
