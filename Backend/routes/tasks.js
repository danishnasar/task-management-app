const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/tasks");

router.route("/").post(protect, createTask);
router
  .route("/:id")
  .get(getTasks)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;
