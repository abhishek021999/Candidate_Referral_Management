import React, { useState } from "react";
import { apiRequest } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

function UserReferralForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    resume: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setForm({ ...form, resume: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validate = () => {
    if (!form.name || !form.email || !form.phone || !form.jobTitle) return "All fields except resume are required.";
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(form.email)) return "Invalid email format.";
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(form.phone)) return "Invalid phone number.";
    if (form.resume && form.resume.type !== "application/pdf") return "Resume must be a PDF file.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("jobTitle", form.jobTitle);
      if (form.resume) formData.append("resume", form.resume);
      await apiRequest("/candidates", "POST", formData, true);
      toast.success("Candidate referred successfully!");
      setForm({ name: "", email: "", phone: "", jobTitle: "", resume: null });
      setTimeout(() => navigate("/user/dashboard"), 1200);
    } catch (err) {
      toast.error(err.msg || "Failed to refer candidate");
    }
    setLoading(false);
  };

  return (
    <div className="container-fluid min-vh-100 mt-5 d-flex justify-content-center align-items-center" style={{ background: '#f8f9fa' }}>
      <div className="card shadow p-4" style={{ maxWidth: 500, width: '100%', borderRadius: 16 }}>
        <h2 className="mb-4 text-center fw-bold">Refer a Candidate</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label text-start w-100">Candidate Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-start w-100">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-start w-100">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-start w-100">Job Title</label>
            <input
              type="text"
              className="form-control"
              name="jobTitle"
              value={form.jobTitle}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-start w-100">Resume (PDF, optional)</label>
            <input
              type="file"
              className="form-control"
              name="resume"
              accept="application/pdf"
              onChange={handleChange}
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Submitting..." : "Refer Candidate"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserReferralForm; 