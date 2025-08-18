import { useState } from "react";
import axios from "axios";

const NewHotelForm = ({ onClose }) => {
  const [hotelData, setHotelData] = useState({
    name: "",
    type: "",
    city: "",
    address: "",
    distance: "",
    title: "",
    desc: "",
    cheapestPrice: "",
    featured: false,
    photos: [],
  });

  const [rooms, setRooms] = useState([]);

  const handleHotelChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHotelData({
      ...hotelData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddRoom = () => {
    setRooms([...rooms, { title: "", price: "", maxPeople: "", desc: "", roomNumbers: "" }]);
  };

  const handleRoomChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRooms = [...rooms];
    updatedRooms[index][name] = value;
    setRooms(updatedRooms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Create hotel
      const res = await axios.post("http://localhost:8800/api/hotels", hotelData,{withCredentials:true});
      const hotelId = res.data._id;

      // 2. Create rooms with hotelId in the URL
      await Promise.all(
        rooms.map(async (room) => {
          const roomNumbersArray = room.roomNumbers
            .split(",")
            .map((num) => ({ number: parseInt(num.trim()) }));

          await axios.post(`http://localhost:8800/api/rooms/${hotelId}`, {
            title: room.title,
            price: room.price,
            maxPeople: room.maxPeople,
            desc: room.desc,
            roomNumbers: roomNumbersArray,
          },{withCredentials:true});
        })
      );

      alert("Hotel and rooms created successfully");
      onClose();
    } catch (err) {
      console.error("Error creating hotel and rooms:", err);
      alert("Failed to create hotel or rooms");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="hotelForm">
      <h2>Create New Hotel</h2>
      {Object.keys(hotelData).map((key) => (
        key !== "photos" && (
          <div key={key}>
            <label>{key}:</label>
            {key === "featured" ? (
              <input
                type="checkbox"
                name={key}
                checked={hotelData[key]}
                onChange={handleHotelChange}
              />
            ) : (
              <input
                type="text"
                name={key}
                value={hotelData[key]}
                onChange={handleHotelChange}
              />
            )}
          </div>
        )
      ))}

      <h3>Rooms</h3>
      {rooms.map((room, idx) => (
        <div key={idx} className="roomEntry">
          <input
            type="text"
            name="title"
            placeholder="Room Title"
            value={room.title}
            onChange={(e) => handleRoomChange(idx, e)}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={room.price}
            onChange={(e) => handleRoomChange(idx, e)}
          />
          <input
            type="number"
            name="maxPeople"
            placeholder="Max People"
            value={room.maxPeople}
            onChange={(e) => handleRoomChange(idx, e)}
          />
          <input
            type="text"
            name="desc"
            placeholder="Description"
            value={room.desc}
            onChange={(e) => handleRoomChange(idx, e)}
          />
          <input
            type="text"
            name="roomNumbers"
            placeholder="Room Numbers (comma separated)"
            value={room.roomNumbers}
            onChange={(e) => handleRoomChange(idx, e)}
          />
        </div>
      ))}
      <button type="button" onClick={handleAddRoom}>Add Room</button>
      <br />
      <button type="submit">Submit Hotel</button>
    </form>
  );
};

export default NewHotelForm;
