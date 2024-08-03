const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const upload = require('../controllers/projectController').upload;

router.post('/projects', upload.single('image'), projectController.createProject);
router.get('/projects', projectController.getProjects);
router.delete('/projects/:id', projectController.deleteProject);

module.exports = router;
