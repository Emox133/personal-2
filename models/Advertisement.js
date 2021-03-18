const mongoose = require('mongoose')

const advertisementsSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Oglas mora imati kreatora.']
    },
    logo: {
        type: String,
        default: 'https://res.cloudinary.com/ddyyhypik/image/upload/v1616069659/kpq7geldrkv0z2eodl1v.png'
    },
    name: {
        type: String,
        required: [true, 'Molimo vas unesite ime oglasa.']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    expiresIn: {
        type: Date
    },
    location: {
        type: String,
        required: [true, 'Molimo vas unesite lokaciju kompanije.']
    },
    category: {
        type: String,
        required: [true, 'Molimo vas da izaberete jednu od ponuđenih kategorija.']
    },
    description: {
        type: String,
        required: [true, 'Molimo vas da unesete detalje o oglasu.'],
        trim: true
    },
    website: String,
    employees: {
        type: Number,
        required: [true, 'Molimo vas unesite broj trenutno zaposlenih.']
    }
})

const Advertisement = mongoose.model('Advertisement', advertisementsSchema)

module.exports = Advertisement