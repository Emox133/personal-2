const express = require('express')
const app = express()
const userRouter = require('./routers/userRouter')
const advertisementsRouter = require('./routers/advertisementRouter')
const cors = require('cors');
const globalErrorHandler = require('./controllers/errorController')
const AppError = require('./utils/appError')
const fileupload = require('express-fileupload')
const os = require('os')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');

app.enable('trust proxy');
app.use(cors())
// app.options('*', cors());
app.use(helmet())

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Previše zahtjeva od ove IP adrese. Molimo pokušajte ponovo za jedan sat.'
})

app.use('/api', limiter)
app.use(cookieParser())
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: os.tmpdir()
}))
app.use(mongoSanitize())
app.use(xss())
app.use(compression())

app.use(express.json())

app.use('/api/v1/users', userRouter)
app.use('/api/v1/oglasi', advertisementsRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler)

module.exports = app