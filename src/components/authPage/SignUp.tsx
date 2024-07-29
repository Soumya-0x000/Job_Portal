import React, { ReactElement, useEffect, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import CheckAdmin from './CheckAdmin';
import { generateUniqueId } from '../../common/UniqID';
import { CiLock, CiMail, CiUnlock } from 'react-icons/ci';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa6';

interface FormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Required'),
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
        icon: <FaGithub className=' text-[1.6rem] text-white'/>,
        onClick: (e: any) => {
            e.preventDefault()
        }
    }
];

const Register: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const users = JSON.parse(localStorage.getItem('user') || '[]');
        const admins = JSON.parse(localStorage.getItem('admin') || '[]');        

        if (users && !(users.filter(Boolean))) {
            localStorage.setItem('user', JSON.stringify([]));
        } else if (admins && !(admins.filter(Boolean))) {
            localStorage.setItem('admin', JSON.stringify([]));
        }
    }, []);

    const handleSubmit = (values: FormValues) => {
        const users = JSON.parse(localStorage.getItem('user') || '[]');
        const admins = JSON.parse(localStorage.getItem('admin') || '[]');

        const newUser = { ...values, uniqId: generateUniqueId() };
        
        if (isAdmin) {
            const doubleEntryAdmin = admins?.find((item: FormValues) => item.email === newUser.email)
            !doubleEntryAdmin 
                ? localStorage.setItem('admin', JSON.stringify([...admins, newUser]))
                : alert('You already exists')
        } else {
            const doubleEntryUser = users?.find((item: FormValues) => item.email === newUser.email)
            !doubleEntryUser
                ? localStorage.setItem('user', JSON.stringify([...users, newUser]))
                : alert("You're already in")
        }

        navigate('/');
    };

    const fields = [
        {
            id: 'name',
            type: 'text',
            placeholder: 'Name',
            icon: <PersonIcon className=' text-white text-2xl'/>
        },
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
            icon: showPassword 
                ? <CiUnlock className=' text-white text-2xl'/> 
                : <CiLock className=' text-white text-2xl'/>
        }, 
        {
            id: 'confirmPassword',
            type: 'password',
            placeholder: 'Confirm Password',
            icon: showConfirmPassword
                ? <CiUnlock className=' text-white text-2xl'/> 
                : <CiLock className=' text-white text-2xl'/>
        }
    ];

    const togglePswdVisibility: (id: string) => void = (id) => {
        if (id === 'password') setShowPassword(!showPassword);
        if (id === 'confirmPassword') setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-900">
            <div className="flex flex-col w-full lg:w-1/2 px-8 md:px-32 lg:px-24 justify-center items-center">
                <div className="w-full">
                    <Formik
                    initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => handleSubmit(values)}>
                        {({ errors, touched }) => (
                            <Form className="bg-slate-700 rounded-md shadow-2xl p-5">
                                <h1 className="text-gray-300 font-bold text-2xl mb-1">Register</h1>
                                <p className="text-sm font-normal text-gray-100 mb-8">Create your account</p>

                                <div className=' grid md:grid-col s-2 gap-x-4'>
                                    {fields.map(({ id, type, placeholder, icon }) => (
                                        <div key={id} className="flex items-center ring-1 bg-slate-900 mb-5 p-2 rounded-lg">
                                            <span 
                                            onClick={() => togglePswdVisibility(id)} 
                                            className=' cursor-pointer'>
                                                {icon}
                                            </span>
                                            <Field
                                                id={id}
                                                name={id}
                                                type={
                                                    id === 'password' 
                                                        ? showPassword ? 'text' : type
                                                        : id === 'confirmPassword'
                                                            ? showConfirmPassword ? 'text' : type
                                                            : type
                                                }
                                                placeholder={placeholder}
                                                className=" w-full bg-slate-800 pl-3 text-slate-200 border-none outline-none focus:outline-none rounded-lg py-1 ml-2"
                                            />
                                            {errors[id as keyof FormValues] && touched[id as keyof FormValues] && (
                                                <div className="text-red-500 text-sm">{errors[id as keyof FormValues]}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <button
                                type="submit"
                                className="block w-full bg-indigo-600 mt-4 py-2 rounded-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold">
                                    Register
                                </button>

                                <div className="flex items-center justify-between border-b-slate-400 border-b-2 mt-4 pb-2">
                                    <Link to="/login" className="text-sm hover:text-blue-300 text-cyan-200 cursor-pointer hover:-translate-y-1 duration-500 transition-all">Already have an account?</Link>
                                    <CheckAdmin isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
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

export default Register;
