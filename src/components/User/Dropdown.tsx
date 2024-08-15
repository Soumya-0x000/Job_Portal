import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { generateUniqueId } from '../../common/UniqID';
import { Room } from './Job/UserJobRoomTable';
import axios from 'axios';
import { URL } from '../../API';
import { Loading } from '../../common/Loading';

const Dropdown: FC<{
    mode: 'user' | 'admin'
    heading: string;
    open: boolean;
    roomSelection: (roomNumber: number ) => void;
    roomNum: number;
    availData: Partial<{
        seatCapacity: number,
        numberOfBookings: number,
        availableSeats: number,
    }>
}> = ({ mode, heading, open, roomSelection, availData, roomNum }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [roomDetails, setRoomDetails] = useState<[]>([]);
    const [optionLoading, setOptionLoading] = useState<boolean>(true)

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelection = (room: Room) => {
        roomSelection(room?.roomNumber)
        toggleDropdown()
    }

    useEffect(() => {
        if (open) {
            mode === 'user'
                ? fetchRoomDetails(JSON.parse(localStorage.getItem('userDetails') || '[]').token)
                : fetchRoomDetails(JSON.parse(localStorage.getItem('adminDetails') || '[]').token)
        }
    }, [open])

    const fetchRoomDetails: (authToken: string) => void = async(authToken) => {
        const response = await axios.get(`${URL}/room-booking/checkExistingRooms`, {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '69420',
                authorization: `token ${authToken}`
            }
        });

        if (response.status === 200) {
            setRoomDetails(response.data)
            setOptionLoading(false)
        }
    }

    return (
        <div className="relative inline-block text-left min-w-[15rem]">
            <div>
                <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-12 focus:ring-indigo-500 font-lato tracking-wide text-[.95rem]"
                onClick={toggleDropdown}>
                    {heading} {roomNum ? roomNum : ''}
                    <svg
                        className={`-mr-1 ml-2 h-5 w-5 ${isOpen ? ' rotate-180' : ''} transition-all`}
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

            {isOpen && (
                <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none w-full">
                    <div className="py-1 w-full h-[14rem] overflow-y-scroll" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {optionLoading ? (
                            <div className=' w-full h-full flex items-center justify-center'>
                                <Loading />
                            </div>
                        ) : (<>
                            {roomDetails.map((rooms: Room, indx) => (
                                <div className=" cursor-pointer flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full font-lato" role="menuitem"
                                key={generateUniqueId() + indx}
                                onClick={() => handleSelection(rooms)}>
                                    <span className=' w-1/2 pl-8'>{rooms?.roomNumber}</span>
                                    <span className=' w-1/2'>{rooms?.roomName}</span>
                                </div>
                            ))}
                        </>)}
                    </div>
                </motion.div>
            )}

            {(Object.values(availData).length > 0) && (
                <table className="min-w-full border border-gray-300 shadow-md mt-10 rounded-lg overflow-hidden">
                    <thead className="bg-gray-200 font-mono">
                        <tr>
                            <th className="px-4 py-2 border-b border-gray-300 text-left font-semibold text-gray-700 border-r-2">
                                Capacity
                            </th>
                            <th className="px-4 py-2 border-b border-gray-300 text-left font-semibold text-gray-700 border-r-2">
                                Booked seats
                            </th>
                            <th className="px-4 py-2 border-b border-gray-300 text-left font-semibold text-gray-700">
                                Available
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className=" py-2 border-b border-gray-300 text-gray-800 text-center border-r-2">
                                {availData?.seatCapacity}
                            </td>
                            <td className=" py-2 border-b border-gray-300 text-gray-800 text-center border-r-2">
                                {availData?.numberOfBookings}
                            </td>
                            <td className=" py-2 border-b border-gray-300 text-gray-800 text-center">
                                {availData?.availableSeats}
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Dropdown;
