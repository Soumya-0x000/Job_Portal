import { useCallback, useEffect, useRef, useState } from "react";
import { Loading } from "../../../common/Loading";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { initialValue, UserJobRoomTable } from "./UserJobRoomTable";
import { URL } from "../../../API";
import axios from "axios";
import { showToastMsg } from "../../../common/ToastMsg";
import { userBookings } from "../AllUserTypes";
import RoomNumDtFilter from "../../../common/RoomNumDtFilter";
import { DialogComponent } from "../../../common/DialogComponent";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import Dropdown from "../Dropdown";
import { toast } from "react-toastify";

const initialRoomState: userBookings[] = [
    {
        roomName: '',
        roomNumber: NaN,
        bookingDate: '',
        bookingId: '',
        bookingStatus: 'upcoming'
    }
];

const filterItems = [ 
    {
        label: 'All data',
        value: 'allTotal',
    }, {
        label: 'Room Number',
        value: 'roomNumber',
    }, {
        label: 'Room number + date',
        value: 'roomNumberNDate',
    }
]

export const initialPaginationVal = {
    limit: 10,
    offset: 0
}

const UserJobRooms = () => {
    const [rooms, setRooms] = useState<userBookings[]>(initialRoomState);
    const [loading, setLoading] = useState<boolean>(true);
    const [fetchingMode, setFetchingMode] = useState<string>('');
    const [showInputs, setShowInputs] = useState<boolean>(false);
    const [filteringData, setFilteringData] = useState<typeof initialValue>(initialValue);
    const [roomNumDDopen, setRoomNumDDopen] = useState<boolean>(false);
    const [isCheckingAvail, setIsCheckingAvail] = useState<boolean>(false);
    const [adminToken, setAdminToken] = useState<string>('');
    const [paginationData, setPaginationData] = useState<typeof initialPaginationVal>(initialPaginationVal);
    const toastShown = useRef<boolean>(false);
    // const [isPgLoaded, setIsPgLoaded] = useState<boolean>(false);

    useEffect(() => {
        const userDetail = localStorage.getItem('userDetails') || '{}';
        const authToken = JSON.parse(userDetail)?.token;

        if (authToken) {
            setAdminToken(authToken)
            fetchBookingDetails('room-booking/getBookingDetails', authToken);
        } else {
            showToastMsg('Authentication token is missing');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (loading) {
                showToastMsg('Loading is taking too long');
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [loading]);

    const fetchBookingDetails = async (endpoint: string, authToken?: string) => {
        try {
            const finalUrl = `${URL}/${endpoint}`
            const rqstHeader = {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '69420',
                authorization: `token ${authToken || adminToken}`
            }

            const response = await axios.get(finalUrl, { headers: rqstHeader });
            if (response.status === 200) {
                if(response.data.data === null) showToastMsg(response.data.message)
                else setRooms(response.data.data.bookings);
            } else showToastMsg('Failed to fetch booking details');
        } catch (error: unknown) {
            if (!toastShown.current) {
                if (axios.isAxiosError(error)) {
                    const errorMessage = error.response?.data?.message || error.message;
                    showToastMsg(errorMessage);
                } else showToastMsg('An unexpected error occurred');
                toastShown.current = true; 
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        switch(fetchingMode) {
            case 'roomNumber':
                if(filteringData.roomNumber) setIsCheckingAvail(true)
                break;
            case 'roomNumberNDate':
                if(filteringData.roomNumber && filteringData.bookingDate) setIsCheckingAvail(true)
                break;
            default:
                setIsCheckingAvail(false)
                break;
        }
    }, [filteringData]);

    const handleMenuSelection = useCallback((value: string) => {
        setFetchingMode(value);
        setShowInputs(true);
        setRoomNumDDopen(true);
        console.log(value);
    }, []);

    const handleRoomSelection = (roomNumber: number) => {
        setFilteringData(prev => ({
            ...prev, roomNumber
        }))
    }

    const handleDateSelection = (bookingDate: Dayjs | null) => {
        setFilteringData(prev => ({
            ...prev, bookingDate
        }));
    };

    const fetchConditionalData = () => {
        switch(fetchingMode) {
            case 'allTotal':
                fetchBookingDetails(`room-booking/getRoomDetails`);
                break;
            case 'roomNumber':
                if(filteringData.roomNumber) {
                    const newURL = `room-booking/getRoomDetails?roomNumber=${filteringData.roomNumber}`
                    fetchBookingDetails(newURL);
                } else showToastMsg('Enter a room number first')
                break;
            case 'roomNumberNDate':
                if(filteringData.roomNumber && filteringData.bookingDate) {
                    const newURL = `room-booking/getRoomDetails?roomNumber=${filteringData.roomNumber}&date=${filteringData.bookingDate.format('YYYY-MM-DD')}`
                    fetchBookingDetails(newURL);
                } else showToastMsg('Enter a room number and date first')
                break;
            default:
                showToastMsg('Select a valid filtering mode')
                break;
        }

        setShowInputs(false)
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="bg-slate-400 h-screen w-screen">
                {loading ? (
                    <Loading />
                ) : (
                    <div className="w-full h-screen ring flex items-center flex-col pt-32 pb-10 px-3 md:px-5 xl:px-8 overflow-y-scroll">
                        {!loading ? (<>
                            <UserJobRoomTable 
                                rooms={rooms} 
                                setRooms={setRooms}
                                setPaginationData={setPaginationData}
                            />

                            <RoomNumDtFilter
                                filterItems={filterItems}
                                handleMenuSelection={handleMenuSelection}
                            />
                        </>) : (
                            <div>

                            </div>
                        )}
                    </div>
                )}
            </div>

            {fetchingMode !== 'allTotal' && (
                <DialogComponent
                open={showInputs}
                setOpen={setShowInputs}>
                    <>
                        <div className=" flex flex-col gap-5 p-4 h-96">
                            {fetchingMode === 'roomNumberNDate' && (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer
                                        components={[
                                            "DatePicker",
                                            "DatePicker",
                                            "DatePicker",
                                        ]}
                                    >
                                        <DatePicker
                                            label="Booking date"
                                            name="startDate"
                                            onChange={(date) => handleDateSelection(date)}
                                            minDate={dayjs()}
                                            value={filteringData?.bookingDate}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            )}

                            <Dropdown
                                mode={'user'}
                                heading={"Room number"}
                                open={roomNumDDopen}
                                roomSelection={handleRoomSelection}
                                availData={{}}
                                roomNum={filteringData.roomNumber}
                            />
                        </div>

                        <div className=" flex items-center justify-between gap-4 p-2 font-robotoMono font-bold">
                            <button
                                className={`${
                                    !isCheckingAvail
                                        ? " cursor-not-allowed bg-indigo-700"
                                        : "active:scale-95 transition-all cursor-pointer bg-green-300 text-green-950"
                                } w-full p-2 rounded-lg text-blue-200`}
                                onClick={fetchConditionalData}
                                disabled={!isCheckingAvail}
                            >
                                Check
                            </button>

                            <button
                                className="w-full p-2 rounded-lg bg-red-950 text-red-200 active:scale-95 transition-all"
                                onClick={() => {
                                    setShowInputs(false)
                                    setFilteringData(initialValue)
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </>
                </DialogComponent>
            )}
        </LocalizationProvider>
    );
};

export default UserJobRooms;
