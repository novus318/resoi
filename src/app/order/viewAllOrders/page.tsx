'use client'

import { withAuth } from '@/components/withAuth'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { format, subWeeks, subMonths, isAfter } from 'date-fns'
import { Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/currencyFormat'
import Navbar from '@/components/Navbar'

const Page = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [status, setStatus] = useState('all')
  const [period, setPeriod] = useState('this-week')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [status, period, orders])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('userToken')
      const response = await axios.get(`${apiUrl}/api/online/get-online/orders/byId`, {
        headers: {
          authorization: token,
        },
      })
      setOrders(response.data.orders)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    const filtered = orders.filter((order:any )=> {
      const orderDate = new Date(order?.createdAt)

      // Filter by status
      const statusMatch = status === 'all' || order?.status === status

      // Filter by period
      let periodMatch = true
      if (period === 'this-week') {
        periodMatch = isAfter(orderDate, subWeeks(new Date(), 1))
      } else if (period === 'this-month') {
        periodMatch = isAfter(orderDate, subMonths(new Date(), 1))
      } else if (period === 'last-month') {
        const lastMonth = subMonths(new Date(), 1)
        periodMatch = isAfter(orderDate, subMonths(lastMonth, 1)) && !isAfter(orderDate, lastMonth)
      } else if (period === 'last-six-months') {
        periodMatch = isAfter(orderDate, subMonths(new Date(), 6))
      }

      return statusMatch && periodMatch
    })
    setFilteredOrders(filtered)
  }

  const statusColorMap:any = {
    all: 'bg-gray-200 text-gray-800', 
    pending: 'bg-yellow-100 text-yellow-800', 
    confirmed: 'bg-blue-100 text-blue-800', 
    'in-progress': 'bg-orange-100 text-orange-800', 
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800', 
  }
  return (
  <>
    <Navbar />
    <div className="flex justify-center w-full mt-12">
      <div className="max-w-3xl py-8 w-full px-2">
        <h2 className="text-3xl font-bold mb-6 text-center lg:text-left">Your Orders</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This week</SelectItem>
              <SelectItem value="this-month">This month</SelectItem>
              <SelectItem value="last-month">Last month</SelectItem>
              <SelectItem value="last-six-months">Last six months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {filteredOrders.length ? (
              filteredOrders.map((order:any) => (
                <Card key={order.orderId} className="shadow-lg border rounded-lg">
                 <CardHeader className="p-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
                    <CardTitle className="text-lg font-semibold">
                      Order ID: {order.orderId}
                    </CardTitle>
                    <Badge className={`mt-2 sm:mt-0 ${statusColorMap[order.status]}`}>
                      {order.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-lg font-semibold mb-2">Total: {formatCurrency(order.totalAmount)}</p>
                    <p className="text-xs md:text-sm text-gray-500 mb-2">
                      Ordered on: {format(new Date(order.createdAt), "MMMM d, yyyy - hh:mm aaa")}
                    </p>
                    <h4 className="font-semibold mb-2">Items:</h4>
                    <ul className="space-y-3">
                      {order.cartItems?.map((item:any, i:any) => (
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
                    </ul>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500">No orders found.</p>
            )}
          </div>
        )}
      </div>
    </div></>
  )
}

export default withAuth(Page)
