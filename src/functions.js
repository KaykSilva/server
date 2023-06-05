require('dotenv').config({path: 'variables.env'})
const db = require('./db')
const jwt = require('jsonwebtoken')

module.exports.verifyJWT = function (req, res, next) {
    const token = req.headers['x-access-token']
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if(error) return res.status(401).end()

        req.id = decoded.id
        next()
    })
}
module.exports.getUser = function (req, res, next) {
    const values = [
        req.body.username,
        req.body.email,
        req.body.password
    ]

    db.query(('SELECT * FROM users WHERE `email` = ?'), [values[1]], (error, results) => {
        if (error) return res.json(error)

        if(results.length > 0){
            return res.send('User already existes')
        }

        next()
    })
}