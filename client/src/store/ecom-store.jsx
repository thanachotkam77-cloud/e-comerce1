import axios from 'axios'                         // ใช้ axios สำหรับเรียก API
import { create } from 'zustand'                  // ใช้สร้าง store ของ zustand
import { persist, createJSONStorage } from 'zustand/middleware' // ใช้ middleware persist เพื่อเก็บ state ลง localStorage
import { listCategory } from '../api/Category'
import { listProduct } from '../api/product'

// กำหนด store หลัก
const ecomStore = (set) => ({
    user: null,                                   // state สำหรับเก็บข้อมูลผู้ใช้
    token: null,
    categories : [],
    products: [],                              // state สำหรับเก็บ token ที่ได้จาก backend
    actionLogin: async (form) => {                // ฟังก์ชัน login รับ form ที่ส่งมาจากหน้า UI
        const res = await axios.post('http://localhost:5000/api/login', form) // เรียก API login
        console.log(res.data.token)               // log token ที่ได้จาก backend
        set({                                     // อัพเดตค่า state ใน store
            user: res.data.payload,               // เก็บข้อมูลผู้ใช้จาก response
            token: res.data.token                 // เก็บ token ที่ได้
        })
        return res                                // return response กลับไปให้ component ที่เรียกใช้งาน
    },
    getCategory : async (token) => {
            try {
                const res = await listCategory(token)
                set({categories: res.data})
            } catch (err) {
                console.log(err)
    
            }
        },
    getProduct : async (token,count) => {
            try {
                const res = await listProduct(token,count)
                set({products: res.data})
            } catch (err) {
                console.log(err)
    
            }
        }
})

// ตั้งค่าให้ state ถูกเก็บลง localStorage แบบ persist
const usePersist = {
    name: 'ecom-store',                           // ชื่อ key ใน localStorage
    storage: createJSONStorage(() => localStorage) // ระบุว่าจะเก็บใน localStorage
}

// รวม store + persist เข้าเป็น store เดียว
const useEcomStore = create(persist(ecomStore, usePersist))

// export ออกไปให้ component อื่นใช้งาน
export default useEcomStore
