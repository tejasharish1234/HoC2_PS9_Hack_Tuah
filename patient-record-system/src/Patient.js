import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Patient.css";

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "tejasharish1234@gmail.com",
    password: "12345678",
    name: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (credentials.email === "tejasharish1234@gmail.com" && credentials.password === "12345678") {
      localStorage.setItem("Name",credentials.name);
      navigate("/home");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="name"
          name="name"
          placeholder="Name"
          value={credentials.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          required
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const [approvedHospitals, setApprovedHospitals] = useState(
    JSON.parse(localStorage.getItem("approvedHospitals")) || []
  );
  const [revokedHospitals, setRevokedHospitals] = useState([]);
  const name = localStorage.getItem("Name");
  const handleQRCodeScan = async () => {
    const hospitalName = prompt("Enter hospital name:");
    if (hospitalName && window.confirm("Do you approve the hospital to view your data?")) {
      const updatedHospitals = [...approvedHospitals, hospitalName];
      setApprovedHospitals(updatedHospitals);
      localStorage.setItem("approvedHospitals", JSON.stringify(updatedHospitals));

      // Simulating API call to send data to hospital
      await fetch("/api/sendPatientData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hospitalName, patientName: "John Doe", data: "Patient Data" })
      });
    }
  };

  const revokeAccess = (hospital) => {
    setApprovedHospitals(approvedHospitals.filter((h) => h !== hospital));
    setRevokedHospitals([...revokedHospitals, hospital]);
  };

  const unRevokeAccess = (hospital) => {
    setRevokedHospitals(revokedHospitals.filter((h) => h !== hospital));
    setApprovedHospitals([...approvedHospitals, hospital]);
  };

  localStorage.setItem("PatientIPNS", "123");
  localStorage.setItem("EncryptionKey", "abc");
  localStorage.setItem("MedicalHistory", "Patient presented with fatigue and shortness of breath. History of penicillin allergy...");



  return (
    <div className="home-container">
      <div className="sidebar">
        <h2>Patient Dashboard</h2>
        
        <h3>Name: {name}</h3>
        <h4><strong>IPNS Number:</strong> 123</h4>
        <h4><strong>Encryption Key:</strong> abc</h4>
        <button className="scan-button" onClick={handleQRCodeScan}>Add Access</button>

        <h3>Approved Hospitals</h3>
        <ul>
          {approvedHospitals.map((hospital, index) => (
            <li key={index}>
              {hospital}
              <button className="revoke-button" onClick={() => revokeAccess(hospital)}>Revoke</button>
            </li>
          ))}
        </ul>

        <h3>Revoked Access</h3>
        <ul>
          {revokedHospitals.map((hospital, index) => (
            <li key={index}>
              {hospital}
              <button className="unrevoke-button" onClick={() => unRevokeAccess(hospital)}>Regrant Access</button>
            </li>
          ))}
        </ul>

        <button className="history-button" onClick={() => navigate("/medical-history")}>View Medical History</button>
      </div>
    </div>
  );
}

function MedicalHistory() {
  const navigate = useNavigate();
  const medicalHistory = localStorage.getItem("MedicalHistory") || "No medical history available.";

  
  return (
    <div className="patient-details">
        <h2>Medical History</h2>
        <p>{medicalHistory}</p>
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

export { Home, Login, MedicalHistory };
