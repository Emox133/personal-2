const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Molimo unesite vaše ime.'],
        validate: [validator.isAlpha, 'Ime mora da sadrži samo slova.']
    },
    lastName: {
        type: String,
        required: [true, 'Molimo unesite vaše prezime.'],
        validate: [validator.isAlpha, 'Prezime mora da sadrži samo slova.']
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'Molimo vas izaberite korisničko ime.'],
        unique: true,
        validate: [validator.isAlphanumeric, 'Korisničko ime mora sadržavati samo slova i brojeve.']
    },
    email: {
        type: String,
        unique: true,
        validate: [validator.isEmail, 'Molimo unesite validan email.']
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 12,
        required: [true, 'Molimo vas unesite lozinku.'],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Molimo vas potvrdite vašu lozinku.'],
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: 'Lozinke se ne podudaraju.'
        }
    }
})

userSchema.pre('save', async function(next) {
    // 1. Check if the password is actually modified
    if(!this.isModified('password')) return next();
    
    // 2. Hash the password with the cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // 3. Remove confirm password before the doc is saved
    this.confirmPassword = undefined;
    next();
});

//? Compare Passwords
userSchema.methods.comparePasswords = async function(upwd, candidatePassword) {
    return await bcrypt.compare(upwd, candidatePassword)
};

const User = mongoose.model('User', userSchema)

module.exports = User