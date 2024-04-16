const empArray = [
    'shashank - 39973',
    'pranjal - 40518',
    'rishabh - 40459',
    'vikas - 40455'
  ];
  
  const empData = empArray.map(emp => {
    // Split the string by ' - ' to separate the empName and empId
    const [empName, empId] = emp.split(' - ');
    
    // Extract the last 5 digits as empId and trim whitespace
    const last5Digits = Number(empId.trim().slice(-5));
    
    // Trim whitespace from empName
    const trimmedEmpName = empName.trim();
    
    return { empName: trimmedEmpName, empId: last5Digits };
  });
  
  console.log(empData);
  