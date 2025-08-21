import React, { useEffect, useState } from 'react'
import useEcomStore from '../store/ecom-store'
import { currentUser } from '../api/auth'
import LoadingToRedirect from './LoadingToRedirect'

const ProtectRouteUser = ({element}) => {

    const [ok, setOk] = useState(false) // state สำหรับเช็คว่า user ผ่านการตรวจสอบหรือไม่
    const user = useEcomStore((state)=> state.user) // ดึง user จาก zustand store
    const token = useEcomStore((state)=> state.token) // ดึง token จาก zustand store
    

    useEffect(()=>{
        if(user && token){
            // ถ้ามี user และ token ให้ไปตรวจสอบกับ backend
            currentUser(token) // ส่ง token ไปตรวจสอบ
            .then((res)=>setOk(true)) // ถ้า backend ตอบว่า token valid → อนุญาตเข้าหน้านั้น
            .catch((err)=>setOk(false)) // ถ้า token ไม่ถูกต้อง → redirect หรือแสดง loading
        }
        // note: dependency array ว่าง [] → useEffect จะรันครั้งเดียวตอน mount
    },[])

  // ถ้า ok = true → render element ที่ต้องการ, ไม่งั้น render LoadingToRedirect
  return ok ? element : <LoadingToRedirect/>
}

export default ProtectRouteUser
