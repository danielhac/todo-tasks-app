const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const secret = require('../middleware/secret')

/* The model for User schema
*   Password: 
*       will be stored as hash in DB using bcrypt, which is a one-way conversion.
*   Token:
*       will be stored in DB, which will be created upon creation of User, and each login.
*/
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,       // needs to start from empty db 
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error('Email is invalid.')
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) throw new Error('Invalid password')
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) throw new Error('Age must be a positive number')
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

// Virtual property in Mongoose - to show relationship between two entities
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

/* Method to only display user data we want (removing pw)
* 'toJSON': res.send() method checks if what we're sending is an object. 
*           If so, it calls JSON.stringify() on it which in turn calls 'toJSON' below.
*/
userSchema.methods.toJSON = function() {
    const user = this.toObject()
    delete user.password
    delete user.tokens
    
    return user
}

/* Custom instance method to generate authentication token
*  NOTE: Should genereate random string in production
*  'this' is the single user
*/ 
userSchema.methods.generateAuthToken = async function () {
    
    const token = jwt.sign({ _id: this._id.toString() }, secret)
    this.tokens = this.tokens.concat({ token })
    
    await this.save()
    return token
}

// Custom model method to check email/pw credentials with hash pw
userSchema.statics.findByCredentials = async function (email, password) {
    // 'this' is the single user
    const user = await this.findOne({ email })
    if (!user) throw new Error('Unable to login')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('Unable to login')

    return user
}

// Hash plain text password if new user or if password was changed, before save
userSchema.pre('save', async function (next) {
    // 'this' is the user object
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

// Delete all user's tasks when user is removed -- Mongoose middleware
userSchema.pre('remove', async function (next) {
    // 'this' is the single user
    await Task.deleteMany({ owner: this._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User