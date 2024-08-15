import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Outlet, useNavigate } from 'react-router-dom';
import { IoIosCreate } from "react-icons/io";
import { BiLogOutCircle } from "react-icons/bi";
import { LuLayoutDashboard } from "react-icons/lu";
import { FC, ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { TbUsersGroup } from "react-icons/tb";

const drawerWidth = 190;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));
  
interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

interface btnArrType {
    name: string;
    icon: ReactNode;
    clickEvent: () => void;
}

export const AdminSideBar: FC<{ userName: string }> = ({ userName }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [open, setOpen] = useState<boolean>(false);
    
    const buttonArr: btnArrType[] = [
        {
            name: 'Candidates',
            icon: <LuLayoutDashboard className=" text-[1.4rem]"/>,
            clickEvent: () => navigate('/admin')
        }, {
            name: 'Room booking',
            icon: <IoIosCreate className=" text-[1.4rem]"/>,
            clickEvent: () => navigate('rooms')
        }, {
            name: 'User bookings',
            icon: <TbUsersGroup className=" text-[1.4rem]"/>,
            clickEvent: () => navigate('userbookings')
        }, {
            name: 'LogOut',
            icon: <BiLogOutCircle className=" text-[1.4rem]"/>,
            clickEvent: () => navigate('/') 
        }, 
    ]

    const [selectedBtn, setSelectedBtn] = useState(buttonArr[0]?.name)

    const handleDrawerOpen = () => setOpen(true)

    const handleDrawerClose = () => setOpen(false)

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{
                        marginRight: 5,
                        ...(open && { display: 'none' }),
                        backgroundColor: '#bcfffe'
                    }}>
                        <MenuIcon />
                    </IconButton>
                    
                    <div className=' w-full flex items-center justify-between text-[1.5rem] font-bold font-lato tracking-wider text-blue-100'>
                        <div className=' flex  items-center justify-center gap-x-1'>
                            {userName}
                            <MdOutlineAdminPanelSettings className=' text-[1.6rem]'/>
                        </div>

                        {selectedBtn}
                    </div>
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>

                <Divider />

                <List>
                    {buttonArr.map((btn, index) => (
                        <ListItem 
                        key={btn.name + index} 
                        disablePadding 
                        sx={{ 
                            display: 'block',
                            backgroundColor: selectedBtn === btn.name ? '#e4e2e2' : 'none',
                        }}>
                            <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            onClick={() => (
                                setSelectedBtn(btn.name), 
                                btn.clickEvent()
                            )}>
                                <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}>
                                    {btn.icon}
                                </ListItemIcon>
                                
                                <ListItemText primary={btn.name} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                
                <Divider />
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Outlet/>
            </Box>
        </Box>
    );
}


interface DropdownProps {
    children: ReactNode;
    id: number | string;
    onStatusChange: (status: string, id: number | string) => void;
}

export const Dropdown: FC<DropdownProps> = ({ children, id, onStatusChange }) => {
    const [isHover, toggleHover] = useState(false);
    const toggleHoverMenu = () => toggleHover(!isHover);

    const candidateStatusArr = () => {
        const statusArr: string[] = ['Pending', 'Approved'];

        return statusArr.map(status => ({
            name: status,
            onClick: () => onStatusChange(status.toLowerCase(), id)
        }));
    };

    const subMenuAnimate = {
        enter: {
            opacity: 1,
            rotateX: 0,
            transition: {
                duration: 0.2
            },
            display: "block"
        },
        exit: {
            opacity: 0,
            rotateX: -15,
            transition: {
                duration: 0.2,
                delay: 0.1
            },
            transitionEnd: {
                display: "none"
            }
        }
    };

    return (
        <motion.div
            className="relative"
            onHoverStart={toggleHoverMenu}
            onHoverEnd={toggleHoverMenu}>
            {children}
            <motion.div
                className="sub-menu absolute right-0"
                initial="exit"
                animate={isHover ? "enter" : "exit"}
                variants={subMenuAnimate}>
                <div className="sub-menu-background" />
                <div className=" flex flex-col gap-y-2 w-[7rem] md:w-[10rem] ring-1 ring-yellow-200 bg-slate-900 p-2 rounded-lg">
                    {candidateStatusArr().map((status, index) => (
                        <button className={`w-full flex justify-center rounded-lg py-2 active:scale-95 transition-all`}
                            key={index}
                            onClick={status.onClick}
                            style={{ 
                                backgroundColor: status.name.toLowerCase() === 'pending' ? '#FF5D5D' : '#5DFF89', 
                                color: status.name.toLowerCase() === 'pending' ? '#430202' : '#003E11' 
                            }}>
                            {status.name}
                        </button>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};
