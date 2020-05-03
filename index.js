const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Servinuphotfiles34!",
    database: "employable_db"
});



const init = function () {
    inquirer.prompt(
        {
            type: "list",
            message: "Welcome to the employable_db main page: What would you like to do?",
            name: "mainPage",
            choices: [
                {
                    name: "Go to departments subscreen.",
                    value: "departments"
                },
                {
                    name: "Go to employees subscreen.",
                    value: "employees"
                },
                {
                    name: "Go to roles subscreen.",
                    value: "roles"
                },
                {
                    name: "Exit program.",
                    value: "exit"
                }
            ]
        }
    ).then(response => {
        switch (response.mainPage) {
            case "departments":
                departments();
                break;
            case "employees":
                employees();
                break;
            case "roles":
                roles();
                break;
            default:
                console.log("Ending connection to database...");
                connection.end();
                console.log("Connection terminated.")
                return;
        }
    })

}

function departments() {
    // ask what they want to do
    inquirer.prompt(
        {
            type: "list",
            name: "departmentChoice",
            message: "What would you like to do in departments?",
            choices: [
                {
                    name: "View all departments.",
                    value: "view"
                },
                {
                    name: "Edit a department.",
                    value: "edit"
                },
                {
                    name: "Add a department.",
                    value: "add"
                },
            ]
        }
    ).then(answer => {
        switch (answer.departmentChoice) {
            case "view":
                viewDept();
                break;
            case "edit":
                editDept();
                break;
            case "add":
                addDept();
                break;
        }
    })
    // view, edit, or add departments
}

function viewDept() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err
        console.table(res)
        inquirer.prompt(
            {
                type: "list",
                name: "afterView",
                message: "What would you like to do?",
                choices: [
                    {
                        name: "Go back to department page.",
                        value: "main"
                    },
                    {
                        name: "Go back to main page.",
                        value: "home"
                    },
                    {
                        name: "Exit program",
                        value: "exit"
                    }
                ]
            }
        ).then(choice => {
            switch (choice.afterView) {
                case "main":
                    departments();
                    break;
                case "home":
                    init();
                    break;
                default:
                    connection.end();
                    return;
            }
        })
    })
}

function editDept() {
    connection.query("SELECT * FROM department", function (err, res) {
        inquirer.prompt([
            {
                type: "list",
                message: "Which department would you like to edit?",
                name: "department",
                choices: res.map(department => {
                    return {
                        name: department.name,
                        value: department.id
                    }
                })
            }
        ]).then(answerOne => {
            inquirer.prompt([{
                type: "input",
                name: "newName",
                message: "What would you like to change the department name to?"
            }]).then(answerTwo => {
                connection.query("UPDATE department SET ? WHERE ?", [{ name: answerTwo.newName }, { id: answerOne.department }], (err, deptData) => {
                    console.log(deptData.affectedRows + " department updated!");
                    init();
                })
            })
        })

    })
}

function addDept() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of your new department?",
            name: "newDept"
        }
    ]).then(answer => {
        connection.query("INSERT INTO department SET ?", { name: answer.newDept }, (err, deptData) => {
            if (err) throw err;
            console.log(deptData.insertId + " is the ID of the new department.");
            init();
        })
    })
}

function roles() {
    // ask what they want to do
    inquirer.prompt(
        {
            type: "list",
            name: "roleChoice",
            message: "What would you like to do in roles?",
            choices: [
                {
                    name: "View all roles.",
                    value: "view"
                },
                {
                    name: "Edit a role.",
                    value: "edit"
                },
                {
                    name: "Add a role.",
                    value: "add"
                },
            ]
        }
    ).then(answer => {
        switch (answer.roleChoice) {
            case "view":
                viewRole();
                break;
            case "edit":
                editRole();
                break;
            case "add":
                addRole();
                break;
        }
    })
    // view, edit, or add departments
}

function viewRole() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err
        console.table(res)
        inquirer.prompt(
            {
                type: "list",
                name: "afterView",
                message: "What would you like to do?",
                choices: [
                    {
                        name: "Go back to roles page.",
                        value: "main"
                    },
                    {
                        name: "Go back to main page.",
                        value: "home"
                    },
                    {
                        name: "Exit program",
                        value: "exit"
                    }
                ]
            }
        ).then(choice => {
            switch (choice.afterView) {
                case "main":
                    roles();
                    break;
                case "home":
                    init();
                    break;
                default:
                    connection.end();
                    return;
            }
        })
    })
}

