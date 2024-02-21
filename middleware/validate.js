// movieValidator.js
const validator = require('../helpers/validate');

const validateMovie = (req, res, next) => {
    const validationRule = {
        title: 'required|string',
        director: 'required|string',
        releaseYear: 'required|integer',
        genre: 'string',
        rating: 'number'
    };
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412).send({
                success: false,
                message: 'Movie validation failed',
                data: err
            });
        } else {
            next();
        }
    });
};

module.exports = {
    validateMovie,
};
