import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full bg-pattern-footer bg-contain bg-left bg-no-repeat pt-16 lg:px-10 md:px-7 px-2" style={{ backgroundColor: 'rgba(249, 226, 204, 0.30)' }}>
    <div className="flex md:flex-row flex-col space-y-10 md:space-x-0 lg:items-center justify-between w-full">
      <div className="md:w-8/12 w-full flex lg:flex-row flex-col">
        <div className="md:w-6/12 w-full flex flex-col">
          <div className="flex gap-3 items-center justify-center">
            <img src="/img/logo.svg" alt="Logo Footer" className='h-24' />
          </div>
          <p className="text-paragraf text-lg mt-2 md:text-left text-center">
            Welcome to our burger restaurant! We are a diner committed to serving unique and satisfying burgers.
          </p>
        </div>
      </div>
      <div className="md:w-4/12 w-full flex md:flex-row flex-col md:gap-24 gap-10 justify-center">
        <FooterList />
      </div>
    </div>
    <div className="w-full border-t mt-24 py-3 flex md:flex-row flex-col items-center">
      <p className="text-paragraf ">
        Built by{' '}
        <Link href="https://www.winndeal.com" target="_blank" className="text-primary">
          WINNDEAL
        </Link>{' '}
      </p>
    </div>
  </footer>
  )
}
const FooterList = () => {
    return (
      <>
        <div className="flex flex-col space-y-6">
          <h4 className="text-heading font-bold tracking-[0.3em]">MENU</h4>
          <p className="text-paragraf">Home</p>
          <p className="text-paragraf">Order</p>
          <p className="text-paragraf">FAQ</p>
          <p className="text-paragraf">Contact</p>
        </div>
        <div className="flex flex-col space-y-6">
          <h4 className="text-heading font-bold tracking-[0.3em]">STUDIO</h4>
          <p className="text-paragraf">Company</p>
          <p className="text-paragraf">Changelog</p>
          <p className="text-paragraf">Licence</p>
        </div>
      </>
    );
  };
export default Footer
