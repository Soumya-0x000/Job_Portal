import banner from '../images/courses/coursesBanner.jpg';
import { aboutUsCardContent, statCard } from '../common/DemoData';
import aboutUs from '../images/banner/aboutUs.jpg';
import statBg from '../images/stats/statBg.jpg';
import { FC } from 'react';
import { Footer } from '../common/Footer';

interface aboutUsType {
    link: string;
    title: string;
    details: string;
}

const AboutUsCard: FC<aboutUsType> = ({ link, title, details }) => {
    return (
        <div className={` flex items-center justify-between gap-x-10 bg-[#e7fff3] hover:bg-[#e5f5fc] ring-[1px] ring-green-700 hover:ring-blue-700 hover:shadow-md hover:shadow-blue-700 rounded-md overflow-hidden p-3 cursor-pointer group`}>
            <div className=' min-w-20 max-w-20 min-h-20 max-h-20'>
                <img 
                    src={link} 
                    className='w-full h-full '
                    alt="images" 
                />
            </div>

            <div className={` flex flex-col gap-y-3 text-green-800 hover:text-blue-900`}>
                <div className='text-2xl font-bold capitalize font-mavenPro'>
                    {title}
                </div>

                <div className=' font-mavenPro xl:text-lg'>
                    {details}
                </div>
            </div>
        </div>
    );
};

const AboutUs = () => {
    return (
        <div className='relative h-screen scroll-smooth'>
            {/* banner */}
            <div
            className={`h-full flex flex-col items-start justify-center pl-4 pr-4 sm:pl-12 md:pl-32 bg-fixed bg-cover bg-left`}
            style={{
                backgroundImage: `url('${banner}')`,
            }}>
                <div className='text-[1rem] lg:text-[1.3rem] font-montserrat font-bold text-blue-900 uppercase'>
                    Welcome to stumate
                </div>

                <div className='mt-3 font-bold text-[2.3rem] md:text-[3rem] xl:text-[4.2rem] leading-[50px] xl:leading-[70px] font-jaldi text-blue-900 text-wrap flex flex-wrap sm:w-[35rem] md:w-[43rem] capitalize'>
                    this is what we do
                </div>

                <div className='mt-3 mb-4 text-[1.1rem] sm:text-xl font-mavenPro font-bold text-black'>
                    "The roots of education are bitter, but the fruit is sweet."
                </div>
            </div>

            {/* about us */}
            <div className='px-10 my-12 sm:px-24 Lmd:px-10 3xl:px-32'>
                <div className='flex gap-x-7 lg:gap-x-12 xl:gap-x-16 3xl:gap-x-36'>
                    {/* image */}
                    <div 
                    className=' rounded-md overflow-hidden shadow-xl
                        min-h-[55rem] max-h-[55rem] 
                        Lmd:min-h-[40rem] Lmd:max-h-[40rem]
                        Lmd:min-w-[21rem] Lmd:max-w-[21rem]

                        lg:min-w-[25rem] lg:max-w-[25rem]
                        xl:min-h-[48rem] xl:max-h-[48rem]
                        xl:min-w-[30rem] xl:max-w-[30rem]

                        3xl:min-h-[51rem] 3xl:max-h-[51rem] 
                        3xl:min-w-[35rem] 3xl:max-w-[35rem] 
                        hidden Lmd:block cursor-pointer
                    '>
                        <img 
                            src={aboutUs} 
                            className='w-full h-full transition-all hover:scale-105'
                            alt="about us"
                        />
                    </div>

                    {/* cards */}
                    <div className='xl:pt-10 3xl:pt-16'>
                        {/* upper */}
                        <div className='flex flex-col items-center justify-center Lmd:items-start'>
                            <div className=' uppercase font-jaldi font-bold text-[1.2rem] xl:text-[1.7rem] text-slate-700'>
                                Master everything
                            </div>

                            <div className='capitalize font-jaldi font-bold text-[2.3rem] md:text-[2.7rem] xl:text-[3.3rem] text-slate-700 text-wrap '>
                                what sets us apart
                            </div>
                        </div>

                        {/* lower */}
                        <div className='w-full mt-10 space-y-5 xl:space-y-9 3xl:space-y-7 xl:mt-16'>
                            {aboutUsCardContent.map((val, index) => (
                                <AboutUsCard
                                    key={index+val.title}
                                    title={val.title}
                                    details={val.details}
                                    link={val.link}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* stats */}
            <div 
            className={`h-[23rem] grid grid-cols-2 2xl:grid-cols-4 place-items-center place-content-center gap-14 px-4 sm:px-6 md:px-16 bg-bottom mb-6`}
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

                        <div className=''>
                            <div className='text-[1.4rem] md:text-[1.7rem] xl:text-[1.9rem] font-bold font-onest text-white'>
                                {stat.num}
                            </div>

                            <div className='text-[1rem] md:text-[1.2rem] xl:text-[1.4rem] font-bold font-onest text-white capitalize'>
                                {stat.title}
                            </div>
                        </div>
                    </span>
                ))}
            </div>

            <Footer/>
        </div>
    )
}

export default AboutUs;
