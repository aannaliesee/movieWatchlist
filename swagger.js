const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Movie Api',
        description: 'Movie Watchlist Api'
},
    host: 'localhost:3000',
    schemes: ['http','https' ]
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);