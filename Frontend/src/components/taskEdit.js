import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl
} from "@mui/material";
import './form.css';

export default function EditTask({
  taskDetails,
  modalOpen,
  TaskId,
  closeTask,
  viewComments,
  deleteConfirmPopup,
}) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const [taskData, setTaskData] = useState({});
  const [status, setStatus] = useState('');
  const [popupOpen, setPopupOpen] = useState(modalOpen);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (TaskId !== 0) {
      const selectedTask = taskDetails.filter((item) => item._id === TaskId)[0];
      setTaskData(selectedTask);
      setStatus(selectedTask.status);
    } else {
      setTaskData({
        projectName: "",
        status: "New",
        description: "",
        label: "",
        effort: "",
        comments: [],
      });
      setStatus("New");
    }
  }, []);

  const handleClose = () => {
    setPopupOpen(false);
    closeTask("", false);
  };

  const processComment = (commentData) => {
    let comment = [];
    const createdDate = new Date()
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
      .replace(/ /g, "-");
    const newId = Math.random() * 100;
    comment.push(...commentData.comments, {
      id: newId,
      comment: newComment,
      created: createdDate,
    });
    commentData.comments = comment;

    return commentData;
  };

  const saveTask = () => {
    const saveData = { ...taskData };
    const processedData = newComment ? processComment(saveData) : saveData;
    setTaskData(processedData);
    closeTask(processedData, true);
  };

  const handleStatus = (event) => {
    setTaskData({ ...taskData, status: event.target.value });
    setStatus(event.target.value);
  };

  return (
    <div>
      <Modal
        open={popupOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography className="text-center" id="modal-modal-title" variant="h6" component="h2">
            Task Data
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <div className="flex flex-row">
              <TextField
                className="w-full"
                id="outlined-basic"
                label="Task Name"
                variant="outlined"
                value={taskData.taskName}
                onChange={(e) =>
                  setTaskData({ ...taskData, taskName: e.target.value })
                }
              />
              <TextField
                className="w-full marginGap"
                id="outlined-basic"
                label="Description"
                variant="outlined"
                value={taskData.description}
                onChange={(e) =>
                  setTaskData({ ...taskData, description: e.target.value })
                }
              />
            </div>
            <div className="flex flex-row mt-5">
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status-helper"
                value={status}
                label="Status"
                onChange={(e) => handleStatus(e)}
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
              </FormControl>
              <TextField
                className="w-full marginGap"
                id="outlined-basic"
                label="Label"
                variant="outlined"
                value={taskData.label}
                onChange={(e) =>
                  setTaskData({ ...taskData, label: e.target.value })
                }
              />
              <TextField
                className="w-full marginGap"
                id="outlined-basic"
                label="Effort"
                variant="outlined"
                value={taskData.effort}
                onChange={(e) =>
                  setTaskData({ ...taskData, effort: e.target.value })
                }
              />
            </div>
            <div className="flex flex-row mt-5">
            <TextField
              className="w-full"
              id="outlined-basic"
              label="Comments"
              variant="outlined"
              multiline
              rows={4}
              onChange={(e) => setNewComment(e.target.value)}
            />
            </div>
            {TaskId !== 0 &&
              taskData.comments &&
              taskData.comments.length > 0 && (
                <Button
                  style={{ marginTop: "2%", fontSize: "0.7vw" }}
                  onClick={() => viewComments(taskData.comments)}
                  type="button"
                >
                  View all comments
                </Button>
              )}
          </Typography>
          <Typography>
            <Button
              style={{ marginLeft: "5%", marginTop: "5%" }}
              onClick={handleClose}
              type="button"
            >
              Close
            </Button>
            {TaskId !== 0 && (
              <Button
                style={{ marginLeft: "25%", marginTop: "5%" }}
                onClick={() => deleteConfirmPopup(true)}
                type="button"
              >
                Delete
              </Button>
            )}
            <Button
              style={
                TaskId !== 0
                  ? { marginLeft: "25%", marginTop: "5%" }
                  : { marginLeft: "60%", marginTop: "5%" }
              }
              onClick={saveTask}
              type="button"
            >
              {TaskId === 0 ? "Add" : "Save"}
            </Button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
