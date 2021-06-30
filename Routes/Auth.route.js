const express = require('express')
const createHttpError = require('http-errors')
const router = express.Router()
const User = require('../Models/User.model')
const {authSchema} = require('../helpers/validation_schema')
const {signAccessToken, signRefreshToken} = require('../helpers/jwt_helper')

router.post('/register',async(req,res,next)=>{
   try {
    const {email ,password} = req.body
    const result = await authSchema.validateAsync(req.body)
    console.log(result);
    const doestExist = await User.findOne({email: result.email})
    if(doestExist) throw createHttpError.Conflict(`${result.email} is already registered`)
    const user = new User(result)
    const savedUser = await user.save()
    const accessToken = await signAccessToken(savedUser.id)
    const refreshToken = await signRefreshToken(savedUser.id)
    res.send({accessToken , refreshToken ,verifyRefreshToken})
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
    const refreshToken = await signRefreshToken(user.id)
       res.send({accessToken,refreshToken})
} catch (error) {
    if(error.isJoi === true)
    return next(createHttpError.BadRequest('invalid Username/Password'))
    next(error)
   }
})
router.post('/refresh-token',async(req,res,next)=>{
    try {
        const {refreshToken} = req.body 
        if(!refreshToken) throw createHttpError.BadRequest()
        const  userId = await verifyRefreshToken(refreshToken)

        const accessToken = await signAccessToken(userId)
        const refToken = await signRefreshToken(userId)
         res.send({ accessToken,refreshToken: refToken})
    }catch (error) {
        next(error)
    }
})

router.delete('/logout',async(req,res,next)=>{
    res.send('logout route')
})

module.exports = router ;