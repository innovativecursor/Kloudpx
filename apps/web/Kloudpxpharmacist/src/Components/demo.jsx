<div className="md:mt-6 mt-1 md:py-0 md:px-0 px-4">
  <div className="flex md:hidden justify-end">
    <button
      onClick={() => setIsOpen(false)}
      className=" text-gray-500 cursor-pointer hover:text-gray-900 font-bold"
    >
      ✕
    </button>
  </div>
  <p className="md:text-center text-start tracking-wider text-base mb-5 font-semibold dark-text">
    Would You Like To Upload A Prescription?
  </p>

  {Array.isArray(allPrescription) && allPrescription.length > 0 ? (
    <div className="flex items-center justify-center gap-2">
      {/* Swiper prev button */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className={`cursor-pointer py-2 px-4 md:block hidden rounded font-semibold ${
          activeIndex > 0
            ? " text-[#0070ba]"
            : " text-gray-500 cursor-not-allowed"
        }`}
        disabled={activeIndex === 0}
      >
        <i className="ri-arrow-left-s-fill text-3xl"></i>
      </button>

      <div className="flex-1 md:max-w-[80%] w-full">
        {/* Swiper for md and lg */}
        <div className="hidden md:block">
          <Swiper
            modules={[Navigation]}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            spaceBetween={10}
            slidesPerView={1}
            onSlideChange={handleSlideChange}
            breakpoints={{
              768: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              1024: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
            }}
          >
            {allPrescription.map(({ ID, UploadedImage }) => (
              <SwiperSlide key={ID} className="relative">
                <img
                  src={UploadedImage || fallbackImage}
                  alt="Prescription"
                  className="cursor-pointer w-full h-56 object-cover rounded-2xl shadow"
                  onClick={() => {
                    setSelectedPrescriptionId(ID);
                    handleSelectedPrescription(ID);
                  }}
                />
                {selectedPrescriptionId === ID && (
                  <div className="absolute top-2 right-2 bg-green-600 rounded-full w-8 h-8 flex items-center justify-center text-white text-xl font-bold pointer-events-none">
                    ✔
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="md:hidden h-64 sm:h-72 overflow-y-auto flex flex-col sm:gap-6 gap-4">
          {allPrescription.map(({ ID, UploadedImage }) => (
            <div
              key={ID}
              className="relative flex-shrink-0 cursor-pointer"
            >
              <img
                src={UploadedImage || fallbackImage}
                alt="Prescription"
                className="w-full h-32 sm:h-40 object-cover rounded-lg shadow"
                onClick={() => {
                  setSelectedPrescriptionId(ID);
                  handleSelectedPrescription(ID);
                }}
              />
              {selectedPrescriptionId === ID && (
                <div className="absolute top-2 right-2 bg-green-600 rounded-full w-8 h-8 flex items-center justify-center text-white text-xl font-bold pointer-events-none">
                  ✔
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Swiper next button */}
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className={`cursor-pointer py-2 px-4 rounded  md:block hidden font-semibold ${
          activeIndex < totalSlides - 1
            ? " text-[#0070ba]"
            : " text-gray-500 cursor-not-allowed"
        }`}
        disabled={activeIndex === totalSlides - 1}
      >
        <i className="ri-arrow-right-s-fill text-3xl"></i>
      </button>
    </div>
  ) : (
    // Jab koi prescription na ho to ye message show karo
    <div className="text-center py-10 text-gray-500 font-semibold text-lg">
      Please upload the prescription
    </div>
  )}
</div>
