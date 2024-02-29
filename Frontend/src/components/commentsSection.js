import React, { useState } from "react";
import { Box, Button, Typography, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
    { field: "comment", headerName: "Comment", width: 650 },
    { field: "created", headerName: "Created", width: 100 },
];

export default function CommentsSection({ open, data, TaskId, closeSection }) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 900,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const [openPopup, setOpenPopup] = useState(open);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleClose = () => {
    closeSection(TaskId, "", false);
    setOpenPopup(false);
  }

  const deleteComments = () => {
    closeSection(TaskId, selectedRows, true);
    setOpenPopup(false);
  };

  const handleRowClick = (rowData) => {
    const selectedComments = rowData.map((el) => data.filter((item) => item.id === el)).map((name) => name[0].id);
    setSelectedRows(selectedComments);
  };

  return (
    <>
      <Modal
        open={openPopup}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <DataGrid
              rows={data}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[15]}
              onRowSelectionModelChange={handleRowClick}
              checkboxSelection
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
              disabled={selectedRows.length < 1}
              style={{ marginLeft: "50%", marginTop: "5%" }}
              onClick={deleteComments}
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
