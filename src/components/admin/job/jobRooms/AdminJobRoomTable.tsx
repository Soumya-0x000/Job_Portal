import * as React from 'react';
import { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Box,
} from '@mui/material';
import { DataGrid, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { Transition } from '../../../../common/DialogComponent';
import { formatDateTime } from '../../../../common/formatDateTime';

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

const AppliedCandidatesDialog: React.FC<{
    open: boolean;
    onClose: () => void;
    candidates: Candidate[];
}> = ({ open, onClose, candidates }) => {
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

    return (
        <Dialog open={open} onClose={onClose}  maxWidth="md" TransitionComponent={Transition}>
            <DialogTitle>Applied Candidates</DialogTitle>

            <DialogContent>
                <Box sx={{ height: 500, width: '100%' }}>
                    <DataGrid
                        rows={candidateRows}
                        columns={candidateColumns}
                        pageSizeOptions={[15, 30, 60, 100]}
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }}
                        sx={{
                            '& .MuiDataGrid-cell': {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.9rem',
                            },
                        }}
                    />
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

const RoomRow: React.FC<{ room: Room }> = ({ room }) => {
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
            />
        </>
    );
};

import { useMediaQuery, useTheme } from '@mui/material';

export const AdminJobRoomTable: React.FC<JobRoomTableProps> = ({ rooms }) => {
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

    const roomColumns = [
        { field: 'count', headerName: 'Index', width: getColumnWidth(130) },
        { field: 'roomName', headerName: 'Room Name', width: getColumnWidth(300) },
        { field: 'roomNumber', headerName: 'Room Number', width: getColumnWidth(200) },
        { field: 'seatCapacity', headerName: 'Seat Capacity', width: getColumnWidth(200) },
        {
            field: 'actions',
            headerName: 'Applied Candidates',
            width: getColumnWidth(350),
            renderCell: (params: GridRenderCellParams<Room>) => <RoomRow room={params.row} />,
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

    return (
        <div className=' w-screen sm:w-[35rem] md:w-[50rem] lg:w-[58rem] xl:w-[75rem] Lxl:w-[80rem] 2xl:w-[87rem]'>
            <DataGrid
                rows={roomRows}
                columns={roomColumns}
                pageSizeOptions={[15, 30, 50, 70, 100]}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                    },
                }}
                sx={{
                    '& .MuiDataGrid-cell': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '17px'
                    },
                    '& .MuiDataGrid-root': {
                        border: 'none'
                    }
                }}
            />
        </div>
    );
};
