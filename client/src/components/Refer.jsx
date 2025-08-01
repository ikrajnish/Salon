import React, { useEffect, useState } from "react";
import { Gift, Users, BadgePercent } from "lucide-react";
import { Link } from "react-router-dom";

const Refer = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) {
      setUser(JSON.parse(u));
    }
  }, []);

  const benefits = [
    {
      icon: <Gift size={32} className="text-[#8D6E63]" />,
      title: "Welcome Discount",
      description: "Get 15%, 10%, and 5% off on your first 3 bookings.",
    },
    {
      icon: <Users size={32} className="text-[#8D6E63]" />,
      title: "Refer & Earn",
      description:
        "Refer friends and earn 3 discounted bookings after their first appointment.",
    },
    {
      icon: <BadgePercent size={32} className="text-[#8D6E63]" />,
      title: "Stack Discounts",
      description:
        "Enjoy referral discounts with service offers. Save more every time.",
    },
  ];

  return (
    <section className="py-16 px-6 md:px-20 bg-white text-[#5D4037]">
      <h2 className="text-3xl font-bold text-center mb-10">Referral Benefits</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6 border rounded-xl shadow hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
          >
            <div className="mb-4">{benefit.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
            <p className="text-sm">{benefit.description}</p>
          </div>
        ))}
      </div>

      {!user && (
        <div className="text-center mt-10">
          <Link to="/login">
            <button className="px-6 py-3 bg-[#8D6E63] hover:bg-[#5D4037] text-white rounded-full shadow-md transition-transform hover:scale-105 duration-300">
              Login to Refer & Earn
            </button>
          </Link>
        </div>
      )}
    </section>
  );
};

export default Refer;
