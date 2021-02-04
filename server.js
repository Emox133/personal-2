const dotenv = require('dotenv')
const mongoose = require('mongoose')
const app = require('./app')

dotenv.config({
    path: './config.env'
})

const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD)

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('DB connection successful'))

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
    console.log('server started.')
})

// app.get('/', function (req, res) {
//     res.send('Hello World')
// })