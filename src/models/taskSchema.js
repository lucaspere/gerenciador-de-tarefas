const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        trim: true,
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
    },
    criador: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},
    {
    timestamps: true
})

taskSchema.pre('save', async function(next){
    const task = this

    if(!task.completed){
        console.log('Você precisa terminar a tarefa!')
    }

    next()
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
