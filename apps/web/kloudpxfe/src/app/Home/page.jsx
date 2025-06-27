"use client";
import Hero from "@/app/components/Hero/Hero";
import Products from "@/app/components/Products/Products";
import HomeFloatingBtn from "@/app/components/HomeFloatingBtn/HomeFloatingBtn";

function Home() {
  return (
    <div className="homepage">
      <Hero />
      <Products />
      <HomeFloatingBtn />
    </div>
  );
}

export default Home;
