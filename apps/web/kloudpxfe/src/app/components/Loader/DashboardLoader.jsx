"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function DashboardLoading() {
  const bounceTransition = {
    y: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-transparent">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <Image
          src="/assets/logo.webp"
          alt="Loading..."
          width={100}
          height={100}
          priority
        />

        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-3 h-3 rounded-full bg-[#0070BA]"
              animate={{ y: ["0%", "-40%", "0%"] }}
              transition={{
                ...bounceTransition,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
