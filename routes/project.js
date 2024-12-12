const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { body, validationResult } = require('express-validator');
// var fetchadmin = require('../middleware/fetchadmin');
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const upload = multer({ storage: storage, dest: 'temp/' });
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload/images');
    },
    filename: (req, file, cb) => {
        // cb(null, Date.now() + '-' + file.originalname);
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

// const upload = multer({ storage: storage });

// router.post('/images/upload', upload.single('project'), async (req, res) => {
//     try {
//         res.json({
//             success: 1,
//             image_url: `/images/${req.file.filename}`
//         })
//     } catch (error) {
//         res.send({ "error": "Unable to upload image" });
//     }
// })

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});


router.post('/addproject', upload.single('image'), 
    async (req, res) => {

    try {
        const file = req.files.image;
        const ImageData = await cloudinary.uploader
            .upload(file.tempFilePath)
            .catch((error) => {
                console.log(error);
            });
            // console.log(ImageData);

            let projects = await Project.find({});
            let id;
            if (projects.length > 0) {
                let last_project_array = projects.slice(-1);
                let last_project = last_project_array[0];
                id = last_project.id + 1;
            }
            else {
                id = 1;
            }
            const project = new Project({
                id: id,
                title: req.body.title,
                description: req.body.description,
                content: req.body.content,
                // image: req.body.image,
                image: ImageData.secure_url,
            });
            await project.save();
            console.log(project);
            console.log("Saved");
            res.json({
                success: true,
                title: req.body.title,
            })
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    });



// router.get('/:id', async (req, res) => {
//     const projectId = req.params.id;
//     const project = await Project.find(p => p.id === projectId);
//     if (project) {
//         res.send(project)
//     } else {
//         res.status(400).json({ error: "Project not found!" });
//     }
// })


// router.get('/:id', async (req, res) => {
//     const projectId = req.params.id;
//     try {
//         const project = await Project.find( p => p.id === projectId ); // Ensure projectId is a number
//         if (project) {
//             res.send(project);
//         } else {
//             res.status(404).json({ error: "Project not found!" });
//         }
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Internal Server Error");
//     }
// });


// ROUTE 3: Update an existing Project using: PUT "/api/projects/updateProject". login required
// router.put('/updateproject/:id', async (req, res) => {
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

// router.post('/addproject', upload.single('image'), async (req, res) => {
//     try {
//         // Upload image to Cloudinary
//         const result = await cloudinary.uploader.upload(req.file.path);

//         // Delete the temporary file
//         fs.unlinkSync(req.file.path);

//         // Generate new project ID
//         const projects = await Project.find({});
//         const newProjectId = projects.length > 0 ? projects[projects.length - 1].id + 1 : 1;

//         // Create new project
//         const project = new Project({
//             id: newProjectId,
//             title: req.body.title,
//             description: req.body.description,
//             content: req.body.content,
//             image: result.secure_url, // Save Cloudinary URL
//         });

//         await project.save();
//         res.status(201).json({ success: true, message: "Project added successfully!" });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// });

router.post('/deleteproject', async (req, res) => {

    try {
        await Project.findOneAndDelete({ id: req.body.id });
        console.log("Project Deleted");
        res.json({
            success: true,
            title: req.body.title
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


router.get('/allprojects', async (req, res) => {
    try {
        const projects = await Project.find({});
        console.log("All Projects are Fetched");
        // res.json(projects);
        res.send(projects);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})


// router.get('/allprojects', async (req, res) => {
//     try {
//         const projects = await Project.find({});
//         console.log("All Projects are Fetched");

//         // Check if projects are found
//         if (projects.length === 0) {
//             return res.status(404).json({ success: false, message: "No projects found." });
//         }

//         // Send a structured response
//         res.status(200).json({
//             success: true,
//             count: projects.length,
//             projects: projects,
//         });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// });

module.exports = router