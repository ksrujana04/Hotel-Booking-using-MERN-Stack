import { useEffect, useContext, useState } from "react";
import "./login.css";
import { AuthContext } from "../../context/AuthContext.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");

    if (error === "user_exists") {
      window.alert("A user with this Google account already exists. Please login using your email.");
    }
  }, []);
    const [credentials,setCredentials]=useState({
        username: undefined,
        password:undefined,
    });

    const { loading, error, dispatch} = useContext(AuthContext);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials((prev)=>({...prev,[e.target.id]:e.target.value}));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        dispatch({type:"LOGIN_START"});
        try{
            const res = await axios.post("/auth/login",credentials);
            dispatch({type:"LOGIN_SUCCESS",payload: res.data});
            navigate("/");
        }catch(err){
            dispatch({type:"LOGIN_FAILURE",payload:err.response.data});
        }
    }
const handleGoogleLogin = () => {
    const googleWindow = window.open(
      "http://localhost:8800/api/auth/google",
      "_blank",
      "width=500,height=600"
    );

    const checkLogin = setInterval(async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/auth/login/success", {
          withCredentials: true,
        });

        if (res.status === 200) {
          dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
          navigate("/");
          clearInterval(checkLogin);
          googleWindow.close();
        }
      } catch (err) {
        // Still waiting for login — ignore errors until success
      }
    }, 1000);
  };
    return <div className="login">
        <div className="lContainer">
            <input type="text" placeholder="username" id="username" onChange={handleChange} className="lInput"/>
            <input type="password" placeholder="password" id="password" onChange={handleChange} className="lInput"/>
            <button disabled={loading} className="lButton" onClick={handleClick}>Log In</button>
            <div style={{ margin: "1rem 0" }}>or</div>

      <button onClick={handleGoogleLogin} className="googleLoginButton">
        Login with Google
      </button>
            {error && <span>{error.message}</span>}
            {console.log(error)}
        </div>
    </div>
};

export default Login;