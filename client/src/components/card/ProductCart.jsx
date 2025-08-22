import React from 'react'
import { ShoppingCart } from 'lucide-react';
import useEcomStore from '../../store/ecom-store'

const ProductCart = ({ item }) => {
    const actionAddtoCart = useEcomStore((state)=>state.actionAddtoCart)

    return (
        <div className='border border-amber-50 rounded-xl shadow-md p-3 w-60 bg-white'>
            <div>
                {item.images && item.images.length > 0 ? (
                    <img
                        src={item.images[0].url}
                        className='rounded-md w-full h-32 object-cover hover:scale-105 transition-transform duration-300'
                        alt={item.title}
                    />
                ) : (
                    <div className='w-full h-32 bg-gray-200 rounded-md text-center flex items-center justify-center shadow'>
                        No Image
                    </div>
                )}
            </div>

            <div className='py-2'>
                <p className='text-lg font-semibold truncate'>{item.title}</p>
                <p className='text-sm text-gray-500 line-clamp-2'>{item.description}</p>
            </div>

            <div className='flex justify-between items-center'>
                <span className='text-xl font-bold text-green-600'>฿{item.price}</span>
                <button onClick={()=>actionAddtoCart(item)} className='bg-blue-500 rounded-md p-2 hover:bg-blue-700 shadow-md text-white'>
                    <ShoppingCart />
                </button>
            </div>
        </div>
    )
}

export default ProductCart
