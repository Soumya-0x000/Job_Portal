import { Dispatch, FC, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tabsType } from "./DemoData";
import { AnimatePresence, motion } from "framer-motion";
import { accType } from "../components/Home/LandingPage";

interface NavbarType {
    accountArr: accType[];
    tabsArr: tabsType[];
    selected: string;
    setSelected: Dispatch<SetStateAction<string>>
}

export const NavBar: FC<NavbarType> = ({ tabsArr, accountArr, selected, setSelected }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [hamburgerActive, setHamburgerActive] = useState<boolean>(false);
    const navigate = useNavigate();

    return (
        <div className={` flex items-center justify-between w-full h-[4rem] backdrop-blur-xl pl-4 sm:pl-3 xl:pl-8 rounded-lg ${selected === 'Career' ? ' bg-[#3a4656]' : ''}`}>
            {/* hamburger icon in less than 1024 screen width */}
            <div className="relative block md:hidden">
                <div onClick={() => setIsDropdownOpen((pv) => !pv)}>
                    <AnimatedHamburgerButton
                        hamburgerActive={hamburgerActive}
                        setHamburgerActive={setHamburgerActive}
                    />
                </div>

                <div className="absolute flex items-center justify-center -right-11">
                    <motion.div animate={isDropdownOpen ? "open" : "closed"} className="relative">
                        <motion.ul
                        className="flex flex-col gap-2 p-2 rounded-lg bg-slate-900 shadow-xl absolute top-[120%] left-[50%] w-48 overflow-hidden z-30 ring-1 ring-blue-400"
                        initial={wrapperVariants.closed}
                        variants={wrapperVariants}
                        style={{ originY: "top", translateX: "-50%" }}>
                            {tabsArr.map((tab: tabsType, indx) => (
                                <Option 
                                    key={tab.text+indx}
                                    // Icon={tab.icon}
                                    text={tab.text}
                                    setIsDropdownOpen={setIsDropdownOpen}
                                    setSelected={setSelected}
                                    setHamburgerActive={setHamburgerActive}
                                />
                            ))}
                        </motion.ul>
                    </motion.div>
                </div>
            </div>

            {/* main menu in more than 1024 screen width */}
            <div className="flex-wrap items-center hidden gap-x-2 xl:gap-x-3 md:flex">
                {tabsArr.map((tab) => (
                    <Chip
                        text={tab.text}
                        // icon={tab.icon}
                        selected={selected === tab.text}
                        setSelected={setSelected}
                        key={tab.text}
                    />
                ))}
            </div>

            {/* account section */}
            <div className='relative flex items-center h-full px-4 rounded-r-lg bg-slate-900 gap-x-8 sm:gap-x-5 lg:gap-x-5 xl:gap-x-10 sm:px-3 xl:px-8 text-yellow-200'>
                {accountArr.map((account, indx) => (
                    <div className="flex justify-center cursor-pointer lg:text-lg"
                    key={indx}
                    onClick={() => navigate(account.path)}>
                        <FlyoutLink>
                            {account.name}
                        </FlyoutLink>
                    </div>
                ))}

                <div className='absolute top-0 w-5 h-full -left-4 bg-slate-900 actionBtnBend'/>
            </div>
        </div>
    );
};

interface chipType {
    text: string;
    // icon: ReactElement;
    selected: boolean;
    setSelected: Dispatch<SetStateAction<string>>;
}
const Chip: FC<chipType> = ({ 
    text, 
    // icon,
    selected, 
    setSelected 
}) => {
    const handleClick = (text: string) => setSelected(text)
    
    return (
        <button
        onClick={() => handleClick(text)}
        className={`${
        selected
            ? "text-white"
            : "text-slate-300 hover:text-slate-200 hover:bg-slate-800"
        } transition-colors px-3 py-1.5 rounded-md relative flex items-center group`}>
            <span className="relative z-10 flex items-center justify-center gap-x-2">
                <span className='font-robotoMono lg:text-[1rem] text-white hidden md:block'>{text}</span>
                {/* <span className=' text-[1.3rem] text-white'>{icon}</span> */}
            </span>

            {selected && (
                <motion.span
                    layoutId="pill-tab"
                    className="absolute inset-0 z-0 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600"
                    transition={{ type: "sp", duration: 0.2 }}
                />
            )}

            <span className='z-20 hidden ml-1 group-hover:block md:group-hover:hidden'>
                {text}
            </span>
        </button>
    );
};

