const express = require('express');
const router = express.Router();
const fs = require('fs')
const authorizedStudents = JSON.parse(fs.readFileSync('authorized_students.json', 'utf-8'));
router.get("/", (req, res) => {
    res.render("login")
    // console.log("object");
});
router.get("/home", (req, res) => {
    res.render("homepage")
});

console.log(authorizedStudents);
router.post('/register', (req, res) => {
    const { email, password } = req.body;

    // Check if the email and password match the authorized student data
    const authorizedStudent = authorizedStudents.find(
        (student) => student.Email === email && student.Password === password
    );

    if (authorizedStudent) {
        // Create the user account in your application's database
        createUserAccount(authorizedStudent);
        res.render("homepage",{student:authorizedStudent})
    } else {
        res.status(401).send('Invalid email or password. You are not an authorized student.');
    }
});

function createUserAccount(student) {
    // Code to create the user account in your application's database
    console.log(`Creating user account for ${student.StudentName}`);
}

module.exports = router;