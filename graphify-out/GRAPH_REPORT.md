# Graph Report - cuewise-fe  (2026-10-27)

## Corpus Check
- 14 files · ~2,049 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 1, .ico 1, .css 1)

## Summary
- 131 nodes · 143 edges · 12 communities (10 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `283efca0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- package.json
- dialog.tsx
- components.json
- layout.tsx
- card.tsx
- dependencies
- devDependencies
- tailwind
- scripts
- README.md
- AGENTS.md

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `tailwind` - 6 edges
3. `aliases` - 6 edges
4. `cn` - 6 edges
5. `scripts` - 5 edges
6. `react` - 5 edges
7. `Button()` - 5 edges
8. `next` - 4 edges
9. `DialogContent()` - 4 edges
10. `radix-ui` - 3 edges

## Surprising Connections (you probably didn't know these)
- `DialogFooter()` --calls--> `Button()`  [EXTRACTED]
  src/components/ui/dialog.tsx → src/components/ui/button.tsx
- `DialogContent()` --calls--> `Button()`  [EXTRACTED]
  src/components/ui/dialog.tsx → src/components/ui/button.tsx

## Import Cycles
- None detected.

## Communities (12 total, 2 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (15): eslintConfig, name, private, version, eslint, eslint-config-next, react-dom, shadcn (+7 more)

### Community 2 - "dialog.tsx"
Cohesion: 0.17
Nodes (9): class-variance-authority, lucide-react, radix-ui, Button(), buttonVariants, DialogContent(), DialogFooter(), DialogOverlay() (+1 more)

### Community 3 - "components.json"
Cohesion: 0.12
Nodes (15): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+7 more)

### Community 4 - "layout.tsx"
Cohesion: 0.15
Nodes (8): nextConfig, next, src_app_globals, geistMono, geistSans, inter, metadata, src_lib_utils_cn

### Community 6 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, class-variance-authority, cn, lucide-react, next, radix-ui, react, react-dom (+2 more)

### Community 7 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+1 more)

### Community 8 - "tailwind"
Cohesion: 0.33
Nodes (6): tailwind, baseColor, config, css, cssVariables, prefix

### Community 9 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **79 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+74 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 98 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn` connect `card.tsx` to `package.json`, `dialog.tsx`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `next` connect `layout.tsx` to `package.json`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _79 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `components.json` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._