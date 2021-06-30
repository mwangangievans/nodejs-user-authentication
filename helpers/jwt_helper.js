const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const { token } = require('morgan')

module.exports = {
    signAccessToken: (userId) =>{
        return new Promise((resolve, reject) =>{
            const payload ={}
            const secret = 'evans'
            const options = {
                expiresIn: '1h',
                issuer:'evans.com',
                audience:userId,
            }
            JWT.sign(payload, secret, options,(err,token) =>{
                if(err) reject(err)
                resolve(token)
            })
        })
    },
}