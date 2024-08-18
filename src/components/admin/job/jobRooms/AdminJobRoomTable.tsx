import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Box,
    Pagination,
} from '@mui/material';
import { DataGrid, GridRenderCellParams, GridRowParams, GridToolbar } from '@mui/x-data-grid';
import { Transition } from '../../../../common/DialogComponent';
import { formatDateTime } from '../../../../common/formatDateTime';
import { useMediaQuery, useTheme } from '@mui/material';
import { adminPaginationType, bookingPaginationType } from './AdminRooms';

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
    setPaginationData: Dispatch<SetStateAction<adminPaginationType>>;
    paginationData: adminPaginationType;
    setBookingPaginationData: Dispatch<SetStateAction<bookingPaginationType>>;
    bookingPaginationData: bookingPaginationType;
}

const AppliedCandidatesDialog: React.FC<{
    open: boolean;
    onClose: () => void;
    candidates: Candidate[];
    setBookingPaginationData: Dispatch<SetStateAction<bookingPaginationType>>;
    bookingPaginationData: bookingPaginationType;
}> = ({ 
    open, onClose, candidates, setBookingPaginationData, bookingPaginationData
}) => {
    const [page, setPage] = useState<number>(1);

    const candidateColumns = [
        { field: 'bookingDate', headerName: 'Booking Date', width: 250 },
        { field: 'username', headerName: 'Name', width: 300 },
        { field: 'email', headerName: 'Email', width: 300 },
    ];
    const candidateRows = candidates.map(candidate => ({
        id: candidate.bookingId,
        bookingDate: formatDateTime(candidate.bookingDate),
        username: candidate.userDetails?.username || "N/A",
        email: candidate.userDetails?.email || "N/A",
    }));

    const handlePaginationPgCount = (event: ChangeEvent<unknown>, page: number) => {
        console.log(page)
        setPage(page)
        setBookingPaginationData((prev: bookingPaginationType) => ({
            ...prev,
            bookingOffset: (page-1) * (prev.bookingLimit)
        }));
    }

    return (
        <Dialog open={open} onClose={onClose}  maxWidth="md" TransitionComponent={Transition}>
            <DialogTitle>Applied Candidates</DialogTitle>

            <DialogContent>
                <Box sx={{ height: 500, width: '100%', position: 'relative' }}>
                    <DataGrid
                        rows={candidateRows}
                        columns={candidateColumns}
                        // pageSizeOptions={[15, 30, 60, 100]}
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }}
                        className='dialog-custom-class'
                        sx={{
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
                            '& .dialog-custom-class': {
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
                                display: 'none',
                                backgroundColor: 'rgb(201, 224, 255)',
                            },
                        }}
                    />

                    <div className=" fixed left-1/2 -translate-x-1/2 bottom-2 bg-slate-100 px-2 py-1.5 rounded-lg overflow-hidden">
                        <Pagination 
                            count={Math.ceil(bookingPaginationData.totalBookings/bookingPaginationData.bookingLimit)} 
                            page={page} 
                            onChange={handlePaginationPgCount} 
                            variant="outlined" 
                            shape="rounded"
                        />
                    </div>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const RoomRow: React.FC<{ 
    room: Room;
    setBookingPaginationData: Dispatch<SetStateAction<bookingPaginationType>>;
    bookingPaginationData: bookingPaginationType; 
}> = ({ 
    room, setBookingPaginationData, bookingPaginationData 
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <>
            <div className=' flex items-center justify-center w-full h-full'>
                <button className=' text-indigo-900 font-mono font-bold bg-indigo-200 rounded-lg h-9 flex items-center justify-center px-4'
                    onClick={() => setDialogOpen(true)}
                >
                    Applied Candidates
                </button>
            </div>

            <AppliedCandidatesDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                candidates={room.appliedCandidates || []}
                setBookingPaginationData={setBookingPaginationData}
                bookingPaginationData={bookingPaginationData}
            />
        </>
    );
};


