// movieValidator.js
const validator = require('../helpers/validate');

const validateMovie = (req, res, next) => {
    const validationRule = {
        title: 'required|string',
        director: 'required|string|regex:/^[A-Za-z ]+$/',
        releaseYear: 'required|integer|digits:4',
        genre: 'string',
        rating: 'number'
    };
    //error handling
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

const validateActor = (req, res, next) => {
    const validationRule = {
      name: 'required|string',
      birthDate: 'required|date', 
      birthPlace: 'required|string',
      mostFamousMovie: 'string',
      hasStarOnWalkOfFame: 'boolean'
    };
  
    // Error handling
    validator(req.body, validationRule, {}, (err, status) => {
      if (!status) {
        res.status(412).send({
          success: false,
          message: 'Actor validation failed',
          data: err
        });
      } else {
        next();
      }
    });
  };

module.exports = {
    validateMovie,
    validateActor
};
