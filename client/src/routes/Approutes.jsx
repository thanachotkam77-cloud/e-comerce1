import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from '../pages/Home.jsx'
import Shop from '../pages/Shop.jsx'
import Cart from '../pages/Cart.jsx'
import History from '../pages/History.jsx'
import Checkout from '../pages/Checkout.jsx'
import Login from '../pages/auth/Login.jsx'
import Register from '../pages/auth/Register.jsx'
import Layout from '../layouts/Layout.jsx'
import LayoutAdmin from '../layouts/LayoutAdmin.jsx'
import Dashbord from '../pages/admin/Dashbord.jsx'
import Category from '../pages/admin/Category.jsx'
import Product from '../pages/admin/Product.jsx'
import Manage from '../pages/admin/Manage.jsx'
import LayoutUser from '../layouts/LayoutUser.jsx'
import HomeUser from '../pages/user/HomeUser.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true , element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'cart', element: <Cart /> },
      { path: 'history', element: <History /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ]
  },
  {path:'/admin',
    element: <LayoutAdmin/>,
    children:[
        {index: true, element: <Dashbord/>},
        {path: 'category', element: <Category/>},
        {path: 'product', element: <Product/>},
        {path: 'manage', element: <Manage/>},
    ]
    
    },
  {path:'/user',
    element: <LayoutUser/>,
    children:[
        {index: true, element: <HomeUser/>},
       
    ]
    
    },


])

const Approutes = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default Approutes