import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("access_token", token);
      navigate("/"); // redirect after login
    } else {
      alert("Google login failed");
      navigate("/login");
    }
  }, [navigate]);

  return <p>Logging you in...</p>;
};

export default OAuthSuccess;
