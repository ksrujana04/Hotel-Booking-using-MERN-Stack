import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import HotelRooms from "../hotelRooms/HotelRooms.jsx";
import axios from "axios";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";
import NewHotelForm from "../newHotel/newHotel.jsx";

const AdminProfile = ({ userId }) => {
  
  const { data, loading, error } = useFetch(`/hotels/admin/${userId}`);
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="adminProfile">
      <h1>Hello Admin</h1>

      <div className="heading">
        <h3>Your Hotels</h3>
        <button onClick={() => setOpenModal(true)}>New</button>
      </div>

      {openModal && (
        <div className="newForm">
          <FontAwesomeIcon
            icon={faCircleXmark}
            className="close"
            onClick={() => setOpenModal(false)}
          />
          <NewHotelForm onClose={() => setOpenModal(false)}/>
        </div>
      )}

      {loading && <p>Loading your hotels...</p>}
      {error && <p>Error loading hotels: {error.message}</p>}
      {!loading && data?.length === 0 && <p>No hotels created yet.</p>}

      {!loading && data?.length > 0 && (
        <div className="hotelList">
          {data.map((hotel) => (
            <HotelRooms key={hotel._id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
