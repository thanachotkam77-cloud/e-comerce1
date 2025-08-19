const express = require('express')
const router = express.Router()
const { register,login,CurrentUser } = require('../controllers/auth')



router.post('/register',register)
router.post('/login',login)
router.post('/current-user',CurrentUser)
router.post('/current-admin',CurrentUser)








module.exports = router