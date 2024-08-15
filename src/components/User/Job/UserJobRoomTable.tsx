import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DropdownMenu from "../Dropdown";
import axios from "axios";
import { URL } from "../../../API";
import { showToastMsg } from "../../../common/ToastMsg";
import { formatDateTime } from "../../../common/formatDateTime";
import { FaArrowRight } from "react-icons/fa6";
import { boolean } from "yup";
import { DialogComponent } from "../../../common/DialogComponent";
import { DataGrid, GridColDef, GridRowParams, GridToolbar } from '@mui/x-data-grid';
import { userBookings } from "../AllUserTypes";
import { useMediaQuery, useTheme } from '@mui/material';
import { initialPaginationVal } from "./UserJobRooms";

interface JobRoomTableProps {
    rooms: userBookings[];
    setRooms: Dispatch<SetStateAction<userBookings[]>>;
    setPaginationData: (paginationData: typeof initialPaginationVal) => void
}

export const initialValue = {
    bookingDate: undefined as Dayjs | null | undefined,
    roomNumber: NaN as number,
};

export const UserJobRoomTable: FC<JobRoomTableProps> = ({
    rooms,
    setRooms,
    setPaginationData
}) => {
    const [open, setOpen] = useState<boolean>(false);
    const [selectionDetails, setSelectionDetails] = useState<typeof initialValue>(initialValue);
    const [userToken, setUserToken] = useState<string>("");
    const [isBookingAvail, setIsBookingAvail] = useState<boolean>(false);
    const [isRoomBooked, setIsRoomBooked] = useState<boolean>(false);
    const [showBookingDetail, setShowBookingDetail] = useState<boolean>(false);
    const [availData, setAvailData] = useState<{
        seatCapacity: number;
        numberOfBookings: number;
        availableSeats: number;
    }>({
        seatCapacity: NaN,
        numberOfBookings: NaN,
        availableSeats: NaN,
    });
    const theme = useTheme();
    const isSmToMd = useMediaQuery(theme.breakpoints.between(640, 768));
    const isMdToLg = useMediaQuery(theme.breakpoints.between(768, 1024));
    const isLgToXl = useMediaQuery(theme.breakpoints.between(1024, 1280)); 
    const isLgTo2Xl = useMediaQuery(theme.breakpoints.between(1280, 1536));
    const isXlUp = useMediaQuery(theme.breakpoints.up(1536));

    const getColumnWidth = (defaultWidth: number) => {
        if (isSmToMd) return defaultWidth * 0.5;
        if (isMdToLg) return defaultWidth * 0.74;
        if (isLgToXl) return defaultWidth * 0.8; 
        if (isLgTo2Xl) return defaultWidth * 1.12;
        if (isXlUp) return defaultWidth * 1.26;
        return defaultWidth;
    };

    const columns: GridColDef[] = [
        { 
            field: 'bookingDate', 
            headerName: 'Booking Date', 
            flex: 1, 
            width: getColumnWidth(150),
            renderCell: (params) => (
                <div>{formatDateTime(params.value)}</div>
            ),
        },
        { field: 'roomName', headerName: 'Room Name', flex: 1, width: getColumnWidth(150) },
        { field: 'roomNumber', headerName: 'Room Number', flex: 1, width: getColumnWidth(150) },
        { field: 'bookingStatus', headerName: 'Booking Status', flex: 1, width: getColumnWidth(150) },
    ];

    const getRowClassName = (params: GridRowParams) => {
        const status = params.row.bookingStatus;
        return status === 'past' ? 'past-row' : 'upcoming-row';
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userDetails") || "");
        setUserToken(user?.token);
    }, []);

    const handleRoomBook = async () => {
        try {
            const newDetails = {
                ...selectionDetails,
                bookingDate:
                    selectionDetails.bookingDate &&
                    selectionDetails.bookingDate?.format("YYYY-MM-DD"),
            };
            const response = await axios.post(
                `${URL}/room-booking/book`,
                newDetails,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "69420",
                        authorization: `token ${userToken}`,
                    },
                }
            );

            if (response.status === 200) setIsRoomBooked(true);
            setIsBookingAvail(false);

            const { bookingDate, _id: bookingId, roomName, roomNumber } = response.data.data;
            setRooms(prev => ([
                ...prev, {
                    roomName,
                    roomNumber,
                    bookingDate,
                    bookingId,
                    bookingStatus: 'upcoming',
                }
            ]));
            setIsRoomBooked(true);
            handleCancelation();
        } catch (error) {
            if (axios.isAxiosError(error)) showToastMsg(error.response?.data?.message || error.message);
            else if (error instanceof Error) showToastMsg(error.message);
            else showToastMsg("An unknown error occurred");
            handleCancelation();
        }
    };

    const handleDateSelection = (bookingDate: Dayjs | null) => {
        setSelectionDetails({
            ...selectionDetails,
            bookingDate,
        });
    };

    const handleRoomSelection = (roomNumber: number) => {
        setSelectionDetails({
            ...selectionDetails,
            roomNumber,
        });
    };

    useEffect(() => {
        if (selectionDetails.bookingDate && selectionDetails.roomNumber) {
            setIsBookingAvail(true);
            checkRoomAvailability();
        }
    }, [selectionDetails]);

    const checkRoomAvailability = async () => {
        try {
            const dataParams = {
                roomNumber: selectionDetails.roomNumber,
                date:
                    selectionDetails.bookingDate instanceof dayjs
                        ? selectionDetails.bookingDate.format("YYYY-MM-DD")
                        : "",
            };

            const response = await axios.get(
                `${URL}/room-booking/booking-availability/${dataParams.roomNumber}/${dataParams.date}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "69420",
                        authorization: `token ${userToken}`,
                    },
                }
            );
            console.log(response)

            if (response?.data?.availableSeats > 0) {
                console.log(response.data)
                setAvailData(response?.data);
                setIsBookingAvail(true);
                setShowBookingDetail(true);
            }
        } catch (error) {
            if (axios.isAxiosError(error))
                console.error(
                    "Axios error fetching room details:",
                    error.response?.data?.message || error.message
                );
            else if (error instanceof Error)
                console.error("Error fetching room details:", error.message);
            else
                console.error("An unknown error occurred while fetching room details");
        }
    };

    const handleCancelation = () => {
        setSelectionDetails(initialValue);
        setIsBookingAvail(false);
        setOpen(false);
        setShowBookingDetail(false);
    };

    const demoUserRooms = [
        {
            "roomName": "Testing8",
            "roomNumber": 112,
            "bookingDate": "2024-08-18T18:30:00.000Z",
            "bookingId": "66b49a163bb303f4fc4fc962",
            "bookingStatus": "upcoming"
        }, {
            "roomName": "Testing8",
            "roomNumber": 112,
            "bookingDate": "2024-08-19T18:30:00.000Z",
            "bookingId": "66b9bb8b35a175b6a34be9a9",
            "bookingStatus": "upcoming"
        }, {
            "roomName": "Testing9",
            "roomNumber": 113,
            "bookingDate": "2024-08-21T00:00:00.000Z",
            "bookingId": "66b9e8a63a469136a13e67ae",
            "bookingStatus": "upcoming"
        }, {
            "roomName": "Testing10",
            "roomNumber": 123,
            "bookingDate": "2024-08-04T00:00:00.000Z",
            "bookingId": "66b9e8a6sgfbs4576513e67af",
            "bookingStatus": "past"
        }, {
            "roomName": "Testing11",
            "roomNumber": 124,
            "bookingDate": "2024-08-04T00:00:00.000Z",
            "bookingId": "66b9e8a6sgfbs4576513e67ag",
            "bookingStatus": "upcoming"
        }, {
            "roomName": "Testing12",
            "roomNumber": 125,
            "bookingDate": "2024-08-04T00:00:00.000Z",
            "bookingId": "66b9e8a6sgfbs4576513e67he",
            "bookingStatus": "past"
        }, {
            "roomName": "Testing13",
            "roomNumber": 126,
            "bookingDate": "2024-08-04T00:00:00.000Z",
            "bookingId": "66b9e8a6sgfbs4576513i67ae",
            "bookingStatus": "past"
        }, {
            "roomName": "Testing14",
            "roomNumber": 127,
            "bookingDate": "2024-08-04T00:00:00.000Z",
            "bookingId": "66b9e8a6sgfbs4376513e67ae",
            "bookingStatus": "upcoming"
        }, {
            "roomName": "Testing15",
            "roomNumber": 128,
            "bookingDate": "2024-08-04T00:00:00.000Z",
            "bookingId": "66b9e8a6sgfbs45j6513e67ae",
            "bookingStatus": "past"
        }, {
            "roomName": "Testing16",
            "roomNumber": 129,
            "bookingDate": "2024-08-04T00:00:00.000Z",
            "bookingId": "66b9e8a6sgfbs45765gfdsdfhdstr3e67ae",
            "bookingStatus": "upcoming"
        }, {
            "roomName": "Testing17",
            "roomNumber": 130,
            "bookingDate": "2024-08-04T00:00:00.000Z",
            "bookingId": "66b9e8a6sgfbthaets4576513e67ae",
            "bookingStatus": "past"
        }, {
            "roomName": "Testing18",
            "roomNumber": 131,
            "bookingDate": "2024-08-04T00:00:00.000Z",
            "bookingId": "66b9e8a6sgfbs4576513e67gakenriotae",
            "bookingStatus": "upcoming"
        }
    ]

    const handlePaginationPgCount = (value) => {
        console.log(value)
    }

    return (
        <>
            <div className=" max-w-[100%] overflow-auto">
                <DataGrid
                    rows={demoUserRooms} // change to rooms
                    columns={columns}
                    onPaginationModelChange={handlePaginationPgCount}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[10, 20]}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: { showQuickFilter: true },
                    }}
                    sx={{
                        width: 1200,
                        '& .MuiDataGrid-toolbarContainer': {
                            marginBottom: 1,
                            paddingBottom: 1,
                            backgroundColor: 'rgb(201, 224, 255)',
                        },
                        '& .MuiDataGrid-columnHeader': {
                            backgroundColor: '#d0fdeb',
                        },
                        '& .MuiDataGrid-cell': {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '17px'
                        },
                        '& .MuiDataGrid-root': {
                            border: 'none',
                            outline: 'none'
                        },
                        '& .past-row': {
                            border: 'none',
                            backgroundColor: '#037346',
                            color: '#e0fefc',
                            '&:hover': {
                                backgroundColor: '#42b084',
                                color: '#ffffff', 
                            },
                            '&:active': {
                                backgroundColor: '#037346',
                            }
                        },
                        '& .upcoming-row': {
                            border: 'none',
                            backgroundColor: '#e6fefd',
                            color: '#037346',
                            '&:hover': {
                                backgroundColor: '#d4ffff',
                                color: '#024d3b', 
                            },
                        },
                        '& .MuiDataGrid-row.Mui-selected': {
                            backgroundColor: '#d0fdeb',
                        },
                        '&  .MuiDataGrid-row.Mui-selected:hover': {
                            backgroundColor: '#d0fdeb',  
                        },
                        '& .MuiDataGrid-footerContainer ': {
                            backgroundColor: 'rgb(201, 224, 255)',
                        },
                    }}
                    getRowId={(row) => row.bookingId}
                    getRowClassName={getRowClassName}
                />
            </div>

            {/* room booking */}
            <DialogComponent open={open} setOpen={setOpen}>
                <>
                    <div className=" flex flex-col gap-5 p-4 h-96">
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
                                    value={selectionDetails.bookingDate}
                                />
                            </DemoContainer>
                        </LocalizationProvider>

                        <DropdownMenu
                            mode={'user'}
                            heading={"Room number"}
                            open={open}
                            roomSelection={handleRoomSelection}
                            availData={Object.values(availData).filter(boolean) && showBookingDetail ? availData : {}}
                            roomNum={selectionDetails.roomNumber}
                        />
                    </div>

                    <div className=" flex items-center justify-between gap-4 p-2 font-robotoMono font-bold">
                        <button
                            className={`${
                                !isBookingAvail
                                    ? " cursor-not-allowed bg-indigo-700"
                                    : "active:scale-95 transition-all cursor-pointer bg-green-300 text-green-950"
                            } w-full p-2 rounded-lg text-blue-200`}
                            onClick={handleRoomBook}
                            disabled={!isBookingAvail}
                        >
                            Book
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

            {/* room booking button */}
            <button
                className={` w-fit text-[1rem] flex items-center justify-center px-3 py-2 rounded-l-lg active:scale-105 transition-all bg-slate-900 text-yellow-300 fixed top-1/2 -translate-y-1/2 -right-[3rem] hover:right-0 group gap-x-4 font-onest font-bold tracking-wider`}
                onClick={() => setOpen(true)}
            >
                Book seat
                <FaArrowRight className=" text-lg hidden group-hover:block" />
            </button>

            {/* room booking successful dialog */}
            <DialogComponent open={isRoomBooked} setOpen={setIsRoomBooked}>
                <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                    <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                        <button
                            type="button"
                            className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-toggle="successModal"
                            onClick={() => setIsRoomBooked(false)}
                        >
                            <svg
                                aria-hidden="true"
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clip-rule="evenodd"
                                ></path>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>

                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 p-2 flex items-center justify-center mx-auto mb-3.5">

                            <svg
                                aria-hidden="true"
                                className="w-8 h-8 text-green-500 dark:text-green-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd"
                                ></path>
                            </svg>
                            <span className="sr-only">Success</span>
                        </div>

                        <p className="mb-4 text-xl font-semibold text-gray-900 dark:text-white font-mono">
                            Successfully booked your seat.
                        </p>

                        <button
                            data-modal-toggle="successModal"
                            type="button"
                            className="py-2 px-3 text-sm font-medium text-center text-white rounded-lg bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-900 font-robotoMono"
                            onClick={() => setIsRoomBooked(false)}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </DialogComponent>
        </>
    );
};
