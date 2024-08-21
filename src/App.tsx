import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Loading } from './common/Loading';
import { tabs, tabsType } from './common/DemoData';
import { NavBar } from './common/Navbar';
import { accountArr, accType } from './components/Home/LandingPage';
import PageRender from './components/Home/PageRender';
import axios from 'axios';
import { URL } from './API';
import { PiBuildingOffice } from "react-icons/pi";
import { LuReplace } from "react-icons/lu";

const App = () => {
    const [selected, setSelected] = useState<string>(tabs[0]?.text);
    const [loading, setLoading] = useState(true);
    const [tabsArr,  setTabsArr] = useState<tabsType[]>(tabs);
    const [account, setAccount] = useState<accType[]>(accountArr);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    const location = useLocation();
    const navigate = useNavigate();
    const uniqueId = location?.state
  
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userDetails') || '');
        const savedToken = user?.token
        
        if(uniqueId !== savedToken) navigate('/home') //change it to '/'
        else {
            const getUser = async() => {
                const response = await axios.get(`${URL}/users/me`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': '69420',
                        authorization: `token ${savedToken}`,
                    }
                })

                return response?.data?.appliedFor
            }
            const userAppliedJob = getUser();
            console.log(userAppliedJob)
        }

        setTimeout(() => {setLoading(false)}, 600);
    }, [uniqueId, navigate]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) setIsScrolled(true)
            else setIsScrolled(false)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const newTabs: tabsType[] = [
            ...tabs, 
            {
                text: 'Career',
                icon: <PiBuildingOffice />,
                path: 'career'
            }, {
                text: 'Room book',
                icon: <LuReplace />,
                path: 'userroom'
            }
        ]

        const newAccArr: accType[] = [
            // {
            //     name: 'Delete account',
            //     path: '/'
            // }, 
            {
                name: 'Sign Out',
                path: '/'
            }
        ]
        setTabsArr(newTabs)
        setAccount(newAccArr)
    }, []);

    return (
        <div className=' bg-slate-800 h-screen'>
            {loading 
                ? <Loading/>
                : <div> 
                    <div className={`fixed top-0 ${isScrolled ? '' : ''} transition-all duration-500 flex flex-col items-center w-full gap-y-4 z-50`}>
                        <div className='w-full backdrop-blur-md'>
                            <NavBar
                                accountArr={account}
                                tabsArr={tabsArr}
                                selected={selected}
                                setSelected={setSelected}
                            />
                        </div>
                    </div>

                    {PageRender(selected)}
                </div>
            }
        </div>
    );
}

export default App;
