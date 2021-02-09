const express = require('express')
const authController = require('../controllers/authController')
const advertisementController = require('../controllers/advertisementController')

const router = express.Router()

router.route('/')
.get(authController.protectRoutes, advertisementController.getAllAdvertisements)
.post(authController.protectRoutes, advertisementController.createAdvertisement)

module.exports = router