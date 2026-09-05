import { useState } from "react";
import useFetch from "../useFetch";
import { useParams } from "react-router-dom";
import { NewProjectsData } from "./Project";
import { Link } from "react-router-dom";
import { getAvatarBgColor } from "./Team";
import axios from "axios";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const { displayProjects: projects, loading, error } = NewProjectsData();
  
  const project =
    projects && projects.length > 0
      ? projects.find((project) => project._id === projectId)
      : {};

  const statusColors = [
    {
      status: "Completed",
      color: "#198754",
    },
    {
      status: "In Progress",
      color: "#fd7e14",
    },
    {
      status: "To Do",
      color: "#ff2b2b",
    },
    {
      status: "Blocked",
      color: "#0d6efd",
    },
  ];

  return (
    <div className="py-3">
      {loading ? (
        <div className="text-center py-4 my-4">
          <div className="spinner-border text-primary mb-3" role="status"></div>
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
      ) : project ? (
        <main className="container-fluid bg-white p-4 rounded  max-width-md">
          <header
            style={{
              borderBottom:
                project.totalTasks && project.totalTasks.length > 0
                  ? "1px solid #e2e8f0"
                  : "none",
            }}
            className="mb-4 pb-3"
          >
            <h1 className="display-5  text-dark d-flex align-items-center gap-2">
              {project.name}
            </h1>
            <p className="text-muted lead mb-0">{project.description}</p>
          </header>
          {
            <div
              style={{
                display:
                  project.totalTasks && project.totalTasks.length > 0
                    ? "block"
                    : "none",
              }}
              className="pb-3"
            >
              <h2 className="fw-bold text-dark">Tasks</h2>
            </div>
          }
          {
            <div
              style={{
                display:
                  project.totalTasks && project.totalTasks.length > 0
                    ? "block"
                    : "none",
              }}
              className="table-responsive"
            >
              <div className="container-fluid border rounded overflow-hidden p-0">
                <div className="row bg-light fw-bold p-3 border-bottom d-none d-md-flex m-0">
                  <div className="py-3 col-md-2">Name</div>
                  <div className="py-3 col-md-2">Owners</div>
                  <div className="py-3 col-md-2">Team</div>
                  <div className="py-3 col-md-2">Status</div>
                  <div className="py-3 col-md-2">Due on</div>
                  <div className="py-3 col-md-2">Action</div>
                </div>
                {project.totalTasks &&
                  project.totalTasks.length > 0 &&
                  project.totalTasks.map((task) => {
                    const hasMembers = task.owners && task.owners.length > 0;
                    const totalMembers = task.owners?.length || 0;
                    const memberName =
                      hasMembers && totalMembers < 3
                        ? task.owners.slice(-1).join(" ")
                        : "";
                    // const hasMoreThanOneMember = totalMembers < 2;
                    const showStackedBadge = totalMembers > 3;
                    const visibleLimit = showStackedBadge ? 2 : totalMembers;
                    const visibleMembers = task.owners
                      ? task.owners.slice(0, visibleLimit)
                      : [];
                    const remainingCount = totalMembers - visibleLimit;
                    const dateObj = new Date(task.dueDate);
                    const statusBgColor = statusColors.find(
                      (status) => status.status === task.status,
                    );
                   

                    // 2. Format using options
                    const formattedDate = dateObj.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });
                    return (
                      <div
                        key={task._id}
                        className="row p-3 border-bottom align-items-center gy-2 m-0"
                      >
                        {/* <!-- Name --> */}
                        <div
                          className="fw-semibold text-dark col-12 col-md-2 "
                          // style={{ maxWidth: "200px" }}
                        >
                          <span className="d-md-none text-muted small fw-normal d-block">
                            Task Name
                          </span>
                          <span className="fw-semibold text-dark fs-6">
                            {task.name}
                          </span>
                        </div>

                        {/* <!-- Description --> */}
                        <div
                          className="text-muted col-12 col-md-2"
                          // style={{ maxWidth: "300px" }}
                        >
                           <span className="d-md-none text-muted small fw-normal d-block">
                                  Owners 
                          </span>
                          {hasMembers ? (
                            <div className="d-flex align-items-center flex-wrap gap-2">
                              {/* Horizontal Avatars Container */}
                               
                              <div
                                className="d-flex align-items-center position-relative"
                                style={{ height: "36px" }}
                              >
                              
                                {visibleMembers.map((member, memberIdx) => {
                                  const firstLetter = member
                                    .charAt(0)
                                    .toUpperCase();
                                  const bgColor = getAvatarBgColor(member);

                                  return (
                                    <div
                                      key={memberIdx}
                                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm border border-2 border-white"
                                      style={{
                                        width: "36px",
                                        height: "36px",
                                        backgroundColor: bgColor,
                                        flexShrink: 0,
                                        marginLeft:
                                          memberIdx === 0 ? "0px" : "-12px",
                                        zIndex: memberIdx + 1,
                                        fontSize: "0.85rem",
                                      }}
                                      title={member}
                                    >
                                      {firstLetter}
                                    </div>
                                  );
                                })}

                                {showStackedBadge && (
                                  <div
                                    className="rounded-circle d-flex align-items-center justify-content-center bg-secondary text-white fw-bold shadow-sm border border-2 border-white"
                                    style={{
                                      width: "36px",
                                      height: "36px",
                                      marginLeft: "-12px",
                                      zIndex: 10,
                                      flexShrink: 0,
                                      fontSize: "0.75rem",
                                      backgroundColor: "#6c757d",
                                    }}
                                  >
                                    +{remainingCount}
                                  </div>
                                )}
                              </div>

                              {/* Explicit helper text sitting right next to the overlapping avatars */}
                              {totalMembers < 3 ? (
                                <span>
                                  <span className=" text-dark small  ms-1">
                                    {memberName}
                                  </span>
                                </span>
                              ) : (
                                showStackedBadge && (
                                  <span className="text-muted small fst-italic ms-1">
                                    {remainingCount} more owners...
                                  </span>
                                )
                              )}
                            </div>
                          ) : (
                            <span className="text-muted fst-italic small">
                              No owners assigned
                            </span>
                          )}
                        </div>
                        {/* <!-- Total Tasks --> */}
                        <div className="ps-2 col-12 col-md-2 ">
                          <span className="d-md-none text-muted small fw-normal d-block">
                            Task Name
                          </span>
                          <span className="fw-semibold text-dark fs-6">
                            {task.team}
                          </span>
                        </div>
                        {/* <!-- Total Tasks --> */}
                        <div className="ps-2 col-12 col-md-2 ">
                          <span className="d-md-none text-muted small fw-normal d-block">
                            Task status
                          </span>
                          <span
                            className="badge ps-3 text-light py-1.5 rounded-pill fs-6 "
                            style={{
                              backgroundColor: `${statusBgColor.color}`,
                            }}
                          >
                            {task.status}
                          </span>
                        </div>
                        {/* <!-- Total Tasks --> */}
                        <div className="ps-2 col-12 col-md-2">
                          <span className="d-md-none text-muted small fw-normal d-block">
                            Due on
                          </span>
                          <span className="text-bold">{formattedDate}</span>
                        </div>

                        {/* <!-- Link Column with Horizontal Arrow --> */}
                        <div className="text ps-2 col-12 col-md-2">
                          {/* For React Router Dom, replace href with:  */}
                          <Link
                            to={`/task/${task._id}`}
                            className="btn btn-link p-0 text-decoration-none"
                          >
                            View Task <i className="bi bi-arrow-right"></i>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          }
        </main>
      ) : (
        <div className="text-center py-5 my-5 border rounded bg-light">
          <p className="fs-3 text-muted fw-medium m-0">
            No data available at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
