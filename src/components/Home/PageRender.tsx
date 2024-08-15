import { ReactElement } from "react";
import { HomePageContent } from "./LandingPage";
import AboutUs from "../AboutUs";
import ContactUs from "../ContactUs";
import { Outlet } from "react-router-dom";
import UserJobRooms from "../User/Job/UserJobRooms";

const PageRender: (selected: string) => ReactElement = (selected) => {
    const pageComponents: { [key: string]: ReactElement } = {
        'Home': <HomePageContent />,
        'About Us': <AboutUs />,
        'Contact Us': <ContactUs />,
        'Career': <Outlet />,
        'Room book': <UserJobRooms/>
    }

    return pageComponents[selected] || <HomePageContent/>
};

export default PageRender;
