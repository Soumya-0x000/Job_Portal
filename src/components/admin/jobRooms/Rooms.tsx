import { forwardRef, ReactElement, Ref, useEffect, useState } from "react";
import { Loading } from "../../../common/Loading";
import { IoIosAdd } from "react-icons/io";
import { Dialog, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import * as Yup from 'yup';
import { Field, Form, Formik, FormikErrors, FormikTouched } from "formik";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement;
    },
    ref: Ref<unknown>,
    ) {
        return <Slide direction="up" ref={ref} {...props} />;
    }
);

const validationSchema = Yup.object({
    roomName: Yup.string().required('Required'),
    roomCapacity: Yup.number().required('Required').positive().integer(),
    roomNumber: Yup.string().required('Required'),
});

type roomType = {
    roomName: string;
    roomCapacity: number;
    roomNumber: string;
    createdAt?: string;
}

const Rooms = () => {
    const initialValues: roomType = {
        roomName: '',
        roomCapacity: 0,
        roomNumber: '',
        createdAt: ''
    }
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentValue, setCurrentValue] = useState<roomType>(initialValues);
    const [rooms, setRooms] = useState<roomType[]>([]);
    // const dispatch = useDispatch();

    const handleClose = () => setOpen(false)

    const roomArr = Array.from({ length: currentValue?.roomCapacity || 0}, (_, indx) => indx)
    
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 600);
    }, []);

    const dialogInputs = [
        { id: 'roomCapacity', type: 'number', placeholder: 'Room Capacity' },
        { id: 'roomNumber', type: 'text', placeholder: 'Room Number' },
        { id: 'roomName', type: 'text', placeholder: 'Room Name' },
    ]

    const handleSubmit = (value: roomType) => {
        const newValue = {
            ...value,
            createdAt: new Date().toISOString().split('T')[0]
        }
        setRooms(prev => ([ ...prev, newValue ]))
        setCurrentValue(value)
        handleClose()
    };

    return (
        <div className=" bg-slate-400 h-screen w-screen pb-20 overflow-y-scroll">
            {loading 
                ? <Loading /> 
                : <div className=" w-full h-screen flex items-center flex-col pt-20 pb-5 px-3 md:px-5 xl:px-8 overflow-y-scroll">
                    <button className=" fixed bottom-8 right-8 bg-blue-900 rounded-full aspect-square w-10 flex items-center justify-center hover:rotate-90 transition-all duration-500 active:scale-90 group"
                    onClick={() => setOpen(true)}>
                        <IoIosAdd className=" w-10 h-10 text-blue-300 group-active:scale-125 transition-all duration-500"/>
                    </button>

                    <div className=" flex flex-col gap-y-10">
                        {rooms.map((room, indx) => (
                            <motion.div key={indx}
                            initial={{ y: -50, opacity: 0.5}}
                            animate={{ y: 0, opacity: 1}}>
                                <div className=" px-4 pb-4 rounded-lg bg-slate-300 w-full">
                                    <div className=" py-3 font-mavenPro text-slate-800 text-lg font-bold">
                                        Created at {room?.createdAt} 
                                    </div>

                                    <div className=" flex items-center flex-wrap gap-2 mb-10">
                                        {roomArr.map((_, indx) => (
                                            <div key={indx} className=" aspect-square w-5 bg-slate-900 rounded-lg"/>
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
                </div>
            }

            <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description">
                <div className="flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                    <div className="flex flex-col w-full p-4 justify-center items-center">
                        <Formik
                        initialValues={{ roomName: '', roomCapacity: NaN, roomNumber: '' }}
                        validationSchema={validationSchema}
                        onSubmit={(values: roomType) => handleSubmit(values)}>
                        {({ errors, touched }) => (
                            <Form className="bg-slate-700 rounded-md shadow-2xl p-5">
                                <h1 className="text-gray-300 font-bold text-2xl mb-1">Create Room</h1>
                                <p className="text-sm font-normal text-gray-100 mb-8">Enter room details</p>

                                {/* input fields */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    {dialogInputs.map(({ id, type, placeholder }) => (
                                        <div key={id} className={`flex items-center bg-slate-900 p-2 rounded-lg ${id === 'roomName' ? ' col-span-2' : ''}`}>
                                            <Field
                                                id={id}
                                                name={id}
                                                className="w-full bg-slate-800 pl-3 text-slate-200 border-none outline-none focus:outline-none rounded-lg py-1"
                                                type={type}
                                                placeholder={placeholder}
                                            />
                                            {(errors as FormikErrors<roomType>)[id as keyof roomType] && (touched as FormikTouched<roomType>)[id as keyof roomType] && (
                                                <div className="text-red-500 text-sm">{(errors as FormikErrors<roomType>)[id as keyof roomType]}</div>
                                            )}
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
                        )}
                        </Formik>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default Rooms;
