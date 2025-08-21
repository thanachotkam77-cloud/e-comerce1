const express = require('express')
const router = express.Router()
const { register,login,CurrentUser } = require('../controllers/auth')

//import middleware
const { authCheck, adminCheck}= require('../middlewares/authCheck')

router.post('/register',register)
router.post('/login',login)
router.post('/current-user',authCheck, CurrentUser)
router.post('/current-admin',authCheck, adminCheck, CurrentUser)








module.exports = router