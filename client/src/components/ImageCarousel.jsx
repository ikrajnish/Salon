import React, { useState, useEffect } from "react";

const images = [
  "https://res.cloudinary.com/dlbgabdi1/image/upload/v1754237420/image4_calq0x.jpg",
  "https://res.cloudinary.com/dlbgabdi1/image/upload/v1754237413/image2_jhxq66.jpg",
  "https://res.cloudinary.com/dlbgabdi1/image/upload/v1754237410/image3_pgvtob.jpg",
  "https://res.cloudinary.com/dlbgabdi1/image/upload/v1754237408/image1_jm1r6b.jpg",
  "https://res.cloudinary.com/dlbgabdi1/image/upload/v1754237902/1752579574595_xkcvic.jpg",
  "https://res.cloudinary.com/dlbgabdi1/image/upload/v1754237905/1754212131603_oehyye.jpg",
  "https://res.cloudinary.com/dlbgabdi1/image/upload/v1754237912/1754212764372_t8fw40.jpg",
  "https://res.cloudinary.com/dlbgabdi1/image/upload/v1754237918/1754212642380_x7xc7c.jpg",
  "https://res.cloudinary.com/dlbgabdi1/image/upload/v1754237920/1752579711634_jocbb1.jpg",
  "https://res.cloudinary.com/dlbgabdi1/image/upload/v1754237921/1754212224080_1_on0ubr.jpg",
  "https://res.cloudinary.com/dlbgabdi1/image/upload/v1754237923/1752579919066_t8ad5o.jpg",
  "https://res.cloudinary.com/dlbgabdi1/image/upload/v1754237923/1752579804975_mf92wj.jpg",
];

const ImageCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* Blurred background */}
      <img
        src={images[current]}
        alt="blurred-bg"
        className="absolute inset-0 w-full h-full object-cover blur-md scale-110"
      />
      
      {/* Foreground focused image */}
      <img
        src={images[current]}
        alt={`slide-${current}`}
        className="relative z-10 h-full max-w-full object-contain mx-auto transition-opacity duration-1000 ease-in-out"
      />
    </div>
  );
};

export default ImageCarousel;
