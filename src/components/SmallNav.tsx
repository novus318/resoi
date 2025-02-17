import React from 'react'

const SmallNav = () => {
  return (
    <header className="w-full h-autopt-10">
    <nav className="w-full top-0 shadow z-40 fixed bg-white  lg:px-10 md:px-7 px-2 flex justify-between transition-all pt-3 pb-2">
      <div className="">
          <img
            src="/logobell.svg"
            alt="Logo"
            className='h-8'
          />
      </div>
    </nav>
  </header>
  )
}

export default SmallNav
