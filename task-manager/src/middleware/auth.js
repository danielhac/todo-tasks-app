const jwt = require('jsonwebtoken')
const User = require('../models/user')
const secret = require('./secret')

/* Authenticates the user before allowing to proceed to 'next()'
*   1. Takes token from header 'Authorization'
*   2. Validates token along with a randomized string
*   3. Finds user in DB using the '_id' and 'token' part of the token 
*
*   @tokens.token: from user.js model -- checks if user has a token
*/
const auth = async (req, res, next) => {
    try {
        // console.log(req.headers);
        const token = req.header('Authorization').replace('Bearer ', '')
        const validate = jwt.verify(token, secret)
        const user = await User.findOne({ _id: validate._id, 'tokens.token': token})
        if (!user) throw new Error()
        
        // pass token and user info to calling function
        req.token = token
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({'error': 'Not authenticated'})
    }
}

module.exports = auth