'use client'

import { TreeTable, type TreeTableItem } from '@/components/ui/tree-table'

const data: TreeTableItem[] = [
  {
    id: '1',
    name: 'Item 1',
    droppable: true,
    type: 'Folder',
    owner: 'Alice',
    status: 'Active',
    updatedAt: '2024-11-01',
    children: [
      {
        id: '2',
        name: 'Item 1.1',
        droppable: true,
        type: 'Document',
        owner: 'Bob',
        status: 'In progress',
        updatedAt: '2024-11-03',
        children: [
          {
            id: '3',
            name: 'Item 1.1.1',
            type: 'Task',
            owner: 'Carol',
            status: 'Done',
            updatedAt: '2024-10-28',
          },
          {
            id: '4',
            name: 'Item 1.1.2',
            type: 'Task',
            owner: 'Dave',
            status: 'Todo',
            updatedAt: '2024-11-05',
          },
        ],
      },
      {
        id: '5',
        name: 'Item 1.2 (disabled)',
        disabled: true,
        type: 'Document',
        owner: 'Eve',
        status: 'Archived',
        updatedAt: '2024-09-12',
      },
    ],
  },
  {
    id: '6',
    name: 'Item 2',
    draggable: true,
    type: 'Document',
    owner: 'Frank',
    status: 'Active',
    updatedAt: '2024-11-10',
  },
]

export default function Demo() {
  return <TreeTable data={data} />
}
