import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginSelection from "./LoginSelection";
import { DoctorLogin, DoctorPage, PatientDetails } from "./Doc.js";
import {Home, Login, MedicalHistory} from "./Patient.js";
import { InsuranceLogin, InsuranceDashboard, ClientDetails } from "./Insurance.js"; 

function App() {
  
  return (
    <Router>
      <Routes>
        {/* <Route path="/register" element={<Register />} />*/}
        <Route path="/login" element={<Login />} /> 
        <Route path="/home" element={<Home />} />
        <Route path="/doclogin" element={<DoctorLogin />} />
        <Route path="/doctor" element={<DoctorPage />} />
        <Route path="/patient/:name" element={<PatientDetails />} />
        <Route path="/insurance-login" element={<InsuranceLogin />} />
        <Route path="/insurance-dashboard" element={<InsuranceDashboard />} />
        <Route path="/client/:name" element={<ClientDetails />} />
        <Route path="/" element={<LoginSelection />} />
        <Route path="/medical-history" element = {<MedicalHistory/>}/ >
      </Routes>
    </Router>
  );
}

export default App;