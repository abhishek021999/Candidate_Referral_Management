import React, { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api";
import { toast } from 'react-toastify';

function AdminDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [statusUpdating, setStatusUpdating] = useState("");
  const [deleting, setDeleting] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const fetchCandidates = async () => {
    setLoading(true);
    setError("");
    try {
      let query = "";
      if (search) query += `jobTitle=${encodeURIComponent(search)}`;
      if (status) query += `${query ? "&" : ""}status=${encodeURIComponent(status)}`;
      const res = await apiRequest(`/candidates${query ? `?${query}` : ""}`);
      setCandidates(res);
    } catch (err) {
      setError(err.msg || "Failed to fetch candidates");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCandidates();
    // eslint-disable-next-line
  }, [search, status]);

  const handleStatusChange = async (id, newStatus) => {
    setStatusUpdating(id);
    setActionMsg("");
    try {
      await apiRequest(`/candidates/${id}/status`, "PATCH", { status: newStatus });
      toast.success("Status updated!");
      fetchCandidates();
    } catch (err) {
      toast.error(err.msg || "Failed to update status");
    }
    setStatusUpdating("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;
    setDeleting(id);
    setActionMsg("");
    try {
      await apiRequest(`/candidates/${id}`, "DELETE");
      toast.success("Candidate deleted!");
      fetchCandidates();
    } catch (err) {
      toast.error(err.msg || "Failed to delete candidate");
    }
    setDeleting("");
  };

  return (
    <div className="container-fluid min-vh-100 mt-5" style={{ background: '#fff' }}>
      <h2 className="mb-4">Admin: All Candidates</h2>
      <div className="row mb-3">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by job title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-2">
          <select
            className="form-select"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Hired">Hired</option>
          </select>
        </div>
        <div className="col-md-2 mb-2">
          <button className="btn btn-secondary w-100" onClick={() => { setSearch(""); setStatus(""); }}>Clear</button>
        </div>
      </div>
      {actionMsg && <div className="alert alert-info">{actionMsg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : candidates.length === 0 ? (
        <div>No candidates found.</div>
      ) : (
        <div className="row">
          {candidates.map(candidate => (
            <div className="col-md-4 mb-4 d-flex justify-content-center" key={candidate._id}>
              <div className="card shadow-sm" style={{ width: 400 }}>
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title">{candidate.name}</h5>
                    <p className="card-text mb-1"><strong>Job Title:</strong> {candidate.jobTitle}</p>
                    <p className="card-text mb-1"><strong>Status:</strong> <span className={`badge bg-${candidate.status === 'Pending' ? 'warning' : candidate.status === 'Reviewed' ? 'info' : 'success'}`}>{candidate.status}</span></p>
                    <p className="card-text mb-1"><strong>Referred By:</strong> {candidate.referredBy?.name || candidate.referredBy?.email || 'N/A'}</p>
                  </div>
                  <div>
                    {candidate.resumeUrl && (
                      <a href={`https://candidate-referral-management.onrender.com${candidate.resumeUrl}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm mt-2 w-100">View Resume</a>
                    )}
                    <select
                      className="form-select mb-2 mt-2"
                      value={candidate.status}
                      disabled={statusUpdating === candidate._id}
                      onChange={e => handleStatusChange(candidate._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Hired">Hired</option>
                    </select>
                    <button
                      className="btn btn-danger btn-sm w-100"
                      disabled={deleting === candidate._id}
                      onClick={() => handleDelete(candidate._id)}
                    >
                      {deleting === candidate._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard; 