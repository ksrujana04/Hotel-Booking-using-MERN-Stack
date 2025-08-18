import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home.jsx"
import List from "./pages/list/list.jsx";
import Hotel from "./pages/hotel/hotel.jsx";
import "./app.css"
import Login from "./pages/login/login.jsx";
import Profile from "./pages/profile/profile.jsx"
import Register from "./pages/register/register.jsx";
import OAuthSuccess from "./components/OAuthSuccess/OAuthSuccess.jsx";
import ForgotPassword from "./pages/forgotPassword/forgotPassword.jsx";
import ResetPassword from "./pages/resetPassword/resetPassword.jsx";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

function App() {
  return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hotels" element={<List />} />
            <Route path="/hotels/:id" element={<Hotel />} />
            <Route path="/login" element={<Login />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </BrowserRouter>
  )
}
export default App;
