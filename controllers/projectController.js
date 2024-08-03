const Project = require('../models/Project');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

const createProject = async (req, res, upload) => { // Add upload as a parameter
    try {
      const { title, description, content } = req.body;
      const image = req.file.path; // Assuming image is uploaded successfully
  
      const project = new Project({ title, description, content, image });
      await project.save();
  
      res.status(201).json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating project' });
    }
  };

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting project' });
  }
};

module.exports = { createProject, getProjects, deleteProject, upload };
