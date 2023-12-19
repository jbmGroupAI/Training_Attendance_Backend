const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const Training = require('../models/training.model')

const getTrainingSession = async (startDateTime, endDateTime) => {
  try {
    const filteredSessions = await Training.find({
      selectedDate: { $gte: startDateTime, $lte: endDateTime },
    });
    return filteredSessions;
  } catch (error) {
    console.error(error);
    const errorMessage = 'Internal Server Error';
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
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

try {
  const trainingSessions = await getTrainingSession(filters);
  console.log(trainingSessions);
} catch (error) {
  console.error(error);
}


const saveTrainingSession=async(data)=>{
    const trainingObj = new Training({...data});
    let res=await trainingObj.save();
    return res;
}

module.exports = {
 getTrainingSession,
 saveTrainingSession
};
