import { useNavigate } from "react-router-dom";
import "./LoginSelection.css";

const LoginSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Select Login Type</h1>
        <button onClick={() => navigate("/login  ")} className="button patient-btn">
          Login as Patient
        </button>
        <button onClick={() => navigate("/doclogin")} className="button doctor-btn">
          Login as Doctor
        </button>
        {/* <button onClick={() => navigate("/insurance-login")} className="button insurance-btn">
          Login as Insurance
        </button> */}
      </div>
    </div>
  );
};

export default LoginSelection;
