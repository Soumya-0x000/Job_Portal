export interface appliedCandidateProps {
    userDetails: { 
        username: string; 
        email: string; 
    }; 
    bookingDate: string; 
    bookingId: string; 
    bookingStatus: string;
}

export interface filterRoomProps {
    _id?: string;
    roomName: string; 
    roomNumber: number; 
    seatCapacity: number; 
    appliedCandidates: appliedCandidateProps[];
}

export interface filterRoomDataType { 
    data: {
        rooms: filterRoomProps[],
        totalBookings: number,
        limit: number,
        offset: number
    },
    message: string
}

export interface noFilterRoomProps {
    _id?: string;
    roomName: string; 
    roomNumber: number; 
    seatCapacity: number; 
    appliedCandidates: appliedCandidateProps[];
    totalBookings: number;
    bookingLimit: number,
    bookingOffset: number
}

export interface noFilterRoomDataType { 
    data: {
        rooms: noFilterRoomProps[],
        totalRooms: number,
        limit: number,
        offset: number
    },
    message: string
}