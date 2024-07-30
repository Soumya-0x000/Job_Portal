import { ReactElement } from "react";
import { HomePageContent } from "./LandingPage";
import AboutUs from "../AboutUs";
import ContactUs from "../ContactUs";
import { Outlet } from "react-router-dom";

const PageRender: (selected: string) => ReactElement = (selected) => {
    switch (selected) {
        case 'Home':
            return <HomePageContent />;
        case 'About Us':
            return <AboutUs />;
        case 'Contact Us':
            return <ContactUs />;
        case 'Career':
            return <Outlet />;
        default:
            return <HomePageContent />;
    }
};

export default PageRender;