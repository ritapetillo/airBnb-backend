const express = require('express')
const User = require('../../models/User')
const validation = require ('../../lib/validationMiddleware')
const schemas = require('../../lib/validationSchema')
const userRouter = express.Router()
const bcrypt = require('bcryptjs')
const auth = require('../../lib/privateRoutes')
const validationMiddleware = require('../../lib/validationMiddleware')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const cloudinary = require('../../lib/cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const {TOKEN_SECRET} = process.env

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'users',
    //   format: async (req, file) => 'png', // supports promises as well
    //   public_id: (req, file) => 'computed-filename-using-request',
    },
  });
   
  const parser = multer({ storage: storage });


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

userRouter.get('/me',auth,async(req,res,next)=>{
const {id} = req.user
    try{
    const user = await User.findById(id)
    res.send(user)

    } catch(err){
        const error = new Error ('there is a probelm finding user')
        error.httpStatus = 404
        next(error)
    }
})

//POST users/register 
//register a new user
userRouter.post('/register',validation(schemas.userSchema),async(req,res,next)=>{
    try{
        //check if email already exist
        const userExist = await User.findOne({email:req.body.email})
        if(userExist){
            const err = new Error('user already exists')
            err.code = 400
            next(err)  
        }
        //if user email doesn't exist, create user

        //hash password
        const salt = await bcrypt.genSalt()
        const password = await bcrypt.hash(req.body.password,salt)

    const newUser = await new User({...req.body,password,
    createdAt:Date.now(),
updatedAt:Date.now()})
const sentUser = await newUser.save()
res.send({userId:sentUser._id, username:sentUser.email})
    

    } catch(err){
        console.log(err)
        const error = new Error ('there is a probelm creating a new user')
        error.httpStatus = 404
        next(error)
    }
})

userRouter.post('/avatar/:id',parser.single('avatar'),async(req,res,next)=>{
    let imageUris;
    const {id} = req.params
        //check if image exist
        if (req.file && req.file.path) {// if only one image uploaded
            imageUris = req.file.path; // add the single  
        };
        try{
            const user = await User.findById(id)
            const editedUser = {
                ...user,
                images:imageUris,
                updateAt:Date.now()
            }
            user = await User.findByIdAndUpdate(id,editedUser)
            res.send(user)   

        }catch(err){
            console.log(err)
        }
})

//POST /users/login
//login user
userRouter.post('/login',validationMiddleware(schemas.loginSchema),async(req,res,next)=>{
    const {email,password} = req.body
    try{
        const user = await User.findOne({email})
        //verify that there is a user with that email
        if(!user) {
            const error = new Error('Username or password is wrong')
        error.code = 400
        next(error)
        }
        //if the user exist, then verify password
        const validPass = await bcrypt.compare(password,user.password)
        if(validPass){
            const token = jwt.sign({id:user._id},TOKEN_SECRET)
            res.header('auth-token',token).send(token)
        }  else next(new Error('Username or password is wrong'))      

    }catch(err){
        console.log(err)
        const error = new Error('Login failed')
        error.code = 400
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

userRouter.delete('/:id',async(req,res,next)=>{
    const {id} = req.params
    try{
   
const userDeleted = await User.findByIdAndDelete(id)
res.send(userDeleted)
    

    } catch(err){
        const error = new Error ('there is a probelm deleting a new user')
        error.httpStatus = 404
        next(error)
    }
})






module.exports = userRouter