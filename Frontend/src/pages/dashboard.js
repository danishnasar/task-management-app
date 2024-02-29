import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Tooltip from "@mui/material/Tooltip";
import UpdateProject from "../components/updateProject";
import ProjectCard from "../components/card";
import EditTask from "../components/taskEdit";
import CommentsSection from "../components/commentsSection";
import ConfirmDelete from "../components/confirmDelete";
import User from "../components/user";
import fetchUtility from "../services/fetchUtility";
import { fetchCache, getLoggedInUser, getToken } from "../services/cacheSettings";
import { API_ROUTES } from "../services/api";

const statusMapping = [
  {
    status: "New",
    headingStyle: "basis-1/4 bg-sky-200",
    contentStyle: "basis-1/4 h-screen overflow-y-auto bg-sky-200",
  },
  {
    status: "Pending",
    headingStyle: "basis-1/4 bg-red-300",
    contentStyle: "basis-1/4 h-screen overflow-y-auto bg-red-300",
  },
  {
    status: "In Progress",
    headingStyle: "basis-1/4 bg-yellow-200",
    contentStyle: "basis-1/4 h-screen overflow-y-auto bg-yellow-200",
  },
  {
    status: "Completed",
    headingStyle: "basis-1/4 bg-green-200",
    contentStyle: "basis-1/4 h-screen overflow-y-auto bg-green-200",
  },
];

