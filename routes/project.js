const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { body, validationResult } = require('express-validator');
var fetchadmin = require('../middleware/fetchadmin');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });


// ROUTE 1: Get All the projects using: GET "/api/projects/getadmin". login required
router.get('/fetchallprojects', fetchadmin, async (req, res) => {
    try {
        const projects = await Project.find({ admin: req.admin.id });
        res.json(projects);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

// ROUTE 2: Add a new Project using: POST "/api/projects/addProject". login required
router.post('/addproject', upload.single('image'), fetchadmin, [
    body("title", "Enter a valid title").isLength({ min: 5 }),
    body("description", "Enter a valid description").isLength({ min: 5 }),
    body("content", "Content must be atleast 15 characters").isLength({ min: 15 }),
], async (req, res, upload) => {
    try {

        const { title, description, content } = req.body;
        const image = req.file.filename; // Assuming image is uploaded successfully
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const project = new Project({
            title, description, content, image: image, admin: req.admin.id
        })
        const savedProject = await project.save();
        res.json(savedProject);
    } catch (error) {   
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})


// ROUTE 3: Update an existing Project using: PUT "/api/projects/updateProject". login required
// router.put('/updateproject/:id', fetchadmin, async (req, res) => {
//     const { title, description, content } = req.body;
//     // Create a newProject Object
//     try {
//         const newProject = {};
//         if (title) { newProject.title = title }
//         if (description) { newProject.description = description }
//         if (content) { newProject.content = content }

//         // Find the Project to be updated and update it
//         let project = await Project.findById(req.params.id);
//         if (!project) { return res.status(404).send("Not Found") }

//         if (project.admin.toString() !== req.admin.id) {
//             return res.status(401).send("Not Allowed");
//         }

//         project = await Project.findByIdAndUpdate(req.params.id, { $set: newProject }, { new: true })
//         res.json({ project });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Internal Server Error");
//     }

// })


// ROUTE 4: Delete an existing Project using: DELETE "/api/projects/deleteProject". login required
router.delete('/deleteproject/:id', fetchadmin, async (req, res) => {

    try {
        // Find the Project to be deleted and delete it
        let project = await Project.findById(req.params.id);
        if (!project) { return res.status(404).send("Not Found") }

        // Allow deletion only if admin owns this Project
        if (project.admin.toString() !== req.admin.id) {
            return res.status(401).send("Not Allowed");
        }

        project = await Project.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Project has been deleted", project: project });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router