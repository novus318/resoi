import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, PhoneCall, RefreshCw } from "lucide-react"

const OrderFail = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-red-600">Order Failed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-gray-600">
          We&apos;re sorry, but there was an issue processing your order. Please try again or contact support for assistance.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Error Code:</span>
            <span>#ERR1234</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Possible Reason:</span>
            <span>Payment Declined</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button className="w-full flex items-center justify-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </Button>
        <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
          <PhoneCall className="w-4 h-4" />
          <span>Contact Support</span>
        </Button>
      </CardFooter>
    </Card>
  </div>
  )
}

export default OrderFail
