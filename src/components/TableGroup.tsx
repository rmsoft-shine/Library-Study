'use client'

import { ColumnDef, ColumnOrderState, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Person, makeData } from "./makeData";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const defaultColumns: ColumnDef<Person>[] = [
  {
    header: 'Name',
    columns: [
      {
        id: '이름',
        accessorKey: 'firstName',
        header: '이름',
        cell: info => info.getValue(),
      },
      {
        accessorFn: row => row.lastName,
        id: '성씨',
        cell: info => info.getValue(),
        header: () => (<span>성씨</span>)
      },
    ],
  },
  /// 여기까지 한 그룹
  {
    header: 'Info',
    columns: [
      {
        id: '나이',
        accessorKey: 'age',
        header: () => '나이',
      },
      {
        header: 'More Info',
        columns: [
          {
            id: '방문',
            accessorKey: 'visits',
            header: () => <span>방문</span>
          },
          {
            id: '상태',
            accessorKey: 'status',
            header: '상태'
          },
          {
            id: '진행',
            accessorKey: 'progress',
            header: '실시 횟수'
          },
        ],
      },
    ],
  },
]

export default function TableGroup() {
  const [data, setData] = useState(() => makeData(20));
  const [columns] = useState(() => [...defaultColumns]);

  const [columnVisibility, setColumnVisibility] = useState({}); //?
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    debugAll: true,
  })

  return (
    <div className="p-2">
      {/* 체크박스 */}
      <div className="w-fit border border-black shadow rounded m-auto">
        <label>
          <Checkbox
            {...{
              checked: table.getIsAllColumnsVisible(),
              onCheckedChange: table.getToggleAllColumnsVisibilityHandler(),
            }}
          />{' '}
          모두 선택
        </label>
        {table.getAllLeafColumns().map((column) => {
          return (
            <div
              key={column.id}
              className="px-2"
            >
              <label>
                <Checkbox
                  {...{
                    checked: column.getIsVisible(),
                    onCheckedChange: (value) => column.toggleVisibility(!!value),
                  }}
                />{' '}
                {column.id}
              </label>
            </div>
          )
        })}
      </div>
      {/* 테이블 */}
      <div className="rounded-md border">
        <Table>
          {/* 테이블 헤더 */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan} className="border text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          {/* 테이블 바디 */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="border">
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
      </div>
    </div>
  );
}
