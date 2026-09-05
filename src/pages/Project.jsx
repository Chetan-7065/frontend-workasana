import { Link } from "react-router-dom";
import useFetch from "../useFetch";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export function NewProjectsData() {
  const [displayLoading, setDisplayLoading] = useState(true);
  const [displayError, setDisplayError] = useState(null);
  const {
    data: projectData,
    loading: projectLoading,
    error: projectError,
    refetch: projectRefetch,
  } = useFetch("https://backend-workasana-ruby.vercel.app/project");

  const {
    data: taskData,
    loading: taskLoading,
    error: taskError,
  } = useFetch("https://backend-workasana-ruby.vercel.app/task");

  const projects = projectData && projectData.length > 0 ? projectData : [];
  const tasks = taskData && taskData.length > 0 ? taskData : [];
  const loading = taskLoading && projectLoading ? true : false;
  const error =
    taskError && projectError ? "Error while fetching the data" : null;
  const displayProjects = projects
    .map((project) => {
      const matchingTasks = tasks.filter(
        (task) => task.project === project.name,
      );
      return {
        ...project,
        totalTasks: matchingTasks.length > 0 ? matchingTasks : 0,
      };
    })
    .reverse();


  return { displayProjects, projectRefetch, loading, error };
}

export default function Project() {
  const { displayProjects, projectRefetch, loading, error } = NewProjectsData();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectFormData, setProjectFormData] = useState({
    name: "",
    description: "",
  });

  function handleProjectFormChange(e) {
    const { name, value } = e.target;
    setProjectFormData({ ...projectFormData, [name]: value });
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
      toast.success("New Project added successfully");
      setProjectFormData({
        name: "",
        description: "",
      });
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
  return (
    <div>
      <div className="container-fluid bg-white p-4 rounded shadow-sm">
        {/* Header Row */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark m-0">Projects</h2>
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => setIsProjectModalOpen(true)}
          >
            <i className="bi bi-plus-lg"></i> Add New Project
          </button>
        </div>

        {/*  Responsive Table  */}
        {loading ? (
          <div className="col text-center py-4 my-4">
            <div
              className="spinner-border text-primary mb-3"
              role="status"
            ></div>
            <p className="fs-4 text-secondary fw-semibold">
              Loading data, please wait...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-4 my-4">
            <i className="bi bi-exclamation-triangle text-danger display-4 d-block mb-3"></i>
            <p className="fs-3 text-danger fw-bold">
              Oops! Something went wrong.
            </p>
            <p className="text-muted fs-5">
              {error.message || "Please check the console."}
            </p>
          </div>
        ) : displayProjects && displayProjects.length > 0 ? (
          <div className="table-responsive">
            <div className="container-fluid border rounded overflow-hidden p-0">
              <div className="row bg-light fw-bold p-3 border-bottom d-none d-md-flex m-0">
                <div className="col-md-3">Name</div>
                <div className="col-md-7">Description</div>
                <div className="col-md-1">Total Tasks</div>
                <div className="col-md-1 text">Action</div>
              </div>
              {displayProjects.map((project) => {
                return (
                  <div
                    key={project._id}
                    className="row p-3 border-bottom align-items-center gy-2 m-0"
                  >
                    {/* <!-- Name --> */}
                    <div className="fw-semibold text-dark col-12 col-md-3 fw-bold fw-md-normal">
                      <span className="d-md-none text-muted small fw-normal d-block">
                        Project Name
                      </span>
                      <span className="fw-semibold text-dark fs-6">
                        {project.name}
                      </span>
                    </div>

                    {/* <!-- Description --> */}
                    <div className="text-muted  col-12 col-md-7 fw-bold fw-md-normal">
                      <span className="d-md-none text-muted small fw-normal d-block">
                        Description
                      </span>
                      <span className="small">{project.description}</span>
                    </div>

                    {/* <!-- Total Tasks --> */}
                    <div className=" col-6 col-md-1 fw-bold fw-md-normal text-md-center">
                      <span className="d-md-none text-muted small fw-normal d-block">
                        Tasks
                      </span>
                      <span className="badge bg-secondary-subtle text-secondary px-2.5 py-1.5 rounded-pill">
                        {project.totalTasks?.length || 0}
                      </span>
                    </div>

                    {/* <!-- Link Column with Horizontal Arrow --> */}
                    <div className="col-6 col-md-1 fw-bold fw-md-normal">
                      {/* For React Router Dom, replace href with:  */}
                      <Link
                        to={`/project/${project._id}`}
                        className="btn btn-link p-0 text-decoration-none"
                      >
                        View Project <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-5 my-5 border rounded bg-light">
            <p className="fs-3 text-muted fw-medium m-0">
              No data available at the moment.
            </p>
          </div>
        )}
      </div>
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
                  onClick={() => setIsProjectModalOpen(false)}
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
    </div>
  );
}
