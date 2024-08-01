import { useEffect, useMemo, useState } from "react";
import { Loading } from "../../../common/Loading";
import { useLocation, useNavigate } from "react-router-dom";

type roomType = {
    roomName: string;
    roomCapacity: number;
    roomNumber: string;
}
const Rooms = () => {
    const initialValues: roomType = {
        roomName: '',
        roomCapacity: 0,
        roomNumber: ''
    }
    const [loading, setLoading] = useState<boolean>(true);
    const location = useLocation();
    const navigate = useNavigate();
    const [values, setValues] = useState<roomType>(initialValues);

    const memoizedRoomData = useMemo(() => {
        // if (location?.state) {
        //     return { roomName, roomCapacity, roomNumber } = location?.state?.value || {};
        // } else navigate('/')
    }, [])

    console.log(memoizedRoomData)

    // const roomArr = Array.from({ length: roomCapacity || 0}, (_, indx) => indx)
    
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 600);
    }, []);

    return (
        <div className=" bg-slate-500 h-screen w-screen pb-20 overflow-y-scroll">
            {loading 
                ? <Loading /> 
                : <div className=" w-full h-full flex items-center justify-center flex-col">
                    {/* <div className=" max-w- [50.5rem] px-4 pt-4 rounded-lg bg-slate-400 space-y-9">
                        <div className=" flex items-center flex-wrap gap-2">
                            {roomArr.map((_, indx) => (
                                <div key={indx} className=" aspect-square w-5 bg-slate-900 rounded-lg"/>
                            ))}
                        </div>

                        <div className="">
                            <span className=" bg-slate-800 text-slate-300">
                                {roomName}
                            </span>
                            {roomNumber}
                        </div>
                    </div> */}
                </div>
            }
        </div>
    )
}

export default Rooms;