export default function Dashboard() {
  const [projectName, setProjectName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const [taskData, setTaskData] = useState([]);
  const [taskModal, setTaskModal] = useState(false);
  const [addTaskModal, setAddTaskModal] = useState(false);
  const [taskId, setTaskId] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentsData, setCommentsData] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getprojectId = () => {
    const pathParams = location.pathname.split("/");
    const projectId = pathParams[pathParams.length - 1];

    return projectId;
  };

  useEffect(() => {
    const userData = fetchCache('loggedInUser');
    if (!userData) navigate("/login");
  }, []);

  const loadTasks = async () => {
    const allTasks = await getTasks();
    if (allTasks) setTaskData(allTasks);
  };

  const saveProjectName = async (newValue, updateFlag) => {
    setProjectName(newValue);
    setModalOpen(false);
    const bearerToken = getToken();
    const pId = getprojectId();
    await fetchUtility(
      "put",
      `${API_ROUTES.PROJECTS.GETPROJECTS}/${pId}`,
      { projectName: newValue },
      bearerToken
    );
    if (updateFlag) toast.success("Project name updated successfully!");
  };

  const validate = (details) => {
    let valid = true;
    if (!details.taskName || !details.effort) valid = false;

    return valid;
  };

  const updateTask = async (newData) => {
    try {
      const bearerToken = getToken();
      await fetchUtility(
        "put",
        `${API_ROUTES.TASKS.GETTASKS}/${newData._id}`,
        newData,
        bearerToken
      ).then(() => loadTasks());
    } catch (e) {
      toast.error("Something went wrong!");
    }
  };

  const saveTask = (newValue, updateFlag) => {
    if (updateFlag) {
      const valid = validate(newValue);
      if (valid) {
        setTaskModal(false);
        updateTask(newValue);
        toast.success("Task details updated successfully!");
      } else {
        toast.error("Please provide a task name and effort hours");
      }
    } else setTaskModal(false);
  };

  const openConfirmation = (value) => {
    setDeleteConfirm(value);
  };

  const deleteTask = async (value, flag) => {
    setDeleteConfirm(false);
    if (flag) {
      try {
        const bearerToken = getToken();
        await fetchUtility(
          "delete",
          `${API_ROUTES.TASKS.GETTASKS}/${value}`,
          {},
          bearerToken
        ).then(() => {
          setTaskModal(false);
          toast.success("Task deleted successfully!");
          loadTasks();
        });
      } catch (e) {
        toast.error("Something went wrong!");
      }
    }
  };

  const saveNewTask = async (newTask) => {
    const bearerToken = getToken();
    const pId = getprojectId();
    newTask.project = pId;
    await fetchUtility(
      "post",
      `${API_ROUTES.TASKS.GETTASKS}`,
      newTask,
      bearerToken
    ).then(() => loadTasks());
  };

  const addTask = async (newValue, updateFlag) => {
    if (updateFlag) {
      const valid = validate(newValue);
      if (valid) {
        setAddTaskModal(false);
        await saveNewTask(newValue);
        toast.success("New task added successfully!");
      } else {
        toast.error("Please provide a task name and effort hours");
      }
    } else setAddTaskModal(false);
  };

  const EditTaskData = (id) => {
    setTaskModal(true);
    setTaskId(id);
  };

  const getProjects = async () => {
    try {
      const userData = getLoggedInUser();
      const { data } = await fetchUtility(
        "get",
        `${API_ROUTES.PROJECTS.GETPROJECTS}/${userData.user._id}`
      );

      return data.data;
    } catch (e) {
      toast.error("Something went wrong!");
    }
  };

  const getTasks = async () => {
    try {
      const projectId = getprojectId();
      const { data } = await fetchUtility(
        "get",
        `${API_ROUTES.TASKS.GETTASKS}/${projectId}`
      );
      return data.data;
    } catch (e) {
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    async function getProjectName() {
      const pId = getprojectId();
      const allProjects = await getProjects();
      const projectData = allProjects.filter((item) => item._id === pId);
      if (projectData.length === 0) navigate('/invalidRoute');
      else {
        const project = projectData[0].projectName;
        setProjectName(project);
      }
    }
    getProjectName();
  }, []);

  useEffect(() => {
    loadTasks();
  }, []);

  const viewComments = (comments) => {
    setShowComments(true);
    setCommentsData(comments);
  };

  const closeComments = (id, value, flag) => {
    setShowComments(false);
    if (flag) {
      const wholeData = [...taskData];
      const commentIndex = wholeData.findIndex((item) => item.id === id);
      const existingComment = wholeData[commentIndex].comments;
      const updatedComment = existingComment.filter(
        (item) => !value.includes(item.id)
      );
      wholeData[commentIndex].comments = updatedComment;
      setTaskData(wholeData);
      toast.success(`Selected comments have been deleted successfully!`);
      setShowComments(false);
    }
  };

  return (
    <div>
      <div style={{ height: "6vh" }} className="flex flex-row">
        <h2
          onClick={handleOpen}
          className="basis-3/4 bg-gray-200 hover:bg-gray-300 cursor-pointer"
        >
          Project Name: {projectName}
        </h2>
        <User page="dashboard" />
      </div>
      <div className="flex flex-row">
        {statusMapping.map((item) => (
          <div className={`${item.headingStyle}`}>
            <h3 className="mt-2">
              {item.status === "New" ? "Backlog" : item.status}
              {item.status === "New" ? (
                <Tooltip title="Add Task">
                  <AddCircleOutlineIcon
                    onClick={() => setAddTaskModal(true)}
                    className="ml-2 cursor-pointer"
                  />
                </Tooltip>
              ) : (
                ""
              )}
            </h3>
          </div>
        ))}
      </div>
      <div className="flex flex-row">
        {statusMapping.map((item) => (
          <div className={`${item.contentStyle}`}>
            {taskData.map(
              (element) =>
                element.status === item.status && (
                  <ProjectCard
                    id={element._id}
                    taskName={element.taskName}
                    label={element.label}
                    effort={element.effort}
                    comments={[...element.comments]}
                    itemClick={(_id) => EditTaskData(_id)}
                  />
                )
            )}
          </div>
        ))}
      </div>
      {modalOpen && (
        <UpdateProject
          taskDetails={taskData}
          modalOpen={modalOpen}
          projectName={projectName}
          closePopup={saveProjectName}
        />
      )}
      {taskModal && (
        <EditTask
          taskDetails={taskData}
          modalOpen={taskModal}
          TaskId={taskId}
          closeTask={saveTask}
          viewComments={viewComments}
          deleteConfirmPopup={openConfirmation}
        />
      )}
      {addTaskModal && (
        <EditTask
          modalOpen={addTaskModal}
          TaskId={0}
          closeTask={addTask}
          viewComments={viewComments}
        />
      )}
      {showComments && (
        <CommentsSection
          open={showComments}
          data={commentsData}
          TaskId={taskId}
          closeSection={closeComments}
        />
      )}
      {deleteConfirm && (
        <ConfirmDelete
          TaskId={taskId}
          openFlag={deleteConfirm}
          taskType={"task"}
          deleteItem={deleteTask}
        />
      )}
      <ToastContainer />
    </div>
  );
}
