'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/UI/table';
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { DateConversionWithTime } from '@/utils/DateConversionWithTime';
import { getApiBaseUrl, getBrandHeaders } from '@/lib/brand-config';

const getAuthHeaders = () => {
  if (typeof window === 'undefined') return getBrandHeaders();
  const token = window.localStorage.getItem('token');
  return token
    ? { ...getBrandHeaders(), Authorization: `Bearer ${token}` }
    : getBrandHeaders();
};



export default function AdminTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openLevel, setOpenLevel] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${getApiBaseUrl()}/user/role/admin?limit=all`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    })
      .then((res) => res.json())
      .then((json) => {
        setData(Array.isArray(json.data) ? json.data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [openLevel]);

  const handleDelete = (email) => {
    fetch(`${getApiBaseUrl()}/user/delete/${email}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(() => {
      setData((d) => d.filter((u) => u.email !== email));
    });
  };

  const handleBlockToggle = (email, current) => {
    fetch(`${getApiBaseUrl()}/user`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ email, isBlock: !current }),
    }).then(() => {
      setData((d) =>
        d.map((u) =>
          u.email === email ? { ...u, isBlock: !current } : u
        )
      );
    });
  };

  const AddLevel = (email) => {
    setSelectedEmail(email);
    setOpenLevel(true);
  };

  const columns = useMemo(
    () => [
      { header: 'Name', accessorKey: 'name' },
      { header: 'ID', accessorKey: 'teamId' },
      { header: 'Email', accessorKey: 'email' },
      { header: 'Number', accessorKey: 'number' },
      { header: 'Address', accessorKey: 'perDistrict' },
      {
        header: 'Join',
        cell: ({ row }) =>
          DateConversionWithTime(row.original.joiningDate),
      },
      {
        header: 'Tags',
        accessorFn: (row) =>
          [
            row.levels?.level1,
            row.levels?.level2,
            row.levels?.level3,
            row.levels?.level4,
            row.levels?.level5,
          ].join(', '),
      },
      {
        header: 'Add Level',
        cell: ({ row }) => (
          <button
            className="px-2 py-1 bg-white shadow-md rounded-md text-xs"
            onClick={() => AddLevel(row.original.email)}
          >
            Add Level
          </button>
        ),
      },
      {
        header: 'Block',
        cell: ({ row }) => (
          <button
            className={`px-3 py-1 shadow-md rounded-md text-xs ${
              row.original.isBlock
                ? 'bg-yellow-400'
                : 'bg-white'
            }`}
            onClick={() =>
              handleBlockToggle(row.original.email, row.original.isBlock)
            }
          >
            {row.original.isBlock ? 'Unblock' : 'Block'}
          </button>
        ),
      },
      {
        header: 'Delete',
        cell: ({ row }) => (
          <button
            className="px-3 py-1 bg-white shadow-md rounded-md text-xs"
            onClick={() => handleDelete(row.original.email)}
          >
            Delete
          </button>
        ),
      },
      {
        header: 'Details',
        cell: ({ row }) => (
          <button
            className="px-3 py-1 bg-white shadow-md rounded-md text-xs"
            onClick={() => handleDelete(row.original.email)}
          >
            Delete
          </button>
        ),
      },
    ],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="rounded-md border overflow-auto">
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-8">
                    No admins found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
