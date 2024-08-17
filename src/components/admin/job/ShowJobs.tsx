import { useState, useEffect, FC } from "react";
import { DataGrid, GridColDef, GridRowParams, GridToolbar } from "@mui/x-data-grid";
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

    const getRowClassName = (params: GridRowParams) => {
        const status = params.row.status;
        return status === 'pending' ? 'pending-row' : 'approved-row';
    };

    return (
        <div className="flex items-center justify-center overflow-y-auto px-4 pt-20 pb-6">
            {loading ? (
                <div className="flex items-center justify-center w-full h-screen">
                    <Loading />
                </div>
            ) : (

                <div className=" ">
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
                            width: 1200,
                            '& .MuiDataGrid-toolbarContainer': {
                                marginBottom: 1,
                                paddingBottom: 1,
                                backgroundColor: 'rgb(201, 224, 255)',
                            },
                            '& .MuiDataGrid-columnHeader': {
                                backgroundColor: '#d0fdeb',
                            },
                            '& .MuiDataGrid-cell': {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '17px'
                            },
                            '& .MuiDataGrid-root': {
                                border: 'none',
                                borderWidth: '0px',
                                outline: 'none',
                            },
                            '& .pending-row': {
                                border: 'none',
                                backgroundColor: '#eafffa',
                                color: '#353938',
                                '&:hover': {
                                    backgroundColor: '#7e8e01',
                                    color: '#f8ffc1', 
                                },
                            },
                            '& .approved-row': {
                                border: 'none',
                                backgroundColor: '#d8f9ff',
                                color: '#003d48',
                                '&:hover': {
                                    backgroundColor: '#7e8e01',
                                    color: '#f8ffc1', 
                                },
                                '&:active': {
                                    backgroundColor: '#e1fff8',
                                }
                            },
                            '& .MuiDataGrid-row.Mui-selected': {
                                backgroundColor: '#3f99b8',
                                color: '#dff6fe'
                            },
                            '&  .MuiDataGrid-row.Mui-selected:hover': {
                                 backgroundColor: '#3f99b8',
                                color: '#dff6fe'
                            },
                            '& .MuiDataGrid-footerContainer ': {
                                display: 'none',
                                border: 'none',
                            },
                            
                        }}
                        className="custom-class"
                        getRowClassName={getRowClassName}
                    />
                </div>
            )}
        </div>
    );
};

export default ShowJobs;
