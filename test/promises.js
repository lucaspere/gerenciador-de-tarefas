// require('../src/db/mongoose')
// const jwt = require('jsonwebtoken')
const Task = require('../src/models/taskSchema')
// // const User = require('../src/models/userSchem')
// // const Task = require('../src/models/taskSchem')

// // // User.findOneAndUpdate({name: 'Lucas'}, {name: 'Matheus'}).then((result) => {
// // //     console.log(result)
// // //     return result
// // // }).then((result) => {
// // //     console.log(result)
// // // }).catch((erro) => {
// // //     throw erro
// // // })

// // Task.findByIdAndDelete('5c9bcb62b7493b2b4062f2a4').then((result) => {
// //     console.log(result)

// //     Task.countDocuments({completed: false})
// // }).then((result) => {
// //     console.log(result)
// // }).catch((erro) => {
// //     throw erro
// // })

// const token = jwt.sign({id: '22542df'}, 'segredo')
// console.log(token)

// const lucas = {
//    age: 22,
//    race: 'pardo',
//    height: '1,78'
// }

// lucas.toJSON = function (){
//    const newLucas = {
//       age: 21,
//       race: 'white',
//       height: '1,80' 
//    }
//    return newLucas
// }
// console.log(JSON.stringify(lucas))


const x = async () => {
    const task = await Task.findById('5ca2c3d145f67937ec4dc0e4')
    console.log(task)
}
x()