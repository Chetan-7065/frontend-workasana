import {  useRef, useState } from "react";
import useFetch from "../useFetch";
import axios from "axios";
import { toast } from "react-toastify";

export default function Home() {
  // ---- All Fetches ----/
  const {
    loading: taskLoading,
    data: taskData,
    error: taskError,
    refetch: taskRefetch,
  } = useFetch("https://backend-workasana-ruby.vercel.app/task");
  const {
    loading: projectLoading,
    data: projectData,
    error: projectError,
    refetch: projectRefetch,
  } = useFetch("https://backend-workasana-ruby.vercel.app/project");

  const {
    // loading: teamLoading,
    data: teamData,
    // error: teamError,
  } = useFetch("https://backend-workasana-ruby.vercel.app/team");

  const {
    // loading: usersLoading,
    data: usersData,
    // error: usersError,
  } = useFetch("https://backend-workasana-ruby.vercel.app/owners");

  //---- State Management ----/
  const tasks =
    taskData && taskData.length > 0 ? taskData.slice(-3).reverse() : [];
  const projects =
    projectData && projectData.length > 0
      ? projectData.slice(-3).reverse()
      : [];
  const teams = teamData && teamData.length > 0 ? teamData : [];
  const users = usersData && usersData.length > 0 ? usersData : [];
  const [searchQuery, setSearchQuery] = useState("");
  // const [projectFilter, setProjectFilter] = useState("all");
  const [taskFilter, setTaskFilter] = useState("all");
  const taskModalRef = useRef(null);

  const [projectFormData, setProjectFormData] = useState({
    name: "",
    description: "",
  });

  const [taskFormData, setTaskFormData] = useState({
    name: "",
    project: "",
    team: "",
    owners: [],
    tags: [],
    dueDate: "",
    timeToComplete: 1,
    status: "",
  });

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const statuses = ["To Do", "In Progress", "Completed", "Blocked"];

  // --- FILTERING LOGIC ---
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(task.project).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      taskFilter === "all" ||
      task.status.toLowerCase() === taskFilter.toLowerCase();
    return matchesFilter && matchesSearch;
  });

  function handleProjectFormChange(e) {
    const { name, value } = e.target;
    setProjectFormData({ ...projectFormData, [name]: value });
  }

  function handleTaskFormChange(e) {
    const { name, value } = e.target;

    setTaskFormData({ ...taskFormData, [name]: value });
  }

  function handleMultiSelect(e, field) {
    const options = [...e.target.selectedOptions].map((opt) => opt.value);
    setTaskFormData({ ...taskFormData, [field]: options });
  }

  async function handleProjectSubmit(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://backend-workasana-ruby.vercel.app/project",
        projectFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log("Success: ", response.data);

      setIsProjectModalOpen(false);

      toast.success("New project added successfully");
      projectRefetch();
    } catch (error) {
      toast.error("Please check the console");
      console.dir(error);
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
      } else if (error.request) {
        console.log("Network error: Is the backend running?");
      } else {
        console.log("Setup error: ", error.message);
      }
    }
  }

  async function handleTaskSubmit(e) {
    e.preventDefault();

    const tagsArray = taskFormData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    const finalPayload = {
      ...taskFormData,
      tags: tagsArray,
      timeToComplete: Number(taskFormData.timeToComplete),
    };
    console.log(finalPayload);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://backend-workasana-ruby.vercel.app/task",
        finalPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log("Success: ", response.data);
      setIsTaskModalOpen(false);

      toast.success("New Task added successfully");
      taskRefetch();
    } catch (error) {
      toast.error("Please check the console");
      console.dir(error);
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
      } else if (error.request) {
        console.log("Network error: Is the backend running?");
      } else {
        console.log("Setup error: ", error.message);
      }
    }
  }

  return (
    <div className="container-fluid py-4">
      {/* --- SEARCH BAR SECTION --- */}
      <div className="row mb-5">
        <div className="col-12 col-md-6 mx-auto">
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white border-end-0 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search projects or tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* --- PROJECTS SECTION --- */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          {/* Heading + Filter on Left */}
          <div className="d-flex align-items-center gap-3">
            <h2 className="h4 fw-bold text-dark m-0">Projects</h2>
          </div>

          {/* Action Button on Right */}
          <button
            className="btn text-white d-flex align-items-center gap-2"
            style={{ backgroundColor: "#366EF4" }}
            onClick={() => setIsProjectModalOpen(true)}
          >
            <i className="bi bi-plus-lg"></i> New Project
          </button>
        </div>

        {/* Project Grid */}
        {projectLoading ? (
          <div className="col text-center py-4 my-4">
            <div
              className="spinner-border text-primary mb-3"
              role="status"
            ></div>
            <p className="fs-4 text-secondary fw-semibold">
              Loading data, please wait...
            </p>
          </div>
        ) : projectError ? (
          <div className="text-center py-4 my-4">
            <i className="bi bi-exclamation-triangle text-danger display-4 d-block mb-3"></i>
            <p className="fs-3 text-danger fw-bold">
              Oops! Something went wrong.
            </p>
            <p className="text-muted fs-5">
              {projectError.message || "Please check the console."}
            </p>
          </div>
        ) : filteredProjects && filteredProjects.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-3 g-4">
            { filteredProjects.map((project) => {
              return (
                <div className="col" key={project._id}>
                  <div
                    className="card h-100 shadow-sm border-0 border-top border-4"
                    style={{ borderColor: "#366EF4" }}
                  >
                    <div className="card-body pb-5">
                      <h5 className="card-title fw-bold text-dark">
                        {project.name}
                      </h5>
                      <p className="card-text text-muted small fs-6  d-block">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-5 my-5 border rounded bg-light">
            <p className="fs-3 text-muted fw-medium m-0">
              No data available at the moment.
            </p>
          </div>
        )}
      </section>

      <hr className="my-5 opacity-25" />

      {/* --- MY TASKS SECTION --- */}
      <section className="mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          {/* Heading + Filter on Left */}
          <div className="d-flex align-items-center gap-3">
            <h2 className="h4 fw-bold text-dark m-0">My Tasks</h2>
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle btn-sm text-capitalize"
                type="button"
                data-bs-toggle="dropdown"
              >
                Filter: {taskFilter === "all" ? "All" : taskFilter}
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => setTaskFilter("all")}
                  >
                    All
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => setTaskFilter("In Progress")}
                  >
                    In Progress
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => setTaskFilter("Completed")}
                  >
                    Completed
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Button on Right */}
          <button
            className="btn text-white d-flex align-items-center gap-2"
            style={{ backgroundColor: "#366EF4" }}
            data-bs-toggle="modal"
            data-bs-target="#taskModal"
          >
            <i className="bi bi-plus-lg"></i> New Task
          </button>
        </div>

        {/* Task Grid */}
        
          { taskLoading ? (
          <div className="col text-center py-4 my-4">
            <div
              className="spinner-border text-primary mb-3"
              role="status"
            ></div>
            <p className="fs-4 text-secondary fw-semibold">
              Loading data, please wait...
            </p>
          </div>
        ) : taskError ? (
          <div className="text-center py-4 my-4">
            <i className="bi bi-exclamation-triangle text-danger display-4 d-block mb-3"></i>
            <p className="fs-3 text-danger fw-bold">
              Oops! Something went wrong.
            </p>
            <p className="text-muted fs-5">
              {taskError.message || "Failed to fetch resource."}
            </p>
          </div>
        ) : filteredTasks && filteredTasks.length > 0 ? 
         (
         <div className="row row-cols-1 row-cols-md-3 g-4"> 
         {
            filteredTasks.map((task) => {
              const getStatusStyles = (status) => {
                switch (status) {
                  case "Completed":
                    return { bg: "bg-success-subtle", text: "text-success" };
                  case "In Progress":
                    return { bg: "bg-primary-subtle", text: "text-primary" };
                  case "Blocked":
                    return { bg: "bg-danger-subtle", text: "text-danger" };
                  default:
                    return {
                      bg: "bg-secondary-subtle",
                      text: "text-secondary",
                    };
                }
              };

              const statusStyle = getStatusStyles(task.status);

              return (
                <div className="col" key={task._id}>
                  <div
                    className="card h-100 shadow-sm border-0 bg-white p-3"
                    style={{ borderRadius: "12px" }}
                  >
                    <div className="card-body d-flex flex-column p-2">
                      {/* Top Row: Status Badge & Days Left */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span
                          className={`badge rounded-pill ${statusStyle.bg} ${statusStyle.text} px-3.5 py-2.5 fw-semibold large`}
                        >
                          ● {task.status}
                        </span>
                        <span className="text-muted small fw-medium">
                          <i className="bi bi-clock me-1"></i>{" "}
                          {task.timeToComplete}{" "}
                          {task.timeToComplete === 1 ? "day" : "days"} left
                        </span>
                      </div>

                      {/* Task Heading */}
                      <h5 className="card-title fw-bold text-dark mb-1 fs-5 lh-sm">
                        {task.name}
                      </h5>

                      {/* Sub-Project Link Reference */}
                      <p
                        className="text-purple small mb-0 fw-medium"
                        style={{ color: "#6B21A8", fontSize: "0.8rem" }}
                      >
                        <i className="bi bi-folder-symlink me-1"></i>{" "}
                        {task.project}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          ) : (
          <div className="text-center py-5 my-5 border rounded bg-light">
            <p className="fs-3 text-muted fw-medium m-0">
              No data available at the moment.
            </p>
          </div>
        ) }
      </section>

      {/*
          MODALS SECTION (Centered layout structures)
           */}

      {/* 1. PROJECT MODAL */}
      <div
        className={`modal fade ${isProjectModalOpen ? "show d-block" : ""}`}
        id="projectModal"
        tabIndex="-1"
        aria-labelledby="projectModalLabel"
        aria-hidden="true"
        style={{
          display: isProjectModalOpen ? "block" : "none",
          backgroundColor: isProjectModalOpen
            ? "rgba(0, 0, 0, 0.5)"
            : "transparent",
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="projectModalLabel">
                Create New Project
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setIsProjectModalOpen(false)}
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleProjectSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={projectFormData.name}
                    onChange={handleProjectFormChange}
                    className="form-control"
                    placeholder="Enter project name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="description"
                    value={projectFormData.description}
                    onChange={handleProjectFormChange}
                    placeholder="Enter project details"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn text-white"
                  style={{ backgroundColor: "#366EF4" }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {isProjectModalOpen && <div className="modal-backdrop fade show"></div>}

      {/* 2. TASK MODAL */}
      <div
        className={`modal fade ${isTaskModalOpen ? "show d-block" : ""}`}
        id="taskModal"
        ref={taskModalRef}
        tabIndex="-1"
        aria-labelledby="taskModalLabel"
        aria-hidden="true"
        style={{
          display: isProjectModalOpen ? "block" : "none",
          backgroundColor: isProjectModalOpen
            ? "rgba(0, 0, 0, 0.5)"
            : "transparent",
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="taskModalLabel">
                Add New Task
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleTaskSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={taskFormData.name}
                    onChange={handleTaskFormChange}
                    className="form-control"
                    placeholder="Enter task title"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Project</label>
                  <select
                    className="form-select"
                    name="project"
                    value={taskFormData.project}
                    onChange={handleTaskFormChange}
                    required
                  >
                    <option value="">Select associated project</option>
                    {projectData &&
                      projectData.length > 0 &&
                      projectData.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Team</label>
                  <select
                    className="form-select"
                    name="team"
                    value={taskFormData.team}
                    onChange={handleTaskFormChange}
                    required
                  >
                    <option value="">Select dynamic team unit</option>
                    {teams.map((t, idx) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Owners (Ctrl+Click to select multiple)
                  </label>
                  <select
                    multiple
                    className="form-select"
                    name="owners"
                    value={taskFormData.owners}
                    onChange={(e) => handleMultiSelect(e, "owners")}
                    required
                  >
                    {users.map((user, idx) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Tags (separated by commas)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="tags"
                    value={taskFormData.tags}
                    onChange={handleTaskFormChange}
                    placeholder="e.g. Bug, Frontend, Feature"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dueDate"
                    value={taskFormData.dueDate}
                    onChange={handleTaskFormChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Time to Complete (Days)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="timeToComplete"
                    value={taskFormData.timeToComplete}
                    onChange={handleTaskFormChange}
                    min="1"
                    placeholder="e.g. 5"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={taskFormData.status}
                    onChange={handleTaskFormChange}
                    required
                  >
                    {statuses.map((s, idx) => (
                      <option key={idx} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn text-white"
                  style={{ backgroundColor: "#366EF4" }}
                  onClick={() => setIsTaskModalOpen(false)}
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
