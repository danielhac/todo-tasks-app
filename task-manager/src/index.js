/*  
*   A to-do task list REST API server-side application built with Node.js, Express and MongoDB / Mongoose.
*     - Uses two routers: user, task
*/

const express = require('express')
const cors = require('cors')                // https://expressjs.com/en/resources/middleware/cors.html
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

/* Node.js application using express as a server and MongoDB/Mongoose for the DB
*   1. Start MongoDB
*       Locally: /Users/Dan/Documents/Code/mongodb/bin/mongod --dbpath=/Users/Dan/Documents/Code/mongodb-data
*   2. Start Node.js app for task manager
*       Locally in root folder: npm run dev
*   3. Start Node.js app for task client
*       Locally in root folder: nodemon index.js
*/

const app = express()


app.use(cors())
const port = process.env.PORT || 3002

// Parse incoming JSON to an object
app.use(express.json())

// Routers
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is running on port ' + port)
})
