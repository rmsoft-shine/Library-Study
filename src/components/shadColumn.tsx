import { ColumnDef } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    id: "206a9p63",
    amount: 150,
    status: "pending",
    email: "test@test.com",
  },
  {
    id: "603d5w12",
    amount: 100,
    status: "pending",
    email: "test@123.com",
  },
  {
    id: "590x2m78",
    amount: 120,
    status: "success",
    email: "suc@suc.com",
  },
  {
    id: "231q6k01",
    amount: 200,
    status: "failed",
    email: "fail@fail.com",
  },
  // ...
]

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'status',
    id: 'Status',
  },
  {
    accessorKey: 'email',
    id: 'Email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4"/>
        </Button>
      )
    }
  },
  {
    accessorKey: 'amount',
    id: 'Amount',
    header: () => (<div className="text-right">Amount</div>),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('Amount'));
      const formatted = new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'krw',
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              ID 복사하기
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>임시</DropdownMenuItem>
            <DropdownMenuItem>버튼</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]