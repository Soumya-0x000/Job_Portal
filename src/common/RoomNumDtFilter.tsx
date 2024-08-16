import { Menu, MenuItem, MenuProps } from "@mui/material";
import { FC, useState } from "react";
import styled from "styled-components";
import { generateUniqueId } from "./UniqID";

export const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(() => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        minWidth: 180,
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
    },
}));

type FilterItem = {
    label: string;
    value: string;
};

type RoomNumDtFilterProps = {
    filterItems: FilterItem[];
    handleMenuSelection: (value: string) => void; 
};

const RoomNumDtFilter: FC<RoomNumDtFilterProps> = ({ 
    filterItems, 
    handleMenuSelection 
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selected, setSelected] = useState<string>('');
    const openMenu = Boolean(anchorEl);

    const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    return (
        <>
            <button
                id="demo-customized-button"
                aria-controls={openMenu ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openMenu ? 'true' : undefined}
                className="fixed bottom-3 right-3 bg-blue-900 text-blue-200 tracking-wide font-montserrat rounded-lg py-1.5 px-3 flex items-center justify-center hover:bg-blue-950 transition-all duration-500 active:scale-90 group z-40 ring-[1px] ring-slate-400"
                onClick={handleFilterClick}
            >
                Filters
            </button>

            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{ 'aria-labelledby': 'demo-customized-button' }}
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
            >
                {filterItems.map((item, indx) => (
                    <MenuItem
                        key={generateUniqueId() + indx}
                    >
                        <button
                            className={`flex px-4 py-2 text-sm text-gray-700 hover:bg-slate-600 hover:text-slate-200 w-[11rem] ring-1 rounded-md gap-2 bg-slate-200 font-lato active:scale-105 transition-all ${(item.value === selected) ? ' bg-slate-900 text-slate-200' : ''} `}
                            role="menuitem"
                            onClick={() => {
                                handleMenuSelection(item.value);
                                setSelected(item.value)
                                handleMenuClose();
                            }}
                        >
                            <span>{item.label}</span>
                        </button>
                    </MenuItem>
                ))}
            </StyledMenu>
        </>
    );
};

export default RoomNumDtFilter;
