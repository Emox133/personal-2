const User = require('../models/User')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const jwt = require('jsonwebtoken')
const {promisify} = require('util')
const signToken = require('../utils/signToken')

// Protection Route
exports.protectRoutes = catchAsync(async(req, res, next) => {
    // 1) Get the token
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split` `[1]
    }

    if(!token) {
        return next(new AppError('Neispravan token.'))
    }

    // 2) Decode the token and find coresponding user
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id)

    if(!currentUser) {
        return next(new AppError('Vlasnik ovog tokena više ne postoji.', 401))
    }

    // 3) Send current user through stack
    req.user = currentUser

    next()
})

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

    // Sign token
    const token = signToken(newUser._id)

    res.status(201).json({
        message: 'success',
        token
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

    // 3) Sign token
    const token = signToken(user._id)

    res.status(201).json({
        message: 'success',
        token
    })
});
