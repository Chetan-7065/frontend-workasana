import axios from "axios";
import useFetch from "../useFetch";
import { Parser } from "@json2csv/plainjs";
import { toast } from "react-toastify";

export default function Setting() {
  const { data, loading, error, refetch } = useFetch(
    "https://backend-workasana-ruby.vercel.app/task",
  );
  const tasks = data && data.length > 0 ? data : [];
  async function handleDeleteBtn(taskId) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `https://backend-workasana-ruby.vercel.app/task/${taskId}`,
        {
          headers: {
            Authorization: `Bearers ${token}`,
          },
        },
      );
      console.log("Deleted Successfully : ", response.data);
      toast.success("Task deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Please check the console");
      console.error(error);
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

  function handleDownloadCSV() {
    const jsonData = tasks && tasks.length > 0 ? tasks : [];
    const fileName = "export.csv";
    const parser = new Parser();
    const csvContent = parser.parse(jsonData);

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <>
      <div className="container-fluid">
        <div
          className=" p-4 my-3 bg-white shadow-sm rounded-4"
          style={{ maxWidth: "850px" }}
        >
          {/* Main Heading */}
          <h1 className="h3 fw-bold mb-4 text-dark">Setting</h1>

          {/* First Section: Delete a task */}
          <section className="mb-5">
            <h2 className="h5 fw-semibold mb-2 text-secondary">
              Delete a task
            </h2>

            <div
              className="alert alert-danger d-flex align-items-center py-2 px-3 fs-6"
              role="alert"
            >
              <i className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"></i>
              <div>
                Warning: Once a task is deleted, it will be completely and
                permanently removed.
              </div>
            </div>
            {loading ? (
              <div className="text-center py-4 my-4">
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
                  {error.message || "Failed to fetch resource."}
                </p>
              </div>
            ) : tasks && tasks.length > 0 ? (
              <div
                className="table-responsive "
                style={{ maxHeight: "260px", overflowY: "auto" }}
              >
                <div className="container-fluid border rounded overflow-hidden p-0">
                  <div className="row bg-light fw-bold p-3 border-bottom d-none d-md-flex m-0">
                    <div className="col-12 col-md-4 ">Name</div>
                    <div className="col-12 col-md-5 ">Project</div>
                    <div className="col-12 col-md-3">Action</div>
                  </div>
                  <tbody>
                    {tasks &&
                      tasks.length > 0 &&
                      tasks.map((task) => {
                        return (
                          <div className="row px-3 border-bottom m-0">
                            <div className="py-2 px-2 py-md-3 px-md-3 col-12 col-md-4">
                              <span className="d-md-none text-muted small fw-normal d-block">
                                Name
                              </span>
                              <span className="fw-semibold text-dark fs-6">
                                {task.name}
                              </span>
                            </div>
                            <div className="py-2 px-2 py-md-3 px-md-3 col-12 col-md-5">
                              <span className="d-md-none text-muted small fw-normal d-block">
                                Project
                              </span>
                              <span className="fw-semibold text-dark fs-6">
                                {task.project === null
                                  ? "Project not assigned"
                                  : task.project}
                              </span>
                            </div>
                            <div className="py-3 px-2 py-md-3 px-md-3 col-12 col-md-3">
                              <span className="fw-semibold text-dark fs-6">
                              <button
                                className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1 mx-0 mx-md-2"
                                onClick={() => handleDeleteBtn(task._id)}
                              >
                                <i className="bi bi-trash"></i> Delete
                              </button>
                               </span>
                            </div>
                          </div>
                        );
                      })}
                  </tbody>
                </div>
              </div>
            ) : (
              <div className="text-center py-5 my-5 border rounded bg-light">
                <p className="fs-3 text-muted fw-medium m-0">
                  No data available at the moment.
                </p>
              </div>
            )}
          </section>
          <hr className="text-muted my-4" />

          {/* Second Section: Imports */}
          <section className="mb-3">
            <h2 className="h5 fw-bold mb-3 text-secondary">Imports</h2>

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 bg-light p-3 rounded-3">
              <p className="mb-0 text-muted fs-6">
                Download and export your tasks securely in CSV file format for
                offline backups or migration.
              </p>
              <button
                className="btn btn-primary btn-sm px-4 py-2 d-inline-flex align-items-center justify-content-center gap-2 text-nowrap"
                onClick={handleDownloadCSV}
              >
                <i className="bi bi-download"></i> Import CSV
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
