'use client'
import React from 'react'
import {
    Drawer,
    DrawerContent,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const CashPayAtCounter = ({ isOpen, onClose,orderId }:any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router =useRouter()
  const handleCash = async() => {
    try{
      const response =await axios.post(`${apiUrl}/api/tableOrder/order-paymentMethod`,{
        orderId,
        paymentMethod: 'cash'
      })
      if(response.data.success){
        router.push(`/table/paymentConfirm/${orderId}`)
      }
    }catch(error:any){
      console.error(error)
      // handle error here
    }
  }
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm p-2">
          <DrawerTitle className='mb-2'>
            Please pay at the Cash Counter
          </DrawerTitle>
          <Button className='w-full mt-4' onClick={handleCash}>
            Done
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default CashPayAtCounter
