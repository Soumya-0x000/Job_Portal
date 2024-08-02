import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    rooms: [],
}

export const jobRoomSlice = createSlice({
    name: 'jobRoom',
    initialState,
    reducers: {
        setRooms: (state, action) => {
            state.rooms = action.payload
        }
    }
})