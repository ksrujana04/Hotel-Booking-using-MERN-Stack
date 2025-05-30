import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faPerson } from "@fortawesome/free-solid-svg-icons";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import "./headerSearch.css";

const HeaderSearch = () => {
  const [city, setCity] = useState("");
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });
  const [openOptions, setOpenOptions] = useState(false);

  const navigate = useNavigate();
  const { dispatch } = useContext(SearchContext);

  const handleSearch = () => {
    if (!city) return alert("Please enter a destination");

    dispatch({
      type: "NEW_SEARCH",
      payload: { city, date, options },
    });
    navigate("/hotels", { state: { city, date, options } });
  };

  return (
    <div className="header">
      <div className="headerContainer">
        <h1 className="headerTitle">Find your next stay</h1>
        <div className="headerSearch">
          <input
            type="text"
            placeholder="Where are you going?"
            onChange={(e) => setCity(e.target.value)}
          />
          <span onClick={() => setOpenDate(!openDate)}>
            <FontAwesomeIcon icon={faCalendarDays} /> {" "}
            {`${format(date[0].startDate, "dd/MM/yyyy")} to ${format(
              date[0].endDate,
              "dd/MM/yyyy"
            )}`}
          </span>
          {openDate && (
            <DateRange
              editableDateInputs={true}
              onChange={(item) => setDate([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={date}
              minDate={new Date()}
            />
          )}
          <span onClick={() => setOpenOptions(!openOptions)}>
            <FontAwesomeIcon icon={faPerson} /> {" "}
            {`${options.adult} adult · ${options.children} children · ${options.room} room`}
          </span>
          {openOptions && (
            <div className="options">
              {Object.entries(options).map(([key, value]) => (
                <div key={key}>
                  <label>{key}</label>
                  <input
                    type="number"
                    min={key === "children" ? 0 : 1}
                    value={value}
                    onChange={(e) =>
                      setOptions({ ...options, [key]: Number(e.target.value) })
                    }
                  />
                </div>
              ))}
            </div>
          )}
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>
    </div>
  );
};

export default HeaderSearch;
