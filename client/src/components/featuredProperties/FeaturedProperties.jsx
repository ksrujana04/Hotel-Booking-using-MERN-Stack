import "./featuredProperties.css";
import useFetch from "../../hooks/useFetch.js";
import {Link} from "react-router-dom";

const FeaturedProperties = () => {
  const {data,loading,error} = useFetch("hotels?featured=true&limit=4");
  return (
    <div className="fp">
      {loading ? ("Loading please wait") : (<>
      {data.map((item)=>(
        <Link to={`/hotels/${item._id}`}  style={{color:"inherit",textDecoration:"none"}}>
        <div className="fpItem" key={item._id}>
        <img
          src={item.photos[0]}
          alt=""
          className="fpImg"
        />
        <span className="fpName">{item.name}</span>
        <span className="fpCity">{item.city}</span>
        <span className="fpPrice">Starting from ${item.cheapestPrice}</span>
        {item.rating && <div className="fpRating">
          <button>{item.rating}</button>
          <span>Excellent</span>
        </div>}
      </div> </Link>))}</>)}
      </div> )
}

export default FeaturedProperties;
