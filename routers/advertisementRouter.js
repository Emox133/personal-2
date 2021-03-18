const express = require('express')
const authController = require('../controllers/authController')
const advertisementController = require('../controllers/advertisementController')

const router = express.Router()

router.route('/')
.get(authController.protectRoutes, advertisementController.getAllAdvertisements)
.post(authController.protectRoutes, advertisementController.checkForLogo, advertisementController.createAdvertisement)

router.route('/:id')
.get(authController.protectRoutes, advertisementController.getOneAdvertisement)
.patch(authController.protectRoutes, advertisementController.updateAdvertisement)
.delete(authController.protectRoutes, advertisementController.deleteAdvertisement)

module.exports = router