import { FC, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Paper,
    Box,
    Collapse,
    IconButton,
    Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { formatDateTime } from "../../../../common/formatDateTime";

interface Candidate {
    bookingDate: string;
    bookingId: string; 
    userDetails?: {
        username: string;
        email: string;
    };
}

interface Room {
    roomName: string;
    roomNumber: number;
    seatCapacity: number;
    _id?: string;
    appliedCandidates?: Candidate[];
}

interface JobRoomTableProps {
    rooms: Room[];
}

const RoomRow: FC<{ room: Room }> = ({ room }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow>
                <TableCell sx={{ 
                    width: '5px',
                    borderRight: '1px solid black'
                    
                }}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </TableCell>
                <TableCell sx={{ 
                    alignContent: 'center',
                    textAlign: 'center',
                    borderRight: '2px solid #b1b1b1',
                    fontSize:'17px',
                    fontWeight: '500'
                }}>{room.roomName}</TableCell>
                <TableCell sx={{ 
                    alignContent: 'center',
                    textAlign: 'center',
                    borderRight: '2px solid #b1b1b1',
                    fontSize:'17px',
                    fontWeight: '500'
                }}>{room.roomNumber}</TableCell>
                <TableCell sx={{ 
                    alignContent: 'center',
                    textAlign: 'center',
                    fontSize:'17px',
                    fontWeight: '500'
                }}>{room.seatCapacity}</TableCell>
            </TableRow>

            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                            >
                                Applied Candidates
                            </Typography>
                            <Table size="small" aria-label="applied candidates">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Booking Date</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {room.appliedCandidates?.map(
                                        (candidate, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {formatDateTime(candidate.bookingDate)}
                                                </TableCell>
                                                <TableCell>
                                                    {candidate.userDetails
                                                        ?.username || "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    {candidate.userDetails
                                                        ?.email || "N/A"}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    ) || (
                                        <TableRow>
                                            <TableCell colSpan={3}>
                                                No candidates applied
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

export const AdminJobRoomTable: FC<JobRoomTableProps> = ({ rooms }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: "100%" }}>
            <TableContainer>
                <Table stickyHeader aria-label="room table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            {[
                                "Room Name",
                                "Room Number",
                                "Seat Capacity",
                            ].map((cell, indx) => (
                                <TableCell 
                                key={indx + cell}
                                sx={{
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    fontSize: '20px',
                                }}>
                                    <span className=" font-onest">{cell}</span>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rooms
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((room, index) => (
                                <RoomRow key={index} room={room} />
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rooms.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};
