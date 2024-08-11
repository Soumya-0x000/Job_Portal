import { useState, useEffect, FC } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useMediaQuery, useTheme } from "@mui/material";
import { Candidate } from "../../../common/DemoData";
import { Loading } from "../../../common/Loading";

const ShowJobs: FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [candidateData, setCandidateData] = useState<Candidate[]>([]);

    useEffect(() => {
        setCandidateData(JSON.parse(localStorage.getItem('demoCandidateData') || '[]'))
    }, []);

    const theme = useTheme();
    const isSmToMd = useMediaQuery(theme.breakpoints.between(640, 768));
    const isMdToLg = useMediaQuery(theme.breakpoints.between(768, 1024));
    const isLgToXl = useMediaQuery(theme.breakpoints.between(1024, 1280)); 
    const isLgTo2Xl = useMediaQuery(theme.breakpoints.between(1280, 1536));
    const isXlUp = useMediaQuery(theme.breakpoints.up(1536));

    const getColumnWidth = (defaultWidth: number) => {
        if (isSmToMd) return defaultWidth * 1.1;
        if (isMdToLg) return defaultWidth * 1.1;
        if (isLgToXl) return defaultWidth * 1.1; 
        if (isLgTo2Xl) return defaultWidth * 1.12;
        if (isXlUp) return defaultWidth * 1.26;
        return defaultWidth;
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: getColumnWidth(150) },
        { field: 'email', headerName: 'Email', width: getColumnWidth(270) },
        { field: 'address', headerName: 'Address', width: getColumnWidth(250) },
        { field: 'phone', headerName: 'Phone', width: getColumnWidth(100) },
        { field: 'filename', headerName: 'CV File', width: getColumnWidth(200) },
        { field: 'status', headerName: 'Status', width: getColumnWidth(100) },
        { field: 'jobRole', headerName: 'Job Role', width: getColumnWidth(200) },
    ];

    const rows = candidateData.map(candidate => ({
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        address: candidate.address,
        phone: candidate.phone,
        filename: candidate.filename,
        status: candidate.status,
        jobRole: candidate.jobRole,
    }));

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 600);
    }, []);

    return (
        <div className="flex items-center justify-center overflow-y-auto px-4 pt-20 pb-6">
            {loading ? (
                <div className="flex items-center justify-center w-full h-screen">
                    <Loading />
                </div>
            ) : (
                <div className="w-screen sm:w-[32rem] md:w-[39rem] lg:w-[55rem] xl:w-[72rem] Lxl:w-[80rem] 2xl:w-[88rem]">
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[15, 30, 50, 70, 100]}
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }}
                        sx={{
                            '& .MuiDataGrid-cell': {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '17px'
                            },
                            '& .MuiDataGrid-root': {
                                border: 'none'
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default ShowJobs;
