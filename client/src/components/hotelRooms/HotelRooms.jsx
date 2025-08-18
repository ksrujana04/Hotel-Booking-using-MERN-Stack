import useFetch from "../../hooks/useFetch";
import axios from "axios";
import {useNavigate} from "react-router-dom";


const HotelRooms = (props) => {
    const navigate = useNavigate();
    const { data, loading, error } = useFetch(`http://localhost:8800/api/hotels/room/${props.hotel._id}`);
    const handleEdit = () =>{

    };
    const handleDelete = async ()=> {
const confirmDelete = window.confirm("Are you sure you want to delete this hotel?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`http://localhost:8800/api/hotels/${props.hotel._id}`, { withCredentials: true });
    alert("Hotel deleted successfully");
   navigate('/profile');
  } catch (error) {
    console.error("Delete failed:", error);
    alert("Failed to delete hotel");
  }
    };
    return (
    <div className="hotelCard">
      <h2>{props.hotel.name}</h2>
      <p><strong>City:</strong> {props.hotel.city}</p>
      <p><strong>Type:</strong> {props.hotel.type}</p>
      <p><strong>Title:</strong> {props.hotel.title}</p>
      <p><strong>Description:</strong> {props.hotel.desc}</p>
      <p><strong>Cheapest Price:</strong> ₹{props.hotel.cheapestPrice}</p>

      <div className="mt-2">
        <strong>Rooms:</strong>
        {loading ? (
          <p>Loading rooms...</p>
        ) : data.length > 0 ? (
          <ul className="list-disc list-inside">
            {data.map((room) => (
              <li key={room._id}>{room.title} - ₹{room.price}</li>
            ))}
          </ul>
        ) : (
          <p>No rooms available</p>
        )}
      </div>
      <div className="buttons">
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};
export default HotelRooms;