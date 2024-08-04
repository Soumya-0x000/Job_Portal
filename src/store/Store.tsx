import { configureStore } from '@reduxjs/toolkit'
import jobRoomReducer from "./features/JobRoomSlice";

export const store = configureStore({
    reducer: {
        jobRoom: jobRoomReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
