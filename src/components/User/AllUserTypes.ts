export interface userBookings {
    roomName: string;
    roomNumber: number;
    bookingDate: string;
    bookingId?: string;
    bookingStatus: 'upcoming' | 'past';
}

export interface roomBookingType {
    data: {
        bookings: userBookings[];
        totalBookings: number;
        limit: number;
        offset: number;
    };
    message: string;
}
