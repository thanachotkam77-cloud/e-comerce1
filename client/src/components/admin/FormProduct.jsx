import React, { useState, useEffect } from 'react'
// Zustand store ของเรา สำหรับเก็บ token, products, categories
import useEcomStore from '../../store/ecom-store'
// API สำหรับสร้างและลบสินค้า
import { createProduct, deleteProduct } from '../../api/product'
import { toast } from 'react-toastify' // แสดงข้อความแจ้งเตือน
import UploadFile from './UploadFile' // component สำหรับอัพโหลดรูป
import { Link } from 'react-router-dom' // ใช้ทำลิงก์ไปหน้าแก้ไขสินค้า

// ค่าเริ่มต้นของฟอร์ม
const initialState = {
    title: "",
    description: "",
    price: null,
    quantity: null,
    categoryId: '',
    images: []
}

const FormProduct = () => {
    const token = useEcomStore((state) => state.token) // ดึง token ของ user
    const getCategory = useEcomStore((state) => state.getCategory) // ฟังก์ชันดึง category
    const categories = useEcomStore((state) => state.categories) // list ของ category
    const getProduct = useEcomStore((state) => state.getProduct) // ฟังก์ชันดึงสินค้าทั้งหมด
    const products = useEcomStore((state) => state.products) // list ของสินค้า

    const [form, setForm] = useState({
    title: "",
    description: "",
    price: null,
    quantity: null,
    categoryId: '',
    images: []
}) // state ของฟอร์มสินค้า

    useEffect(() => {
        getCategory() // โหลด category จาก server
        getProduct(50) // โหลดสินค้าจำนวน 30 ตัว
    }, [])

    // ฟังก์ชัน handle input ทุกช่อง
    const handleOnchange = (e) => {
        console.log(e.target.name, e.target.value)
        setForm({
            ...form, // คงค่าที่มีอยู่แล้ว
            [e.target.name]: e.target.value // เปลี่ยนค่าช่องที่แก้ไข
        })
    }

    // ฟังก์ชัน submit form เพื่อสร้างสินค้า
    const handleSubmit = async (e) => {
        e.preventDefault() // ป้องกัน refresh หน้า
        try {
            const res = await createProduct(token, form) // เรียก API สร้างสินค้า
            setForm(initialState) // ล้างฟอร์มหลังเพิ่มสำเร็จ
            getProduct() // รีเฟรช list สินค้า
            toast.success(`เพิ่มข้อมูล ${res.data.title} สำเร็จ`) // แสดงข้อความสำเร็จ
        } catch (err) {
            console.log(err)
        }
    }

    // ฟังก์ชันลบสินค้า
    const handleDelete = async (id) =>{
        console.log(id)
        if(window.confirm('จะลบจริงใช่มะ')){ // ยืนยันการลบ
            try{
                const res = await deleteProduct(token,id) // เรียก API ลบสินค้า
                toast.success('Delete Product Success') // แจ้งเตือนลบสำเร็จ
                getProduct() // รีเฟรช list สินค้า
            }catch(err){
                console.log(err)
            }
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
                    required
                />
                {/* input quantity */}
                <input type="number"
                    className='border'
                    value={form.quantity}
                    onChange={handleOnchange}
                    placeholder='Quantity'
                    name='quantity'
                    required
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
                <UploadFile form={form} setForm={setForm} />
                <button className='bg-blue-500 cursor-pointer p-1 rounded-md'>เพิ่มสินค้า</button>
                <hr />
                <br />
                {/* ตารางแสดงรายการสินค้า */}
                <table className="table w-full">
                    <thead className='bg-gray-200'>
                        <tr>
                            <th scope="col">No.</th>
                            <th scope="col">รูปภาพ</th>
                            <th scope="col">ชื่อสินค้า</th>
                            <th scope="col">รายละเอียด</th>
                            <th scope="col">ราคา</th>
                            <th scope="col">จำนวน</th>
                            <th scope="col">จำนวนที่ขายได้</th>
                            <th scope="col">วันที่อัพเดท</th>
                            <th scope="col">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((item, index) => {
                                console.log(item)
                                return (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>
                                            {item.images.length > 0
                                                ? <img
                                                    className='w-24 h-24 rounded-lg shadow-md '
                                                    src={item.images[0].url} />
                                                : <div
                                                    className='w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center shadow-md'
                                                >No Image</div>
                                            }
                                        </td>
                                        <td>{item.title}</td>
                                        <td>{item.description}</td>
                                        <td>{item.price}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.sold}</td>
                                        <td>{item.updatedAt}</td>
                                        {/* ปุ่มแก้ไข / ลบ */}
                                        <td className="px-4 py-2 flex gap-2">
                                            <p className='bg-yellow-300 rounded-md p-1 shadow-md'>
                                                <Link to={'/admin/product/' + item.id}>แก้ไข</Link>
                                            </p>
                                            <p
                                                className='bg-red-500 rounded-md p-1 shadow-md cursor-pointer'
                                                onClick={()=>handleDelete(item.id)}
                                            >ลบ</p>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </form>
        </div>
    )
}

export default FormProduct
