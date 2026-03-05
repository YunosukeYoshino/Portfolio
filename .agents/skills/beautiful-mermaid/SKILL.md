---
name: beautiful-mermaid
description: >
  Mermaid記法でSVGダイアグラムを生成し、READMEやMarkdownに埋め込む。3モード:
  `render`（既存Mermaidコード→テーマ付きSVG）、`generate`（コードベース分析→自動生成）、`create`（自然言語→ダイアグラム）。トリガー:
  「Mermaid」「マーメイド」「Mermaidで図を作って」「フローチャート」「可視化」「アーキテクチャ図」「シーケンス図」「ER図」「クラス図」「状態遷移図」。draw.io形式が指定された場合はdrawio-diagram-forgeスキルを使用すること（このスキルはMermaid記法専用）。
  or architecture that would benefit from visual representation.
---

# Beautiful Mermaid

Render Mermaid diagrams as beautifully themed SVG files using the `beautiful-mermaid` library.
Output is optimized for embedding in README.md and other Markdown documents.

## Language

Mermaid diagram内のノードラベル、エッジラベル、サブグラフタイトルは全て日本語で記述する。
ユーザーへの説明やMarkdown埋め込みスニペットのalt textも日本語で書く。

例:
- Node: `A[ユーザー入力]` (not `A[User Input]`)
- Edge: `A -->|認証成功| B` (not `A -->|Auth Success| B`)
- Subgraph: `subgraph auth["認証フロー"]` (ASCII ID + Japanese label)
- Alt text: `![ユーザー登録フロー](docs/diagrams/user-registration.svg)`

技術用語（API, DB, HTTP, gRPC等）はそのまま使って良い。

## Prerequisites

The project must have `beautiful-mermaid` installed:

```bash
npm install beautiful-mermaid
# or
bun add beautiful-mermaid
```

If not installed, install it before proceeding.

## Modes

This skill operates in three modes, selected by argument:

| Mode | Argument | Description |
|------|----------|-------------|
| **Render** | `render` | Take existing Mermaid code and render it as a themed SVG |
| **Generate** | `generate` | Analyze codebase and auto-generate architecture diagrams |
| **Create** | `create` | Convert natural language description into a Mermaid diagram |

If no argument is given, ask the user which mode they want, or infer from context.

---

## Mode: Render

Take existing Mermaid source code and produce a themed SVG file.

### Steps

1. Get the Mermaid source from the user (inline, file path, or clipboard)
2. Ask for theme preference if not specified (default: `github-light`)
3. Generate and execute a render script
4. Save SVG to the project and provide the Markdown embed snippet

### Render Script Template

Create a temporary script at the project root and run it with `bun`:

```typescript
import { renderMermaidSVG, THEMES } from 'beautiful-mermaid'
import { writeFileSync } from 'fs'

const source = `
<MERMAID_SOURCE_HERE>
`

const theme = THEMES['<THEME_NAME>'] // or custom { bg, fg } object
const svg = renderMermaidSVG(source.trim(), {
  ...theme,
  padding: 40,
  font: 'Noto Sans JP',
})

writeFileSync('<OUTPUT_PATH>', svg)
console.log('SVG saved to <OUTPUT_PATH>')
```

Run with bun (required — the package exports raw .ts files):
```bash
bun run render-mermaid.tmp.ts && rm render-mermaid.tmp.ts
```

### Output

- Save SVG to `docs/diagrams/<name>.svg` (create directory if needed)
- Print the Markdown embed snippet:
  ```markdown
  ![<diagram description>](docs/diagrams/<name>.svg)
  ```

---

## Mode: Generate

Analyze the codebase and automatically generate architecture or flow diagrams.

### Steps

1. Identify what to visualize. Ask if unclear. Common targets:
   - **Directory structure** - module dependency graph
   - **API flow** - request lifecycle through middleware/handlers
   - **Data model** - ER diagram from schema definitions
   - **State machine** - state transitions from state management code
   - **Class hierarchy** - inheritance and composition relationships
   - **Component tree** - React/Vue component hierarchy

2. Read relevant source files to understand the structure

3. Compose Mermaid source code that accurately represents the codebase:
   - Use `graph TD/LR` for architecture and flow diagrams
   - Use `erDiagram` for data models
   - Use `classDiagram` for class hierarchies
   - Use `sequenceDiagram` for request/response flows
   - Use `stateDiagram-v2` for state machines

4. Render using the same approach as Render mode

5. Save and provide the embed snippet

### Diagram Design Principles

When generating diagrams from code analysis:

- Keep node count manageable (under 20 nodes per diagram). Split into multiple diagrams if the system is complex.
- Use meaningful, concise labels derived from actual code names
- Show the most important relationships, not every possible connection
- Add edge labels to clarify the nature of connections (e.g., "HTTP", "gRPC", "imports")

### Layout Constraints (IMPORTANT)

beautiful-mermaid uses the ELK layout engine. Complex graph structures cause layout breakage.
Follow these rules to ensure clean rendering:

**Flat flow preferred over subgraphs:**
- Use a flat linear flow (`A --> B --> C`) rather than nesting everything in subgraphs
- Subgraphs are fine for simple grouping, but avoid edges between subgraphs (`subgraph1 --> subgraph2`) as ELK misaligns them
- If using subgraphs, keep to 1-2 levels max, with edges only between nodes inside them

