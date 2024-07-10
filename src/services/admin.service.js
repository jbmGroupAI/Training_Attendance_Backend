const AdminModel = require('../models/admin.model');

// Get all trainings
const getAllAdminDetails = async () => {
  try {
    return await AdminModel.find();
  } catch (error) {
    console.error("Error fetching trainings:", error);
    throw error;
  }
};

// Create a new training
// const createAllAdminDetails = async (trainingData) => {
//   try {
//     const newTraining = new AdminModel(trainingData);
//     return await newTraining.save();
//   } catch (error) {
//     console.error("Error creating training:", error);
//     throw error;
//   }
// };

const createAllAdminDetails = async (trainingData) => {
  try {
    const newTraining = new AdminModel(trainingData);
    return await newTraining.save();
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      console.error("Duplicate venueId error:", error);
      throw new Error("A training session with this venueId already exists.");
    } else {
      console.error("Error creating training:", error);
      throw error;
    }
  }
};


module.exports = {
  getAllAdminDetails,
  createAllAdminDetails,
};
