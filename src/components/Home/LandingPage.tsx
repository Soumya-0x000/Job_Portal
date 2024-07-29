import { FC, ReactElement, useState } from 'react';
import { motion } from 'framer-motion';
import { GoSearch } from "react-icons/go";
import { TbDatabaseSearch } from "react-icons/tb";
import { FaArrowRightLong } from "react-icons/fa6";
import banner from '../../images/banner/homeback.jpg';
import statBg from '../../images/stats/statBg.jpg';
import { buttonsData, coursesCard, onlineCourses, statCard, tabs } from '../../common/DemoData';
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { TiStarFullOutline  } from "react-icons/ti";
import { Footer } from '../../common/Footer';
import AboutUs from '../AboutUs';
import { NavBar } from '../../common/Navbar';
import ContactUs from '../ContactUs';
import Home from '../Home';

interface BtnCardType {
    imgSrc: string;
    alt: string;
    text: string;
    bgColor: string;
    textColor: string;
    titleColor: string;
}

const ButtonWithCard: FC<BtnCardType> = ({ imgSrc, alt, text, bgColor, textColor, titleColor }) => {
    return (
        <div className={` cursor-pointer max-w-[38rem] md:h-[14.5rem] xl:h-[14rem] ${bgColor} px-4 py-3 rounded-lg overflow-hidden group/bento hover:shadow-xl transition duration-200 shadow-input `}>
            <div className='flex flex-col items-start justify-between transition duration-200 gap-y-6 group-hover/bento:translate-x-2'>
                <div className='space-y-2 '>
                    <div className=' w-16 h-16 rounded-lg p-[.3rem] overflow-hidden bg-slate-'>
                        <img 
                            src={imgSrc} 
                            alt={alt} 
                            className={` w-full h-full`}
                        />
                    </div>
                    <p className={`${titleColor} text-lg font-robotoMono font-bold`}>{alt}</p>
                </div>

                <p className={`${textColor} font-bold md:text-justify sm:text-[1rem] lg:text-[1.1rem] font-lato tracking-wide`}>{text}</p>
            </div>
        </div>
    );
};

export const pageRender: (selected: string) => ReactElement = (selected) => {
    switch (selected) {
        case 'Home':
            return <HomePageContent />;
        case 'About Us':
            return <AboutUs />;
        case 'Contact Us':
            return <ContactUs />;
        case 'Career':
            return <Home />;
        default:
            return <HomePageContent />;
    }
};

export interface accType {
    name: string;
    path: string;
} 
export const accountArr: accType[] = [
    {
        name: 'Sign In',
        path: 'login'
    }, {
        name: 'Sign Up',
        path: 'signup'
    }
];

const LandingPage = () => {
    const [selected, setSelected] = useState<string>(tabs[0].text);

    return (
        <>
            {/* navbar */}
            <div className='absolute flex flex-col items-center w-full top-10 gap-y-4 z-50'>
                <div className='rounded-lg w-[96%] bg-[#0f172a25] backdrop-blur-md'>
                    <NavBar
                        accountArr={accountArr}
                        tabsArr={tabs}
                        selected={selected}
                        setSelected={setSelected}
                    />
                </div>
            </div> 

            {pageRender(selected)}
        </>
    );
};

export default LandingPage;

