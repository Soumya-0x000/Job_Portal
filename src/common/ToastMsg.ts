import { Bounce, toast } from "react-toastify";

export const showToastMsg: (msg: string) => void = (msg) => {
    toast(msg, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
    });
};