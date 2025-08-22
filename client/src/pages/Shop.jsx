import React, { useEffect } from 'react'
import ProductCart from '../components/card/ProductCart'
import useEcomStore from '../store/ecom-store'
import SearchCard from '../components/card/SearchCard'
import CartCard from '../components/card/CartCard'

const Shop = () => {
  const getProduct = useEcomStore((state) => state.getProduct)
  const products = useEcomStore((state) => state.products)

  useEffect(() => {
    getProduct(10)
  }, [])
  return (
    <div className='flex'>
      {/* Search Bar */}
      <div className='w-1/4 p-4 bg-gray-100 h-screen'>
        <SearchCard/>
      </div>


      {/* Product */}
      <div className='w-1/2 p-4 h-screen overscroll-y-auto'>
        <p className='text-2xl font-bold mb-4'>สินค้าทั้งหมด</p>
        <div className='flex flex-wrap gap-4'>
          {/* Product Cart */}
          
          {
            products.map((item, index) =>
            <ProductCart key={index} item={item}/>
          )
          }

        </div>
      </div>


      {/* Cart */}
      <div className='w-1/4 p-4 bg-gray-100 overflow-y-auto'>
        <CartCard/>

      </div>







    </div>
  )
}

export default Shop