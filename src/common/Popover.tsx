import * as React from 'react';
import Box from '@mui/material/Box';
import Popper, { PopperPlacementType } from '@mui/material/Popper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import { useNavigate } from 'react-router-dom';

interface childType {
    children: React.ReactNode;
    email: string;
}

export const PositionedPopper: React.FC<childType> = ({children, email}) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = React.useState(false);
    const [placement, setPlacement] = React.useState<PopperPlacementType>();
    const navigate = useNavigate();

    const handleClick =
        (newPlacement: PopperPlacementType) =>
        (event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
            setOpen((prev) => placement !== newPlacement || !prev);
            setPlacement(newPlacement);
        };

    const actions = [{
            name: 'Sign out',
            operation: () => {
                setOpen(false)
                navigate('/')
            }
        }, {
            name: 'Delete account',
            operation: () => {
                setOpen(false)
                navigate('/')
                localStorage.removeItem(email)
            }
        }
    ]

    return (
        <Box>
            <Popper
            sx={{ zIndex: 1200 }}
            open={open}
            anchorEl={anchorEl}
            placement={placement}
            transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <div className='flex flex-col gap-y-2 bg-slate-900 p-2 rounded-lg'>
                            {actions.map((action, index) => (
                                <button className=' bg-blue-900 text-blue-200 px-4 py-2 rounded-lg font-bold text-[16px]'
                                onClick={action.operation}
                                key={index}>
                                    {action.name}
                                </button>
                            ))}
                        </div>
                    </Fade>
                )}
            </Popper>
        
            <Grid container justifyContent="center">
                <Grid item>
                    <Button onClick={handleClick('bottom-start')}>
                        {children}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}
