const express = require('express')
const User = require('../../models/User')
const validation = require ('../../lib/validationMiddleware')
const schemas = require('../../lib/validationSchema')
const userRouter = express.Router()

userRouter.get('/',async(req,res,next)=>{
    try{
    const users = await User.find()
    res.send(users)

    } catch(err){
        const error = new Error ('there is a probelm finding users')
        error.httpStatus = 404
        next(error)
    }
})

userRouter.post('/',validation(schemas.userSchema),async(req,res,next)=>{
    try{
    const newUser = await new User({...req.body,
    createdAt:Date.now(),
updatedAt:Date.now()})
const sentUser = await newUser.save()
res.send(sentUser)
    

    } catch(err){
        const error = new Error ('there is a probelm creating a new user')
        error.httpStatus = 404
        next(error)
    }
})
userRouter.put('/:id',validation(schemas.userSchema),async(req,res,next)=>{
    const {id} = req.params
    try{
    const editedUser = await {...req.body,
updatedAt:Date.now()}
const sentUser = await User.findByIdAndUpdate(id,editedUser)
res.send(sentUser)
    

    } catch(err){
        const error = new Error ('there is a probelm editing a new user')
        error.httpStatus = 404
        next(error)
    }
})

module.exports = userRouter