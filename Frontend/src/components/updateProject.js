import React, { useState } from "react";
import { Box, Button, Typography, Modal, TextField } from "@mui/material";

export default function UpdateProject({modalOpen, projectName="", closePopup}) {
  const [popupOpen, setPopupOpen] = useState(modalOpen);
  const [tempName, setTempName] = useState(projectName);
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

  const handleClose = () => {
    setPopupOpen(false);
    setTempName(projectName);
    closePopup(projectName, false);
  };

  const saveProject = () => {
    setPopupOpen(false);
    closePopup(tempName, true);
  }

  return (
    <>
      <Modal
        open={popupOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Please enter the project name
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              className="w-full"
              id="outlined-basic"
              label="Project Name"
              variant="outlined"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
            />
          </Typography>
          <Typography>
            <Button
              style={{ marginLeft: "5%", marginTop: "5%" }}
              onClick={handleClose}
              type="button"
            >
              Close
            </Button>
            <Button
              style={{ marginLeft: "50%", marginTop: "5%" }}
              onClick={saveProject}
              type="button"
            >
              Save
            </Button>
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
