export interface applyForType {
    phoneNumber: number;
    address: string;
    role: string;
    attachments: string;
    applicationStatus: string;
    scheduledMeeting: []
}

export interface userType {
    username: string;
    email: string;
    token: string;
    applyfor?: applyForType[];
}