'use client'
import React, { useEffect, useState } from "react";

function SideCategory() {

  const typesData = [{
    name: "Men",
    slug: "men",
  }];
  return (
    <div className=" rounded-3xl px-5 py-6 shadow-lg w-2/3 md:w-1/2 lg:w-auto bg-white">
      <h3 className="font-semibold mb-3 text-lg text-cusblack">Categories</h3>
      <ul className="leading-10 text-xs">
        <li>
          <button
            className='cursor-pointer'
          >
            All products
          </button>
        </li>
        {typesData.map((type, idx) => (
          <li key={type.slug}>
            <button
              className='cursor-pointer'
            >
              {type.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideCategory;
