'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, MapPin, AlertCircle, Hourglass, Star, Loader2 } from "lucide-react";
import axios from "axios";
import { formatCurrency } from "@/lib/currencyFormat";
import Unauthorised from "@/components/checkout/Unauthorised";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import UnauthorisedTable from "@/components/tableOrders/UnauthorisedTable";
import { toast } from "@/hooks/use-toast";


interface PageProps {
  params: {
    orderId: string;
  };
}

const OrderValidate = ({ params }: PageProps) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { orderId } = params;
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/tableOrder/order-status/${orderId}`);
        if (response.data.success) {
          setOrderDetails(response.data.order);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();

    const intervalId = setInterval(async () => {
      if (orderDetails?.paymentStatus === "pending") {
        try {
          const response = await axios.get(`${apiUrl}/api/tableOrder/order-status/${orderId}`);
          if (response.data.success && response.data.order.paymentStatus !== "pending") {
            setOrderDetails(response.data.order);
          }
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      }
    }, 1300);

    return () => clearInterval(intervalId);
  }, [orderId, orderDetails?.paymentStatus]);

  useEffect(() => {
    if (orderDetails?.paymentStatus === "completed") {
      localStorage.removeItem('orderId')
    }
  }, [orderDetails?.paymentStatus]);

  if (loading) {
    return <Spinner />;
  }

  if (!orderDetails) {
    return <UnauthorisedTable/>;
  }

  const renderOrderStatus = () => {
    switch (orderDetails?.paymentStatus) {
      case "completed":
        return (
          <div className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 animate-bounce" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600 animate-pulse">Payment Successful!</CardTitle>
          </div>
        );
      case "pending":
        return (
          <div className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Hourglass className="w-8 h-8 text-yellow-600 animate-spin" />
            </div>
            <CardTitle className="text-2xl font-bold text-yellow-600 animate-pulse">Payment Pending</CardTitle>
          </div>
        );
      case "failed":
        return (
          <div className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600 animate-bounce" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600 animate-pulse">Payment Failed</CardTitle>
          </div>
        );
      default:
        return null;
    }
  };

  const handleRetryPayment = async() => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/tableOrder/table-order/online-pay`,{
        orderId
      });
      if (response.data.success) {
        router.push(response.data.payment.instrumentResponse.redirectInfo.url)
        setLoading(false);
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

  const handleRateUs = () => {
    window.open("https://www.google.com/search?q=rate+our+restaurant", "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>{renderOrderStatus()}</CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            {orderDetails.paymentStatus === "completed" && "Thank you for your payment!"}
            {orderDetails.paymentStatus === "pending" && "Your payment is being processed. Please wait a moment!"}
            {orderDetails.paymentStatus === "failed" && "We're sorry, but there was an issue with your payment. Please try again."}
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
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          {orderDetails.paymentStatus === "failed" && (
            <Button onClick={handleRetryPayment} disabled={loading} variant="outline" className="text-destructive font-bold tracking-wide">
             {loading ?<Loader2 className="animate-spin"/> : ' Retry Payment'}
            </Button>
          )}
          {orderDetails.paymentStatus === "completed" && (
            <Button onClick={handleRateUs} variant="outline" className="flex gap-1 items-center font-bold tracking-wide">
             <Star className="h-4"/> Rate Us
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderValidate;
