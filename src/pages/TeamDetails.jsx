import { useParams } from "react-router-dom";
import useFetch from "../useFetch";
import { getAvatarBgColor } from "./Team";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function TeamDetails() {
  const { teamId } = useParams();
  const {
    data: teamData,
    loading: teamLoading,
    error: teamError,
    refetch: teamRefetch,
  } = useFetch("https://backend-workasana-ruby.vercel.app/team");
  const {
    data: ownersData,
    loading: ownersLoading,
    error: ownersError,
  } = useFetch("https://backend-workasana-ruby.vercel.app/owners");
  const owners = ownersData && ownersData.length > 0 ? ownersData : [];
  const teamDetails =
    teamData && teamData.length > 0
      ? teamData.find((team) => team._id === teamId)
      : {};
  const leftMembers = owners.filter((owner) =>
    teamDetails.members?.every((member) => member._id !== owner._id),
  );
  const [showModal, setShowModal] = useState(false);
  const [teamFormData, setTeamFormData] = useState({
    name: "",
    description: "",
    members: [],
  });
  useEffect(() => {
    if (teamDetails) {
      setTeamFormData({
        name: teamDetails.name || "",
        description: teamDetails.description || "",
        members: teamDetails.members?.length > 0 ? teamDetails.members.map((member) => {
          return member._id
        }): [] ,
      });
    }
  }, [teamDetails]);


  // Handle multi-select change
  const handleSelectChange = (e, field) => {
    const options = [...e.target.selectedOptions].map((opt) => opt.value);
    setTeamFormData((prev) => ({
      ...prev,
      [field]: [...new Set([...(prev[field] || []), ...options])],
    }));
  };

  async function handleAddMemberSubmit() {
    try {
      const teamId = teamDetails._id;
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://backend-workasana-ruby.vercel.app/team/${teamId}`,
        teamFormData,
        {
          headers: {
            Authorization: `Bearers ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log("Add members Successfully :", response.data);
       toast.success("New Member added successfully");
      setTeamFormData({
        name: teamDetails?.name,
        description: teamDetails?.description,
        members: teamDetails?.members,
      });
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
  }

  return (
    <>
      <div className="py-2 py-md-4 px-2 px-md-0">
        <main className="container-fluid bg-white p-3 p-md-4 ">
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
          </div>) : teamDetails && owners && owners.length > 0 ? ( <section className="mb-0">
            {/* Team Name - Responsive sizing */}
            <div className="d-flex justify-content-between align-items-center gap-3 mb-2">
              <h1 className=" fs-3 fs-md-2 fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                {teamDetails?.name}
              </h1>

              <button
                type="button"
                className="btn btn-primary d-inline-flex align-items-center justify-content-center gap-2 fs-6 fs-md-5 py-1 px-2 py-md-2 px-md-4 text-nowrap"
                onClick={ () => setShowModal(!showModal)}
              >
                <i className="bi bi-plus-lg"></i> Add members
              </button>
            </div>

            {/* Team Description - Responsive text size */}
            <p className="text-secondary fs-6 fs-md-5 mb-4">
              {teamDetails?.description}
            </p>

            {/* Subheading */}
            <h2 className="fs-5 fw-semibold text-dark mb-3">Team Members</h2>

            {/* Members List Container */}
            <div className="d-flex flex-column gap-2">
              {teamDetails?.members &&
                teamDetails.members.length > 0 &&
                teamDetails.members.map((member, memberIdx) => {
                  const firstLetter = member.name.charAt(0).toUpperCase();
                  const bgColor = getAvatarBgColor(member.name);
                  return (
                    <div
                      key={memberIdx}
                      className="d-flex align-items-center gap-3 p-2 rounded-3 "
                    >
                      <span
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm border border-2 border-white"
                        style={{
                          width: "38px",
                          height: "38px",
                          backgroundColor: bgColor,
                          flexShrink: 0,
                          fontSize: "0.9rem",
                        }}
                        title={member.name}
                      >
                        {firstLetter}
                      </span>
                      <span className="fs-6 fw-medium text-dark text-truncate">
                        {member.name}
                      </span>
                    </div>
                  );
                })}
            </div>
          </section>): (
          <div className="text-center py-5 my-5 border rounded bg-light">
            <p className="fs-3 text-muted fw-medium m-0">
              No data available at the moment.
            </p>
          </div>
        )}
        </main>
      </div>
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Add Team Members</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={ () => setShowModal(!showModal)}
                ></button>
              </div>

              <div className="modal-body">
                <p className="text-muted small mb-3">
                  Hold down the Ctrl (Windows) or Command (Mac) key to select
                  multiple members.
                </p>

                <div className="mb-3">
                  <label
                    htmlFor="memberSelect"
                    className="form-label fw-semibold"
                  >
                    Select Remaining Members
                  </label>
                  <select
                    id="memberSelect"
                    multiple
                    className="form-select"
                    value={teamFormData.members.name}
                    style={{ minHeight: "150px" }}
                    onChange={(e) => handleSelectChange(e, "members")}
                  >
                    {/* Example options list - replace with your dynamic available members list */}
                    {leftMembers?.length > 0 &&
                      leftMembers.map((member) => {
                        return (
                          <option key={`${member._id}`} value={`${member._id}`}>{member.name}</option>
                        );
                      })}
                  </select>
                </div>
              </div>

              <div className="modal-footer border-top">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={ () => setShowModal(!showModal)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddMemberSubmit}
                >
                  Add Selected
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
