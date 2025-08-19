import React from 'react'
import { Outlet } from 'react-router-dom'

const LayoutAdmin = () => {
  return (
    <div>
        <h1>SideBar</h1>
        <h1>HeaderBar</h1>
        <hr />
        <Outlet/>
    </div>
  )
}

export default LayoutAdmin