**Node count limits:**
- Flat flow: up to 20 nodes works well
- With subgraphs: keep under 15 nodes total
- If more nodes are needed, split into multiple separate diagrams

**Avoid special characters in labels:**
- Do not use `%`, `+`, `&`, `<`, `>` in node or edge labels — they cause rendering artifacts
- Use Japanese equivalents instead: `80%以上` -> `80以上`, `A+B` -> `AとB`
- Parentheses `()` in labels are OK

**Subgraph IDs must be ASCII:**
- Use ASCII IDs with Japanese display labels: `subgraph auth["認証フロー"]`
- Do not use Japanese characters in subgraph IDs: ~~`subgraph 認証フロー`~~

**Font:**
- Always use `Noto Sans JP` for Japanese text support (not `Inter`)
- Inter does not include CJK glyphs and causes misalignment

### Mermaid Syntax Reference (Supported by beautiful-mermaid)

**Flowchart shapes:**
```
A[Rectangle]  B(Rounded)  C{Diamond}  D([Stadium])
E((Circle))  F[[Subroutine]]  G(((Double Circle)))
H{{Hexagon}}  I[(Database)]  J>Flag]
K[/Trapezoid\]  L[\Inverse/]
```

**Edge types:**
```
A --> B        solid arrow
A --- B        solid line (no arrow)
A -.-> B       dotted arrow
A ==> B        thick arrow
A --text--> B  labeled edge
A <--> B       bidirectional
```

**Directions:** `TD` (top-down), `LR` (left-right), `BT` (bottom-top), `RL` (right-left)

---

## Mode: Create

Convert a natural language description into a Mermaid diagram.

### Steps

1. Understand what the user wants to visualize from their description
2. Select the most appropriate diagram type:
   - **Flowchart** for processes, workflows, decision trees
   - **Sequence** for time-ordered interactions between actors
   - **Class** for OOP structures, interfaces, relationships
   - **ER** for database schemas, entity relationships
   - **State** for state machines, lifecycle flows
3. Write clean Mermaid source that captures the description
4. Render and save using the same approach as Render mode
5. Show the Mermaid source to the user so they can iterate

---

## Theme Reference

### Built-in Themes (15 total)

| Theme | Type | Best For |
|-------|------|----------|
| `github-light` | Light | Light-mode README |
| `github-dark` | Dark | Dark-mode README |
| `tokyo-night` | Dark | Developer-focused docs |
| `catppuccin-mocha` | Dark | Modern dark aesthetic |
| `catppuccin-latte` | Light | Soft light aesthetic |
| `nord` | Dark | Scandinavian minimal |
| `nord-light` | Light | Clean documentation |
| `dracula` | Dark | High contrast |
| `zinc-light` | Light | Minimal, no accent |
| `zinc-dark` | Dark | Minimal, no accent |
| `solarized-light` | Light | Warm documentation |
| `solarized-dark` | Dark | Warm dark docs |
| `one-dark` | Dark | Atom-style |
| `tokyo-night-storm` | Dark | Deeper Tokyo Night |
| `tokyo-night-light` | Light | Light Tokyo variant |

### Custom Themes

For custom colors, pass a `DiagramColors` object instead of a theme name:

```typescript
const svg = renderMermaidSVG(source, {
  bg: '#0f0f0f',
  fg: '#e0e0e0',
  accent: '#ff6b6b',  // arrows, highlights
  muted: '#666666',   // secondary text
})
```

### Theme Selection Logic

- Default: `github-light` (white background, clean and readable)
- Dark mode README: use `github-dark`
- Technical docs: use `nord-light` or `catppuccin-latte`
- If the user explicitly requests dark theme: use `github-dark` or `tokyo-night`
- For transparent backgrounds (works on any theme): add `transparent: true`

---

## Render Options

| Option | Default | Description |
|--------|---------|-------------|
| `padding` | `40` | Canvas padding in px |
| `nodeSpacing` | `24` | Horizontal spacing between nodes |
| `layerSpacing` | `40` | Vertical spacing between layers |
| `font` | `Noto Sans JP` | Font family (CJK support required) |
| `transparent` | `false` | Transparent background |

---

## Output Convention

- Directory: `docs/diagrams/` (relative to project root)
- Naming: `<descriptive-name>.svg` (kebab-case)
- Always provide the Markdown embed snippet after generating

### For GitHub README Compatibility

GitHub renders SVG files referenced in Markdown. The generated SVGs are self-contained
(fonts imported via Google Fonts URL in the SVG style block) and render correctly on GitHub.

If the user needs the diagram inline in a README that's already being edited,
insert the image reference at the appropriate location.

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|---------|
| `Cannot find module 'beautiful-mermaid'` | Not installed | Run `npm install beautiful-mermaid` |
| SVG appears blank | Invalid Mermaid syntax | Validate syntax before rendering |
| Fonts not rendering on GitHub | Expected behavior | GitHub sanitizes font imports; layout is preserved |
| `bun` not found | bun not installed | See https://bun.sh for installation instructions |

---

## Examples

**Render existing code:**
```
/beautiful-mermaid render

graph TD
  A[User Request] --> B[API Gateway]
  B --> C{Auth?}
  C -->|Yes| D[Service]
  C -->|No| E[401 Error]
```

**Generate from codebase:**
```
/beautiful-mermaid generate
src/ディレクトリのモジュール依存関係を可視化して
```

**Create from description:**
```
/beautiful-mermaid create
ユーザーがログインしてからダッシュボードを表示するまでのフローを作って
```
