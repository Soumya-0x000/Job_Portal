import { FC } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/sentientFullLogo.png';

const HomePgBtnNav: FC<{ navArr: { label: string, link: string } }> = () => (
    <div className=" flex items-center justify-between w-full px-3 sm:px-5 md:px-14 pb-2 ">
        <Link to={'/'} className='flex items-center justify-center w-full sm:w-fit'>
            <img src={logo} className=' aspect-squar h-10 sm:scale-125 -translate-y-1 shadow-white' />
        </Link>
    </div>
);

export default HomePgBtnNav;
