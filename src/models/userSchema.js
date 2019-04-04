const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const saltRounds = 8
const jwt = require('jsonwebtoken')
const Task = require('./taskSchema')
const userSchema =  new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        uppercase: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email invalido!')
            }
        }
    },
    password: {
        type: String,
        unique: true,
        minLenght: 7,
        required: true,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Senha incorreta!')
            }
        }
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token:{
            type: String,
            required: true,
        }

    }]
},  {
    timestamps: true
})

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'criador'
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateToken = async function(){
    const user = this

    const token = await jwt.sign({_id: user._id.toString()}, process.env.JWT_TOKEN)

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async function(email, password){
    const user = await User.findOne({email})
    
    if(!user){
        throw new Error('Email/Senha Incorretos')
    }

    const isMatch = bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Email/Senha Incorretos')
    }

    return user
}

userSchema.pre('save', async function(next){
    const user = this
    
    if(user.isModified('password')){
        user.password = await bcrypt.genSalt(saltRounds).then((salt) => {
            return bcrypt.hash(user.password, salt)
        })
    }

    next()
})

userSchema.pre('remove', async function(next){
    const user = this

    await Task.deleteMany({criador: user._id})

    next()
})

const User = mongoose.model('User', userSchema)


module.exports = User