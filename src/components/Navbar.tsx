'use client'
import { Menu, X } from 'lucide-react';
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { motion } from "framer-motion";
import axios from 'axios';

const Navbar = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [ok, setOk] = useState<boolean | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<any>(null);

  const checkAuth = async () => {
    const token = localStorage.getItem('userToken');
    if (token) {
        setOk(true);
    }else{
      setOk(false);
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
<>
<header className="w-full h-autopt-10">
    <nav className="w-full top-0 shadow z-40 fixed bg-white  lg:px-10 md:px-7 px-2 flex justify-between transition-all pt-2">
      <div className="flex justify-between w-full">
        <Link href={"/"}>
          <img
            src="/img/logo.svg"
            alt="Logo"
            className='h-14'
          />
        </Link>
     {ok && 
        <button
        className="text-primary"
        onClick={toggleMenu}
        aria-label="Toggle navigation"
      >
        {!isMenuOpen ? <Menu className="w-8 h-8" /> : <X className="w-8 h-8" />}
      </button>}
      </div>
    </nav>
  </header>
        <motion.div
        ref={menuRef}
        initial={{ x: "-100%" }}
        animate={{ x: isMenuOpen ? 0 : "-100%" }}
        transition={{ type: "tween", stiffness: 200 }}
        className="fixed top-0 left-0 w-1/2 md:w-1/6 h-full bg-primary-foreground z-30 shadow-lg"
      >
        <div className="flex justify-between items-center p-4">
          <Link href="/order">
            <img src="/img/logo.svg" alt="Logo" className="w-32" />
          </Link>
        </div>

        <ul className="flex flex-col items-start ps-10 space-y-4 font-bold mt-4">
          <li>
            <Link href="/order" className="uppercase hover:text-secondary-foreground" onClick={toggleMenu}>
            home
            </Link>
          </li>
          <li>
            <Link href="/order/viewAllOrders" className="uppercase hover:text-secondary-foreground" onClick={toggleMenu}>
            orders
            </Link>
          </li>
        </ul>
      </motion.div></>
  )
}

export default Navbar
