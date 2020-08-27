const { Schema } = require("mongoose")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const v = require("validator")

const UserSchema = new Schema(
  {
  
    username: {
      type: String,
      required: true,
      unique:true
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
    },
 
 
    firstname: {
        type: String,
        required: true,
      },
       
    lastname: {
        type: String,
        required: true,
      },
    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
    },
    refreshTokens: [
        {
          token: {
            type: String,
            required: true,
          },
        },
      ],
      googleId: String,
}
   
)

UserSchema.statics.findByCredentials = async (username, password) => {
  const user = await UserModel.findOne({ username })

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) return user
    else return null
  } else return null
}

UserSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.__v

  return userObject
}

UserSchema.pre("save", async function (next) {
  const user = this

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})



const UserModel = mongoose.model("user", UserSchema)

module.exports = UserModel