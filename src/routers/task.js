const express = require('express')
const router = new express.Router
const Task = require('../models/taskSchema')
const auth = require('../middleware/auth')

/* GET /tasks?{
        completed=true or false,
        limit = number,
        skyp = number
*/
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.sortBy){
        const part = req.query.sortBy.split(':')
        sort[part[0]] = part[1] === 'desc' ? 1 : -1
    }

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)

    } catch(erro){
        res.status(302).send('Não encontrado!')
    }
})

router.get('/tasks/:id', auth, async (req, res) => {

    const _id = req.params.id

    try {
        const task = await Task.findOne({_id, criador: req.user._id})
    
        if(!task){
            return res.status(404)
        }

        res.send(task)
    } catch(erro) {
        res.status(302).send(erro)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    let updateTask = Object.keys(req.body)
    let updateTaskAllowed = ['description', 'completed']
    let isValid = updateTask.every((item) => updateTaskAllowed.includes(item))
    
    if(!isValid){
        res.status(404).send('Erro: Invalido as informações')
    }

    try {
        const task = await Task.findOne({id:req.body.id, criador: req.user._id})

        if(!task){
            return res.status(302).send('Não Encontrado')
        }
      
        updateTask.forEach((item) => task[item] = req.body[item])
        await task.save()

        res.send(task)
    } catch(e){
        res.status(302).send(e)
    }
})

router.post('/tasks', auth, async (req, res) => {

    try {
        const task = await new Task({
            ...req.body,
            criador: req.user._id
        })

        task.save()

        res.status(201).send(task)

    } catch(erro){

        res.status(400).send(erro)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {

    try {
        const task = await Task.findOne({id: req.body.id, criador: req.user._id})

        if(!task){
            res.status(404).res.send("Sem permissão para remover Task")
        }

        await task.remove()

        res.send('Task Removido!')

    }catch(e) {

        return res.status(500).res.send(e)
    }
})

module.exports = router