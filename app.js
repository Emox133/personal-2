const express = require('express')
const app = express()
const userRouter = require('./routers/userRouter')
const advertisementsRouter = require('./routers/advertisementRouter')
const cors = require('cors');
const globalErrorHandler = require('./controllers/errorController')
const AppError = require('./utils/appError')

app.use(cors())
app.use(express.json())

app.use('/api/v1/users', userRouter)
app.use('/api/v1/oglasi', advertisementsRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler)

module.exports = app