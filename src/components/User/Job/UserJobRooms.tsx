import { useEffect, useState } from "react";
import { Loading } from "../../../common/Loading";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Room, UserJobRoomTable } from "./UserJobRoomTable";
import { URL } from "../../../API";
import axios from "axios";

const UserJobRooms = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const userDetail = localStorage.getItem('userDetails') || '[]'
        const authToken = JSON.parse(userDetail).token
        fetchBookingDetails(authToken)
    }, []);
    
    const fetchBookingDetails: (authToken: string) => void = async(authToken) => {
        const response = await axios.get(`${URL}/room-booking/getBookingDetails`, {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '69420',
                authorization: `token ${authToken}`
            }
        });
        setLoading(false);
        
        if (response.status === 200) setRooms(response.data);
    };

    const tableHeadName = [ 'Booking date', 'Room Name', 'Room Number' ]

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="bg-slate-400 h-screen w-screen">
                {loading ? (
                    <Loading />
                ) : (
                    <div className="w-full h-screen ring flex items-center flex-col pt-32 pb-10 px-3 md:px-5 xl:px-8 overflow-y-scroll">
                        <UserJobRoomTable 
                            rooms={rooms} 
                            setRooms={setRooms}
                            tableHeaders={tableHeadName}
                        />
                    </div>
                )}
            </div>
        </LocalizationProvider>
    );
};

export default UserJobRooms;
