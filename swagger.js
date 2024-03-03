const express = require('express');
const router = express.Router();

const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Movie Api',
        description: 'Movie Watchlist Api'
},
    host: 'https://moviewatchlist.onrender.com',
    schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);