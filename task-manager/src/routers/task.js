const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

/* Task end points
*   All endpoints require the user to be authenticated to interact with an endpoint.
*   There are endpoints with an ID for a particular task.
*
*
*/



// TEST - Get all tasks
router.get('/tasksAll', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
})

// Create a task
router.post('/tasks', auth, async (req, res) => {
    try {
        const task = new Task({
            // copies everything from body to task
            ...req.body,
            owner: req.user._id
        })
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

/* Get all tasks for logged in user
*   @completed: returns only tasks with set values to true or false
*       Ex: .../tasks?completed=true
*       1. Created an object which initially identifies the owner
*       2. If 'completed' param is passed in, set value appropriately
*
*   @limit: limits number of tasks shown
*       Ex: .../task?limit=10
*
*   @skip: skips number of tasks
*       Ex: .../task?skip=1
*       works in conjuction with limit to achieve pagination
*
*
*   @sortBy: sort in ascending or descending order
*       Ex: .../task?sortBy=createdAt:desc
*/  
router.get('/tasks', auth, async (req, res) => {
    console.log('in 3002 - tasks');
    try {
        // With Mongoose
        const match = {}
        const sort = {}

        if (req.query.completed === 'true') {
            match.completed = true
        } else if (req.query.completed === 'false') {
            match.completed = false
        }

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            // Creating key value pair for ex: 'createdAt': '-1'
            // Key is sort[parts[0]]
            // Value is sort[parts[1]] (after converting the passed in value)
            // if parts[1] equals 'desc', set to -1, otherwise set to 1
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        // Without Mongoose
        // const match = { owner: req.user._id}
        
        // if (req.query.completed === 'true') {
        //     match.completed = true
        // } else if (req.query.completed === 'false') {
        //     match.completed = false
        // }
        
        // const tasks = await Task.find(match)

        // const tasks = await Task.find({ 
        //     owner: req.user._id
        // })
        console.log(req.user.tasks);
        res.send(req.user.tasks)
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
})

// Get one task for logged in user
router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) return res.status(404).send('Task does not exist')
        
        res.send(task)
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
})

// Modify one task
router.patch('/tasks/:id', auth, async (req, res) => {
    console.log('patch');
    // Check if all passed in 'keys' are within 'allowedUpdates'
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) return res.status(400).send({'Error': 'Cannot use outside of ' + allowedUpdates})
    
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) return res.status(404).send('Task does not exist')

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        // Replaced below with above block for middleware compatibility for future
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        res.status(201).send(task)
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
})

// Delete a task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) return res.status(404).send({'Error':'Task not found'})
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router