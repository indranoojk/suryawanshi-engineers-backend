const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { body, validationResult } = require('express-validator');
// var fetchadmin = require('../middleware/fetchadmin');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload/images');
    },
    filename: (req, file, cb) => {
        // cb(null, Date.now() + '-' + file.originalname);
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

router.post('/images/upload', upload.single('project'), async (req, res) => {
    try {
        // console.log(req.file);
        // const { path, filename } = req.file;
        // const image = await Image({path, filename, admin: req.admin.id});
        // const savedImage = await image.save();
        // res.send({"msg": "Image Uploaded", imageId: savedImage._id});

        res.json({
            success: 1,
            image_url: `https://suryawanshi-engineers-backend.onrender.com/api/project/images/${req.file.filename}`
        })
    } catch (error) {
        res.send({ "error": "Unable to upload image" });
    }
})


// ROUTE 1: Get All the projects using: GET "/api/projects/getadmin". login required
router.get('/fetchallprojects', async (req, res) => {
    try {
        const projects = await Project.find({ admin: req.admin.id });
        res.json(projects);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

// ROUTE 2: Add a new Project using: POST "/api/projects/addProject". login required
router.post('/addproject', [
    body("title", "Enter a valid title").isLength({ min: 5 }),
    body("description", "Enter a valid description").isLength({ min: 5 }),
    body("content", "Content must be atleast 15 characters").isLength({ min: 15 }),
], async (req, res) => {
    // try {

    //     const { title, description, content } = req.body;
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return res.status(400).json({ errors: errors.array() });
    //     }
    //     const project = new Project({
    //         title, description, content, admin: req.admin.id
    //     })
    //     const savedProject = await project.save();
    //     res.json(savedProject);
    // } catch (error) {   
    //     console.error(error.message);
    //     res.status(500).send("Internal Server Error");
    // }

    let projects = await Project.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else { id = 1; }
    const project = new Project({
        id: id,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        image: req.body.image,
    });
    console.log(project);
    await project.save();
    console.log("Saved");
    res.json({
        success: true,
        title: req.body.title,

    })
})


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


// ROUTE 4: Delete an existing Project using: DELETE "/api/projects/deleteProject". login required
router.post('/deleteproject', async (req, res) => {

    try {
        await Product.findOneAndDelete({ id: req.body.id });
        console.log("Removed");
        res.json({ success: true, title: req.body.title })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router