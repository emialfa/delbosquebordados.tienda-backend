const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs")
import User from "../models/user";
import passport from 'passport'
//Called during login/sign up.
passport.use(new LocalStrategy({
    usernameField: 'email',
      
},async function(email:string, password:string, done:any){
    const user = await User.findOne({email: email});
    
    if(!user) return done(null, false)
    
    if(!bcrypt.compareSync(password, user.passwordHash)) return done(null, false)    

    return done(null, user);
}))

//called while after logging in / signing up to set user details in req.user
passport.serializeUser(function(user:any,done:any){
    done(null,user)
})