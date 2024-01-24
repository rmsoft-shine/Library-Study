'use client'

import { Column, ColumnDef, ColumnOrderState, Header, Table, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Person, makeData } from "./makeData";
import { FC, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Table as Tables, TableHead, TableHeader, TableRow, TableBody, TableCell } from "./ui/table";

const defaultColumns: ColumnDef<Person>[] = [
  {
    header: '이름',
    id: 'firstName',
    accessorKey: 'firstName',
    cell: info => info.getValue(),
  },
  {
    header: '성씨',
    // accessorFn: row => `${row.firstName} ${row.lastName}`,
    accessorFn: row => row.lastName,
    id: 'lastName',
    // cell: info => info.getValue(),
  },
  {
    id: 'age',
    accessorKey: 'age',
    header: '나이'
  },
  {
    id: 'visits',
    accessorKey: 'visits',
    header: '방문',
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: '상태',
  },
  {
    id: 'progress',
    accessorKey: 'progress',
    header: '진행 횟수'
  }
]

const reorderColumn = (
  draggedColumnId: string,
  targetColumnId: string,
  columnOrder: string[]
): ColumnOrderState => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0]
  )
  console.log('reorder!')
  return [...columnOrder]
}

const DraggableColumnHeader: FC<{
  header: Header<Person, unknown>;
  table: Table<Person>;
}> = ({ header, table }) => {
  const { getState, setColumnOrder } = table;
  const { columnOrder } = getState();
  const { column } = header;

  const [collection, dropRef] = useDrop({
    accept: 'column',
    drop: (draggedColumn: Column<Person>) => {
      const newColumnOrder = reorderColumn(
        draggedColumn.id,
        column.id,
        columnOrder
      )
      setColumnOrder(newColumnOrder)
    },
    hover: () => { console.log('hovered') },
    collect: (monitor) => { console.log(column.id, " monitor: ", monitor.canDrop()) }
  })

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: 'column',
  })

  return (
    <TableHead
      ref={dropRef}
      colSpan={header.colSpan}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="border"
    >
      <div ref={previewRef}>
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
        <button ref={dragRef} className="ml-2">🫳</button>
      </div>
    </TableHead>
  )
}

export default function TableOrder() {
  const [data, setData] = useState(() => makeData(20));
  const [columns] = useState<ColumnDef<Person>[]>(() => defaultColumns);

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(columns.map(column => column.id as string));

  console.log(columnOrder);
  const table = useReactTable({
    data,
    columns,
    state: {
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    debugAll: true,
  })

  return (
    <div className="p-2">
      <Tables>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <DraggableColumnHeader
                  key={header.id}
                  header={header}
                  table={table}
                />
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Tables>
    </div>
  )
}