import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Tooltip from "@mui/material/Tooltip";
import { Button } from "@mui/material";
import DeleteProject from "../components/deleteProject";
import UpdateProject from "../components/updateProject";
import User from "../components/user";
import { API_ROUTES } from "../services/api";
import fetchUtility from "../services/fetchUtility";
import { fetchCache, getToken, getLoggedInUser } from "../services/cacheSettings";

const columns = [
  { field: "projectName", headerName: "Project Name", width: 1000 },
  { field: "createdAt", headerName: "Created", width: 500 },
];

export default function Projects() {
  const [deletePopup, setDeletePopup] = useState(false);
  const [tableRows, setTableRows] = useState([]);
  const [rowsSelected, setRowsSelected] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [editName, setEditName] = useState(false);
  const navigate = useNavigate();

  const getProjects = () => {
    async function fetchData() {
      try {
        const userData = getLoggedInUser();
      const { data } = await fetchUtility(
        "get",
        `${API_ROUTES.PROJECTS.GETPROJECTS}/${userData.user._id}`
      );
      data.data.map((item, i) => {
        const formattedDate = new Date(item.createdAt)
          .toLocaleDateString("en-GB", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          })
          .replace(/ /g, "-");
        data.data[i].createdAt = formattedDate;
      });
      setTableRows(data.data);
      } catch (e) {
        toast.error('Something went wrong!');
      }
    }
    fetchData();
  };

  useEffect(() => {
      getProjects();
  }, []);

  useEffect(() => {
    const userData = fetchCache('loggedInUser');
    if (!userData) navigate("/login");
  }, []);

  const handleRowClick = (rowData) => {
    setRowsSelected(rowData);
    const selectedProjects = rowData
      .map((el) => tableRows.filter((item) => item._id === el))
      .map((name) => name[0].projectName);
    setProjectNames(selectedProjects);
  };

  const navigateProject = (rowData) => {
    const projectId = rowData.row._id;
    navigate(`/home/${projectId}`);
  };

  const addProject = async (newValue) => {
    try {
      const bearerToken = getToken();
      await fetchUtility(
        "post",
        API_ROUTES.PROJECTS.GETPROJECTS,
        { projectName: newValue },
        bearerToken
      ).then(() => getProjects());
      toast.success("New project added successfully!");
     } catch (error) {
      toast.error('Something went wrong');
     }
  };

  const saveProjectName = (newValue, updateFlag) => {
    setEditName(false);
    if (updateFlag) {
      addProject(newValue);
    }
  };

  const deleteProjects = async (value) => {
    if (!value) setDeletePopup(false);
    else {
      try {
        const filteredData = tableRows.filter(
          (item) => rowsSelected.indexOf(item._id) === -1
        );
        const bearerToken = getToken();
        await fetchUtility(
          "delete",
          API_ROUTES.PROJECTS.GETPROJECTS,
          { id: rowsSelected },
          bearerToken
        );
        setTableRows(filteredData);
        setDeletePopup(false);
        toast.success("Selected projects have been successfully deleted!");
      } catch (e) {
        toast.error("Something went wrong!");
      }
    }
  };

  const handleNavigation = (params) => {
    console.log(params);
    if (params.field === "projectName") navigateProject(params);
  };

  return (
    <div style={{ height: 690, width: "100%" }}>
      <User page="projects" />
      <h1 class="basis-1/2 bg-gray-200 hover:bg-gray-300 h-10 mb-10 text-xl font-bold">
        MY PROJECTS
      </h1>
      <Tooltip title="Add New Project">
        <div style={{ marginTop: "-1.6%", marginLeft: "-85vw" }}>
          <AddCircleOutlineIcon
            onClick={() => setEditName(true)}
            className="ml-2 mb-1 cursor-pointer"
          />
          <Button
            style={{ fontSize: "0.85vw" }}
            onClick={() => setEditName(true)}
            type="button"
          >
            New Project
          </Button>
        </div>
      </Tooltip>
      <DataGrid
        rows={tableRows}
        columns={columns}
        sx={{
          "& .MuiDataGrid-cell:hover": {
            cursor: "pointer",
            textDecoration: "underline",
            fontFamily: "serif",
          },
          ".MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
            fontFamily: "serif",
            fontSize: "1vw",
          },
        }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 12 },
          },
        }}
        pageSizeOptions={[15]}
        onRowSelectionModelChange={handleRowClick}
        getRowId={(row) => row._id}
        onCellClick={handleNavigation}
        checkboxSelection
      />
      <button
        disabled={rowsSelected.length < 1}
        onClick={() => setDeletePopup(true)}
        className="my-2 px-3 py-1 tracking-wide text-white transition-colors duration-200 transform bg-red-700 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
      >
        Delete Project
      </button>
      {deletePopup && (
        <DeleteProject
          modalOpen={deletePopup}
          projectName={projectNames}
          closePopup={deleteProjects}
        />
      )}
      {editName && (
        <UpdateProject modalOpen={editName} closePopup={saveProjectName} />
      )}
      <ToastContainer />
    </div>
  );
}
