'use client'
import React from 'react'
import {
    Drawer,
    DrawerContent,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

const CashPayAtCounter = ({ isOpen, onClose,orderId }:any) => {
  const router =useRouter()
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm p-2">
          <DrawerTitle className='mb-2'>
            Please pay at the Cash Counter
          </DrawerTitle>
          <Button className='w-full mt-4' onClick={()=> router.push(`/table/paymentConfirm/${orderId}`)}>
            Done
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default CashPayAtCounter
