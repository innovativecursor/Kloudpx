export default function SearchBar() {
  return (
    <div className="flex items-center w-full lg:max-w-4xl h-14  md:max-w-lg  sm:max-w-sm max-w-0 bg-[#0070ba]/7 rounded-full overflow-hidden mx-auto">
      <input
        type="text"
        placeholder="Search for products, categories or brands..."
        className="flex-grow px-6 md:py-4 py-2  bg-transparent text-sm text-gray-800 placeholder-gray-600 focus:outline-none placeholder:text-xs"
      />
      <button className="bg-[#006EBB] w-20 md:p-4 p-2">
        <i className="ri-search-line text-white text-2xl"></i>
      </button>
    </div>
  );
}
