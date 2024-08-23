import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Error404 = () => {
    const [isLottieLoading, setIsLottieLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    return (  
        <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
            <div className="container flex flex-col md:flex-row items-center justify-center gap-12 px-5 text-gray-700">
                <div className=" space-y-5 h-full">
                    <p className="text-2xl md:text-3xl font-bold font-lato">
                        Sorry we couldn't find this page.
                    </p>

                    <p className="">But dont worry, you can find plenty of other things on our homepage.</p>
                
                    <div className=" animate-pulse px-4 w-fit py-2 text-sm font-medium shadow text-white transition-colors duration-150 cursor-pointer font-mono border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue bg-blue-600 active:bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate('/')}>
                        Back to homepage
                    </div>
                </div>

                <div className="max-w-lg flex items-center justify-center">
                    {isLottieLoading && (
                        <div className=" hidden md:flex items-center justify-center pr-10 w-[20rem] lg:w-[25rem]">
                            <span style={{ borderTopColor: "transparent" }} className="aspect-square h-10 border-4 border-blue-700 rounded-full animate-spin"></span>
                        </div>
                    )}

                    <iframe 
                        src="https://lottie.host/embed/f95550d1-48a9-4a80-8eb3-0f9776674662/h2qlSEXLqE.json" 
                        className="w-[20rem] lg:w-[25rem] aspect-square"
                        onLoad={() => setIsLottieLoading(false)}
                    />
                </div>
            </div>
        </div>
    )
}

export default Error404;
