// const adminService = require('../services/admin.service.js');
// // Get all trainings
// const getAllAdminDetails = async (req, res) => {
//   try {
//     const trainings = await adminService.getAllAdminDetails();
//     res.status(200).json(trainings);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to get trainings' });
//   }
// };

// // Create a new training
// const createAllAdminDetails = async (req, res) => {
//   try {
//     const trainingData = req.body;
//     const newTraining = await adminService.createAllAdminDetails(trainingData);
//     res.status(201).json(newTraining);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to create training' });
//   }
// };

// module.exports = {
//   getAllAdminDetails,
//   createAllAdminDetails,
// };


// controllers/admin.controller.js

const Admin = require('../models/admin.model');

// Get all trainings
exports.getAllAdminDetails = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching admin details' });
  }
};

// Create a new training

exports.createAllAdminDetails = async (req, res) => {
  try {
    const newAdmin = new Admin(req.body);
    const savedAdmin = await newAdmin.save();
    res.status(201).json(savedAdmin);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      const duplicateKey = Object.keys(error.keyValue)[0];
      const duplicateValue = error.keyValue[duplicateKey];
      const errorMessage = `A training session with this ${duplicateKey} (${duplicateValue}) already exists.`;
      res.status(400).json({ error: errorMessage });
    } else {
      console.error("Error creating admin details:", error);
      res.status(500).json({ error: 'An error occurred while creating admin details.' });
    }
  }
};


// Update a training
exports.updateAdminDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedAdmin) {
      return res.status(404).json({ error: 'Admin detail not found' });
    }
    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ error: 'Error updating admin detail' });
  }
};

// Delete a training
exports.deleteAdminDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(id);
    if (!deletedAdmin) {
      return res.status(404).json({ error: 'Admin detail not found' });
    }
    res.status(200).json({ message: 'Admin detail deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting admin detail' });
  }
};
