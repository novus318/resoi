'use client'
import React, { useRef, useState } from 'react'
import ButtonMenu from './ui/ButtonMenu'
import { XIcon } from 'lucide-react'
import FaqUtils from '../../data/FaqUtils.json';
import { motion, useInView } from 'framer-motion';


const FaqSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '0px 0px -200px 0px' });  
    const [faqFood, setFaqFood] = useState(true);
    const [faqDelivery, setFaqDelivery] = useState(false);
  
    const handleFaqFood = () => {
      setFaqFood(true);
      setFaqDelivery(false);
    };
  
    const handleFaqDelivery = () => {
      setFaqFood(false);
      setFaqDelivery(true);
    };

  return (
   <>
    <motion.section
        ref={ref}
        className="flex flex-col lg:flex-row w-full gap-10 my-10 items-center"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="lg:w-6/12 w-full flex justify-center faq-pattern relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          >
            <img
              src="/img/banner2.png"
              alt="FAQ Image"
              className="object-cover"
            />
          </motion.div>
        </div>
        <div className="lg:w-5/12 md:w-8/12 w-full flex flex-col lg:items-start items-center">
          <motion.h1
            className="text-primary text-5xl text-center lg:text-left font-bold my-5"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            Order online with our simple checkout.
          </motion.h1>
          <motion.p
            className="text-paragraf text-lg leading-normal lg:text-left text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
          >
            Experience the rich culinary heritage of South India at Malabar Resoi. Explore our menu and place your order effortlessly using our seamless online system.
          </motion.p>
        </div>
      </motion.section>

      <motion.section
        className="w-full mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
      >
        <div className="w-10/12 md:w-full flex flex-col md:flex-row justify-center mx-auto md:gap-10 gap-3 my-5">
          <ButtonMenu
            onClick={handleFaqFood}
            className={`${faqFood && 'bg-primary bg-button-wave text-white border-none transition-colors'}`}
          >
            Our Food
          </ButtonMenu>
          <ButtonMenu
            onClick={handleFaqDelivery}
            className={`${faqDelivery && 'bg-primary bg-button-wave text-white border-none transition-colors'}`}
          >
            Our Delivery
          </ButtonMenu>
        </div>

        {faqFood && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <FAQ type="food" />
          </motion.div>
        )}

        {faqDelivery && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <FAQ type="delivery" />
          </motion.div>
        )}
      </motion.section>
    </>
  )
}


interface FAQProps {
    type: keyof typeof FaqUtils;
  }
  

  const FAQ: React.FC<FAQProps> = ({ type }) => {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const faqs = FaqUtils[type];
  
    const handleFaqClick = (id: number) => {
      setExpandedId(id === expandedId ? null : id);
    };
  
    return (
      <div className="w-full mx-auto">
        {faqs.map((faq) => {
          const isExpanded = faq.id === expandedId;
          return (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              key={faq.id}
              className="md:w-10/12 w-full mx-auto bg-white cursor-pointer"
              onClick={() => handleFaqClick(faq.id)}>
              <div className="flex justify-between items-center border-b">
                <h1 className="text-primary font-semibold text-lg py-4">{faq.question}</h1>
                <XIcon
                  className={`md:text-2xl text-lg shrink-0 text-paragraf transition-transform duration-300 ease-in ${
                    isExpanded ? '' : 'rotate-45'
                  }`}
                />
              </div>
              <div
                className={`overflow-hidden transition-[max-height] duration-300 ease-in ${
                  isExpanded ? 'max-h-40' : 'max-h-0'
                }`}>
                <p className="text-xs md:text-base py-2 ">{faq.answer}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

export default FaqSection
