const { profile } = require('console')
const express = require('express')
const authController = require('../controllers/authController')

const router = express.Router()

// router.route('/').get(authController.allUsers)
router.route('/signup').post(authController.signup)
router.route('/login').post(authController.login)

module.exports = router
