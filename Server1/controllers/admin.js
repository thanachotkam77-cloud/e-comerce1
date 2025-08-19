const prisma = require("../config/prisma")

exports.changeOrderStatus = async (req, res) => {
    try {
        //code
        const { orderId, orderStatus } = req.body
        // console.log(orderId,orderStatus)
        const orderUpdate = await prisma.order.update({
            where: { id: orderId },
            data: { orderStatus: orderStatus }
        })

        res.json(orderUpdate)
    } catch (err) {
        console.log(err)
        res.send(500).json({ message: 'Server Error' })
    }
}

exports.getOrderAdmin = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                products: {
                    include: {
                        product: true
                    }
                },
                orderedBy: {
                    select: {
                        id: true,
                        email: true,
                        address: true
                    }

                }
            }
        })
        res.send(orders)

    } catch (err) {
        console.log(err)
        res.send(500).json({ message: 'Server Error' })
    }
}