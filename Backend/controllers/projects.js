const Project = require("../models/projects");
const asyncHandler = require("../middleware/async");

const ProjectError = (msg, code, next) => {
  const error = { name: "LoginError" };
  (error.message = msg), (error.code = code);
  return next(error);
};

exports.getProjects = asyncHandler(async (req, res, next) => {
  const project = await Project.find({ user: req.params.id });
  if (!project) ProjectError("No Projects exist", 404, next);
  else res.status(200).json({ success: true, count: project.length, data: project });
});

exports.createProject = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const project = await Project.create(req.body);

  res.status(201).json({ success: true, data: project });
});

exports.updateProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) ProjectError("Project does not exist", 400, next);
  else {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
    res.status(200).json({ success: true, data: updatedProject });
  }
});

exports.deleteProject = asyncHandler(async (req, res, next) => {
    await Project.deleteMany({_id: { $in: req.body.id}});
    res.status(200).json({ success: true, data: [] });
});
