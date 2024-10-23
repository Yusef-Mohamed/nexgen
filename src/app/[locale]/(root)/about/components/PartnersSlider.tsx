"use client";

import Logo from "@/components/logo";
import { motion } from "framer-motion";
import React from "react";

const PartnersSlider = () => {
  const logos = [
    { id: 1, alt: "Company 1", src: "/images/logo1.png" },
    { id: 2, alt: "Company 2", src: "/images/logo2.png" },
    { id: 3, alt: "Company 3", src: "/images/logo3.png" },
    { id: 4, alt: "Company 4", src: "/images/logo4.png" },
    { id: 1, alt: "Company 1", src: "/images/logo1.png" },
    { id: 2, alt: "Company 2", src: "/images/logo2.png" },
    { id: 3, alt: "Company 3", src: "/images/logo3.png" },
    { id: 4, alt: "Company 4", src: "/images/logo4.png" },
    { id: 2, alt: "Company 2", src: "/images/logo2.png" },
    { id: 3, alt: "Company 3", src: "/images/logo3.png" },
    { id: 4, alt: "Company 4", src: "/images/logo4.png" },
  ];
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="w-full overflow-hidden ">
      <motion.div
        className="relative flex w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="flex">
          {duplicatedLogos.map((logo, index) => (
            <div key={index} className="flex-shrink-0 mx-8">
              <Logo size="sm" />
            </div>
          ))}
        </div>
        <div className="absolute right-0 flex w-full translate-x-full">
          {duplicatedLogos.map((logo, index) => (
            <div key={index} className="flex-shrink-0 mx-8">
              <Logo size="sm" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PartnersSlider;
