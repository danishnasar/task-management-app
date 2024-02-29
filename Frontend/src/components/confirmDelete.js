import React, { useState } from "react";
import { Box, Button, Typography, Modal } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ConfirmDelete({
  TaskId,
  openFlag,
  taskType,
  deleteItem,
}) {
  const [confirmOpen, setConfirmOpen] = useState(openFlag);

  const handleClose = (deleteFlag) => {
    setConfirmOpen(false);
    if (deleteFlag) deleteItem(TaskId, true);
    else deleteItem(0, false);
  };
  return (
    <div>
      <Modal
        open={confirmOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure that you want to delete the {taskType}
          </Typography>
          <Typography>
            <Button
              style={{ marginLeft: "5%", marginTop: "5%" }}
              onClick={() => handleClose(false)}
              type="button"
            >
              Close
            </Button>
            <Button
              style={{ marginLeft: "50%", marginTop: "5%" }}
              onClick={() => handleClose(true)}
              type="button"
            >
              Delete
            </Button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
