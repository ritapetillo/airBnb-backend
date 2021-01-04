const jwt = require('jsonwebtoken')

const auth = async (req,res,next)=>{
    const token = req.header('auth-token')
    if(!token){
        const error = new Error('Access Denied')
        error.code = 401
        next(error)
    } else{ 
        try{
            const verified  = await jwt.verify(token,process.env.TOKEN_SECRET )
            req.user = verified
            next()
        
        } catch(err){
            console.log(err)
            const error = new Error('Invalid Token')
        error.code = 40
        next(error)
        }
    
    }

}

module.exports = auth