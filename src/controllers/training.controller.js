const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services/training.service.js');
const trainingService = require('../services/training.service');


const getTrainingSession = catchAsync(async (req, res) => {
  const { startDate, startTime, endDate, endTime } = req.query;

  // Convert date and time strings to Date objects
  const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);
  let resp = await trainingService.getTrainingSession(startDate, endDate);
  
  console.log("second",resp)
  res.status(httpStatus.OK).send(resp);
});

const saveTrainingSession = catchAsync(async (req, res) => {
  console.log("first",req.body)
  const resp = await trainingService.saveTrainingSession(req.body);
  res.send(resp);
});
// const editTrainingSession = catchAsync(async (req, res) => {
  
//   let id= req.params.id;
//   console.log(id)
//   const resp = await trainingService.editTrainingSession(id,req.body);
//   res.send(resp);
// });

const editTrainingSession = catchAsync(async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Editing training session with ID:", id);
    
    // Call the editTrainingSession function from the trainingService module
    const resp = await trainingService.editTrainingSession(id, req.body);
    
    // Send the response
    res.send(resp);
  } catch (error) {
    // Handle errors
    console.error('Error editing training session:', error);
    res.status(500).json({ message: 'Failed to edit training session' });
  }
});


const deleteTrainingSession = catchAsync(async (req, res) => {
  let id= req.params.id;
  console.log("fghjk", id)
  const resp = await trainingService.deleteTrainingSession(id);
  res.send(resp);
});
const completeTrainingSession = catchAsync(async (req, res) => {
  
  const resp = await trainingService.completeTrainingSession(req.body);
  res.send(resp);
});

const getFinalTrainingSession = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const {id}= req.params;
    let {meetingId}= req.query
    let filter={}
    if(id){filter._id=id}
    if(meetingId){filter.meetingId=meetingId}
    
    const trainingSessions = await trainingService.getFinalTrainingSession(filter);

    if (!trainingSessions || trainingSessions.length === 0) {
      return res.status(404).json({ error: 'No training sessions found' });
    }

    res.status(200).json(trainingSessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};
const  acknowledge= catchAsync(async (req, res) => {
  const {id}= req.params;
  const resp = await trainingService.acknowledge(req.body,id);
  res.send(resp);
});

module.exports = {
  getTrainingSession,
  saveTrainingSession,
  editTrainingSession,
  deleteTrainingSession,
  completeTrainingSession,
  getFinalTrainingSession,
  acknowledge
  
};
