require('dotenv').config();
require('express-async-errors');
// async errors


const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const productRouter = require('./routes/products');

const bodyParser = require('body-parser');


const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');

// middleware
app.use(express.json());

// routes

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api/v1/products', productRouter)

// products
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 3000;

const start = async() => {
    try {
        // connect DB
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log('Server started on port ' + port));
    } catch (error) {
        console.log(error)
    }
}


start();