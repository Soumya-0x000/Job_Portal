import { Pagination, Stack } from "@mui/material"
import JobCard from "./JobCard"
import { FC, useEffect, useState } from "react";
import { Candidate } from "../../../common/DemoData";
import { Loading } from "../../../common/Loading";

const ShowJobs: FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [candidateData, setCandidateData] = useState<Candidate[]>(JSON.parse(localStorage.getItem('demoCandidateData') || '[]'))
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage: number = 9;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const selectedCandidates = candidateData.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 600);
    }, []);

    return (
        <div className=' flex items-center justify-center overflow-y-auto px-4 pt-20 pb-6'>
            {loading 
                ? <div className=" flex items-center justify-center w-full h-screen">
                    <Loading /> 
                </div>
                : <>
                    <div className='grid grid-cols-1 Lmd:grid-cols-2 gap-4 sm:grid-cols-2 md:gap-6 Cxl:grid-cols-3 cxl:gap-4 Lxl:gap-5'>
                        {selectedCandidates.map((candidate: Candidate) => (
                            <div key={candidate.id}>
                                <JobCard  
                                    candidate={candidate}
                                    candidateData={candidateData}
                                    setCandidateData={setCandidateData}
                                />
                            </div>
                        ))}
                    </div>

                    <div className='bg-slate-100 rounded-lg px-3 py-2 fixed bottom-0 mb-2' style={{ boxShadow: '0 14px 16px rgba(0, 0, 0, 0.1), 0 20px 14x rgba(0, 0, 0, 0.1)' }}>
                        <Stack spacing={2}>
                            <Pagination 
                                page={currentPage} 
                                onChange={(_, value: number) => setCurrentPage(value)} 
                                count={Math.ceil(candidateData.length / itemsPerPage)} 
                                variant="outlined" 
                                shape="rounded" 
                            />
                        </Stack>
                    </div>
                </>
            }
        </div>
    )
}

export default ShowJobs