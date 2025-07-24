      {/* Thumbnail Swiper */}
      <div className="mt-6 relative">
        <div className="flex items-center justify-between px-2">
          <button
            className="bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center z-10"
            id="thumb-prev"
          >
            <i className="ri-arrow-left-s-line text-xl"></i>
          </button>

          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            watchSlidesProgress
            navigation={{
              nextEl: "#thumb-next",
              prevEl: "#thumb-prev",
            }}
            modules={[Navigation, Thumbs]}
            breakpoints={{
              0: {
                slidesPerView: 3,
              },
              640: {
                slidesPerView: 4,
              },
            }}
            className="w-full mx-2"
          >
            {safeImages.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img || fallbackImage}
                  alt={`thumb-${index}`}
                  className="w-[200px] h-[80px] object-contain p-1 bg-white cursor-pointer rounded-md border border-[#0070ba] transition-all duration-300"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            className="bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center z-10"
            id="thumb-next"
          >
            <i className="ri-arrow-right-s-line text-xl"></i>
          </button>
        </div>
      </div>