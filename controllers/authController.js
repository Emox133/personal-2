const User = require('../models/User')
const catchAsync = require('../utils/catchAsync')

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

//* Login
exports.login = catchAsync(async(req, res, next) => {
    // 1. Get the email and password 
    const {email, password} = req.body;

    if(!email || !password) {
        res.status(400).json({
            message: 'Molimo vas unesite email i lozinku.'
        })
    }

    // 2. Compare the passwords
    const user = await User.findOne({email}).select('+password');

    if(!user || !await user.comparePasswords(password.toString(), user.password)) {
        res.status(400).json({
            message: 'Netačan email ili lozinka.'
        })
    }

    res.status(201).json({
        message: 'success',
        user
    })
});
