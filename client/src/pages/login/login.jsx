import { useContext, useState } from "react";
import "./login.css";
import { AuthContext } from "../../context/AuthContext.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
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

    return <div className="login">
        <div className="lContainer">
            <input type="text" placeholder="username" id="username" onChange={handleChange} className="lInput"/>
            <input type="password" placeholder="password" id="password" onChange={handleChange} className="lInput"/>
            <button disabled={loading} className="lButton" onClick={handleClick}>Log In</button>
            {error && <span>{error.message}</span>}
            {console.log(error)}
        </div>
    </div>
};

export default Login;