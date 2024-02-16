const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;


/*getMovies = async (req, res) => {
    try {
      const movies = await Movie.find();
      res.status(200).json(movies);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };*/

  const getMovies = async (req, res) => {
    const result = await mongodb.getDb().db().collection('movies').find();
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  };
  /*
  addMovie = async (req, res) => {
    try {
      const { title, genre, releaseYear } = req.body;
      const newMovie = new Movie({ title, genre, releaseYear });
      const savedMovie = await newMovie.save();
      res.status(201).json({ id: savedMovie._id });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  */
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
  
  /*
  // Get movie by ID
  getMovieById = async (req, res) => {
      try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
          return res.status(404).json({ error: 'Movie not found' });
        }
        res.status(200).json(movie);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };
    */
    const getMovieById = async (req, res) => {
      const movieId = new ObjectId(req.params.id);
      const result = await mongodb.getDb().db().collection('movies').find({ _id: movieId });
      result.toArray().then((lists) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists[0]);
      });
    };
    /*
    // Update movie
    updateMovie = async (req, res) => {
      try {
        const movie = await Movie.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true, runValidators: true }
        );
    
        if (!movie) {
          return res.status(404).json({ error: 'Movie not found' });
        }
    
        res.status(200).json(movie);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };
*/
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
    
    /*
    // Delete movie
    deleteMovie = async (req, res) => {
      try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
    
        if (!movie) {
          return res.status(404).json({ error: 'Movie not found' });
        }
    
        res.status(200).json(movie);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };
    */
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
      addMovie,
      getMovieById,
      updateMovie,
      deleteMovie
    };