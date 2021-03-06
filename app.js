const express = require('express');
const cors = require('cors')
const globalErrorHandler = require('./controllers/errorController')
const advertisementRouter = require('./routers/advertisementRouter');
const usersRouter = require('./routers/userRouter');
const fileupload = require('express-fileupload');
const os = require('os');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const compression = require('compression')

const app = express();
app.use(cors())
app.use(helmet());

app.use(express.json());

app.use(fileupload({
    useTempFiles: true,
    tempFileDir: os.tmpdir()
}));

const limiter = rateLimit({
    max: 600,
    windowMs: 60 * 60 * 1000,
    message: 'Prekoračili ste limit. Pokušajte ponovo za 1h.'
})

app.use('/api', limiter);
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

//* Routes
app.use('/api/v1/oglasi', advertisementRouter);
app.use('/api/v1/users', usersRouter);

//* All routes that do not exist
app.all('*', (req, res, next) => {
    res.status(404).json({
        message: `The requested route ${req.originalUrl} is not found.`
    })
}); 

app.use(globalErrorHandler)

module.exports = app