interface OptionType {
    text: string;
    // Icon: ReactElement;
    setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
    setSelected: Dispatch<SetStateAction<string>>;
    setHamburgerActive: Dispatch<SetStateAction<boolean>>
};

const Option: FC<OptionType> = ({ 
    text, 
    // Icon, 
    setIsDropdownOpen, 
    setSelected,
    setHamburgerActive
}) => {    
    const handleClick = () => {
        setIsDropdownOpen(false)
        setHamburgerActive(false)
        setSelected(text)
    };
    
    return (
        <motion.li
        variants={itemVariants}
        className="flex items-center w-full gap-3 p-2 text-xs font-medium transition-colors rounded-md cursor-pointer whitespace-nowrap hover:bg-indigo-600 text-cyan-100 hover:text-indigo-100"
        onClick={() => handleClick()}>
            <motion.span 
            className='text-xl font-robotoMono'
            variants={actionIconVariants}>
                {/* {Icon} */}
            </motion.span>

            <span className='text-[1rem] font-robotoMono'>{text}</span>
        </motion.li>
    );
};

const wrapperVariants = {
    open: {
        scaleY: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.1,
        },
    },
    closed: {
        scaleY: 0,
        transition: {
            when: "afterChildren",
            staggerChildren: 0.1,
        },
    },
};
  
const itemVariants = {
    open: {
        opacity: 1,
        y: 0,
        transition: {
            when: "beforeChildren",
        },
    },
    closed: {
        opacity: 0,
        y: -15,
        transition: {
            when: "afterChildren",
        },
    },
};

const actionIconVariants = {
    open: { scale: 1, y: 0 },
    closed: { scale: 0, y: -7 },
};

interface hamburgerMenuType {
    hamburgerActive: boolean;
    setHamburgerActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const AnimatedHamburgerButton: FC<hamburgerMenuType> = ({ hamburgerActive, setHamburgerActive }) => {
    return (   
        <button
        className="relative w-10 h-20 transition-colors"
        onClick={() => setHamburgerActive((pv) => !pv)}>
            <div className={`flex items-center justify-center flex-col gap-y-[.4rem] rounded-full w-10 h-[2.4rem] p-1 bg-slate-800 transition-all cursor-pointer`}>
                <div className={`w-7 h-[1.5px] transition-all ${hamburgerActive ? 'rotate-45 translate-y-[4px]' : 'rotate-0'}  bg-cyan-300`}/>
                <div className={`w-7 h-[1.5px] ${!hamburgerActive ? 'block' : 'hidden'} bg-cyan-300`}/>
                <div className={`w-7 h-[1.5px] ${hamburgerActive ? '-rotate-45 -translate-y-[4px]' : 'rotate-0'}  transition-all bg-cyan-300`}/>
            </div> 
        </button>
    );
};

const FlyoutLink: FC<{children: string}> = ({children}) => {
    const [open, setOpen] = useState(false);

    const showFlyout = open;
  
    return (
        <div
        className="relative w-fit h-fit"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}>
            <span className="relative text-yellow-300 font-onest">
                {children}
                <span
                    style={{ transform: showFlyout ? "scaleX(1)" : "scaleX(0)" }}
                    className="absolute h-1 transition-transform duration-300 ease-out origin-left scale-x-0 bg-yellow-300 rounded-full -bottom-2 -left-2 -right-2"
                />
            </span>

            <AnimatePresence>
                {showFlyout && (
                    <motion.div
                    className="absolute -right-[6rem] lg:-right-[8rem] top-[3.2rem] z-30"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    style={{ translateX: "-50%" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}>
                        <div className="absolute left-0 right-0 h-6 bg-transparent -top-6 " />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};