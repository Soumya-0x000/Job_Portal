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


// userBookings

export type userBookedSeats = {
    roomName?: string;
    roomNumber?: number;
    bookingDate: string;
    bookingId: string;
    bookingStatus: string;
};
  
export type UserBooking = {
    username: string;
    email: string;
};

export type initialBooking = {
    totalUsers: number,
    limit: number,
    offset: number
}

export type UserBookingsResponse = {
    data: {
        allUserBookings: UserBooking[];
        totalUsers: number;
        limit: number;
        offset: number;
    };
    message: string;
};
  
export interface userBookingPaginationType {
    totalUsers: number;
    limit: number;
    offset: number;
}
