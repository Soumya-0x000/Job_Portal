import { useEffect, useRef, useState } from "react";
import { Loading } from "../../../../common/Loading";
import { IoIosAdd } from "react-icons/io";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import axios from "axios";
import { URL } from "../../../../API";
import { showToastMsg } from "../../../../common/ToastMsg";
import { AdminJobRoomTable } from "./AdminJobRoomTable";
import { DialogComponent } from "../../../../common/DialogComponent";
import { Menu, MenuProps } from "@mui/material";
import styled from "styled-components";
import Dropdown from "../../../User/Dropdown";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { initialValue } from "../../../User/Job/UserJobRoomTable";
import RoomNumDtFilter from "../../../../common/RoomNumDtFilter";

const validationSchema = Yup.object({
    roomName: Yup.string().required("Required"),
    seatCapacity: Yup.number().required("Required").positive().integer(),
    roomNumber: Yup.number().required("Required").positive().integer(),
});

export type roomType = {
    roomName: string;
    seatCapacity: number;
    roomNumber: number;
    totalBookings?: 0;
    bookingLimit?: 8;
    bookingOffset?: 0;
};

export const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "right",
        }}
        {...props}
    />
))(() => ({
    "& .MuiPaper-root": {
        borderRadius: 6,
        minWidth: 180,
        boxShadow:
            "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
        "& .MuiMenu-list": {
            padding: "4px 0",
        },
    },
}));

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

export type adminPaginationType = {
    totalRooms: number;
    limit: number;
    offset: number;
};

const initialPaginationData = {
    totalRooms: 0,
    limit: 10,
    offset: 0,
};

export type bookingPaginationType = {
    totalBookings: number;
    bookingLimit: number;
    bookingOffset: number;
};

export const initialBookingsData = {
    totalBookings: 0,
    bookingLimit: 8,
    bookingOffset: 0,
};

