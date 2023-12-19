const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const Training = require('../models/training.model')

const getTrainingSession = async (startDateTime, endDateTime) => {
  try {
    const filteredSessions = await Training.find({
      date: { $gte: startDateTime, $lte: endDateTime },
    });
    return filteredSessions;
  } catch (error) {
    console.error(error);
    const errorMessage = 'Internal Server Error';
    return {err: error.message}
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



const saveTrainingSession=async(data)=>{
    const trainingObj = new Training({...data});
    let res=await trainingObj.save();
    return res;
}

module.exports = {
 getTrainingSession,
 saveTrainingSession
};
