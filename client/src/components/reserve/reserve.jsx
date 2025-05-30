import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import "./reserve.css";
import useFetch from "../../hooks/useFetch.js";
import { useContext, useState,useEffect } from "react";
import { SearchContext } from "../../context/SearchContext.js";
import axios from "axios";

const Reserve = ({setOpen,hotelId}) => {
    const [selectedRooms,setSelectedRooms] = useState([]);
    const {data,loading,error} = useFetch(`http://localhost:8800/api/hotels/room/${hotelId}`)
    const {date} = useContext(SearchContext);
console.log(date)
    const getDatesInRange = (startDate,endDate) => {
        const date = new Date(startDate.getTime());
        const dates = [];
        while (date<endDate){
            dates.push(new Date(date).getTime());
            date.setDate(date.getDate()+1);
        }
        return dates;
    }

    const alldates = getDatesInRange(date[0].startDate,date[0].endDate);
    console.log(alldates)

    const isAvailable = (roomNumber) => {
        const isFound = roomNumber.unavailableDates.some((date)=>alldates.includes(new Date(date).getTime()));
        return !isFound;
    }

    const handleSelect = (e) => {
        const selected = e.target.checked;
        console.log(selected)
        const value = e.target.value;
        console.log(value)
        setSelectedRooms(prev=>{
            const updatedRooms= selected ?
            [...prev,value] :
            selectedRooms.filter((item)=> item!==value)
            return updatedRooms
    });
        console.log(selectedRooms)
    };

    useEffect(() => {
        console.log("Updated selectedRooms:", selectedRooms);
    }, [selectedRooms]); 

    const handleClick = async () => {
        try{
            await Promise.all(selectedRooms.map((roomId)=>{
                const res = axios.put(`/rooms/availability/${roomId}`,{dates:alldates},{ withCredentials: true });
                return res.data;
            }));
            setOpen(false);
        }catch(err){}
    }

    return (
        <div className="reserve">
            <div className="rContainer">
            <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>Select your rooms:</span>
        {data.map(item=>(
            <div className="ritem" key={item._id}>
                <div className="rItemInfo">
                    <div className="rTitle">{item.tile}</div>
                    <div className="rDesc">{item.desc}</div>
                    <div className="rMax">Max people: <b>{item.maxPeople}</b></div>
                    <div className="rPrice">{item.price}</div>
                </div>
                
                    {item.roomNumbers.map(roomNumber=>(
                        <div className="room" key={roomNumber._id}>
                            <label htmlFor="">{roomNumber.number}</label>
                            <input type="checkbox" value={roomNumber._id} onChange={handleSelect} disabled={!isAvailable(roomNumber)} />
                        </div>
                    ))}
                
            </div>
        ))}
        <button onClick={handleClick} className="rButton">Reserve Now!</button>
            </div>
        </div>
    )
};

export default Reserve;