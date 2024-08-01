import { motion } from 'framer-motion';
import { FC, ReactNode, useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../../API';
import AdminNav from './AdminNav';
import { Outlet } from 'react-router-dom';

const AdminPanel: FC = () => {
    const [scrolled, setScrolled] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => (window.scrollY > 14) 
                ? setScrolled(true)
                : setScrolled(false)

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });

    useEffect(() => {
        (async() => {
            const response = await axios.get(URL);
            console.log(response?.data)
        })()
    }, []);

    return (
        <div className=' bg-slate-400 min-h-screen w-full'>
            <AdminNav scrolled={scrolled}/>
            <Outlet/>
        </div>
    );
}

export default AdminPanel;

interface DropdownProps {
    children: ReactNode;
    id: number | string;
    onStatusChange: (status: string, id: number | string) => void;
}

export const Dropdown: FC<DropdownProps> = ({ children, id, onStatusChange }) => {
    const [isHover, toggleHover] = useState(false);
    const toggleHoverMenu = () => toggleHover(!isHover);

    const candidateStatusArr = () => {
        const statusArr: string[] = ['Pending', 'Approved'];

        return statusArr.map(status => ({
            name: status,
            onClick: () => onStatusChange(status.toLowerCase(), id)
        }));
    };

    const subMenuAnimate = {
        enter: {
            opacity: 1,
            rotateX: 0,
            transition: {
                duration: 0.2
            },
            display: "block"
        },
        exit: {
            opacity: 0,
            rotateX: -15,
            transition: {
                duration: 0.2,
                delay: 0.1
            },
            transitionEnd: {
                display: "none"
            }
        }
    };

    return (
        <motion.div
            className="relative"
            onHoverStart={toggleHoverMenu}
            onHoverEnd={toggleHoverMenu}>
            {children}
            <motion.div
                className="sub-menu absolute right-0"
                initial="exit"
                animate={isHover ? "enter" : "exit"}
                variants={subMenuAnimate}>
                <div className="sub-menu-background" />
                <div className=" flex flex-col gap-y-2 w-[7rem] md:w-[10rem] ring-1 ring-yellow-200 bg-slate-900 p-2 rounded-lg">
                    {candidateStatusArr().map((status, index) => (
                        <button className={`w-full flex justify-center rounded-lg py-2 active:scale-95 transition-all`}
                            key={index}
                            onClick={status.onClick}
                            style={{ 
                                backgroundColor: status.name.toLowerCase() === 'pending' ? '#FF5D5D' : '#5DFF89', 
                                color: status.name.toLowerCase() === 'pending' ? '#430202' : '#003E11' 
                            }}>
                            {status.name}
                        </button>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};
