const { Prisma } = require("@prisma/client")
const prisma = require("../config/prisma")
const { json } = require("express")

exports.listUsers = async (req, res) => {
    try {
        //code
        const user = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                enabled: true,
                address: true
            }
        })

        res.json(user)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.changeStatus = async (req, res) => {
    try {
        //code
        const { id, enabled } = req.body
        console.log(id, enabled)
        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: { enabled: enabled }
        })
        res.send('Update Status Success')

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.changeRole = async (req, res) => {
    //code
    const { id, role } = req.body
    const user = await prisma.user.update({
        where: { id: Number(id) },
        data: { role: role }
    })
    res.send('Update Role Success')
}

exports.Usercart = async (req, res) => {
  const userId = Number(req.user.id)
  const { cart } = req.body

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ message: 'Cart is empty or invalid' })
  }

  try {
    // เตรียมสินค้าใหม่
    const products = cart.map(item => ({
      productId: item.id,
      count: item.count,
      price: item.price
    }))

    const cartTotal = products.reduce((sum, item) => sum + item.price * item.count, 0)

    // ใช้ transaction ลบ cart เก่าและสร้าง cart ใหม่พร้อมกัน
    const newCart = await prisma.$transaction(async (prisma) => {
      // หา cart เก่าของ user
      const oldCart = await prisma.cart.findFirst({
        where: { orderedById: userId }
      })

      if (oldCart) {
        // ลบสินค้าใน cart เก่า
        await prisma.productOnCart.deleteMany({ where: { cartId: oldCart.id } })
        // ลบ cart เก่า
        await prisma.cart.delete({ where: { id: oldCart.id } })
      }

      // สร้าง cart ใหม่
      return prisma.cart.create({
        data: {
          products: { create: products },
          cartTotal: cartTotal,
          orderedById: userId
        },
        include: { products: true }
      })
    })

    res.json({ message: 'Add Cart Success', cart: newCart })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server Error' })
  }
}


exports.getUserCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: { orderedById: Number(req.user.id) },
      include: {
        products: { include: { product: true } }
      }
    })

    // ถ้า cart ไม่มี ให้ return empty
    if (!cart) {
      return res.json({ products: [], cartTotal: 0 })
    }

    res.json({
      products: cart.products,
      cartTotal: cart.cartTotal
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server Error' })
  }
}

exports.EmptyCart = async (req, res) => {
  const userId = Number(req.user.id)

  try {
    // หา cart ของ user
    const cart = await prisma.cart.findFirst({
      where: { orderedById: userId }
    })

    if (!cart) {
      return res.status(400).json({ message: 'No Cart' })
    }

    // ใช้ transaction ลบ cart และ productOnCart พร้อมกัน
    await prisma.$transaction([
      prisma.productOnCart.deleteMany({ where: { cartId: cart.id } }),
      prisma.cart.delete({ where: { id: cart.id } })
    ])

    res.json({
      message: 'Cart Empty Success'
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server Error' })
  }
}


exports.saveAddress = async (req, res) => {
    try {
        //code
        const { address } = req.body
        const addressUser = await prisma.user.update({
            where: {
                id: Number(req.user.id)
            },
            data: {
                address: address
            }
        })

        res.json({ message: 'Address update Success' })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}


//อันนี้ยากชห
exports.saveOrder = async (req, res) => {
  const userId = Number(req.user.id)

  try {
    //  ดึง cart ของ user
    const userCart = await prisma.cart.findFirst({
      where: { orderedById: userId },
      include: { products: true }
    })

    if (!userCart || userCart.products.length === 0) {
      return res.status(400).json({ ok: false, message: 'Cart is empty' })
    }

    // ตรวจสอบ stock
    for (const item of userCart.products) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { quantity: true, title: true }
      })
      if (!product || item.count > product.quantity) {
        return res.status(400).json({
          ok: false,
          message: `ขออภัย. สินค้า ${product?.title || 'product'} หมด`
        })
      }
    }

    // ใช้ transaction สร้าง order, ลด stock, ลบ cart
    const order = await prisma.$transaction(async (prisma) => {
      // สร้าง order ใหม่
      const newOrder = await prisma.order.create({
        data: {
          products: {
            create: userCart.products.map(item => ({
              productId: item.productId,
              count: item.count,
              price: item.price
            }))
          },
          cartTotal: userCart.cartTotal,
          orderedById: userId // ✅ ใช้ FK ตรง ๆ
        },
        include: { products: true }
      })

      // อัปเดต stock และ sold ของสินค้า
      await Promise.all(
        userCart.products.map(item =>
          prisma.product.update({
            where: { id: item.productId },
            data: {
              quantity: { decrement: item.count },
              sold: { increment: item.count }
            }
          })
        )
      )

      // ลบ cart ของ user
      await prisma.productOnCart.deleteMany({ where: { cartId: userCart.id } })
      await prisma.cart.delete({ where: { id: userCart.id } })

      return newOrder
    })

    res.json({ ok: true, order })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server Error' })
  }
}

exports.getOrder = async (req, res) => {
    try {
        //code
        orders = await prisma.order.findMany({
            where:{ orderedById : Number(req.user.id)},
            include:{ 
                products:{
                    include:{
                        product:true
                    }
                }}
        })
        if(orders.length === 0){
            return res.status(400).json({ok: false,message: 'No orders'})
        }

        res.json({ ok: true, orders})
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}






