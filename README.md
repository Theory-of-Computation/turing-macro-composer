# Turing Machine Composer

An interactive workbench for building, simulating, and visualizing Turing-machine style macro instructions using reusable blocks.

## Features

- **Block composer** – wire together canonical blocks (adder, comparer, eraser, copier, multiplier, custom macros) to prototype new machines.
- **Live simulation** – inspect per-block execution steps, highlighted transitions, and intermediate tape values.
- **Visual diagrams** – auto-generated SVG state diagrams for each block and the combined machine ensure every transition stays in view.
- **Learning aids** – curated multiplication walkthroughs, block galleries, and pseudocode toggles to make complex macros easier to understand.

## Getting started

```bash
npm install
npm run dev
```

- Development server runs at `http://localhost:5173/` with hot reload.
- Build production assets with `npm run build`.
- Run linting or tests via `npm run lint` and `npm run test`.

### Project layout

```
src/
  components/        # Shared UI pieces
  features/          # Block editor, simulations, concept demos
  pages/             # Top-level routes (Home, Exercises, Examples)
  hooks/, lib/, data # Utilities, stores, machine definitions
```

## Creating custom blocks

1. Open the **Composer** panel and add a "Custom" block.
2. Provide a short label plus pseudocode; the simulator recognises phrases such as:
   - `multiply first by second`
   - `subtract 1`
   - `write 1`
   - Conditions like `if input > 0` or `if input is zero`
3. Wire the block alongside canonical components, then run a simulation to verify outputs and highlighted branches.

## Contributing

- Use conventional commits (e.g., `feat:`, `fix:`).
- Run `npm run lint` before opening pull requests.
- Add visual regression notes or screenshots when tweaking diagrams.

## License

MIT © 2025 Mahdi Kheibari
