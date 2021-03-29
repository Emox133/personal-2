const express = require('express')
const authController = require('../controllers/authController')
const advertisementController = require('../controllers/advertisementController')

const router = express.Router()

router.route('/')
.get(advertisementController.getAllAdvertisements)
.post(authController.protectRoutes, advertisementController.checkForLogo, advertisementController.createAdvertisement)

router.route('/:id')
.get(advertisementController.getOneAdvertisement)
.patch(authController.protectRoutes, advertisementController.checkForLogo, advertisementController.updateAdvertisement)
.delete(authController.protectRoutes, advertisementController.deleteAdvertisement)

module.exports = router