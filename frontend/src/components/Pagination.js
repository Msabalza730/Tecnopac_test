import React from "react";
import { TablePagination } from "@mui/material";
import { useGridApiContext, useGridSelector } from "@mui/x-data-grid";
import { gridPageCountSelector, gridPageSelector, gridPaginationRowCountSelector, gridPageSizeSelector } from "@mui/x-data-grid";

function Pagination({ rowsPerPageOptions }) {
    const gridApiContext = useGridApiContext();

    const page = useGridSelector(gridApiContext, gridPageSelector);
    const rowCount = useGridSelector(gridApiContext, gridPaginationRowCountSelector); // Cambio aquí
    const pageCount = useGridSelector(gridApiContext, gridPageCountSelector);
    const pageSize = useGridSelector(gridApiContext, gridPageSizeSelector);

    const handleChangePage = (event, newPage) => {
        gridApiContext.current.setPage(newPage);
    };

    const handleChangePageSize = (event) => {
        gridApiContext.current.setPageSize(parseInt(event.target.value, 10));
        gridApiContext.current.setPage(0);
    };

    return (
        <TablePagination
            component="div"
            count={rowCount}
            page={page}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handleChangePageSize}
            onPageChange={handleChangePage}
            rowsPerPageOptions={rowsPerPageOptions}
        />
    );
}

export default Pagination;
