const mongoose = require('mongoose')
const secret = require('./secret')

mongoose.connect('mongodb+srv://dan:' + secret + '@nodejs-cluster-esv7d.mongodb.net/task-manager?retryWrites=true&w=majority', {
// mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
},
() => console.log('connected to db')
)
