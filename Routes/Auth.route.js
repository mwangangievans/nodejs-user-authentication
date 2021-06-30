const express = require('express')
const createHttpError = require('http-errors')
const router = express.Router()
const User = require('../Models/User.model')
const {authSchema} = require('../helpers/validation_schema')
const {signAccessToken} = require('../helpers/jwt_helper')

router.post('/register',async(req,res,next)=>{
   try {
       const {email ,password} = req.body
    ////    if(!email || !password) throw createHttpError.BadRequest()
    const result = await authSchema.validateAsync(req.body)
    console.log(result);
           const doestExist = await User.findOne({email: result.email})
           if(doestExist) throw createHttpError.Conflict(`${result.email} is already registered`)
           const user = new User(result)
           const savedUser = await user.save()
           const accessToken = await signAccessToken(savedUser.id)
           res.send({accessToken})
   } catch (error) {
       if(error.isJoi === true) error.status = 422
       next(error)
   }  
})
router.post('/login',async(req,res,next)=>{
   try {
       const result = await  authSchema.validateAsync(req.body)
       const user = await User.findOne({email:result.email})
       if(!user) throw createHttpError.NotFound('User not registered')
 const isMatch = await user.isValidPassword(result.password)
 if(!isMatch) throw createHttpError.Unauthorized('Username/Password not valid')
 const accessToken = await signAccessToken(user.id)
       res.send({accessToken})
   } catch (error) {
       if(error.isJoi === true)
       return next(createHttpError.BadRequest('invalid Username/Password'))
       next(error)
   }
})

router.post('/refresh-token',async(req,res,next)=>{
    res.send('refresh token route')
})

router.delete('/logout',async(req,res,next)=>{
    res.send('logout route')
})










module.exports = router ;