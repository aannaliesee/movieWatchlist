const express = require('express');
const router = express.Router();

const actorController = require('../controllers/actors');
//const {validateMovie} = require('../middleware/validate');

router.get('/', actorController.getActors);

router.get('/:id', actorController.getActorById);

// Use validateMovie middleware for validation in the post route
//router.post('/', validateMovie, movieController.addMovie);

//router.put('/:id', validateMovie, movieController.updateMovie);

router.post('/', actorController.addActor);

router.put('/:id', actorController.updateActor);


router.delete('/:id', actorController.deleteActor);

module.exports = router;

