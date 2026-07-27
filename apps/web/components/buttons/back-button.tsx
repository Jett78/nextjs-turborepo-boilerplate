"use client";

import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();

  const handleBackButton = () => {
    router.back();
  };

  return (
    <button
      onClick={handleBackButton}
      className="flex items-center gap-2 hover:scale-105 ease-in-out duration-200 cursor-pointer hover:text-primary"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
        />
      </svg>
      <span className="text-sm text-primarymain">Go Back</span>
    </button>
  );
};

export default BackButton;
