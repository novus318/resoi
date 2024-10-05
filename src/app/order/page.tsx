'use client'
import Layout from '@/components/order/OrderLayout'
import ProductCard from '@/components/order/ProductCard';
import CardSkeleton from '@/components/ui/CardSkeleton';
import React, { useEffect, useState } from 'react'

const Order = () => {
    const [sort, setSort] = useState(0);
    const data_items = [
        {
          "_id": "61190d98cd0bde22e8960771",
          "name": "Chicken Biryani",
          "slug": "chicken-biryani",
          "category": "Biryani",
          "price": "250",
          "description": "Delicious long-grain basmati rice cooked with tender chicken pieces in flavorful spices.",
          "published_at": "2023-08-15T12:50:35.569Z",
          "createdAt": "2023-08-15T12:50:32.330Z",
          "updatedAt": "2023-08-17T23:49:55.279Z",
          "images": [
         "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_292,h_300/TopPicks2024/107588300B.png"
        ]
        },
        {
          "_id": "611a4d38666787300c2e18ff",
          "name": "Shawarma Roll",
          "slug": "shawarma-roll",
          "category": "Wraps",
          "price": "150",
          "description": "Juicy grilled chicken wrapped in a soft flatbread with garlic sauce and pickled veggies.",
          "published_at": "2023-08-16T11:34:19.821Z",
          "createdAt": "2023-08-16T11:34:16.949Z",
          "updatedAt": "2023-08-16T11:34:19.951Z",
          "images": [
            "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_292,h_300/TopPicks2024/107588300B.png"  ]
        },
        {
          "_id": "611a4d38666787300c2e18fa",
          "name": "Paneer Tikka",
          "slug": "paneer-tikka",
          "category": "Appetizers",
          "price": "180",
          "description": "Grilled cottage cheese cubes marinated in tangy spices, served with mint chutney.",
          "published_at": "2023-08-16T11:34:19.821Z",
          "createdAt": "2023-08-16T11:34:16.949Z",
          "updatedAt": "2023-08-16T11:34:19.951Z",
          "images": [
            "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_292,h_300/TopPicks2024/107588300B.png"]
        },
        {
          "_id": "611a4d38666787300c2e18fb",
          "name": "Falafel Platter",
          "slug": "falafel-platter",
          "category": "Main Course",
          "price": "200",
          "description": "Crispy falafel balls served with hummus, pita bread, and a side of fresh salad.",
          "published_at": "2023-08-16T11:34:19.821Z",
          "createdAt": "2023-08-16T11:34:16.949Z",
          "updatedAt": "2023-08-16T11:34:19.951Z",
          "images": [
            "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_292,h_300/TopPicks2024/107588300B.png" ]
        }
      ];
      
    
  
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      setTimeout(() => setLoading(false), 1000);
    }, []);
  return (
    <Layout setSort={setSort} >
        {!loading ? (
          data_items.length < 1 ? (
            <p className="col-span-full mx-auto text-sm text-gray-400">
              No item found
            </p>
          ) : (
            data_items.map((item) => (
              <ProductCard key={item.slug} item={item} />
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
  )
}

export default Order
