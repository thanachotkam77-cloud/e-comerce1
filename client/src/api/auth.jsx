import axios from 'axios'

// ฟังก์ชันเรียก API เพื่อดึงข้อมูล user ปัจจุบัน (ส่ง JWT token)
export const currentUser = async(token) => 
    await axios.post('http://localhost:5000/api/current-user', {}, {
        headers: { Authorization: `Bearer ${token}` } // ส่ง token ใน header
    })

// ฟังก์ชันเรียก API เพื่อดึงข้อมูล admin ปัจจุบัน (ตรวจสอบว่าเป็น admin)
export const currentAdmin = async(token) => 
    await axios.post('http://localhost:5000/api/current-admin', {}, {
        headers: { Authorization: `Bearer ${token}` } // ส่ง token ใน header
    })
