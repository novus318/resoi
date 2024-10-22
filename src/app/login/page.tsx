'use client'
import { toast } from '@/hooks/use-toast';
import { sendOtp, sendtextOtp } from '@/utils/sendOtp';
import React, { useEffect, useRef, useState } from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

const Login = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState(''); 
  const [name, setName] = useState('');
  const otpSentRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [userNumber, setUserNumber] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect'); 
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // Check if userToken exists in local storage and redirect to /order if it does
    const token = localStorage.getItem('userToken');
    if (token) {
      router.push('/order');
    }
  }, [router]);


  const handleOtpChange = (value: string) => {
    setEnteredOtp(value);
  };

  const handleSendOtp = async (): Promise<void> => {
    if (otpSentRef.current) return;
    otpSentRef.current = true;
setLoading(true)
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(generatedOtp);
    setOtp(generatedOtp);

    const otpSentStatus = await sendOtp(generatedOtp,userNumber)
    setOtpSent(otpSentStatus);
    setLoading(false)
  };

  const verifyOtp = async () => {
    console.log(enteredOtp)
    if (enteredOtp === otp) {
      setOtpVerified(true);
      try {
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const ip = ipResponse.data.ip;
        const response = await axios.post(`${apiUrl}/api/user/create/user`, {
          name,
          mobileNumber: userNumber,
          ipAddress: ip,
        });
        
        if (response.data.success) {
          const { token } = response.data;

          // Store the token in local storage
          localStorage.setItem('userToken', token);
          const redirectTo = redirect ? decodeURIComponent(redirect) : '/order';
          router.push(redirectTo);

          toast({
            title: 'User logged in successfully',
            variant: 'default',
          });
        }
      } catch (error:any) {
        setOtpVerified(false)
        toast({
          title: 'Error logging in. Please try again.',
          description: error.response?.data?.message || error.message || 'Something went wrong',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Invalid OTP',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="">
        {otpSent ? (
          <Card className="w-full mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Enter OTP</CardTitle>
              <CardDescription>We&apos;ve sent a 6-digit code to your phone number.</CardDescription>
            </CardHeader>
            <CardContent className='flex justify-center'>
              <InputOTP maxLength={6}  value={enteredOtp} onChange={handleOtpChange}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </CardContent>
            <CardFooter>
              <Button onClick={verifyOtp} disabled={otpVerified} className="w-full">
                {otpVerified ? <Loader2 className='animate-spin' /> : 'Submit'}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="w-full mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Login</CardTitle>
              <CardDescription>Please enter your details to log in.</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div>
                  <Label className='font-semibold text-muted-foreground text-xs' htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label className='font-semibold text-muted-foreground text-xs' htmlFor="phone">Phone Number</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                      +91
                    </span>
                    <Input 
                      id="phone" 
                      type="tel"
                      placeholder="Enter number" 
                      value={userNumber || ''}
                      onChange={(e) => setUserNumber(e.target.value)}
                      className="rounded-l-none"
                      maxLength={10}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSendOtp}
                disabled={!name || !userNumber || otpSent||loading}
                className="w-full font-bold tracking-wide"
              >
                {loading ? <Loader2 className='animate-spin' /> : 'Log in'}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Login;
