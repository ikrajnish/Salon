import React from "react";
import hairStyling from "../assets/hair.jpg";
import skincare from "../assets/facial.jpg";
import makeup from "../assets/image1.jpg";
import manicurePedicure from "../assets/image3.jpg";
import hairTreatment from "../assets/hair.jpg"; // Use a different image here

const services = [
  {
    name: "Hair Styling",
    description: "Trendy cuts, colors, and styles for all occasions.",
    image: hairStyling,
  },
  {
    name: "Skin Care",
    description: "Facials, clean-ups, and rejuvenation treatments.",
    image: skincare,
  },
  {
    name: "Makeup",
    description: "Bridal, party, and everyday glam looks.",
    image: makeup,
  },
  {
    name: "Bridal Makeup",
    description: "Elegant looks for your special day.",
    image: manicurePedicure,
  },
  {
    name: "Hair Treatments",
    description: "Repair, smoothen, and nourish your hair.",
    image: hairTreatment,
  },
];

const Services = () => {
  return (
    <section className="py-16 px-6 md:px-20 bg-[#F5ECE3] text-[#5D4037]">
      <h2 className="text-3xl font-bold mb-10 text-center">Our Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden transform hover:-translate-y-1 duration-300"
          >
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
              <p className="text-sm">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
