const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const trainingController = require('../../controllers/employee.controller.js');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/', trainingController.getEmployeeList);



module.exports = router;

