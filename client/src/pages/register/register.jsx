import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    country: "",
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/auth/register", inputs, { withCredentials: true });
      console.log(res.data);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      navigate("/");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  const handleGoogleRegister = () => {
    const googleWindow = window.open(
      "http://localhost:8800/api/auth/google",
      "_blank",
      "width=500,height=600"
    );

    const checkRegister = setInterval(async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/auth/login/success", {
          withCredentials: true,
        });

        if (res.status === 200) {
          dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
          console.log(res.data)
          navigate("/");
          clearInterval(checkRegister);
          googleWindow.close();
        }
      } catch (err) {
        // waiting for google auth to complete
      }
    }, 1000);
  };

  return (
    <div className="register">
      <input
        type="text"
        placeholder="username"
        id="username"
        onChange={handleChange}
        value={inputs.username}
        className="registerInput"
      />
      <input
        type="email"
        placeholder="email"
        id="email"
        onChange={handleChange}
        value={inputs.email}
        className="registerInput"
      />
      <input
        type="password"
        placeholder="password"
        id="password"
        onChange={handleChange}
        value={inputs.password}
        className="registerInput"
      />
      <input
        type="text"
        placeholder="phone"
        id="phone"
        onChange={handleChange}
        value={inputs.phone}
        className="registerInput"
      />
      <input
        type="text"
        placeholder="city"
        id="city"
        onChange={handleChange}
        value={inputs.city}
        className="registerInput"
      />
      <input
        type="text"
        placeholder="country"
        id="country"
        onChange={handleChange}
        value={inputs.country}
        className="registerInput"
      />
      <button disabled={loading} onClick={handleSubmit} className="registerButton">
        Register
      </button>

      <div style={{ margin: "1rem 0" }}>or</div>

      <button onClick={handleGoogleRegister} className="googleRegisterButton">
        Register with Google
      </button>

      {error && <span style={{ color: "red" }}>{error.message}</span>}
    </div>
  );
};

export default Register;
