import { ChangeEvent, FC, memo, useEffect, useState } from "react";
import axios from "axios";
import { formatDateTime } from "../../../../common/formatDateTime";
import { Transition } from "../../../../common/DialogComponent";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Pagination,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { DataGrid, GridRowParams, GridToolbar } from "@mui/x-data-grid";
import { URL } from "../../../../API";
import { showToastMsg } from "../../../../common/ToastMsg";

const initialBookingData = {
    totalBookings: 0,
    limit: 10,
    offset: 0,
};

interface bookedCandidateType {
    bookingId: string;
    bookingDate: string;
    bookingStatus: string;
    roomName: string;
    roomNumber: number;
}

const BookedCandidates: FC<{
    open: boolean;
    onClose: () => void;
    userName: string;
}> = memo(({ open, onClose, userName }) => {
    const [bookingPaginationData, setBookingPaginationData] =
        useState<typeof initialBookingData>(initialBookingData);
    const [moreData, setMoreData] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [startingIndex, setStartingIndex] = useState<number>(0);

    const theme = useTheme();
    const isSmToMd = useMediaQuery(theme.breakpoints.between(640, 768));
    const isMdToLg = useMediaQuery(theme.breakpoints.between(768, 1024));
    const isLgToXl = useMediaQuery(theme.breakpoints.between(1024, 1280));
    const isLgTo2Xl = useMediaQuery(theme.breakpoints.between(1280, 1536));
    const isXlUp = useMediaQuery(theme.breakpoints.up(1536));

    const getColumnWidth = (defaultWidth: number) => {
        if (isSmToMd) return defaultWidth * 1;
        if (isMdToLg) return defaultWidth * 1;
        if (isLgToXl) return defaultWidth * 1;
        if (isLgTo2Xl) return defaultWidth * 1.12;
        if (isXlUp) return defaultWidth * 1.26;
        return defaultWidth;
    };

    const primaryURL = (offset?: number) =>
        `room-booking/get-booking-details?username=${userName}&limit=${initialBookingData.limit}&offset=${initialBookingData.offset || offset}`;

    const getUserBookings: (endpoint: string) => void = async (
        endpoint: string
    ) => {
        try {
            const admin = JSON.parse(
                localStorage.getItem("adminDetails") || ""
            );

            const { data, status } = await axios.get(`${URL}/${endpoint}`, {
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "69420",
                    authorization: `token ${admin?.token}`,
                },
            });

            if (status === 200) {
                const { totalBookings, limit, offset } = data.data;
                const isMoreData = data.data.totalBookings - data.data.limit;
                setMoreData(isMoreData > 0 ? true : false);
                setBookingPaginationData((prev: typeof initialBookingData) => ({
                    ...prev,
                    totalBookings,
                    limit,
                    offset,
                }));

                setBookedSeats(data.data.bookings);
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error))
                showToastMsg(error.response?.data?.message || error.message);
            else if (error instanceof Error)
                showToastMsg(error.message);
            else
                console.error("An unknown error occurred while fetching room details");
        }
    };

    const candidateRows = bookedSeats.map(
        (bookings: bookedCandidateType, index) => ({
            count: startingIndex + index + 1,
            id: bookings.bookingId,
            bookingDate: formatDateTime(bookings.bookingDate),
            status: bookings.bookingStatus,
            roomNumber: bookings.roomNumber,
            roomName: bookings.roomName,
        })
    );

    useEffect(() => {
        if (userName !== "") {
            getUserBookings(primaryURL());
        }
    }, [userName]);

    const candidateColumns = [
        { field: "count", headerName: "Index", width: getColumnWidth(200) },
        {
            field: "bookingDate",
            headerName: "Booking Date",
            width: getColumnWidth(350),
        },
        { field: "status", headerName: "Status", width: getColumnWidth(200) },
        { field: "roomNumber", headerName: "Room number", width: getColumnWidth(240) },
        { field: "roomName", headerName: "Room name", width: getColumnWidth(240) },
    ];

    const handlePaginationPgCount = async (
        _event: ChangeEvent<unknown>,
        page: number
    ) => {
        setPage(page);
        const newOffset = (page - 1) * bookingPaginationData.limit;
        setStartingIndex(newOffset)

        setBookingPaginationData((prev: typeof initialBookingData) => ({
            ...prev,
            offset: newOffset,
        }));

        primaryURL(newOffset)
        await getUserBookings(
            `room-booking/get-booking-details?username=${userName}&limit=${bookingPaginationData.limit}&offset=${newOffset}`
        );
    };

    const getRowClassName = (params: GridRowParams) => {
        const status = params.row.status;
        return status === "past" ? "past-row" : "upcoming-row";
    };

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            maxWidth="md"
            TransitionComponent={Transition}
        >
            <DialogContent>
                <Box sx={{ height: 500, position: "relative" }}>
                    <div className=" w-full flex items-center justify-center overflow-auto">
                        <div className=" max-w-[85rem] rounded-lg overflow-auto">
                            <div className=" w-full bg-slate-400 flex items-center justify-between rounded-md mb-2">
                                <span className=" text-slate-50 text-[1.2rem] pl-4 font-onest tracking-wide font-bold">
                                    Applied Candidates
                                </span>

                                <DialogActions>
                                    <Button
                                        onClick={() => (
                                            onClose(),
                                            setBookingPaginationData(
                                                initialBookingData
                                            )
                                        )}
                                        sx={{
                                            color: "#000",
                                            fontWeight: "bold",
                                            backgroundColor: "#f1f1f1",
                                            "&:hover": {
                                                backgroundColor: "#f1f1f1",
                                            },
                                        }}
                                    >
                                        Close
                                    </Button>
                                </DialogActions>
                            </div>

                            <DataGrid
                                rows={candidateRows}
                                columns={candidateColumns}
                                slots={{ toolbar: GridToolbar }}
                                slotProps={{
                                    toolbar: {
                                        showQuickFilter: true,
                                    },
                                }}
                                className="dialog-custom-class"
                                sx={{
                                    overflow: "auto",
                                    "& .MuiDataGrid-toolbarContainer": {
                                        marginBottom: 0.3,
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
                                        borderRadius: "20px",
                                        border: "none",
                                        borderWidth: "0px",
                                        outline: "none",
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
                                    "& .MuiDataGrid-row": {
                                        border: "0.2px solid #eaeaea",
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
                                    "& .MuiDataGrid-row:last-child": {
                                        borderBottomLeftRadius: "8px",
                                        borderBottomRightRadius: "8px",
                                        overflow: "hidden",
                                    },
                                }}
                                getRowId={(row) => row.id}
                                getRowClassName={getRowClassName}
                            />
                        </div>
                    </div>

                    {moreData && (
                        <div className=" fixed left-1/2 -translate-x-1/2 bottom-2 bg-slate-100 px-2 py-1.5 rounded-lg overflow-hidden">
                            <Pagination
                                count={Math.ceil(
                                    bookingPaginationData.totalBookings /
                                        bookingPaginationData.limit
                                )}
                                page={page}
                                onChange={handlePaginationPgCount}
                                variant="outlined"
                                shape="rounded"
                            />
                        </div>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
});

export default BookedCandidates;
