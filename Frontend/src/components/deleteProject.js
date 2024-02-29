import React, { useState } from "react";
import { Box, Button, Typography, Modal } from "@mui/material";

export default function DeleteProject({ modalOpen, projectName, closePopup }) {
  const [popupOpen, setPopupOpen] = useState(modalOpen);
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
    closePopup(false);
  };

  const deleteProject = () => {
    setPopupOpen(false);
    closePopup(true);
  };

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
            Are you sure that the projects{" "}
            <span className="font-bold">{projectName.join(", ")}</span> need to
            be deleted.
          </Typography>
          <Typography>
            <Button
              onClick={handleClose}
              style={{ marginLeft: "5%", marginTop: "5%" }}
              type="button"
            >
              Close
            </Button>
            <Button
              onClick={deleteProject}
              style={{ marginLeft: "50%", marginTop: "5%" }}
              type="button"
            >
              Delete
            </Button>
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
