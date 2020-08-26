const jwt  = require ("jsonwebtoken")

const User = require("./userSchema.js")

const authenticate = async(user)=>{
    console.log("here")
try{
   const newToken = await generateJWT({_id:user._id}) 
   console.log(user.username)
   const refreshTok = await generateRefreshJWT({_id:user._id})
   

user.refreshTokens = user.refreshTokens.concat({token:refreshTok})
await user.save()

return {token:newToken,refreshToken:refreshTok}
}catch(error){
    console.log(error)
    throw new Error(error)
}
}
const generateJWT = (payload)=>console.log(payload)
new Promise((res,rej)=>
jwt.sign(
    payload,
    
    process.env.JWT_SECRET,
    { expiresIn: 6 },
    (err, token) => {
      if (err) rej(err)
      res(token)
    }
  )
)

const verifyJWT = (token) =>
new Promise((res, rej) =>
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) rej(err)
    res(decoded)
  })
)

const generateRefreshJWT = (payload) =>
new Promise((res, rej) =>
  jwt.sign(
    payload,
    process.env.REFRESH_JWT_SECRET,
    { expiresIn: "1 week" },
    (err, token) => {
      if (err) rej(err)
      res(token)
    }
  )
)

const refreshToken = async (oldRefreshToken) => {
const decoded = await verifyRefreshToken(oldRefreshToken)

const user = await User.findOne({ _id: decoded._id })

if (!user) {
  throw new Error(`Access is forbidden`)
}

const currentRefreshToken = user.refreshTokens.find(
  (t) => t.token === oldRefreshToken
)

if (!currentRefreshToken) {
  throw new Error(`Refresh token is wrong`)
}


const newAccessToken = await generateJWT({ _id: user._id })
const newRefreshToken = await generateRefreshJWT({ _id: user._id })


const newRefreshTokens = user.refreshTokens
  .filter((t) => t.token !== oldRefreshToken)
  .concat({ token: newRefreshToken })

user.refreshTokens = [...newRefreshTokens]

await user.save()

return { token: newAccessToken, refreshToken: newRefreshToken }
}

const verifyRefreshToken = (token) =>
new Promise((res, rej) =>
  jwt.verify(token, process.env.REFRESH_JWT_SECRET, (err, decoded) => {
    if (err) rej(err)
    res(decoded)
  })
)

module.exports = { authenticate, verifyJWT, refreshToken }


