import UserProfile from "../../components/userProfile/UserProfile.jsx";
import AdminProfile from "../../components/adminProfile/AdminProfile.jsx";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.js";

const Profile = () => {
    const {user} = useContext(AuthContext);
    console.log(user);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.username}</h1>
      {user.isAdmin ? <AdminProfile userId={user._id} /> : <UserProfile userId={user._id} />}
    </div>
  );
};

export default Profile;
