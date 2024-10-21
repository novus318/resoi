'use client'
import React, { useEffect, useRef, useState } from 'react';
import { MinusIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from 'react-redux';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { decrementQuantity, incrementQuantity, removeFromCart } from '@/store/cartSlice';
import { formatCurrency } from '@/lib/currencyFormat';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import { withAuth } from '@/components/withAuth';

const Checkout = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);
  const [map, setMap] = useState<any>(null);
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: 12.1024, lng: 75.2024  });
  const [paymentMethod, setPaymentMethod] = useState('online');
  const autocompleteRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);



  const handleMarkerDragEnd = async (e: any) => {
    const newCoordinates = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setCoordinates(newCoordinates);

    // Geocode the new coordinates to get the address
    if (geocoderRef.current) {
      const results:any = await geocoderRef.current.geocode({
        location: newCoordinates,
      });

      if (results && results.length > 0) {
        const newAddress = results[0].formatted_address;
        setAddress(newAddress); // Update the address state
      }
    }
  };
  const onLoad = (autocomplete: any) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      setAddress(place.formatted_address);
      setCoordinates({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
      map.panTo(place.geometry.location);
    }
  };

  const handleRemove = (item: any) => {
    const data: any = {
      _id: item._id,
      variant: item.variant
    };
    dispatch(removeFromCart(data));
  };

  const handleIncrement = (item: any) => {
    const data: any = {
      _id: item._id,
      variant: item.variant
    };
    dispatch(incrementQuantity(data));
  };

  const handleDecrement = (item: any) => {
    const data: any = {
      _id: item._id,
      variant: item.variant
    };
    dispatch(decrementQuantity(data));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total: any, item: any) => {
      const priceAfterDiscount = item.offer
        ? item.price - item.price * (item.offer / 100)
        : item.price;
      return total + priceAfterDiscount * item.quantity;
    }, 0);
  };

  const handleProceed = async () => {
    // Prepare the order details
    const orderDetails = {
      address: address || 'Address not provided', // Ensure an address is always sent
      coordinates,
      paymentMethod,
      cartItems,
      totalAmount: calculateTotal(),
    };
  
    console.log('Order Details:', orderDetails);
  };
  


  return (
  <>
    <Navbar />
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Your Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mx-auto w-full max-w-sm p-2">
              {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <>
                  <div className="space-y-4">
                    {cartItems.map((item: any, i: any) => (
                      <div
                        key={i}
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
                              <p className="text-sm text-muted-foreground font-bold uppercase">
                                {item.variant}
                              </p>
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
                          <Button
                            size="icon"
                            onClick={() => handleDecrement(item)}
                            className="bg-gray-200"
                          >
                            <MinusIcon className="h-4 w-4" />
                            <span className="sr-only">Decrease quantity</span>
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="icon"
                            onClick={() => handleIncrement(item)}
                            className="bg-gray-200"
                          >
                            <PlusIcon className="h-4 w-4" />
                            <span className="sr-only">Increase quantity</span>
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleRemove(item)}
                          >
                            <Trash2Icon className="h-4 w-4" />
                            <span className="sr-only">Remove item</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <Separator className="my-4" />
          <CardFooter>
            <div className="flex justify-between w-full">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold">{formatCurrency(calculateTotal())}</span>
            </div>
          </CardFooter>
        </Card>

        <Card>
      <CardHeader>
        <CardTitle>Delivery Address</CardTitle>
      </CardHeader>
      <CardContent>
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
          libraries={['places']}
        >
          <div className="autocomplete-input mb-2">
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <Input
                type="text"
                placeholder="Enter delivery address"
                value={address} // Bind the input value to the address state
                onChange={(e) => setAddress(e.target.value)} // Allow user to type if needed
                className="w-full p-2 border rounded"
              />
            </Autocomplete>
          </div>
          <GoogleMap
            center={coordinates}
            zoom={13}
            mapContainerStyle={{ width: '100%', height: '300px' }}
            options={{
              disableDefaultUI: true, // Removes default controls like zoom, map type, etc.
              zoomControl: true, // Enables only zoom control
              controlSize: 23,
              keyboardShortcuts: false,
            }}
            onLoad={(map) => setMap(map)}
          >
            <Marker
              position={coordinates}
              draggable
              onDragEnd={handleMarkerDragEnd} // Update function to handle dragging
            />
          </GoogleMap>
        </LoadScript>
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Payment Method</h2>
          <div className="flex space-x-4">
            <Button
              variant={paymentMethod === 'online' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('online')}
              className="w-full"
            >
              Online Payment
            </Button>
            <Button
              variant={paymentMethod === 'cod' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('cod')}
              className="w-full"
            >
              Cash on Delivery
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleProceed}>
          Proceed
        </Button>
      </CardFooter>
    </Card>
      </div>
    </div></>
  );
};

export default withAuth(Checkout);