function editRole() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Which role would you like to edit?",
                name: "role",
                choices: res.map(role => {
                    return {
                        name: role.title,
                        value: role.id
                    }
                })
            }
        ]).then(answerOne => {
            inquirer.prompt([{
                type: "list",
                message: "Did you want to edit the role's name, salary, or both?",
                name: "roleChoice",
                choices: [
                    {
                        name: "Role name.",
                        value: "name"
                    },
                    {
                        name: "Role salary",
                        value: "salary"
                    },
                    {
                        name: "Both role name and salary.",
                        value: "both"
                    }
                ]
            }]).then(choice => {
                if (choice.roleChoice === "name") {
                    inquirer.prompt([{
                        type: "input",
                        name: "newTitle",
                        message: "What did you want to change the name of the role to?"
                    }]).then(answerTwo => {
                        connection.query("UPDATE role SET ? WHERE ?", [{ title: answerTwo.newTitle }, { id: answerOne.role }], (err, res) => {
                            if (err) throw err;
                            console.log(res);
                            init();
                        })
                    })
                } else if (choice.roleChoice === "salary") {
                    inquirer.prompt([{
                        type: "input",
                        name: "newSalary",
                        message: "What did you want to change the salary to (Use numbers)?"
                    }]).then(answerTwo => {
                        connection.query("UPDATE role SET ? WHERE ?", [{ salary: parseInt(answerTwo.newSalary) }, { id: answerOne.role }], (err, res) => {
                            if (err) throw err;
                            console.log(res);
                            init();
                        })
                    })
                } else {
                    inquirer.prompt([{
                        type: "input",
                        name: "newTitle",
                        message: "What did you want to change the name of the role to?"
                    }]).then(answerTwo => {
                        inquirer.prompt([{
                            type: "input",
                            name: "newSalary",
                            message: "What did you want to change the salary to (Use numbers)?"
                        }]).then(answerThree => {
                            connection.query("UPDATE role SET ? WHERE ?", [{ title: answerTwo.newTitle, salary: parseInt(answerThree.newSalary) }, { id: answerOne.role }], (err, res) => {
                                if (err) throw err;
                                console.log(res);
                                init();
                            })
                        })
                    })
                }
            })
        })

    })
}

function addRole() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the title of your new role?",
            name: "newRole"
        }
    ]).then(answerOne => {
        inquirer.prompt([
            {
                type: "input",
                message: "What is the salary of the new role?",
                name: "newSalary"
            }
        ]).then(answerTwo => {
            connection.query("SELECT * FROM department", (err, res) => {
                if (err) throw err;
                inquirer.prompt([
                    {
                        type: "list",
                        message: "Which department is the new role a part of?",
                        name: "roleDept",
                        choices: res.map(department => {
                            return {
                                name: department.name,
                                value: department.id
                            }
                        })
                    }
                ]).then(answerThree => {
                    connection.query("INSERT INTO role SET ?", { title: answerOne.newRole, salary: answerTwo.newSalary, department_id: answerThree.roleDept }, (err, response) => {
                        if (err) throw err;
                        console.log(response.insertId + " is the ID of the new role!");
                        init();
                    })
                })
            })
        })
    })
}

function employees() {
    // ask what they want to do
    inquirer.prompt(
        {
            type: "list",
            name: "employeeChoice",
            message: "What would you like to do in employees?",
            choices: [
                {
                    name: "View all employees.",
                    value: "view"
                },
                {
                    name: "Edit an employee.",
                    value: "edit"
                },
                {
                    name: "Add an employee.",
                    value: "add"
                },
            ]
        }
    ).then(answer => {
        switch (answer.employeeChoice) {
            case "view":
                viewEmployee();
                break;
            case "edit":
                editEmployee();
                break;
            case "add":
                addEmployee();
                break;
        }
    })
    // view, edit, or add departments
}

function viewEmployee() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err
        console.table(res)
        inquirer.prompt(
            {
                type: "list",
                name: "afterView",
                message: "What would you like to do?",
                choices: [
                    {
                        name: "Go back to employees page.",
                        value: "main"
                    },
                    {
                        name: "Go back to main page.",
                        value: "home"
                    },
                    {
                        name: "Exit program",
                        value: "exit"
                    }
                ]
            }
        ).then(choice => {
            switch (choice.afterView) {
                case "main":
                    employees();
                    break;
                case "home":
                    init();
                    break;
                default:
                    connection.end();
                    return;
            }
        })
    })
}

