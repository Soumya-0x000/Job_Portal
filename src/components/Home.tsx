import { FC, useEffect, useState } from "react";
import { Loading } from "../common/Loading";
import { JobApplyForm } from "./JobApplyForm";
import { BackgroundBeams } from "../animations/BackgroundBeams";

const Home: FC = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 600);
    }, []);

    return (
        <div className='h-screen overflow-y-auto w-full pt-10 flex items-center justify-center bg-[#272e3f] px-4 relative'>
            {loading 
                ? <Loading />
                : <div className=' h-full w-full flex items-center justify-center'>
                        <JobApplyForm/>      
                </div>
            }
            <BackgroundBeams/>
        </div>
    );
}

export default Home;
