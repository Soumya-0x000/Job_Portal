import React, { useState, MouseEvent as ReactMouseEvent } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { CiLock, CiMail, CiUnlock } from "react-icons/ci";
import { showToastMsg } from '../../common/ToastMsg';
import axios from 'axios';
import { URL } from '../../API';
import HomePgBtnNav from '../../common/HomePgBtnNav';
import { MdOutlineAccountCircle } from 'react-icons/md';

export interface FormValues {
    email: string;
    password: string;
}

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
});

const LoginPage: React.FC = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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

    const handleNavigation = async(values: FormValues) => {
        setIsSubmitting(true);

        try {
            const loginUser = await axios.post(`${URL}/auth/login`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '69420'
                }
            })

            if (loginUser.status) {
                const resData = loginUser?.data
                setIsSubmitting(false)
                
                if(resData?.token) {
                    showToastMsg('Login Successful');
                    if (resData?.usersType === 1) {
                        localStorage.setItem('adminDetails', JSON.stringify(resData))
                        navigate(`/admin`, {state: resData?.token});
                    } else if (resData?.usersType === 2) {
                        localStorage.setItem('userDetails', JSON.stringify(resData))
                        navigate(`/home`, {state: resData?.token});
                    }
                }
            }
        } catch (error) {
            setIsSubmitting(false)
            if (axios.isAxiosError(error)) {
                const errMsg = error?.response?.data?.message
                showToastMsg(errMsg)
            } else {
                console.error(error)
                showToastMsg('Error in logging in')
            }
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-900">
            <HomePgBtnNav
                navArr={{label: 'SignUp', link: '/signup', icon: <MdOutlineAccountCircle className=' text-xl text-emerald-300'/>}}
            />

            <div className="flex flex-col w-full sm:w-[30rem] md:w-[40rem] px-8 md:px-32 lg:px-24 justify-center items-center space-y-8">
                <div className="w-full">
                    <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={(values: FormValues) => handleNavigation(values)}>
                        {({ errors, touched }) => (
                            <Form className="bg-slate-700 rounded-md shadow-2xl p-5">
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
                                            onPaste={(e: ReactMouseEvent<HTMLButtonElement>) => type === 'password' ? e.preventDefault() : undefined}
                                            onCopy={(e: ReactMouseEvent<HTMLButtonElement>) => type === 'password' ? e.preventDefault() : undefined}
                                            onCut={(e: ReactMouseEvent<HTMLButtonElement>) => type === 'password' ? e.preventDefault() : undefined}
                                            onDrag={(e: ReactMouseEvent<HTMLButtonElement>) => type === 'password' ? e.preventDefault() : undefined}
                                            onDrop={(e: ReactMouseEvent<HTMLButtonElement>) => type === 'password' ? e.preventDefault() : undefined}
                                        />
                                        
                                        {errors[id as keyof FormValues] && touched[id as keyof FormValues] ? (
                                            <div className="text-red-600 text-sm">{errors[id as keyof FormValues]}</div>
                                        ) : null}
                                    </div>
                                ))}

                                <button
                                type="submit"
                                className="flex items-center justify-center gap-x-2 w-full bg-indigo-600 mt-4 py-2 rounded-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold">
                                    LogIn
                                    {isSubmitting && (
                                        <span style={{ borderTopColor: "transparent" }} className=" aspect-square h-4 border-2 border-blue-200 rounded-full animate-spin"></span>
                                    )}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
