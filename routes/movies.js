const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movies');
const {validateMovie} = require('../middleware/validate');

router.get('/', movieController.getMovies);

router.get('/:id', movieController.getMovieById);

// Use validateMovie middleware for validation in the post route
router.post('/', validateMovie, movieController.addMovie);

router.put('/:id', validateMovie, movieController.updateMovie);

router.delete('/:id', movieController.deleteMovie);

module.exports = router;

