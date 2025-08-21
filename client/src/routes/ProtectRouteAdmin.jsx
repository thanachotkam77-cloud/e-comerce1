import React, { useEffect, useState } from 'react'
import useEcomStore from '../store/ecom-store'
import { currentAdmin } from '../api/auth'
import LoadingToRedirect from './LoadingToRedirect'

const ProtectRouteAdmin = ({element}) => {

    const [ok, setOk] = useState(false) // state สำหรับเช็คว่า admin ผ่านการตรวจสอบหรือไม่
    const user = useEcomStore((state)=> state.user) // ดึง user จาก zustand store
    const token = useEcomStore((state)=> state.token) // ดึง token จาก zustand store

    useEffect(()=>{
        if(user && token){
            // ถ้ามี user และ token → ตรวจสอบสิทธิ์ admin กับ backend
            currentAdmin(token) // ส่ง token ไปตรวจสอบว่าเป็น admin จริงหรือไม่
            .then((res)=>setOk(true)) // ถ้า backend ตอบว่า valid → อนุญาตเข้าหน้า admin
            .catch((err)=>setOk(false)) // ถ้าไม่ valid → redirect หรือ render loading
        }
        // dependency array ว่าง [] → useEffect run ครั้งเดียวตอน mount
    },[])

    // ถ้า ok = true → render element ของ admin, ไม่งั้น render LoadingToRedirect
    return ok ? element : <LoadingToRedirect/>
}

export default ProtectRouteAdmin
