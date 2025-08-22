import axios from 'axios'                         
// axios ใช้เรียก API จาก backend

import { create } from 'zustand'                  
// create ใช้สร้าง store ของ zustand

import { persist, createJSONStorage } from 'zustand/middleware' 
// persist ใช้เก็บ state ลง localStorage เพื่อจำค่าไว้หลัง refresh
// createJSONStorage ระบุรูปแบบ storage ที่จะเก็บ

import { listCategory } from '../api/Category'   
import { listProduct,searchFilters } from '../api/product'

import _ from 'lodash'

// สร้าง store หลัก
const ecomStore = (set,get) => ({
    user: null,                                   // state สำหรับเก็บข้อมูลผู้ใช้
    token: null,                                  // state สำหรับเก็บ token ของ user
    categories : [],                              // state เก็บ list category
    products: [],
    carts:[],                                 // state เก็บ list product

    actionAddtoCart:(product)=>{
        const carts = get().carts
        const updateCart = [...carts,{...product, count:1}]

        //Uniqe
        const uniqe = _.unionWith(updateCart,_.isEqual)
        set({carts: uniqe})




    },

    actionUpdateQuantity: (productId,newQuantity)=>{
        // console.log('Update Click!!!')
        set((state)=>({
            carts: state.carts.map((item)=>
                item.id === productId
            ? {...item,count: Math.max(1,newQuantity)}
            :item
            )

        }))

    },
    actionRemoveProduct: (productId )=>{
        set((state)=>({
            carts: state.carts.filter((item)=>
                item.id !== productId
            )
        }))
    },
    getTotalPrice: ()=>{
        return get().carts.reduce((total,item)=>{
            return total + item.price * item.count
        },0)
    },
    // ฟังก์ชัน login
    actionLogin: async (form) => {                
        const res = await axios.post('http://localhost:5000/api/login', form) 
        // เรียก API login ด้วยข้อมูล form ที่ส่งมา

        console.log(res.data.token)               // log token จาก backend

        set({                                     // อัพเดตค่า state ใน store
            user: res.data.payload,               // เก็บข้อมูลผู้ใช้
            token: res.data.token                 // เก็บ token
        })

        return res                                // return response กลับไปให้ component
    },

    // ฟังก์ชันดึง category
    getCategory : async () => {
        try {
            const res = await listCategory() // เรียก API listCategory
            set({categories: res.data})           // อัพเดต state categories
        } catch (err) {
            console.log(err)
        }
    },

    // ฟังก์ชันดึง product
    getProduct : async (count) => {
        try {
            const res = await listProduct(count) // เรียก API listProduct
            set({products: res.data})                   // อัพเดต state products
        } catch (err) {
            console.log(err)
        }
    },
    actionSearchFilters : async (arg) => {
        try {
            const res = await searchFilters(arg)
            set({products: res.data})           
        } catch (err) {
            console.log(err)
        }
    },
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
