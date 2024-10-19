'use client'
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
} from '@/store/cartSlice';
import { formatCurrency } from '@/lib/currencyFormat';
import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon, ShoppingBag, Trash2Icon } from 'lucide-react';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { useMediaQuery } from 'react-responsive';

const Cart = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const dispatch = useDispatch();
    const cartItems = useSelector((state: any) => state.cart.items);
    const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });

    const handleRemove = (id: string) => {
        dispatch(removeFromCart(id));
    };

    const handleIncrement = (id: string) => {
        dispatch(incrementQuantity(id));
    };

    const handleDecrement = (id: string) => {
        dispatch(decrementQuantity(id));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total: any, item: any) => {
            const priceAfterDiscount = item.offer
                ? item.price - item.price * (item.offer / 100)
                : item.price;
            return total + priceAfterDiscount * item.quantity;
        }, 0);
    };

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button className='rounded-none fixed bottom-0 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-6xl'>
                    <div className="flex justify-between w-full">
                        <div className='font-bold tracking-wide'>
                            {cartItems.length || 0} items added
                        </div>
                        <div className='flex gap-2 items-center'>
                            <p className='font-extrabold'>VIEW CART</p><ShoppingBag />
                        </div>
                    </div>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm p-2">
                    <h2 className="text-xl font-bold mb-4">Your Cart</h2>

                    {cartItems.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {cartItems.map((item: any) => (
                                    <div
                                        key={item._id}
                                        className="flex items-center justify-between border p-3 rounded-lg bg-white shadow-sm"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={`${apiUrl}${item?.image}`}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div>
                                                <h3 className="font-semibold">{item.name}</h3>
                                                {item.variant && (
                                                    <p className="text-sm text-muted-foreground font-bold uppercase">{item.variant}</p>
                                                )}
                                                <div className="text-sm">
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

                                        <div className="flex items-center space-x-2">
                                            {/* Quantity Control */}
                                            <Button
                                                size="icon"
                                                onClick={() => handleDecrement(item._id)}
                                                className="bg-gray-200"
                                            >
                                                <MinusIcon className="h-4 w-4" />
                                                <span className="sr-only">Decrease quantity</span>
                                            </Button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <Button
                                                size="icon"
                                                onClick={() => handleIncrement(item._id)}
                                                className="bg-gray-200"
                                            >
                                                <PlusIcon className="h-4 w-4" />
                                                <span className="sr-only">Increase quantity</span>
                                            </Button>

                                            {/* Remove Button */}
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                onClick={() => handleRemove(item._id)}
                                            >
                                                <Trash2Icon className="h-4 w-4" />
                                                <span className="sr-only">Remove item</span>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total Amount */}
                            <div className="mt-4 text-lg font-bold flex justify-between">
                                <span>Total:</span>
                                <span>{formatCurrency(calculateTotal())}</span>
                            </div>

                            {/* Checkout Button */}
                            <Button className="mt-4 w-full">Proceed to Checkout</Button>
                        </>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default Cart;
