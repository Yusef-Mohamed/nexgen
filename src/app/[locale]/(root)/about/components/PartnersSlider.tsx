"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const PartnersSlider = () => {
  const logos = [
    { id: 1, alt: "Company 1", src: "/images/partners/1.png" },
    { id: 2, alt: "Company 2", src: "/images/partners/2.png" },
  ];
  const duplicatedLogos = [
    ...logos,
    ...logos,
    ...logos,
    ...logos,
    ...logos,
    ...logos,
    ...logos,
    ...logos,
  ];

  return (
    <div className="w-full overflow-hidden ">
      <motion.div
        className="relative flex w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <div className="flex">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-8 bg-white rounded-full w-fit aspect-square"
            >
              <Image src={logo.src} alt={logo.alt} width={100} height={100} />
            </div>
          ))}
        </div>
        <div className="absolute right-0 flex w-full translate-x-full">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-8 bg-white rounded-full w-fit aspect-square"
            >
              <Image src={logo.src} alt={logo.alt} width={100} height={100} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PartnersSlider;
