const express = require('express');
const router = express.Router();
const Contract = require('../models/Contract');
const { body, validationResult } = require('express-validator');
var fetchadmin = require('../middleware/fetchadmin');
const nodemailer = require('nodemailer');


// Route 1: Get all the contracts using: GET "/api/contract/fetchallcontracts".
router.get('/fetchallcontracts', fetchadmin, async(req, res) => {
    try {
        const contracts = await Contract.find({ admin: req.admin.id });
        res.json(contracts);
    } catch(error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Route 2: Add a new Contract using: POST "/api/contract/addcontract".
router.post('/addcontract', fetchadmin, [
    body("firstname", "Enter a valid first name").isLength({ min:3 }),
    body("lastname", "Enter a valid last name").isLength({ min:3 }),
    body("email", "Enter a valid email").isEmail(),
    body("phone", "Enter a valid phone number with 10 digits").isLength(10),
    body("domain"),
    body("address", "Enter a valid address").isLength({ min:2 }),
    body("city", "Enter a valid city").isLength({ min:2 }),
    body("state"),
    body("width", "Enter a valid width").isLength({ min:2 }),
    body("length", "Enter a valid length").isLength({ min:2 })
], async (req, res) => {
    try {
        const { firstname, lastname, email, phone, domain, address, city, state, width, length,  query } = req.body;

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // or 'STARTTLS'
            auth: {
              user: 'luciferthegamer292@gmail.com',
              pass: 'indranooj#201'
            }
          });
        
          const mailOptions = {
            from: 'luciferthegamer292@gmail.com',
            to: 'luciferthegamer292@gmail.com',
            subject: 'New Form Submission',
            text: `Name: ${firstname} ${lastname} \n Email: ${email} \n Phone Number: ${phone} \n Domain: ${domain} \n Address: ${address} \n City: ${city} \n State: ${state} \n Plot Width: ${width} \n Plot Length: ${length} \n Request about project: ${query}`
          };
        
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log('Email sent: ' + info.response);
            res.json({ success: true });
          });

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({error: errors.array()});
        }

        const contract = new Contract({
            firstname, lastname, email, phone, domain, address, city, state, width, length,  query, admin: req.admin.id
        })
        const savedContract = await contract.save();
        res.json(savedContract);
    } catch(error) {
        console.error(error.message);
        res.status(500).send("Internal System Error");
    }
})


// Route 3: Delete an existing Contract using: DELETE "/api/contract/delcontract".
router.delete('/deletecontract/:id', fetchadmin, async(req, res) => {

    try {
        // Find the contract to be deleted and delete it.
        let contract = await Contract.findById(req.params.id);
        if(!contract) {
            return res.status(404).send("Not Found");
        }

        // Allow deletion only if admin owns this contract
        if(contract.admin.toString() !== req.admin.id){
            return res.status(401).send("Not Allowed");
        }

        contract = await Contract.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Contract has been deleted", contract: contract });
    } catch(error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router;