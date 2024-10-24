import { ArrowRight, ShoppingBasket } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const IfOrder = ({orderId}:any) => {
  return (
    <Link href={`/table/confirmedOrder/${orderId}`} className='fixed top-0 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-6xl'>
                    <div className="flex justify-between w-full rounded-t-none rounded-md  bg-secondary-foreground py-2 px-4 text-primary-foreground">
                        <div className='flex gap-2 items-center'>
                            <p className='font-bold text-sm'>VIEW CONFIRMED ORDER</p><ArrowRight className='animate-pulse'/>
                        </div>
                    </div>
                </Link>
  )
}

export default IfOrder
