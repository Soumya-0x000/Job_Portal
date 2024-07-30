import { motion } from 'framer-motion';
import { FC, ReactNode, useEffect, useState } from 'react';
import { Candidate } from '../../common/DemoData';
import { Loading } from '../../common/Loading';

const AdminPanel: FC = () => {
    const [loading, setLoading] = useState(true);
    const [candidateData, setCandidateData] = useState<Candidate[]>(JSON.parse(localStorage.getItem('demoCandidateData') || '[]'))

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 600);

        const candidateDetails = JSON.parse(localStorage.getItem('demoCandidateData') || '[]')
        setCandidateData(candidateDetails)
    }, []);

    const handleStatusChange = (currentStatus: string, id: number | string) => {
        const updatedCandidates: Candidate[] = candidateData.map(candidate => {
            if (candidate.id === id) {
                return { ...candidate, status: currentStatus.toLowerCase() as Candidate['status'] };
            }
            return candidate;
        });
        setCandidateData(prevCandidates => [...prevCandidates, ...updatedCandidates]);
        localStorage.setItem('demoCandidateData', JSON.stringify(updatedCandidates));
    };

    return (
        <div className='min-h-screen w-full flex items-center justify-center bg-slate-400 overflow-y-auto px-4 py-6'>
            {loading 
                ? <Loading />
                : <div className=' grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 Cxl:grid-cols-3 cxl:gap-4 2xl:grid-cols-4 Lxl:gap-5'>
                    {candidateData.map((candidate: Candidate) => (
                        <div key={candidate.id}>
                            <div className="bg-slate-600 rounded-lg w-[25rem] px-2 py-2 flex flex-col justify-between">
                                <div className="w-full bg-slate-900 py-2 px-3 text-yellow-300 text-lg rounded-t-lg font-bold">
                                    {candidate.name}
                                </div>

                                <div className='mt-5 flex items-center gap-x-2'>
                                    {candidate.email && (
                                        <div className=" bg-slate-900 rounded-xl px-2 py-1 w-fit text-slate-200">
                                            {candidate.email}
                                        </div>
                                    )}

                                    {candidate.phone && (
                                        <div className=" bg-slate-900 rounded-xl px-2 py-1 w-fit text-slate-200">
                                            {candidate.phone}
                                        </div>
                                    )}
                                </div>

                                {candidate.address && (
                                    <div className="mt-5 bg-slate-900 rounded-lg px-2 py-1 w-full text-slate-200">
                                        Address: {candidate.address}
                                    </div>
                                )}

                                {candidate.filename && (
                                    <div className="mt-2 bg-slate-900 rounded-lg px-2 py-1 w-full text-slate-200">
                                        Resume: {candidate.filename}
                                    </div>
                                )}

                                <div className=' flex items-center justify-between gap-x-2'>
                                    {candidate.jobRole && (
                                        <div className="mt-5 bg-slate-800 rounded-xl px-3 py-1 w-fit text-cyan-200">
                                            {candidate.jobRole}
                                        </div>
                                    )}

                                    {candidate.status && (
                                        <Dropdown id={candidate.id} onStatusChange={handleStatusChange}>
                                            <button
                                                className="rounded-md py-1 px-2 bg-slate-950 text-indigo-300 mt-4"
                                                style={{ 
                                                    backgroundColor: candidate.status === 'pending' ? '#FF5D5D' : '#5DFF89', 
                                                    color: candidate.status === 'pending' ? '#430202' : '#003E11' 
                                                }}>
                                                {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                                            </button>
                                        </Dropdown>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            }
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
