import React from "react";

const services = [
  {
    name: "Hair Styling",
    description: "Trendy cuts, colors, and styles for all occasions.",
    image: "https://res.cloudinary.com/dlbgabdi1/image/upload/v1754237416/hair_k0sxum.jpg",
  },
  {
    name: "Skin Care",
    description: "Facials, clean-ups, and rejuvenation treatments.",
    image: "https://res.cloudinary.com/dlbgabdi1/image/upload/v1754237378/facial_qgesi9.jpg",
  },
  {
    name: "Makeup",
    description: "Bridal, party, and everyday glam looks.",
    image: "https://res.cloudinary.com/dlbgabdi1/image/upload/v1754237408/image1_jm1r6b.jpg",
  },
  {
    name: "Bridal Makeup",
    description: "Elegant looks for your special day.",
    image: "https://res.cloudinary.com/dlbgabdi1/image/upload/v1754237410/image3_pgvtob.jpg",
  },
  {
    name: "Hair Treatments",
    description: "Repair, smoothen, and nourish your hair.",
    image: "https://res.cloudinary.com/dlbgabdi1/image/upload/v1754237416/hair_k0sxum.jpg", // can change this if needed
  },
];

const Services = () => {
  return (
    <section className="py-16 px-6 md:px-20 bg-gradient-to-r from-blue-50 via-white to-pink-50 text-[#3c2f2f]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold">Our Services</h2>
          <p className="text-gray-600 mt-2">Professional salon treatments tailored for you</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <article
              key={index}
              className="relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-400 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="relative h-56">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-2 bg-white/90 text-sm text-gray-800 px-3 py-1 rounded-full font-medium shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Popular
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11a.75.75 0 00-1.5 0v3.5c0 .414.336.75.75.75h2.5a.75.75 0 000-1.5H10V7z" clipRule="evenodd" />
                    </svg>
                    45m
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 flex items-center justify-between">
                  <span>{service.name}</span>
                  <span className="text-sm text-gray-500">₹499</span>
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-yellow-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.945a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.945c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.84-.197-1.54-1.118l1.286-3.945a1 1 0 00-.364-1.118L2.075 9.372c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69L9.05 2.927z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.945a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.945c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.84-.197-1.54-1.118l1.286-3.945a1 1 0 00-.364-1.118L2.075 9.372c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69L9.05 2.927z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.945a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.945c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.84-.197-1.54-1.118l1.286-3.945a1 1 0 00-.364-1.118L2.075 9.372c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69L9.05 2.927z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500">4.8 (120)</span>
                  </div>

                  <button className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg shadow">
                    Book Now
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
