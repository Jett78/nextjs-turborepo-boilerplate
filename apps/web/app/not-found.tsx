import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";
import PrimaryButton from "@/components/ui/primary-button";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-secondarymain/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="relative">
            <Image
              src="/404.png"
              alt="404 Page Not Found"
              width={280}
              height={280}
              className="drop-shadow-xl"
              priority
            />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-7xl font-black text-secondarymain tracking-tight">
            404
          </h1>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Page Not Found
          </h2>
          <p className="text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
            Oops! The page you&apos;re looking for doesn&apos; exist or has been moved.
            Let&apos;s get you back on track.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <PrimaryButton
            text="Back to Home"
            path="/"
            className="w-full justify-center py-4 flex items-center gap-2"
          />

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-100 text-gray-600 font-bold hover:border-secondarymain hover:text-secondarymain transition-all text-sm"
            >
              <Home size={18} />
              Home
            </Link>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
