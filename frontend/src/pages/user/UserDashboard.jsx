import React, { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api";

function UserDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resumeStatus, setResumeStatus] = useState({});

  const fetchCandidates = async () => {
    setLoading(true);
    setError("");
    try {
      let query = "";
      if (search) query += `jobTitle=${encodeURIComponent(search)}`;
      if (status) query += `${query ? "&" : ""}status=${encodeURIComponent(status)}`;
      const res = await apiRequest(`/candidates${query ? `?${query}` : ""}`);
      setCandidates(res);
      // Check resume URLs
      const statusObj = {};
      await Promise.all(res.map(async (candidate) => {
        if (candidate.resumeUrl) {
          try {
            const response = await fetch(candidate.resumeUrl, { method: 'HEAD' });
            statusObj[candidate._id] = response.ok;
          } catch {
            statusObj[candidate._id] = false;
          }
        }
      }));
      setResumeStatus(statusObj);
    } catch (err) {
      setError(err.msg || "Failed to fetch candidates");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCandidates();
    // eslint-disable-next-line
  }, [search, status]);

  return (
    <div className="container-fluid min-vh-100 mt-5 ">
      <h2 className="mb-4">Referred Candidates</h2>
      <div className="row mb-3 border-2">
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
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : candidates.length === 0 ? (
        <div>No candidates found.</div>
      ) : (
        <div className="row">
          {candidates.map(candidate => {
            console.log('Candidate:', candidate.name, 'Resume URL:', candidate.resumeUrl, 'Status:', resumeStatus[candidate._id]);
            return (
              <div className="col-md-4 mb-4 d-flex justify-content-center" key={candidate._id}>
                <div className="card h-100 w-100 shadow-sm" style={{ width: '480px', minHeight: '350px', margin: '0 auto' }}>
                  <div className="card-body d-flex flex-column" style={{ textAlign: 'left' }}>
                    <h5 className="card-title">{candidate.name}</h5>
                    <p className="card-text mb-1"><strong>Job Title:</strong> {candidate.jobTitle}</p>
                    <p className="card-text mb-1"><strong>Status:</strong> <span className={`badge bg-${candidate.status === 'Pending' ? 'warning' : candidate.status === 'Reviewed' ? 'info' : 'success'}`}>{candidate.status}</span></p>
                    {candidate.resumeUrl && (
                      <p className="card-text mb-1">
                        <strong>Resume Link:</strong> <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer">{candidate.resumeUrl}</a>
                      </p>
                    )}
                    <div className="mt-auto">
                      {candidate.resumeUrl && resumeStatus[candidate._id] === true && (
                        <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm mt-2 w-100">View Resume</a>
                      )}
                      {candidate.resumeUrl && resumeStatus[candidate._id] === false && (
                        <div className="alert alert-warning mt-2 p-2">Resume URL not accessible</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UserDashboard; 