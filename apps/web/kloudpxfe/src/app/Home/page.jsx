"use client";
import Hero from "@/app/components/Hero/Hero";
import Products from "@/app/components/Products/Products";
import HomeFloatingBtn from "@/app/components/HomeFloatingBtn/HomeFloatingBtn";

function Home() {
  return (
    <div className="homepage">
      <div className="mt-40 md:mt-64 sm:mt-48">
        <Hero />
      </div>

      <Products />
      <HomeFloatingBtn />
    </div>
  );
}

export default Home;
