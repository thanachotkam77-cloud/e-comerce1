import React, { useState } from 'react'
import { toast } from 'react-toastify';
import useEcomStore from '../../store/ecom-store';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate()                       // ใช้ redirect หน้า
  const actionLogin = useEcomStore((state) => state.actionLogin) // ดึงฟังก์ชัน login จาก store
  const user = useEcomStore((state)=>state.user)      // ดึง user ปัจจุบันจาก store
  console.log('user form zustand',user)

  const [form, setForm] = useState({                  // state สำหรับเก็บ input form
    email: "",
    password: ""
  })

  const handleOnChange = (e) => {                     // update ค่า input ใน form
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {                // เมื่อกด submit form
    e.preventDefault()                               // ป้องกันการ reload หน้า
    try {
      const res = await actionLogin(form)            // เรียก login ผ่าน store
      const role = res.data.payload.role             // ดึง role ของ user
      roleRedirect(role)                              // redirect ตาม role
      toast.success('Wellcome Back')                 // แสดงข้อความสำเร็จ
    } catch (err) {
      console.log(err)
      const errMsg = err.response?.data?.message
      toast.error(errMsg)                             // แสดงข้อความ error
    }
  }

  const roleRedirect = (role)=>{                      // ตรวจ role แล้ว navigate ไปหน้าเหมาะสม
    if(role === 'admin'){
      navigate('/admin')
    }else{
      navigate('/user')
    }
  }

  return (
    <div>
      Login
      <form onSubmit={handleSubmit}>
        Email
        <input className='border'
          onChange={handleOnChange}                  // bind input change
          name='email'
          type='email'
        />
        Password
        <input className='border'
          onChange={handleOnChange}                  // bind input change
          name='password'
          type="password"
        />
        <button className='bg-blue-500 rounded-md'>
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
