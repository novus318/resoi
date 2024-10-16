'use client'
import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';

const StepSection = () => {
  const steps = [
    {
      src: '/img/step1.png',
      title: 'Scan the QR Code',
      text: 'Use your smartphone to scan the QR code on the table and instantly access our full menu.',
    },
    {
      src: '/img/step3.png',
      title: 'Select Your Order',
      text: 'Browse through the menu, select your favorite dishes, and add them to your cart.',
    },
    {
      src: '/img/step2.png',
      title: 'Confirm Your Order',
      text: 'Review your order and confirm it. Our kitchen will immediately start preparing your meal.',
    },
    {
      src: '/img/step4.png',
      title: 'Checkout and Pay',
      text: 'When you’re done, checkout. We accept online payments or cash at the table.',
    },
  ];

  return (
    <section className="w-full">
      <div className="w-full mx-auto my-8">
        <h1 className="text-center md:text-[55px] text-[42px] text-primary font-bold">How it works.</h1>
      </div>
      <div className="flex justify-center lg:gap-16 md:gap-10 gap-20 lg:flex-row flex-col items-center">
        {steps.map(({ src, title, text }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, translateY: 10 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }} // Delay for staggered effect
            className="flex lg:w-3/12 md:w-10/12 w-full flex-col items-center"
          >
            <Image src={src} alt={title} quality={60} width={350} height={350} className="w-auto h-auto max-h-[380px]" />
            <div className="w-11/12 lg:w-full md:w-8/12">
              <h2 className="font-bold my-3 text-[22px] text-heading text-center">{title}</h2>
              <p className="text-paragraf mx-auto text-lg leading-normal text-center">{text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StepSection;
