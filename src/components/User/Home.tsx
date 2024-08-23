import { FC, useEffect, useState } from "react";
import { Loading } from "../../common/Loading";
import { JobApplyForm } from "./Job/JobApplyForm";

const Home: FC = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 600);
    }, []);

    return (
        <div className="h-screen overflow-y-auto w-full pt-10 flex items-center justify-center bg-gradient-to-r from-[#e9ffff] to-[#d3ebff] px-4 relative">
            {loading ? (
                <Loading />
            ) : (
                <div className=" h-full w-full flex items-end pb-4 md:pb-0 md:items-center justify-center">
                    <JobApplyForm />
                </div>
            )}
        </div>
    );
}

export default Home;
