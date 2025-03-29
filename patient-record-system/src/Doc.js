import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Doc.css";
import "./Patient.js";

// ✅ Doctor/Admin Login Component
function DoctorLogin() {
  const [Credentials, setCredentials] = useState({
    hospitalName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...Credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !Credentials.hospitalName ||
      !Credentials.email ||
      !Credentials.password
    ) {
      setError("All fields are required.");
      return;
    }

    setError("");
    navigate("/doctor");
  };

  return (
    <div className="form-container">
      <h2>Doctor/Admin Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="hospitalName"
          placeholder="Hospital Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

// ✅ Doctor Dashboard Component
function DoctorPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);

  // ✅ Load patient data from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("Name");
    if (storedName) {
      setPatients([storedName]); // Store as an array for mapping
    }
  }, []);

  return (
    <div className="doctor-container">
      <h2>Hospital Dashboard</h2>
      <input
        type="text"
        className="search-bar"
        placeholder="Search patients..."
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="patient-list">
        {patients.length > 0 ? (
          patients
            .filter((patient) =>
              patient.toLowerCase().includes(search.toLowerCase())
            )
            .map((patient, index) => (
              <li
                key={index}
                onClick={() =>
                  navigate(`/patient/${encodeURIComponent(patient)}`)
                }
                className="clickable"
              >
                {patient}
              </li>
            ))
        ) : (
          <li className="no-results">No patients found.</li>
        )}
      </ul>
    </div>
  );
}

// ✅ Patient Details Component
function PatientDetails() {
  const { name } = useParams();
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [prescription, setPrescription] = useState("");
  const [submittedPrescription, setSubmittedPrescription] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);  // NEW: Loading state

  // Retrieve patient details from localStorage
  const patientDetails = {
    name: decodeURIComponent(name),
    ipns: localStorage.getItem("PatientIPNS") || "N/A",
    encryptionKey: localStorage.getItem("EncryptionKey") || "N/A",
    medicalHistory: localStorage.getItem("MedicalHistory") || "No medical history available.",
  };

  const handleAddPrescription = () => {
    setShowPrescriptionForm(true);
  };

  const handleSubmitPrescription = async () => {
    console.log("Submitting Prescription:", prescription);
    setLoading(true);  // Show loading indicator

    try {
      const response = await fetch("http://127.0.0.1:8000/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ new_prescription: [prescription], past_prescriptions: ["Ibuprofen", "Metformin"] }),
      });

      const data = await response.json();
      console.log("Response from server:", data);

      setInteractions(data.interactions || []);
      setSubmittedPrescription(prescription);
      setShowPrescriptionForm(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting prescription:", error);
    } finally {
      setLoading(false);  // Hide loading indicator
    }
  };

  const handleEditPrescription = () => {
    setIsEditing(true);
  };

  const handlePushToBlockchain = () => {
    console.log("Pushing to Blockchain:", submittedPrescription);
    alert("Prescription pushed to blockchain!");
  };

  return (
    <div className="patient-details">
      <h2>Patient Details</h2>
      <p><strong>Name:</strong> {patientDetails.name}</p>
      <p><strong>IPNS:</strong> {patientDetails.ipns}</p>
      <p><strong>Encryption Key:</strong> {patientDetails.encryptionKey}</p>
      <h3>AI-summarised history</h3>
      <p>{patientDetails.data}</p>

      {interactions.length > 0 || loading ? (
        <div>
          <h3>Detected Drug Interactions:</h3>
          {loading ? (
            <p>Loading...</p>  // Display "Loading..." while fetching response
          ) : (
            interactions.map((interaction, index) => (
              <p key={index}>
                <strong>Drug 1:</strong> {interaction.drug1}, 
                <strong> Drug 2:</strong> {interaction.drug2} <br />
                <strong>Details:</strong> {interaction.interaction_details}
              </p>
            ))
          )}
        </div>
      ) : null}

      {!showPrescriptionForm && !submittedPrescription && (
        <button onClick={handleAddPrescription}>Add Prescription</button>
      )}

      {(showPrescriptionForm || isEditing) && (
        <div>
          <textarea
            value={prescription}
            onChange={(e) => setPrescription(e.target.value)}
            placeholder="Enter prescription here..."
          ></textarea>
          <button onClick={handleSubmitPrescription}>Submit</button>
        </div>
      )}

      {submittedPrescription && !isEditing && (
        <div>
          <p><strong>Prescription:</strong> {submittedPrescription}</p>
          <button onClick={handleEditPrescription}>Edit</button>
          <button onClick={handlePushToBlockchain}>Push to Blockchain</button>
        </div>
      )}
    </div>
  );
}

// ✅ Exporting Components
export { DoctorLogin, DoctorPage, PatientDetails };
