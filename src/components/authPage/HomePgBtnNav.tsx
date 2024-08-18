import { FC } from 'react';
import { Link } from 'react-router-dom';
import { FaAngleLeft, FaAngleRight, FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import logo from '../../assets/sentientFullLogo.png';

const NavItem: FC<{ label: string, link: string}> = ({ label, link }) => (
    <Link to={link} className={`bg-slate-700 no-underline cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-lg p-px text-xs font-semibold text-white inline-block group/link`}>
        <span className={`relative flex items-center justify-center z-10 rounded-lg bg-zinc-950 py-2 px-3 group overflow-hidden hover:bg-[#161616] transition-all peer`}>
            {(label === 'Home') ? (
                <div className=' flex flex-row-reverse items-center justify-center gap-x-2'>
                    <span className="text-[13px] font-onest tracking-wide">{label}</span>
                    <FaAngleLeft className=' text-[.8rem] group-hover:-translate-x-8 duration-500 transition-all'/>
                    <FaAnglesLeft className=' text-[.8rem] absolute -translate-x-20 group-hover:-translate-x-7 duration-600 scale-0 group-hover:scale-110 transition-all' />
                </div>
            ) : (
                <div className='flex flex-row-reverse items-center justify-center gap-x-2'>
                    <FaAngleRight className=' text-[.8rem] group-hover:translate-x-8 duration-500 transition-all'/>
                    <FaAnglesRight className=' text-[.8rem] absolute translate-x-20 group-hover:translate-x-7 duration-600 scale-0 group-hover:scale-110 transition-all' />
                    <span className="text-[13px] font-onest tracking-wide">{label}</span>
                </div>
            )}
        </span>
    </Link>
);

const HomePgBtnNav: FC<{ navArr: { label: string, link: string } }> = ({ navArr }) => (
    <div className=" flex items-center justify-between w-full px-3 sm:px-5 md:px-14 border-b-[1px] pb-2 border-slate-700">
        <Link to={'/'} className='hidden sm:block'>
            <img src={logo} className=' aspect-squar h-10 scale-125 -translate-y-1 shadow-white' />
        </Link>
        <div className=' w-full sm:w-fit flex items-center sm:justify-center justify-between gap-3'>
            <NavItem label="Home" link="/" />
            <NavItem label={navArr.label} link={navArr.link} />
        </div>
    </div>
);

export default HomePgBtnNav;
