require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express()
app.use(express.json());
app.use(cookieParser())

app.use('/api/v1/users', require('./routes/user'))
app.use('/api/v1/messages', require('./routes/messages'))

mongoose.connect(`mongodb://localhost:27017/soilhealthdb`)

mongoose.connection.on('connected', () => {
    console.log(`Database connected`);
})

mongoose.connection.on('error', e => {
    console.error(`Error: ${e.message}`);
})

if(process.env.NODE_ENV === 'development'){
    app.use(morgan(
        'dev'
    ))
}

const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
    console.log(`Server Listening @${PORT}`)
})