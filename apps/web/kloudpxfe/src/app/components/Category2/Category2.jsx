import Link from "next/link";

function Category2() {
  return (
    <div className="py-12 bg-[#f5f6f9]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="#"
            className="block transition-transform duration-300 hover:scale-[1.02]"
          >
            <img
              className="w-full h-auto rounded-lg shadow-md"
              src="https://cdn11.bigcommerce.com/s-j3ehq026w9/content/site/home1/banner/1_6.jpg"
              alt="Offer 1"
            />
          </Link>

          <Link
            href="#"
            className="block transition-transform duration-300 hover:scale-[1.02]"
          >
            <img
              className="w-full h-auto rounded-lg shadow-md"
              src="https://cdn11.bigcommerce.com/s-j3ehq026w9/content/site/home1/banner/1_7.jpg"
              alt="Offer 2"
            />
          </Link>

          <Link
            href="#"
            className="block transition-transform duration-300 hover:scale-[1.02]"
          >
            <img
              className="w-full h-auto rounded-lg shadow-md"
              src="https://cdn11.bigcommerce.com/s-j3ehq026w9/content/site/home1/banner/1_8.jpg"
              alt="Offer 3"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Category2;
