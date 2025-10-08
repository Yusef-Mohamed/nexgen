"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const InstructorStories: React.FC = () => {
  const text = useTranslations("instructorPage.stories");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Ahmed Kamel",
      title: "Product Design@Google",
      image: "/images/instructor-landing.png",
      quote: text("testimonial1.quote"),
      rating: 5,
    },
    {
      name: "Sarah Johnson",
      title: "Senior Developer@Microsoft",
      image: "/images/instructor-landing.png",
      quote: text("testimonial2.quote"),
      rating: 5,
    },
    {
      name: "Mohamed Ali",
      title: "UX Designer@Apple",
      image: "/images/instructor-landing.png",
      quote: text("testimonial3.quote"),
      rating: 5,
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const current = testimonials[currentTestimonial];

  return (
    <section className="container secPadding">
      <div className="text-center lg:mb-20 mb-8 sm:mb-12 md:mb-16">
        <h5 className="mb-4">{text("subtitle")}</h5>
        <h2 className="">{text("heading")}</h2>
      </div>

      <div className="relative">
        <div className="grid items-center lg:grid-cols-2 gap-8 md:gap-20">
          <Image
            src={current.image}
            alt={current.name}
            width={600}
            height={600}
            className="w-full aspect-square object-cover rounded-2xl"
          />

          {/* Content */}
          <div className="sm:space-y-8 space-y-6">
            {/* Rating */}
            <div className="flex">
              {[...Array(current.rating)].map((_, i) => (
                <svg
                  key={i}
                  className="w-6 h-6 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-text-3">
              &ldquo;{current.quote}&rdquo;
            </blockquote>

            {/* Author */}
            <div>
              <p className="font-semibold">{current.name}</p>
              <p className="text-text-2">{current.title}</p>
            </div>
          </div>
        </div>

        {/* Navigation - Bottom Left Dots */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentTestimonial ? "bg-gray-900" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Navigation - Bottom Right Arrows */}
          <div className="flex gap-2">
            <button
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
            >
              <FiChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
            >
              <FiChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorStories;
