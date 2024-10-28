'use client'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, MapPin, AlertCircle, Hourglass } from "lucide-react";
import axios from "axios";
import { formatCurrency } from "@/lib/currencyFormat";
import Unauthorised from "@/components/checkout/Unauthorised";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/cartSlice";

interface PageProps {
  params: {
    orderId: string
  }
}

const OrderValidate = ({params}: PageProps) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { orderId } = params;
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderId) {
        try {
          const response = await axios.get(`${apiUrl}/api/online/order-status/${orderId}`);
          if (response.data.success) {
            setOrderDetails(response.data.order);
            if (response.data.order.status === 'confirmed') {
              dispatch(clearCart());
            }
          }
        } catch (error) {
          console.error("Error fetching order details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrderDetails();

    // Polling if the order status is "pending"
    const intervalId = setInterval(async () => {
      if (orderDetails?.status === "pending") {
        try {
          const response = await axios.get(`${apiUrl}/api/online/order-status/${orderId}`);
          if (response.data.success && response.data.order.status !== "pending") {
            setOrderDetails(response.data.order);
            if (response.data.order.status === "confirmed") {
              dispatch(clearCart());
            }
            clearInterval(intervalId); // Stop polling when status is not pending
          }
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      }
    }, 1300);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [orderId, orderDetails?.status]);

  if (loading) {
    return <Spinner />;
  }

  if (!orderDetails) {
    return <Unauthorised />;
  }

  const renderOrderStatus = () => {
    switch (orderDetails.status) {
      case "confirmed":
        return (
          <div className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 animate-bounce" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600 animate-pulse">Order Successful!</CardTitle>
          </div>
        );
      case "pending":
        return (
          <div className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Hourglass className="w-8 h-8 text-yellow-600 animate-spin" />
            </div>
            <CardTitle className="text-2xl font-bold text-yellow-600 animate-pulse">Order Pending</CardTitle>
          </div>
        );
      case "failed":
        return (
          <div className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600 animate-bounce" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600 animate-pulse">Order Failed</CardTitle>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>{renderOrderStatus()}</CardHeader>
        <CardContent className="space-y-4">
        <p className="text-center text-gray-600">
    {orderDetails.status === "confirmed" && "Thank you for your order. Your delicious meal is on its way!"}
    {orderDetails.status === "pending" && "Your order is being processed. Please wait a moment!"}
    {orderDetails.status === "failed" && "We're sorry, but there was an issue with your order. Please try again."}
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
          <Button onClick={() => router.push('/order/viewAllOrders')} className="w-full">Track Order</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderValidate;
