const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;


  const getMovies = async (req, res) => {
    const result = await mongodb.getDb().db().collection('movies').find();
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  };

  const getMovieById = async (req, res) => {
    const movieId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('movies').find({ _id: movieId });
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists[0]);
    });
  };

  const addMovie = async (req, res) => {
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
      res.status(500).json(response.error || 'Some error occurred while adding the movie.');
    }
  };
  
  
    const updateMovie = async (req, res) => {
      const movieId = new ObjectId(req.params.id);
      // be aware of updateOne if you only want to update specific fields
      const movie = {
        title: req.body.title,
        director: req.body.director,
        releaseYear: req.body.releaseYear,
        genre: req.body.genre,
        rating: req.body.rating
      };
      const response = await mongodb
        .getDb()
        .db()
        .collection('movies')
        .replaceOne({ _id: movieId }, movie);
      console.log(response);
      if (response.modifiedCount > 0) {
        res.status(204).send();
      } else {
        res.status(500).json(response.error || 'Some error occurred while updating the movie.');
      }
    };
   
    const deleteMovie = async (req, res) => {
      const movieId = new ObjectId(req.params.id);
      const response = await mongodb.getDb().db().collection('movies').remove({ _id: movieId }, true);
      console.log(response);
      if (response.deletedCount > 0) {
        res.status(204).send();
      } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the movie.');
      }
    };
  
  
    module.exports = {
      getMovies,
      getMovieById,
      addMovie,
      updateMovie,
      deleteMovie
    };