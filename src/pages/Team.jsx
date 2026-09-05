import { useState } from "react";
import useFetch from "../useFetch";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export function getAvatarBgColor(name) {
  const colors = [
    "#0d6efd", // Bright Blue
    "#6610f2", // Vibrant Indigo
    "#6f42c1", // Purple
    "#d63384", // Pink / Magenta
    "#dc3545", // Red / Coral
    "#fd7e14", // Bright Orange
    "#198754", // Emerald Green
    "#20c997", // Teal
    "#0dcaf0", // Cyan / Sky Blue
    "#e83e8c", // Hot Pink
    "#28a745", // Lime Green
  ];
  const charCode = name.charCodeAt(0);
  return colors[charCode % colors.length];
}

export default function Team() {
  const [teamName, setTeamName] = useState("");
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [showModal , setShowModal] = useState(false)
  const [teamFormData, setTeamFormData] = useState({
    name: "",
    description: "",
    members: [],
  });
  const {
    data: teamData,
    loading: teamLoading,
    error: teamError,
    refetch: teamRefetch
  } = useFetch("https://backend-workasana-ruby.vercel.app/team");
  const {
    data: ownersData,
    loading: ownersLoading,
    error: ownersError,
  } = useFetch("https://backend-workasana-ruby.vercel.app/owners");
  const teams = teamData && teamData.length > 0 ? teamData : [];
  const owners = ownersData && ownersData.length > 0 ? ownersData : [];


  function handleChange(e){
    const {name, value} = e.target
    setTeamFormData({...teamFormData, [name]: value})
  }

  function handleMultiSelect(e, field) {
    const options = [...e.target.selectedOptions].map((opt) => opt.value);
    setTeamFormData({ ...teamFormData, [field]: options });
  }


  async function handleSubmit(e){
    e.preventDefault();
    console.log({ teamName, selectedOwners });
    try{
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://backend-workasana-ruby.vercel.app/team`,
        teamFormData,
        {
          headers: {
            Authorization: `Bearers ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log("Add members Successfully :", response.data);
       toast.success("New Member added successfully")
      setShowModal(false);
      teamRefetch();
    } catch (error) {
      toast.error("Please check the console")
      console.dir(error)
      if (error.response) {
        console.log("Stauts: ", error.response.status);
        console.log("Data: ", error.response.data);
      } else if (error.request) {
        console.log("Network error: Is the backend running?");
      } else {
        console.log("Error: ", error.message);
      }
    }
  };
  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2">
        <h2 className="fw-bold text-dark m-0">Teams</h2>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          data-bs-toggle="modal"
          data-bs-target="#addTeamModal"
        >
          <span className="fw-bold">+</span> Add Team
        </button>
      </div>

      {/* Grid Layout */}
     {teamLoading ? (
          <div className="text-center py-4 my-4">
            <div
              className="spinner-border text-primary mb-3"
              role="status"
            ></div>
            <p className="fs-4 text-secondary fw-semibold">
              Loading data, please wait...
            </p>
          </div>
        ) : teamError ? (
          <div className="text-center py-4 my-4">
            <i className="bi bi-exclamation-triangle text-danger display-4 d-block mb-3"></i>
            <p className="fs-3 text-danger fw-bold">
              Oops! Something went wrong.
            </p>
            <p className="text-muted fs-5">
              {teamError.message || "Failed to fetch resource."}
            </p>
          </div>) : teams && owners && teams.length > 0 && owners.length > 0 ?
          ( <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 ">
        {teams &&
          teams.length > 0 &&
          teams.map((team, index) => {
            const hasMembers = team.members && team.members.length > 0;
            const totalMembers = team.members?.length || 0;
            const showStackedBadge = totalMembers > 3;
            const visibleLimit = showStackedBadge ? 2 : totalMembers;
            const visibleMembers = team.members
              ? team.members.slice(0, visibleLimit)
              : [];
            const remainingCount = totalMembers - visibleLimit;
          
            return (
              <Link
                to={`/team/${team._id}`}
                className="col d-flex justify-content-center text-decoration-none"
                key={team._id || index}
              >
                <div
                  className="card border border-gray shadow-sm w-100"
                  style={{ maxWidth: "500px", backgroundColor: "#f4f5f7" }}
                >
                  <div className="card-body p-4">
                    {/* Top section: Name/Heading only */}
                    <div className="mb-3">
                      <h4 className="card-title fw-bold text-dark mb-0 pb-2 border-bottom border-secondary-subtle">
                        {team.name}
                      </h4>
                    </div>

                    {/* Bottom section: Owners Horizontal Stack */}
                    <div>
                      <h5
                        className="text-dark fw-bold mb-3"
                        style={{ fontSize: "1rem" }}
                      >
                        Owners
                      </h5>

                      {hasMembers ? (
                        <div className="d-flex align-items-center flex-wrap gap-2">
                          {/* Horizontal Avatars Container */}
                          <div
                            className="d-flex align-items-center position-relative"
                            style={{ height: "36px" }}
                          >
                            {visibleMembers.map((member, memberIdx) => {
                              const firstLetter = member.name
                                .charAt(0)
                                .toUpperCase();
                              const bgColor = getAvatarBgColor(member.name);

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
                                  title={member.name}
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
                          {showStackedBadge && (
                            <span className="text-muted small fst-italic ms-1">
                              {remainingCount} more owners...
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted fst-italic small">
                          No owners assigned
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>) : (
          <div className="text-center py-5 my-5 border rounded bg-light">
            <p className="fs-3 text-muted fw-medium m-0">
              No data available at the moment.
            </p>
          </div>
        )}

      {/* Bootstrap 5 Modal Popup Structure */}
      <div
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        id="addTeamModal"
        tabIndex="-1"
        aria-labelledby="addTeamModalLabel"
        aria-hidden="true"
         style={{
          display: showModal ? "block" : "none",
          backgroundColor: showModal
            ? "rgba(0, 0, 0, 0.5)"
            : "transparent",
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="addTeamModalLabel">
                Add New Team
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body d-flex flex-column gap-3">
                {/* Team Name Field */}
                <div>
                  <label className="form-label small fw-semibold text-secondary">
                    Team Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Backend Engine"
                    name="name"
                    value={teamFormData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Team Description Field */}
                <div>
                  <label className="form-label small fw-semibold text-secondary">
                    Team Description
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="description"
                    value={teamFormData.description}
                    onChange={handleChange}
                    placeholder="Enter team details"
                    required
                  ></textarea>
                </div>

                {/* Select Owners Field */}
                <div>
                  <label className="form-label small fw-semibold text-secondary">
                    Select Owners
                  </label>
                  <select
                    multiple
                    className="form-select"
                    style={{ height: "100px" }}
                    name="members"
                    value={teamFormData.members}
                    onChange={(e) =>
                      handleMultiSelect(e, "members")
                    }
                    required
                  >
                    {owners &&
                      owners.length > 0 &&
                      owners.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name}
                        </option>
                      ))}
                  </select>
                  <div
                    className="form-text xsmall text-muted"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Hold Ctrl (Windows) or Command (Mac) to choose multiple
                    names.
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                >
                  Save Team
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Style tweaks for clamping line lines safely */}
      <style>{`
        .text-truncate-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
