import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from "react";
import { UserBooking, userBookingPaginationType } from "../../AdminDataTypes";
import { Pagination, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid, GridRenderCellParams, GridToolbar } from "@mui/x-data-grid";
import { generateUniqueId } from "../../../../common/UniqID";
import BookedCandidates from "./BookedCandidates";

interface bookingProps {
    bookings: UserBooking[];
    setPaginationData: Dispatch<SetStateAction<userBookingPaginationType>>;
    paginationData: userBookingPaginationType;
    isMoreData: boolean;
}

export const BookingTable: FC<bookingProps> = ({
    bookings,
    setPaginationData,
    paginationData,
    isMoreData,
}) => {
    const [userName, setUserName] = useState<string>("");
    const theme = useTheme();
    const isSmToMd = useMediaQuery(theme.breakpoints.between(640, 768));
    const isMdToLg = useMediaQuery(theme.breakpoints.between(768, 1024));
    const isLgToXl = useMediaQuery(theme.breakpoints.between(1024, 1280));
    const isLgTo2Xl = useMediaQuery(theme.breakpoints.between(1280, 1536));
    const isXlUp = useMediaQuery(theme.breakpoints.up(1536));

    const [page, setPage] = useState<number>(1);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [startingIndex, setStartingIndex] = useState<number>(0);

    const getColumnWidth = (defaultWidth: number) => {
        if (isSmToMd) return defaultWidth * 0.5;
        if (isMdToLg) return defaultWidth * 0.74;
        if (isLgToXl) return defaultWidth * 0.8;
        if (isLgTo2Xl) return defaultWidth * 1.12;
        if (isXlUp) return defaultWidth * 1.26;
        return defaultWidth;
    };

    const handleCandidateClick = (value: string) => {
        setUserName(value);
        setTimeout(() => {
            setDialogOpen(true);
        }, 150);
    };

    if (dialogOpen == true) {
        return (
            <BookedCandidates
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                userName={userName}
            />
        );
    }

    const roomColumns = [
        { field: "count", headerName: "Index", width: getColumnWidth(160) },
        { field: "username", headerName: "Name", width: getColumnWidth(300) },
        { field: "email", headerName: "Email Id", width: getColumnWidth(360) },
        {
            field: "actions",
            headerName: "User bookings",
            width: getColumnWidth(370),
            renderCell: (params: GridRenderCellParams<UserBooking>) => (
                <strong>
                    <button
                        className=" bg-slate-200 ring-1 ring-slate-400 text-slate-700 font-mono text-lg px-3 py-1.5 rounded-lg active:scale-110 hover:scale-95 transition-all"
                        onClick={() =>
                            handleCandidateClick(params.row.username)
                        }
                    >
                        Bookings
                    </button>
                </strong>
            ),
        },
    ];

    const bookingRows = (Array.isArray(bookings) ? bookings : [bookings]).map(
        (booking, index) => ({
            count: startingIndex + index + 1,
            id: generateUniqueId(),
            username: booking.username,
            email: booking.email,
        })
    );

    const handlePaginationPgCount = (
        _event: ChangeEvent<unknown>,
        page: number
    ) => {
        setPage(page);
        const offset = (page - 1) * paginationData.limit;
        setStartingIndex(offset);
        setPaginationData((prev: userBookingPaginationType) => ({
            ...prev,
            offset
        }));
    };

    return (
        <div className="w-fit overflow-auto rounded-lg h-fit">
            <DataGrid
                rows={bookingRows}
                columns={roomColumns}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: { showQuickFilter: true },
                }}
                className="custom-class"
                sx={{
                    "& .MuiDataGrid-toolbarContainer": {
                        marginBottom: 0.3,
                        paddingBottom: 1,
                        backgroundColor: "rgb(201, 224, 255)",
                    },
                    "& .MuiDataGrid-columnHeader": {
                        backgroundColor: "#d0fdeb",
                        width: "100%",
                    },
                    "& .MuiDataGrid-cell": {
                        marginBottom: 0.1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "17px",
                    },
                    "& .MuiDataGrid-root": {
                        border: "none",
                        outline: "none",
                    },
                    "& .userBookings": {
                        border: "none",
                        backgroundColor: "#e6fefd",
                        color: "#037346",
                        "&:hover": {
                            backgroundColor: "#f8ffc1",
                            color: "#7e8e01",
                        },
                    },
                    "& .MuiDataGrid-row": {
                        border: "0.2px solid #eaeaea",
                    },
                    "& .MuiDataGrid-row.Mui-selected": {
                        backgroundColor: "#5ebfe0",
                        color: "#dff6fe",
                    },
                    "&  .MuiDataGrid-row.Mui-selected:hover": {
                        backgroundColor: "#5ebfe0",
                        color: "#dff6fe",
                    },
                    "& .MuiDataGrid-footerContainer ": {
                        display: "none",
                        backgroundColor: "rgb(201, 224, 255)",
                    },
                    "& .MuiDataGrid-bottomContainer": {
                        display: "none",
                    },
                    "& .MuiDataGrid-filler": {
                        display: "none",
                    },
                    "& .MuiDataGrid-cellEmpty": {
                        display: "none",
                        width: "1rem",
                    },
                    "& .MuiDataGrid-row:last-child": {
                        borderBottomLeftRadius: "8px",
                        borderBottomRightRadius: "8px",
                        overflow: "hidden",
                    },
                }}
                getRowClassName={() => "userBookings"}
            />

            {/* pagination */}
            {isMoreData && (
                <div className=" fixed left-1/2 -translate-x-1/2 bottom-2 bg-slate-100 px-2 py-1.5 rounded-lg overflow-hidden">
                    <Pagination
                        count={Math.ceil(
                            paginationData.totalUsers / paginationData.limit
                        )}
                        page={page}
                        onChange={handlePaginationPgCount}
                        variant="outlined"
                        shape="rounded"
                    />
                </div>
            )}
        </div>
    );
};