export const AdminJobRoomTable: FC<JobRoomTableProps> = ({ rooms, setPaginationData, paginationData, setBookingPaginationData, bookingPaginationData }) => {
    const theme = useTheme();
    const isSmToMd = useMediaQuery(theme.breakpoints.between(640, 768));
    const isMdToLg = useMediaQuery(theme.breakpoints.between(768, 1024));
    const isLgToXl = useMediaQuery(theme.breakpoints.between(1024, 1280)); 
    const isLgTo2Xl = useMediaQuery(theme.breakpoints.between(1280, 1536));
    const isXlUp = useMediaQuery(theme.breakpoints.up(1536));

    const [page, setPage] = useState<number>(1);

    const getColumnWidth = (defaultWidth: number) => {
        if (isSmToMd) return defaultWidth * 0.5;
        if (isMdToLg) return defaultWidth * 0.74;
        if (isLgToXl) return defaultWidth * 0.8; 
        if (isLgTo2Xl) return defaultWidth * 1.12;
        if (isXlUp) return defaultWidth * 1.26;
        return defaultWidth;
    };

    const roomColumns = [
        { field: 'count', headerName: 'Index', width: getColumnWidth(130) },
        { field: 'roomName', headerName: 'Room Name', width: getColumnWidth(300) },
        { field: 'roomNumber', headerName: 'Room Number', width: getColumnWidth(200) },
        { field: 'seatCapacity', headerName: 'Seat Capacity', width: getColumnWidth(200) },
        {
            field: 'actions',
            headerName: 'Applied Candidates',
            width: getColumnWidth(350),
            renderCell: (params: GridRenderCellParams<Room>) => 
                <RoomRow 
                    setBookingPaginationData={setBookingPaginationData}
                    bookingPaginationData={bookingPaginationData}
                    room={params.row} 
                />,
        },
    ];

    const roomRows = rooms.map((room, index) => ({
        count: index + 1,
        id: room._id,
        roomName: room.roomName,
        roomNumber: room.roomNumber,
        seatCapacity: room.seatCapacity,
        appliedCandidates: room.appliedCandidates,
    }));

    const getRowClassName = (params: GridRowParams) => {
        console.log(params.row)
        const status = params.row.bookingStatus;
        return status === 'pending' ? 'pending-row' : 'approved-row';
    };

    const handlePaginationPgCount = (event: ChangeEvent<unknown>, page: number) => {
        setPage(page)
        setPaginationData((prev: adminPaginationType) => ({
            ...prev,
            offset: (page-1) * (prev.limit)
        }));
    }

    return (
        <div className='w-[100%] overflow-auto'>
            <DataGrid
                rows={roomRows}
                columns={roomColumns}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: { showQuickFilter: true },
                }}
                className='custom-class'
                sx={{
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
                    '& .approved-row': {
                        border: 'none',
                        backgroundColor: '#e6fefd',
                        color: '#037346',
                        '&:hover': {
                            backgroundColor: '#7e8e01',
                            color: '#f8ffc1', 
                        },
                    },
                    '& .MuiDataGrid-row.Mui-selected': {
                        backgroundColor: '#3f99b8',
                        color: '#dff6fe'
                    },
                    '&  .MuiDataGrid-row.Mui-selected:hover': {
                        backgroundColor: '#3f99b8',
                        color: '#dff6fe'
                    },
                    '& .MuiDataGrid-footerContainer ': {
                        display: 'none',
                        backgroundColor: 'rgb(201, 224, 255)',
                    },
                }}
                getRowClassName={getRowClassName}
            />

            <div className=" fixed left-1/2 -translate-x-1/2 bottom-2 bg-slate-100 px-2 py-1.5 rounded-lg overflow-hidden">
                <Pagination 
                    count={Math.ceil(paginationData.totalRooms/paginationData.limit)} 
                    page={page} 
                    onChange={handlePaginationPgCount} 
                    variant="outlined" 
                    shape="rounded"
                />
            </div>
        </div>
    );
};
