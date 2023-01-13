const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const User = require('../model/user')

exports.requireSignin = async (req, res, next) => {
  try {
    const decoded = await promisify(jwt.verify)(
      req.cookies.token,
      process.env.JWT_ACCESS_SECRECT
    )

    const user = await User.findById(decoded._id)
    if (user) {
      req.user = user
      next()
    } else {
      res.status(401).send('Expired Token I think so')
    }
  } catch (error) {
    console.log(error)
    res.status(401).send('Expired Token I think so')
  }
}
