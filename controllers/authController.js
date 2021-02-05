const User = require('../models/User')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

//Registracija
exports.signup = catchAsync(async(req, res, next) => {
    const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    });

    res.status(201).json({
        message: 'success',
        newUser
    })
});

//* Prijava
exports.login = catchAsync(async(req, res, next) => {
    // 1. Get the email and password 
    const {email, password} = req.body;

    if(!email || !password) {
       return next(new AppError('Molimo vas unesite email i lozinku.', 400))
    }

    // 2. Compare the passwords
    const user = await User.findOne({email}).select('+password');

    if(!user || !await user.comparePasswords(password.toString(), user.password)) {
       return next(new AppError('Netačan email ili lozinka.', 400))
    }

    res.status(201).json({
        message: 'success',
        user
    })
});
