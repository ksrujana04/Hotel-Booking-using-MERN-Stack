import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/auth/reset-password/${token}`, { newPassword });
      setMsg(res.data);
    } catch (err) {
      setMsg(err.response?.data || "Password reset failed");
    }
  };

  return (
    <div>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      <p>{msg}</p>
    </div>
  );
};

export default ResetPassword;
