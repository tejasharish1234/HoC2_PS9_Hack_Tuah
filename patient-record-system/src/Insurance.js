import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Insurance.css";

// ✅ Insurance Login Component
function InsuranceLogin() {
  const [credentials, setCredentials] = useState({ companyName: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/insurance-dashboard");
  };

  return (
    <div className="insurance-container">
      <h2>Insurance Company Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
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

// ✅ Insurance Dashboard Component
function InsuranceDashboard() {
  const navigate = useNavigate();
  const [clients] = useState(["Michael Scott", "Dwight Schrute", "Jim Halpert"]);
  const [search, setSearch] = useState("");
  const filteredClients = clients.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="insurance-container">
      <h2>Insurance Dashboard</h2>
      <input
        type="text"
        placeholder="Search clients..."
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="insurance-list">
        {filteredClients.map((client, index) => (
          <li 
            key={index}
            onClick={() => navigate(`/client/${encodeURIComponent(client)}`)}
          >
            {client}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ✅ Client Details Component
function ClientDetails() {
  const { name } = useParams();
  return (
    <div className="insurance-details">
      <h2>Client Details</h2>
      <p><strong>Name:</strong> {decodeURIComponent(name)}</p>
      <p><strong>Policy ID:</strong> INS-987654</p>
      <p><strong>Coverage:</strong> Full Health Insurance</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget felis vel libero tincidunt eleifend.</p>
    </div>
  );
}

export { InsuranceLogin, InsuranceDashboard, ClientDetails };
