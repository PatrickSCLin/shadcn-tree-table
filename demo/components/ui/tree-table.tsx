'use client'

import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronRight, GripVertical } from 'lucide-react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { 
    TreeView as BaseTreeView,
    TreeItem as BaseTreeItem,
    type TreeDataItem,
    type TreeRenderItemParams
} from './tree-view'

// Tree-table specific styling variants
const treeVariants = cva(
    'group hover:before:opacity-100 before:absolute before:rounded-lg before:left-0 before:w-full before:opacity-0 before:h-[2rem] before:-z-10'
    // Notion 風格：hover 時使用淺灰色背景
    // 移除 px-2 以避免影響欄位對齊
)

const selectedTreeVariants = cva(
    'before:opacity-100 text-white'
    // Notion 風格：選中時使用藍色背景
)

const dragOverVariants = cva(
    'before:opacity-100 text-white'
    // Notion 風格：拖放時使用藍色背景
)

const rowSurfaceClasses =
    'relative cursor-pointer transition-colors hover:bg-white/5 data-[selected=true]:bg-[rgba(46,170,220,0.3)] data-[drag-over=true]:bg-[rgba(46,170,220,0.2)]'

// Tree-table specific AccordionTrigger with level-based positioning
type AccordionTriggerProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    level?: number
    isSelected?: boolean
    isDragOver?: boolean
    isOpen?: boolean
    enableDragHandle?: boolean
    setIsHoveringHandle?: (hovering: boolean) => void
}

const AccordionTrigger = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Trigger>,
    AccordionTriggerProps
