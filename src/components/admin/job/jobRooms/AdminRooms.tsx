import { useEffect, useState } from "react";
import { Loading } from "../../../../common/Loading";
import { IoIosAdd } from "react-icons/io";
import * as Yup from 'yup';
import { Field, Form, Formik } from "formik";
import axios from "axios";
import { URL } from "../../../../API";
import { showToastMsg } from "../../../../common/ToastMsg";
import { AdminJobRoomTable } from "./AdminJobRoomTable";
import { demoRoomData, roomDataType } from "../../../../common/DemoData";
import { DialogComponent } from "../../../../common/DialogComponent";
import { motion } from "framer-motion";
import { generateUniqueId } from "../../../../common/UniqID";

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

const filterItems = [ 'All data', 'Only date', 'Room number + date' ]

const AdminRooms = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false); //make it true
    const [token, setToken] = useState<string>('');
    const [rooms, setRooms] = useState<roomType[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [fetchingMode, setFetchingMode] = useState<string>(filterItems[0]);

    const toggleDropdown = () => setIsDropdownOpen(prev => !prev)

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

    const handleSubmit = async(value: roomType) => {
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

    useEffect(() => {
        if (token) getAllRoomDetails();
    }, [token]);
    
    const getAllRoomDetails = async () => {
        const requestHeader = {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420',
            authorization: `token ${token}`,
        }

        const isRoomDataType = (data: unknown): data is roomDataType[] => {
            return Array.isArray(data) && data.every(room =>
                typeof room.roomName === 'string' &&
                typeof room.seatCapacity === 'number' &&
                typeof room.roomNumber === 'number' &&
                (room.appliedCandidates === undefined || Array.isArray(room.appliedCandidates))
            );
        };

        try {
            const response = await axios.get(`${URL}/room-booking/getRoomDetails`, {
                headers: requestHeader
            });

            if (response.status && isRoomDataType(response.data)) {
                setRooms(response.data);
                setLoading(false);
            } else showToastMsg('Invalid data format received.');
            setRooms(response.data);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error fetching room details:', error.response?.data?.message || error.message);
            } else if (error instanceof Error) {
                console.error('Error fetching room details:', error.message);
            } else {
                console.error('An unknown error occurred while fetching room details');
            }
        }
    };

    const handleSelection: (item: string) => void = (item) => {
        setShowFilters(false)
        setFetchingMode(item)
    };

    useEffect(() => {}, [fetchingMode]);

    return (
        <div className=" bg-slate-400">
            {loading 
                ? <Loading /> 
                : <div className=" w-full h-fit flex items-center flex-col pt-16">
                    <AdminJobRoomTable rooms={demoRoomData}/> {/* change it to rooms */}
                </div>
            }
            
            <>
                <button className=" fixed bottom-3 left-20 bg-blue-900 rounded-full aspect-square w-10 flex items-center justify-center hover:rotate-90 transition-all duration-500 active:scale-90 group z-40 ring-[1px] ring-slate-400"
                onClick={() => setOpen(true)}>
                    <IoIosAdd className=" w-10 h-10 text-blue-300 group-active:scale-125 transition-all duration-500"/>
                </button>

                <button className=" fixed bottom-3 right-3 bg-blue-900 text-blue-200 tracking-wide font-montserrat rounded-lg py-1.5 px-3 flex items-center justify-center hover:bg-blue-950 transition-all duration-500 active:scale-90 group z-40 ring-[1px] ring-slate-400"
                onClick={() => setShowFilters(true)}>
                    Filter
                </button>
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
                        onSubmit={(values: roomType) => handleSubmit(values)}>
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

            {/* search room */}
            <DialogComponent
            open={showFilters}
            setOpen={setShowFilters}>
                <div className="relative inline-block text-left h-[11.2rem] px-5 py-3">
                    <div>
                        <button
                        type="button"
                        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-12 focus:ring-indigo-500 font-lato tracking-wide text-[.95rem]"
                        onClick={toggleDropdown}>
                            Fetching filter
                            <svg
                                className={`-mr-1 ml-2 h-5 w-5 ${isDropdownOpen ? ' rotate-180' : ''} transition-all`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>

                    {isDropdownOpen && (
                        <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none w-full">
                            <div className="py-1 w-full h-full overflow-y-scroll flex items-center justify-center flex-col" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                {filterItems.map((item, indx) => (
                                    <button className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-[11rem] ring-1 rounded-md gap-2 bg-slate-200 font-lato active:scale-105 transition-all" role="menuitem"
                                    key={generateUniqueId() + indx}
                                    onClick={() => handleSelection(item)}>
                                        <span>{item}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </DialogComponent>
        </div>
    )
}

export default AdminRooms;
