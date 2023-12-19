const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services/training.service.js');
const trainingService = require('../services/training.service');
const getTrainingSession = catchAsync(async (req, res) => {
  const { startDate, startTime, endDate, endTime } = req.query;

  // Convert date and time strings to Date objects
  const startDateTime = new Date(`${startDate}T${startTime}`);
  const endDateTime = new Date(`${endDate}T${endTime}`);
  const resp = await trainingService.getTrainingSession(startDateTime, endDateTime);
  res.status(httpStatus.OK).send(resp);
});

const saveTrainingSession = catchAsync(async (req, res) => {
  const resp = await trainingService.saveTrainingSession(req.body);
  res.send(resp);
});

module.exports = {
  getTrainingSession,
  saveTrainingSession,
};
