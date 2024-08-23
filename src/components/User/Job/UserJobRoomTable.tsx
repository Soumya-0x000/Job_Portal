import {
    ChangeEvent,
    Dispatch,
    FC,
    SetStateAction,
    useEffect,
    useState,
} from "react";
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
import {
    DataGrid,
    GridColDef,
    GridRowParams,
    GridToolbar,
} from "@mui/x-data-grid";
import { userBookings } from "../AllUserTypes";
import { Pagination, useMediaQuery, useTheme } from "@mui/material";
import { paginationType } from "./UserJobRooms";

interface JobRoomTableProps {
    rooms: userBookings[];
    setRooms: Dispatch<SetStateAction<userBookings[]>>;
    setPaginationData: Dispatch<SetStateAction<paginationType>>;
    moreData: boolean;
    paginationData: paginationType;
    dataCount: {
        totalBookings: number;
        limit: number;
    };
}

export const initialValue = {
    bookingDate: undefined as Dayjs | null | undefined,
    roomNumber: NaN as number,
};

export const UserJobRoomTable: FC<JobRoomTableProps> = ({
    rooms,
    setRooms,
    setPaginationData,
    paginationData,
    dataCount,
    moreData,
}) => {
    const [open, setOpen] = useState<boolean>(false);
    const [selectionDetails, setSelectionDetails] =
        useState<typeof initialValue>(initialValue);
    const [page, setPage] = useState<number>(1);
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
            field: "bookingDate",
            headerName: "Booking Date",
            flex: 1,
            width: getColumnWidth(150),
            renderCell: (params) => <div>{formatDateTime(params.value)}</div>,
        },
        {
            field: "roomName",
            headerName: "Room Name",
            flex: 1,
            width: getColumnWidth(150),
        },
        {
            field: "roomNumber",
            headerName: "Room Number",
            flex: 1,
            width: getColumnWidth(150),
        },
        {
            field: "bookingStatus",
            headerName: "Booking Status",
            flex: 1,
            width: getColumnWidth(150),
        },
    ];

    const getRowClassName = (params: GridRowParams) => {
        const status = params.row.bookingStatus;
        return status === "past" ? "past-row" : "upcoming-row";
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
            console.log(newDetails);
            const response = await axios.post(
                `${URL}/room-booking/book-room`,
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
            // console.log(response);
            setIsBookingAvail(false);

            const {
                bookingDate,
                _id: bookingId,
                roomName,
                roomNumber,
            } = response.data.data;
            setRooms((prev) => [
                ...prev,
                {
                    roomName,
                    roomNumber,
                    bookingDate,
                    bookingId,
                    bookingStatus: "upcoming",
                },
            ]);
            setIsRoomBooked(true);
            handleCancelation();
        } catch (error) {
            if (axios.isAxiosError(error))
                showToastMsg(error.response?.data?.message || error.message);
            // else if (error instanceof Error) showToastMsg(error.message);
            else showToastMsg("You have already booked a seat for this day!");
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
                `${URL}/room-booking/booking-availability?roomNumber=${dataParams.roomNumber}&date=${dataParams.date}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "69420",
                        authorization: `token ${userToken}`,
                    },
                }
            );

            if (response?.data?.data.availableSeats > 0) {
                setAvailData(response?.data?.data);
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
                console.error(
                    "An unknown error occurred while fetching room details"
                );
        }
    };

    const handleCancelation = () => {
        setSelectionDetails(initialValue);
        setIsBookingAvail(false);
        setOpen(false);
        setShowBookingDetail(false);
    };

    const handlePaginationPgCount = (
        _event: ChangeEvent<unknown>,
        page: number
    ) => {
        setPage(page);
        setPaginationData((prev: paginationType) => ({
            ...prev,
            offset: (page - 1) * paginationData.limit,
        }));
    };

    console.log(rooms);
    const validateRooms: () => boolean = () => {
        return (
            Array.isArray(rooms) &&
            rooms.length > 0 &&
            rooms.every(
                (room) =>
                    room.roomName !== undefined &&
                    room.roomNumber !== undefined &&
                    room.bookingDate !== undefined &&
                    room.bookingId !== undefined &&
                    (room.bookingStatus === "upcoming" ||
                        room.bookingStatus === "past")
            )
        );
    };

    return (
        <>
            {validateRooms() ? (
                <div className=" max-w-[100%] overflow-auto rounded-lg shadow-lg">
                    <DataGrid
                        rows={rooms} // change to demoUserRooms for testing
                        columns={columns}
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{
                            toolbar: { showQuickFilter: true },
                        }}
                        sx={{
                            width: 1200,
                            "& .MuiDataGrid-toolbarContainer": {
                                marginBottom: 0.2,
                                paddingBottom: 1,
                                backgroundColor: "rgb(201, 224, 255)",
                            },
                            "& .MuiDataGrid-columnHeader": {
                                backgroundColor: "#d0fdeb",
                            },
                            "& .MuiDataGrid-cell": {
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "17px",
                            },
                            "& .MuiDataGrid-root": {
                                border: "none",
                                borderWidth: "0px",
                                outline: "none",
                                boxShadow: "#000",
                            },
                            "& .past-row": {
                                border: "none",
                                backgroundColor: "#eafffa",
                                color: "#353938",
                                "&:hover": {
                                    backgroundColor: "#eafffa",
                                    color: "#353938",
                                },
                            },
                            "& .upcoming-row": {
                                border: "none",
                                backgroundColor: "#d8f9ff",
                                color: "#003d48",
                                "&:hover": {
                                    backgroundColor: "#e1fff8",
                                    color: "#003d48",
                                },
                                "&:active": {
                                    backgroundColor: "#e1fff8",
                                },
                            },
                            "& .MuiDataGrid-row.Mui-selected": {
                                backgroundColor: "#fcfff4",
                                color: "#000059",
                            },
                            "&  .MuiDataGrid-row.Mui-selected:hover": {
                                backgroundColor: "#fcfff4",
                            },
                            "& .MuiDataGrid-footerContainer ": {
                                display: "none",
                                border: "none",
                            },
                            "& .MuiDataGrid-filler": {
                                display: "none",
                            },
                            "& .MuiDataGrid-row": {
                                border: "0.2px solid #eaeaea",
                            },
                            "& .MuiDataGrid-row:last-child": {
                                borderBottomLeftRadius: "8px",
                                borderBottomRightRadius: "8px",
                                overflow: "hidden",
                            },
                        }}
                        getRowId={(row) => row.bookingId}
                        getRowClassName={getRowClassName}
                    />

                    {moreData && (
                        <div className=" fixed left-1/2 -translate-x-1/2 bottom-2 bg-slate-100 px-2 py-1.5 rounded-lg overflow-hidden">
                            <Pagination
                                count={Math.ceil(
                                    dataCount.totalBookings / dataCount.limit
                                )}
                                page={page}
                                onChange={handlePaginationPgCount}
                                variant="outlined"
                                shape="rounded"
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className=" text-center">No rooms booked yet</div>
            )}

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
                                    onChange={(date) =>
                                        handleDateSelection(date)
                                    }
                                    minDate={dayjs()}
                                    value={selectionDetails.bookingDate}
                                />
                            </DemoContainer>
                        </LocalizationProvider>

                        <DropdownMenu
                            mode={"user"}
                            heading={"Room number"}
                            open={open}
                            roomSelection={handleRoomSelection}
                            availData={
                                Object.values(availData).filter(boolean) &&
                                showBookingDetail
                                    ? availData
                                    : {}
                            }
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
                    <div className="relative p-4 text-center bg-white rounded-lg dark:bg-gray-800 sm:p-5 flex flex-col items-center">
                        <iframe
                            src="https://lottie.host/embed/5c0ead23-2703-484c-a294-f337deb405ad/XqrOrpWTsf.json"
                            className=" mb-2.5"
                        />

                        <p className="mb-5 text-[1.15rem] font-semibold text-gray-900 dark:text-white font-mavenPro">
                            Successfully booked your seat.
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
        </>
    );
};
