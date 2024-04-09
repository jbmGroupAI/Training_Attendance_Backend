const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const Training = require('../models/training.model')

const getTrainingSession = async (startDateTime, endDateTime) => {
  try {
    const filter = { date: { $gte: startDateTime, $lte: endDateTime } }
    const filteredSessions = await Training.find({
      date: { $gte: startDateTime, $lte: endDateTime },
    });
    console.log("filter", filter)
    return filteredSessions;
  } catch (error) {
    console.error(error);
    const errorMessage = 'Internal Server Error';
    return { err: error.message }
  }
};
;

// Example usage:
const filters = {
  startDate: '2023-12-01',
  endDate: '2023-12-15',
  trainerName: 'John Doe',
  // Add more filters as needed
};



const saveTrainingSession = async (data) => {
  const trainingObj = new Training({ ...data });
  let res = await trainingObj.save();
  return res;
}
const editTrainingSession = async (id, data) => {
  try {
    // Update the training session document with the provided data
    console.log("hello",id, data)
    const updatedTraining = await Training.findByIdAndUpdate(id, data, { new: true });

    // Return the updated training session document
    return updatedTraining;
  } catch (error) {
    // Handle errors if any
    console.error('Error editing training session:', error);
    throw new Error('Failed to edit training session');
  }
};


const deleteTrainingSession = async (id) => {
  try {
    // Update the training session document with the provided data
    const deletedTraining = await Training.findByIdAndDelete(id);

    // Return the updated training session document
    return deletedTraining;
  } catch (error) {
    // Handle errors if any
    console.error('Error editing training session:', error);
    throw new Error('Failed to edit training session');
  }
};
module.exports = {
  getTrainingSession,
  saveTrainingSession,
  editTrainingSession,
  deleteTrainingSession
};
