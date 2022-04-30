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
        default: 0,
        name: 'menuOptions',
        message: 'What would you like to do? (Use arrow keys)',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit', new inquirer.Separator()],
        pageSize: 9
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
        // const table = cTable.getTable(rows);
        // console.log(`${table}`);
        manageEmployees();
    })
};

const addEmployee = () => {
    const jobQuery = `SELECT title FROM jobrole`;
    db.query (jobQuery, (err, jobRoles) =>{
        if (err) {
            console.log({ error: err.message });
            return;
        }
        console.table(jobRoles);
    })
    const managerQuery = `SELECT CONCAT(first_name, ' ', last_name) FROM employee`;
    db.query (managerQuery, (err, managerChoice) =>{
        if (err) {
            console.log({ error: err.message });
            return;
        }
        console.table(managerChoice);
    })
    return inquirer.prompt([{
        type: 'text',
        name: 'firstName',
        message: "What is the Employee's first name?",
        validate: firstNameInput => {
            if (firstNameInput) {
                return true;
            } else {
                console.log("Please enter a name!");
                return false;
            }
        }
    },
    {
        type: 'text',
        name: 'lastName',
        message: "What is the Employee's last name?",
        validate: lastNameInput => {
            if (lastNameInput) {
                return true;
            } else {
                console.log("Please enter a name!");
                return false;
            }
        }
    },
    {
        type: 'rawlist',
        default: 0,
        name: 'jobrole',
        message: "What is the Employee's Job Role? (Use arrow keys)",
        choices: [jobRoles, new inquirer.Separator()],
        pageSize: 9
    },
    {
        type: 'rawlist',
        default: 0,
        name: 'manager',
        message: "Who is the Employee's Manager? (Use arrow keys)",
        choices: [managerChoice, new inquirer.Separator()],
        pageSize: 9
    }])
    .then(({ answers }) => {
        console.table(answers);
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
        const params = [answers.firstName, answers.lastName, answers.jobrole, answers.manager];
        manageEmployees();
    })
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
        manageEmployees();
    })
};

const addRole = () => {
    return inquirer.prompt([{
        type: 'text',
        name: 'newrole',
        message: "What is the New Role?",
        validate: newroleInput => {
            if (newroleInput) {
                return true;
            } else {
                console.log("Please enter a Role!");
                return false;
            }
        }
    }])
    .then(({ newroledata }) => {
        const sql = `INSERT INTO jobrole (title, salary, department_id) VALUES (?,?,?)`;
        const params = newdept;
        db.query (sql, params, (err, result) => {
            if (err) {
                console.log({ error: err.message });
                return;
            }
        })
        console.log(`Added ${newdept} to Database.`);
        manageEmployees();
    })
};

const viewDepartments = () => {
    const sql = `SELECT * FROM department`;
    db.query (sql, (err, rows) =>{
        if (err) {
            console.log({ error: err.message });
            return;
        }
        console.table(rows);
        manageEmployees();
    })
};

const addDepartment = () => {
    return inquirer.prompt([{
        type: 'text',
        name: 'newdept',
        message: "What is the New Department?",
        validate: newdeptInput => {
            if (newdeptInput) {
                return true;
            } else {
                console.log("Please enter a Department!");
                return false;
            }
        }
    }])
    .then(({ newdept }) => {
        const sql = `INSERT INTO department (deptname) VALUES (?)`;
        const params = newdept;
        db.query (sql, params, (err, result) => {
            if (err) {
                console.log({ error: err.message });
                return;
            }
        })
        console.log(`Added ${newdept} to Database.`);
        manageEmployees();
    })
};

const quitApp = () => {
    process.exit();
};

const splash = () => {
    console.log(`
    ______                __                                    
    / ____/___ ___  ____  / /___  __  _____  ___                 
   / __/ / __ '__ \\/ __ \\/ / __ \\/ / / / _ \\/ _ \\                
  / /___/ / / / / / /_/ / / /_/ / /_/ /  __/  __/                
 /_____/_/ /_/ /_/ .___/_/\\____/\\__, /\\___/\\___/                 
                /_/            /____/                            
     __  ___                                                  __ 
    /  |/  /___ _____  ____ _____ ____  ____ ___  ___  ____  / /_
   / /|_/ / __ '/ __ \\/ __ '/ __ '/ _ \\/ __ '__ \\/ _ \\/ __ \\/ __/
  / /  / / /_/ / / / / /_/ / /_/ /  __/ / / / / /  __/ / / / /_  
 /_/  /_/\\__,_/_/ /_/\\__,_/\\__, /\\___/_/ /_/ /_/\\___/_/ /_/\\__/  
                          /____/                                 
    _____            __                                          
   / ___/__  _______/ /____  ____ ___                            
   \\__ \\/ / / / ___/ __/ _ \\/ __ '__ \\                           
  ___/ / /_/ (__  ) /_/  __/ / / / / /                           
 /____/\\__, /____/\\__/\\___/_/ /_/ /_/                            
      /____/                        
    `)
}

splash();
manageEmployees();