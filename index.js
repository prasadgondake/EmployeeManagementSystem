var Express = require("express");
var bodyParser = require("body-parser");

var app = Express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// const moment = require('moment'); // Import moment.js library
var cors = require('cors');
app.use(cors());

var mysql = require("mysql2");
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@Minor@123@',
    database: 'mytestdb'
});

var fileUpload = require('express-fileupload');
var fs = require('fs');
const { response } = require("express");
app.use(fileUpload());
app.use('/Photos' , Express.static(__dirname+'/Photos'));

app.listen(49146, () => { 
    connection.connect(function (err) {
        if (err) throw err;
        console.log('Connected to DB');
    });
});

app.get('/', (request, response) => {
    response.json('Hello World');
    // response.end(); // Add this line to terminate the response process.
}); 

app.get('/api/department',(request , response)=>{
    var query=`SELECT * from mytestdb.Department`;
    connection.query(query , function(err , rows , fields){
        if(err){
            response.send('Failed');
        }
        response.send(rows);
    });
});

app.post('/api/department',(request , response)=>{
    var query=`INSERT into  mytestdb.Department
                (DepartmentName)
                VALUE(?)`;
    var values = [
        request.body['DepartmentName']
    ];

    connection.query(query , values , function(err , rows , fields){
        if(err){
            response.send('Failed');
        }
        response.json('Added SUccsccfully');
    });
});

app.put('/api/department',(request , response)=>{
    var query=`UPDATE mytestdb.Department
    set DepartmentName =? where DepartmentId=?`;
    // var values = []
    var values = [
        request.body['DepartmentName'],
        request.body['DepartmentId']
    ];

    connection.query(query , values , function(err , rows , fields){
        if(err){
            response.send('Failed');
        }
        response.json('Updated SUccsccfully');
    });
});

app.delete('/api/department/:id', (request, response) => {
    var query = `DELETE FROM mytestdb.Department
    WHERE DepartmentId=?`;
    
    var values = [
        parseInt(request.params.id)
    ];

    connection.query(query, values, function(err, rows, fields) {
        if (err) {
            console.error(err); // Optional: Print the error to console for debugging
            response.status(500).send('Failed to delete department.'); // Sending an error response with status 500
            return; // Add return statement to terminate the function here
        }
        
        response.json('Deleted Successfully');
    });
});


// ///////////////Employee//////////////




// app.get('/api/employee',(request , response)=>{
//     var query=`SELECT * from mytestdb.Employee`;
//     connection.query(query , function(err , rows , fields){
//         if(err){
//             response.send('Failed');
//         }
//         response.send(rows);
//     });
// });

app.get('/api/employee',(request,response)=>{

    var query= ` select EmployeeId,EmployeeName,Department,
                        DATE_FORMAT(DateOfJoining,'%Y-%m-%d') as DateOfJoining,
                        PhotoFileName
                        from 
                        mytestdb.Employee`;
    connection.query(query,function(err,rows,fields){
        if(err){
            response.send('Failed');
        }
        response.send(rows);
    })

})

app.post('/api/employee', (request, response) => {
    var query = `INSERT INTO mytestdb.Employee
    (EmployeeName, Department, DateOfJoining, PhotoFileName)
    VALUES (?, ?, ?, ?)`;

    // var dateOfJoining = moment(request.body['DateOfJoining']).format('YYYY-MM-DD');

    var values = [
        request.body['EmployeeName'],
        request.body['Department'],
        // dateOfJoining,
        request.body['DateOfJoining'],
        request.body['PhotoFileName'],
        // request.body['EmployeeId']
    ];

    connection.query(query, values, function(err, rows, fields) {
        // Rest of your code remains the same
        if (err) {
            console.error(err); // Optional: Print the error to console for debugging
            response.status(500).send('Failed to update employee.'); // Sending an error response with status 500
            return; // Add return statement to terminate the function here
        }
        response.json('Updated Successfully');
    });
});




app.put('/api/employee', (request, response) => {
    var query = `UPDATE mytestdb.Employee
    SET EmployeeName = ?,
    Department = ?,
    DateOfJoining = ?,
    PhotoFileName = ?
    WHERE EmployeeId = ?`;

    // Convert the DateOfJoining to the correct format using moment.js
    // var dateOfJoining = moment(request.body['DateOfJoining']).format('YYYY-MM-DD');

    var values = [
        request.body['EmployeeName'],
        request.body['Department'],
        request.body['DateOfJoining'],
        request.body['PhotoFileName'],
        request.body['EmployeeId']
    ];

    connection.query(query, values, function(err, rows, fields) {
        // Rest of your code remains the same
        if (err) {
            console.error(err); // Optional: Print the error to console for debugging
            response.status(500).send('Failed to update employee.'); // Sending an error response with status 500
            return; // Add return statement to terminate the function here
        }
        response.json('Updated Successfully');
    });
});


app.delete('/api/employee/:id', (request, response) => {
    var query = `DELETE FROM mytestdb.Employee
    WHERE EmployeeId=?`;
    
    var values = [
        parseInt(request.params.id)
    ];

    connection.query(query, values, function(err, rows, fields) {
        if (err) {
            console.error(err); // Optional: Print the error to console for debugging
            response.status(500).send('Failed to delete department.'); // Sending an error response with status 500
            return; // Add return statement to terminate the function here
        }
        
        response.json('Deleted Successfully');
    });
});

app.post('/api/employee/savefile',(request , response)=>{
    fs.writeFile("./Photos/"+request.files.file.name,
    request.files.file.data,function(err){
        if(err){
            return
            console.log(err);
        }
        response.json(request.files.file.name);
    })
})