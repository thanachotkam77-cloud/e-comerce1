const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')

// Middleware ตรวจสอบ token และ user เบื้องต้น
exports.authCheck = async (req, res, next) => {
    try {
        const headerToken = req.headers.authorization
        console.log(headerToken)

        if (!headerToken) { 
            // ถ้าไม่มี header Authorization ส่ง 401 (Unauthorized)
            return res.status(401).json({ message: 'No Token, Auth' })
        }

        const token = headerToken.split(" ")[1] // ดึง token จาก "Bearer <token>"

        const decode = jwt.verify(token, process.env.SECRET) // ตรวจสอบความถูกต้องของ token
        req.user = decode // เก็บข้อมูล user จาก token ไว้ใน req

        // ตรวจสอบ user ใน database
        const user = await prisma.user.findFirst({
            where: {
                email: req.user.email
            }
        })

        if (!user || !user.enabled) { 
            // ถ้า user ไม่พบ หรือถูก disable ส่ง 400 (Bad Request)
            return res.status(400).json({ message: 'This account cannot access' })
        }

        console.log(user)
        console.log('Hello middleware')
        next() // ผ่านการตรวจสอบ → ไป middleware หรือ route ต่อไป

    } catch (err) {
        console.log(err)
        // ถ้า token ไม่ถูกต้องหรือเกิด error อื่น ส่ง 500
        res.status(500).json({ message: 'Token Invalid' })
    }
}

// Middleware ตรวจสอบสิทธิ์ admin
exports.adminCheck = async (req, res, next) => {
    try {
        const { email } = req.user

        const adminUser = await prisma.user.findFirst({
            where: { email: email }
        })

        if (!adminUser || adminUser.role !== 'admin') { 
            // ถ้า user ไม่ใช่ admin → ส่ง 403 (Forbidden)
            return res.status(403).json({ message: 'Access Denied: Admin Only' })
        }

        // ถ้าเป็น admin → ไป middleware หรือ route ต่อไป
        next()
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error Admin access denied' })
    }
}
