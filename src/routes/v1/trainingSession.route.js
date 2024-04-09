const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const trainingController = require('../../controllers/training.controller.js');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/', trainingController.getTrainingSession);
router.post('/',  trainingController.saveTrainingSession);
router.put('/:id', trainingController.editTrainingSession);
router.delete('/:id',  trainingController.deleteTrainingSession);


module.exports = router;

