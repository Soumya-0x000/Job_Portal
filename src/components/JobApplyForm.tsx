import { useFormik } from 'formik';
import { FC, forwardRef, useState } from 'react';
import * as Yup from 'yup';
import Career from './Career';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

interface InputTypes {
    name: string;
    type: string;
    placeholder: string;
}

const inputDetails: InputTypes[] = [
    { name: 'name', type: 'text', placeholder: 'Enter your name' },
    { name: 'email', type: 'email', placeholder: 'Enter your email' },
    { name: 'phone', type: 'number', placeholder: 'Enter your phone number' },
    { name: 'resume', type: 'file', placeholder: 'Upload your resume' },
    { name: 'address', type: 'text', placeholder: 'Enter your address' },
];

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    resume: Yup.mixed().required('Resume is required')
});

interface FormData {
    name: string;
    email: string;
    phone: string;
    address: string;
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    }, ref: React.Ref<unknown>,
    ) { return <Slide direction="up" ref={ref} {...props} /> }
);

export const JobApplyForm: FC = () => {
    const [showJobs, setShowJobs] = useState<boolean>(false);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const formik = useFormik<FormData>({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            address: '',
        },
        validationSchema,
        onSubmit: () => setShowJobs(true)
    });

    return (
        <form onSubmit={formik.handleSubmit} className=' flex flex-col justify-center lg:w-[50%] max-w-[50%] bg-[#3f4f66fd] px-5 py-3 rounded-lg backdrop-blur z-50'>
            <div className=' grid grid-cols-1 md:grid-cols-2 gap-4 w-full'>
                {inputDetails.map((input, index) => (
                    <div key={index} className={` ${input.name === 'address' ? 'col-span-2' : ''} w-full`}>
                        <label className="block text-gray-200 text-sm font-bold mb-1" htmlFor={input.name}>
                            {input.name.charAt(0).toUpperCase() + input.name.slice(1)}
                        </label>

                        {input.name === 'resume' ? (
                            <label className='block '>
                                <span className="sr-only">Choose profile photo</span>
                                <input
                                    className="block w-full bg-white focus:ring-2 ring-green-400 rounded-md overflow-hidden text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-green-300 file:text-green-800 hover:file:bg-yellow-200 hover:file:text-yellow-800 transition-all"
                                    type={input.type}
                                    id={input.name}
                                    // accept='.pdf, .doc, .docx'
                                    name={input.name}
                                    onChange={(event) => formik.setFieldValue('resume', event.currentTarget.files ? event.currentTarget.files[0] : null)}
                                />
                            </label>
                        ) : input.name === 'address' ? (
                            <textarea
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline col-span-2"
                                id={input.name}
                                name={input.name}
                                placeholder={input.placeholder}
                                value={formik.values[input.name as keyof FormData]}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                rows={4}
                            />
                        ) : (
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id={input.name}
                                type={input.type}
                                placeholder={input.placeholder}
                                name={input.name}
                                value={formik.values[input.name as keyof FormData]}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        )}

                        {formik.touched[input.name as keyof FormData] && formik.errors[input.name as keyof FormData] && (
                            <p className="text-red-500 text-xs italic">{formik.errors[input.name as keyof FormData]}</p>
                        )}
                    </div>
                ))}
            </div>
            
            <div className=' flex items-center justify-between gap-x-5'>
                <button
                type="submit"
                className="bg-blue-500 text-white active:scale-95 transition-all font-bold mt-5 py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                    Submit
                </button>

                {showJobs && (
                    <button
                    className="bg-indigo-500 text-white active:scale-95 transition-all font-bold mt-5 py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    onClick={handleClickOpen}>
                        See avialable jobs
                    </button>
                )}
            </div>

            <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}>
                <AppBar sx={{ position: 'relative' }}>  
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Jobs
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleClose}>
                            save
                        </Button>
                    </Toolbar>
                </AppBar>

                <List>
                    <Divider />
                    <ListItemButton>
                        <Career/>
                    </ListItemButton>
                </List>
            </Dialog>
        </form>
    );
};
