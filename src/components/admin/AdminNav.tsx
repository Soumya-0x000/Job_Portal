import { FC, ReactNode } from "react";
import { BiLogOutCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { IoIosCreate } from "react-icons/io";

interface btnArrType {
    name: string;
    icon: ReactNode;
    clickEvent: () => void;
}

const AdminNav: FC<{ scrolled: boolean }> = ({ scrolled }) => {
    const navigate = useNavigate();

    const buttonArr: btnArrType[] = [
        {
            name: 'LogOut',
            icon: <BiLogOutCircle className=" text-[1.4rem]"/>,
            clickEvent: () => navigate('/') 
        }, {
            name: 'Room',
            icon: <IoIosCreate className=" text-[1.4rem]"/>,
            clickEvent: () => navigate('rooms')
        }
    ]

    return (
        <nav className={`fixed w-full rounded-b-md h-14 flex items-center justify-between ${!scrolled ? ' bg-slate-800 text-slate-200' : ' bg-slate-100'} transition-all duration-300 shadow-md shadow-slate-600 z-50 px-3`}>
            <div className=" shadow- md shadow- slate-700 font-bold text-lg">
                Admin
            </div>

            <div className=" flex gap-x-4">
                {buttonArr.map((item, index) => (
                    <button
                    key={index}
                    className={`flex items-center gap-x-2 justify-center text-[16px] ${scrolled ? 'bg-gradient-to-b from-green-900 to-lime-800 text-green-200 border-green-300' : 'bg-indigo-900 ring-[1px] ring-indigo-300 border-violet-400 text-indigo-300'} border-b-2 px-2 py-1 active:scale-95 active:rounded-lg transition-all rounded-t-md`}
                    onClick={item.clickEvent}>
                        {item.icon}
                        {item.name}
                    </button>
                ))}
            </div>
        </nav>
    )
}

export default AdminNav;
