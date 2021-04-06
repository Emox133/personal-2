const mongoose = require('mongoose')
const validator = require('validator')

const advertisementsSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Oglas mora imati kreatora.']
    },
    logo: {
        type: String,
        default: 'https://res.cloudinary.com/ddyyhypik/image/upload/v1617001994/xcuvhnugbpkgvgvkihv6.jpg'
    },
    name: {
        type: String,
        required: [true, 'Molimo vas unesite ime oglasa.']
        // validate: [validator.isAlpha, 'Slova poput [Č, Ć, Š, Ž, DŽ, Đ] nisu dozvoljena.']
    },
    companyName: {
        type: String,
        required: [true, 'Molimov vas unesite ime vaše kompanije.']
    },
    companyEmail: {
        type: String,
        required: [true, 'Molimo vas unesite e-mail od vaše kompanije.']
    },
    companyNumber: {
        type: String,
        required: [true, 'Molimo vas unesite broj telefona od vaše kompanije.']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    expiresIn: {
        type: Date,
        // default: new Date().toLocaleDateString('BA', {month: 'long', day:'numeric', year: 'numeric'}),
        required: [true, 'Molimo vas unesite datum kada oglas ističe.']
    },
    location: {
        type: String,
        required: [true, 'Molimo vas unesite lokaciju kompanije.']
    },
    positionsLeft: {
        type: Number,
        required: [true, 'Molimo vas da unesete broj slobodnih mjesta za ovu poziciju.']
    },
    description: {
        type: String,
        required: [true, 'Molimo vas da unesete detalje o oglasu.'],
        trim: true
    },
    website: String
})

// TTL INDEX
advertisementsSchema.index({"expiresIn": 1}, {expireAfterSeconds: 0})

const Advertisement = mongoose.model('Advertisement', advertisementsSchema)

module.exports = Advertisement