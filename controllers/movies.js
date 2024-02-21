const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
//const { handleErrors } = require('../middleware'); // Import the centralized error handler
const { validateMovie } = require('../middleware/validate'); // Import the movie validation middleware


/*
const getMovies = async (req, res) => {
  try {
      const result = await mongodb.getDb().db().collection('movies').find();
      const lists = await result.toArray();
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
  } catch (error) {
      handleErrors(error, res);
  }
};
*/
const getMovies = (req, res) => {
  mongodb
    .getDb()
    .db()
    .collection('movies')
    .find()
    .toArray((err, lists) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
};
/*
const getMovieById = async (req, res) => {
  try {
      const movieId = new ObjectId(req.params.id);
      const result = await mongodb.getDb().db().collection('movies').find({ _id: movieId });
      const lists = await result.toArray();
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists[0]);
  } catch (error) {
      handleErrors(error, res);
  }
};
*/
const getMovieById = (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must use a valid movie id to find a movie.');
  }
  const movieId = new ObjectId(req.params.id);
  mongodb
    .getDb()
    .db()
    .collection('movies')
    .find({ _id: movieId })
    .toArray((err, result) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result[0]);
    });
};


const addMovie = async (req, res) => {
  try {
    // Use the validateMovie middleware for validation
    validateMovie(req, res, async () => {
      const movie = {
        title: req.body.title,
        director: req.body.director,
        releaseYear: req.body.releaseYear,
        genre: req.body.genre,
        rating: req.body.rating
      };
      const response = await mongodb.getDb().db().collection('movies').insertOne(movie);
      if (response.acknowledged) {
        res.status(201).json(response);
      } else {
        handleErrors(response.error || 'Some error occurred while adding the movie.', res, 500);
      }
    });
  } catch (error) {
    handleErrors(error, res);
  }
};
  
  
const updateMovie = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json('Must use a valid movie id to update a movie.');
    }
      const movieId = new ObjectId(req.params.id);
      const movie = {
          title: req.body.title,
          director: req.body.director,
          releaseYear: req.body.releaseYear,
          genre: req.body.genre,
          rating: req.body.rating
      };
      const response = await mongodb.getDb().db().collection('movies').replaceOne({ _id: movieId }, movie);
      if (response.modifiedCount > 0) {
          res.status(204).send();
      } else {
          handleErrors(response.error || 'Some error occurred while updating the movie.', res, 500);
      }
  } catch (error) {
      handleErrors(error, res);
  }
};
const deleteMovie = async (req, res) => {
  try {
      const movieId = new ObjectId(req.params.id);
      const response = await mongodb.getDb().db().collection('movies').remove({ _id: movieId }, true);
      if (response.deletedCount > 0) {
          res.status(204).send();
      } else {
          handleErrors(response.error || 'Some error occurred while deleting the movie.', res, 500);
      }
  } catch (error) {
      handleErrors(error, res);
  }
};
  
  
    module.exports = {
      getMovies,
      getMovieById,
      addMovie,
      updateMovie,
      deleteMovie
    };