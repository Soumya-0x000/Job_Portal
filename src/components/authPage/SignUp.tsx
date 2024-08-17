import React, { useEffect, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import { CiLock, CiMail, CiUnlock } from 'react-icons/ci';
import axios from 'axios';
import { showToastMsg } from '../../common/ToastMsg';
import { URL } from '../../API';
import HomePgBtn from './HomePgBtnNav';

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

const Register: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [focusField, setFocusField] = useState<{ [key: string]: boolean }>({});
    const [isLottieLoading, setIsLottieLoading] = useState(true);

    useEffect(() => {
        const users = JSON.parse(localStorage.getItem('user') || '[]');
        const admins = JSON.parse(localStorage.getItem('admin') || '[]');        

        if (users && !(users.filter(Boolean))) {
            localStorage.setItem('user', JSON.stringify([]));
        } else if (admins && !(admins.filter(Boolean))) {
            localStorage.setItem('admin', JSON.stringify([]));
        }
    }, []);

    const handleSubmit = async(values: FormValues) => {
        setIsSubmitting(true);

        try {
            const {confirmPassword: _, name: username, ...rest} = values
            const user = {...rest, username}
            const response = await axios.post(`${URL}/auth/register`, user, {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '69420'
                }
            })

            if (response.status) {
                const resData = response?.data
                setIsSubmitting(false)
                if (resData?.token) {
                    localStorage.setItem('userDetails', JSON.stringify(resData))
                    showToastMsg('Account created successfully')
                    navigate(`/home`, {state: resData?.token});
                }
            }
        } catch (error) {
            setIsSubmitting(false)
            if (axios.isAxiosError(error)) {
                const errMsg = error?.response?.data?.message
                showToastMsg(errMsg)
            } else {
                console.error(error)
                showToastMsg('Error in creating account')
            }
        }
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

    const handleFocus = (field: string) => {
        setFocusField(prev => ({ ...prev, [field]: true }));
    };

    const handleBlur = (field: string) => {
        setFocusField(prev => ({ ...prev, [field]: false }));
    };

    return (
        <div className="h-screen flex flex-col items-center pt-4 bg-gradient-to-bl from-[#000000] to-slate-900">
            <HomePgBtn
                navArr={{label: 'SignIn', link: '/login' }}
            />
            <div className="flex flex-col w-full px-8 md:px-32 lg:px-24 justify-center items-center h-full">
                <Formik
                initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
                validationSchema={validationSchema}
                onSubmit={(values) => handleSubmit(values)}>
                    {({ errors, touched, values }) => (
                        <div className=' flex w-fit p-2 rounded-lg justify-center gap-x-3 lg:gap-x-16 bg-slate-900 ring-1 ring-slate-800'>
                            <Form className="bg-slate-800 rounded-md shadow-2xl p-5 w-[22rem] lsm:w-[26rem] lg:w-[30rem]">
                                <h1 className="text-white font-onest tracking-wider font-bold text-2xl mb-12">Register</h1>

                                <div className=' grid gap-3'>
                                    {fields.map(({ id, type, placeholder, icon }) => (
                                        <div key={id} className="flex items-center mb-5 rounded-lg relative group">
                                            {((id === 'password') || (id === 'confirmPassword' )) && (
                                                <span 
                                                    onClick={() => togglePswdVisibility(id)} 
                                                    className=' cursor-pointer absolute right-3'>
                                                    {icon}
                                                </span>
                                            )}

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
                                                className={`w-full bg-black pl-3 pr-10 text-slate-200 border-none outline-none focus:outline-none rounded-lg py-3 ${focusField[id] || values[id as keyof FormValues] ? 'ring-1 ring-cyan-400 bg-slate-950' : ''} transition-all peer`}
                                                onFocus={() => handleFocus(id)}
                                                onBlur={() => handleBlur(id)}
                                            />

                                            <label htmlFor={id} className={`absolute transition-all left-4 text-slate-300 text-md ${focusField[id] || values[id as keyof FormValues] ? 'left-2 -top-[1.25rem] text-sm font-bold text-white' : 'top-1/2 -translate-y-1/2'}`}>
                                                {placeholder}
                                            </label>

                                            {errors[id as keyof FormValues] && touched[id as keyof FormValues] && (
                                                <div className="text-red-500 text-sm absolute -bottom-[1.1rem] right-2">{errors[id as keyof FormValues]}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <button
                                type="submit"
                                className="flex items-center justify-center gap-x-2 w-full bg-indigo-600 mt-4 py-2 rounded-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold">
                                    Register
                                    {isSubmitting && (
                                        <span style={{ borderTopColor: "transparent" }} className=" aspect-square h-4 border-2 border-blue-200 rounded-full animate-spin"></span>
                                    )}
                                </button>
                            </Form>

                            {isLottieLoading && (
                                <div className=" hidden md:flex items-center justify-center pr-10 w-[20rem] lg:w-[25rem]">
                                    <span style={{ borderTopColor: "transparent" }} className="aspect-square h-10 border-4 border-blue-200 rounded-full animate-spin"></span>
                                </div>
                            )}

                            <iframe 
                                src="https://lottie.host/embed/db689947-eadf-4366-8580-774883f23e7f/pRnRZ8YKSx.json" 
                                className={`hidden ${!isLottieLoading ? 'md:block' : ''} pr-10 w-[20rem] lg:w-[25rem]`}
                                onLoad={() => setIsLottieLoading(false)}                            />
                        </div>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Register;
