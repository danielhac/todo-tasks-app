const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

/* User ends points
*   There are no endpoints with an ID since it uses jwt authentication for each end point.
*
* 
*
*/

// Create a user
router.post('/users', async (req, res) => {
    try {
        const user = await new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

// Login user
router.post('/users/login', async (req, res) => {
    try {
        // console.log(req.body);
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        // res.setHeader('Set-Cookie', token + '; HttpOnly')
        // res.setHeader('Set-Cookie', 'foo=bar; HttpOnly')
        // res.setHeader('Content-Type', 'text/html');
        // res.setHeader('Content-Length', Buffer.byteLength(body));
        // res.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
        // res.cookie('token', token, { expires: new Date(Date.now() + 900000), httpOnly: true })
        res.cookie('token', token, { expires: new Date(Date.now() + 900000), httpOnly: true })
        // console.log(res);
        // req.setHeader('foo', 'bar')
        res.status(200).send({ user, token })
        // res.send({ token })
        res.end()
    } catch (error) {
        console.log(error);
        res.status(401).send(error)
    }
})

// Logout user
// @auth: authenticate user in auth.js
router.post('/users/logout', auth, async (req, res) => {
    console.log(req.token);
    try {
        // Remove token from user 
        // Return true if token.token not equal to req.token -- keeping token
        // Return false -- removing token
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send()
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
})

// Logout user of all sessions
// @auth: authenticate user in auth.js
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        // Remove all tokens from user
        req.user.tokens = []

        await req.user.save()
        res.send()
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
})

// Get self -- user's profile
// @auth: authenticate user in auth.js
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// Modify a user
router.patch('/users/me', auth, async (req, res) => {
    // Check if all passed in 'keys' are within 'allowedUpdates'
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) return res.status(400).send({'Error': 'Cannot use outsdie of ' + allowedUpdates})

    try {
        // const user = await User.findById(req.user._id)
        // if (!user) return res.status(404).send({'Error':'User not found'})

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        
        // Replaced below with above block for middleware compatibility for hashing pw
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
        
        res.send(req.user)
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
})

// Delete a user
// @auth: authenticate user in auth.js
// @req.user_id: passed from auth
router.delete('/users/me', auth, async (req, res) => {
    try {
        // await User.findByIdAndDelete(req.user._id) // this doesn't work
        await req.user.remove()
        res.send('User deleted')
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router