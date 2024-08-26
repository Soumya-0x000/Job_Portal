import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { CiLock, CiUnlock } from "react-icons/ci";
import { showToastMsg } from '../../common/ToastMsg';
import axios from 'axios';
import { URL } from '../../API';
import HomePgBtnNav from './HomePgBtnNav';

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
    const [focusField, setFocusField] = useState<{ [key: string]: boolean }>({});
    const [isLottieLoading, setIsLottieLoading] = useState<boolean>(true);

    const navigate = useNavigate();
    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

    const fields = [
        { 
            id: 'email', 
            type: 'email', 
            placeholder: 'Email Address', 
        }, 
        { 
            id: 'password', 
            type: 'password', 
            placeholder: 'Password', 
            icon: passwordVisible 
                ? <CiUnlock className=' text-2xl'/> 
                : <CiLock className=' text-2xl'/>
        }
    ];

    const handleFocus = (field: string) => {
        setFocusField(prev => ({ ...prev, [field]: true }));
    };

    const handleBlur = (field: string) => {
        setFocusField(prev => ({ ...prev, [field]: false }));
    };

    const handleNavigation = async (values: FormValues) => {
        setIsSubmitting(true);

        try {
            const loginUser = await axios.post(`${URL}/auth/login`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '69420'
                }
            });

            if (loginUser.status) {
                const resData = loginUser?.data;
                setIsSubmitting(false);

                if (resData?.token) {
                    if (resData?.usersType === 1) {
                        localStorage.setItem('adminDetails', JSON.stringify(resData));
                        navigate(`/admin`, { state: resData?.token });
                    } else if (resData?.usersType === 2) {
                        localStorage.setItem('userDetails', JSON.stringify(resData));
                        navigate(`/home`, { state: resData?.token });
                    }
                }
            }
        } catch (error) {
            setIsSubmitting(false);
            if (axios.isAxiosError(error)) {
                const errMsg = error?.response?.data?.message;
                showToastMsg(errMsg);
            } else {
                console.error(error);
                showToastMsg('Error in logging in');
            }
        }
    };

    return (
        <div className="h-screen flex flex-col items-center pt-4 bg-gradient-to-bl from-[#fff] via-[#fff] to-[#fff]">
            <HomePgBtnNav navArr={{ label: "SignUp", link: "/signup" }} />
            <div className="flex flex-col w-full px-8 md:px-32 lg:px-24 justify-center items-center h-full">
                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleNavigation}
                >
                    {({ errors, touched, values }) => (
                        <div className="flex w-fit p-2 rounded-lg justify-center gap-x-3 lg:gap-x-16 bg-gradient-to-br from-slate-50 to-green-50 ring-1 ring-slate-200">
                            <Form className="bg-gradient-to-br from-[#eefffa] to-[#d8efff] rounded-md ring-1 ring-lime-200 p-5 w-[22rem] lsm:w-[26rem] lg:w-[25rem] ">
                                <h1 className="text-slate-600 text-center font-onest tracking-wider font-bold text-2xl mb-12">
                                    Sign In
                                </h1>

                                <div className="grid gap-5">
                                    {fields.map(
                                        ({ id, type, placeholder, icon }) => (
                                            <div
                                                key={id}
                                                className="flex items-center mb-5 rounded-lg relative group"
                                            >
                                                {id === "password" && (
                                                    <span
                                                        onClick={
                                                            id === "password"
                                                                ? togglePasswordVisibility
                                                                : undefined
                                                        }
                                                        className="cursor-pointer absolute right-3 text-black"
                                                    >
                                                        {icon}
                                                    </span>
                                                )}

                                                <Field
                                                    id={id}
                                                    name={id}
                                                    type={
                                                        id === "password" &&
                                                        passwordVisible
                                                            ? "text"
                                                            : type
                                                    }
                                                    className={`w-full bg-white pl-3 pr-10 text-slate-900 border-none outline-none focus:outline-none rounded-lg py-2.5 ${
                                                        focusField[id] ||
                                                        values[
                                                            id as keyof FormValues
                                                        ]
                                                            ? "ring-1 ring-cyan-400 bg-slate-950"
                                                            : ""
                                                    } transition-all hover:ring-blue-300 ring-1 ring-blue-100 peer`}
                                                    autoComplete="off"
                                                    spellCheck="false"
                                                    onFocus={() =>
                                                        handleFocus(id)
                                                    }
                                                    onBlur={() =>
                                                        handleBlur(id)
                                                    }
                                                />

                                                <label
                                                    htmlFor={id}
                                                    className={`absolute transition-all left-4 text-slate-800 text-[15px] ${
                                                        focusField[id] ||
                                                        values[
                                                            id as keyof FormValues
                                                        ]
                                                            ? "left-2 -top-[1.1rem] text-xs font-bold font-montserrat text-slate-600"
                                                            : "top-1/2 -translate-y-1/2"
                                                    }`}
                                                >
                                                    {placeholder}
                                                </label>

                                                {errors[
                                                    id as keyof FormValues
                                                ] &&
                                                touched[
                                                    id as keyof FormValues
                                                ] ? (
                                                    <div className="text-red-500 text-sm absolute -bottom-[1.1rem] right-2">
                                                        {
                                                            errors[
                                                                id as keyof FormValues
                                                            ]
                                                        }
                                                    </div>
                                                ) : null}
                                            </div>
                                        )
                                    )}
                                </div>

                                <div className=" flex flex-col-reverse items-center gap-y-6">
                                    <button
                                        type="submit"
                                        className="flex items-center justify-center gap-x-2 mt-4 py-2 rounded-lg bg-[#dee8ff] ring-1 ring-blue-200 hover:bg-blue-200 active:scale-95 transition-all duration-200 text-slate-500 hover:text-indigo-600 font-semibold font-mavenPro tracking-wider w-1/2"
                                    >
                                        LogIn
                                        {isSubmitting && (
                                            <span
                                                style={{
                                                    borderTopColor:
                                                        "transparent",
                                                }}
                                                className="aspect-square h-4 border-2 border-blue-500 rounded-full animate-spin"
                                            ></span>
                                        )}
                                    </button>

                                    <div className=" flex items-center justify-between w-full mt-3 px-2 text-slate-600">
                                        <span>Don't have an account?</span>

                                        <Link
                                            to={"/signup"}
                                            className=" px-2 rounded-lg hover:underline group font-onest"
                                        >
                                            Signup
                                        </Link>
                                    </div>
                                </div>
                            </Form>

                            {isLottieLoading && (
                                <div className=" hidden md:flex items-center justify-center pr-10 w-[20rem] lg:w-[25rem]">
                                    <span
                                        style={{
                                            borderTopColor: "transparent",
                                        }}
                                        className="aspect-square h-10 border-4 border-blue-200 rounded-full animate-spin"
                                    ></span>
                                </div>
                            )}

                            <iframe
                                src="https://lottie.host/embed/aacfed6c-8090-48f4-b636-dcf3b9387b9f/TIUiD67yCc.json"
                                className={`hidden ${
                                    !isLottieLoading ? "md:block" : ""
                                } pr-10 w-[20rem] lg:w-[25rem]`}
                                onLoad={() => setIsLottieLoading(false)}
                            />
                        </div>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default LoginPage;
