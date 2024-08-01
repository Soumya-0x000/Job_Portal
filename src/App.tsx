import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Loading } from './common/Loading';
import { tabs, tabsType } from './common/DemoData';
import { NavBar } from './common/Navbar';
import { accountArr, accType } from './components/Home/LandingPage';
import PageRender from './components/Home/PageRender';

const App = () => {
    const [selected, setSelected] = useState<string>(tabs[0]?.text);
    const [loading, setLoading] = useState(true);
    const [tabsArr,  setTabsArr] = useState<tabsType[]>(tabs);
    const [account, setAccount] = useState<accType[]>(accountArr);

    const { uniqId } = useParams();
    const navigate = useNavigate();
  
    useEffect(() => {
        const savedToken = JSON.parse(localStorage.getItem('token') || '');
        if(uniqId !== savedToken) navigate('/')

        setTimeout(() => {
            setLoading(false);
        }, 600);
    }, []);

    useEffect(() => {
        const newTabs: tabsType[] = [
            ...tabs, 
            {
                text: 'Career',
                path: 'career'
            }
        ]

        const newAccArr: accType[] = [
            {
                name: 'Delete account',
                path: '/'
            }, {
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
                    <div className='absolute flex flex-col items-center w-full top-10 gap-y-4 z-50'>
                        <div className='rounded-lg w-[96%] bg-[#0f172a25] backdrop-blur-md'>
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
