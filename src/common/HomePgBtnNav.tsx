import { FC, ReactElement } from 'react';
import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const commonLinkStyles = "bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold text-white inline-block";
const commonSpanStyles = "absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(0,220,300,100%)_0%,rgba(56,189,248,0)70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100";
const commonContainerStyles = "relative flex space-x-4 items-center justify-center z-10 rounded-full bg-zinc-950 py-2 px-5";

const NavItem: FC<{ label: string, link: string, icon: ReactElement }> = ({ label, link, icon }) => (
    <Link to={link} className={commonLinkStyles}>
        <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className={commonSpanStyles} />
        </span>
        <span className={commonContainerStyles}>
            <span className="text-[15px] font-onest tracking-wide">{label}</span>
            {icon}
        </span>
        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
    </Link>
);

const HomePgBtnNav: FC<{ navArr: { label: string, link: string, icon: ReactElement } }> = ({ navArr }) => (
    <div className="fixed left-1/2 -translate-x-1/2 top-5 flex items-center justify-between w-full px-14 border-b-[1px] pb-2 border-slate-700">
        <NavItem label="Home" link="/" icon={<FaHome className="text-xl text-emerald-300" />} />
        <NavItem label={navArr.label} link={navArr.link} icon={navArr.icon} />
    </div>
);

export default HomePgBtnNav;
