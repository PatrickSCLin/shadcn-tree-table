# Tree View - [Shadcn UI](https://ui.shadcn.com/)
The Tree View component allows you to navigate hierarchical lists of data with nested levels that can be expanded and collapsed.

Based on [implementation](https://github.com/shadcn-ui/ui/issues/355#issuecomment-1703767574) by [WangLarry](https://github.com/WangLarry) and [bytechase](https://github.com/bytechase).

![demo gif](./demo.gif)

### [DEMO](https://mrlightful.com/ui/tree-view)

## Features
- [x] Expand, collapse, and select items.
- [x] Custom icons per item (default, open, selected).
- [x] Default node & leaf icons per tree view.
- [x] Action buttons (e.g. a button to add a new item).
- [x] Click handlers per tree item and per the entire tree view.
- [x] Drag & drop support.
- [x] Disabled state. 

## Installation

```sh
npx shadcn add "https://mrlightful.com/registry/tree-view"
```

## Usage

### Props
#### Tree View
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

#### Tree Item
```tsx
interface TreeDataItem {
    id: string
    name: string
    icon?: any
    selectedIcon?: any
    openIcon?: any
    children?: TreeDataItem[]
    actions?: React.ReactNode
    onClick?: () => void
    draggable?: boolean
    droppable?: boolean
    disabled?: boolean
}
```

### Custom item renderer

Use the `renderItem` prop to customize how each node/leaf row is rendered while
keeping all built–in behaviors (expand/collapse, selection, drag & drop, disabled).

```tsx
import {
  TreeView,
  type TreeDataItem,
  type TreeRenderItemParams,
} from '@/components/ui/tree-view'

function renderItem({
  item,
  level,
  isLeaf,
  isSelected,
  isOpen,
  hasChildren,
}: TreeRenderItemParams) {
  return (
    <div className="flex w-full items-center gap-3 text-sm">
      {/* Example: indentation / dependency column */}
      <div className="flex items-center" style={{ paddingLeft: level * 12 }}>
        {hasChildren && (
          <span className="inline-flex h-4 w-4 items-center justify-center rounded border border-border text-[10px]">
            {isOpen ? '-' : '+'}
          </span>
        )}
      </div>

      {/* Main title column */}
      <div className="flex-1 truncate">{item.name}</div>

      {/* Extra meta columns – can use custom fields on your data */}
      <div className="w-24 text-xs text-muted-foreground text-right">
        {isLeaf ? 'Leaf' : 'Node'}
      </div>
    </div>
  )
}

<TreeView data={data} renderItem={renderItem} />
```

### Basic
```tsx
import { TreeView, TreeDataItem } from '@/components/ui/tree-view';

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
        disabled: true
      },
    ],
  },
  {
    id: '6',
    name: 'Item 2 (draggable)',
    draggable: true
  },
];

<TreeView data={data} />;
```

## Roadmap
- [ ] Add support for programmatically controlling items (https://github.com/romatallinn/shadcn-tree-view/issues/2).
- [ ] Add support for striped and non-striped variants of the tree (https://github.com/romatallinn/shadcn-tree-view/issues/3).
- [x] Add support for custom item renderers (https://github.com/romatallinn/shadcn-tree-view/issues/4).

# License
Licensed under the MIT license, see [`LICENSE`](LICENSE).