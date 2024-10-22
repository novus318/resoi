'use client'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, MapPin } from "lucide-react";
import axios from "axios";
import { formatCurrency } from "@/lib/currencyFormat";
import Unauthorised from "@/components/checkout/Unauthorised";
import Spinner from "@/components/Spinner";

interface PageProps {
  params: {
    orderId: string
  }
}


const OrderSuccess = ({params}:PageProps) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { orderId } = params; // Get orderId from route params
  const [orderDetails, setOrderDetails] = useState<any>(null); // State to store order details
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderId) {
        try {
          const response = await axios.get(`${apiUrl}/api/online/order-status/${orderId}`);
          if (response.data.success) {
            setOrderDetails(response.data.order);
          }
        } catch (error) {
          console.error("Error fetching order details:", error);
        } finally {
          setLoading(false); // Stop loading after fetching
        }
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return <Spinner/>; // Display loading state
  }

  if (!orderDetails) {
    return <Unauthorised/>; // Display message if order details not found
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600 animate-bounce" />
        </div>
        <CardTitle className="text-2xl font-bold text-green-600 animate-pulse">Order Successful!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-gray-600">
          Thank you for your order. Your delicious meal is on its way!
        </p>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Order Number:</span>
            <span>{orderId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total Amount:</span>
            <span>{formatCurrency(orderDetails?.totalAmount)}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Estimated delivery time: 30-45 minutes</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-8 h-8" />
            <span>{orderDetails?.address}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Track Order</Button>
      </CardFooter>
    </Card>
  </div>
  )
}

export default OrderSuccess
