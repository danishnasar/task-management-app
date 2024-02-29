const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projects");

router.route("/").post(protect, createProject).delete(protect, deleteProject);
router.route("/:id").get(getProjects).put(protect, updateProject);

module.exports = router;
