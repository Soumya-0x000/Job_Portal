import { motion } from "framer-motion"
import { FC, Fragment } from "react"
import { roomType, slotType } from "../components/admin/jobRooms/Rooms"
import { Tooltip, Typography } from "@mui/material"

const JobRoomTable: FC<{rooms: roomType[]}> = ({ rooms }) => {
    return (
        <div className=" flex flex-col gap-y-10">
            {rooms.map((room, indx) => (
                <motion.div key={(room?.roomId)?.concat(`${indx}`)}
                initial={{ y: -50, opacity: 0.5}}
                animate={{ y: 0, opacity: 1}}>
                    <div className=" px-4 pb-4 rounded-lg bg-slate-300 w-full">
                        <div className=" py-3 font-mavenPro text-slate-800 text-lg font-bold">
                            Created at {room?.createdAt} 
                        </div>

                        <div className=" flex items-center flex-wrap gap-2 mb-10">
                            {room?.slots?.map((slot: slotType, indx: number) => (
                                <Tooltip 
                                title={
                                    <Fragment>
                                        <Typography variant="subtitle1" component="span" color="inherit"
                                        sx={{
                                            fontWeight: 'bold',
                                            textTransform: 'capitalize',
                                            color: '#fcfb6e',
                                        }}>
                                            <span className=" font-oxanium">
                                                {slot?.isSlotAllocated ? 'Allocated' : 'Not allocated'}
                                            </span>
                                            <div className=" font-robotoMono">Slot {slot.slotCount}</div>
                                        </Typography>
                                    </Fragment>
                                }
                                key={indx} 
                                arrow>
                                    <button className={` aspect-square w-5 ${slot?.isSlotAllocated ? ' bg-green-500' : ' bg-slate-900'} rounded-lg`}/>
                                </Tooltip>
                            ))}
                        </div>

                        <div className=" relative">
                            <div className=" absolute -top-2 space-x-4">
                                <span className=" bg-slate-800 text-slate-300 px-3 py-2.5 rounded-md">
                                    {room?.roomName}
                                </span>
                                
                                <span className=" bg-slate-800 text-slate-300 px-3 py-2.5 rounded-md">
                                    Room number {room?.roomNumber}
                                </span>

                                <span className=" bg-slate-800 text-slate-300 px-3 py-2.5 rounded-md">
                                    Seats {room?.roomCapacity}
                                </span>

                                <span className=" bg-slate-800 text-slate-300 px-3 py-2.5 rounded-md">
                                    Available {room?.roomCapacity} seats
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

export default JobRoomTable