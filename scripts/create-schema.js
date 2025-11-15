const fs = require("fs");
const path = require("path");

// Read tree-view.tsx (base component)
const treeViewPath = path.join(__dirname, "../src/tree-view.tsx");
const treeViewContent = fs.readFileSync(treeViewPath, "utf8");

// Read tree-table.tsx (enhanced component)
const treeTablePath = path.join(__dirname, "../src/tree-table.tsx");
const treeTableContent = fs.readFileSync(treeTablePath, "utf8");

// Read utils.ts
const utilsPath = path.join(__dirname, "../src/lib/utils.ts");
const utilsContent = fs.readFileSync(utilsPath, "utf8");

const schema = {
  name: "tree-table",
  type: "registry:block",
  dependencies: [
    '@radix-ui/react-accordion',
    'class-variance-authority',
    'lucide-react',
    'clsx',
    'tailwind-merge'
  ],
  devDependencies: [],
  registryDependencies: [],
  files: [
    {
      path: "components/ui/tree-view.tsx",
      type: "registry:block",
      content: treeViewContent,
    },
    {
      path: "components/ui/tree-table.tsx",
      type: "registry:block",
      content: treeTableContent,
    },
    {
      path: "lib/utils.ts",
      type: "registry:lib",
      content: utilsContent,
    },
  ],
  tailwind: {
    config: {
      theme: {
        extend: {
          keyframes: {
            'accordion-down': {
              from: { height: '0' },
              to: { height: 'var(--radix-accordion-content-height)' },
            },
            'accordion-up': {
              from: { height: 'var(--radix-accordion-content-height)' },
              to: { height: '0' },
            },
          },
          animation: {
            'accordion-down': 'accordion-down 0.2s ease-out',
            'accordion-up': 'accordion-up 0.2s ease-out',
          },
        },
      },
    },
  },
  cssVars: {},
  meta: {
    title: "Tree Table",
    description: "A tree table component with resizable columns and Notion-style design",
    importSpecifier: "TreeTable",
    moduleSpecifier: "@/components/ui/tree-table",
  },
};

fs.writeFileSync(
  path.join(__dirname, "../schema.json"),
  JSON.stringify(schema, null, 2)
);
console.log("schema.json created!");
