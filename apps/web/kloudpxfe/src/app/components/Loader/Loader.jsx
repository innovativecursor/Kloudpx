// "use client";
// import { useSelector } from "react-redux";

// const Loader = () => {
//   const loading = useSelector((state) => state.loadingReducer.loading);

//   if (!loading) return null;

//   return (
//     <div className="fixed inset-0 z-[999] bg-black/30 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
//       <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-white"></div>

//       <p className="text-white text-sm font-medium select-none">
//         Powered by <span className="font-semibold">Innovative Cursor</span>
//       </p>
//     </div>
//   );
// };

// export default Loader;

"use client";
import { useSelector } from "react-redux";
import Image from "next/image";

const Loader = () => {
  const loading = useSelector((state) => state.loadingReducer.loading);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/30 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-white relative flex items-center justify-center">
        <div className="w-8 h-8">
          <Image
            src="/assets/logo.webp"
            alt="Logo"
            layout="responsive"
            width={32}
            height={32}
            priority
          />
        </div>
      </div>

      {/* Text */}
      <p className="text-white text-sm font-medium select-none">
        Powered by <span className="font-semibold">Innovative Cursor</span>
      </p>
    </div>
  );
};

export default Loader;
