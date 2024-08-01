import { Dispatch, FC, SetStateAction } from "react";
import { Candidate } from "../../../common/DemoData";
import { Dropdown } from "../AdminPanel";

interface JobCardProps {
    candidateData: Candidate[];
    setCandidateData: Dispatch<SetStateAction<Candidate[]>>;
    candidate: Candidate
}

const JobCard: FC<JobCardProps> = ({ candidateData, setCandidateData, candidate }) => {
    const handleStatusChange = (currentStatus: string, id: number | string) => {
        const updatedCandidates: Candidate[] = candidateData.map(candidate => {
            if (candidate.id === id) {
                return { ...candidate, status: currentStatus.toLowerCase() as Candidate['status'] };
            }
            return candidate;
        });
        setCandidateData(updatedCandidates);
        localStorage.setItem('demoCandidateData', JSON.stringify(updatedCandidates));
    };

    return (
        <div className="bg-slate-600 rounded-lg w-full lg:w-[25rem] px-2 py-2 flex flex-col justify-between">
            <div className="w-full bg-slate-900 py-2 px-3 text-yellow-300 text-lg rounded-t-lg font-bold">
                {candidate.name}
            </div>

            <div className='mt-5 flex items-center gap-x-2'>
                {candidate.email && (
                    <div className="bg-slate-900 rounded-xl px-2 py-1 w-fit text-slate-200">
                        {candidate.email}
                    </div>
                )}

                {candidate.phone && (
                    <div className="bg-slate-900 rounded-xl px-2 py-1 w-fit text-slate-200">
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

            <div className='flex items-center justify-between gap-x-2'>
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
    )
}

export default JobCard;
