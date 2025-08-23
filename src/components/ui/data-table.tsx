import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: {
    pageIndex: number;
    pageSize: number;
    total: number;
    onPaginationChange: OnChangeFn<PaginationState>;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    pageCount: pagination
      ? Math.ceil(pagination.total / pagination.pageSize)
      : -1,
    state: {
      pagination: pagination
        ? { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize }
        : undefined,
    },
    onPaginationChange: pagination?.onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, 
  });

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {pagination && (
        <div className="flex justify-between items-center py-2">
          <span>
            Page {pagination.pageIndex + 1} of{" "}
            {Math.ceil(pagination.total / pagination.pageSize)}
          </span>
          {/* Pagination controls */}
          <div className="flex space-x-2">
            <button
              onClick={() =>
                pagination.onPaginationChange({
                  pageIndex: Math.max(0, pagination.pageIndex - 1),
                  pageSize: pagination.pageSize,
                })
              }
              disabled={pagination.pageIndex === 0}
            >
              Prev
            </button>
            <button
              onClick={() =>
                pagination.onPaginationChange({
                  pageIndex: pagination.pageIndex + 1,
                  pageSize: pagination.pageSize,
                })
              }
              disabled={
                (pagination.pageIndex + 1) * pagination.pageSize >=
                pagination.total
              }
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
