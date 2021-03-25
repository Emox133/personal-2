const catchAsync = require('../utils/catchAsync')
const Advertisement = require('../models/Advertisement')
const AppError = require('../utils/appError')
const cloudinary = require('cloudinary').v2
const {uploadProfileImage} = require('../utils/cloudinary')

// Choose which fields are allowed to be updated
const filteredBody = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj
};

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

exports.getOneAdvertisement = catchAsync(async(req, res, next) => {
    const advertisement = await Advertisement.findOne({_id: req.params.id})

    if(!advertisement) {
        return next(new AppError('Oglas nije pronađen.', 404))
    }

    res.status(200).json({
        message: 'success',
        advertisement
    })
})

exports.checkForLogo = catchAsync(async (req, res, next) => {
    if(req.files) {
        console.log(Object.keys(req.files)[0])
        uploadProfileImage(req)

        await cloudinary.uploader.upload(req.files.joinedTemp, (err, img) => {
            req.files.logo = img.secure_url
            if(err) {
                console.log(err)
            }
        })
    }
    next()
})

exports.createAdvertisement = catchAsync(async(req, res, next) => {
    const newAdvertisement = await Advertisement.create({
        creator: req.user._id,
        logo: req.files ? req.files.logo : req.body.logo,
        name: req.body.name,
        companyName: req.body.companyName,
        companyEmail: req.body.companyEmail,
        companyNumber: req.body.companyNumber,
        expiresIn: req.body.expiresIn,
        location: req.body.location,
        positionsLeft: req.body.positionsLeft,
        description: req.body.description,
        website: req.body.website
    })

    res.status(201).json({
        message: 'success',
        newAdvertisement
    })
})

exports.deleteAdvertisement = catchAsync(async (req, res, next) => {
    await Advertisement.findOneAndDelete({creator: req.user._id, _id: req.params.id})

    res.status(204).json({
        message: 'success'
    })
})

exports.updateAdvertisement = catchAsync(async (req, res, next) => {
    const allowedFields = filteredBody(req.body, 'name', 'location', 'category', 'description', 'website', 'employees')

    if(req.files) {
        allowedFields.logo = req.files.logo
    }

    const updatedAdvertisement = await Advertisement.findOneAndUpdate({_id: req.params.id, creator: req.user._id}, allowedFields, {
        new: true,
        runValidators: true
    })

    res.json({
        message: 'success',
        updatedAdvertisement
    })
})