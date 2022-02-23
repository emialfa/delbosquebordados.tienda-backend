const jwt = require("jsonwebtoken")
const dev = process.env.NODE_ENV !== "production"
import passport from "passport"

exports.COOKIE_OPTIONS = {
  httpOnly: true,
  // Since localhost is not having https protocol,
  // secure cookies do not work correctly (in postman)
  secure: !dev,
  signed: true,
  maxAge: eval(`${process.env.REFRESH_TOKEN_EXPIRY}`) * 1000,
  sameSite: false,
}

exports.getToken = (user:any) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: eval(`${process.env.SESSION_EXPIRY}`),
  })
}

exports.getRefreshToken = (user:any) => {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: eval(`${process.env.REFRESH_TOKEN_EXPIRY}`),
  })
  return refreshToken
}

exports.verifyUser = passport.authenticate("jwt", { session: false })