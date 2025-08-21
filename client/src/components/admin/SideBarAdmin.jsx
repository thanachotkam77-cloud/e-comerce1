import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react';

const SideBarAdmin = () => {
  return (
    <div className='bg-gray-600 w-64 text-gray-100 flex flex-col h-screen'>
      <div className='h-24 bg-gray-800 flex items-center justify-center text-2xl font-bold'>
        Admin Panel
      </div>

      <nav className='flex-1 px-4 py-4 space-y-2'>
        <NavLink
          to='/admin'
          end
          className={({ isActive }) =>
            isActive
              ? 'bg-gray-900 rounded-md text-white px-4 py-2 flex items-center gap-2'
              : 'text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center gap-2'
          }
        >
          <LayoutDashboard />
          Dashboard
        </NavLink>

        <NavLink
          to='manage'
          className={({ isActive }) =>
            isActive
              ? 'bg-gray-900 rounded-md text-white px-4 py-2 flex items-center gap-2'
              : 'text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center gap-2'
          }
        >
          <LayoutDashboard />
          Manage
        </NavLink>

        <NavLink
          to='category'
          className={({ isActive }) =>
            isActive
              ? 'bg-gray-900 rounded-md text-white px-4 py-2 flex items-center gap-2'
              : 'text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center gap-2'
          }
        >
          <LayoutDashboard />
          Category
        </NavLink>

        <NavLink
          to='product'
          className={({ isActive }) =>
            isActive
              ? 'bg-gray-900 rounded-md text-white px-4 py-2 flex items-center gap-2'
              : 'text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center gap-2'
          }
        >
          <LayoutDashboard />
          Product
        </NavLink>
        
      </nav>

      <div className='p-4 text-center border-t border-gray-500'>
        <NavLink

          className={({ isActive }) =>
            isActive
              ? 'bg-gray-900 rounded-md text-white px-4 py-2 flex items-center gap-2'
              : 'text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center gap-2'
          }
        >
          <LayoutDashboard />
          logout
        </NavLink>
      </div>
    </div>
  )
}

export default SideBarAdmin
