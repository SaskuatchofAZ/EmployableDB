const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Servinuphotfiles34!",
    database: "employable_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});

const init = function() {
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
                console.log("How'd you break this?");
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
                }
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

function viewDept(){
    connection.query("SELECT * FROM department", function(err, res) {
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
                    return;
            }
        })
    })
}

init();