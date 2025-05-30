import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { format } from "date-fns";
import { DateRange } from 'react-date-range';
import Navbar from "../../components/navbar/navbar.jsx";
import SearchItem from "../../components/searchItem/SearchItem.jsx";
import useFetch from "../../hooks/useFetch.js";
import "./list.css";

const List = () => {
  const location = useLocation();
  const { dispatch } = useContext(SearchContext);

  const [destination, setDestination] = useState(location.state?.city || "");
  const [date, setDate] = useState(location.state?.date || [{ startDate: new Date(), endDate: new Date() }]);
  const [options, setOptions] = useState(location.state?.options || { adult: 1, children: 0, room: 1 });
  const [openDate, setOpenDate] = useState(false);
  const [min, setMin] = useState(undefined);
  const [max, setMax] = useState(undefined);

  const { data, loading, error, refetch } = useFetch(
    `http://localhost:8800/api/hotels?${destination ? `city=${destination}` : ''}&min=${min || 0}&max=${max || 999}`, [destination, min, max]
  );

  const handleSearch = () => {
    dispatch({
      type: "NEW_SEARCH",
      payload: { city: destination, date, options },
    });
    refetch();
  };

  return (
    <div>
      <Navbar />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Destination</label>
              <input
                type="text"
                placeholder={destination || "Enter city"}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="lsItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(date[0].startDate, "dd/MM/yy")} to ${format(date[0].endDate, "dd/MM/yy")}`}</span>
              {openDate && (
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => setDate([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={date}
                  className="date"
                  minDate={new Date()}
                />
              )}
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">Min price</span>
                  <input type="number" className="lsOptionInput" onChange={(e) => setMin(e.target.value)} />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Max price</span>
                  <input type="number" className="lsOptionInput" onChange={(e) => setMax(e.target.value)} />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    value={options.adult}
                    onChange={(e) => setOptions({ ...options, adult: e.target.value })}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    value={options.children}
                    onChange={(e) => setOptions({ ...options, children: e.target.value })}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    value={options.room}
                    onChange={(e) => setOptions({ ...options, room: e.target.value })}
                    className="lsOptionInput"
                  />
                </div>
              </div>
            </div>
            <button onClick={handleSearch}>Search</button>
          </div>
          <div className="listResult">
            {loading ? (
              "Loading please wait"
            ) : (
              data?.map((item) => (
                <div key={item._id}>
                  <SearchItem item={item} state={{ destination, date, options }} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
