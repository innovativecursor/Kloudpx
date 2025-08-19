"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Agar #anchor link hai to scroll na kare
    if (typeof window !== "undefined" && window.location.hash) return;

    window.scrollTo({ top: 0, behavior: "smooth" }); 
    // instant scroll chahiye to: window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
