const User = require('../models/User')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const jwt = require('jsonwebtoken')
const {promisify} = require('util')
const signToken = require('../utils/signToken')

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    user
  });
};


exports.getCurrentUser = catchAsync(async(req, res, next) => {
    const user = await User.findOne({_id: req.user._id}).select('-__v +cookiesAccepted')

    res.status(200).json({
        message: 'success',
        user
    })
})

// PRIHVAĆANJE KOLAČIĆA
exports.acceptCookies = catchAsync(async(req, res, next) => {
    await User.findOneAndUpdate({_id: req.user._id}, {cookiesAccepted: true}, {
        new: true
    })

    res.status(200).json({
        message: 'success'
    })
})

// Protection Route
exports.protectRoutes = catchAsync(async(req, res, next) => {
    // 1) Get the token
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split` `[1]
    } else if(req.cookie.jwt) {
        token = req.cookie.jwt
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
    createSendToken(newUser, 201, req, res)
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
    createSendToken(user, 201, req, res)
});

// ODJAVA
exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};