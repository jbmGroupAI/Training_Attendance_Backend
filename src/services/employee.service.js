const Employee = require('../models/employee.model')
const getEmployeeList=async()=>{
    const res = await Employee.find().populate(['trainingId', 'finalTrainingId']);
    console.log("sss", res)
    return res

}
module.exports = {getEmployeeList}