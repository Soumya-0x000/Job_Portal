import { MdAdminPanelSettings, MdOutlineAdminPanelSettings } from "react-icons/md";

interface CheckAdminStatus {
    isAdmin: boolean;
    setIsAdmin: (isAdmin: boolean) => void;
}

const CheckAdmin: React.FC<CheckAdminStatus> = ({ setIsAdmin, isAdmin}) => {
    const handleAdminStatus = () => setIsAdmin(!isAdmin)

    return (
        <div className=' flex items-center text-md'>
            <div className={` cursor-pointer active:scale-105 transition-all ring-1 rounded-lg ${isAdmin ? 'text-green-300 ring-green-300 ' : ' text-red-400 ring-red-400 '} px-2 py-1 font-bold flex items-center justify-center gap-x-1 bg-slate-900 text-sm`}
            onClick={handleAdminStatus}>
                {isAdmin
                    ? <MdAdminPanelSettings className=" text-[1.4rem]"/>
                    : <MdOutlineAdminPanelSettings className=" text-[1.4rem]"/>
                }
                <span>
                    Admin
                </span>
            </div>
        </div>
    )
}

export default CheckAdmin;
