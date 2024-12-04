'use client';
import Layout from '@/components/order/OrderLayout';
import ProductCard from '@/components/order/ProductCard';
import IfOrder from '@/components/tableOrders/IfOrder';
import TableCart from '@/components/tableOrders/TableCart';
import UnauthorisedTable from '@/components/tableOrders/UnauthorisedTable';
import CardSkeleton from '@/components/ui/CardSkeleton';
import { withAuth } from '@/components/withAuth';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

type Item = {
  _id: string
  name: string;
  price: number | null;
  offer: number | null;
  image: File | null;
  description: string;
  ingredients: string[];
  category: {
    name: string;
  };
  subcategory: {
    name: string;
  };
  variants: { name: string; price: number; isAvailable: boolean }[];
  isVeg: boolean;
};
const TableOrder = withAuth(({ params }: any) => {
  const { tableId } = params
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [items, setItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<string>('');
  const cart = useSelector((state: any) => state.cart.items);
  const [orderId, setOrderId] = useState('');
  const [ok, SetOk] = useState(true);


  useEffect(() => {
    checkTableId()
    fetchItems();
    checkOrderId();
  }, []);

  const checkOrderId = async () => {
    const orderId = localStorage.getItem('orderId');
    if (orderId) {
      setOrderId(orderId)
    }
  };
  const checkTableId = async () => {
    const response = await axios.get(`${apiUrl}/api/table/get-table/${tableId}`);
  try {
    if (response.data.success) {
      SetOk(true)
    }else{
      SetOk(false)
    }
  } catch (error) {
    console.log(error)
    SetOk(false)
  }
  };

  const fetchItems = async () => {
    try {
      setLoadingItems(true);
      const response = await axios.get(`${apiUrl}/api/item/get-table-items/${tableId}`);
      if (response.data.success) {
        setItems(response.data.items);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingItems(false);
    }
  };

  const getPrice = (item: Item) => {
    if (item.price) {
      return item.offer ? item.price - (item.price * (item.offer / 100)) : item.price;
    }
    const availableVariant = item.variants.find((variant) => variant.isAvailable);
    if (availableVariant) {
      return item.offer
        ? availableVariant.price - (availableVariant.price * (item.offer / 100))
        : availableVariant.price;
    }
    return 0;
  };

  const filteredItems = items
    .filter((item) => {
      const query = searchQuery.toLowerCase();
      const categoryMatch = selectedCategory === 'All' || item.category.name === selectedCategory;
      return (
        categoryMatch &&
        (item?.name?.toLowerCase().includes(query) ||
          item?.description?.toLowerCase().includes(query) ||
          item?.ingredients?.some((ingredient: any) => ingredient.toLowerCase().includes(query)) ||
          item?.category?.name?.toLowerCase().includes(query) ||
          item?.subcategory?.name?.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'lowToHigh') {
        return getPrice(a) - getPrice(b);
      }
      if (sortOrder === 'highToLow') {
        return getPrice(b) - getPrice(a);
      }
      return 0;
    });

if(!ok){
  return <UnauthorisedTable/>
}else{
  return (
    <Layout
      items={items}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
    >
      {!loadingItems ? (
        filteredItems.length < 1 ? (
          <p className="col-span-full mx-auto text-sm text-gray-400">No items found</p>
        ) : (
          filteredItems.map((item: Item) => (
            <div key={item?._id}>
              <ProductCard key={item._id} item={item} />
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
      {cart.length > 0 &&
        <TableCart id={tableId} orderId={orderId} />}
      {orderId && <IfOrder orderId={orderId} />}
    </Layout>
  );
}
});

export default TableOrder
