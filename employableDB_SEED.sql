DROP DATABASE IF EXISTS employable_db;
CREATE DATABASE employable_db;

USE employable_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY(department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT DEFAULT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(role_id) REFERENCES role(id)
);

INSERT INTO department (name)
VALUES ("Legal"), ("Production"), ("Corporate"), ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Senior Lawyer", 140000, 1), ("Junior Lawyer", 100000, 1), ("Lead Developer", 110000, 2), ("Junior Developer", 90000, 2), ("Executive", 200000, 3), ("Executive Assistant", 100000, 3), ("Lead Salesperson", 75000, 4), ("Salesperson", 60000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, null), ("Mike", "Jones", 2, 1), ("Cynthia", "Blaadsworth", 3, null), ("Johnny", "Rocket", 4, 3), ("Bigly", "Wigly", 5, null), ("Littly", "Wigly", 6, 5), ("Worketh", "Hoarser", 7, null), ("Young", "Money", 8, 7);

