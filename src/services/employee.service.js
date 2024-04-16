const Employee = require('../models/employee.model')
const getEmployeeList=async()=>{
    const res = await Employee.find().populate('trainingId')
    return res

}
module.exports = {getEmployeeList}