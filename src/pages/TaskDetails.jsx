import { useParams } from "react-router-dom";
import useFetch from "../useFetch";
import axios from "axios";
import { toast } from "react-toastify";

export default function TaskDetails() {
  const { taskId } = useParams();
  const { data, loading, error, refetch } = useFetch(
    "https://backend-workasana-ruby.vercel.app/task",
  );
  
  const task = data && data.length > 0 ? data.find((task) => task._id == taskId) : {};

  async function handleCompleteBtn() {
    try {
      const token = localStorage.getItem("token");
      const payLoad =  {status: "Completed"}
      console.log(payLoad)
      const response = await axios.patch(
        `https://backend-workasana-ruby.vercel.app/task/${taskId}`,
        payLoad,
        {
          headers: {
            Authorization: `Bearers ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
       console.log("Task updated successfully :", response.data);
       toast.success("Task updated successfully")
       refetch()
    } catch (error) {
      toast.error("Please check the console");
      console.dir(error);
      if (error.response) {
        console.log("Stauts: ", error.response.status);
        console.log("Data: ", error.response.data);
      } else if (error.request) {
        console.log("Network error: Is the backend running?");
      } else {
        console.log("Error: ", error.message);
      }
    }
  }
  return (
    <>
      <div className="ms-3">
        <h1 className="mb-4">Task Details</h1>
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
        ) : data && data.length > 0 && task ? (
              <div key={task._id} className="card-body p-4">
                <div className="d-flex align-items-center mb-4 border-bottom pb-3">
                  <span
                    className="label-width text-dark fw-semibold "
                    style={{
                      minWidth: "120px",
                      display: "inline-block",
                    }}
                  >
                    <i className="bi bi-card-text me-2"></i>Task Name:
                  </span>
                  <span className="text-dark fw-bold">{task.name}</span>
                </div>

                <div className="d-flex align-items-center mb-4 border-bottom pb-3">
                  <span
                    className="label-width text-dark fw-semibold"
                    style={{
                      minWidth: "90px",
                      display: "inline-block",
                    }}
                  >
                    <i className="bi bi-collection me-2"></i>Project:
                  </span>
                  <span className="text-dark fw-bold">{task.project}</span>
                </div>

                <div className="d-flex align-items-center mb-4 border-bottom pb-3">
                  <span
                    className="label-width text-dark fw-semibold"
                    style={{
                      minWidth: "80px",
                      display: "inline-block",
                    }}
                  >
                    <i className="bi bi-person-hearts me-2"></i>Team:
                  </span>
                  <span className="text-dark fw-bold">{task.team}</span>
                </div>

                <div className="d-flex align-items-center mb-4 border-bottom pb-3">
                  <span
                    className="label-width text-dark fw-semibold"
                    style={{
                      minWidth: "90px",
                      display: "inline-block",
                    }}
                  >
                    <i className="bi bi-person-badge me-2"></i>Owners:
                  </span>
                  <span className="text-dark fw-bold">
                    {task.owners.join(", ")}
                  </span>
                </div>

                <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center mb-4 border-bottom pb-3">
                  <span
                    className="label-width text-dark fw-semibold mb-2 mb-sm-0"
                    style={{
                      minWidth: "120px",
                      display: "inline-block",
                    }}
                  >
                    <i className="bi bi-activity me-2 text-primary"></i>
                    Lead Status:
                  </span>

                  <span className="badge bg-primary px-3 py-2 text-wrap text-start">
                    {task.status}
                  </span>
                </div>

                <div className="d-flex align-items-center mb-4 border-bottom pb-3">
                  <span
                    className="label-width text-dark fw-semibold"
                    style={{
                      minWidth: "70px",
                      display: "inline-block",
                    }}
                  >
                    <i className="bi bi-tags me-2"></i>
                    Tags:
                  </span>
                  <span className="text-danger fw-bold">
                    {task.tags.join(", ")}
                  </span>
                </div>

                <div className="d-flex align-items-center mb-1">
                  <span
                    className="label-width text-dark fw-semibold"
                    style={{
                      minWidth: "130px",
                      display: "inline-block",
                    }}
                  >
                    <i className="bi bi-calendar-check me-2"></i>Time to Close:
                  </span>
                  <span className="text-dark fw-bold">
                    {task.timeToComplete} Days
                  </span>
                </div>
                <div className="mt-5">
                  <button className="btn btn-success fs-6 fs-md-5 py-1 px-2 py-md-2 px-md-4"
                  onClick={handleCompleteBtn} 
                  >
                    Mark as Complete
                  </button>
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
    </>
  );
}
