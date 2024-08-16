import { Pagination } from '@mui/material';
import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';

interface paginationType {
    limit: number;
    offset: number;
}

interface paginationPropTypes {
    setPaginationData: Dispatch<SetStateAction<paginationType>>;
    paginationData: paginationType;
    dataCount: {
        totalBookings: number;
        limit: number;
    };
}

const CustomPagination: FC<paginationPropTypes> = ({
    setPaginationData,
    paginationData,
    dataCount,
}) => {
    console.log(
        paginationData, dataCount
    )
    const [page, setPage] = useState<number>(1);

    const handlePaginationPgCount = (event: ChangeEvent<unknown>, page: number) => {
        setPage(page);
        setPaginationData((prev: paginationType) => ({
            ...prev,
            offset: (page - 1) * paginationData.limit
        }));
    };

    return (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-2 bg-slate-100 px-2 py-1.5 rounded-lg overflow-hidden">
            <Pagination 
                count={Math.ceil(dataCount.totalBookings / dataCount.limit)} 
                page={page} 
                onChange={handlePaginationPgCount} 
                variant="outlined" 
                shape="rounded"
            />
            cdscds
        </div>
    );
};

export default CustomPagination;
