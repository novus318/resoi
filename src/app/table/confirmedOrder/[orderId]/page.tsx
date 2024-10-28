'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCheck, Loader2, MapPin, PlusCircle, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/currencyFormat';
import { withAuth } from '@/components/withAuth';
import axios from 'axios';
import SmallNav from '@/components/SmallNav';
import { Button } from '@/components/ui/button';
import UnauthorisedTable from '@/components/tableOrders/UnauthorisedTable';
import CashPayAtCounter from '@/components/tableOrders/CashPayAtCounter';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const ConfirmedOrder = withAuth(({ params }: any) => {
  const { orderId } = params
  const router =useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [order, setOrder] = useState<any>(null);
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [ok, SetOk] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const handleOpen = () => setIsDrawerOpen(true)
  const handleClose = () => setIsDrawerOpen(false)

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/tableOrder/get-order/${orderId}`);
      if (response.data.success) {
        setOrder({
          table: response.data?.order?.table,
          user: response.data?.order?.user,
          totalAmount: response.data?.order?.totalAmount,
          paymentStatus: response.data?.order?.paymentStatus,
        });
        setCartItems(response.data?.order?.cartItems);
      }
    } catch (error) {
      console.error(error);
      SetOk(false)
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const calculateTotal = () => {
    return cartItems.reduce((total: any, item: any) => {
      const priceAfterDiscount = item.offer
        ? item.price - item.price * (item.offer / 100)
        : item.price;
      return total + priceAfterDiscount * item.quantity;
    }, 0);
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if(paymentMethod=== 'cash'){
        handleOpen()
      }else{
        const response = await axios.post(`${apiUrl}/api/tableOrder/table-order/online-pay`,{
          orderId
        });
        if (response.data.success) {
          router.push(response.data.payment.instrumentResponse.redirectInfo.url)
          setLoading(false);
        }
      }
    } catch (error:any) {
      toast({
        title: 'something went wrong retry.',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  if(!ok){
    return <UnauthorisedTable/>
  }
  return (
    <>
      <SmallNav />
      <div className="container mx-auto p-4 max-w-5xl mt-12">
        <h1 className="text-3xl font-bold mb-4">Confirmed orders</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Card>
              <CardTitle className='p-3'>Your Orders</CardTitle>
              <div className='mx-auto px-2'>
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-center text-sm text-muted-foreground mb-2">
                      Your Confirmed order is empty
                    </p>
                    <Link href={`/table/${order?.table?._id}`} className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-primary rounded hover:bg-primary-foreground transition-colors duration-200">
                      Order Now
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {cartItems.map((item: any, i: any) => (
                        <div
                        key={i}
                        className="flex items-center justify-between border p-2 rounded-lg bg-white shadow-sm"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={`${apiUrl}${item?.image}`}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="font-semibold text-xs">{item.name}</p>
                            {item.variant && (
                              <p className="text-xs text-muted-foreground font-bold uppercase">
                                {item.variant}
                              </p>
                            )}
                            <div className="text-xs">
                              {item.offer ? (
                                <>
                                  <span className="line-through text-red-500">
                                    {formatCurrency(item.price)}
                                  </span>{' '}
                                  <span className="font-bold">
                                    {formatCurrency(
                                      item.price - item.price * (item.offer / 100)
                                    )}
                                  </span>
                                </>
                              ) : (
                                <span className="font-bold">
                                  {formatCurrency(item.price)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="grid items-center">
                         <p className='font-bold text-xs text-muted-foreground'>Quantity: {item.quantity}</p>
                         <p className='font-bold text-xs text-muted-foreground'>Amount:
                          {formatCurrency(
                            item.price * item.quantity -
                              item.price * item.quantity * (item.offer / 100)
                          )}
                         </p>
                        </div>
                      </div>
                      ))}
                   {order?.paymentStatus === 'pending' ? (
                       <div className="flex justify-center w-full">
                       <Link href={`/table/${order?.table?._id}`} className='bg-primary text-primary-foreground px-4 rounded-sm flex gap-2 py-1'>
                         <PlusCircle />Add more
                       </Link>
                     </div>
                   ):(
                     <div className="flex justify-center w-full">
                     <p className='text-xs'>
                     Your payment has been confirmed.<br/>
                     Thank you!
                     </p>
                     </div>
                   )}
                    </div>
                  </>
                )}
              </div>
              <Separator className="my-2" />
              <CardFooter>
                <div className="flex justify-between w-full">
                  <span className="font-semibold">Sub total:</span>
                  <span className="font-semibold">{formatCurrency(calculateTotal())}</span>
                </div>
              </CardFooter>
            </Card>
          </div>
      <div>
      <Card className='p-2'>
                <Card className="w-full mt-4 mx-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      Table : {order?.table?.tableName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className='text-sm font-semibold'>Name: {order?.user?.name} </p>
                      <p className='text-sm font-semibold'>Phone: +91 {order?.user?.mobileNumber} </p>
                      <p className='text-sm'></p>
                    </div>
                  </CardContent>
                </Card>

             {order?.paymentStatus === 'pending' && 
              <div className="mt-4">
              <h2 className="font-semibold mb-2">Payment Method</h2>
              {/* <p className='text-destructive text-xs font-bold'>*Note: Online payments are under maintainance</p> */}
              <div className="flex space-x-3">
                <Button
                  variant={paymentMethod === 'online' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('online')}
                  className="w-full"
                >
                  Card / UPI / bank
                </Button>
                <Button
                  variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('cash')}
                  className="w-full"
                >
                  Cash
                </Button>
              </div>
            </div>}
            <Separator className="my-4" />
            <div className="flex justify-between w-full px-5">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold">{formatCurrency(calculateTotal())}</span>
            </div>
            <Separator className="my-4" />
            <CardFooter>
            {order?.paymentStatus === 'pending' ? (
                <Button className="w-full" disabled={loading} onClick={handleSubmit}>
                {loading ? <Loader2 className='animate-spin'/> : `Proceed payment for ${formatCurrency(calculateTotal())}`}
              </Button>
            ):(
              <div>
                <div className='bg-primary text-primary-foreground py-1 px-3 rounded-md flex justify-between mx-auto'>
                 Your payment is done. <CheckCheck className='animate-bounce'/> 
                </div>
                <p className='text-sm'>
                  We hope you enjoyed your meal.
                </p>
              </div>
            )}
            </CardFooter>
          </Card>
      </div>
        </div>
            <CashPayAtCounter isOpen={isDrawerOpen} onClose={handleClose} orderId={orderId}/>
      </div>
      </>
  )
})

export default ConfirmedOrder
