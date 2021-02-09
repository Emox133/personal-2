const express = require('express')
const authController = require('../controllers/authController')
const advertisementController = require('../controllers/advertisementController')

const router = express.Router()

router.route('/')
.get(advertisementController.getAllAdvertisements)
.post(advertisementController.createAdvertisement)

module.exports = router