"use client";
import Link from "next/link";
function Footer() {
  return (
    <footer className="mt-8 sm:mt-16">
      <div className="responsive-mx">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src="/assets/logo.webp"
              alt="Upload"
              className="object-contain max-w-[20%]"
            />
            <h2 className="font-bold lg:text-3xl md:text-2xl text-xl tracking-wide">
              Kloud Pharma
            </h2>
          </div>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-1 gap-7 responsive-mx sm:pb-10 pb-6">
        <div className="">
          <h1 className="text-[10px] mt-4 font-medium opacity-60 tracking-wide">
            Unit B, Emerald Jade Green Building, 282 Epifanio de los Santos Ave,
            Mandaluyong City, 1550 Metro Manila, Philippines
          </h1>

          <div className="w-full mt-4" style={{ height: "200px" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.410933793691!2d121.04991531509362!3d14.579738079658887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c83f60179b4f%3A0x4146deeab6e6d285!2sEmerald%20Jade%20Green%20Building!5e0!3m2!1sen!2sph!4v1691089012345!5m2!1sen!2sph"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Emerald Jade Green Building Location"
            ></iframe>
          </div>
        </div>

        <div className=" tracking-wide flex items-stretch">
          <div className="sm:w-px w-0 bg-gray-100"></div>
          <div className="md:px-8 sm:py-0 sm:flex-1">
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
            <div className="flex items-center gap-2 mt-4 cursor-pointer">
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
          <div className="md:w-px w-0 bg-gray-00"></div>
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
              <li>
                <Link href="/Products" className="hover:underline">
                  Shop Products
                </Link>
              </li>
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
      <div className="flex-between-center items-center responsive-mx md:pb-0 pb-2 sm:my-5 my-3">
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

          <p className="sm:text-[4px] text-[3px] opacity-30">V1.3.8</p>

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
