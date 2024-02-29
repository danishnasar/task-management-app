const Tasks = require("../models/tasks");
const asyncHandler = require("../middleware/async");

const TasksError = (msg, code, next) => {
  const error = { name: "LoginError" };
  (error.message = msg), (error.code = code);
  return next(error);
};

exports.getTasks = asyncHandler(async (req, res, next) => {
  const tasks = await Tasks.find({ project: req.params.id });
  if (!tasks) TasksError("No Tasks exist", 404, next);
  else res.status(200).json({ success: true, count: tasks.length, data: tasks });
});

exports.createTask = asyncHandler(async (req, res, next) => {
  const task = await Tasks.create(req.body);

  res.status(201).json({ success: true, data: task });
});

exports.updateTask = asyncHandler(async (req, res, next) => {
  const task = await Tasks.findById(req.params.id);
  if (!task) TasksError("Task does not exist", 400, next);
  else {
    const updatedTask = await Tasks.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
    res.status(200).json({ success: true, data: updatedTask });
  }
});

exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Tasks.findById(req.params.id);
  if (!task) TasksError("Task does not exist", 400, next);
  else {
    await Tasks.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: [] });
  }
});
