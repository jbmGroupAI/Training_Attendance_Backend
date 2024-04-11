const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services/training.service.js');
const trainingService = require('../services/training.service');
const getTrainingSession = catchAsync(async (req, res) => {
  const { startDate, startTime, endDate, endTime } = req.query;

  // Convert date and time strings to Date objects
  const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);
  const resp = await trainingService.getTrainingSession(startDate, endDate);
  console.log("second",resp)
  res.status(httpStatus.OK).send(resp);
});

const saveTrainingSession = catchAsync(async (req, res) => {
  console.log("first",req.body)
  const resp = await trainingService.saveTrainingSession(req.body);
  res.send(resp);
});
const editTrainingSession = catchAsync(async (req, res) => {
  
  let id= req.params.id;
  console.log(id)
  const resp = await trainingService.editTrainingSession(id,req.body);
  res.send(resp);
});
const deleteTrainingSession = catchAsync(async (req, res) => {
  let id= req.params.id;
  console.log("fghjk", id)
  const resp = await trainingService.deleteTrainingSession(id);
  res.send(resp);
});

module.exports = {
  getTrainingSession,
  saveTrainingSession,
  editTrainingSession,
  deleteTrainingSession
};
