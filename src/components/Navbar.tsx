import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <header className="w-full h-autopt-10">
    <nav className="w-full top-0 shadow z-40 fixed bg-white  lg:px-10 md:px-7 px-2 flex justify-between transition-all pt-3">
      <div className="">
        <Link href={"/"}>
          <img
            src="/img/logo.svg"
            alt="Logo"
            className='h-16'
          />
        </Link>
      </div>
    </nav>
  </header>
  )
}

export default Navbar
