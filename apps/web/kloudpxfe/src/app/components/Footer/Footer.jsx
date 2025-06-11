function Footer() {
  return (
    <footer className="mt-2 md:mt-14">

      <div className="grid sm:grid-cols-3 grid-cols-1 gap-7 responsive-mx sm:pb-10 pb-6">
        <div className="">
          <div className="flex items-center gap-2">
            <img
              src="/assets/logo.webp"
              alt="Upload"
              className="object-contain max-w-[25%]"
            />
            <p className="font-bold md:text-2xl text-xl tracking-wide">Kloud Pharma</p>
          </div>
          <p className="text-[10px] mt-4 font-medium opacity-60 tracking-wide">Ground Floor emerald jade green building, #282 EDSA, Highway Hills, City Of Mandaluyong, Second District, NCR, 1550 Philippines.</p>
          <p className="mt-5 underline text-[10px] font-medium opacity-70 tracking-wide">Shop On Map</p>
          <div className="flex items-center gap-2 mt-8 cursor-pointer">
            <div className="border border-[#0070BA] rounded-full w-5 h-5 flex justify-around items-center">
              <i className="text-xs ri-facebook-circle-fill text-color"></i>
            </div>
            <div className="border border-[#0070BA] rounded-full w-5 h-5 flex justify-around items-center">
              <i className="text-xs ri-whatsapp-line text-color"></i>
            </div>
            <div className="border border-[#0070BA] rounded-full w-5 h-5 flex justify-around items-center">
              <i className="text-xs ri-instagram-line text-color"></i>
            </div>
            <div className="border border-[#0070BA] rounded-full w-5 h-5 flex justify-around items-center">
              <i className="text-xs ri-linkedin-fill text-color"></i>
            </div>
            <div className="border border-[#0070BA] rounded-full w-5 h-5 flex justify-around items-center">
              <i className="text-xs ri-twitter-x-fill text-color"></i>
            </div>
          </div>
        </div>

        <div className=" tracking-wide flex items-stretch">
          <div className="sm:w-px w-0 bg-gray-100"></div>
          <div className="sm:px-8 sm:py-6 sm:flex-1">
            <p className="font-semibold text-color text-xs">NeeD Help</p>
            <p className="text-color mt-5 font-semibold md:text-2xl">+63-2-87728133</p>
            <p className="mt-1 font-semibold text-color md:text-2xl">+63-2-87728133</p>
            <p className="mt-4 text-[10px] font-normal">Monday - Friday: 8:00 am - 5:00 pm</p>
            <p className="mt-2 text-[10px] font-normal">Saturday - Sunday: Closed</p>
            <div className="flex items-center gap-2 mt-6 text-color font-semibold text-xs">
              <i className="ri-mail-send-line text-base font-light"></i>kloudpx@kloudpx.com
            </div>
          </div>
          <div className="sm:w-px w-0 bg-gray-100"></div>
        </div>

        <div className="tracking-wide flex justify-between items-start">
          <div className="flex flex-col text-xs">
            <h1 className="text-color font-semibold ">Quick Links</h1>
            <ul className="mt-4 text-[10px] space-y-5 font-normal">
              <li>Home</li>
              <li>About Us</li>
              <li>Shop Products</li>
              <li>Blog/ Health Tips</li>
              <li>Contact Us</li>
              <li>FAQS</li>
            </ul>
          </div>
          <div className="flex flex-col text-xs">
            <h1 className="text-color font-semibold ">Legal</h1>
            <ul className="mt-4 text-[10px] space-y-5 font-normal">
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
              <li>Return & Refund Policy</li>
              <li>Prescription Policy</li>
            </ul>
          </div>
        </div>
      </div>

      <hr className="border-b border-gray-200" />
      <div className="flex-between-center items-center responsive-mx sm:my-6 my-3">
        <p className="sm:text-[10px] text-[8px]  font-medium tracking-wider opacity-60">Copyright © 2025 KLOUD P&X - All Rights Reserved. </p>
        <div className=" flex justify-end">
          <img
            src="/assets/visa.png"
            alt="Upload"
            className="object-contain sm:max-w-[70%] max-w-[50%]"
          />

        </div>
      </div>

    </footer>
  );
}

export default Footer;













