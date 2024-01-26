import { faker } from "@faker-js/faker";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { z } from "zod";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { RxCrossCircled, RxQuestionMarkCircled, RxStopwatch } from "react-icons/rx";
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, CheckCircleIcon, CircleIcon } from "lucide-react";
import TasksHeader from "./TasksHeader";

/* 스키마 */
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(['Backlog', 'Todo', 'InProgress', 'Done', 'Canceled']),
  priority: z.enum(['Low', 'Medium', 'High']),
  label: z.enum(['Documentation', 'Bug', 'Feature'])
})

export type Task = z.infer<typeof taskSchema>;

/* 컬럼 */
const helper = createColumnHelper<Task>();

// 헬퍼를 이용하려면 타입을 미리 정해두지 말라고..?
export const columns = [ // : ColumnDef<Task>[]
  helper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Select All"
        // className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        // className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  helper.accessor('id', {
    header: () => (
      <div>Id</div>
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
  }),
  helper.accessor('title', {
    header: ({ column }) => <TasksHeader column={column} title="Title"/>,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          {row.original.label && <Badge variant="outline">
            {(row.original.label).toUpperCase()}
          </Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('title')}
          </span>
        </div>
      )
    }
  }),
  helper.accessor('status', {
    header: ({ column }) => <TasksHeader column={column} title="Status"/>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    sortingFn: (a, b) => {
      const status: {
        [key: string]: number,
      } = {
        Canceled: 1,
        Done: 2,
        Backlog: 3,
        InProgress: 4,
        Todo: 5,
      }

      const A = a.getValue('status') as string;
      const B = b.getValue('status') as string;
      return status[A] > status[B] ? 1 : status[A] < status[B] ? -1 : 0;
    }
  }),
  helper.accessor('priority', {
    header: ({ column }) => <TasksHeader column={column} title="Priority"/>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    sortingFn: (a, b) => {
      const priority: {
        [key: string]: number,
      } = {
        Low: 1,
        Medium: 2,
        High: 3,
      }

      const A = a.getValue('priority') as string;
      const B = b.getValue('priority') as string;
      return priority[A] > priority[B] ? 1 : priority[A] < priority[B] ? -1 : 0;
    },
  }),
]

/* 데이터 */
export const newTask = (count = 1): Task[] => {
  const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        id: faker.string.nanoid(10),
        title: faker.lorem.sentence({ min: 5, max: 8 }),
        status: faker.helpers.shuffle<Task['status']>(['Backlog', 'Todo', 'InProgress', 'Done', 'Canceled'])[0],
        priority: faker.helpers.shuffle<Task['priority']>(['Low', 'Medium', 'High'])[0],
        label: faker.helpers.shuffle<Task['label']>(['Documentation', 'Bug', 'Feature'])[0],
      })
    }

  return data;
}

/* 상수 */
export const statuses = [
  {
    value: 'Backlog',
    label: "Backlog",
    icon: RxQuestionMarkCircled,
  },
  {
    value: 'Todo',
    label: "Todo",
    icon: CircleIcon,
  },
  {
    value: 'InProgress',
    label: "In Progress",
    icon: RxStopwatch,
  },
  {
    value: 'Done',
    label: "Done",
    icon: CheckCircleIcon,
  },
  {
    value: 'Canceled',
    label: "Canceled",
    icon: RxCrossCircled,
  },
]

export const priorities = [
  {
    value: 'Low',
    label: 'Low',
    icon: ArrowDownIcon,
  },
  {
    value: 'Medium',
    label: 'Medium',
    icon: ArrowRightIcon,
  },
  {
    value: 'High',
    label: 'High',
    icon: ArrowUpIcon,
  },
]