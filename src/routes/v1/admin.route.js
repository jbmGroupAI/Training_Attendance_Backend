// const express = require('express');
// const router = express.Router();
// const adminController = require('../../controllers/admin.controller');

// // Route to get all trainings
// router.get('/post', adminController.getAllAdminDetails);

// // Route to create a new training
// router.post('/create', adminController.createAllAdminDetails);

// module.exports = router;


// routes/admin.routes.js

const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin.controller');

// Route to get all trainings
router.get('/post', adminController.getAllAdminDetails);

// Route to create a new training
router.post('/create', adminController.createAllAdminDetails);

// Route to update a training
router.put('/update/:id', adminController.updateAdminDetail);

// Route to delete a training
router.delete('/delete/:id', adminController.deleteAdminDetail);

module.exports = router;
