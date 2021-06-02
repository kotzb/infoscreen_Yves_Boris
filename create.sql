DROP DATABASE IF EXISTS infoscreen;
CREATE DATABASE infoscreen;

USE infoscreen;

CREATE TABLE timetable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    classroom VARCHAR(10) NOT NULL,
    class VARCHAR(10) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    teacher VARCHAR(128) NOT NULL,
    day DATE NOT NULL
);
CREATE TABLE menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day DATE NOT NULL,
    name VARCHAR(128),
    ingredients TEXT NOT NULL
);
