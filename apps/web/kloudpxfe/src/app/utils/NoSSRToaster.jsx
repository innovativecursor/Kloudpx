"use client";

import dynamic from "next/dynamic";
const CustomToaster = dynamic(() => import("./CustomToaster"), {
  ssr: false,
});

export default CustomToaster;
