import { useEffect, useState } from "react";
import { UserBooking, userBookingPaginationType } from "../../AdminDataTypes";
import { initialValue } from "../../../User/Job/UserJobRoomTable";
import { Dayjs } from "dayjs";
import { showToastMsg } from "../../../../common/ToastMsg";
import axios from "axios";
import { URL } from "../../../../API";
import { DialogComponent } from "../../../../common/DialogComponent";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Dropdown from "../../../User/Dropdown";
import { Loading } from "../../../../common/Loading";
import RoomNumDtFilter from "../../../../common/RoomNumDtFilter";
import { BookingTable } from "./BookingTable";

const initialBookings: UserBooking = {
    username: '',
    email: ''
};

const filterItems = [ 
    {
        label: 'All data',
        value: 'allTotal',
    }, 
    {
        label: 'Room Number',
        value: 'roomNumber',
    }, 
    {
        label: 'Room number + date',
        value: 'roomNumberNDate',
    }
]

export const initialUserBookingsData = {
    totalBookings: 0,
    bookingLimit: 0,
    bookingOffset: 0
}

const initialPaginateData = {
    totalUsers: 0,
    limit: 10,
    offset: 0
}

const UserBookings = () => {
    const [bookings, setBookings] = useState<UserBooking[]>([initialBookings]);
    const [fetchingMode, setFetchingMode] = useState<string>(filterItems[0].value);
    const [showInputs, setShowInputs] = useState<boolean>(false);
    const [roomNumDDopen, setRoomNumDDopen] = useState<boolean>(false);
    const [filteringData, setFilteringData] = useState<typeof initialValue>(initialValue);
    const [paginationData, setPaginationData] = useState<userBookingPaginationType>(initialPaginateData);
    const [loading, setLoading] = useState<boolean>(true);
    const [isCheckingAvail, setIsCheckingAvail] = useState<boolean>(false);
    const [isMoreData, setIsMoreData] = useState<boolean>(false);

    const primaryURL: () => string = () =>
        `room-booking/get-booking-details?limit=${paginationData.limit}&offset=${paginationData.offset}`;

    const handleMenuSelection: (item: string) => void = (item) => {
        setShowInputs(true)
        setFetchingMode(item)
        setRoomNumDDopen(true)
    };

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

    const getBookingDetails: (endPoint: string) => void = async(endPoint) => {
        const admin = JSON.parse(localStorage.getItem('adminDetails') || '');

        const requestHeader = {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420',
            authorization: `token ${admin?.token}`,
        }

        const finalURL = `${URL}/${endPoint}`

        try {
            const { data, status } = await axios.get(finalURL, { headers: requestHeader });

            if (status === 200) {
                const { totalUsers, limit, offset } = data.data
                setPaginationData(prev => ({
                    ...prev, 
                    totalUsers, limit, offset
                }))

                const moreData = totalUsers - limit
                setIsMoreData(moreData > 0 ? true : false)

                setBookings(data?.data?.allUserBookings || [])
                setLoading(false);
            } else showToastMsg('Failed to fetch room details')
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) showToastMsg("No bookings for this day");
            else if (error instanceof Error) showToastMsg("No bookings for this day");
            else console.error('An unknown error occurred while fetching room details');
        }
    };

    const fetchConditionalData = () => {
        switch(fetchingMode) {
            case 'allTotal':
                setPaginationData(initialPaginateData);
                getBookingDetails(primaryURL());
                break;
            case 'roomNumber':
                if (filteringData.roomNumber) {
                    setPaginationData(initialPaginateData);
                    const newURL = `${primaryURL()}&roomNumber=${filteringData.roomNumber}`
                    getBookingDetails(newURL);
                } else showToastMsg('Enter a room number first')
                break;
            case 'roomNumberNDate':
                if(filteringData.roomNumber && filteringData.bookingDate) {
                    setPaginationData(initialPaginateData);
                    const newURL = `${primaryURL()}&roomNumber=${filteringData.roomNumber}&date=${filteringData.bookingDate.format('YYYY-MM-DD')}`
                    getBookingDetails(newURL);
                } else showToastMsg('Enter a room number and date first')
                break;
            default:
                showToastMsg('Select a valid filtering mode')
                break;
        }

        setShowInputs(false)
    }

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

    useEffect(() => {
        if (fetchingMode === "allTotal") {
            primaryURL();
            fetchConditionalData()
        }
    }, [fetchingMode, paginationData.offset]);

    useEffect(() => {
        if (fetchingMode !== "allTotal") {
            console.log('second')
            const newURL = `${primaryURL()}&roomNumber=${
                filteringData.roomNumber
            }`;
            getBookingDetails(newURL);
        }
    }, [paginationData.offset]);

    return (
        <div>
            {loading ? (
                <div className=" w-full h-full flex items-center justify-center bg-black">
                    <Loading />
                </div>
            ) : (
                <div className=" w-full h-fit flex items-center flex-col pt-16">
                    <BookingTable
                        bookings={bookings}
                        setPaginationData={setPaginationData}
                        paginationData={paginationData}
                        isMoreData={isMoreData}
                    />
                </div>
            )}

            <RoomNumDtFilter
                filterItems={filterItems}
                handleMenuSelection={handleMenuSelection}
            />

            {/* conditional room */}
            {fetchingMode !== "allTotal" && (
                <DialogComponent open={showInputs} setOpen={setShowInputs}>
                    <>
                        <div className=" flex flex-col gap-5 p-4 h-96">
                            {fetchingMode === "roomNumberNDate" && (
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
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
                                            onChange={(date) =>
                                                handleDateSelection(date)
                                            }
                                            value={filteringData?.bookingDate}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            )}

                            <Dropdown
                                mode={"admin"}
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
                                    setShowInputs(false);
                                    setFilteringData(initialValue);
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </>
                </DialogComponent>
            )}
        </div>
    );
}

export default UserBookings;
