const passport = require("passport")
const GStragegy = require("passport-google-oauth20")
const Schema = require("./userSchema")
const {authanticate, refreshToken} =require("./authTools")
const { authenticate } = require("passport")



passport.use(
    "google",new GStragegy(
        {
            clientID:process.env.clientID,
            clientSecret: process.env.clientSecret,
            callbackURL:"https://localhost:3002/users/redirectGoogle"

        },
        async (accessToken,refreshToken,profile,done)=>{
const newUser = {
    googleId:profile.id,
    firstname:profile.name.givenName,
    lastname:profile.name.familyName,
    surname:profile.emails[0].value,
    role:"user",
    refreshTokens:[],
}

try{
const user = await Schema.findOne({googleId:profile.id})
if(user){
const tokens = await authenticate(user)
done(null,{user,tokens})
}else{
    createdUser = await Schema.create(newUser)
    const tokens = await authanticate(createdUser)
    done(null,{createdUser,tokens})
}
}catch(error){
    done(error)
    console.log(error)
}
        }
    )
)
passport.serializeUser(function(user,done){
    done(null,user)
})
passport.deserializeUser(function(user,done){
    done(null,user)
})