>(({ className, children, level = 0, isSelected, isDragOver, isOpen, enableDragHandle = false, setIsHoveringHandle, ...props }: AccordionTriggerProps, ref: React.Ref<React.ElementRef<typeof AccordionPrimitive.Trigger>>) => {
    // ChevronRight 使用 absolute positioning，位置根據 level 動態調整
    // 基礎位置：10px（左側間距）+ level * 20px（縮排，每層增加 20px）
    // 如果有 drag handle，需要額外增加 16px（drag handle 寬度 + 4px margin）
    const dragHandleWidth = enableDragHandle ? 20 : 0 
    const chevronLeft = (enableDragHandle ? 30 : 10) + level * 20
    
    const selectedAttr = isSelected ? 'true' : 'false'
    const dragAttr = isDragOver ? 'true' : 'false'
    const chevronAttr = isOpen ? 'true' : 'false'
    const chevronTransform = isOpen
        ? 'translateY(-50%) rotate(90deg)'
        : 'translateY(-50%)'

    return (
        <AccordionPrimitive.Header style={{ width: '100%', position: 'relative' }}>
            <AccordionPrimitive.Trigger
                ref={ref}
                className={cn(
                    `group flex items-center py-2 transition-all ${rowSurfaceClasses}`,
                    className
                )}
                style={{ color: 'rgb(232, 232, 231)', width: '100%', minWidth: 0, overflow: 'hidden', paddingLeft: 0, paddingRight: 0, position: 'relative' }}
                data-selected={selectedAttr}
                data-drag-over={dragAttr}
                {...props}
            >
                {/* 左側間距 */}
                <div style={{ width: '10px', flexShrink: 0 }} />
                {/* Drag Handle - 當 enableDragHandle 為 true 時顯示，固定在最左側 */}
                {enableDragHandle && (
                    <GripVertical
                        className="h-4 w-4 shrink-0 cursor-grab active:cursor-grabbing"
                        style={{
                            color: 'rgb(156, 156, 155)',
                            position: 'absolute',
                            left: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            flexShrink: 0,
                            marginRight: '4px',
                            pointerEvents: 'auto'
                        }}
                        onMouseEnter={() => setIsHoveringHandle?.(true)}
                        onMouseLeave={() => setIsHoveringHandle?.(false)}
                    />
                )}
                {/* ChevronRight 使用 absolute positioning，根據 level 動態調整位置 */}
                <ChevronRight 
                    className="h-4 w-4 shrink-0 transition-transform duration-200 chevron-icon" 
                    data-open={chevronAttr}
                    style={{ 
                        color: 'rgb(156, 156, 155)', 
                        position: 'absolute',
                        left: `${chevronLeft}px`,
                        top: '50%',
                        transform: chevronTransform,
                        flexShrink: 0 
                    }} 
                />
                {/* renderItem 內容從固定位置開始，確保所有層級寬度一致 */}
                <div style={{ marginLeft: enableDragHandle ? '60px' : '20px', flex: 1, minWidth: 0, overflow: 'hidden' }}>
                    {children}
                </div>
            </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
    )
})
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>, ref: React.Ref<React.ElementRef<typeof AccordionPrimitive.Content>>) => (
    <AccordionPrimitive.Content
        ref={ref}
        className={cn(
            'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
            className
        )}
        {...props}
    >
        <div className="pb-1 pt-0">{children}</div>
    </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

const TreeIcon = ({
    item,
    isOpen,
    isSelected,
    default: defaultIcon
}: {
    item: TreeDataItem
    isOpen?: boolean
    isSelected?: boolean
    default?: any
}) => {
    let Icon = defaultIcon
    if (isSelected && item.selectedIcon) {
        Icon = item.selectedIcon
    } else if (isOpen && item.openIcon) {
        Icon = item.openIcon
    } else if (item.icon) {
        Icon = item.icon
    }
    return Icon ? (
        <Icon className="h-4 w-4 shrink-0 mr-2" />
    ) : (
        <></>
    )
}

const TreeActions = ({
    children,
    isSelected
}: {
    children: React.ReactNode
    isSelected: boolean
}) => {
    return (
        <div
            className={cn(
                isSelected ? 'block' : 'hidden',
                'absolute right-3 group-hover:block'
            )}
        >
            {children}
        </div>
    )
}

// Tree-table specific TreeNode
const TreeNode = ({
    item,
    handleSelectChange,
    expandedItemIds,
    selectedItemId,
    defaultNodeIcon,
    defaultLeafIcon,
    handleDragStart,
    handleDrop,
    draggedItem,
    renderItem,
    level = 0,
    enableDragHandle = false,
}: {
    item: TreeDataItem
    handleSelectChange: (item: TreeDataItem | undefined) => void
    expandedItemIds: string[]
    selectedItemId?: string
    defaultNodeIcon?: any
    defaultLeafIcon?: any
    handleDragStart?: (item: TreeDataItem) => void
    handleDrop?: (item: TreeDataItem) => void
    draggedItem: TreeDataItem | null
    renderItem?: (params: TreeRenderItemParams) => React.ReactNode
    level?: number
    enableDragHandle?: boolean
}) => {
    const [value, setValue] = React.useState(
        expandedItemIds.includes(item.id) ? [item.id] : []
    )
    const [isDragOver, setIsDragOver] = React.useState(false)
    const [isHoveringHandle, setIsHoveringHandle] = React.useState(false)
    const hasChildren = !!item.children?.length
    const isSelected = selectedItemId === item.id
    const isOpen = value.includes(item.id)

    const onDragStart = (e: React.DragEvent) => {
        // 如果啟用了 drag handle 且滑鼠不在 handle 上，則不允許拖動
        if (enableDragHandle && !isHoveringHandle) {
            e.preventDefault()
            return
        }
        // 默認所有項目都可以拖動，除非明確設置 draggable: false
        if (item.draggable === false) {
            e.preventDefault()
            return
        }
        e.dataTransfer.setData('text/plain', item.id)
        handleDragStart?.(item)
    }

    const onDragOver = (e: React.DragEvent) => {
        if (item.droppable !== false && draggedItem && draggedItem.id !== item.id) {
            e.preventDefault()
            setIsDragOver(true)
        }
    }

    const onDragLeave = () => {
        setIsDragOver(false)
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        handleDrop?.(item)
    }

    return (
        <AccordionPrimitive.Root
            type="multiple"
            value={value}
            onValueChange={(s: string[]) => setValue(s)}
        >
            <AccordionPrimitive.Item value={item.id}>
                <AccordionTrigger
                    level={level}
                    isSelected={isSelected}
                    isDragOver={isDragOver}
                    isOpen={isOpen}
                    enableDragHandle={enableDragHandle}
                    setIsHoveringHandle={setIsHoveringHandle}
                    className={cn(
                        treeVariants(),
                        isSelected && selectedTreeVariants(),
                        isDragOver && dragOverVariants()
                    )}
                    onClick={() => {
                        handleSelectChange(item)
                        item.onClick?.()
                    }}
                    draggable={enableDragHandle ? isHoveringHandle : (item.draggable !== false)}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                >
                    {renderItem ? (
                        renderItem({
                            item,
                            level,
                            isLeaf: false,
                            isSelected,
                            isOpen,
                            hasChildren,
                        })
                    ) : (
                        <>
                            <TreeIcon
                                item={item}
                                isSelected={isSelected}
                                isOpen={isOpen}
                                default={defaultNodeIcon}
                            />
                            <span
                                className="text-sm truncate"
                                style={{ color: 'rgb(232, 232, 231)' }}
                            >
                                {item.name}
                            </span>
                            <TreeActions isSelected={isSelected}>
                                {item.actions}
                            </TreeActions>
                        </>
                    )}
                </AccordionTrigger>
                <AccordionContent style={{ borderLeft: '1px solid rgb(47, 47, 47)' }}>
                    <TreeItem
                        data={item.children ? item.children : item}
                        selectedItemId={selectedItemId}
                        handleSelectChange={handleSelectChange}
                        expandedItemIds={expandedItemIds}
                        defaultLeafIcon={defaultLeafIcon}
                        defaultNodeIcon={defaultNodeIcon}
                        handleDragStart={handleDragStart}
                        handleDrop={handleDrop}
                        draggedItem={draggedItem}
                        renderItem={renderItem}
                        level={level + 1}
                        enableDragHandle={enableDragHandle}
                    />
                </AccordionContent>
            </AccordionPrimitive.Item>
        </AccordionPrimitive.Root>
    )
}

// Tree-table specific TreeLeaf with spacing divs
type TreeLeafProps = React.HTMLAttributes<HTMLDivElement> & {
    item: TreeDataItem
    level: number
    selectedItemId?: string
    handleSelectChange: (item: TreeDataItem | undefined) => void
    defaultLeafIcon?: any
    handleDragStart?: (item: TreeDataItem) => void
    handleDrop?: (item: TreeDataItem) => void
    draggedItem: TreeDataItem | null
    renderItem?: (params: TreeRenderItemParams) => React.ReactNode
    enableDragHandle?: boolean
}

const TreeLeaf = React.forwardRef<
    HTMLDivElement,
    TreeLeafProps
>(
    (
        {
            className,
            item,
            level,
            selectedItemId,
            handleSelectChange,
            defaultLeafIcon,
            handleDragStart,
            handleDrop,
            draggedItem,
            renderItem,
            enableDragHandle = false,
            ...props
        }: TreeLeafProps,
        ref: React.Ref<HTMLDivElement>
    ) => {
        const [isDragOver, setIsDragOver] = React.useState(false)
        const [isHoveringHandle, setIsHoveringHandle] = React.useState(false)
        const isSelected = selectedItemId === item.id
        const dataSelected = isSelected ? 'true' : 'false'
        const dataDragOver = isDragOver ? 'true' : 'false'

        const onDragStart = (e: React.DragEvent) => {
            // 如果啟用了 drag handle 且滑鼠不在 handle 上，則不允許拖動
            if (enableDragHandle && !isHoveringHandle) {
                e.preventDefault()
                return
            }
            // 默認所有項目都可以拖動，除非明確設置 draggable: false 或 disabled: true
            if (item.draggable === false || item.disabled) {
                e.preventDefault()
                return
            }
            e.dataTransfer.setData('text/plain', item.id)
            handleDragStart?.(item)
        }

        const onDragOver = (e: React.DragEvent) => {
            if (item.droppable !== false && !item.disabled && draggedItem && draggedItem.id !== item.id) {
                e.preventDefault()
                setIsDragOver(true)
            }
        }

        const onDragLeave = () => {
            setIsDragOver(false)
        }

        const onDrop = (e: React.DragEvent) => {
            if (item.disabled) return
            e.preventDefault()
            setIsDragOver(false)
            handleDrop?.(item)
        }

        return (
            <div
                ref={ref}
                className={cn(
                    `flex text-left items-center py-2 before:right-1 ${rowSurfaceClasses}`,
                    treeVariants(),
                    className,
                    isSelected && selectedTreeVariants(),
                    isDragOver && dragOverVariants(),
                    item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
                )}
                style={{
                    color: 'rgb(232, 232, 231)',
                    width: '100%',
                    minWidth: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                    position: 'relative',
                }}
                data-selected={dataSelected}
                data-drag-over={dataDragOver}
                onClick={() => {
                    if (item.disabled) return
                    handleSelectChange(item)
                    item.onClick?.()
                }}
                draggable={enableDragHandle ? isHoveringHandle : (item.draggable !== false && !item.disabled)}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                {...props}
            >
                {/* 左側間距 */}
                <div style={{ width: '10px', flexShrink: 0 }} />
                {/* Drag Handle - 當 enableDragHandle 為 true 時顯示，固定在最左側 */}
                {enableDragHandle && (
                    <GripVertical
                        className="h-4 w-4 shrink-0 cursor-grab active:cursor-grabbing"
                        style={{
                            color: 'rgb(156, 156, 155)',
                            position: 'absolute',
                            left: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            flexShrink: 0,
                            marginRight: '4px',
                            pointerEvents: 'auto'
                        }}
                        onMouseEnter={() => setIsHoveringHandle(true)}
                        onMouseLeave={() => setIsHoveringHandle(false)}
                    />
                )}
                {renderItem ? (
                    <>
                        {/* 占位元素，代替 ChevronRight，保持對齊 */}
                        <div style={{ width: enableDragHandle ? '60px' : '20px', flexShrink: 0 }} />
                        {/* renderItem 內容從固定位置開始，確保所有層級寬度一致 */}
                        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                            {renderItem({
                                item,
                                level,
                                isLeaf: true,
                                isSelected,
                                hasChildren: false,
                            })}
                        </div>
                    </>
                ) : (
                    <>
                        <TreeIcon
                            item={item}
                            isSelected={isSelected}
                            default={defaultLeafIcon}
                        />
                        <span
                            className="flex-grow text-sm truncate"
                            style={{ color: 'rgb(232, 232, 231)' }}
                        >
                            {item.name}
                        </span>
                        <TreeActions isSelected={isSelected && !item.disabled}>
                            {item.actions}
                        </TreeActions>
                    </>
                )}
            </div>
        )
    }
)
TreeLeaf.displayName = 'TreeLeaf'

// Tree-table specific TreeItem that uses custom TreeNode and TreeLeaf
type TreeItemProps = {
    data: TreeDataItem[] | TreeDataItem
    selectedItemId?: string
    handleSelectChange: (item: TreeDataItem | undefined) => void
    expandedItemIds: string[]
    defaultNodeIcon?: any
    defaultLeafIcon?: any
    handleDragStart?: (item: TreeDataItem) => void
    handleDrop?: (item: TreeDataItem) => void
    draggedItem: TreeDataItem | null
    renderItem?: (params: TreeRenderItemParams) => React.ReactNode
    level?: number
    className?: string
    enableDragHandle?: boolean
}

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
    (
        {
            className,
            data,
            selectedItemId,
            handleSelectChange,
            expandedItemIds,
            defaultNodeIcon,
            defaultLeafIcon,
            handleDragStart,
            handleDrop,
            draggedItem,
            renderItem,
            level,
            enableDragHandle,
            ...props
        }: TreeItemProps,
        ref: React.Ref<HTMLDivElement>
    ) => {
        if (!(data instanceof Array)) {
            data = [data]
        }
        return (
            <div ref={ref} role="tree" className={className} {...props}>
                <ul>
                    {data.map((item: TreeDataItem) => (
                        <li key={item.id}>
                            {item.children ? (
                                <TreeNode
                                    item={item}
                                    level={level ?? 0}
                                    selectedItemId={selectedItemId}
                                    expandedItemIds={expandedItemIds}
                                    handleSelectChange={handleSelectChange}
                                    defaultNodeIcon={defaultNodeIcon}
                                    defaultLeafIcon={defaultLeafIcon}
                                    handleDragStart={handleDragStart}
                                    handleDrop={handleDrop}
                                    draggedItem={draggedItem}
                                    renderItem={renderItem}
                                    enableDragHandle={enableDragHandle}
                                />
                            ) : (
                                <TreeLeaf
                                    item={item}
                                    level={level ?? 0}
                                    selectedItemId={selectedItemId}
                                    handleSelectChange={handleSelectChange}
                                    defaultLeafIcon={defaultLeafIcon}
                                    handleDragStart={handleDragStart}
                                    handleDrop={handleDrop}
                                    draggedItem={draggedItem}
                                    renderItem={renderItem}
                                    enableDragHandle={enableDragHandle}
                                />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
)
TreeItem.displayName = 'TreeItem'

// Tree-table specific TreeView that uses custom TreeItem
type TreeViewProps = React.HTMLAttributes<HTMLDivElement> & {
    data: TreeDataItem[] | TreeDataItem
    initialSelectedItemId?: string
    onSelectChange?: (item: TreeDataItem | undefined) => void
    expandAll?: boolean
    defaultNodeIcon?: any
    defaultLeafIcon?: any
    onDocumentDrag?: (sourceItem: TreeDataItem, targetItem: TreeDataItem) => void
    renderItem?: (params: TreeRenderItemParams) => React.ReactNode
    enableDragHandle?: boolean
}

const TreeView = React.forwardRef<HTMLDivElement, TreeViewProps>(
    (
        {
            data,
            initialSelectedItemId,
            onSelectChange,
            expandAll,
            defaultLeafIcon,
            defaultNodeIcon,
            className,
            onDocumentDrag,
            renderItem,
            enableDragHandle = false,
            ...props
        }: TreeViewProps,
        ref: React.Ref<HTMLDivElement>
    ) => {
        const [selectedItemId, setSelectedItemId] = React.useState<
            string | undefined
        >(initialSelectedItemId)
        
        const [draggedItem, setDraggedItem] = React.useState<TreeDataItem | null>(null)

        const handleSelectChange = React.useCallback(
            (item: TreeDataItem | undefined) => {
                setSelectedItemId(item?.id)
                if (onSelectChange) {
                    onSelectChange(item)
                }
            },
            [onSelectChange]
        )

        const handleDragStart = React.useCallback((item: TreeDataItem) => {
            setDraggedItem(item)
        }, [])

        const handleDrop = React.useCallback((targetItem: TreeDataItem) => {
            if (draggedItem && onDocumentDrag && draggedItem.id !== targetItem.id) {
                onDocumentDrag(draggedItem, targetItem)
            }
            setDraggedItem(null)
        }, [draggedItem, onDocumentDrag])

        const expandedItemIds = React.useMemo(() => {
            if (!initialSelectedItemId) {
                return [] as string[]
            }

            const ids: string[] = []

            function walkTreeItems(
                items: TreeDataItem[] | TreeDataItem,
                targetId: string
            ) {
                if (items instanceof Array) {
                    for (let i = 0; i < items.length; i++) {
                        ids.push(items[i]!.id)
                        if (walkTreeItems(items[i]!, targetId) && !expandAll) {
                            return true
                        }
                        if (!expandAll) ids.pop()
                    }
                } else if (!expandAll && items.id === targetId) {
                    return true
                } else if (items.children) {
                    return walkTreeItems(items.children, targetId)
                }
            }

            walkTreeItems(data, initialSelectedItemId)
            return ids
        }, [data, expandAll, initialSelectedItemId])

        return (
            <div className={cn('overflow-hidden relative', className)} style={{ backgroundColor: 'transparent', width: '100%', minWidth: 0 }}>
                <TreeItem
                    data={data}
                    ref={ref}
                    selectedItemId={selectedItemId}
                    handleSelectChange={handleSelectChange}
                    expandedItemIds={expandedItemIds}
                    defaultLeafIcon={defaultLeafIcon}
                    defaultNodeIcon={defaultNodeIcon}
                    handleDragStart={handleDragStart}
                    handleDrop={handleDrop}
                    draggedItem={draggedItem}
                    renderItem={renderItem}
                    level={0}
                    enableDragHandle={enableDragHandle}
                    {...props}
                />
                <div
                    className='w-full h-[48px]'
                    onDragOver={(e) => {
                        if (draggedItem) {
                            e.preventDefault()
                        }
                    }}
                    onDrop={(e) => {
                        e.preventDefault()
                        handleDrop({id: '', name: 'parent_div'})
                    }}
                >
                </div>
            </div>
        )
    }
)
TreeView.displayName = 'TreeView'

export interface TreeTableItem extends TreeDataItem {
    children?: TreeTableItem[]
    type?: string
    owner?: string
    status?: string
    updatedAt?: string
}

type TreeTableProps = {
    data: TreeTableItem[]
    enableDragHandle?: boolean
}

const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect

const cloneTreeItem = (item: TreeTableItem): TreeTableItem => ({
    ...item,
    children: item.children ? item.children.map(cloneTreeItem) : undefined,
})

const removeTreeItem = (
    items: TreeTableItem[],
    id: string
): { updated: TreeTableItem[]; removed?: TreeTableItem } => {
    let removedItem: TreeTableItem | undefined

    const updatedItems: TreeTableItem[] = []

    for (const item of items) {
        if (item.id === id) {
            removedItem = item
            continue
        }

        let nextChildren = item.children
        if (item.children) {
            const childResult = removeTreeItem(item.children, id)
            if (childResult.removed) {
                removedItem = childResult.removed
                nextChildren = childResult.updated.length ? childResult.updated : undefined
            }
        }

        updatedItems.push(
            nextChildren !== item.children ? { ...item, children: nextChildren } : item
        )
    }

    return { updated: updatedItems, removed: removedItem }
}

const insertTreeItem = (
    items: TreeTableItem[],
    targetId: string,
    newItem: TreeTableItem
): TreeTableItem[] => {
    if (targetId === '') {
        return [...items, newItem]
    }

    let inserted = false

    const updated = items.map((item) => {
        if (item.id === targetId) {
            inserted = true
            const children = item.children ? [...item.children, newItem] : [newItem]
            return { ...item, children }
        }

        if (item.children) {
            const updatedChildren = insertTreeItem(item.children, targetId, newItem)
            if (updatedChildren !== item.children) {
                inserted = true
                return { ...item, children: updatedChildren }
            }
        }

        return item
    })

    return inserted ? updated : items
}

export function TreeTable({ data, enableDragHandle = false }: TreeTableProps) {
    const [selectedItem, setSelectedItem] = useState<TreeTableItem | undefined>(undefined)
    const [treeData, setTreeData] = useState<TreeTableItem[]>(data)
    const [columnWidths, setColumnWidths] = useState<number[]>([
        280,
        140,
        140,
        140,
        160,
    ])
    const [hasUserResized, setHasUserResized] = useState(false)

    useEffect(() => {
        setTreeData(data)
    }, [data])

    const containerRef = useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = useState(0)
    const [isLayoutReady, setIsLayoutReady] = useState(false)

    const totalWidth = columnWidths.reduce((sum: number, w: number) => sum + w, 0)

    useIsomorphicLayoutEffect(() => {
        const node = containerRef.current
        if (!node) {
            return
        }

        const updateWidth = () => {
            const next = node.getBoundingClientRect().width
            setContainerWidth(next)
            if (!isLayoutReady) {
                setIsLayoutReady(true)
            }
        }

        updateWidth()

        if (typeof ResizeObserver === 'undefined') {
            window.addEventListener('resize', updateWidth)
            return () => window.removeEventListener('resize', updateWidth)
        }

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0]
            if (entry) {
                setContainerWidth(entry.contentRect.width)
                if (!isLayoutReady) {
                    setIsLayoutReady(true)
                }
            }
        })

        observer.observe(node)
        return () => observer.disconnect()
    }, [isLayoutReady])

    const columns = [
        {
            key: 'name',
            label: 'Task name',
            widthIndex: 0,
            isFirst: true,
            render: (item: TreeTableItem, level: number, isSelected: boolean) => (
                <span className={isSelected ? 'font-semibold text-neutral-50' : 'text-neutral-200'}>
                    {item.name}
                </span>
            ),
        },
        {
            key: 'type',
            label: 'Type',
            widthIndex: 1,
            render: (item: TreeTableItem) => (
                <span className="text-neutral-400">{item.type ?? '—'}</span>
            ),
        },
        {
            key: 'owner',
            label: 'Assigned to',
            widthIndex: 2,
            render: (item: TreeTableItem) => (
                <span className="text-neutral-400">{item.owner ?? '—'}</span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            widthIndex: 3,
            render: (item: TreeTableItem) => {
                const statusClass =
                    item.status === 'Done'
                        ? 'text-emerald-400'
                        : item.status === 'In progress'
                            ? 'text-sky-400'
                            : item.status === 'Archived'
                                ? 'text-neutral-500'
                                : 'text-neutral-400'
                return <span className={statusClass}>{item.status ?? '—'}</span>
            },
        },
        {
            key: 'updatedAt',
            label: 'Last edited time',
            widthIndex: 4,
            render: (item: TreeTableItem) => (
                <span className="text-neutral-500">{item.updatedAt ?? '—'}</span>
            ),
        },
    ]

    const fillColumnIndex = columns.length - 1
    const baseContainerWidth = containerWidth || 0
    const effectiveWidth = useMemo(() => {
        if (!hasUserResized) {
            return Math.max(totalWidth, baseContainerWidth)
        }
        return totalWidth
    }, [baseContainerWidth, totalWidth, hasUserResized])

    const displayColumnWidths = useMemo(() => {
        if (hasUserResized) {
            return columnWidths
        }

        const extraWidth = Math.max(baseContainerWidth - totalWidth, 0)
        if (extraWidth <= 0) {
            return columnWidths
        }

        const next = [...columnWidths]
        const fillIndex = next.length - 1
        if (fillIndex >= 0) {
            next[fillIndex] = next[fillIndex]! + extraWidth
        }
        return next
    }, [columnWidths, baseContainerWidth, totalWidth, hasUserResized])

    const leftSpacing = 10
    const chevronSpace = enableDragHandle ? 60 : 20
    const totalLeftSpacing = leftSpacing + chevronSpace
    const indentPerLevel = 20
    const finalDividerInset = 8

    const firstColumnBodyWidth = Math.max(
        (displayColumnWidths[0] ?? 0) - totalLeftSpacing,
        0
    )
    const renderItemTotalWidth = Math.max(effectiveWidth - totalLeftSpacing, 0)

    const columnLayoutWidths = useMemo(
        () =>
            displayColumnWidths.map((width: number, index: number) =>
                index === 0 ? Math.max(width - totalLeftSpacing, 0) : width
            ),
        [displayColumnWidths, totalLeftSpacing]
    )

    const gridTemplateColumns = useMemo(
        () => columnLayoutWidths.map((width: number) => `${width}px`).join(' '),
        [columnLayoutWidths]
    )

    const rowStyle = useMemo(
        () =>
            ({
                width: `${renderItemTotalWidth}px`,
                minWidth: `${renderItemTotalWidth}px`,
                gridTemplateColumns,
            }) satisfies React.CSSProperties,
        [renderItemTotalWidth, gridTemplateColumns]
    )

    const handleColumnResizeStart = (
        index: number,
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        e.preventDefault()
        e.stopPropagation()

        const startX = e.clientX
        const initialWidths = hasUserResized ? columnWidths : displayColumnWidths
        const startWidths = [...initialWidths]
        const minWidth = 80

        const onMouseMove = (moveEvent: MouseEvent) => {
            const delta = moveEvent.clientX - startX
            const next = [...startWidths]
            const leftIndex = index

            let newLeft = startWidths[leftIndex]! + delta
            if (newLeft < minWidth) {
                newLeft = minWidth
            }

            next[leftIndex] = newLeft
            setColumnWidths(next)
            if (index !== columns.length - 1) {
                setHasUserResized(true)
            }
        }

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onMouseUp)
        }

        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)
    }

    const handleDrag = (sourceItem: TreeDataItem, targetItem: TreeDataItem) => {
        if (sourceItem.id === targetItem.id) {
            return
        }

        const { updated, removed } = removeTreeItem(treeData, sourceItem.id)
        if (!removed) {
            return
        }

        const itemToInsert = cloneTreeItem(removed)
        const nextTree = insertTreeItem(updated, targetItem.id, itemToInsert)
        if (nextTree === updated && targetItem.id !== '') {
            setTreeData(insertTreeItem(updated, '', itemToInsert))
        } else {
            setTreeData(nextTree)
        }
    }

    const renderItem = ({
        item,
        level,
        isSelected,
    }: TreeRenderItemParams) => {
        const extended = item as TreeTableItem
        const indentWidth = Math.max(
            Math.min(level * indentPerLevel, Math.max(firstColumnBodyWidth - 12, 0)),
            0
        )
        // 基礎 padding 為 12px (等同於 px-3)，再加上縮排
        const firstCellPaddingLeft = 12 + indentWidth

        return (
            <div className="grid text-sm text-neutral-200" style={rowStyle}>
                {columns.map((column) => {
                    if (column.isFirst) {
                        return (
                            <div
                                key={column.key}
                                className="flex items-center"
                                style={{
                                    paddingLeft: `${firstCellPaddingLeft}px`,
                                    paddingRight: '12px',
                                }}
                            >
                                <span className="flex-1 truncate text-left text-sm text-neutral-100">
                                    {column.render(extended, level, isSelected)}
                                </span>
                            </div>
                        )
                    }

                    return (
                        <div
                            key={column.key}
                            className="px-3 py-2 text-left text-xs text-neutral-300 overflow-hidden text-ellipsis whitespace-nowrap"
                        >
                            {column.render(extended, level, isSelected)}
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="p-8 min-h-screen" style={{ backgroundColor: 'rgb(25, 25, 25)' }}>
            <div
                ref={containerRef}
                className="rounded-lg p-6"
                style={{
                    backgroundColor: 'rgb(37, 37, 37)',
                    border: '1px solid rgb(47, 47, 47)',
                    opacity: isLayoutReady ? 1 : 0,
                    transition: 'opacity 120ms ease',
                }}
            >
                <div style={{ width: '100%', overflowX: isLayoutReady ? 'auto' : 'hidden' }}>
                    <div style={{ minWidth: `${effectiveWidth}px` }}>
                        <div
                            className="mb-1 rounded-md border border-neutral-800/60 bg-neutral-900/40 text-xs text-neutral-400"
                            style={{
                                width: `${effectiveWidth}px`,
                                minWidth: `${effectiveWidth}px`,
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                            } as React.CSSProperties}
                        >
                            <div className="shrink-0" style={{ width: `${leftSpacing}px` }} />
                            <div className="shrink-0" style={{ width: `${chevronSpace}px` }} />
                            {columns.map((column, index) => {
                                const columnWidth = columnLayoutWidths[column.widthIndex] ?? 0

                                return (
                                    <div
                                        key={column.key}
                                        className="relative flex items-center px-3 py-3 text-xs font-semibold text-neutral-400"
                                        style={{ width: columnWidth }}
                                    >
                                        <span className="font-semibold">{column.label}</span>
                                        {(index < columns.length - 1 || index === columns.length - 1) && (
                                            <div
                                                className="absolute top-1/2 flex h-8 w-5 -translate-y-1/2 cursor-col-resize items-center justify-center"
                                                style={{
                                                    right: index === columns.length - 1 ? `${finalDividerInset}px` : '-2px',
                                                }}
                                                onMouseDown={(e) => handleColumnResizeStart(index, e)}
                                            >
                                                <div
                                                    className="h-4/5 w-px opacity-50 transition-opacity hover:opacity-75"
                                                    style={{
                                                        background:
                                                            'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.4) 100%)',
                                                        boxShadow:
                                                            '1px 0 0 rgba(255, 255, 255, 0.04), -1px 0 0 rgba(0, 0, 0, 0.35)',
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        <div style={{ width: `${effectiveWidth}px`, minWidth: `${effectiveWidth}px` }}>
                            <TreeView
                                data={treeData}
                                onSelectChange={setSelectedItem}
                                onDocumentDrag={handleDrag}
                                renderItem={renderItem}
                                enableDragHandle={enableDragHandle}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { TreeView }

