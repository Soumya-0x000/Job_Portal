import { Bounce, toast } from "react-toastify";

export const showToastMsg: (msg: string) => void = (msg) => {
    toast(msg, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        style: {
            backgroundColor: "#606c82",
            color: "#fff",
        },
    });
};
