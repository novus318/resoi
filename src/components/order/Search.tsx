'use client'
import React, { useState } from 'react'

const Search = () => {
    const [input, setInput] = useState("");
  const [data, setData] = useState([]);
  const handleChange = async (e:any) => {
    setInput(e.target.value);
  }

  return (
    <div className="max-w-4xl flex relative group md:ml-auto justify-between pr-4 place-items-center flex-grow h-full rounded-3xl bg-white border">
    <input
      onChange={handleChange}
      className="text-xs group pl-4 rounded-3xl p-2.5 focus:outline-none w-full text-cusblack"
      type="text"
      placeholder="Search item"
    />
    <svg
      className="w-4 h-4 text-gray-400"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
        clipRule="evenodd"
      />
    </svg>
  </div>
  )
}

export default Search
