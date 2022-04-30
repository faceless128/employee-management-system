const db = require('./config/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.')
});

// Function to initialize app and start asking questions
const manageEmployees = () => {
    inquirer.prompt({
        type: 'list',
        name: 'menuOptions',
        message: 'What would you like to do? (Use arrow keys)',
        choices: ['View All Employees', 'Add Employees', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
    })
};

// Function call to initialize app
manageEmployees()