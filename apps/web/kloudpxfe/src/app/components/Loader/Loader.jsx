"use client";
import { useSelector } from "react-redux";
import Image from "next/image";

const Loader = () => {
  const loading = useSelector((state) => state.loadingReducer.loading);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center space-y-2">
      <div className="md:w-24 w-20 animate-pulse">
        <Image
          src="/assets/logo.webp"
          alt="Logo"
          layout="responsive"
          width={32}
          height={32}
          priority
        />
      </div>

      <div className="flex space-x-2 mt-2">
        <span className="sm:w-3 sm:h-3 w-2 h-2 bg-white rounded-full animate-loaderDots [animation-delay:-0.3s]"></span>
        <span className="sm:w-3 sm:h-3 w-2 h-2 bg-white rounded-full animate-loaderDots [animation-delay:-0.15s]"></span>
        <span className="sm:w-3 sm:h-3 w-2 h-2 bg-white rounded-full animate-loaderDots"></span>
      </div>

      <style jsx>{`
        @keyframes loaderDots {
          0%,
          80%,
          100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.3);
            opacity: 1;
          }
        }

        .animate-loaderDots {
          animation: loaderDots 1s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Loader;
