import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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

const Gallery = () => {
  const [selectedIdx, setSelectedIdx] = useState(null);

  const openModal = (idx) => setSelectedIdx(idx);
  const closeModal = () => setSelectedIdx(null);
  const nextImage = () => setSelectedIdx((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setSelectedIdx((prev) => (prev - 1 + images.length) % images.length);

  return (
    <section className="py-16 px-6 md:px-20 bg-[#F5ECE3] text-[#5D4037]">
      <h2 className="text-3xl font-bold mb-10 mt-4 text-center">Trendings</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`gallery-${idx}`}
            onClick={() => openModal(idx)}
            className="cursor-pointer object-cover w-full h-48 rounded-md shadow hover:scale-105 transition-transform duration-300"
          />
        ))}
      </div>

      {/* Fullscreen Modal */}
      {selectedIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-red-500"
          >
            <X size={28} />
          </button>
          <button
            onClick={prevImage}
            className="absolute left-4 text-white bg-black/40 rounded-full p-2 hover:bg-white/10"
          >
            <ChevronLeft size={32} />
          </button>
          <img
            src={images[selectedIdx]}
            alt={`fullscreen-${selectedIdx}`}
            className="max-w-full max-h-[90vh] object-contain"
          />
          <button
            onClick={nextImage}
            className="absolute right-4 text-white bg-black/40 rounded-full p-2 hover:bg-white/10"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </section>
  );
};

export default Gallery;
