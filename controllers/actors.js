const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
//const { handleErrors } = require('../middleware'); // Import the centralized error handler
const { validateActor } = require('../middleware/validate'); // Import the actor validation middleware



const getActors = (req, res) => {
  mongodb
    .getDb()
    .db()
    .collection('actors')
    .find()
    .toArray((err, lists) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
};

const getActorById = (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must use a valid actor id to find an actor.');
  }
  const actorId = new ObjectId(req.params.id);
  mongodb
    .getDb()
    .db()
    .collection('actors')
    .find({ _id: actorId })
    .toArray((err, result) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result[0]);
    });
};


const addActor = async (req, res) => {
  try {
    // Use the validateMovie middleware for validation
    validateActor(req, res, async () => {
      const actor = {
        name: req.body.name,
        birthDate: req.body.birthDate,
        birthPlace: req.body.birthPlace,
        mostFamousMovie: req.body.mostFamousMovie,
        hasStarOnWalkOfFame: req.body.hasStarOnWalkOfFame
      };
      const response = await mongodb.getDb().db().collection('actors').insertOne(actor);
      if (response.acknowledged) {
        res.status(201).json(response);
      } else {
        handleErrors(response.error || 'Some error occurred while adding the actor.', res, 500);
      }
    });
  } catch (error) {
    handleErrors(error, res);
  }
};
  
  
const updateActor = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json('Must use a valid actor id to update an actor.');
    }
      const actorId = new ObjectId(req.params.id);
      const actor = {
          name: req.body.name,
          birthDate: req.body.birthDate,
          birthPlace: req.body.birthPlace,
          mostFamousMovie: req.body.mostFamousMovie,
          hasStarOnWalkOfFame: req.body.hasStarOnWalkOfFame
      };
      const response = await mongodb.getDb().db().collection('actors').replaceOne({ _id: actorId }, actor);
      if (response.modifiedCount > 0) {
          res.status(204).send();
      } else {
          handleErrors(response.error || 'Some error occurred while updating the actor.', res, 500);
      }
  } catch (error) {
      handleErrors(error, res);
  }
};
const deleteActor = async (req, res) => {
  try {
      const actorId = new ObjectId(req.params.id);
      const response = await mongodb.getDb().db().collection('actors').remove({ _id: actorId }, true);
      if (response.deletedCount > 0) {
          res.status(204).send();
      } else {
          handleErrors(response.error || 'Some error occurred while deleting the actor.', res, 500);
      }
  } catch (error) {
      handleErrors(error, res);
  }
};
  
  
    module.exports = {
      getActors,
      getActorById,
      addActor,
      updateActor,
      deleteActor
    };