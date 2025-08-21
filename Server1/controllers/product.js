const prisma = require("../config/prisma")
const cloudinary = require('cloudinary').v2;

exports.create = async (req, res) => {
    try {
        //code
        const { title, description, price, quantity, categoryId, images } = req.body

        const product = await prisma.product.create({
            data: {
                title: title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),

                images: {
                    create: images.map((item) => ({
                        asset_id: item.asset_id,
                        public_id: item.public_id,
                        url: item.url,
                        secure_url: item.secure_url
                    }))
                }

            }
        })

        res.send(product)


    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.list = async (req, res) => {
    try {
        //code
        const { count } = req.params
        const products = await prisma.product.findMany({
            take: parseInt(count),
            orderBy: { createdAt: "desc" },
            include: {
                category: true,
                images: true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.read = async (req, res) => {
    try {
        //code
        const { id } = req.params
        const products = await prisma.product.findFirst({
            where: {
                id: Number(id)
            },
            include: {
                category: true,
                images: true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}
exports.update = async (req, res) => {
    try {
        // code
        const { title, description, price, quantity, categoryId, images } = req.body

        // clear
        await prisma.image.deleteMany({
            where: {
                productId: Number(req.params.id)
            }

        })

        const product = await prisma.product.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                title: title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),

                images: {
                    create: images.map((item) => ({
                        asset_id: item.asset_id,
                        public_id: item.public_id,
                        url: item.url,
                        secure_url: item.secure_url
                    }))
                }

            }
        })

        res.send(product)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}
exports.remove = async (req, res) => {
    try {
        //code
        const { id } = req.params

        //!!!!
        await prisma.product.delete({
            where: {
                id: Number(id)
            }
        })
        res.send('Delete Success')

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.listby = async (req, res) => {
    try {
        //code
        const { sort, order, limit } = req.body
        console.log(sort, order, limit)

        const products = await prisma.product.findMany({
            take: limit,
            orderBy: { [sort]: order },
            include: { category: true }
        })


        res.send(products)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}




const handleQuery = async (req, res, query) => {
    try {
        //code
        const products = await prisma.product.findMany({
            where: {
                title: {
                    contains: query,
                }
            },
            include: {
                category: true,
                images: true
            }
        })
        res.send(products)
    } catch (err) {
        //err
        console.log(err)
        res.status(500).send("Search Error")
    }
}

const handlePrice = async (req, res, priceRange) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                price: {
                    gte: priceRange[0],
                    lte: priceRange[1]
                }
            },
            include: {
                category: true,
                images: true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Search Error' })
    }
}
const handleCategory = async (req, res, categoryId) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                categoryId: {
                    in: categoryId.map((id) => Number(id))

                }
            },
            include: {
                category: true,
                images: true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Search Error' })
    }
}



exports.searchFilter = async (req, res) => {
    try {
        //code
        const { query, category, price } = req.body

        if (query) {
            console.log('query-->', query)
            await handleQuery(req, res, query)
        }
        if (category) {
            console.log('category-->', category)
            await handleCategory(req, res, category)

        }
        if (price) {
            console.log('price-->', price)
            await handlePrice(req, res, price)
        }


    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});




exports.createImages = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.body.image,{
            plublic_id: `${Date.now()}`,
            resource_type: 'auto',
            folder: 'Ecom2025'
        })
        res.send(result)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}
exports.removeImage = async (req, res) => {
    try {

        res.send('Hello remove Images')

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}