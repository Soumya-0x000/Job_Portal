import React, { ReactElement, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import CheckAdmin from './CheckAdmin';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa6';
import { CiLock, CiMail, CiUnlock } from "react-icons/ci";

export interface FormValues {
    email: string;
    password: string;
}

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
});

type loginOptionType = {
    name: string;
    icon: ReactElement;
    onClick: (e:any) => void
};

const loginOption: loginOptionType[] = [
    {
        name: 'Log in with Google',
        icon: <FcGoogle className=' text-[1.6rem]'/>,
        onClick: (e: any) => {
            e.preventDefault()
        }   
    }, {
        name: 'Log in with GitHub',
        icon: <FaGithub className=' text-[1.6rem] text-white '/>,
        onClick: (e: any) => {
            e.preventDefault()
        }
    }
];

const LoginPage: React.FC = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

    const fields = [
        { 
            id: 'email', 
            type: 'email', 
            placeholder: 'Email Address', 
            icon: <CiMail className=' text-white text-2xl'/>
        }, 
        { 
            id: 'password', 
            type: 'password', 
            placeholder: 'Password', 
            icon: passwordVisible 
                ? <CiUnlock className=' text-white text-2xl'/> 
                : <CiLock className=' text-white text-2xl'/>
        }
    ];

    const handleNavigation = (values: FormValues) => {
        const users = JSON.parse(localStorage.getItem('user') || '[]');
        const admins = JSON.parse(localStorage.getItem('admin') || '[]');

        const user = users?.find((user: FormValues) => user.email === values.email);
        const admin = admins?.find((admin: FormValues) => admin.email === values.email);

        if (isAdmin) {
            if (admin && admin.password === values.password) navigate('/admindashboard');
            else alert('Invalid email or password for admin');
        } else {
            if (user && user.password === values.password) 
                navigate(`/home/${user?.uniqId}?email=${encodeURIComponent(user?.email)}`);
            else alert('Invalid email or password for user');
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-900">
            <div className="flex flex-col w-full lg:w-1/2 px-8 md:px-32 lg:px-24 justify-center items-center space-y-8">
                <div className="w-full">
                    <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={(values: FormValues) => handleNavigation(values)}>
                        {({ errors, touched }) => (
                            <Form className="bg-slate-700 rounded-md shadow-2xl p-5">
                                <h1 className="text-gray-300 font-bold text-2xl mb-1">Hello Again!</h1>
                                <p className="text-sm font-normal text-gray-100 mb-8">Welcome Back</p>

                                {fields.map(({ id, type, placeholder, icon }) => (
                                    <div key={id} className="flex items-center ring-1 bg-slate-900 mb-8 p-2 rounded-lg">
                                        <span onClick={id === 'password' ? togglePasswordVisibility : undefined} className=' cursor-pointer'>
                                            {icon}
                                        </span>
                                        <Field
                                            id={id}
                                            name={id} 
                                            type={id === 'password' && passwordVisible ? 'text' : type}
                                            placeholder={placeholder}
                                            className=" w-full bg-slate-800 pl-3 text-slate-200 border-none outline-none focus:outline-none rounded-lg py-1 ml-2"
                                            autoComplete="off"
                                            spellCheck="false"
                                            onPaste={(e:any) => type === 'password' ? e.preventDefault() : ''}
                                            onCopy={(e:any) => type === 'password' ? e.preventDefault() : ''}
                                            onCut={(e:any) => type === 'password' ? e.preventDefault() : ''}
                                            onDrag={(e:any) => type === 'password' ? e.preventDefault() : ''}
                                            onDrop={(e:any) => type === 'password' ? e.preventDefault() : ''}
                                        />
                                        
                                        {errors[id as keyof FormValues] && touched[id as keyof FormValues] ? (
                                            <div className="text-red-600 text-sm">{errors[id as keyof FormValues]}</div>
                                        ) : null}
                                    </div>
                                ))}

                                <button type="submit" className="block w-full bg-indigo-600 mt-5 py-2 rounded-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2">
                                    Login
                                </button>
                                
                                <div className="flex items-center justify-between mt-4">
                                    <Link to={'/signup'} className="text-sm ml-2 text-slate-200 hover:text-blue-300 cursor-pointer hover:-translate-y-1 duration-500 transition-all">Don't have an account yet?</Link>

                                    <CheckAdmin isAdmin={isAdmin} setIsAdmin={setIsAdmin}/>
                                </div>
                                
                                <div className='pt-6 flex flex-col sm:flex-row items-center justify-center w-full gap-x-6 gap-y-3'>
                                    {loginOption.map((option, indx) => (
                                        <button className=' ring-1 ring-slate-600 rounded-lg bg-slate-800 px-3 py-2 flex items-center justify-center gap-x-2 active:scale-105 transition-all w-full line-clamp-1'
                                        onClick={option.onClick}
                                        key={indx}>
                                        {option.icon}
                                        <span className=' text-slate-200 '>
                                            {option.name}
                                        </span>
                                    </button>
                                    ))}
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
