const express = require('express')
const router = express.Router()

const { authCheck, adminCheck } = require('../middlewares/authCheck')
const {
    listUsers,
    changeStatus,
    changeRole,
    Usercart,
    getUserCart,
    EmptyCart,
    saveAddress,
    saveOrder,
    getOrder
} = require('../controllers/user')


router.get('/users', authCheck, adminCheck, listUsers)
router.post('/change-status', authCheck, adminCheck,changeStatus)
router.post('/change-role', authCheck, adminCheck,changeRole)


router.post('/user/cart',authCheck, Usercart)
router.get('/user/cart',authCheck, getUserCart)
router.delete('/user/cart',authCheck, EmptyCart)

router.post('/user/address',authCheck, saveAddress)

router.post('/user/order',authCheck, saveOrder)
router.get('/user/order',authCheck, getOrder)




module.exports = router