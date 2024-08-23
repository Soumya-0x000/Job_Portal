import { useFormik } from "formik";
import { FC, useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

interface InputTypes {
    name: string;
    type: string,
    value: string
}

const inputDetails: InputTypes[] = [
    { name: "name", type: "text", value: 'Name' },
    { name: "email", type: "email", value: 'Email' },
    { name: "phoneNumber", type: "number", value: 'Phone number' },
    { name: "resume", type: "file", value: 'Resume' },
    { name: "address", type: "text", value: 'Address' },
];

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    resume: Yup.mixed().required("Resume is required"),
});

interface FormData {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
}

export const JobApplyForm: FC = () => {
    const [showJobs, setShowJobs] = useState<boolean>(false);
    const navigate = useNavigate();

    const formik = useFormik<FormData>({
        initialValues: {
            name: "",
            email: "",
            phoneNumber: "",
            address: "",
        },
        validationSchema,
        onSubmit: () => setShowJobs(true),
    });

    const handleClickNavigate = () => {
        if (formik.isValid && formik.dirty)
            navigate("career", { state: { values: formik.values } });
        else alert("error in submission");
    };

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col justify-center w-full md:w-[70%] xl:w-[55%] 2xl:max-w-[50rem] bg-white px-6 py-8 rounded-lg shadow-lg"
        >
            <div className="md:grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {inputDetails.map((input, index) => (
                    <div
                        key={index}
                        className={`relative ${
                            input.name === "address" ? "col-span-2" : ""
                        } w-full`}
                    >
                        <input
                            className={`w-full h-12 flex items-center file:py-1.5 file:px-4 file:rounded-full file:border-0 file:ring-1 file:ring-violet-600 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-200 file:absolute file:top-1/2 file:-translate-y-1/2 bg-gray-100 text-gray-800 border-none outline-none focus:ring-1 focus:ring-blue-500 rounded-lg py-3 px-4 transition-all peer`}
                            id={input.name}
                            type={input.type}
                            name={input.name}
                            value={formik.values[input.name as keyof FormData]}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />

                        <label
                            htmlFor={input.name}
                            className={`absolute transition-all left-3 text-gray-500 ${
                                formik.values[input.name as keyof FormData]
                                    ? "text-sm -top-[11px]"
                                    : "text-sm top-1/2 -translate-y-1/2"
                            } px-1 peer-focus-within:-top-[11px] ${input.type === 'file' ? 'scale-0 peer-focus-within:scale-100' : ''}`}
                        >
                            {input.value}
                        </label>

                        {formik.touched[input.name as keyof FormData] &&
                            formik.errors[input.name as keyof FormData] && (
                                <p className="text-red-500 text-xs absolute right-0 bottom-0 top-full">
                                    {
                                        formik.errors[
                                            input.name as keyof FormData
                                        ]
                                    }
                                </p>
                            )}
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between gap-x-5 mt-5">
                <button
                    type="submit"
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md w-full hover:bg-blue-700 active:scale-95 transition-all duration-200"
                >
                    Submit
                </button>

                {showJobs && (
                    <button
                        className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md w-full hover:bg-indigo-700 active:scale-95 transition-all duration-200"
                        onClick={handleClickNavigate}
                    >
                        <span className="md:hidden">Jobs</span>
                        <span className="hidden md:block">
                            See available jobs
                        </span>
                    </button>
                )}
            </div>
        </form>
    );
};
