const db = require('./config/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.')
});

// Start asking questions
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
        } else if (menuOptions === 'Add Employee' ) {
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

// View Employees
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

// Add Employees
const addEmployee = () => {
    const sqlNames = `SELECT CONCAT(first_name, ' ', last_name) AS fullname FROM employee`;
    const sqlRoles = `SELECT title FROM jobrole`;
    db.query(sqlNames, (err, rowsNames) => {
        if (err) {
            console.log({ error: err.message });
            return;
        }
        var empNames = ['None'];
        rowsNames.forEach(element => empNames.push(element.fullname));
        db.query(sqlRoles, (err, rowsRoles) => {
            if (err) {
                console.log({ error: err.message });
                return;
            }
            var empRoles = [];
            rowsRoles.forEach(element => empRoles.push(element.title));
            return inquirer.prompt([{
                type: 'text',
                name: 'firstname',
                message: "What is the Employee's First Name?",
                validate: firstnameInput => {
                    if (firstnameInput) {
                        return true;
                    } else {
                        console.log("Please enter a Name!");
                        return false;
                    }
                }
            },
            {
                type: 'text',
                name: 'lastname',
                message: "What is the Employee's Last Name?",
                validate: lastnameInput => {
                    if (lastnameInput) {
                        return true;
                    } else {
                        console.log("Please enter a Name!");
                        return false;
                    }
                }
            },{
                type: 'list',
                default: 0,
                name: 'dept',
                message: "What is this Employee's Role? (Use arrow keys)",
                choices: empRoles,
                pageSize: 9
            },
            {
                type: 'list',
                default: 0,
                name: 'manager',
                message: "Who is the Employee's Manager? (Use arrow keys)",
                choices: empNames,
                pageSize: 9
            }])
            .then((newhire) => {
                var sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
                roleDept = empRoles.indexOf(newhire.dept) + 1;
                console.log(newhire.firstname, newhire.lastname, empRoles, roleDept, newhire.manager);
                var empManager = empNames.indexOf(newhire.manager);
                var params = [newhire.firstname, newhire.lastname, roleDept, empManager];
                if (empManager === 0) {
                    sql = `INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)`;
                    params = [newhire.firstname, newhire.lastname, roleDept];
                }
                db.query(sql, params, (err, result) => {
                    if (err) {
                        console.log({ error: err.message });
                        return;
                    }
                })
                console.log(`Added ${newhire.firstname} ${newhire.lastname} to Database.`);
                manageEmployees();
            })
        })
    })
}

// Update Employee Job Role
const updateEmployee = () => {
    const sqlNames = `SELECT CONCAT(first_name, ' ', last_name) AS fullname FROM employee`;
    const sqlRoles = `SELECT title FROM jobrole`;
    db.query(sqlNames, (err, rowsNames) => {
        if (err) {
            console.log({ error: err.message });
            return;
        }
        var empNames = [];
        rowsNames.forEach(element => empNames.push(element.fullname));
        console.log(empNames);
        db.query(sqlRoles, (err, rowsRoles) => {
            if (err) {
                console.log({ error: err.message });
                return;
            }
            var empRoles = [];
            rowsRoles.forEach(element => empRoles.push(element.title));
            console.log(empRoles);
            return inquirer.prompt([{
                type: 'list',
                default: 0,
                name: 'name',
                message: "Which Employee is changing Roles? (Use arrow keys)",
                choices: empNames,
                pageSize: 9
            },
            {
                type: 'list',
                default: 0,
                name: 'dept',
                message: "What is this Employee's New Role? (Use arrow keys)",
                choices: empRoles,
                pageSize: 9
            }])
            .then((changerole) => {
                console.log(changerole);
                const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                roleDept = empRoles.indexOf(changerole.dept) + 1;
                empID = empNames.indexOf(changerole.name) + 1;
                console.log(changerole.dept, roleDept, changerole.name, empID);
                const params = [roleDept, empID];
                db.query(sql, params, (err, result) => {
                    if (err) {
                        console.log({ error: err.message });
                        return;
                    }
                })
                console.log(`Added ${changerole.name} to Database.`);
                manageEmployees();
            })
        })
    })    
};

// View Roles
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

// Add Roles
const addRole = () => {
    const sql = `SELECT deptname FROM department`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log({ error: err.message });
            return;
        }
        var depts = [];
        rows.forEach(element => depts.push(element.deptname));
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
        },
        {
            type: 'text',
            name: 'salary',
            message: "What is the Salary for this Role?",
            validate: salaryInput => {
                if (salaryInput) {
                    return true;
                } else {
                    console.log("Please enter a Salary!");
                    return false;
                }
            }
        },
        {
            type: 'list',
            default: 0,
            name: 'dept',
            message: 'What Department is this Role in? (Use arrow keys)',
            choices: depts,
            pageSize: 9
        }])
        .then(( newroledata ) => {
            const sql = `INSERT INTO jobrole (title, salary, department_id) VALUES (?,?,?)`;
            roleDept = depts.indexOf(newroledata.dept) + 1;
            const params = [newroledata.newrole, newroledata.salary, roleDept];
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log({ error: err.message });
                    return;
                }
            })
            console.log(`Added ${newroledata.newrole} to Database.`);
            manageEmployees();
        })
    })
};

// View Departments
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

// Add Departments
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

// Exit Application
const quitApp = () => {
    process.exit();
};

// Ascii Splash Screen
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