export const HomePageContent = () => {
    const [isSearchBarHanging, setIsSearchBarHanging] = useState<boolean>(false);
    const [typedText, setTypedText] = useState<string>('');
    const [courseDisplay, setCourseDisplay] = useState<number>(3);

    const handleInputText = (e: any) => {
        setTypedText(e.target.value);
    };

    const handleNext = () => {
        if (courseDisplay < coursesCard.length) setCourseDisplay(prevVal => prevVal + 1)
    };

    const handlePrevious = () => {
        if (courseDisplay > coursesCard.length/3) setCourseDisplay(prevVal => prevVal - 1);
    };

    return (
        <div className='relative h-screen scroll-smooth'>
            {/* banner */}
            <div
            className={`h-full flex flex-col items-start justify-center pl-4 pr-4 sm:pl-12 md:pl-32 bg-fixed bg-cover`}
            style={{
                backgroundImage: `url('${banner}')`,
            }}>
                <div className='text-[1rem] lg:text-[1.3rem] font-montserrat font-bold text-white uppercase'>
                    Welcome to stumate
                </div>

                <div className='mt-3 font-bold text-[2.3rem] md:text-[3rem] xl:text-[4.2rem] leading-[50px] xl:leading-[70px] font-jaldi text-white text-wrap flex flex-wrap sm:w-[35rem] md:w-[43rem]'>
                    Your Gateway To Academic Excellence!
                </div>

                <div className='mt-3 mb-4 text-[1.1rem] sm:text-xl font-mavenPro font-bold text-black'>
                    "The roots of education are bitter, but the fruit is sweet."
                </div>

                <div className='flex flex-col mb-2 sm:flex-row gap-x-4 gap-y-4 sm:items-center'>
                    <button className="uppercase px-4 py-2 bg-slate-800 text-yellow-300 rounded-sm font-mavenPro flex gap-x-3 items-center justify-center">
                        Get started now
                        <FaArrowRightLong/>
                    </button>
                    
                    <button className="uppercase px-4 py-2 bg-yellow-400 text-slate-900 ring-[1px] ring-slate-900 rounded-sm font-mavenPro flex gap-x-3 items-center justify-center">
                        view Courses
                        <FaArrowRightLong/>
                    </button>
                </div>
            </div>              

            {/* search field */}
            <>
                <div className='fixed z-10 block w-10 h-10 p-2 overflow-hidden transition-all rounded-full cursor-pointer bottom-3 right-3 active:scale-110 bg-slate-800 text-cyan-300 ring-[1px] ring-yellow-300'
                onClick={() => setIsSearchBarHanging(!isSearchBarHanging)}>
                    <GoSearch className='text-2xl font-bold ' />
                </div>

                {isSearchBarHanging && (
                    <motion.div className='w-[80%] h-[2.8rem] fixed bottom-3 left-3 text-white'
                    initial={{x: -300, opacity: 0}}
                    animate={{x: 0, opacity: 1}}>
                        <form className="flex w-full h-full overflow-hidden rounded-full ring-[1px] ring-yellow-300 font-onest md:tracking-wide">
                            <input 
                                type="search"
                                placeholder="Search"
                                className="w-full h-full pl-4 pr-2 border-none shadow-xl outline-none bg-slate-800 text-cyan-300"
                                aria-label="Search"
                                onChange={handleInputText}
                                value={typedText}
                            />
                            
                            <button 
                            type='submit'
                            className='bg-slate-800 border-l border-slate-500 text-slate-200 pl-1 pr-2.5 lg:px-3 flex items-center justify-center'>
                                <TbDatabaseSearch className=' text-[1.4rem] text-green-300' />
                            </button>
                        </form>
                    </motion.div>
                )}
            </>

            {/* stats */}
            <div 
            className={`h-[23rem] grid grid-cols-2 2xl:grid-cols-4 place-items-center place-content-center gap-14 px-4 sm:px-6 md:px-16 bg-bottom`}
            style={{
                backgroundImage: `url('${statBg}')`,
            }}>
                {statCard.map((stat, i) => (
                    <span 
                    className=' flex items-center gap-x-2 w-[7.7rem] sm:w-[12rem] md:w-[15rem] xl:w-[18rem]'
                    key={i+stat.title}>
                        <span className='w-[3.4rem] sm:w-[3.8rem] md:w-[4.5rem] xl:w-[5.1rem] h-[3.4rem] sm:h-[3.8rem] md:h-[4.5rem] xl:h-[5.1rem] hidden sm:block'>
                            <img 
                                src={stat.imgLink} 
                                className='w-full h-full '
                                alt={stat.title} 
                            />
                        </span>

                        <span className=''>
                            <div className='text-[1.4rem] md:text-[1.7rem] xl:text-[1.9rem] font-bold font-onest text-white'>
                                {stat.num}
                            </div>

                            <div className='text-[1rem] md:text-[1.2rem] xl:text-[1.4rem] font-bold font-onest text-white capitalize'>
                                {stat.title}
                            </div>
                        </span>
                    </span>
                ))}
            </div>

            {/* popular online courses */}
            <>
                {/* navigation */}
                <div className='relative flex flex-col items-center justify-center mx-6 mt-16 mb-8 font-bold text-center capitalize font-onest gap-y-2'>
                    <div className='text-2xl md:text-3xl'>
                        popular online courses
                    </div>

                    <div className='flex items-center justify-between w-full h-full text-2xl font-bold md:text-3xl lsm:absolute lsm:left-0 lsm:top-0'>
                        <button className='flex items-center justify-center w-12 h-8 text-yellow-300 transition-all rounded-full cursor-pointer lsm:w-14 bg-slate-900 active:scale-110'
                        onClick={handlePrevious}>
                            <GoArrowLeft className=''/>
                        </button>
                        
                        <button className='flex items-center justify-center w-12 h-8 text-yellow-300 transition-all rounded-full lsm:w-14 bg-slate-900 active:scale-110'
                        onClick={handleNext}>
                            <GoArrowRight className=''/>
                        </button>
                    </div>
                </div>
                
                {/* cards */}
                <div className='flex flex-wrap items-center justify-center gap-16 px-10'>  
                    {coursesCard.slice(0, courseDisplay).map((course, index) => (
                        <div 
                        className='px-4 py-3 overflow-hidden duration-200 rounded-lg hover:rounded-md shadow-xl shadow-slate-400 hover:shadow-violet-400 group bg-slate-200 hover:bg-gradient-to-br hover:from-indigo-200 hover:via-violet-100 hover:to-blue-100 w-[28rem] h-fit transition-all'
                        key={index}>
                            {/* upper */}
                            <div className='flex items-center justify-center w-full'>
                                <div className='flex items-center justify-center gap-x-5'>
                                    <div className='flex items-center justify-center 
                                    min-w-[5rem] max-w-[5rem] 
                                    min-h-[5rem] max-h-[5rem]
                                    sm:min-w-[5.5rem] sm:max-w-[5.5rem] 
                                    sm:min-h-[5.5rem] sm:max-h-[5.5rem] 
                                    p-3 overflow-hidden rounded-full bg-slate-800 group-hover:bg-cyan-700 duration-150 group-hover:scale-105 transition-all'>
                                        <img 
                                            src={course.cover}
                                            className='w-full h-full transition-all group-hover:scale-110'
                                            alt={course.coursesName}
                                        />
                                    </div>
                                    
                                    <div className='text-[1rem] lsm:text-[1.2rem] font-bold font-montserrat group-hover:text-indigo-800  duration-200 group-hover:translate-x-4 group-hover:-translate-y-1'>
                                        {course.coursesName}
                                    </div>
                                </div>
                            </div>
                            
                            {/* mid */}
                            <div className='lsm:px-3 space-y-5 '>
                                <div className='flex items-center justify-between mt-3 '>
                                    {/* person details */}
                                    <div className='space-y-1 transition-all font-mavenPro group-hover:-translate-x-2'>
                                        <div className=' font-bold text-[1.1rem] sm:text-[1.2rem] text-blue-900'>
                                            {course.courTeacher[0].name}
                                        </div>

                                        <div className=' font-bold text-[.9rem]'>
                                            {course.courTeacher[0].totalTime}
                                        </div>
                                    </div>

                                    {/* avatar */}
                                    <div className='w-[5.3rem] h-[3.8rem] rounded-md overflow-hidden group-hover:translate-x-2 transition-all'>
                                        <img 
                                            src={course.courTeacher[0].dcover}
                                            className='w-full h-full '
                                            alt={course.coursesName}
                                        />
                                    </div>
                                </div>

                                <div className='flex items-center justify-between gap-x-8 lsm:gap-x-16'>
                                    {/* stars */}
                                    <div className='flex items-center text-xl transition-all lsm:gap-x-1 group-hover:-translate-x-2'>
                                        {[...Array(5)].map((_, i) => (
                                            <TiStarFullOutline key={i} className='transition-all group-hover:scale-110'/>
                                        ))}
                                    </div>

                                    {/* value */}
                                    <div className='uppercase flex items-center justify-center font-onest text-[.9rem] lsm:text-[1rem] w-full bg-slate-300 text-slate-900 font-bold tracking-wide group-hover:translate-x-2 py-1 rounded-md transition-all max-w-[10rem]'>
                                        {course.priceAll} / {course.pricePer}
                                    </div>
                                </div>
                            </div>

                            {/* lower */}
                            <a href={course.joinNowLink} className='no-underline '>
                                <button className='flex items-center justify-center w-full py-2 mt-4 text-lg sm:text-xl font-bold tracking-wide text-white uppercase transition-all rounded-md font-onest bg-slate-700 group-hover:bg-slate-900 group-hover:translate-y-1'>
                                    join now
                                </button>
                            </a>
                        </div>
                    ))}
                </div>
            </>

            {/* best online courses */}
            <div className='flex flex-col items-center justify-center mt-10 gap-y-10'>
                <div className='flex flex-col items-center space-y-3 '>
                    <div className='text-[1.6rem] xl:text-[2rem] font-bold font-montserrat bg-gradient-to-br from-indigo-700 via-violet-700 to-blue-800 bg-clip-text text-transparent'>
                        Courses
                    </div>

                    <div className='text-3xl font-bold text-center text-blue-900 xl:text-5xl font-montserrat'>
                        Browse Our Best Online Courses
                    </div>
                </div>

                <div className='grid md:grid-cols-2 Cxl:grid-cols-3 2xl:grid-cols-4 gap-14'>
                    {onlineCourses.map((course, index) => (
                        <div 
                        className='group bg-gray-100 shadow-lg shadow-slate-900 hover:bg-slate-800 duration-200 flex flex-col items-center justify-center rounded-md overflow-hidden py-4 px-[4.3rem] cursor-pointer border border-slate-800'
                        key={index}>
                            <div className='w-[5rem] h-[5rem] group-hover:scale-105'>
                                <img 
                                    src={course.cover} 
                                    className='w-full h-full duration-200 group-hover:hidden group-hover:scale-110 transition-all'
                                    alt={course.course} 
                                />

                                <img 
                                    src={course.hoverCover} 
                                    className='hidden w-full h-full duration-200 group-hover:block group-hover:scale-110 transition-all'
                                    alt={course.course} 
                                />
                            </div>

                            <div className='flex flex-col items-center justify-center mt-7 gap-y-3'>
                                <div className='text-xl font-bold duration-200 group-hover:text-cyan-300 font-robotoMono'>
                                    {course.courseName}
                                </div>

                                <div className=' rounded-md px-3 py-1.5 bg-slate-200 group-hover:bg-slate-600 shadow-xl shadow-slate-70 font-bold group-hover:text-yellow-300 font-mavenPro tracking-wide duration-200'>
                                    {course.course}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* cards */}
            <div className="w-full px-3 pb-5 mt-16">
                <div className='flex flex-col items-center space-y-3 '>
                    <div className='text-[1.6rem] xl:text-[2rem] font-bold font-montserrat bg-gradient-to-br from-indigo-700 via-violet-700 to-blue-800 bg-clip-text text-transparent mb-4 capitalize'>
                    our provided facilities 
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3 place-items-center">
                    {buttonsData.map((button, index) => (
                        <ButtonWithCard 
                            key={index} 
                            imgSrc={button.imgSrc} 
                            alt={button.alt} 
                            text={button.text} 
                            bgColor={button.bgColor}
                            textColor={button.textColor}
                            titleColor= {button.titleColor}
                        />
                    ))}
                </div>
            </div>

            <Footer/>
        </div>
    )
}