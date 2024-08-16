import { useEffect, useRef, useState } from "react";
import { Loading } from "../../../../common/Loading";
import { IoIosAdd } from "react-icons/io";
import * as Yup from 'yup';
import { Field, Form, Formik } from "formik";
import axios from "axios";
import { URL } from "../../../../API";
import { showToastMsg } from "../../../../common/ToastMsg";
import { AdminJobRoomTable } from "./AdminJobRoomTable";
import { DialogComponent } from "../../../../common/DialogComponent";
import { Menu, MenuProps } from "@mui/material";
import styled from "styled-components";
import Dropdown from "../../../User/Dropdown";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { initialValue } from "../../../User/Job/UserJobRoomTable";
import RoomNumDtFilter from "../../../../common/RoomNumDtFilter";

const validationSchema = Yup.object({
    roomName: Yup.string().required('Required'),
    seatCapacity: Yup.number().required('Required').positive().integer(),
    roomNumber: Yup.number().required('Required').positive().integer(),
});

export type roomType = {
    roomName: string;
    seatCapacity: number;
    roomNumber: number;
}

export const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
    ))(() => ({
        '& .MuiPaper-root': {
        borderRadius: 6,
        minWidth: 180,
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
    },
}));

const filterItems = [ 
    {
        label: 'All data',
        value: 'allTotal',
    }, {
        label: 'Room Number',
        value: 'roomNumber',
    }, {
        label: 'Room number + date',
        value: 'roomNumberNDate',
    }
]

export type adminPaginationType = {
    'totalRooms': number,
    'limit': number,
    'offset': number,
}

export type bookingPaginationType = {
    'totalBookings': number,
    'bookingLimit': number,
    'bookingOffset': number
}

