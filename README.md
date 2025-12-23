# Tree Table - [Shadcn UI](https://ui.shadcn.com/)

A powerful tree table component for Shadcn UI that combines hierarchical tree navigation with table columns, inspired by [shadcn-tree-view](https://github.com/romatallinn/shadcn-tree-view).

<table>
  <tr>
    <td width="800">
      <video src="https://github.com/user-attachments/assets/c880198d-27b6-4555-86da-94eca6211f8f"
             width="100%" controls autoplay loop muted playsinline>
      </video>
    </td>
  </tr>
</table>

## What's New & Improved

This component extends the original `shadcn-tree-view` with the following enhancements:

- **📊 Table Layout**: Display tree items in a multi-column table format with resizable columns
- **🖱️ Drag Handle Support**: Notion-style drag handles for precise row reordering
- **🎨 Notion-style Design**: Beautiful dark theme with smooth hover and selection states
- **🔧 Advanced Customization**: Full control over column rendering with `renderItem` prop
- **📐 Precise Spacing Control**: Fixed spacing calculations for perfect column alignment
- **🔀 Component Separation**: Clean separation between `TreeView` (base) and `TreeTable` (enhanced) components
- **📦 Exportable Components**: Internal components exported for maximum flexibility

## Features

- [x] Expand, collapse, and select items
- [x] Multi-column table layout with resizable columns
- [x] Drag handle support (Notion-style)
- [x] Custom item renderer with full control over column content
- [x] Drag & drop support
- [x] Disabled state
- [x] Notion-style dark theme
- [x] Precise spacing and alignment control
- [x] Custom icons per item (default, open, selected)
- [x] Default node & leaf icons per tree view
- [x] Action buttons (e.g. a button to add a new item)
- [x] Click handlers per tree item and per the entire tree view

## Installation

```sh
npx shadcn add "https://raw.githubusercontent.com/patricksclin/shadcn-tree-table/main/schema.json"
```

## Usage

### Tree Table Component

```tsx
import { TreeTable, type TreeTableItem } from '@/components/ui/tree-table'

// ... data definition ...

// Standard dragging (entire row)
<TreeTable data={data} />

// Dragging via handle only (Notion-style)
<TreeTable data={data} enableDragHandle={true} />
```

### Custom Column Rendering

The `TreeTable` component uses the `renderItem` prop to render custom table rows:

```tsx
const renderItem = ({
  item,
  level,
  isSelected,
}: TreeRenderItemParams) => {
  const extended = item as TreeTableItem
  
  return (
    <div className="grid text-sm" style={rowStyle}>
      <div className="flex items-center">
        <span>{extended.name}</span>
      </div>
      <div className="px-3">
        <span>{extended.type ?? '—'}</span>
      </div>
      {/* More columns... */}
    </div>
  )
}

<TreeTable data={data} renderItem={renderItem} />
```

### Base Tree View Component

You can also use the base `TreeView` component for simple tree navigation:

```tsx
import { TreeView, type TreeDataItem } from '@/components/ui/tree-view'

const data: TreeDataItem[] = [
  {
    id: '1',
    name: 'Item 1',
    children: [
      {
        id: '2',
        name: 'Item 1.1',
        children: [
          {
            id: '3',
            name: 'Item 1.1.1',
          },
          {
            id: '4',
            name: 'Item 1.1.2',
          },
        ],
      },
      {
        id: '5',
        name: 'Item 1.2 (disabled)',
        disabled: true,
      },
    ],
  },
  {
    id: '6',
    name: 'Item 2 (draggable)',
    draggable: true,
  },
]

<TreeView data={data} />
```

## Component Architecture

This project provides two main components:

1. **`TreeView`** (`src/tree-view.tsx`): Base tree component with expand/collapse, selection, and drag & drop
2. **`TreeTable`** (`demo/components/tree-table.tsx`): Enhanced component that adds table layout and column management

The `TreeTable` component:
- Extends `TreeView` functionality
- Uses custom `AccordionTrigger` and `TreeLeaf` components for precise spacing
- Implements column resizing and layout management
- Provides Notion-style theming

## Props

### TreeTable

```tsx
type TreeTableProps = {
  data: TreeTableItem[]
  enableDragHandle?: boolean // default: false
}
```

### TreeView

```tsx
type TreeRenderItemParams = {
  item: TreeDataItem
  level: number
  isLeaf: boolean
  isSelected: boolean
  isOpen?: boolean
  hasChildren: boolean
}

type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
  data: TreeDataItem[] | TreeDataItem
  initialSelectedItemId?: string
  onSelectChange?: (item: TreeDataItem | undefined) => void
  expandAll?: boolean
  defaultNodeIcon?: React.ComponentType<{ className?: string }>
  defaultLeafIcon?: React.ComponentType<{ className?: string }>
  onDocumentDrag?: (sourceItem: TreeDataItem, targetItem: TreeDataItem) => void
  renderItem?: (params: TreeRenderItemParams) => React.ReactNode
  enableDragHandle?: boolean
}
```

### TreeTableItem

```tsx
interface TreeTableItem extends TreeDataItem {
  children?: TreeTableItem[]
  type?: string
  owner?: string
  status?: string
  updatedAt?: string
}
```

### TreeDataItem

```tsx
interface TreeDataItem {
  id: string
  name: string
  icon?: React.ComponentType<{ className?: string }>
  selectedIcon?: React.ComponentType<{ className?: string }>
  openIcon?: React.ComponentType<{ className?: string }>
  children?: TreeDataItem[]
  actions?: React.ReactNode
  onClick?: () => void
  draggable?: boolean
  droppable?: boolean
  disabled?: boolean
  className?: string
}
```

## Development

```sh
# Install dependencies
pnpm install

# Run demo
cd demo
pnpm dev

# Create schema for tree-table
node scripts/create-schema-tree-table.js
```

## Alternatives

- [Kibo UI / Tree](https://www.kibo-ui.com/components/tree?utm_source=github&utm_medium=referral&utm_campaign=mrlightful/shadcn-tree-view)
- [ReUI / Tree](https://reui.io/docs/tree?utm_source=github&utm_medium=referral&utm_campaign=mrlightful/shadcn-tree-view)
- [Coss / Tree](https://coss.com/origin/tree?utm_source=github&utm_medium=referral&utm_campaign=mrlightful/shadcn-tree-view)
- [Tree View Table (advanced)](https://github.com/PatrickSCLin/shadcn-tree-table)

## Credits

- Inspired by [shadcn-tree-view](https://github.com/romatallinn/shadcn-tree-view) by [romatallinn](https://github.com/romatallinn)
- Based on [implementation](https://github.com/shadcn-ui/ui/issues/355#issuecomment-1703767574) by [WangLarry](https://github.com/WangLarry) and [bytechase](https://github.com/bytechase)

## License

Licensed under the MIT license, see [`LICENSE`](LICENSE).