const AdminRooms = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [roomNumDDopen, setRoomNumDDopen] = useState<boolean>(false);
    const [showInputs, setShowInputs] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true); //make it false for testing
    const [isCheckingAvail, setIsCheckingAvail] = useState<boolean>(false);
    // const [token, setToken] = useState<string>("");
    const [rooms, setRooms] = useState<roomType[]>([]);
    const [fetchingMode, setFetchingMode] = useState<string>(
        filterItems[0].value
    );
    const [filteringData, setFilteringData] =
        useState<typeof initialValue>(initialValue);
    const [paginationData, setPaginationData] = useState<adminPaginationType>(
        initialPaginationData
    );
    const [bookingPaginationData, setBookingPaginationData] =
        useState<bookingPaginationType>(initialBookingsData);
    const [isRoomBooked, setIsRoomBooked] = useState<boolean>(false);
    const [noBookings, setNoBookings] = useState<boolean>(false);
    const toastRef = useRef(true);

    const primaryURL = () =>
        `room-booking/get-room-details?limit=${paginationData.limit}&offset=${paginationData.offset}&bookingLimit=${bookingPaginationData.bookingLimit}&bookingOffset=${bookingPaginationData.bookingOffset}`;
    const handleClose = () => setOpen(false);

    const adminToken = () => (JSON.parse(localStorage.getItem("adminDetails") || ""))?.token;

    const dialogInputs = [
        { id: "seatCapacity", type: "number", placeholder: "Room Capacity" },
        { id: "roomNumber", type: "number", placeholder: "Room Number" },
        { id: "roomName", type: "text", placeholder: "Room Name" },
    ];

    const handleCreateRoom = async (value: roomType) => {
        const response = await axios.post(
            `${URL}/room-booking/create-room`,
            value,
            {
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "69420",
                    authorization: `token ${adminToken()}`,
                },
            }
        );
        if (response?.status === 201) {
            setIsRoomBooked(true);
        }

        handleClose();

        if (response && response.data.data.data)
            setRooms((prev) => [...prev, response.data.data.data]);
    };

    useEffect(() => {
        if (fetchingMode === "allTotal") {
            setTimeout(() => {
                setPaginationData(initialPaginationData);
                fetchConditionalData();
            }, 150);
        }
    }, [fetchingMode]);

    const getRoomDetails: (endPoint: string) => void = async (endPoint) => {        
        const requestHeader = {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
            authorization: `token ${adminToken()}`,
        };

        const finalURL = `${URL}/${endPoint}`;

        try {
            const { data, status } = await axios.get(finalURL, {
                headers: requestHeader,
            });
            if (status === 200) {
                if (!data.data) {
                    setNoBookings(true);
                    setLoading(false);
                    return;
                }

                setPaginationData((prev) => ({
                    ...prev,
                    totalRooms: data?.data?.totalRooms,
                    limit: data?.data?.limit || 10,
                    offset: data?.data?.offset,
                }));

                setRooms(data?.data?.rooms || []);
                setLoading(false);
                toastRef.current = true;
            } else if (toastRef.current) {
                setLoading(false)
                showToastMsg("Failed to fetch room details");
                toastRef.current = false;
            }
        } catch (error: unknown) {
            if (toastRef.current) {
                if (axios.isAxiosError(error)) {
                    showToastMsg(
                        error.response?.data?.message || error.message
                    );
                    toastRef.current = false;
                } else if (error instanceof Error) {
                    showToastMsg(error.message);
                    toastRef.current = false;
                } else {
                    console.error(
                        "An unknown error occurred while fetching room details"
                    );
                    toastRef.current = false; 
                }
            }
        }
    };

    const handleMenuSelection: (item: string) => void = (item) => {
        setShowInputs(true);
        setFetchingMode(item);
        setRoomNumDDopen(true);
    };

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

    const fetchConditionalData = () => {
        switch (fetchingMode) {
            case "allTotal":
                getRoomDetails(primaryURL());
                break;
            case "roomNumber":
                if (filteringData.roomNumber) {
                    const newURL = `${primaryURL()}&roomNumber=${
                        filteringData.roomNumber
                    }`;
                    getRoomDetails(newURL);
                } else showToastMsg("Enter a room number first");
                break;
            case "roomNumberNDate":
                if (filteringData.roomNumber && filteringData.bookingDate) {
                    const newURL = `${primaryURL()}&roomNumber=${
                        filteringData.roomNumber
                    }&date=${filteringData.bookingDate.format("YYYY-MM-DD")}`;
                    getRoomDetails(newURL);
                } else showToastMsg("Enter a room number and date first");
                break;
            default:
                showToastMsg("Select a valid filtering mode");
                break;
        }

        setShowInputs(false);
    };

    useEffect(() => {
        primaryURL();
        fetchConditionalData();
    }, [paginationData.offset, bookingPaginationData.bookingOffset]);

    return (
        <div className="flex items-center justify-center overflow-y-auto px-4 pt-20 pb-6">
            {loading ? (
                <div className=" absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Loading />
                </div>
            ) : (
                <>
                    {noBookings ? (
                        <div className=" w-full h-full flex items-center justify-center pt-16">
                            <iframe
                                src="https://lottie.host/embed/eb65fabc-2cf5-423d-8e2b-5565df8f2b3f/ufOHvLNO9d.json"
                                className="w-[30rem] aspect-square"
                            />
                        </div>
                    ) : (
                        <div className=" w-full h-fit flex items-center flex-col">
                            <AdminJobRoomTable
                                rooms={rooms}
                                setPaginationData={setPaginationData}
                                paginationData={paginationData}
                                setBookingPaginationData={
                                    setBookingPaginationData
                                }
                                bookingPaginationData={bookingPaginationData}
                            />
                        </div>
                    )}
                </>
            )}

            <>
                <button
                    className=" fixed bottom-3 left-20 bg-blue-900 rounded-full aspect-square w-10 flex items-center justify-center hover:rotate-90 transition-all duration-500 active:scale-90 group z-40 ring-[1px] ring-slate-400"
                    onClick={() => setOpen(true)}
                >
                    <IoIosAdd className=" w-10 h-10 text-blue-300 group-active:scale-125 transition-all duration-500" />
                </button>

                <RoomNumDtFilter
                    filterItems={filterItems}
                    handleMenuSelection={handleMenuSelection}
                />
            </>

            {/* create room */}
            <DialogComponent open={open} setOpen={setOpen}>
                {/* <div className="flex items-center justify-center bg-gradient -to-br from-slate-800 to-slate-900"> */}
                <div className="flex flex-col w-full justify-center items-center">
                    <Formik
                        initialValues={{
                            roomName: "",
                            seatCapacity: NaN,
                            roomNumber: NaN,
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values: roomType) =>
                            handleCreateRoom(values)
                        }
                    >
                        <Form className="bg-slate-700 shadow-2xl p-5">
                            <h1 className="text-gray-300 font-bold text-2xl mb-1">
                                Create Room
                            </h1>
                            <p className="text-sm font-normal text-gray-100 mb-8">
                                Enter room details
                            </p>

                            {/* input fields */}
                            <div className="grid md:grid-cols-2 gap-1">
                                {dialogInputs.map(
                                    ({ id, type, placeholder }) => (
                                        <div
                                            key={id}
                                            className={`flex items-center px-2 pb-2 rounded-lg ${
                                                id === "roomName"
                                                    ? " col-span-2"
                                                    : ""
                                            } flex flex-col-reverse items-start justify-start relative`}
                                        >
                                            <Field
                                                id={id}
                                                name={id}
                                                className="peer w-full bg-slate-800 pl-3 text-slate-200 border-none outline-none focus:outline-none rounded-lg py-2"
                                                type={type}
                                            />
                                            <label
                                                className={` text-blue-300 w-full pl-1 pb-1 text-sm peer-focus-within:font-bold peer-focus-within:text-green-300 transition-all font-mono tracking-wider`}
                                                htmlFor={id}
                                            >
                                                {placeholder}
                                            </label>
                                        </div>
                                    )
                                )}
                            </div>

                            {/* create, cancel button */}
                            <div className="flex items-center justify-between mt-8 gap-x-3">
                                <button
                                    type="submit"
                                    className=" px-3 py-1.5 w-1/2 rounded-lg bg-green-800 text-green-300 hover:bg-green-200 hover:text-green-800 transition-all font-semibold"
                                >
                                    Create Room
                                </button>

                                <button
                                    onClick={handleClose}
                                    className=" transition-all px-3 py-1.5 w-1/2 font-semibold bg-red-800 hover:bg-red-200 hover:text-red-900 text-red-200 rounded-lg"
                                >
                                    Cancel
                                </button>
                            </div>
                        </Form>
                    </Formik>
                </div>
                {/* </div> */}
            </DialogComponent>

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
                                            minDate={dayjs()}
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

            <DialogComponent open={isRoomBooked} setOpen={setIsRoomBooked}>
                <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                    <div className="relative p-4 text-center bg-white rounded-lg dark:bg-gray-800 sm:p-5 flex flex-col items-center">
                        <iframe
                            src="https://lottie.host/embed/5c0ead23-2703-484c-a294-f337deb405ad/XqrOrpWTsf.json"
                            className=" mb-2.5"
                        />

                        <p className="mb-5 text-[1.15rem] font-semibold text-gray-900 dark:text-white font-mavenPro">
                            Room Created Successfully!
                        </p>

                        <div
                            data-modal-toggle="successModal"
                            className="py-2.5 px-3 cursor-pointer text-sm font-medium text-center text-white rounded-lg bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-900 font-robotoMono flex items-center justify-center w-fit"
                            onClick={() => setIsRoomBooked(false)}
                        >
                            Continue
                        </div>
                    </div>
                </div>
            </DialogComponent>
        </div>
    );
};

export default AdminRooms;
