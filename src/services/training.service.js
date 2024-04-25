const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Employee = require('../models/employee.model')
const { tokenTypes } = require('../config/tokens');
const Training = require('../models/training.model')
const FinalData = require('../models/finalTrainingData.model')
const { sendEmail } = require('./email.service')



const calculateMeetingDuration = (fromTime, toTime) => {
  const fromTimeParts = fromTime.split(':');
  const toTimeParts = toTime.split(':');

  const fromTimeInMinutes = parseInt(fromTimeParts[0]) * 60 + parseInt(fromTimeParts[1]);
  const toTimeInMinutes = parseInt(toTimeParts[0]) * 60 + parseInt(toTimeParts[1]);

  const durationInMinutes = toTimeInMinutes - fromTimeInMinutes;

  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;

  return `${hours}h ${minutes}m`;
};

const meetingStatus = async (row) => {
  return new Promise(async (resolve, reject) => {
    try {
      let training = await Training.findOne({ _id: row._id });
      if (training?.completed === true) {
        resolve("Completed");
      } else {
        const currentTime = new Date();
        const meetingStartDate = new Date(row.date);
        const meetingStartTimeParts = row.fromTime.split(":");
        meetingStartDate.setHours(
          parseInt(meetingStartTimeParts[0]),
          parseInt(meetingStartTimeParts[1]),
          0,
          0
        );

        const meetingEndDate = new Date(row.date);
        const meetingEndTimeParts = row.toTime.split(":");
        meetingEndDate.setHours(
          parseInt(meetingEndTimeParts[0]),
          parseInt(meetingEndTimeParts[1]),
          0,
          0
        );

        if (currentTime > meetingEndDate) {
          resolve("Completed");
        } else if (currentTime >= meetingStartDate) {
          resolve("Running");
        } else {
          resolve("Not Started");
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};


const getTrainingSession = async (startDateTime, endDateTime) => {
  try {
    const filter = { date: { $gte: startDateTime, $lte: endDateTime } }
    const filteredSessions = await Training.find({
      date: { $gte: startDateTime, $lte: endDateTime },
    });
    let res = [];
    for (let i = 0; i < filteredSessions.length; i++) {
      let resp = filteredSessions[i].toObject();
      resp.totalMeetingTime = calculateMeetingDuration(resp.fromTime, resp.toTime);
      resp.status = await meetingStatus(resp);
      res.push(resp);
    }

    console.log('hhg', res)
    return res;

  } catch (error) {
    console.error(error);
    const errorMessage = 'Internal Server Error';
    return { err: error.message }
  }
};
;

const filters = {
  startDate: '2023-12-01',
  endDate: '2023-12-15',
  trainerName: 'John Doe',
};

// const getTrainingSession = async (startDateTime, endDateTime) => {
//   try {
//     const filter = { date: { $gte: startDateTime, $lte: endDateTime } }
//     const filteredSessions = await Training.find({
//       date: { $gte: startDateTime, $lte: endDateTime },
//     });
//     let res = filteredSessions.map(resp => {
//       resp = resp.toObject();
//       resp.totalMeetingTime = calculateMeetingDuration(resp.fromTime, resp.toTime);
//       return resp;
//     });

//     console.log('hhg', res)
//     return res;

//   } catch (error) {
//     console.error(error);
//     const errorMessage = 'Internal Server Error';
//     return { err: error.message }
//   }
// };

// const filters = {
//   startDate: '2023-12-01',
//   endDate: '2023-12-15',
//   trainerName: 'John Doe',
// };




const saveTrainingSession = async (data) => {
  const trainingObj = new Training({ ...data });
  const empArray = data?.empCodes;

  let res = await trainingObj.save();
  console.log("xcvbnm,", res)

  const trainingId = res._id;
  for (let i = 0; i < empArray.length; i++) {
    const emp = empArray[i];
    const [empName, empId] = emp.split(' - ');

    const last5Digits = Number(empId.trim().slice(-5));

    const trimmedEmpName = empName.trim();

    const existingEmployee = await Employee.findOne({ employeeId: last5Digits });

    if (existingEmployee) {
      await Employee.findOneAndUpdate(
        { employeeId: last5Digits },
        { $push: { trainingId: trainingId } }
      );
    } else {
      await Employee.create({
        employeeId: last5Digits,
        employeeName: trimmedEmpName,
        trainingId: [trainingId]
      });
    }
  }
  return res;
}
const editTrainingSession = async (id, data) => {
  console.log("hello", id, data)

  try {

    const updatedTraining = await Training.findOneAndUpdate({ _id: id }, { $set: data });
    console.log("updated", updatedTraining)
    return updatedTraining;
  } catch (error) {
    console.error('Error editing training session:', error);
    throw new Error('Failed to edit training session');
  }
};


const deleteTrainingSession = async (id) => {
  try {
    const deletedTraining = await Training.findByIdAndDelete(id);

    return deletedTraining;
  } catch (error) {
    console.error('Error editing training session:', error);
    throw new Error('Failed to edit training session');
  }
};

const completeTrainingSession = async (data) => {
  try {
    if (!data) {
      throw new Error("Data is undefined or null");
    }
    // console.log('first', data)
    let meetingId = data._id
    delete data._id;

    data.allEmployees = data?.allEmployees?.map(employee => {
      if (employee && employee._id) {
        delete employee._id;
      }
      return employee;
    });
    data.meetingId = meetingId;
    let training = await FinalData.findOne({ meetingId })
    let finalDataObj;
    if (training) {
      console.log("updated")
      let x=await Training.findOneAndUpdate({ _id: meetingId }, { $set: { completed: true } })
      // console.log("aaaa",x)
      finalDataObj = await FinalData.findOneAndUpdate({ _id: training.id }, { $set: data }, { new: true })
    }
    else {
      console.log("created")
      finalDataObj = new FinalData(data);
      training = await finalDataObj.save()
    }
    sendEmail(training.facultyMail, `Training Session Details`, `http://192.1.81.101:3000/table/${training._id}`)
    console.log("Training session completed successfully:", finalDataObj, training);
  } catch (error) {
    console.error("Error completing training session:", error);
    throw new Error("Error completing training session");
  }
};


const getFinalTrainingSession = async (filter) => {
  try {
    const trainingSessions = await FinalData.findOne(filter);
    return trainingSessions;
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving training sessions by date range');
  }

};

const acknowledge = async (data, id) => {
  try {
    data.acknowledgement = true;
    const training = await Training.findOneAndUpdate({ _id: data.meetingId }, { $set: { acknowledgement: true } })
    const trainingSessions = await FinalData.findOneAndUpdate({
      _id: id
    }, { $set: data });
    console.log("kjhgfd", trainingSessions)
    return trainingSessions;
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving training sessions by date range');
  }

};

module.exports = {
  getTrainingSession,
  saveTrainingSession,
  editTrainingSession,
  deleteTrainingSession,
  completeTrainingSession,
  getFinalTrainingSession,
  acknowledge
};
