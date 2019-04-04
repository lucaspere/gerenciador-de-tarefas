const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router()

const User = require('../models/userSchema')
const auth = require('../middleware/auth')
const {enviarEmail} = require('../emails/account')


const avatar = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Formato da imagem inválido!'))
        }
        cb(null, true)
    }
})

router.get('/users/me', auth, async (req, res) =>{
    res.send(req.user)
})

router.get('/users/:id', auth, async (req, res) => {
    const _id = req.params.id

    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send("Usuário não encontrado!")
        }

        res.send(user)

    } catch(erro){
        res.status(404).send(erro)
    }
})

router.get('/users/:id/avatar', async (req, res) => {

    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch(e) {
        res.status(500).send(e)
    }
})

router.patch('/users/me', auth, async (req, res) => {
    let update = Object.keys(req.body)
    let updateAllowed = ['name', 'email', 'password']
    let isValid = update.every((item) => updateAllowed.includes(item))

    if(!isValid){
        res.status(400).send('Erro: Inválido!')
    }
    try {
        update.forEach((item) =>  req.user[item] = req.body[item])

        await req.user.save()

        if(!user){
            return res.status(302).send()
        }

        res.send(req.user)

    } catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)

        const token = await user.generateToken()

        res.status(200).send({user, token})

    } catch(e) {
        res.status(400).send(erro)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {

    try {
        req.user.tokens = []

        await req.user.save()

        res.status(200)

    } catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) =>{
    
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()

        res.send()
    } catch(e){
        res.status(500).send(erro)
    }
})
router.post('/users', async (req, res) => {

    const user = new User(req.body)

    try {

        await user.save()

        enviarEmail(user.email, user.name)

        const token = await user.generateToken()

        res.status(201).send({user, token})

    } catch(erro) {
        res.status(400).send(erro)
    }
})

router.post('/users/me/avatar', auth, avatar.single('avatar'), async (req, res) => {
    
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()

    req.user.avatar = buffer

    await req.user.save()

    res.status(200).send()
    
}, (erro, req, res, next) => {

    res.status(400).send({erro: erro.message})
})

router.delete('/users/me', auth, async (req, res) => {

    try {
       await req.user.remove()
        res.send(req.user)
    } catch(e){
        return res.status(404).send(e)
    }
})

router.delete('/users/me/avatar', auth, async (req, res) => {

    req.user.avatar = undefined

    await req.user.save()

    res.send()
})

module.exports = router