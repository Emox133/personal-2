const catchAsync = require('../utils/catchAsync')
const Advertisement = require('../models/Advertisement')
const AppError = require('../utils/appError')

exports.getAllAdvertisements = catchAsync(async(req, res, next) => {
    const advertisements = await Advertisement.find()

    if(!advertisements) {
        return next(new AppError('Trenutno nema oglasa u bazi podataka.', 404))
    }

    res.status(200).json({
        message: 'success',
        advertisements
    })
})

exports.createAdvertisement = catchAsync(async(req, res, next) => {
    const newAdvertisement = await Advertisement.create({
        logo: "",
        name: req.body.name,
        createdAt: Date.now(),
        expiresIn: new Date().toDateString(),
        location: req.body.location,
        category: req.body.category,
        description: req.body.description,
        website: req.body.website,
        employees: req.body.employees
    })

    res.status(201).json({
        message: 'success',
        newAdvertisement
    })
})