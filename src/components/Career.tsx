import { FC, useEffect, useState } from "react";
import { Loading } from "../common/Loading";
import { demoJobRoles, jobRoleTypes } from "../common/DemoData";
import { useLocation } from "react-router-dom";

const Career: FC = () => {
    const [loading, setLoading] = useState(true);
    const [appliedJob, setAppliedJob] = useState<string | null>(null);
    const location = useLocation();
    const formData = location?.state?.values

    const handleApply = (jobId: string) => {
        if (formData) {
            const currentCandidates = JSON.parse(localStorage.getItem('demoCandidateData') || '[]');
            formData.id = currentCandidates.length + 1
            formData.jobRole = demoJobRoles.find(job => job.id === jobId)?.title || '';
            formData.status = 'pending';
            formData.filename = formData.resume ? formData.resume.name : '';

            const updatedCandidates = [...currentCandidates, formData];
            localStorage.setItem('demoCandidateData', JSON.stringify(updatedCandidates));

            setAppliedJob(jobId);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 600);
    }, []);

    return (
        <div className='h-full overflow-y-auto w-full py-10 flex items-center justify-center px-4 bg-slate-400 rounded-lg min-h-screen'>
            {loading 
                ? <Loading />
                : <div className=" grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-10 Llg:grid-cols-3 2xl:grid-cols-4 xl:gap-8 2xl:gap-6 mt-20">
                    {demoJobRoles.map((job, indx) => (
                        <JobCard key={indx} job={job} applied={appliedJob} onApply={handleApply} />
                    ))}
                </div>
            }
        </div>
    );
}

export default Career;

interface jobCardType {
    job: jobRoleTypes;
    applied: string | null;
    onApply: (jobId: string) => void;
}

const JobCard: FC<jobCardType> = ({ job, applied, onApply }) => {
    const isApplied = applied === job.id;

    const handleApply = () => {
        if (!isApplied) onApply(job.id)
    };

    return (
        <div className=" bg-slate-700 rounded-lg overflow-hidden w-[21rem] px-2 py-2 flex flex-col justify-between">
            <>
                <div className=" w-full bg-slate-900 py-2 px-3 text-yellow-300 text-lg rounded-t-lg font-bold">
                    {job.title}
                </div>

                {job.description && (
                    <div className=" mt-5 bg-slate-800 rounded-lg px-2 py-1 w-full text-slate-200">
                        {job.description}
                    </div>
                )}

                {job.requirements && (
                    <div className=" flex items-center gap-x-1 gap-y-2 flex-wrap mt-4">
                        {job.requirements.split(', ').map((item, indx) => (
                            <div key={indx} className=" text-green-300 bg-slate-900 w-fit rounded-full py-1 px-2 text-[13px]">{item}</div>
                        ))}
                    </div>
                )}

                {job.experience && (
                    <div className=" rounded-md py-1 px-2 bg-slate-950 text-indigo-300 mt-4 ">
                        {job.experience}
                    </div>
                )}
            </>

            <button
            style={{ 
                backgroundColor: isApplied ? '#FF5D5D' : applied !== null ? "#f0ff5d" : '#5DFF89', 
                color: isApplied ? '#430202' : applied !== null ? "#737204" :'#003E11' }}
            onClick={handleApply}
            disabled={isApplied || applied !== null}
            className=" rounded-md py-1 px-2 mt-4 active:scale-95 transition-all font-bold">
                {isApplied ? "Applied" : applied !== null ? "Can't Apply" : "Apply"}
            </button>
        </div>
    );
};
