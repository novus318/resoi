import React from 'react'

const Container = ({children}:any) => {
  return (
    <div className="w-full mx-auto container lg:px-10 md:px-5 sm:px-1 px-3">{children}</div>
  )
}

export default Container
