import React, { useState, useEffect } from 'react'
// useEcomStore คือ Zustand store ของเรา เอาไว้เก็บ state แบบ global
import useEcomStore from '../../store/ecom-store'
// เรียก API สำหรับจัดการสินค้า
import { createProduct, readProduct, listProduct, updateProduct } from '../../api/product'
import { toast } from 'react-toastify'
import UploadFile from './UploadFile' // component สำหรับอัพโหลดรูป
import { useParams, useNavigate } from 'react-router-dom' // ใช้ดึง id จาก URL และ navigate หน้าใหม่

// ค่าเริ่มต้นของฟอร์ม
const initialState = {
    title: "phone45",
    description: "desc",
    price: 300,
    quantity: 10,
    categoryId: '',
    images: []
}

const FormEditProduct = () => {
    const { id } = useParams() // ดึง id ของสินค้าที่จะแก้ไขจาก URL
    const navigate = useNavigate() // ใช้เปลี่ยนหน้าเมื่อแก้ไขเสร็จ
    const token = useEcomStore((state) => state.token) // ดึง token ของ user
    const getCategory = useEcomStore((state) => state.getCategory) // ฟังก์ชันดึง category
    const categories = useEcomStore((state) => state.categories) // list ของ category

    const [form, setForm] = useState(initialState) // state ของฟอร์มสินค้า

    useEffect(() => {
        getCategory() // โหลด category จาก server
        fetchProduct(token, id, form) // โหลดข้อมูลสินค้าที่จะแก้ไข
    }, [])

    // ฟังก์ชันดึงข้อมูลสินค้า
    const fetchProduct = async(token, id, form) => {
        try {
            const res = await readProduct(token, id, form) // เรียก API
            console.log('res form backend', res)
            setForm(res.data) // นำข้อมูลจาก backend มาใส่ฟอร์ม
        } catch(err) {
            console.log('Err fetch data', err)
        }
    }
    console.log(form) // debug ดูข้อมูลฟอร์ม

    // ฟังก์ชัน handle input ทุกช่อง
    const handleOnchange = (e) => {
        console.log(e.target.name, e.target.value)
        setForm({
            ...form, // คงค่าที่มีอยู่แล้ว
            [e.target.name]: e.target.value // เปลี่ยนค่าช่องที่แก้ไข
        })
    }

    // ฟังก์ชัน submit form
    const handleSubmit = async (e) => {
        e.preventDefault() // ป้องกัน refresh หน้า
        try {
            const res = await updateProduct(token, id, form) // เรียก API อัพเดตสินค้า
            toast.success(`เพิ่มข้อมูล ${res.data.title} สำเร็จ`) // แสดงข้อความสำเร็จ
            navigate('/admin/product') // เปลี่ยนหน้าไปหน้า list สินค้า
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='container mx-auto p-4 bg-white shadow-md'>
            <form onSubmit={handleSubmit}>
                <h1>เพิ่มข้อมูลสินค้า</h1>
                {/* input title */}
                <input type="text"
                    className='border'
                    value={form.title}
                    onChange={handleOnchange}
                    placeholder='Title'
                    name='title'
                />
                {/* input description */}
                <input type="text"
                    className='border'
                    value={form.description}
                    onChange={handleOnchange}
                    placeholder='Description'
                    name='description'
                />
                {/* input price */}
                <input type="number"
                    className='border'
                    value={form.price}
                    onChange={handleOnchange}
                    placeholder='Price'
                    name='price'
                />
                {/* input quantity */}
                <input type="number"
                    className='border'
                    value={form.quantity}
                    onChange={handleOnchange}
                    placeholder='Quantity'
                    name='quantity'
                />
                {/* select category */}
                <select className='border'
                    name='categoryId'
                    onChange={handleOnchange}
                    required
                    value={form.categoryId}
                >
                    <option value="" disabled>Please Select</option>
                    {
                        categories.map((item, index) =>
                            <option key={index} value={item.id}>{item.name}</option>
                        )
                    }
                </select>
                <hr />
                {/* component สำหรับอัพโหลดรูป */}
                <UploadFile form={form} setForm={setForm}/>
                <button className='bg-blue-500'>แก้ไขสินค้า</button>
                <hr />
                <br />
            </form>
        </div>
    )
}

export default FormEditProduct
