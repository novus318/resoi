'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Loader2, MapPin, MinusIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from 'react-redux';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { clearCart, decrementQuantity, incrementQuantity, removeFromCart } from '@/store/cartSlice';
import { formatCurrency } from '@/lib/currencyFormat';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import { withAuth } from '@/components/withAuth';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


const Checkout = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router =useRouter()
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [map, setMap] = useState<any>(null);
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: 12.1024, lng: 75.2024 });
  const autocompleteRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);


  const handleMapLoad = (map: any) => {
    setMap(map);
    geocoderRef.current = new window.google.maps.Geocoder();
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!map) {
        setReloadKey(prevKey => prevKey + 1); // Trigger map reload by updating key
      }
    }, 300);

    return () => clearTimeout(timeoutId); // Clean up timeout on unmount or success
  }, [map]);
  // Handle marker drag and update coordinates and address
  const handleMarkerDragEnd = async (e: any) => {
    const newCoordinates = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setCoordinates(newCoordinates);

    // Geocode the new coordinates to get the address
    if (geocoderRef.current) {
      geocoderRef.current.geocode({ location: newCoordinates }, (results: any, status: any) => {
        if (status === 'OK' && results.length > 0) {
          const newAddress = results[0].formatted_address;
          setAddress(newAddress); // Update the address state
        } else {
          console.error('Geocode was not successful: ' + status);
        }
      });
    }
  };

  // Load the Autocomplete component
  const onLoad = (autocomplete: any) => {
    autocompleteRef.current = autocomplete;
  };

  // Update coordinates and address when a place is selected via autocomplete
  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place?.geometry) {
      const newCoordinates = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setAddress(place.formatted_address);
      setCoordinates(newCoordinates);
      map?.panTo(newCoordinates);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleEditToggle = () => {
    setIsEditingAddress(!isEditingAddress); // Toggle editing state
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
    // Validate if address is provided
    if (!address) {
      toast({
        title: 'Please provide an address.',
        variant: 'destructive'
      });
      return;
    }
  
    // Validate if payment method is selected
    if (!paymentMethod) {
      toast({
        title: 'Please select a payment method.',
        variant: 'destructive'
      });
      return;
    }
  
    // Set loading state
    setLoading(true);
  
    try {
      const token = localStorage.getItem('userToken');
  
      // Prepare order details
      const orderDetails = {
        userToken: token,
        address: address || 'Address not provided',
        coordinates,
        paymentMethod,
        cartItems,
        totalAmount: calculateTotal(),
      };

      if(paymentMethod === 'cod'){
        const response = await axios.post(`${apiUrl}/api/online/create/order`, orderDetails);
        if (response.data.success) {
          dispatch(clearCart());
          toast({
            title: 'Order placed successfully!',
            variant: 'default'
          });
          router.push(`/order-success/${response.data.order.orderId}`)
        }
      }else{
      const response = await axios.post(`${apiUrl}/api/online/create/order`, orderDetails);
      if (response.data.success) {
        toast({
          title: 'Order placed successfully!',
          variant: 'default'
        });
        console.log(response.data)
        // router.push(`/order-success/${response.data.order.orderId}`)
      }
    }
    } catch (error:any) {
      toast({
        title: 'An error occurred while placing the order.',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if(cartItems.length < 1){
    router.push('/order')
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 max-w-5xl mt-20">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Card>
                <CardTitle className='p-3'>Your Orders</CardTitle>
              <div className='mx-auto px-2'>
                  {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
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
                            <div className="flex items-center space-x-2">
                              <Button
                                size="icon"
                                onClick={() => handleDecrement(item)}
                                className="bg-gray-200"
                              >
                                <MinusIcon className="h-4 w-4" />
                                <span className="sr-only">Decrease quantity</span>
                              </Button>
                              <span className="text-xs md:text-sm w-8 text-center">{item.quantity}</span>
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
              <Separator className="my-2" />
              <CardFooter>
                <div className="flex justify-between w-full">
                  <span className="font-semibold">Sub total:</span>
                  <span className="font-semibold">{formatCurrency(calculateTotal())}</span>
                </div>
              </CardFooter>
            </Card>
          </div>

          <Card className='p-2'>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
              <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
                libraries={['places']}
                key={reloadKey}
              >
                <div className="autocomplete-input mb-2">
                  <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                    <Input
                      type="text"
                      placeholder="Enter delivery address"
                      value={address} // Bind the input value to the address state
                      onChange={handleAddressChange} // Allow user to type if needed
                      className={`w-full p-2 border rounded-md ${isEditingAddress ? 'border-secondary-foreground border-2': ''}`}
                      disabled={!isEditingAddress} // Disable input when not editing
                    />
                  </Autocomplete>
                  <Button onClick={handleEditToggle} className="mt-2">
                    {isEditingAddress ? 'Save Address' : !address ? 'Add address':'Edit Address'}
                  </Button>
                  {isEditingAddress && (
                    <p className="text-xs text-destructive mt-2 font-bold">Drag the marker to set your delivery location.</p>
                  )}
                </div>

                <GoogleMap
                  center={coordinates}
                  zoom={14}
                  mapContainerStyle={{ width: '100%', height: '300px' }}
                  options={{
                    disableDefaultUI: true, // Removes default controls like zoom, map type, etc.
                    zoomControl: true, // Enables only zoom control
                    controlSize: 23,
                    keyboardShortcuts: false,
                    draggable: isEditingAddress, // Disable map dragging if not editing
                    scrollwheel: isEditingAddress, // Disable scroll zoom if not editing
                  }}
                  onLoad={handleMapLoad}     
                >
                  <Marker
                    position={coordinates}
                    draggable={isEditingAddress} // Enable marker drag only during editing
                    onDragEnd={handleMarkerDragEnd} // Update function to handle dragging
                  />
                </GoogleMap>

                {/* Display formatted address */}
                <Card className="w-full mt-4 mx-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className='text-sm'>{address || 'No address selected'}</p>
                    </div>
                  </CardContent>
                </Card>
              </LoadScript>

              <div className="mt-4">
                <h2 className="font-semibold mb-2">Payment Method</h2>
                <p className='text-destructive text-xs font-bold'>*Note: Online payments are under maintainance</p>
                <div className="flex space-x-4">
                  <Button
                    variant={paymentMethod === 'online' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('online')}
                    disabled
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
            <Separator className="my-4" />
            <div className="flex justify-between w-full px-5">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold">{formatCurrency(calculateTotal())}</span>
            </div>
            <Separator className="my-4" />
            <CardFooter>
              <Button className="w-full" disabled={loading} onClick={handleProceed}>
                {loading ? <Loader2 className='animate-spin'/> : `Proceed with ${formatCurrency(calculateTotal())}`}
              </Button>
            </CardFooter>
          </Card>

        </div>
      </div></>
  );
};

export default withAuth(Checkout);
