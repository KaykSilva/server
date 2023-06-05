const express = require('express')
const router = express.Router()

const userController = require('./controllers/userController')
const functions = require('./functions')

router.get('/users',  userController.getUsers)

router.post('/user/new', functions.getUser, userController.newUser)
router.post('/login', userController.userLogin)
router.post('/logout', userController.logout)

router.put('/user/update/:id', userController.updateUser)

router.delete('/user/delete/:id', userController.deleteUser)

module.exports = router