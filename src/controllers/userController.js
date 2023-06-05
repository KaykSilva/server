require('dotenv').config({path: 'variables.env'})

const { json } = require('body-parser')
const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    getUsers: (_, res) => {
        db.query(('SELECT * FROM users'), (error, results) => {
            if (error) return res.json(error)

            return res.status(200).json(results)
        })
    },

    newUser: async (req, res) => {
        const method = "INSERT INTO users (`username`, `email`, `password`) VALUES (?)"
        const values = [
            req.body.username,
            req.body.email,
            await bcrypt.hash(req.body.password, 8)
        ]

            db.query(method, [values], (error) => {
                if (error) return res.json(error)
    
                return res.status(200).json('user created successfuly!')
            })
    },

    userLogin: (req, res) => {
        const method = "SELECT * FROM users WHERE `email` = ?"
        const values = [
            req.body.email,
            req.body.password
        ]

        if (values) {
            db.query(method, [values[0]], (error, results) => {
                if (error) return res.json(error)

                if (results.length === 0) {
                    res.status(404).send('User does not exist');
                }
                bcrypt.compare(values[1], results[0].password, (error, result) => {
                    if (error) {
                        res.status(500).send('Internal Server Error');
                    } else if (result) {
                        const token = jwt.sign({id: result.id}, process.env.JWT_SECRET, {expiresIn: 300})

                        return res.json({auth: true, token: token})

                    } else {
                        res.status(401).send('Unauthorized');
                    }
                })
            })
        }
    },

    logout: (req, res) => {
        res.end()
    },

    updateUser: (req, res) => {
        const method = "UPDATE users SET `username` = ?, `email` = ? WHERE `id` = ?"
        const values = [
            req.body.username,
            req.body.email
        ]

        db.query(method, [...values, req.params.id], (error) => {
            if (error) return res.json(error)

            return res.status(200).json('user info update successfuly!')
        })
    },

    deleteUser: (req, res) => {
        db.query(('DELETE FROM users WHERE `id` = ?'), [req.params.id], (error) => {
            if (error) return res.json(error)

            return res.status(200).json('user deleted succsessfuly.')
        })
    }
}