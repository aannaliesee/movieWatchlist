const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;


getMovies = async (req, res) => {
    try {
      const movies = await Movie.find();
      res.status(200).json(movies);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
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
  
  
    module.exports = {
      getMovies,
      addMovie,
      getMovieById,
      updateMovie,
      deleteMovie
    };