import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { roomType } from "../../components/admin/jobRooms/Rooms";
import { RootState } from "../Store";

interface InitialStateType {
    rooms: roomType[];
}

const initialState: InitialStateType = {
    rooms: [],
};

export const jobRoomSlice = createSlice({
    name: 'jobRoom',
    initialState,
    reducers: {
        setRooms: (state, action: PayloadAction<roomType[]>) => {
            state.rooms = action.payload;
        },
    },
});

export const { setRooms } = jobRoomSlice.actions;
export default jobRoomSlice.reducer;

export const selectJobRoom = (state: RootState) => state.jobRoom.rooms;
