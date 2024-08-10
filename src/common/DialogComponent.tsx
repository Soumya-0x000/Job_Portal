import { Dialog, Slide } from "@mui/material";
import { FC, forwardRef, ReactElement, ReactNode, Ref } from "react";
import { TransitionProps } from "@mui/material/transitions";

export const Transition = forwardRef(function Transition(
    props: TransitionProps & {
      children: ReactElement;
    },
    ref: Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const DialogComponent: FC<{
    children: ReactNode;
    open: boolean;
    setOpen: (open: boolean) => void;
}> = ({ children, open, setOpen }) => {
    const handleClose = () => setOpen(false);

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            {children}
        </Dialog>
    );
};
