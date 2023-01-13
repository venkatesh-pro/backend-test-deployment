const express = require('express')
const {
  register,
  validateUserNameIsAvailable,
  sendOTP,
  login,
  logout,
  verifyPhoneOtp,
  confirmRegister,
  protected,
} = require('../controller/user')
const { requireSignin } = require('../middleware/user')

const router = express.Router()

router.post('/register', register)
router.post('/validateUserNameIsAvailable', validateUserNameIsAvailable)
router.post('/sendOTP', sendOTP)
router.post('/verifyPhoneOTP', verifyPhoneOtp)
router.post('/confirmRegister', confirmRegister)
router.post('/login', login)
router.get('/logout', logout)
router.get('/protected', requireSignin, protected)

module.exports = router
