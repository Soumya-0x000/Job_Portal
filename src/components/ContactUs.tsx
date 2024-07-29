import banner from '../images/courses/coursesBanner.jpg';
import { useState } from 'react';
import { Footer } from '../common/Footer';
import * as Yup from 'yup';
import { ErrorMessage, Field, Formik } from 'formik';
import { Form } from 'react-router-dom';

const ContactUs = () => {
    const map = ' https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d904726.6131739549!2d88.3953!3d26.7271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2snp!4v1652535615693!5m2!1sen!2snp" allowfullscreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" '

    const initialFormValues = {
        name: '',
        email: '',
        subject: '',
        message: '',
    };

    const [formData, setFormData] = useState(initialFormValues);

    const handleChange = (e: any) => {
        setFormData({
            ...formData, 
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: any)  => {
        console.log(formData);
        e.preventDefault()
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Full name is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        subject: Yup.string().required('Subject is required'),
        message: Yup.string().required('Message is required'),
    });

    return (
        <div className='relative h-screen scroll-smooth'>
            {/* banner */}
            <div
            className={`h-full flex flex-col items-start justify-center pl-4 pr-4 sm:pl-12 md:pl-32 bg-fixed bg-cover bg-top`}
            style={{
                backgroundImage: `url('${banner}')`,
            }}>
                <div className='text-[1rem] lg:text-[1.3rem] font-montserrat font-bold text-blue-900 uppercase'>
                    Welcome to stumate
                </div>

                <div className='mt-3 font-bold text-[2.3rem] md:text-[3rem] xl:text-[4.2rem] leading-[50px] xl:leading-[70px] font-jaldi text-blue-900 text-wrap flex flex-wrap sm:w-[35rem] md:w-[43rem] capitalize'>
                    get in touch with us
                </div>

                <div className='mt-3 mb-4 text-[1.1rem] sm:text-xl font-mavenPro font-bold text-black'>
                    "The roots of education are bitter, but the fruit is sweet."
                </div>
            </div>


            {/* content */}
            <>
                <div className='relative flex flex-col items-center justify-center text-blue-900 mx-6 mt-16 mb-8 text-2xl font-bold text-center capitalize font-onest gap-y-2 md:text-4xl'>
                    We are located here!
                </div>

                <div className=' flex items-center justify-center w-full px-3'>
                    <div className='shadow contentContainer'>
                        {/* map */}
                        <div>
                            <iframe src={map} className='map'></iframe>
                        </div>

                        {/* form */}
                        <div className='formContainer space-y-16'>
                            <div className=' space-y-2'>
                                <div className='text-3xl font-mavenPro font-bold text-blue-900'>
                                Contact us
                                </div>
                                <div className='text-lg font-mavenPro font-bold text-indigo-500'>
                                    We're 24x7 open for any suggestion or having a chat
                                </div>
                            </div>

                            <Formik
                            initialValues={initialFormValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}>
                            {({ isSubmitting, handleReset }) => (
                                <Form className="bg-white rounded-md shadow-2xl p-5">
                                    <div className="flex flex-col sm:flex-row gap-y-3 sm:gap-x-3">
                                        <div className="w-full sm:w-1/2">
                                            <Field
                                                type="text"
                                                name="name"
                                                placeholder="Full name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`border-2 mb-2 py-2 px-3 rounded-2xl outline-none focus:border-indigo-400 ${formData.name ? 'border-indigo-400 bg-slate-200' : ''}`}
                                            />
                                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                                        </div>
                                        <div className="w-full sm:w-1/2">
                                            <Field
                                                type="email"
                                                name="email"
                                                placeholder="Email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`border-2 mb-2 py-2 px-3 rounded-2xl outline-none focus:border-indigo-400 ${formData.email ? 'border-indigo-400 bg-slate-200' : ''}`}
                                            />
                                            <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                                        </div>
                                    </div>

                                    <div className="w-full mt-3">
                                        <Field
                                            type="text"
                                            name="subject"
                                            placeholder="Subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className={`border-2 mb-2 py-2 px-3 rounded-2xl outline-none focus:border-indigo-400 w-full ${formData.subject ? 'border-indigo-400 bg-slate-200' : ''}`}
                                        />
                                        <ErrorMessage name="subject" component="div" className="text-red-500 text-sm" />
                                    </div>

                                    <div className="w-full mt-3">
                                        <Field
                                            as="textarea"
                                            rows="12"
                                            name="message"
                                            placeholder="Message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className={`border-2 mb-2 py-2 px-3 rounded-2xl outline-none focus:border-indigo-400 w-full ${formData.message ? 'border-indigo-400 bg-slate-200' : ''}`}
                                        />
                                        <ErrorMessage name="message" component="div" className="text-red-500 text-sm" />
                                    </div>

                                    <div className="flex flex-col items-center justify-between mt-3 sm:flex-row gap-y-4 w-full">
                                        <button
                                            type="submit"
                                            className="text-md font-bold bg-indigo-600 mt-5 py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white mb-2 w-full sm:w-[7rem]"
                                            disabled={isSubmitting}
                                        >
                                            Submit
                                        </button>

                                        <button
                                            type="button"
                                            className="text-md font-bold bg-indigo-600 mt-5 py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white mb-2 w-full sm:w-[7rem]"
                                            onClick={handleReset}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                        </div>
                    </div>
                </div>
            </>

            {/* footer */}
            <div className='mt-10'>
                <Footer/>
            </div>
        </div>
    )
}

export default ContactUs;
