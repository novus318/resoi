// utils/sendOtp.ts
import { toast } from '@/hooks/use-toast';
import axios, { AxiosResponse } from 'axios';

const WHATSAPP_API_URL: string | undefined = process.env.NEXT_PUBLIC_WHATSAPP_API_URL;
const ACCESS_TOKEN: string | undefined = process.env.NEXT_PUBLIC_WHATSAPP_TOKEN;

// Define a type for the expected structure of the OTP sending function response


export const sendOtp = async (otp:any,number:any) => {
try {
  const response = await axios.post(
    WHATSAPP_API_URL as string,
    {
      messaging_product: 'whatsapp',
      to: `+91${number}`,
      type: 'template',
      template: {
        name: 'user_auth',
        language: { code: 'en_US' },
        components: [
          {
            type: 'body',
            parameters: [{ type: 'text', text: otp }],
          },
          {
            type: 'button',
            sub_type: 'url',
            index: '0',
            parameters: [{ type: 'text', text: otp }],
          },
        ],
      },
    },
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );
  if (response.status === 200) {
    toast({
      title: 'OTP sent',
      variant: 'default',
    });
  }
  return true;
} catch (error) {
  console.error(error);
  toast({
    title: 'Failed to send OTP',
    variant: 'destructive',
  });
  return false;
}
};


export const sendtextOtp = async (otp:any,number:any) => {
  console.log(number)
  try {
    const response = await axios.post(
      WHATSAPP_API_URL as string,
      {
        messaging_product: 'whatsapp',
        to: `+91${number}`,
        type: 'text',
        text: {
          body: `OTP is${otp}`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.status === 200) {
      console.log(response.data)
      toast({
        title: 'OTP sent',
        variant: 'default',
      });
    }
    return true;
  } catch (error) {
    console.error(error);
    toast({
      title: 'Failed to send OTP',
      variant: 'destructive',
    });
    return false;
  }
  };
