const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Employee = require('../models/employee.model')
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
  const empArray =data?.empCodes;
  // const empArray = [
  //   'shashank - 39973',
  //   'pranjal - 40518',
  //   'rishabh - 40459',
  //   'vikas - 40455'
  // ];
  let res = await trainingObj.save();
  console.log("xcvbnm,",res)

  const trainingId= res._id;
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
  try {
    // Update the training session document with the provided data
    console.log("hello",id, data)
    // let data1 = await Training.findOne({_id:id})
    // console.log("bye", data1)
    // const updatedTraining = await Training.findByIdAndUpdate(id, data, { new: true });
    const updatedTraining = await Training.findOneAndUpdate({_id:id}, {$set:data});
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
module.exports = {
  getTrainingSession,
  saveTrainingSession,
  editTrainingSession,
  deleteTrainingSession
};
