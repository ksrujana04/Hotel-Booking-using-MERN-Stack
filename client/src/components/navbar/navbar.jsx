import "./navbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBed,
    faCar,
    faPlane,
    faTaxi,
} from '@fortawesome/free-solid-svg-icons';
import {Link} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.js";

const Navbar = () => {

    const {user} = useContext(AuthContext);
    

    return (
        <div className="navbar">
            <div className="navbarContainer">
                <Link to="/" style={{color:"inherit",textDecoration:"none"}}>
                <span className="logo">BookUrTravel</span></Link>
                <div className="navbarList">
                    <div className="navListItem active">
                        <FontAwesomeIcon icon={faBed} />
                        <span>Stays</span>
                    </div>
                    <div className="navListItem">
                        <FontAwesomeIcon icon={faPlane} />
                        <span>Flights</span>
                    </div>
                    <div className="navListItem">
                        <FontAwesomeIcon icon={faCar} />
                        <span>Car rentals</span>
                    </div>
                    <div className="navListItem">
                        <FontAwesomeIcon icon={faBed} />
                        <span>Attractions</span>
                    </div>
                    <div className="navListItem">
                        <FontAwesomeIcon icon={faTaxi} />
                        <span>Airport taxis</span>
                    </div>
                    {user ? user.username :<div className="navButtons">
                    <button className="navButton">Register</button>
                    <button className="navButton">Login</button>
                    </div>}
                </div>
            </div>
        </div>
    )
};

export default Navbar;