const AdminRooms = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [roomNumDDopen, setRoomNumDDopen] = useState<boolean>(false);
    const [showInputs, setShowInputs] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true); //make it false for testing
    const [isCheckingAvail, setIsCheckingAvail] = useState<boolean>(false);
    const [token, setToken] = useState<string>('');
    const [rooms, setRooms] = useState<roomType[]>([]);
    const [fetchingMode, setFetchingMode] = useState<string>(filterItems[0].value);
    const [filteringData, setFilteringData] = useState<typeof initialValue>(initialValue);
    const [paginationData, setPaginationData] = useState<adminPaginationType>({
        totalRooms: 0,
        limit: 10,
        offset: 0
    });
    const [bookingPaginationData, setBookingPaginationData] = useState<bookingPaginationType>({
        totalBookings: 0,
        bookingLimit: 8,
        bookingOffset: 0
    });
    const showToast = useRef<boolean>(false)

    const primaryURL = () => `room-booking/getRoomDetails?limit=${paginationData.limit}&offset=${paginationData.offset}&bookingLimit=${bookingPaginationData.bookingLimit}&bookingOffset=${bookingPaginationData.bookingOffset}`
    const handleClose = () => setOpen(false)
    
    useEffect(() => {
        const admin = JSON.parse(localStorage.getItem('adminDetails') || '');
        setToken(admin?.token)
    }, []);

    const dialogInputs = [
        { id: 'seatCapacity', type: 'number', placeholder: 'Room Capacity' },
        { id: 'roomNumber', type: 'number', placeholder: 'Room Number' },
        { id: 'roomName', type: 'text', placeholder: 'Room Name' },
    ]

    const handleCreateRoom = async(value: roomType) => {
        const response = await axios.post(`${URL}/room-booking/create-room`, value, {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '69420',
                authorization: `token ${token}`,
            }
        })
        response?.status === 201 && showToastMsg(`${response?.data?.message}`)
        
        handleClose()

        if (response && response.data) setRooms((prev) => ([ ...prev, value ]))
    };

    // useEffect(() => {
    //     if (token !== '') getRoomDetails(primaryURL());
    // }, [token]);

    useEffect(() => {
        if(fetchingMode === 'allTotal') {
            setTimeout(() => {
                fetchConditionalData()
            }, 150);
        }
    }, [fetchingMode])

    const getRoomDetails: (endPoint: string) => void = async(endPoint) => {
        const requestHeader = {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420',
            authorization: `token ${token}`,
        }

        const finalURL = `${URL}/${endPoint}`

        try {
            const { data, status } = await axios.get(finalURL, { headers: requestHeader });

            if (status === 200) {
                setPaginationData(prev => ({
                    ...prev, 
                    totalRooms: data?.data?.totalRooms,
                    limit: data?.data?.limit || 10,
                    offset: data?.data?.offset
                }))
                
                setRooms(data?.data?.rooms || [])
                setLoading(false);
                console.log(data.data)
                // if(data.data === null && !showToast.current){
                //     showToastMsg(data.message)
                //     showToast.current=true
                // }
            } else {
                showToastMsg('Failed to fetch room details');
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) console.error('Axios error fetching room details:', error.response?.data?.message || error.message);
            else if (error instanceof Error) console.error('Error fetching room details:', error.message);
            else console.error('An unknown error occurred while fetching room details');
        }
    };

    const handleMenuSelection: (item: string) => void = (item) => {
        setShowInputs(true)
        setFetchingMode(item)
        setRoomNumDDopen(true)
    };

    const handleRoomSelection = (roomNumber: number) => {
        setFilteringData(prev => ({
            ...prev, roomNumber
        }))
    }

    const handleDateSelection = (bookingDate: Dayjs | null) => {
        setFilteringData(prev => ({
            ...prev, bookingDate
        }));
    };

    useEffect(() => {
        switch(fetchingMode) {
            case 'roomNumber':
                if(filteringData.roomNumber) setIsCheckingAvail(true)
                break;
            case 'roomNumberNDate':
                if(filteringData.roomNumber && filteringData.bookingDate) setIsCheckingAvail(true)
                break;
            default:
                setIsCheckingAvail(false)
                break;
        }
    }, [filteringData]);
    
    const fetchConditionalData = () => {
        switch(fetchingMode) {
            case 'allTotal':
                getRoomDetails(primaryURL());
                break;
            case 'roomNumber':
                if(filteringData.roomNumber) {
                    const newURL = `${primaryURL()}&roomNumber=${filteringData.roomNumber}`
                    getRoomDetails(newURL);
                } else showToastMsg('Enter a room number first')
                break;
            case 'roomNumberNDate':
                if(filteringData.roomNumber && filteringData.bookingDate) {
                    const newURL = `${primaryURL()}&roomNumber=${filteringData.roomNumber}&date=${filteringData.bookingDate.format('YYYY-MM-DD')}`
                    getRoomDetails(newURL);
                } else showToastMsg('Enter a room number and date first')
                break;
            default:
                showToastMsg('Select a valid filtering mode')
                break;
        }

        setShowInputs(false)
    }

    useEffect(() => {
        console.log(primaryURL())
        fetchConditionalData()
    }, [paginationData.offset])

    return (
        <div className=" bg-slate-400">
            {loading 
                ? <Loading /> 
                : <div className=" w-full h-fit flex items-center flex-col pt-16">
                    <AdminJobRoomTable 
                        rooms={rooms}
                        setPaginationData={setPaginationData}
                        paginationData={paginationData}
                        setBookingPaginationData={setBookingPaginationData}
                        bookingPaginationData={bookingPaginationData}
                    /> {/* change it to demoRoomData for testing */}
                </div>
            }
            
            <>
                <button className=" fixed bottom-3 left-20 bg-blue-900 rounded-full aspect-square w-10 flex items-center justify-center hover:rotate-90 transition-all duration-500 active:scale-90 group z-40 ring-[1px] ring-slate-400"
                onClick={() => setOpen(true)}>
                    <IoIosAdd className=" w-10 h-10 text-blue-300 group-active:scale-125 transition-all duration-500"/>
                </button> 

                <RoomNumDtFilter
                    filterItems={filterItems}
                    handleMenuSelection={handleMenuSelection}
                />
            </>

            {/* create room */}
            <DialogComponent
            open={open}
            setOpen={setOpen}>
                <div className="flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                    <div className="flex flex-col w-full p-4 justify-center items-center">
                        <Formik
                        initialValues={{ roomName: '', seatCapacity: NaN, roomNumber: NaN }}
                        validationSchema={validationSchema}
                        onSubmit={(values: roomType) => handleCreateRoom(values)}>
                            <Form className="bg-slate-700 rounded-md shadow-2xl p-5">
                                <h1 className="text-gray-300 font-bold text-2xl mb-1">Create Room</h1>
                                <p className="text-sm font-normal text-gray-100 mb-8">Enter room details</p>

                                {/* input fields */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    {dialogInputs.map(({ id, type, placeholder }) => (
                                        <div key={id} className={`flex items-center bg-slate-900 px-2 pb-2 rounded-lg ${id === 'roomName' ? ' col-span-2' : ''} flex flex-col-reverse items-start justify-start relative`}>
                                            <Field
                                                id={id}
                                                name={id}
                                                className="peer w-full bg-slate-800 pl-3 text-slate-200 border-none outline-none focus:outline-none rounded-lg py-1"
                                                type={type}
                                            />
                                            <label className={` text-blue-300 w-full pl-1 text-sm peer-focus-within:font-bold peer-focus-within:text-green-300 transition-all font-mono tracking-wider`}
                                            htmlFor={id}>
                                                {placeholder}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                {/* create, cancel button */}
                                <div className="flex items-center justify-between mt-8 gap-x-3">
                                    <button
                                    type="submit"
                                    className=" px-3 py-1.5 w-1/2 rounded-lg bg-indigo-600 text-indigo-300 hover:bg-indigo-300 hover:text-indigo-600 font-semibold">
                                        Create Room
                                    </button>

                                    <button
                                    onClick={handleClose}
                                    className=" px-3 py-1.5 w-1/2 font-semibold bg-cyan-700 hover:bg-cyan-200 text-cyan-200 hover:text-cyan-900 rounded-lg">
                                        Cancel
                                    </button>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </DialogComponent>

            {/* conditional room */}
            {fetchingMode !== 'allTotal' && (
                <DialogComponent
                open={showInputs}
                setOpen={setShowInputs}>
                    <>
                        <div className=" flex flex-col gap-5 p-4 h-96">
                            {fetchingMode === 'roomNumberNDate' && (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer
                                        components={[
                                            "DatePicker",
                                            "DatePicker",
                                            "DatePicker",
                                        ]}
                                    >
                                        <DatePicker
                                            label="Booking date"
                                            name="startDate"
                                            onChange={(date) => handleDateSelection(date)}
                                            minDate={dayjs()}
                                            value={filteringData?.bookingDate}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            )}

                            <Dropdown
                                mode={'admin'}
                                heading={"Room number"}
                                open={roomNumDDopen}
                                roomSelection={handleRoomSelection}
                                availData={{}}
                                roomNum={filteringData.roomNumber}
                            />
                        </div>

                        <div className=" flex items-center justify-between gap-4 p-2 font-robotoMono font-bold">
                            <button
                                className={`${
                                    !isCheckingAvail
                                        ? " cursor-not-allowed bg-indigo-700"
                                        : "active:scale-95 transition-all cursor-pointer bg-green-300 text-green-950"
                                } w-full p-2 rounded-lg text-blue-200`}
                                onClick={fetchConditionalData}
                                disabled={!isCheckingAvail}
                            >
                                Check
                            </button>

                            <button
                                className="w-full p-2 rounded-lg bg-red-950 text-red-200 active:scale-95 transition-all"
                                onClick={() => {
                                    setShowInputs(false)
                                    setFilteringData(initialValue)
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </>
                </DialogComponent>
            )}
        </div>
    )
}

export default AdminRooms;
