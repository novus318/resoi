'use client';
import React from 'react';
import Image from "next/legacy/image";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from './ui/button';

const Herosection = () => {
  return (
    <section className="bg-white flex flex-col lg:flex-row w-full mt-32 md:mb-32 items-center justify-between gap-10">
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col lg:items-start items-center lg:w-6/12 md:w-10/12 w-full lg:space-y-5 space-y-7">
      <h1 className="font-bold md:text-6xl text-5xl lg:text-left text-center">
      Authentic food & takeaway, <span className="text-primary">delivered</span> to your door.
      </h1>
      <p className="text-paragraf text-lg lg:text-base lg:text-left text-center leading-snug">
        Welcome to Malabar Resoi, a place where deliciousness meets comfort! Enjoy a warm and friendly atmosphere
        while enjoying delicious dishes from our kitchen.
      </p>
      <Link href="/order">
        <Button className="bg-button-wave bg-primary text-white">Place an Order</Button>
      </Link>
      <div className="mx-auto lg:mx-0">
        <p className="text-heading">
          <span className="text-primary pl-1">4.8 out of 5</span> based on 2000+ reviews
        </p>
      </div>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}>
      <Image
        src="/img/banner.png"
        alt="Hero Image"
        width={500}
        height={500}
        className="rounded-tl-[96px] rounded-bl-3xl rounded-r-lg "
      />
    </motion.div>
  </section>
  )
}

export default Herosection
