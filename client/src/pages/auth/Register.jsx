//racfe
import React, { useState } from 'react'
import axios from 'axios'
import {toast } from 'react-toastify';

const Register = () => {
  // JavaScript state สำหรับเก็บค่าฟอร์ม
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleOnChange = (e) => {
    // อัปเดต state ทุกครั้งที่ input มีการเปลี่ยนแปลง
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // ป้องกันการรีเฟรชหน้า

    // ตรวจสอบ confirm password
    if(form.password !== form.confirmPassword){
      return alert('Confirm Password is not match!!!') // สามารถใช้ toast แทน alert เพื่อความสวยงาม
    }

    console.log(form) // แสดง payload ของฟอร์มตอน submit

    // ส่งข้อมูลไป backend
    try{
      const res = await axios.post('http://localhost:5000/api/register',form)
      console.log(res) // แสดง response จาก backend

      // แสดง toast success
      toast.success(res.data) // ตรวจสอบว่า backend ส่ง string หรือ object { message: "..." } 
    }catch(err){
      // แสดง error จาก backend
      const errMsg = err.response?.data?.message
      toast.error(errMsg)
      console.log(err)
    }
  }

  return (
    <div>
      Register
      <form onSubmit={handleSubmit}>

        Email
        <input 
          className='border'
          onChange={handleOnChange}
          name='email'
          type='email'
          // แนะนำ: ใส่ value={form.email} เพื่อให้เป็น controlled input
        />

        Password
        <input 
          className='border'
          onChange={handleOnChange}
          name='password'
          type="text" 
          // แนะนำ: ใช้ type="password" เพื่อซ่อนรหัสผ่าน
          // และใส่ value={form.password} เพื่อ controlled input
        />

        Confirm Password
        <input 
          className='border'
          onChange={handleOnChange}
          name='confirmPassword'
          type="text"
          // แนะนำ: type="password" + value={form.confirmPassword}
        />

        <button className='bg-blue-500 rounded-md'>
          Register
        </button>

      </form>
    </div>
  )
}

export default Register
