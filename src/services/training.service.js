const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Employee = require('../models/employee.model')
const { tokenTypes } = require('../config/tokens');
const Training = require('../models/training.model')
const FinalData = require('../models/finalTrainingData.model')
const { sendEmail } = require('./email.service')
const moment = require('moment')



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
  console.log("first")
  return new Promise(async (resolve, reject) => {
    try {
      const training = await Training.findOne({ _id: row._id });

      if (training?.acknowledgement === true) {
        resolve("Completed");
        return;
      }

      const currentTime = new Date();
      const meetingDate = new Date(row.date);

      const [startHour, startMinute] = row.fromTime.split(":").map(Number);
      const meetingStartDate = new Date(meetingDate);
      meetingStartDate.setHours(startHour, startMinute, 0, 0);

      const [endHour, endMinute] = row.toTime.split(":").map(Number);
      const meetingEndDate = new Date(meetingDate);
      meetingEndDate.setHours(endHour, endMinute, 0, 0);

      console.log("Current Time:", currentTime.toString());
      console.log("Meeting Start Date:", meetingStartDate.toString());
      console.log("Meeting End Date:", meetingEndDate.toString());
   console.log("ddd",{currentTime,meetingStartDate,meetingEndDate})
   console.log("copm ",new Date(currentTime).getTime() > new Date(meetingEndDate).getTime())
   const cT = moment(currentTime).valueOf();
const sT = moment(meetingStartDate).subtract(330, 'minutes').valueOf();
const eT = moment(meetingEndDate).subtract(330, 'minutes').valueOf();
   console.log("running",cT >= eT && cT <= sT ,{cT,eT,sT})
      if (cT > eT) {
        resolve("Completed");
      } else if ( cT >= sT && cT <= eT ) {
        resolve("In Progress");
      } else {
        resolve("Not Started");
      }
    } catch (error) {
      console.error("Error in meetingStatus function:", error);
      reject(error);
    }
  });
};



const getTrainingSession = async (startDateTime, endDateTime) => {
  console.log("check1")
  try {
    const filter = { date: { $gte: startDateTime, $lte: endDateTime } }
    const filteredSessions = await Training.find({
      date: { $gte: startDateTime, $lte: endDateTime },
    });
    let res = [];
    for (let i = 0; i < filteredSessions.length; i++) {
      console.log("check2")

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


const saveTrainingSession = async (data) => {
  try {
    const trainingObj = new Training({ ...data });
    const empArray = data?.empCodes;

    let res = await trainingObj.save();
    console.log("xcvbnm,", empArray);

    const trainingId = res._id;

    for (let i = 0; i < empArray.length; i++) {
      const participantEmail = data.participantEmails[i];
      sendEmail(participantEmail, `Training Session Created`, `You have been invited to a training session. Details: 
        Training Topic: ${data.projectName}
        Trainer: ${data.trainerName}
        Date: ${data.date}
        From Time: ${data.fromTime}
        To Time: ${data.toTime}
        Venue: ${data.plantNames}
        Description: ${data.meetingDescription}
        TrainingLink: ${data.trainingLink}
       `);
    }
    for (let i = 0; i < empArray.length; i++) {
      const emp = empArray[i];
      const { empFName, empOnlyId, plantIds } = emp
      const last5Digits = empOnlyId
      const trimmedEmpName = empFName

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
          trainingId: [trainingId],
          plantIds: plantIds
        });
      }
    }

    return res;
  } catch (error) {
    console.error("Error saving training session:", error);
    throw new Error("Error saving training session");
  }
};






const editTrainingSession = async (id, data) => {
  console.log("hello", id, data);

  try {
    const updatedTraining = await Training.findOneAndUpdate({ _id: id }, { $set: {...data} }, { new: true });
    console.log("updated", updatedTraining);

    const empArray = data?.empCodes;

    for (let i = 0; i < empArray.length; i++) {
      const emp = empArray[i];
      const participantEmail = data.participantEmails[i]; // Assuming participant emails are in the same order as empCodes

      sendEmail(participantEmail, `Training Session Updated`, `The training session details have been updated. New Details: 
        Training Topic: ${data.projectName}
        Trainer: ${data.trainerName}
        Date: ${data.date}
        From Time: ${data.fromTime}
        To Time: ${data.toTime}
        Venue: ${data.plantNames}
        Description: ${data.meetingDescription}
        TrainingLink: ${data.trainingLink}
        `);
    }

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

    let meetingId = data._id;
    delete data._id;
    const empArray = data?.empCodes;
    

    data.allEmployees = data?.allEmployees?.map(employee => {
      if (employee && employee._id) {
        delete employee._id;
      }
      return employee;
    });

    data.meetingId = meetingId;
    let training = await FinalData.findOne({ meetingId });
    let finalDataObj;
    if (training) {
      console.log("updated");
      await Training.findOneAndUpdate({ _id: meetingId }, { $set: { completed: true } });
      finalDataObj = await FinalData.findOneAndUpdate({ _id: training.id }, { $set: data }, { new: true });
     
    } else {
      console.log("created");
      finalDataObj = new FinalData(data);
      training = await finalDataObj.save();
    }
    for (let i = 0; i < empArray.length; i++) {
      const emp = empArray[i];
      const { empFName, empOnlyId, plantIds } = emp
      const last5Digits = empOnlyId
      const trimmedEmpName = empFName

      const existingEmployee = await Employee.findOne({ employeeId: last5Digits });
      console.log("vbnm,.", finalDataObj)
      if (existingEmployee) {
        await Employee.findOneAndUpdate(
          { employeeId: last5Digits },
          { $addToSet: { finalTrainingId: finalDataObj._id } }
        );
      }
      
    }
    sendEmail(training.facultyMail, `Training Session Details`, `http://35.154.18.252/ta/table/${training._id}`);
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

// const acknowledge = async (data, id) => {
//   try {
//     data.acknowledgement = true;
//     const training = await Training.findOneAndUpdate({ _id: data.meetingId }, { $set: { acknowledgement: true } })
//     const trainingSessions = await FinalData.findOneAndUpdate({
//       _id: id
//     }, { $set: data });
//     console.log("kjhgfd", trainingSessions)
//     return trainingSessions;
//   } catch (error) {
//     console.error(error);
//     throw new Error('Error retrieving training sessions by date range');
//   }

// };

const acknowledge = async (data, id) => {
  try {
    // Check if the meeting has already been acknowledged
    const existingAcknowledgement = await Training.findOne({ _id: data.meetingId, acknowledgement: true });

    if (existingAcknowledgement) {
      throw new Error('This meeting has already been acknowledged.');
    }

    // Set acknowledgement to true
    data.acknowledgement = true;
    // Update the Training collection
    const training = await Training.findOneAndUpdate({ _id: data.meetingId }, { $set: { acknowledgement: true } });

    // Update the FinalData collection
    const trainingSessions = await FinalData.findOneAndUpdate({ _id: id }, { $set: data });

    console.log("kjhgfd", trainingSessions);

    return trainingSessions;
  } catch (error) {
    console.error(error);
    throw new Error('Error processing acknowledgement');
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
