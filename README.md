# Tree Table - [Shadcn UI](https://ui.shadcn.com/)

A powerful tree table component for Shadcn UI that combines hierarchical tree navigation with table columns, inspired by [shadcn-tree-view](https://github.com/romatallinn/shadcn-tree-view).

![Demo](./demo.mp4)

## What's New & Improved

This component extends the original `shadcn-tree-view` with the following enhancements:

- **📊 Table Layout**: Display tree items in a multi-column table format with resizable columns
- **🎨 Notion-style Design**: Beautiful dark theme with smooth hover and selection states
- **🔧 Advanced Customization**: Full control over column rendering with `renderItem` prop
- **📐 Precise Spacing Control**: Fixed spacing calculations for perfect column alignment
- **🔀 Component Separation**: Clean separation between `TreeView` (base) and `TreeTable` (enhanced) components
- **📦 Exportable Components**: Internal components exported for maximum flexibility

## Features

- [x] Expand, collapse, and select items
- [x] Multi-column table layout with resizable columns
- [x] Custom item renderer with full control over column content
- [x] Drag & drop support
- [x] Disabled state
- [x] Notion-style dark theme
- [x] Precise spacing and alignment control

## Installation

### Option 1: Direct URL (Recommended)

```sh
npx shadcn add "https://raw.githubusercontent.com/YOUR_USERNAME/shadcn-tree-view/main/schema.json"
```

Replace `YOUR_USERNAME` with your GitHub username.

### Option 2: GitHub Raw URL

If you have a `schema.json` file in your repository root:

```sh
npx shadcn add "https://raw.githubusercontent.com/YOUR_USERNAME/shadcn-tree-view/main/schema.json"
```

### Option 3: Local Development

For local development, you can copy the component directly:

```sh
# Copy tree-view component
cp src/tree-view.tsx your-project/components/ui/tree-view.tsx

# Copy tree-table component  
cp demo/components/tree-table.tsx your-project/components/ui/tree-table.tsx
```

## Usage

### Tree Table Component

```tsx
import { TreeTable, type TreeTableItem } from '@/components/ui/tree-table'

const data: TreeTableItem[] = [
  {
    id: '1',
    name: 'Task 1',
    type: 'Folder',
    owner: 'Alice',
    status: 'Active',
    updatedAt: '2024-11-01',
    children: [
      {
        id: '2',
        name: 'Task 1.1',
        type: 'Document',
        owner: 'Bob',
        status: 'In progress',
        updatedAt: '2024-11-03',
      },
    ],
  },
]

<TreeTable data={data} />
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
      },
    ],
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
  defaultNodeIcon?: any
  defaultLeafIcon?: any
  onDocumentDrag?: (sourceItem: TreeDataItem, targetItem: TreeDataItem) => void
  renderItem?: (params: TreeRenderItemParams) => React.ReactNode
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

## Setting Up Shadcn Registry

To make `npx shadcn add tree-table` work, you need to:

1. **Create a schema.json file** in your repository root (see `scripts/create-schema-tree-table.js`)

2. **Host the schema.json file** publicly accessible via URL:
   - GitHub: Use raw.githubusercontent.com URL
   - Your own server: Host the JSON file
   - CDN: Upload to a CDN service

3. **Update shadcn.json** in your project (if using custom registry):

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

4. **Use the component**:

```sh
npx shadcn add "https://raw.githubusercontent.com/YOUR_USERNAME/shadcn-tree-view/main/schema.json"
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

## Credits

- Inspired by [shadcn-tree-view](https://github.com/romatallinn/shadcn-tree-view) by [romatallinn](https://github.com/romatallinn)
- Based on [implementation](https://github.com/shadcn-ui/ui/issues/355#issuecomment-1703767574) by [WangLarry](https://github.com/WangLarry) and [bytechase](https://github.com/bytechase)

## License

Licensed under the MIT license, see [`LICENSE`](LICENSE).
