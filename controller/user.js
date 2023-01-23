const User = require('../model/user')
const crypto = require('crypto')
const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)
const jwt = require('jsonwebtoken')

const generateOTP = (otp_length) => {
  var digits = '0123456789'
  let OTP = ''
  for (let i = 0; i < otp_length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)]
  }
  return OTP
}

exports.validateUserNameIsAvailable = async (req, res) => {
  let { username } = req.body

  const userExist = await User.findOne({ username })

  if (userExist) {
    return res.json(false)
  }

  return res.json(true)
}

exports.register = async (req, res) => {
  let { phoneNumber, username } = req.body

  const userExist = await User.findOne({ username })

  if (userExist) {
    return res.status(400).json({
      error: 'User Already Exists',
    })
  }

  const user = await User.create({
    phoneNumber,
    username,
  })
  res.json('success')
}

exports.sendOTP = async (req, res) => {
  try {
    let { phoneNumber, username } = req.body

    const user = await User.findOne({ username })

    const otp = generateOTP(6)

    user.phoneOtp = otp
    await user.save()

    client.messages
      .create({
        body: `Your One Time Login Password Is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${phoneNumber}`,
      })
      .then((messages) => console.log(messages))
      .catch((err) => console.error(err))

    res.status(200).json('OTP Send Success')
  } catch (error) {
    console.log(error)
    res.status(400).json({
      error: 'Register Failed',
    })
  }
}
exports.verifyPhoneOtp = async (req, res, next) => {
  try {
    const { phoneOtp, username } = req.body
    const user = await User.findOne({ username })

    if (!user) {
      return res.status(400).json({
        error: 'USER_NOT_FOUND_ERR',
      })
    }

    if (user.phoneOtp !== phoneOtp) {
      return res.status(400).json({
        error: 'INCORRECT_OTP_ERR',
      })
    }

    // otp verified

    user.phoneOtp = ''
    await user.save()

    const token = jwt.sign({ _id: user._id }, process.env.JWT_ACCESS_SECRECT, {
      expiresIn: '30d',
    })

    res
      .cookie('token', token, {
//         httpOnly: true,
        sameSite: 'strict',
        secure: false
      })
      .json(user)
  } catch (error) {
    res.status(400).json({
      error: 'Verify OTP Failed',
    })
  }
}

exports.confirmRegister = async (req, res) => {
  let { username, email, fullname } = req.body

  const user = await User.findOne({ username })

  const data = await User.findByIdAndUpdate(
    user._id,
    {
      email,
      fullname,
    },
    {
      new: true,
    }
  )

  res.json(data)
}

exports.login = async (req, res) => {
  const { userId } = req.body

  const user = await User.findById(userId)
  // .populate('channel')
  res.json(user)
}

exports.logout = async (req, res) => {
  try {
    res.clearCookie('token')
    return res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.json({
      error: error.message,
    })
  }
}

exports.protected = async (req, res) => {
  try {
    console.log(req.user._id)
    res.json(req.user)
  } catch (error) {
    console.log(error)
    res.json({
      error: error.message,
    })
  }
}
