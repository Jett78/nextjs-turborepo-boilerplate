"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TestimonialCard from "../cards/testimonial-card";
import { useRef } from "react";
import { Testimonial } from "@/types/testimonial";

const TestimonialSlider = ({
  testimonials,
}: {
  testimonials: Testimonial[];
}) => {
  const sliderRef = useRef<Slider | null>(null);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 1500,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: false,
    arrows: false,
    centerMode: true,
    centerPadding: "0px",
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1,
          centerMode: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerMode: true,
        },
      },
    ],
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  return (
    <div className="relative">
      <Slider {...settings} ref={sliderRef}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className="my-4 px-3">
            <TestimonialCard testimonial={testimonial} />
          </div>
        ))}
      </Slider>

      <div className="absolute top-1/2 left-0 z-10 -translate-y-1/2">
        <button
          onClick={handlePrev}
          className="bg-primarymain/60 hover:bg-primarymain/80 cursor-pointer rounded-full border border-white/20 p-3 text-white shadow-sm transition-all duration-300 ease-in-out hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m14 7l-5 5m0 0l5 5"
            />
          </svg>
        </button>
      </div>
      <div className="absolute top-1/2 right-0 z-10 -translate-y-1/2">
        <button
          onClick={handleNext}
          className="bg-primarymain/60 hover:bg-primarymain/80 cursor-pointer rounded-full border border-white/20 p-3 text-white shadow-sm transition-all duration-300 ease-in-out hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m10 17l5-5l-5-5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TestimonialSlider;
