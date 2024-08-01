import { motion } from 'framer-motion';
import { FC, ReactNode, useEffect, useState } from 'react';
import { Candidate } from '../../common/DemoData';
import { Loading } from '../../common/Loading';
import axios from 'axios';
import { URL } from '../../API';
import JobCard from './JobCard';
import { Pagination, Stack } from '@mui/material';

const AdminPanel: FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [candidateData, setCandidateData] = useState<Candidate[]>(JSON.parse(localStorage.getItem('demoCandidateData') || '[]'))

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 600);

        const candidateDetails = JSON.parse(localStorage.getItem('demoCandidateData') || '[]')
        setCandidateData(candidateDetails)
    }, []);

    useEffect(() => {
        (async() => {
            const response = await axios.get(URL);
            console.log(response?.data)
        })()
    }, []);

    return (
        <div className='min-h-screen w-full flex flex-col items-center justify-center bg-slate-400 overflow-y-auto px-4 py-6'>
            {loading 
                ? <Loading />
                : <JobCard  
                    candidateData={candidateData}
                    setCandidateData={setCandidateData}
                    pageCount={currentPage}
                />
            }

            <div className='bg-slate-100 rounded-lg px-3 py-2 fixed bottom-0 mb-2' style={{ boxShadow: '0 14px 16px rgba(0, 0, 0, 0.1), 0 20px 14x rgba(0, 0, 0, 0.1)' }}>
                <Stack spacing={2}>
                    <Pagination 
                        page={currentPage} 
                        onChange={(_, value) => setCurrentPage(value)} 
                        count={10} 
                        variant="outlined" 
                        shape="rounded" 
                    />
                </Stack>
            </div>
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
