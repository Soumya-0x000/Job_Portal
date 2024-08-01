import { FC, forwardRef, ReactElement, ReactNode, Ref, useState } from "react";
import { BiLogOutCircle } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { IoIosCreate } from "react-icons/io";
import { Dialog, Slide } from "@mui/material";
import { Formik, Field, Form, FormikErrors, FormikTouched } from 'formik';
import * as Yup from 'yup';
import { LiaStreetViewSolid } from "react-icons/lia";
import { TransitionProps } from "@mui/material/transitions";

interface btnArrType {
    name: string;
    icon: ReactNode;
    clickEvent: () => void;
}

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
}

const AdminNav: FC<{ scrolled: boolean }> = ({ scrolled }) => {
    const [open, setOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleClose = () => setOpen(false)

    const buttonArr: btnArrType[] = [
        {
            name: 'LogOut',
            icon: <BiLogOutCircle className=" text-[1.4rem]"/>,
            clickEvent: () => navigate('/') 
        }, {
            name: 'Create Room',
            icon: <IoIosCreate className=" text-[1.4rem]"/>,
            clickEvent: () => setOpen(true)
        }
    ]

    const dialogInputs = [
        { id: 'roomCapacity', type: 'number', placeholder: 'Room Capacity' },
        { id: 'roomNumber', type: 'text', placeholder: 'Room Number' },
        { id: 'roomName', type: 'text', placeholder: 'Room Name' },
    ]

    const handleSubmit: (value: roomType) => void = (value) => {
        navigate('rooms', {state: {value}})
        handleClose()
    };

    return (
        <>
            <nav className={`fixed w-full rounded-b-md h-14 flex items-center justify-between ${scrolled ? ' bg-slate-800 text-slate-200' : ' bg-slate-300'} transition-all duration-300 shadow-md shadow-slate-600 z-50 px-3`}>
                <div>
                    Admin
                </div>

                <div className=" flex gap-x-4">
                    {buttonArr.map((item, index) => (
                        <button
                        key={index}
                        className={`flex items-center gap-x-2 justify-center text-[16px] ${scrolled ? 'bg-gradient-to-b from-green-900 to-lime-800 text-green-200 border-green-300' : 'bg-indigo-900 border-violet-400 text-indigo-300'} border-b-2 px-2 py-1 active:scale-95 active:rounded-lg transition-all rounded-t-md`}
                        onClick={item.clickEvent}>
                            {item.icon}
                            {item.name}
                        </button>
                    ))}
                </div>
            </nav>

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
                                        <div key={id} className={`flex items-center ring-1 bg-slate-900 p-2 rounded-lg ${id === 'roomName' ? ' col-span-2' : ''}`}>
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

                                {/* create room button */}
                                <button
                                type="submit"
                                className="flex items-center justify-center gap-x-2 w-full bg-indigo-600 mt-4 py-2 rounded-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold">
                                    Create Room
                                </button>

                                {/* dialog footer part */}
                                <div className="flex items-center justify-between mt-4 pb-2">
                                    <button
                                    onClick={handleClose}
                                    className="text-sm hover:text-cyan-900 hover:bg-cyan-200 text-cyan-200 bg-cyan-700 px-3 py-2 rounded-lg">
                                        Cancel
                                    </button>

                                    <Link to={'/rooms'} className="bg-gradient-to-r from-green-800 to-green-700 text-green-300 text-[.9rem] flex items-center justify-center gap-x-2 rounded-lg py-2 px-3">
                                        View Rooms
                                        <LiaStreetViewSolid  className="text-xl" />
                                    </Link>
                                </div>
                            </Form>
                        )}
                        </Formik>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default AdminNav;
