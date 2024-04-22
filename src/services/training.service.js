const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Employee = require('../models/employee.model')
const { tokenTypes } = require('../config/tokens');
const Training = require('../models/training.model')
const FinalData = require('../models/finalTrainingData.model')
const {sendEmail} = require('./email.service')



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

const meetingStatus = (row) => {
  const currentTime = new Date();
  const meetingStartDate = new Date(row.date);
  const meetingStartTimeParts = row.fromTime.split(":");
  meetingStartDate.setHours(parseInt(meetingStartTimeParts[0]), parseInt(meetingStartTimeParts[1]), 0, 0);

  const meetingEndDate = new Date(row.date);
  const meetingEndTimeParts = row.toTime.split(":");
  meetingEndDate.setHours(parseInt(meetingEndTimeParts[0]), parseInt(meetingEndTimeParts[1]), 0, 0);

  if (currentTime > meetingEndDate) {
    return "Completed";
  } else if (currentTime >= meetingStartDate) {
    return "Running";
  } else {
    return "Not Started";
  }
}

const getTrainingSession = async (startDateTime, endDateTime) => {
  try {
    const filter = { date: { $gte: startDateTime, $lte: endDateTime } }
    const filteredSessions = await Training.find({
      date: { $gte: startDateTime, $lte: endDateTime },
    });
    let res = filteredSessions.map(resp => {
      resp = resp.toObject();
      resp.totalMeetingTime = calculateMeetingDuration(resp.fromTime, resp.toTime)
      resp.status = meetingStatus(resp)
      return resp
    })
    // console.log("filter", filter)
    console.log('hhg',res)
    return res;
    
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
  const empArray = data?.empCodes;
  // const empArray = [
  //   'shashank - 39973',
  //   'pranjal - 40518',
  //   'rishabh - 40459',
  //   'vikas - 40455'
  // ];
  let res = await trainingObj.save();
  console.log("xcvbnm,", res)

  const trainingId = res._id;
  for (let i = 0; i < empArray.length; i++) {
    const emp = empArray[i];
    // Split the string by ' - ' to separate the empName and empId
    const [empName, empId] = emp.split(' - ');

    // Extract the last 5 digits as empId and trim whitespace
    const last5Digits = Number(empId.trim().slice(-5));

    // Trim whitespace from empName
    const trimmedEmpName = empName.trim();

    // Find the employee by employeeId
    const existingEmployee = await Employee.findOne({ employeeId: last5Digits });

    if (existingEmployee) {
      // If employee is found, update the trainingId array with the new trainingId
      await Employee.findOneAndUpdate(
        { employeeId: last5Digits },
        { $push: { trainingId: trainingId } }
      );
    } else {
      // If employee is not found, create a new employee with the provided details
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
    // Update the training session document with the provided data
   
    // let data1 = await Training.findOne({_id:id})
    // console.log("bye", data1)
    // const updatedTraining = await Training.findByIdAndUpdate(id, data, { new: true });
    const updatedTraining = await Training.findOneAndUpdate({ _id: id }, { $set: data });
    console.log("updated", updatedTraining)
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

const completeTrainingSession = async (data) => {
  try {
    if (!data) {
      throw new Error("Data is undefined or null");
    }
  console.log('first',data)
    // Remove _id field from the data
    let meetingId=data._id
    delete data._id;

    // Remove _id field from each employee object in allEmployees array
    data.allEmployees = data?.allEmployees?.map(employee => {
      if (employee && employee._id) {
        delete employee._id;
      }
      return employee;
    });
    data.meetingId=meetingId;
    // Create a new FinalData object with the sanitized data
    let training= await FinalData.findOne({meetingId})
    let finalDataObj;
    if(training)
    {
      console.log("updated")
      finalDataObj = await FinalData.findOneAndUpdate({_id:training.id},{$set:data},{new:true})
    }
    else
    {
      console.log("created")
    finalDataObj = new FinalData(data);
    training= await finalDataObj.save()
    }

    

    // Save the new object to the database
    
    sendEmail(training.facultyMail,`Training Session Details`,`http://localhost:3000/table/${training._id}`)

    console.log("Training session completed successfully:",finalDataObj, training );
  } catch (error) {
    console.error("Error completing training session:", error);
    throw new Error("Error completing training session");
  }
};


const getFinalTrainingSession = async (filter) => {
  try {
    // Query the database to retrieve training sessions between the specified dates
    const trainingSessions = await FinalData.findOne(filter);
    return trainingSessions;
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving training sessions by date range');
  }

};

const acknowledge = async (data,id) => {
  try {
    data.acknowledgement= true;
    // Query the database to retrieve training sessions between the specified dates
    const training = await Training.findOneAndUpdate({_id:data.meetingId},{$set:{acknowledgement:true}})
    const trainingSessions = await FinalData.findOneAndUpdate({_id:id
      // date: {
      //   $gte: new Date(startDate),
      //   $lte: new Date(endDate)
      // }
    }, {$set:data});
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
