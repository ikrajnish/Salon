import React, { useState, useEffect } from "react";

// Import images
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.jpg";

const images = [image1, image4, image2, image3];

const ImageCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full aspect-[3/2] relative overflow-hidden bg-black">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`slide-${idx}`}
          className={`w-full h-full object-contain absolute top-0 left-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      ))}
    </div>
  );
};

export default ImageCarousel;
