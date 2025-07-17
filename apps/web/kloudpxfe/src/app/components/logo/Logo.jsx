import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <div className="w-[65px] sm:w-[80px] md:w-[130px]">
      <Link href="/">
        <Image
          src="/assets/logo.webp"
          alt="Company Logo"
          layout="responsive"
          width={120}
          height={70}
          // sizes="(max-width: 640px) 50px, (max-width: 768px) 80px, 120px"
        />
      </Link>
    </div>
  );
};

export default Logo;
