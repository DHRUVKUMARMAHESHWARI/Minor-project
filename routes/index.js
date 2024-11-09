const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const { Student, validateStudent } = require('../models/student'); // Load Student model
require('../config/mongoose'); // Connect to MongoDB

// Load authorized students from JSON file
const authorizedStudentsPath = path.join(__dirname, '..', 'authorized_students.json');
const authorizedStudents = JSON.parse(fs.readFileSync(authorizedStudentsPath, 'utf-8'));

// Render login page
router.get("/", (req, res) => {
    res.render("login");
});

// Render homepage
router.get("/home", (req, res) => {
    res.render("homepage");
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Find an authorized student that matches the email and password
    const authorizedStudent = authorizedStudents.find(
        (student) => student.Email === email && student.Password === password
    );

    if (authorizedStudent) {
        try {
            // Check if the student already exists in MongoDB
            let student = await Student.findOne({ Email: email });

            if (!student) {
                // Hash the password before saving
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                // Prepare student data
                const studentData = {
                    ...authorizedStudent,
                    Password: hashedPassword
                };

                // Validate student data with Joi
                const { error } = validateStudent(studentData);
                if (error) return res.status(400).send(error.details[0].message);

                // Create and save the student in MongoDB
                student = new Student(studentData);
                await student.save();

                console.log(`User account created for ${student.StudentName}`);
            } else {
                console.log(`User ${student.StudentName} already exists in MongoDB.`);
            }

            // Render homepage with student data from MongoDB
            res.render("homepage", { student });
        } catch (error) {
            console.error('Error processing login:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        // Unauthorized access
        res.status(401).send('Invalid email or password. You are not an authorized student.');
    }
});

module.exports = router;
