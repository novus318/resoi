import {  Instagram, Phone } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer
      className="w-full bg-pattern-footer bg-contain bg-left bg-no-repeat pt-10 lg:px-10 md:px-7 px-2"
      style={{ backgroundColor: 'rgba(249, 226, 204, 0.30)' }}
    >
      <div className="flex md:flex-row flex-col justify-between items-center w-full space-y-6 md:space-y-0">
        <div className="md:w-8/12 w-full flex flex-col">
          <div className="flex gap-3 items-center">
            <img src="/logobell.svg" alt="Logo Footer" className="h-8" />
          </div>
          <p className="text-paragraf text-base mt-2 text-center md:text-left">
          Taste the best of Kerala's culinary delights with dishes like Mandhi, Biriyani, Ghee Rice, Curries, Thali, Shawarma and so on at Malabar Resoi.
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <Link href="tel:+1234567890">
            <Phone className="text-primary" />
          </Link>
          <Link href="https://i" target="_blank">
            <Instagram className="text-primary" />
          </Link>
        </div>
      </div>

      <div className="w-full border-t mt-10 py-3 flex flex-col md:flex-row justify-between items-center">
        <p className="text-paragraf">
          Built by{' '}
          <Link href="https://www.winndeal.com" target="_blank" className="text-primary font-extrabold">
            WINNDEAL
          </Link>
        </p>

        <div className="flex space-x-4">
          <Link href="/privacy-policy" className="text-paragraf text-primary">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="text-paragraf text-primary">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
