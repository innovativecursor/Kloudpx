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

  const colorCycle = ["bg-purple-500", "bg-white", "bg-green-400"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-white/10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6"
      >
        <Image
          src="/assets/logo.webp"
          alt="Loading..."
          width={120}
          height={120}
        />

        {/* Animated Color-Changing Dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className={`w-3 h-3 rounded-full ${
                colorCycle[i % colorCycle.length]
              }`}
              animate={{
                y: ["0%", "-40%", "0%"],
                backgroundColor: [
                  "#9333ea", // purple
                  "#ffffff", // white
                  "#34d399", // green
                ],
              }}
              transition={{
                ...bounceTransition,
                backgroundColor: {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: i * 0.2,
                },
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
