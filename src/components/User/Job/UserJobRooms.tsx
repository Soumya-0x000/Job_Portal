import { useCallback, useEffect, useRef, useState } from "react";
import { Loading } from "../../../common/Loading";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
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

const initialRoomState: userBookings[] = [
    {
        roomName: "",
        roomNumber: NaN,
        bookingDate: "",
        bookingId: "",
        bookingStatus: "upcoming",
    },
];

type roomNumBooking = {
    bookingDate: string;
    bookingId: string;
    bookingStatus: string;
};

type roomNumBookingArr = {
    roomName: string;
    roomNumber: number;
    bookings: roomNumBooking[];
};

const filterItems = [
    {
        label: "All data",
        value: "allTotal",
    },
    {
        label: "Room Number",
        value: "roomNumber",
    },
    {
        label: "Room number + date",
        value: "roomNumberNDate",
    },
];

export type paginationType = {
    limit: number;
    offset: number;
};

export const initialPaginationVal: paginationType = {
    limit: 10,
    offset: 0,
};

const UserJobRooms = () => {
    const [rooms, setRooms] = useState<userBookings[]>(initialRoomState);
    const [loading, setLoading] = useState<boolean>(true);
    const [fetchingMode, setFetchingMode] = useState<string>("allTotal");
    const [showInputs, setShowInputs] = useState<boolean>(false);
    const [filteringData, setFilteringData] =
        useState<typeof initialValue>(initialValue);
    const [roomNumDDopen, setRoomNumDDopen] = useState<boolean>(false);
    const [isCheckingAvail, setIsCheckingAvail] = useState<boolean>(false);
    const [adminToken, setAdminToken] = useState<string>(
        JSON.parse(localStorage.getItem("userDetails") || "{}")?.token
    );
    const [paginationData, setPaginationData] =
        useState<paginationType>(initialPaginationVal);
    const [moreData, setMoreData] = useState<boolean>(true);
    const [dataCount, setDataCount] = useState<{
        totalBookings: number;
        limit: number;
    }>({
        totalBookings: 0,
        limit: 0,
    });

    const toastShown = useRef<boolean>(false);

    const primaryEndpoint = (limit: number, offset: number) =>
        `room-booking/get-booking-details?limit=${limit}&offset=${offset}`;

    useEffect(() => {
        const userDetail = localStorage.getItem("userDetails") || "{}";
        const authToken = JSON.parse(userDetail)?.token;

        if (authToken) setAdminToken(authToken);
        else {
            showToastMsg("Authentication token is missing");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (loading) {
                showToastMsg("Loading is taking too long");
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [loading]);

    const fetchBookingDetails = async (endpoint: string) => {
        try {
            const finalUrl = `${URL}/${endpoint}`;
            const rqstHeader = {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "69420",
                authorization: `token ${adminToken}`,
            };

            const { data, status } = await axios.get(finalUrl, {
                headers: rqstHeader,
            });

            if (status === 200) {
                if (data.data === null) showToastMsg(data.message);
                else {
                    const mainData = data.data;
                    setDataCount({
                        totalBookings: mainData.totalBookings,
                        limit: mainData.limit,
                    });
                    const isMoreData = mainData.totalBookings - mainData.limit;
                    setMoreData(isMoreData > 0 ? true : false);

                    const formatRoomData = (
                        data: userBookings[] | roomNumBookingArr
                    ): userBookings[] => {
                        if (Array.isArray(data)) {
                            return data.map((room) => ({
                                roomName: room.roomName,
                                roomNumber: room.roomNumber,
                                bookingDate: room.bookingDate,
                                bookingId: room.bookingId,
                                bookingStatus: room.bookingStatus as
                                    | "upcoming"
                                    | "past",
                            }));
                        } else {
                            return data.bookings.map((booking) => ({
                                roomName: data.roomName,
                                roomNumber: data.roomNumber,
                                bookingDate: booking.bookingDate,
                                bookingId: booking.bookingId,
                                bookingStatus: booking.bookingStatus as
                                    | "upcoming"
                                    | "past",
                            }));
                        }
                    };

                    if (fetchingMode === "allTotal") {
                        const formattedRooms = formatRoomData(
                            mainData.bookings as userBookings[]
                        );
                        setRooms(formattedRooms);
                    } else if (fetchingMode === 'roomNumber'){
                        const formattedRoom = formatRoomData(
                            mainData as roomNumBookingArr
                        );
                        setRooms(formattedRoom);
                    } else {
                        const formattedRoom = formatRoomData(
                            [mainData] as userBookings[]
                        );
                        setRooms(formattedRoom);
                    }
                }
            } else showToastMsg("Failed to fetch booking details");
        } catch (error: unknown) {
            if (!toastShown.current) {
                if (axios.isAxiosError(error)) {
                    const errorMessage =
                        error.response?.data?.message || error.message;
                    showToastMsg(errorMessage);
                } else showToastMsg("An unexpected error occurred");
                toastShown.current = true;
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fetchingMode === "allTotal") {
            const createURL = primaryEndpoint(
                initialPaginationVal.limit,
                initialPaginationVal.offset
            );
            fetchBookingDetails(createURL);
        }
    }, [fetchingMode]);

    useEffect(() => {
        switch (fetchingMode) {
            case "roomNumber":
                if (filteringData.roomNumber) setIsCheckingAvail(true);
                break;
            case "roomNumberNDate":
                if (filteringData.roomNumber && filteringData.bookingDate)
                    setIsCheckingAvail(true);
                break;
            default:
                setIsCheckingAvail(false);
                break;
        }
    }, [filteringData]);

    const handleMenuSelection = useCallback((value: string) => {
        setFetchingMode(value);
        setShowInputs(true);
        setRoomNumDDopen(true);
    }, []);

    const handleRoomSelection = (roomNumber: number) => {
        setFilteringData((prev) => ({
            ...prev,
            roomNumber,
        }));
    };

    const handleDateSelection = (bookingDate: Dayjs | null) => {
        setFilteringData((prev) => ({
            ...prev,
            bookingDate,
        }));
    };

    const fetchConditionalData = (createdURL: string) => {
        switch (fetchingMode) {
            case "allTotal":
                fetchBookingDetails(createdURL);
                break;
            case "roomNumber":
                if (filteringData.roomNumber) {
                    const newURL = `${createdURL}&roomNumber=${filteringData.roomNumber}`;
                    fetchBookingDetails(newURL);
                } else showToastMsg("Enter a room number first");
                break;
            case "roomNumberNDate":
                if (filteringData.roomNumber && filteringData.bookingDate) {
                    const newURL = `${createdURL}&roomNumber=${
                        filteringData.roomNumber
                    }&date=${filteringData.bookingDate.format("YYYY-MM-DD")}`;
                    fetchBookingDetails(newURL);
                } else showToastMsg("Enter a room number and date first");
                break;
            default:
                showToastMsg("Select a valid filtering mode");
                break;
        }

        setShowInputs(false);
    };

    useEffect(() => {
        if (moreData) {
            const createURL = primaryEndpoint(
                paginationData.limit,
                paginationData.offset
            );

            fetchConditionalData(createURL);
        }
    }, [paginationData.offset]);

    const handleCancelation = () => {
        setShowInputs(false);
        setFilteringData(initialValue);
    };

    const handleCheckClick = () => {
        const createURL = primaryEndpoint(
            paginationData.limit,
            paginationData.offset
        );
        fetchConditionalData(createURL);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="bg-slate-400 h-screen w-screen">
                {loading ? (
                    <Loading />
                ) : (
                    <div className="w-full h-screen ring flex items-center flex-col pt-32 pb-10 px-3 md:px-5 xl:px-8 overflow-y-scroll">
                        {!loading ? (
                            <>
                                <UserJobRoomTable
                                    rooms={rooms}
                                    setRooms={setRooms}
                                    setPaginationData={setPaginationData}
                                    moreData={moreData}
                                    paginationData={paginationData}
                                    dataCount={dataCount}
                                />

                                <RoomNumDtFilter
                                    filterItems={filterItems}
                                    handleMenuSelection={handleMenuSelection}
                                />
                            </>
                        ) : (
                            <div></div>
                        )}
                    </div>
                )}
            </div>

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
                                            minDate={dayjs()}
                                            value={filteringData?.bookingDate}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            )}

                            <Dropdown
                                mode={"user"}
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
                                onClick={handleCheckClick}
                                disabled={!isCheckingAvail}
                            >
                                Check
                            </button>

                            <button
                                className="w-full p-2 rounded-lg bg-red-950 text-red-200 active:scale-95 transition-all"
                                onClick={handleCancelation}
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