function editEmployee() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Which employee would you like to edit?",
                name: "id",
                choices: res.map(employee => {
                    return {
                        name: employee.first_name + " " + employee.last_name,
                        value: employee.id
                    }
                })
            }
        ]).then(answerOne => {
            inquirer.prompt([{
                type: "list",
                message: "Did you want to edit the employee's first name, last name, role, manager?",
                name: "employeeChoice",
                choices: [
                    {
                        name: "First name.",
                        value: "firstName"
                    },
                    {
                        name: "Last name.",
                        value: "lastName"
                    },
                    {
                        name: "Employee role.",
                        value: "role"
                    },
                    {
                        name: "Manager",
                        value: "manager"
                    }
                ]
            }]).then(choice => {
                if (choice.employeeChoice === "firstName") {
                    inquirer.prompt([{
                        type: "input",
                        name: "newFirstName",
                        message: "What did you want to change the first name of the employee to?"
                    }]).then(answerTwo => {
                        connection.query("UPDATE employee SET ? WHERE ?", [{ first_name: answerTwo.newFirstName }, { id: answerOne.id }], (err, response) => {
                            if (err) throw err;
                            console.log(response.affectedRows + " row changed!");
                            init();
                        })
                    })
                } else if (choice.employeeChoice === "lastName") {
                    inquirer.prompt([{
                        type: "input",
                        name: "newLastName",
                        message: "What did you want to change the last name of the employee to?"
                    }]).then(answerTwo => {
                        connection.query("UPDATE employee SET ? WHERE ?", [{ last_name: answerTwo.newLastName }, { id: answerOne.id }], (err, response) => {
                            if (err) throw err;
                            console.log(response.affectedRows + " row changed!");
                            init();
                        })
                    })
                } else if (choice.employeeChoice === "role") {
                    connection.query("SELECT * FROM role", function (err, response) {
                        inquirer.prompt([{
                            type: "list",
                            name: "newRole",
                            message: "What did you want to change the employee's role to?",
                            choices: response.map(role => {
                                return {
                                    name: role.title,
                                    value: role.id
                                }
                            })
                        }]).then(answerTwo => {
                            connection.query("UPDATE employee SET ? WHERE ?", [{ role_id: answerTwo.newRole }, { id: answerOne.id }], function (err, updateData) {
                                if (err) throw err;
                                console.log(updateData.affectedRows + " row changed!");
                                init();
                            })

                        })

                    })
                } else {
                    connection.query("SELECT * FROM employee", function (err, response) {
                        inquirer.prompt([
                            {
                                type: "list",
                                name: "newManager",
                                message: "Who is the employee's new manager?",
                                choices: response.map(employee => {
                                    return {
                                        name: employee.first_name + " " + employee.last_name,
                                        value: employee.id
                                    }
                                })
                            }
                        ]).then(answerTwo => {
                            connection.query("UPDATE employee SET ? WHERE ?", [{ manager_id: answerTwo.newManager }, { id: answerOne.id }], function (error, managerData) {
                                if (err) throw err;
                                console.log(managerData.affectedRows  + " row changed!");
                                init();
                            })
                        })
                    })
                }

            })
        })
    })
}

function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the employee's first name?",
            name: "firstName"
        },
        {
            type: "input",
            message: "What is the employee's last name?",
            name: "lastName"
        }
    ]).then(answerOne => {
        connection.query("SELECT * FROM role", function(err, res) {
            if (err) throw err
            inquirer.prompt([
                {
                    type: "list",
                    name: "roleChoice",
                    message: "What is the employee's role?",
                    choices: res.map(role => {
                        return {
                            name: role.title,
                            value: role.id
                        }
                    })
                }
            ]).then(answerTwo => {
                connection.query("SELECT * FROM employee", function(err, response) {
                    managerChoices = response.map(employee => {
                        return {
                            name: employee.first_name + " " + employee.last_name,
                            value: employee.id
                        }
                    });
                    nullManager = {
                        name: "No manager",
                        value: null
                    };
                    managerChoices.push(nullManager);
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "manager",
                            message: "Who is the employee's manager?",
                            choices: managerChoices
                        }
                    ]).then(answerThree => {
                        connection.query("INSERT INTO employee SET ?", 
                            {
                                first_name: answerOne.firstName,
                                last_name: answerOne.lastName,
                                role_id: answerTwo.roleChoice,
                                manager_id: answerThree.manager
                            },
                            function (err, insertData) {
                                if (err) throw err;
                                console.log("New employee is ID #" + insertData.insertId);
                                init();
                            }
                        )
                    })
                })
            })
        })
    })
}

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    init();
});