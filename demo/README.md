# TreeView Demo

這是 TreeView 組件的示範應用，使用 Next.js 和 React 構建。

## 安裝依賴

```bash
pnpm install
```

## 運行開發服務器

```bash
pnpm dev
```

打開 [http://localhost:3000](http://localhost:3000) 查看示範。

## 功能

- 樹狀結構顯示
- 項目選擇
- 展開/收合文件夾
- 顯示選中項目信息

## 組件引用

這個 demo 從父目錄引用 TreeTable 組件：

```tsx
import { TreeTable, TreeTableItem } from '../components/tree-table'
```

組件實際位置在 `../components/tree-table.tsx`。

