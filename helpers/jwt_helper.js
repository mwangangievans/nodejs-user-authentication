const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const { token } = require('morgan')

module.exports = {
    /**
     * 
     * @param {number} userId 
     * @returns {string} token
     */
    signAccessToken: (userId) =>{
        return new Promise((resolve, reject) =>{
            const payload ={}
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn: '1h',
                issuer:'evans.com',
                audience:userId,
            }
            JWT.sign(payload, secret, options,(err,token) =>{
                if(err) {
                console.log(err.message)
                reject(createError.InternalServerError())

                }
                resolve(token) 
            })
        })
    },

    
    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {nextFunction} next 
     * @returns {object} payload
     */
    verifyAccessToken: (req,res,next)=>{
        if(!req.headers['authorization']) return next(createError.Unauthorized())
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,payload) =>{
            if(err){
                const message = err.name === 'jsonWebTokenError' ? 'Unauthorized' : err.message
                return next(createError.Unauthorized(message))
            }
            req.payload = payload
            next()
        })
    },

    /**
     * 
     * @param {number} userId 
     * @returns {string} token
     */
    signRefreshToken:(userId) =>{
        return new Promise((resolve, reject) =>{
            const payload ={}
            const secret = process.env.REFRESH_TOKEN_SECRET
            const options = {
                expiresIn: '1y',
                issuer:'evans.com',
                audience:userId,
            }
            JWT.sign(payload, secret, options,(err,token) =>{
                if(err) {
                console.log(err.message)
                reject(createError.InternalServerError())

                }
                resolve(token)
            })
        })
    },

    /**
     * 
     * @param {string} refreshToken 
     * @returns {number} userId
     */
    verifyRefreshToken: (refreshToken)=>{
        return new Promise((resolve,reject) =>{
            JWT.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,payload)=>{
                if(err) return reject(createError.Unauthorized())
                const userId = payload.aud
                resolve(userId)
            })
        })
    }
}