import {
    Dispatch, FC, SetStateAction, useEffect, useState
} from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

export interface Room {
    roomName: string;
    roomNumber: number;
    roomId?: string;
    bookingDate: string;
}

interface JobRoomTableProps {
    rooms: Room[];
    setRooms: Dispatch<SetStateAction<Room[]>>;
    tableHeaders: string[];
}

export const UserJobRoomTable: FC<JobRoomTableProps> = ({
    rooms,
    setRooms,
    tableHeaders,
}) => {
    const [open, setOpen] = useState<boolean>(false);
    const [selectionDetails, setSelectionDetails] = useState<{
        bookingDate: Dayjs | null | undefined;
        roomNumber: number;
    }>({
        bookingDate: undefined,
        roomNumber: NaN,
    });
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
                    roomId: bookingId
                }
            ]))
            setIsRoomBooked(true)
            handleCancelation();
        } catch (error) {
            if (axios.isAxiosError(error))
                showToastMsg(error.response?.data?.message || error.message);
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

            if (response?.data?.availableSeats > 0) {
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
        setSelectionDetails({ bookingDate: undefined, roomNumber: NaN });
        setIsBookingAvail(false);
        setOpen(false);
        setShowBookingDetail(false);
    };

    return (
        <>
            <TableContainer component={Paper} sx={{ width: "900px" }}>
                <Table aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            {tableHeaders.map((name, indx) => (
                                <StyledTableCell
                                    key={name + indx}
                                    sx={{
                                        fontWeight: "bold",
                                        textTransform: "uppercase",
                                        fontSize: "0.8rem",
                                        letterSpacing: "0.5px",
                                        color: "#333",
                                        textAlign: "center",
                                        borderRight:
                                            indx < tableHeaders.length - 1
                                                ? "1px solid #f7ff3b"
                                                : "",
                                    }}
                                >
                                    {name}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rooms.map((row) => (
                            <StyledTableRow key={row.roomId}>
                                <StyledTableCell
                                    sx={{
                                        textAlign: "center",
                                    }}
                                >
                                    {formatDateTime(row.bookingDate)}
                                </StyledTableCell>
                                <StyledTableCell
                                    sx={{
                                        textAlign: "center",
                                    }}
                                >
                                    {row.roomName}
                                </StyledTableCell>
                                <StyledTableCell
                                    sx={{
                                        textAlign: "center",
                                    }}
                                >
                                    {row.roomNumber}
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

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

            <button
                className={` w-fit text-[1rem] flex items-center justify-center px-3 py-2 rounded-l-lg active:scale-105 transition-all bg-slate-900 text-yellow-300 fixed top-1/2 -translate-y-1/2 -right-[3rem] hover:right-0 group gap-x-4 font-onest font-bold tracking-wider`}
                onClick={() => setOpen(true)}
            >
                Book seat
                <FaArrowRight className=" text-lg hidden group-hover:block" />
            </button>

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
