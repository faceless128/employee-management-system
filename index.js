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
    return inquirer.prompt({
        type: 'list',
        name: 'menuOptions',
        message: 'What would you like to do? (Use arrow keys)',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
    })
    .then(({ menuOptions }) => {
        if (menuOptions === 'View All Employees') {
            viewEmployees()
        } else if (menuOptions === 'Add Employees' ) {
            addEmployee()
        } else if (menuOptions === 'Update Employee Role') {
            updateEmployee()
        } else if (menuOptions === 'View All Roles' ) {
            viewRoles()
        } else if (menuOptions === 'Add Role' ) {
            addRole()
        } else if (menuOptions === 'View All Departments' ) {
            viewDepartments()
        } else if (menuOptions === 'Add Department' ) {
            addDepartment()
        } else {
            quitApp()
        }
    })
};


const viewEmployees = () => {
    const sql = `SELECT e.id, e.first_name, e.last_name, j.title, d.deptname AS department, j.salary, 
    CONCAT (m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN jobrole j
    ON e.role_id = j.id
    LEFT JOIN department d
    ON j.department_id = d.id
    LEFT JOIN employee m
    ON e.manager_id = m.id`;
    db.query (sql, (err, rows) =>{
        if (err) {
            console.log({ error: err.message });
            return;
        }
        console.table(rows);
    })
    manageEmployees();
};

const addEmployee = () => {
};

const updateEmployee = () => {
};

const viewRoles = () => {
    const sql = `SELECT j.id, j.title, d.deptname AS department, j.salary
    FROM jobrole j
    LEFT JOIN department d
    ON j.department_id = d.id`;
    db.query (sql, (err, rows) =>{
        if (err) {
            console.log({ error: err.message });
            return;
        }
        console.table(rows);
    })
    manageEmployees();
};

const addRole = () => {
};

const viewDepartments = () => {
    const sql = `SELECT * FROM department`;
    db.query (sql, (err, rows) =>{
        if (err) {
            console.log({ error: err.message });
            return;
        }
        console.table(rows);
    })
    manageEmployees();
};

const addDepartment = () => {
};

const quitApp = () => {
    return false;
};

manageEmployees();