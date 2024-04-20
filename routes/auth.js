const express = require('express');
const AdminRouter = express.Router();
const Admin = require('../models/Admin');
// this imports the validationRequest from express-validator
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchadmin = require('../middleware/fetchadmin');

const JWT_SECRET = 'DevelopedbyIndr@';


// Route 1: Creating an Admin using: POST "/api/auth/createadmin". 
AdminRouter.post('/createadmin',
 [
    body("name", "Enter a valid name").isLength({ min: 5 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 8 characters").isLength({ min: 8 })
 ],
 async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    // When there is a email entered and that email is already exists in the DB then it will show status 400 (Bad request) and show the error
    if(!errors.isEmpty()){
        return res.status(400).json({success, errors: errors.array()});
    }
    try {
        // Check whether the user with this email exists already
        // By the findOne function it is checking for the specific email in the database if the email already present in the db then it will show status 400
        let admin = await Admin.findOne({ email: req.body.email });
        if(admin){
            return res.status(400).json({success, error: "Sorry an admin with this email already exists"});
        }

        // Salt will generate some random string
        const salt = await bcrypt.genSalt(10);
        // This secPass will create a new secured password using hashing
        const secPass = await bcrypt.hash(req.body.password, salt);

        // Creating a new Admin
        admin = await Admin.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });

        const data = {
            admin: {
                id: admin.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);

        success = true;
        res.json({ success, authtoken });
    } catch(error) {
        // catch errors
        console.error(error.message);
        // status code says something is wrong
        res.status(500).send("Internal Server Error")
    }
});


// Route 2: Authenticate an Admin using: POST "/api/auth/login".
AdminRouter.post(
    '/login',
    [
        body("email", "Enter a valid email").isEmail(),
        body("password", "Password cannot be blank").exists()
    ], async (req, res) => {
        // If there are errors, return Bad request and the errors
        let success = false;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({error: "Please try to login with correct credentials"});
        }

        // We are taking out email and password from the request body
        const {email, password} = req.body;
        try {
            let admin = await Admin.findOne({email});
            if(!admin){
                return res.status(400).json({error: "Please try to login with correct credentials"});
            }

            const passwordCompare = await bcrypt.compare(password, admin.password);
            if(!passwordCompare){
                success = false;
                return res.status(400).json({success, error: "Please try to login with correct credentials"});
            }

            const data = {
                admin: {
                    id: admin.id
                }
            }

            const authtoken = jwt.sign(data, JWT_SECRET);
            //  This will provide the authentication token to the user
            success = true;
            res.json({success, authtoken});
            
        } catch(error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
)  


// Route 3: Get loggedIn Admin details using: POST "/api/auth/getadmin".
AdminRouter.post('/getadmin', fetchadmin, async (req, res) => {
    try {
        const adminId = req.admin.id;
        const admin = await Admin.findById(adminId).select("-password");
        res.send(admin);
    } catch(error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}
)

// Used to export the AdminRouter function to the other pages
module.exports = AdminRouter;