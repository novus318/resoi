'use client';
import Layout from '@/components/order/OrderLayout';
import ProductCard from '@/components/order/ProductCard';
import CardSkeleton from '@/components/ui/CardSkeleton';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

type Item ={
  name: string
  price: null
  offer:null,
  image: File | null
  description: string
  ingredients: string[]
  category:{
    name: string
  }
  subcategory:{
    name: string
  }
  variants: { name: string; price: number; isAvailable: boolean }[]
  isVeg: boolean
}

const Order = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [items, setItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoadingItems(true);
      const response = await axios.get(`${apiUrl}/api/item/get-items`);
      if (response.data.success) {
        setItems(response.data.items);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingItems(false);
    }
  };

  const filteredItems = items
    .filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        item?.name?.toLowerCase().includes(query) ||
        item?.description?.toLowerCase().includes(query) ||
        item?.ingredients?.some((ingredient:any) =>
          ingredient.toLowerCase().includes(query)
        ) ||
        item?.category?.name?.toLowerCase().includes(query) ||
        item?.subcategory?.name?.toLowerCase().includes(query)
      );
    })

  return (
    <Layout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      {!loadingItems ? (
        filteredItems.length < 1 ? (
          <p className="col-span-full mx-auto text-sm text-gray-400">
            No items found
          </p>
        ) : (
          filteredItems.map((item: any) => (
            <div key={item?._id}>
              <ProductCard key={item._id} item={item} isSelected={false} />
            </div>
          ))
        )
      ) : (
        <>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </>
      )}
    </Layout>
  );
};

export default Order;
