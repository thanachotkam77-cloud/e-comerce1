import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

// Component แสดงข้อความและนับถอยหลัง ก่อน redirect ไปหน้า '/'
const LoadingToRedirect = () => {
    const [count, setCount] = useState(3)       // เก็บจำนวนวินาทีที่นับถอยหลัง
    const [redirect, setRedirect] = useState(false) // เช็คว่าต้อง redirect หรือไม่

    useEffect(() => {
        // เริ่มนับถอยหลังทุก 1 วินาที
        const interval = setInterval(() => {
            setCount((currentCount) => {
                if (currentCount === 1) {       // เมื่อถึง 1 วินาที
                    clearInterval(interval)    // หยุด interval
                    setRedirect(true)          // ตั้ง redirect เป็น true
                }
                return currentCount - 1         // ลด count ทีละ 1
            })
        }, 1000)

        // ทำความสะอาด interval เมื่อ component ถูก unmount
        return () => clearInterval(interval)
    }, [])

    if (redirect) {
        return <Navigate to={'/'} />            // redirect ไปหน้า '/'
    }

    return (
        <div>No Permission, Redirect in {count}</div> // แสดงข้อความและนับถอยหลัง
    )
}

export default LoadingToRedirect
