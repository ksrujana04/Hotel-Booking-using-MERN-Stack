import React from "react";
import "./home.css";
import Navbar from "../../components/navbar/navbar.jsx"
import HeaderSearch from "../../components/headerSearch/headerSearch.jsx";
import Featured from "../../components/featured/featured.jsx"
import PropertyList from "../../components/propertyList/propertyList.jsx";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties.jsx"
import MailList from "../../components/mailList/mailList.jsx";
import Footer from "../../components/footer/Footer.jsx"
const Home = () => {
    return <div>
        <Navbar />
        <HeaderSearch />
        <div className="homeContainer">
            <Featured />
            <h1 className="homeTitle">Browsed by property types </h1>
            <PropertyList />
            <h1 className="homeTitle">Home guests love </h1>
            <FeaturedProperties />
            <MailList />
            <Footer/>
        </div>
        </div>
};

export default Home;