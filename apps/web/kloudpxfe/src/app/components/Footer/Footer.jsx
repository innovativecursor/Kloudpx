import Link from "next/link";
import logo from "@/assets/quiksie-logo.svg";

function Footer() {
  return (
    <footer className="bg-[#394150] text-gray-300 pt-12">
      {/* Main content section */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* Logo and address */}
          <div className="mb-8 md:mb-0">
            <img src={logo} alt="Quiksie Logo" className="w-56 mb-4" />
            <div className="text-gray-400 text-sm">
              <p className="mb-1">Quiksie</p>
              <p className="mb-1">01, Bldg No.69, Madhav Complex CHS Ltd.,</p>
              <p className="mb-1">Shanti Park, Mira Road East,</p>
              <p className="mb-1">Thane, India - 401107</p>
              <div className="h-4"></div>
              <p>CIN: U74900MH2007PTC170818</p>
            </div>
          </div>

          {/* Policies */}
          <div className="mb-8 md:mb-0">
            <h5 className="text-white text-lg font-medium mb-4">Policies</h5>
            <ul className="space-y-2">
              {[
                { href: "/terms/", text: "Terms of Use" },
                { href: "/privacy-policy/", text: "Privacy Policy" },
                { href: "/shipping-policy/", text: "Shipping Policy" },
                { href: "/returns/", text: "Cancellation & Returns" },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div className="mb-8 md:mb-0">
            <h5 className="text-white text-lg font-medium mb-4">Links</h5>
            <ul className="space-y-2">
              {[
                { href: "/about/", text: "About Us" },
                { href: "/contact/", text: "Contact Us" },
                { href: "/blog/", text: "Blog", target: "_blank" },
                { href: "/sitemap/", text: "Sitemap" },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                    target={item.target || ""}
                    rel={item.target ? "noopener noreferrer" : ""}
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-white text-lg font-medium mb-4">Categories</h5>
            <ul className="space-y-2">
              {[
                { href: "/electronics/", text: "Electronics" },
                { href: "/home-garden/", text: "Home & Garden" },
                { href: "/appliances/", text: "Appliances" },
                { href: "/tools/", text: "Tools" },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Category links */}
        <div className="border-t border-gray-700 py-8">
          <div className="grid grid-cols-1 gap-4 text-center">
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              {[
                "Air Conditioners",
                "Audios & Theaters",
                "Car Electronics",
                "Office Electronics",
                "TV Televisions",
                "Washing Machines",
              ].map((item, index) => (
                <Link
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3 text-sm">
              {[
                "Cookware",
                "Decoration",
                "Furniture",
                "Garden Tools",
                "Garden Equipments",
                "Powers And Hand Tools",
                "Utensil & Gadget Printers",
                "Projectors Scanners",
                "Store & Business",
              ].map((item, index) => (
                <Link
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3 text-sm">
              {[
                "4K Ultra HD TVs",
                "LED TVs",
                "OLED TVs",
                "Desktop PC",
                "Laptop",
                "Smartphones",
                "Tablet",
                "Game Controller",
                "Audio & Video",
                "Wireless Speaker",
                "Drone",
              ].map((item, index) => (
                <Link
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* App download section */}
        <div className="py-8 text-center">
          <h4 className="text-white text-lg mb-4">
            <span>Download The App - Get 30% Sale Coupon</span>
          </h4>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="https://apps.apple.com/in/app/roadbee-app/id6474824672"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://cms.myzow.in/images/app-store-link.jpg"
                alt="App Store"
                className="w-44 h-auto"
              />
            </Link>
            <Link
              href="https://play.google.com/store/search?q=roadbee&amp;c=apps&amp;hl=en-IN"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://cms.myzow.in/images/play-store-link.jpg"
                alt="Play Store"
                className="w-44 h-auto"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright section */}
      <div className="bg-black bg-opacity-30 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 Quiksie. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm flex items-center">
              Designed and Developed by{" "}
              <Link
                href="https://www.innovativecursor.com/"
                className="text-white hover:text-gray-300 transition-colors flex items-center ml-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://www.innovativecursor.com/_next/static/media/inno_cursor_white.3615c4ec.svg"
                  alt="Innovative Cursor Logo"
                  className="w-5 h-5 ml-1 mr-1"
                />
                Innovative Cursor
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
