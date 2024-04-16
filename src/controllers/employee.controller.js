const employeeService = require('../services/employee.service.js')
const getEmployeeList = async(req,res)=>{
    let response = await employeeService.getEmployeeList(req.body)
    res.send(response)
}
module.exports={getEmployeeList}