"use client";
import Link from "next/link";
function Footer() {
  return (
    <footer className="mt-8 sm:mt-16">
      <div className="grid sm:grid-cols-3 grid-cols-1 gap-7 responsive-mx sm:pb-10 pb-6">
        <div className="">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img
                src="/assets/logo.webp"
                alt="Upload"
                className="object-contain max-w-[25%]"
              />
              <h2 className="font-bold md:text-2xl text-xl tracking-wide">
                Kloud Pharma
              </h2>
            </div>
          </Link>
          <h1 className="text-[10px] mt-4 font-medium opacity-60 tracking-wide">
            Unit B, Emerald Jade Green Building, 282 Epifanio de los Santos Ave,
            Mandaluyong City, 1550 Metro Manila, Philippines
          </h1>
          <a
            href="https://maps.app.goo.gl/QZdyqMRUBCszKHE17"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="mt-5 underline text-[10px] font-medium opacity-70 tracking-wide">
              Shop On Map
            </h2>
          </a>
          <div className="flex items-center gap-2 mt-8 cursor-pointer">
            <a
              href="https://www.facebook.com/p/Kloud-Pharma-and-Exchange-Inc-61570477360673/"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#0070BA] rounded-full w-5 h-5 flex justify-center items-center"
            >
              <i className="ri-facebook-fill text-color text-xs"></i>
            </a>

            <a
              href="https://ph.linkedin.com/in/kloud-house-873542159"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#0070BA] rounded-full w-5 h-5 flex justify-center items-center"
            >
              <i className="text-xs ri-linkedin-fill text-color"></i>
            </a>
          </div>
        </div>

        <div className=" tracking-wide flex items-stretch">
          <div className="sm:w-px w-0 bg-gray-100"></div>
          <div className="sm:px-8 sm:py-6 sm:flex-1">
            <h1 className="font-semibold text-color text-xs">NeeD Help</h1>
            <a
              href="tel:+639989721498"
              className="text-color mt-5 font-semibold md:text-lg block"
            >
              +639989721498
            </a>

            <h1 className="mt-4 text-[10px] font-normal">
              Monday - Friday: 8:00 am - 5:00 pm
            </h1>
            <h1 className="mt-2 text-[10px] font-normal">
              Saturday - Sunday: Closed
            </h1>
            <div className="flex items-center gap-2 mt-6 text-color font-semibold text-xs">
              <i className="ri-mail-send-line text-base font-light"></i>
              <a href="mailto:kloudpx@kloudpx.com" className="text-color">
                kloudpx@kloudpx.com
              </a>
            </div>
          </div>
          <div className="sm:w-px w-0 bg-gray-100"></div>
        </div>

        <div className="tracking-wide flex justify-between items-start">
          <div className="flex flex-col text-xs">
            <h1 className="text-color font-semibold ">Quick Links</h1>
            <ul className="mt-4 text-[10px] space-y-5 font-normal cursor-pointer">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>About Us</li>
              <li>Shop Products</li>
              <li>Blog/ Health Tips</li>
              <li>Contact Us</li>
              <li>
                <Link href="/Faq" className="hover:underline">
                  FAQS
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col text-xs">
            <h1 className="text-color font-semibold ">Legal</h1>
            <ul className="mt-4 text-[10px] space-y-5 font-normal cursor-pointer">
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
              <li>Return & Refund Policy</li>
              <li>Prescription Policy</li>
            </ul>
          </div>
        </div>
      </div>

      <hr className="border-b border-gray-200" />
      <div className="flex-between-center items-center responsive-mx md:pb-0 pb-12 sm:my-6 my-3">
        <h1 className="sm:text-[10px] text-[8px] cursor-pointer font-medium tracking-wider opacity-60">
          Copyright © 2025 KLOUD P&X - All Rights Reserved.{" "}
        </h1>

        <div className="md:block hidden">
          <a
            href="https://www.innovativecursor.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:text-[11px] text-[7px] cursor-pointer text-gray-500 mt-1 sm:mt-0 select-none hover:text-blue-600 transition"
          >
            Powered by <span className="font-semibold">Innovative Cursor</span>
          </a>
        </div>

        <div className=" flex flex-col items-end justify-end">
          <img
            src="/assets/visa.png"
            alt="Upload"
            className="object-contain cursor-pointer sm:max-w-[70%] max-w-[50%]"
          />
          <div className="md:hidden block">
            <a
              href="https://www.innovativecursor.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="sm:text-[11px] text-[7px] cursor-pointer text-gray-500 mt-1 sm:mt-0 select-none hover:text-blue-600 transition"
            >
              Powered by{" "}
              <span className="font-semibold">Innovative Cursor</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
