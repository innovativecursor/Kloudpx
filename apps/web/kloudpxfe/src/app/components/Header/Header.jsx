import React from 'react'
import Logo from '@/app/components/logo/Logo'
import SearchBar from '@/app/components/searchbar/SearchBar'
import TopItems from '@/app/components/topitems/TopItems'
import Hamburger from '@/app/components/modal/Hamburger'


const Header = () => {




  return (
    <div className=''>
      <div className='flex-between-center responsive-mx mt-3'>
        <div className='flex-between-center lg:w-[75%] sm:w-[75%] w-[45%]'>
          <Logo />
          <SearchBar />
        </div>
        <div className='flex-between-center sm:gap-6 gap-3'>
          <div className='font-semibold sm:text-sm text-xs'>Login/SignUp</div>
          <div className="flex gap-3 items-center text-color">
            <div className="relative">
              <i className="ri-heart-line text-xl font-medium"></i>
              <span className=" absolute -top-0 -right-1 text-[8px] bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center">
                0
              </span>
            </div>

            <div className="relative">
              <i className="ri-shopping-cart-line text-xl font-medium"></i>
              <span className=" absolute -top-0 -right-1 text-[8px] bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center">
                0
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-4'>
        <div className='flex-between-center  border-t border-b border-gray-200'>
          <div className='responsive-mx flex-between-center gap-6 '>
            <div className='w-[10%]'>
              <Hamburger />
            </div>
            <div className="w-[90%]">
              <TopItems />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Header